import { UploadProgressEvent, UploadRequestOptions } from './upload';

export class UploadAjaxError extends Error {
    name = 'UploadAjaxError';
    status: number;
    method: string;
    url: string;

    constructor(message: string, status: number, method: string, url: string) {
        super(message);
        this.status = status;
        this.method = method;
        this.url = url;
    }
}

function getError(
    action: string,
    option: UploadRequestOptions,
    xhr: XMLHttpRequest
) {
    let msg: string;
    if (xhr.response) {
        msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
        msg = `${xhr.responseText}`;
    } else {
        msg = `fail to ${option.method} ${action} ${xhr.status}`;
    }

    return new UploadAjaxError(msg, xhr.status, option.method, action);
}

function getBody(xhr: XMLHttpRequest): XMLHttpRequestResponseType {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

export function httpRequest(options: UploadRequestOptions) {
    if (typeof XMLHttpRequest === 'undefined')
        throw new Error('XMLHttpRequest is undefined');

    const xhr = new XMLHttpRequest();
    const action = options.action;

    if (xhr.upload) {
        xhr.upload.addEventListener('progress', e => {
            const processEvent = e as UploadProgressEvent;
            processEvent.percent = e.total > 0 ? (e.loaded / e.total) * 100 : 0;

            options.onProgress(processEvent);
        });
    }

    const formData = new FormData();
    if (options.data) {
        for (const [key, value] of Object.entries(options.data)) {
            if (Array.isArray(value) && value.length)
                formData.append(key, ...value);
            else formData.append(key, value);
        }
    }
    formData.append(options.filename, options.file, options.file.name);

    xhr.onerror = () => {
        options.onError(getError(action, options, xhr));
    };

    xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) {
            return options.onError(getError(action, options, xhr));
        }
        options.onSuccess(getBody(xhr));
    };

    xhr.open(options.method, action, true);

    const headers = options.headers || {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => xhr.setRequestHeader(key, value));
    } else {
        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, String(value));
        }
    }
    xhr.send(formData);
    return xhr;
}
