import { isEither, left, right } from '@sweet-monads/either';
import { ActionOptionsMap } from '../types';
import { ApiClientOptions, CallFn } from './types';
import { invokeWithRefreshing } from './utils';

export const createApiClient =
    <const Schema extends ActionOptionsMap>(
        options: ApiClientOptions<Schema>,
    ) =>
    <ActionName extends keyof Schema>(
        actionName: ActionName,
        refreshCredentialsIfUnauthorized: boolean = true,
    ) => ({
        call: (async (payload: unknown) => {
            const actionSchema = options.schema[actionName];

            const response = await invokeWithRefreshing(
                options.apiOrigin,
                actionName as string,
                actionSchema,
                payload,
                options.refreshActionName as string,
                refreshCredentialsIfUnauthorized,
            );
            if (!isEither(response)) {
                options.onError('network');
                return left('NotLogicError');
            }
            if (response.isRight()) return right(response.value);
            if (response.value === 'Unauthorized') {
                options.onError('unauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'RequiredUnauthorized') {
                options.onError('requiredUnauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'NetworkError') {
                options.onError('network');
                return left('NotLogicError');
            }

            return left(response.value);
        }) as CallFn<Schema[ActionName]>,
    });
