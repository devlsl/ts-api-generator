import { Either } from '@sweet-monads/either';
import { ActionOptions, ActionOptionsMap } from '../types';
import { z } from 'zod';

export type ClientActionType<Options extends ActionOptions> =
    undefined extends Options['payload']
        ? undefined extends Options['return']
            ? undefined extends Options['errors']
                ? Options['roles'] extends false
                    ? () => Promise<
                          Either<
                              'NetworkError' | 'RequiredUnauthorized' | void,
                              void
                          >
                      >
                    : undefined extends Options['roles']
                      ? () => Promise<Either<'NetworkError' | void, void>>
                      : () => Promise<
                            Either<'NetworkError' | 'Unauthorized' | void, void>
                        >
                : Options['roles'] extends false
                  ? () => Promise<
                        Either<
                            | 'NetworkError'
                            // @ts-expect-error
                            | Options['errors'][number]
                            | void,
                            void
                        >
                    >
                  : undefined extends Options['roles']
                    ? () => Promise<
                          Either<
                              | 'NetworkError'
                              // @ts-expect-error
                              | Options['errors'][number]
                              | void,
                              void
                          >
                      >
                    : () => Promise<
                          Either<
                              | 'NetworkError'
                              // @ts-expect-error
                              | Options['errors'][number]
                              | 'Unauthorized'
                              | void,
                              void
                          >
                      >
            : undefined extends Options['errors']
              ? Options['roles'] extends false
                  ? () => Promise<
                        Either<
                            'NetworkError' | 'RequiredUnauthorized',
                            // @ts-expect-error
                            z.infer<Options['return']>
                        >
                    >
                  : undefined extends Options['roles']
                    ? () => Promise<
                          Either<
                              'NetworkError',
                              // @ts-expect-error
                              z.infer<Options['return']>
                          >
                      >
                    : () => Promise<
                          Either<
                              'NetworkError' | 'Unauthorized',
                              // @ts-expect-error
                              z.infer<Options['return']>
                          >
                      >
              : Options['roles'] extends false
                ? () => Promise<
                      Either<
                          | 'NetworkError'
                          // @ts-expect-error
                          | Options['errors'][number]
                          | 'RequiredUnauthorized',
                          // @ts-expect-error
                          z.infer<Options['return']>
                      >
                  >
                : undefined extends Options['roles']
                  ? () => Promise<
                        Either<
                            | 'NetworkError'
                            // @ts-expect-error
                            | Options['errors'][number],
                            // @ts-expect-error
                            z.infer<Options['return']>
                        >
                    >
                  : () => Promise<
                        Either<
                            | 'NetworkError'
                            // @ts-expect-error
                            | Options['errors'][number]
                            | 'Unauthorized',
                            // @ts-expect-error
                            z.infer<Options['return']>
                        >
                    >
        : undefined extends Options['return']
          ? undefined extends Options['errors']
              ? Options['roles'] extends false
                  ? (
                        // @ts-expect-error
                        payload: z.infer<Options['payload']!>,
                    ) => Promise<
                        Either<
                            'NetworkError' | 'RequiredUnauthorized' | void,
                            void
                        >
                    >
                  : undefined extends Options['roles']
                    ? (
                          // @ts-expect-error
                          payload: z.infer<Options['payload']!>,
                      ) => Promise<Either<'NetworkError' | void, void>>
                    : (
                          // @ts-expect-error
                          payload: z.infer<Options['payload']!>,
                      ) => Promise<
                          Either<'NetworkError' | 'Unauthorized' | void, void>
                      >
              : Options['roles'] extends false
                ? (
                      // @ts-expect-error
                      payload: z.infer<Options['payload']!>,
                  ) => Promise<
                      Either<
                          | 'NetworkError'
                          // @ts-expect-error
                          | Options['errors'][number]
                          | 'RequiredUnauthorized'
                          | void,
                          void
                      >
                  >
                : undefined extends Options['roles']
                  ? (
                        // @ts-expect-error
                        payload: z.infer<Options['payload']!>,
                    ) => Promise<
                        Either<
                            | 'NetworkError'
                            // @ts-expect-error
                            | Options['errors'][number]
                            | void,
                            void
                        >
                    >
                  : (
                        // @ts-expect-error
                        payload: z.infer<Options['payload']!>,
                    ) => Promise<
                        Either<
                            | 'NetworkError'
                            // @ts-expect-error
                            | Options['errors'][number]
                            | 'Unauthorized'
                            | void,
                            void
                        >
                    >
          : undefined extends Options['errors']
            ? Options['roles'] extends false
                ? (
                      // @ts-expect-error
                      payload: z.infer<Options['payload']!>,
                  ) => Promise<
                      Either<
                          'NetworkError' | 'RequiredUnauthorized',
                          // @ts-expect-error
                          z.infer<Options['return']>
                      >
                  >
                : undefined extends Options['roles']
                  ? (
                        // @ts-expect-error
                        payload: z.infer<Options['payload']!>,
                    ) => Promise<
                        Either<
                            'NetworkError',
                            // @ts-expect-error
                            z.infer<Options['return']>
                        >
                    >
                  : (
                        // @ts-expect-error
                        payload: z.infer<Options['payload']!>,
                    ) => Promise<
                        Either<
                            'NetworkError' | 'Unauthorized',
                            // @ts-expect-error
                            z.infer<Options['return']>
                        >
                    >
            : Options['roles'] extends false
              ? (
                    // @ts-expect-error
                    payload: z.infer<Options['payload']!>,
                ) => Promise<
                    Either<
                        | 'NetworkError'
                        // @ts-expect-error
                        | Options['errors'][number]
                        | 'RequiredUnauthorized',
                        // @ts-expect-error
                        z.infer<Options['return']>
                    >
                >
              : undefined extends Options['roles']
                ? (
                      // @ts-expect-error
                      payload: z.infer<Options['payload']!>,
                  ) => Promise<
                      Either<
                          | 'NetworkError'
                          // @ts-expect-error
                          | Options['errors'][number],
                          // @ts-expect-error
                          z.infer<Options['return']>
                      >
                  >
                : (
                      // @ts-expect-error
                      payload: z.infer<Options['payload']!>,
                  ) => Promise<
                      Either<
                          | 'NetworkError'
                          // @ts-expect-error
                          | Options['errors'][number]
                          | 'Unauthorized',
                          // @ts-expect-error
                          z.infer<Options['return']>
                      >
                  >;

export type ClientTypeGenerator<Config extends ActionOptionsMap> = {
    [ActionName in keyof Config]: ClientActionType<Config[ActionName]>;
};
