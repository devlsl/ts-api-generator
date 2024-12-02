import { IncomingMessage, ServerResponse } from 'http';
import { ActionOptionsMap } from './types';
import { ActionError } from './ActionError';
import { z } from 'zod';

export type HandlersTypeGenerator<Config extends ActionOptionsMap> = {
    [ActionName in keyof Config]: undefined extends Config[ActionName]['payload']
        ? Config[ActionName]['lowLevel'] extends true
            ? undefined extends Config[ActionName]['return']
                ? undefined extends Config[ActionName]['errors']
                    ? Config[ActionName]['roles'] extends readonly string[]
                        ? (
                              context: {
                                  id: string;
                                  role: Config[ActionName]['roles'][number];
                              },
                              request: IncomingMessage,
                              response: ServerResponse,
                          ) => Promise<void>
                        : Config[ActionName]['roles'] extends true
                          ? (
                                context: { id: string; role: string },
                                request: IncomingMessage,
                                response: ServerResponse,
                            ) => Promise<void>
                          : (
                                request: IncomingMessage,
                                response: ServerResponse,
                            ) => Promise<void>
                    : Config[ActionName]['roles'] extends readonly string[]
                      ? (
                            context: {
                                id: string;
                                role: Config[ActionName]['roles'][number];
                            },
                            request: IncomingMessage,
                            response: ServerResponse,
                        ) => Promise<ActionError<
                            // @ts-expect-error
                            Config[ActionName]['errors'][number]
                        > | void>
                      : Config[ActionName]['roles'] extends true
                        ? (
                              context: { id: string; role: string },
                              request: IncomingMessage,
                              response: ServerResponse,
                          ) => Promise<ActionError<
                              // @ts-expect-error
                              Config[ActionName]['errors'][number]
                          > | void>
                        : (
                              request: IncomingMessage,
                              response: ServerResponse,
                          ) => Promise<ActionError<
                              // @ts-expect-error
                              Config[ActionName]['errors'][number]
                          > | void>
                : undefined extends Config[ActionName]['errors']
                  ? Config[ActionName]['roles'] extends readonly string[]
                      ? (
                            context: {
                                id: string;
                                role: Config[ActionName]['roles'][number];
                            },
                            request: IncomingMessage,
                            response: ServerResponse,
                            // @ts-expect-error
                        ) => Promise<z.infer<Config[ActionName]['return']>>
                      : Config[ActionName]['roles'] extends true
                        ? (
                              context: { id: string; role: string },
                              request: IncomingMessage,
                              response: ServerResponse,
                              // @ts-expect-error
                          ) => Promise<z.infer<Config[ActionName]['return']>>
                        : (
                              request: IncomingMessage,
                              response: ServerResponse,
                              // @ts-expect-error
                          ) => Promise<z.infer<Config[ActionName]['return']>>
                  : Config[ActionName]['roles'] extends readonly string[]
                    ? (
                          context: {
                              id: string;
                              role: Config[ActionName]['roles'][number];
                          },
                          request: IncomingMessage,
                          response: ServerResponse,
                      ) => Promise<
                          // @ts-expect-error
                          | ActionError<Config[ActionName]['errors'][number]>
                          // @ts-expect-error
                          | z.infer<Config[ActionName]['return']>
                      >
                    : Config[ActionName]['roles'] extends true
                      ? (
                            context: { id: string; role: string },
                            request: IncomingMessage,
                            response: ServerResponse,
                        ) => Promise<
                            // @ts-expect-error
                            | ActionError<Config[ActionName]['errors'][number]>
                            // @ts-expect-error
                            | z.infer<Config[ActionName]['return']>
                        >
                      : (
                            request: IncomingMessage,
                            response: ServerResponse,
                        ) => Promise<
                            // @ts-expect-error
                            | ActionError<Config[ActionName]['errors'][number]>
                            // @ts-expect-error
                            | z.infer<Config[ActionName]['return']>
                        >
            : undefined extends Config[ActionName]['return']
              ? undefined extends Config[ActionName]['errors']
                  ? Config[ActionName]['roles'] extends readonly string[]
                      ? (context: {
                            id: string;
                            role: Config[ActionName]['roles'][number];
                        }) => Promise<void>
                      : Config[ActionName]['roles'] extends true
                        ? (context: {
                              id: string;
                              role: string;
                          }) => Promise<void>
                        : () => Promise<void>
                  : Config[ActionName]['roles'] extends readonly string[]
                    ? (context: {
                          id: string;
                          role: Config[ActionName]['roles'][number];
                      }) => Promise<ActionError<
                          // @ts-expect-error
                          Config[ActionName]['errors'][number]
                      > | void>
                    : Config[ActionName]['roles'] extends true
                      ? (context: {
                            id: string;
                            role: string;
                        }) => Promise<ActionError<
                            // @ts-expect-error
                            Config[ActionName]['errors'][number]
                        > | void>
                      : () => Promise<ActionError<
                            // @ts-expect-error
                            Config[ActionName]['errors'][number]
                        > | void>
              : undefined extends Config[ActionName]['errors']
                ? Config[ActionName]['roles'] extends readonly string[]
                    ? (context: {
                          id: string;
                          role: Config[ActionName]['roles'][number];
                          // @ts-expect-error
                      }) => Promise<z.infer<Config[ActionName]['return']>>
                    : Config[ActionName]['roles'] extends true
                      ? (context: {
                            id: string;
                            role: string;
                            // @ts-expect-error
                        }) => Promise<z.infer<Config[ActionName]['return']>>
                      : // @ts-expect-error
                        () => Promise<z.infer<Config[ActionName]['return']>>
                : Config[ActionName]['roles'] extends readonly string[]
                  ? (context: {
                        id: string;
                        role: Config[ActionName]['roles'][number];
                    }) => Promise<
                        // @ts-expect-error
                        | ActionError<Config[ActionName]['errors'][number]>
                        // @ts-expect-error
                        | z.infer<Config[ActionName]['return']>
                    >
                  : Config[ActionName]['roles'] extends true
                    ? (context: { id: string; role: string }) => Promise<
                          // @ts-expect-error
                          | ActionError<Config[ActionName]['errors'][number]>
                          // @ts-expect-error
                          | z.infer<Config[ActionName]['return']>
                      >
                    : () => Promise<
                          // @ts-expect-error
                          | ActionError<Config[ActionName]['errors'][number]>
                          // @ts-expect-error
                          | z.infer<Config[ActionName]['return']>
                      >
        : Config[ActionName]['lowLevel'] extends true
          ? undefined extends Config[ActionName]['return']
              ? undefined extends Config[ActionName]['errors']
                  ? Config[ActionName]['roles'] extends readonly string[]
                      ? (
                            context: {
                                id: string;
                                role: Config[ActionName]['roles'][number];
                            },
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                            request: IncomingMessage,
                            response: ServerResponse,
                        ) => Promise<void>
                      : Config[ActionName]['roles'] extends true
                        ? (
                              context: { id: string; role: string },
                              // @ts-expect-error
                              payload: z.infer<Config[ActionName]['payload']!>,
                              request: IncomingMessage,
                              response: ServerResponse,
                          ) => Promise<void>
                        : (
                              // @ts-expect-error
                              payload: z.infer<Config[ActionName]['payload']!>,
                              request: IncomingMessage,
                              response: ServerResponse,
                          ) => Promise<void>
                  : Config[ActionName]['roles'] extends readonly string[]
                    ? (
                          context: {
                              id: string;
                              role: Config[ActionName]['roles'][number];
                          },
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                          request: IncomingMessage,
                          response: ServerResponse,
                      ) => Promise<ActionError<
                          // @ts-expect-error
                          Config[ActionName]['errors'][number]
                      > | void>
                    : Config[ActionName]['roles'] extends true
                      ? (
                            context: { id: string; role: string },
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                            request: IncomingMessage,
                            response: ServerResponse,
                        ) => Promise<ActionError<
                            // @ts-expect-error
                            Config[ActionName]['errors'][number]
                        > | void>
                      : (
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                            request: IncomingMessage,
                            response: ServerResponse,
                        ) => Promise<ActionError<
                            // @ts-expect-error
                            Config[ActionName]['errors'][number]
                        > | void>
              : undefined extends Config[ActionName]['errors']
                ? Config[ActionName]['roles'] extends readonly string[]
                    ? (
                          context: {
                              id: string;
                              role: Config[ActionName]['roles'][number];
                          },
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                          request: IncomingMessage,
                          response: ServerResponse,
                          // @ts-expect-error
                      ) => Promise<z.infer<Config[ActionName]['return']>>
                    : Config[ActionName]['roles'] extends true
                      ? (
                            context: { id: string; role: string },
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                            request: IncomingMessage,
                            response: ServerResponse,
                            // @ts-expect-error
                        ) => Promise<z.infer<Config[ActionName]['return']>>
                      : (
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                            request: IncomingMessage,
                            response: ServerResponse,
                            // @ts-expect-error
                        ) => Promise<z.infer<Config[ActionName]['return']>>
                : Config[ActionName]['roles'] extends readonly string[]
                  ? (
                        context: {
                            id: string;
                            role: Config[ActionName]['roles'][number];
                        },
                        // @ts-expect-error
                        payload: z.infer<Config[ActionName]['payload']!>,
                        request: IncomingMessage,
                        response: ServerResponse,
                    ) => Promise<
                        // @ts-expect-error
                        | ActionError<Config[ActionName]['errors'][number]>
                        // @ts-expect-error
                        | z.infer<Config[ActionName]['return']>
                    >
                  : Config[ActionName]['roles'] extends true
                    ? (
                          context: { id: string; role: string },
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                          request: IncomingMessage,
                          response: ServerResponse,
                      ) => Promise<
                          // @ts-expect-error
                          | ActionError<Config[ActionName]['errors'][number]>
                          // @ts-expect-error
                          | z.infer<Config[ActionName]['return']>
                      >
                    : (
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                          request: IncomingMessage,
                          response: ServerResponse,
                      ) => Promise<
                          // @ts-expect-error
                          | ActionError<Config[ActionName]['errors'][number]>
                          // @ts-expect-error
                          | z.infer<Config[ActionName]['return']>
                      >
          : undefined extends Config[ActionName]['return']
            ? undefined extends Config[ActionName]['errors']
                ? Config[ActionName]['roles'] extends readonly string[]
                    ? (
                          context: {
                              id: string;
                              role: Config[ActionName]['roles'][number];
                          },
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                      ) => Promise<void>
                    : Config[ActionName]['roles'] extends true
                      ? (
                            context: { id: string; role: string },
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                        ) => Promise<void>
                      : (
                            // @ts-expect-error
                            payload: z.infer<Config[ActionName]['payload']!>,
                        ) => Promise<void>
                : Config[ActionName]['roles'] extends readonly string[]
                  ? (
                        context: {
                            id: string;
                            role: Config[ActionName]['roles'][number];
                        },
                        // @ts-expect-error
                        payload: z.infer<Config[ActionName]['payload']!>,
                    ) => Promise<ActionError<
                        // @ts-expect-error
                        Config[ActionName]['errors'][number]
                    > | void>
                  : Config[ActionName]['roles'] extends true
                    ? (
                          context: { id: string; role: string },
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                      ) => Promise<ActionError<
                          // @ts-expect-error
                          Config[ActionName]['errors'][number]
                      > | void>
                    : (
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                      ) => Promise<ActionError<
                          // @ts-expect-error
                          Config[ActionName]['errors'][number]
                      > | void>
            : undefined extends Config[ActionName]['errors']
              ? Config[ActionName]['roles'] extends readonly string[]
                  ? (
                        context: {
                            id: string;
                            role: Config[ActionName]['roles'][number];
                        },
                        // @ts-expect-error
                        payload: z.infer<Config[ActionName]['payload']!>,
                        // @ts-expect-error
                    ) => Promise<z.infer<Config[ActionName]['return']>>
                  : Config[ActionName]['roles'] extends true
                    ? (
                          context: { id: string; role: string },
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                          // @ts-expect-error
                      ) => Promise<z.infer<Config[ActionName]['return']>>
                    : (
                          // @ts-expect-error
                          payload: z.infer<Config[ActionName]['payload']!>,
                          // @ts-expect-error
                      ) => Promise<z.infer<Config[ActionName]['return']>>
              : Config[ActionName]['roles'] extends readonly string[]
                ? (
                      context: {
                          id: string;
                          role: Config[ActionName]['roles'][number];
                      },
                      // @ts-expect-error
                      payload: z.infer<Config[ActionName]['payload']!>,
                  ) => Promise<
                      // @ts-expect-error
                      | ActionError<Config[ActionName]['errors'][number]>
                      // @ts-expect-error
                      | z.infer<Config[ActionName]['return']>
                  >
                : Config[ActionName]['roles'] extends true
                  ? (
                        context: { id: string; role: string },
                        // @ts-expect-error
                        payload: z.infer<Config[ActionName]['payload']!>,
                    ) => Promise<
                        // @ts-expect-error
                        | ActionError<Config[ActionName]['errors'][number]>
                        // @ts-expect-error
                        | z.infer<Config[ActionName]['return']>
                    >
                  : (
                        // @ts-expect-error
                        payload: z.infer<Config[ActionName]['payload']!>,
                    ) => Promise<
                        // @ts-expect-error
                        | ActionError<Config[ActionName]['errors'][number]>
                        // @ts-expect-error
                        | z.infer<Config[ActionName]['return']>
                    >;
};
