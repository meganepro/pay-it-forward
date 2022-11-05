/* eslint-disable no-nested-ternary */
import axios from 'axios';

if (process.env.STAGE === 'dev') {
  axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
}

const apiConfig = {
  domain: process.env.ApiDomain,
};
const getActivityUrl = (config: typeof apiConfig) => `${config.domain}activity`;

export const getActivity = async (addresses: string[]) => {
  console.log(process.env.STAGE);

  const url = `${getActivityUrl(apiConfig)}?${new URLSearchParams({
    addresses: addresses.join(','),
  })}`;
  try {
    const res = await axios.get(url);
    const data = res.data as ActivityApiResult[];

    return data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response) {
      console.log(`Error! code: ${error.response.status}, message: ${error.message}`);
    }

    return undefined;
  }
};
