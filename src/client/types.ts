import { ActionOptions } from './../types';
import { Either } from '@sweet-monads/either';
import { ActionOptionsMap } from '../types';

export type ApiFetchState<Error, Data> =
    | {
          status: 'idle';
          error: null;
          data: null;
          cash: null;
      }
    | {
          status: 'loading';
          error: null;
          data: null;
          cash: Data | null;
      }
    | {
          status: 'error';
          error: Error | 'NotLogicError';
          data: null;
          cash: Data | null;
      }
    | {
          status: 'success';
          error: null;
          data: Data;
          cash: Data;
      };

export type ActionReturnData<Options extends ActionOptions> =
    undefined extends Options['return']
        ? undefined
        : // @ts-expect-error
          z.infer<Schema[ActionName]['return']!>;

export type CallFn<
    Options extends ActionOptions,
    Return = Promise<
        Either<
            Options['errors'] extends readonly string[]
                ? Options['errors'][number]
                : undefined | 'NotLogicError',
            ActionReturnData<Options>
        >
    >,
> = undefined extends Options['payload']
    ? () => Return
    : (
          // @ts-expect-error
          payload: z.infer<Schema[ActionName]['payload']!>,
      ) => Return;

export type ApiClientOptions<Schema extends ActionOptionsMap> = {
    apiOrigin: string;
    schema: Schema;
    refreshActionName: keyof Schema;
    onError: (
        type: 'unauthorized' | 'requiredUnauthorized' | 'network',
    ) => void;
};
