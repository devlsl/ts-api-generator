import { IncomingMessage, ServerResponse } from 'http';
import { ActionOptionsMap, VerifyAccess } from './types';
import { parse } from './zodParser';
import { Either, left, right } from '@sweet-monads/either';
import { HandlersTypeGenerator } from './HandlersTypeGenerator';

export const requestHandlerBuilder = {
    bindApiSchema: <const Schema extends ActionOptionsMap>(schema: Schema) => ({
        bindHandlers: (handlers: HandlersTypeGenerator<Schema>) => {
            const actionsWithHandlers = Object.fromEntries(
                Object.entries(handlers).map(([name, handle]) => [
                    name,
                    { ...schema[name], handle },
                ]),
            );

            return {
                actionsWithHandlers,
                createDefaultHttpRequestHandler: (
                    verifyAccess: VerifyAccess,
                    clientOrigins: string[] | string,
                ) => {
                    return async (
                        request: IncomingMessage,
                        response: ServerResponse,
                    ) => {
                        response.setHeader(
                            'Access-Control-Allow-Origin',
                            clientOrigins,
                        );
                        response.setHeader(
                            'Access-Control-Allow-Methods',
                            'GET, POST, OPTIONS',
                        );
                        response.setHeader(
                            'Access-Control-Allow-Headers',
                            'Content-Type',
                        );
                        response.setHeader(
                            'Access-Control-Allow-Credentials',
                            'true',
                        );

                        if (request.method === 'OPTIONS')
                            return response.writeHead(204).end();

                        response.setHeader('Content-Type', 'application/json');

                        const readBody = () =>
                            new Promise<Either<'ReadBodyError', string>>(
                                (res) => {
                                    let body = '';
                                    request.on('data', (chunk) => {
                                        body += chunk.toString();
                                    });
                                    request.on('end', () => res(right(body)));
                                    request.on('error', () =>
                                        res(left('ReadBodyError')),
                                    );
                                },
                            );

                        const parseJson = (
                            data: string,
                        ): Either<'NotJson', any> => {
                            try {
                                return right(JSON.parse(data));
                            } catch {
                                return left('NotJson');
                            }
                        };

                        const sendJson = (data: unknown) => {
                            if (!response.headersSent) {
                                response.end(JSON.stringify(data));
                            }
                        };

                        const actionName = request.url?.slice(1) ?? undefined;
                        if (actionName === undefined)
                            return sendJson({ success: false, error: 'NoUrl' });

                        const action = actionsWithHandlers[actionName];
                        if (action === undefined)
                            return sendJson({
                                success: false,
                                error: 'UnknownAction',
                            });

                        let actionArgs: unknown[] = [];

                        if (action.roles !== undefined) {
                            const maybeAuthContext = verifyAccess(request);

                            if (
                                action.roles === false &&
                                maybeAuthContext.isRight()
                            )
                                return sendJson({
                                    success: false,
                                    error: 'RequiredUnauthorized',
                                });
                            if (action.roles === true) {
                                if (maybeAuthContext.isLeft())
                                    return sendJson({
                                        success: false,
                                        error: 'Unauthorized',
                                    });
                                actionArgs.push(maybeAuthContext.value);
                            }
                            if (
                                action.roles instanceof Array &&
                                action.roles.length > 0
                            ) {
                                if (maybeAuthContext.isLeft())
                                    return sendJson({
                                        success: false,
                                        error: 'Unauthorized',
                                    });
                                if (
                                    !action.roles.includes(
                                        maybeAuthContext.value.role,
                                    )
                                )
                                    return sendJson({
                                        success: false,
                                        error: 'Unauthorized',
                                    });
                                actionArgs.push(maybeAuthContext.value);
                            }
                        }

                        if (action.payload) {
                            const maybeBody = await readBody();
                            if (maybeBody.isLeft())
                                return sendJson({
                                    success: false,
                                    error: 'BodyReadError',
                                });
                            const body = maybeBody.value;
                            const maybeJsonBody = parseJson(body);
                            if (maybeJsonBody.isLeft())
                                return sendJson({
                                    success: false,
                                    error: 'NotJsonBody',
                                });
                            const maybePayload = parse(
                                action.payload,
                                maybeJsonBody.value,
                            );
                            if (maybePayload.isLeft())
                                return sendJson({
                                    success: false,
                                    error: 'PayloadDoesNotMatchTheSchema',
                                });
                            const payload = maybePayload.value;
                            actionArgs.push(payload);
                        }

                        if (action.lowLevel) actionArgs.push(request, response);

                        try {
                            const result = await action.handle(...actionArgs);
                            if (result instanceof Error)
                                return sendJson({
                                    success: false,
                                    error: result.name,
                                });
                            return sendJson({ success: true, data: result });
                        } catch (error) {
                            console.log(error);
                            return sendJson({
                                success: false,
                                error: 'ServerError',
                            });
                        }
                    };
                },
            };
        },
    }),
};
