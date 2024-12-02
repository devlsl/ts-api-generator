import { Either, left, right } from '@sweet-monads/either';
import { ActionOptions } from '../types';
import { z } from 'zod';

export const parseResponse = (
    json: any,
    options: ActionOptions,
): Either<
    'Unauthorized' | 'RequiredUnauthorized' | 'NetworkError' | void,
    any
> => {
    if (json.error !== undefined && typeof json.error === 'string') {
        if (json.error === 'Unauthorized') {
            return left('Unauthorized');
        }
        if (json.error === 'RequiredUnauthorized') {
            return left('RequiredUnauthorized');
        }
    }

    const serviceErrors = [
        'NoUrl',
        'UnknownAction',
        'BodyReadError',
        'NotJsonBody',
        'BodyDoesNotMatchTheSchema',
        'ServerError',
    ];

    const maybeReplyWithStatus = z
        .object({ success: z.boolean() })
        .safeParse(json);
    if (!maybeReplyWithStatus.success) {
        return left('NetworkError');
    }
    if (maybeReplyWithStatus.data.success === false) {
        if (
            json.error !== undefined &&
            typeof json.error === 'string' &&
            serviceErrors.includes(json.error)
        ) {
            return left('NetworkError');
        }

        if (options.errors instanceof Array && options.errors.length > 0) {
            if (json.error === undefined || typeof json.error !== 'string') {
                return left('NetworkError');
            }
            if (options.errors.includes(json.error)) {
                return left(json.error);
            } else {
                return left('NetworkError');
            }
        } else {
            return left(undefined);
        }
    }
    if (options.return === undefined) {
        return right(undefined);
    } else {
        if (json.data === undefined) {
            return left('NetworkError');
        }
        const maybeData = options.return.safeParse(json.data);
        if (!maybeData.success) {
            return left('NetworkError');
        }
        return right(maybeData.data);
    }
};

const invoke = async (
    url: string,
    actionName: string,
    options: ActionOptions,
    payload?: unknown,
) => {
    const response = await fetch(url + '/' + (actionName as string), {
        method: 'POST',
        credentials: 'include',
        ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    if (!response.ok) {
        return left('NetworkError');
    }
    const json = await response.json();

    return parseResponse(json, options);
};

export const invokeWithRefreshing = async (
    url: string,
    actionName: string,
    options: ActionOptions,
    payload: unknown,
    refreshActionName: string,
    refreshCredentialsIfUnauthorized: boolean = true,
) => {
    try {
        const maybeResponse = await invoke(url, actionName, options, payload);
        if (!refreshCredentialsIfUnauthorized) return maybeResponse;

        if (maybeResponse.isLeft() && maybeResponse.value === 'Unauthorized') {
            const maybeRefreshed = await invoke(
                url,
                refreshActionName,
                options,
                payload,
            );

            if (
                maybeRefreshed.isLeft() &&
                maybeRefreshed.value === 'Unauthorized'
            ) {
                return left('Unauthorized');
            } else {
                return invoke(url, actionName, options, payload);
            }
        }
        return maybeResponse;
    } catch (error) {
        return left('NetworkError');
    }
};
