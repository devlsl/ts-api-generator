import { useState } from 'react';
import { ActionOptionsMap } from '../types';
import { ApiCallReturn, ApiFetchState } from './types';
import { isEither, left, right } from '@sweet-monads/either';
import { invokeWithRefreshing } from './utils';

export const createReactUseApi =
    <Config extends ActionOptionsMap>(
        apiOrigin: string,
        config: Config,
        refreshActionName: keyof Config,
        onError: (
            type: 'unauthorized' | 'requiredUnauthorized' | 'network',
        ) => void,
    ) =>
    <
        ActionName extends keyof Config,
        Data = undefined extends Config[ActionName]['return']
            ? undefined
            : // @ts-expect-error
              z.infer<Config[ActionName]['return']!>,
        Return = Promise<
            ApiCallReturn<
                Config[ActionName]['errors'] extends readonly string[]
                    ? Config[ActionName]['errors'][number]
                    : undefined,
                Data
            >
        >,
    >(
        actionName: ActionName,
        refreshCredentialsIfUnauthorized: boolean = true,
    ) => {
        const options = config[actionName];
        const [fetchState, setFetchState] = useState<
            ApiFetchState<
                Config[ActionName]['errors'] extends readonly string[]
                    ? Config[ActionName]['errors'][number]
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
                apiOrigin,
                actionName as string,
                options,
                payload,
                refreshActionName as string,
                refreshCredentialsIfUnauthorized,
            );
            if (!isEither(response)) {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                onError('network');
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

                onError('unauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'RequiredUnauthorized') {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                onError('requiredUnauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'NetworkError') {
                setFetchState((prev) => ({
                    status: 'error',
                    data: null,
                    error: 'NotLogicError',
                    cash: prev.cash,
                }));

                onError('network');
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
        }) as undefined extends Config[ActionName]['payload']
            ? () => Return
            : (
                  // @ts-expect-error
                  payload: z.infer<Config[ActionName]['payload']!>,
              ) => Return;

        return {
            ...fetchState,
            call,
        };
    };
