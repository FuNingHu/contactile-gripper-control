import { deserializeMethodResponse } from './deserializer';
import { serializeMethodCall } from './serializer';
import { XmlRpcValue } from './types';
import { ContactileConstants } from '../../contactile-constants';

export class XmlRpcClient {
    url: string;
    headers = {
        'Content-Type': 'text/xml',
    };

    constructor(url: string, options?: { headers?: Map<string, string> }) {
        this.url = url;
        if (options?.headers != undefined) {
            this.headers = { ...this.headers, ...options.headers };
        }
    }

    // Make an XML-RPC call to the server and return the response
    async methodCall(method: string, ...params: XmlRpcValue[]): Promise<string> {
        const body = serializeMethodCall(method, params);
        const headers = this.headers;

        let res: Response;
        try {
            res = await fetch(this.url, { method: 'POST', headers, body });
        } catch (err) {
            if ((err as Error).message === 'Failed to fetch') {
                throw new Error(`XML-RPC call "${method}" to ${this.url} failed to connect`);
            }
            throw err;
        }
        if (!res.ok) {
            throw new Error(`XML-RPC call "${method}" to ${this.url} returned ${res.status}: "${res.statusText}"`);
        }

        return deserializeMethodResponse(await res.text());
    }

    async doRequest(methodName: string, params: number[]): Promise<number> {
        try {
            const result = await this.methodCall(methodName, ...params);
                
            // Try to coerce to a number safely
            const numResult = typeof result === 'number'
                ? result
                : (typeof result === 'string' && !isNaN(Number(result)))
                    ? Number(result)
                    : ContactileConstants.commandError;
    
            return numResult;
            } catch (error) {
            console.error(`XML-RPC call ${methodName} failed:`, error);
            this.showError(true, error);
            return ContactileConstants.commandError;
            }
        }
    
        private showError(hasError: boolean, error?: unknown) {
        if (hasError && error) {
            console.error(error);
        }
    
        // this.showErrorMessage.set(hasError);
        }
    
}
