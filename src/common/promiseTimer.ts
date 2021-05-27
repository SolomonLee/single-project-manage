import { Result } from "../apis/result";

const promiseTimer = <T>(
    cb: () => Promise<Result<T>>,
    msec = 1000
): Promise<Result<T>> =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(cb());
        }, msec);
    });

export default promiseTimer;
