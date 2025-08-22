export class ResponseError extends Error {
    status: number;

    constructor(resp?: Response) {
        if (resp) {
            const msg = resp.statusText ? resp.statusText : `${resp.status}`
            super(msg);
            this.status = resp.status;
        }
        else {
            super("Unknown error");
            this.status = 0;
        }
    }
}

const parseResponse = async <T>(resp: Response): Promise<T> => {
    if (resp.ok) {
        const a = await resp.json();
        return a as T;
    } else {
        throw new ResponseError(resp);
    }
};


const get = async <T>(endPoint: string, token: string, abortSignal?: AbortSignal): Promise<T> => {
    const resp = await fetch(endPoint, {
        method: "GET",
        cache: 'no-cache',
        headers: {
            "accept": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        signal: abortSignal
        
    });
    return await parseResponse<T>(resp);

};

const post = async<T, TD = unknown>(endPoint: string, token: string, data?: TD, abortSignal?: AbortSignal): Promise<T> => {
    const json = data ? JSON.stringify(data) : null;
    const resp = await fetch(endPoint, {
        method: "POST",
        body: json,
        headers: {
            "accept": "application/json",
            "content-type": "application/json; charset=utf-8",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        signal: abortSignal
    });
    if (resp.ok) {
        return await parseResponse<T>(resp);
    }
    else {
        throw new ResponseError(resp);
    }
};

const put = async<T, TD = unknown>(endPoint: string, token: string, data?: TD, abortSignal?: AbortSignal): Promise<T> => {
    const json = data ? JSON.stringify(data) : null;
    const resp = await fetch(endPoint, {
        method: "PUT",
        body: json,
        headers: {
            "accept": "application/json",
            "content-type": "application/json; charset=utf-8",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        signal: abortSignal
    });
    return await parseResponse<T>(resp);
};

const postForm = async<T>(endPoint: string, data: FormData, token: string, abortSignal?: AbortSignal): Promise<T> => {
    const resp = await fetch(endPoint, {
        method: "POST",
        body: data,
        headers: {
            "accept": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        signal: abortSignal
    });
    if (resp.ok) {
        return await parseResponse<T>(resp);
    }
    else {
        throw new ResponseError(resp);
    }
};

const remove = async<T>(endPoint: string, token: string, abortSignal?: AbortSignal): Promise<T> => {
    const resp = await fetch(endPoint, {
        method: "DELETE",
        headers: {
            "accept": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        signal: abortSignal
    });
    if (resp.ok) {
        return true as T;
    }
    else {
        throw new ResponseError(resp);
    }
};

export default {
    get,
    post,
    put,
    postForm,
    remove
};