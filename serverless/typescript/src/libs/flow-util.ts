import axios from 'axios';

const getUrl = (domain: string, type: RequestType) => {
  const uri = type === 'BLOCK' ? 'blocks' : 'events';

  return `${domain}${uri}`;
};

const getEventUrl = (config: FlowConfig) =>
  `${getUrl(config.domain, 'EVENT')}?type=${config.contractAddress}.PayItForward.PayItForwardEvent`;

const getEvent = async (config: FlowConfig, startHeight: number, endHeight: number) => {
  const url = `${getEventUrl(config)}&${new URLSearchParams({
    start_height: startHeight.toString(),
    end_height: endHeight.toString(),
  })}`;
  try {
    const res = await axios.get(url);
    const data = res.data as BlockEvent[];

    return data;
  } catch (error) {
    console.log(`Error! code: ${error.response.status}, message: ${error.message}`);

    return undefined;
  }
};

export const getEvents = async (config: FlowConfig, startHeight: number) => {
  let isSuccess = true;
  let data: BlockEvent[] = [];
  while (isSuccess) {
    console.log(`start: ${startHeight} end: ${startHeight + config.readBlockStep}`);
    // eslint-disable-next-line no-await-in-loop
    const value = await getEvent(config, startHeight, startHeight + config.readBlockStep);
    if (value) {
      startHeight += config.readBlockStep + 1;
      data = data.concat(value);
    } else {
      isSuccess = !isSuccess;
    }
  }

  // 最後に成功した取得の開始地点を保存する
  return { eventData: data, position: startHeight - config.readBlockStep - 1 };
};

const parseCadenceType = (valueType: CadenceValueType): unknown => {
  if (valueType.type === 'UInt64') {
    return parseInt(valueType.value as string, 10);
  }
  if (valueType.type === 'UFix64') {
    return parseFloat(valueType.value as string);
  }
  if (valueType.type === 'Array') {
    return (valueType.value as CadenceValueType[]).map((v: CadenceValueType) =>
      parseCadenceType(v),
    );
  }

  return valueType.value;
};

const parsePayload = <T>(payload: string) => {
  const decoded: EventPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
  const data = {};
  decoded.value.fields.forEach((field) => {
    data[field.name] = parseCadenceType(field.value);
  });

  return data as T;
};

export const parseEventData = <T>(eventData: BlockEvent[]) => {
  const data: DynamoFlowEvent<T>[] = [];
  eventData.forEach((blockEvent) => {
    blockEvent.events.forEach((flowEvent) => {
      const payload = parsePayload<T>(flowEvent.payload);
      data.push({
        blockId: blockEvent.block_id,
        blockHeight: blockEvent.block_height,
        blockTimestamp: blockEvent.block_timestamp,
        transactionId: flowEvent.transaction_id,
        eventType: flowEvent.type,
        ...payload,
      });
    });
  });

  return data;
};
