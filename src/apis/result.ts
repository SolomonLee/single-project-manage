/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Result<T> {
    datas: T;
    result: boolean;
    resultMsg: string;
}

const finalResult = <T>(
    datas: T,
    result: boolean,
    resultMsg: string
): Result<T> => <Result<T>>{ datas, result, resultMsg };

export const resultOk = <T>(datas = <T>{}, resultMsg = ""): Result<T> =>
    finalResult(datas, true, resultMsg);

export const resultError = <T>(resultMsg: string, datas = <T>{}): Result<T> =>
    finalResult(datas, false, resultMsg);
