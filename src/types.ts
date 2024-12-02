import { Either } from '@sweet-monads/either';
import { IncomingMessage } from 'http';
import { z } from 'zod';

export type AuthContext = {
    id: string;
    role: string;
};

export type VerifyAccess = (
    request: IncomingMessage,
) => Either<'Unauthorized', AuthContext>;

export type ActionOptionsWithHandlerMap = Record<
    string,
    ActionOptions & {
        handle: CallableFunction;
    }
>;

export type ActionOptions = {
    payload?: z.ZodTypeAny;
    return?: z.ZodTypeAny;
    lowLevel?: boolean;
    roles?: Readonly<string[]> | true | false;
    errors?: Readonly<string[]>;
};

export type ActionOptionsMap = {
    [actionName: string]: ActionOptions;
};
