import { useState } from 'react';
import { ActionOptionsMap } from '../types';
import {
    ActionReturnData,
    ApiClientOptions,
    ApiFetchState,
    CallFn,
} from './types';
import { isEither, left, right } from '@sweet-monads/either';
import { invokeWithRefreshing } from './utils';

export const createReactUseApi =
    <Schema extends ActionOptionsMap>(options: ApiClientOptions<Schema>) =>
    <
        ActionName extends keyof Schema,
        Data = ActionReturnData<Schema[ActionName]>,
    >(
        actionName: ActionName,
        refreshCredentialsIfUnauthorized: boolean = true,
    ) => {
        const actionSchema = options.schema[actionName];
        const [fetchState, setFetchState] = useState<
            ApiFetchState<
                Schema[ActionName]['errors'] extends readonly string[]
                    ? Schema[ActionName]['errors'][number]
                    : undefined,
                Data
            >
        >({ status: 'idle', data: null, error: null, cash: null });

        const call = (async (payload: unknown) => {
            setFetchState((prev) => ({
                status: 'loading',
                data: null,
                error: null,
                cash: prev.cash,
            }));
            const response = await invokeWithRefreshing(
                options.apiOrigin,
                actionName as string,
                actionSchema,
                payload,
                options.refreshActionName as string,
                refreshCredentialsIfUnauthorized,
            );
            if (!isEither(response)) {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                options.onError('network');
                return left('NotLogicError');
            }
            if (response.isRight()) {
                setFetchState({
                    status: 'success',
                    data: response.value as Data,
                    error: null,
                    cash: response.value as Data,
                });
                return right(response.value);
            }
            if (response.value === 'Unauthorized') {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                options.onError('unauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'RequiredUnauthorized') {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                options.onError('requiredUnauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'NetworkError') {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                options.onError('network');
                return left('NotLogicError');
            }

            setFetchState({
                status: 'error',
                data: null,
                // @ts-expect-error
                error: response.value,
                cash: null,
            });
            return left(response.value);
        }) as CallFn<Schema[ActionName]>;

        return {
            ...fetchState,
            call,
        };
    };
