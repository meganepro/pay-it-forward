import * as fcl from '@onflow/fcl';
// import * as t from '@onflow/types';

export default class FclUtils {
  static isExpired = (tx: fcl.TransactionObject): boolean => tx.status === 5;

  static isSealed = (tx: fcl.TransactionObject): boolean => tx.status >= 4;

  static isExecuted = (tx: fcl.TransactionObject): boolean => tx.status >= 3;

  static isFinalized = (tx: fcl.TransactionObject): boolean => tx.status >= 2;

  static isPending = (tx: fcl.TransactionObject): boolean => tx.status >= 1;

  static isUnknown = (tx: fcl.TransactionObject): boolean => tx.status >= 0;

  static type = (label: string, asArgument: any, asInjection: any) => ({
    label,
    asArgument,
    asInjection,
  });

  static isString = (d: unknown): boolean => typeof d === 'string';

  static throwTypeError = (msg: string) => {
    throw new Error(`Type Error: ${msg}`);
  };

  static String: fcl.FType['String'] = FclUtils.type(
    'String',
    (v: unknown): { type: string; value: unknown } | undefined => {
      if (!FclUtils.isString(v)) {
        FclUtils.throwTypeError('Expected String for type String');
      }

      return {
        type: 'String',
        value: v,
      };
    },
    (v: unknown) => v,
  );

  static Address: fcl.FType['Address'] = FclUtils.type(
    'Address',
    (v: unknown): { type: string; value: unknown } | undefined => {
      if (!FclUtils.isString(v)) {
        FclUtils.throwTypeError('Expected Address for type Address');
      }

      return {
        type: 'Address',
        value: v,
      };
    },
    (v: unknown) => v,
  );
}
