import {featureflags} from "../proto";
import IRequest = featureflags.backend.IRequest;
import IReply = featureflags.backend.IReply;
import Request = featureflags.backend.Request;
import Reply = featureflags.backend.Reply;

export function call(request: IRequest): Promise<IReply> {
    return fetch('/featureflags.backend.Backend/Call', {
        method: 'POST',
        body: Request.encode(request).finish(),
        credentials: 'include'
    })
    .then((response: Response) => {
        if (response.ok) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response.statusText);
        }
    })
    .then((response) => {
        return response.arrayBuffer();
    })
    .then((buffer: ArrayBuffer) => {
        let data = new Uint8Array(buffer);
        let reply = Reply.decode(data);
        return Promise.resolve(reply);
    });
}
