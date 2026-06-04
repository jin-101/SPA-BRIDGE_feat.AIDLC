export type Ok<T> = {
    ok: true;
    value: T;
};
export type Err<E = Error> = {
    ok: false;
    error: E;
};
export type Result<T, E = Error> = Ok<T> | Err<E>;
export declare const ok: <T>(value: T) => Ok<T>;
export declare const err: <E>(error: E) => Err<E>;
export declare const isOk: <T, E>(result: Result<T, E>) => result is Ok<T>;
export declare const isErr: <T, E>(result: Result<T, E>) => result is Err<E>;
//# sourceMappingURL=result.d.ts.map