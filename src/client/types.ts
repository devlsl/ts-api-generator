import { Either } from '@sweet-monads/either';

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

export type ApiCallReturn<Error, Data> = Either<Error | 'NotLogicError', Data>;
