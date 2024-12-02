import { isEither, left, right } from '@sweet-monads/either';
import { z } from 'zod';
import { ActionOptionsMap } from '../types';
import { ApiCallReturn } from './types';
import { invokeWithRefreshing } from './utils';

export const createApiClient =
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
    ) => ({
        call: (async (payload: unknown) => {
            const options = config[actionName];

            const response = await invokeWithRefreshing(
                apiOrigin,
                actionName as string,
                options,
                payload,
                refreshActionName as string,
                refreshCredentialsIfUnauthorized,
            );
            if (!isEither(response)) {
                onError('network');
                return left('NotLogicError');
            }
            if (response.isRight()) return right(response.value);
            if (response.value === 'Unauthorized') {
                onError('unauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'RequiredUnauthorized') {
                onError('requiredUnauthorized');
                return left('NotLogicError');
            }
            if (response.value === 'NetworkError') {
                onError('network');
                return left('NotLogicError');
            }

            return left(response.value);
        }) as undefined extends Config[ActionName]['payload']
            ? () => Return
            : (
                  // @ts-expect-error
                  payload: z.infer<Config[ActionName]['payload']!>,
              ) => Return,
    });
