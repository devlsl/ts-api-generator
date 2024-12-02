import { ActionOptions } from './../types';
import { Either } from '@sweet-monads/either';
import { ActionOptionsMap } from '../types';
import { z } from 'zod';

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
          z.infer<Options['return']!>;

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
          payload: z.infer<Options['payload']!>,
      ) => Return;

export type ApiClientOptions<Schema extends ActionOptionsMap> = {
    apiOrigin: string;
    schema: Schema;
    refreshActionName: keyof Schema;
    onError: (
        type: 'unauthorized' | 'requiredUnauthorized' | 'network',
    ) => void;
};

export type SchemaMapType<
    SchemaMap extends Record<string, z.ZodTypeAny | undefined>,
> = {
    [Key in keyof SchemaMap]: undefined extends SchemaMap[Key]
        ? undefined
        : // @ts-expect-error
          z.infer<SchemaMap[Key]>;
};
