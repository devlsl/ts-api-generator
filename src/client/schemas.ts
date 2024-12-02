import { ActionOptionsMap } from '../types';

export const getApiPayloadSchemas = <Schema extends ActionOptionsMap>(
    schema: Schema,
) =>
    Object.fromEntries(
        Object.entries(schema).map(([name, options]) => [
            name,
            options.payload,
        ]),
    ) as {
        [Key in keyof typeof schema]: undefined extends (typeof schema)[Key]['payload']
            ? undefined
            : (typeof schema)[Key]['payload'];
    };

export const getApiReturnDataSchemas = <Schema extends ActionOptionsMap>(
    schema: Schema,
) =>
    Object.fromEntries(
        Object.entries(schema).map(([name, options]) => [
            name,
            options.payload,
        ]),
    ) as {
        [Key in keyof typeof schema]: undefined extends (typeof schema)[Key]['return']
            ? undefined
            : (typeof schema)[Key]['return'];
    };
