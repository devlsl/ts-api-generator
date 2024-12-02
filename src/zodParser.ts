import { Either, left, right } from '@sweet-monads/either';
import { z } from 'zod';

export const parse = <T extends z.ZodTypeAny>(
    schema: T,
    data: unknown,
): Either<'DoesNotMatch', z.infer<T>> => {
    try {
        return right(schema.parse(data));
    } catch {
        return left('DoesNotMatch');
    }
};
