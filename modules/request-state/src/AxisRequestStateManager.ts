import {
    getNamespace as clsGetNamespace,
    Namespace,
    createNamespace as clsCreateNamespace,
} from 'cls-hooked';

// DRY common operations on the request state namespace

/**
 * Provides an interface to store request information to use for logging purposes
 */
export interface RequestState {
    timestamp?: Date;
    user_uuid?: string;
    username?: string;
    ip_address?: string;
    request_url?: string;
    request_method?: string;
    response_status?: number;
    response_time?: number;
    response_info?: string;
    ip_blocked?: number;
    new_ip_blocked?: number;
    failed_login?: number;
    basic_blocked?: number;
    login_blocked_ip?: number;
}

export const createNamespace = async (
    nsName: string
): Promise<AxisRequestStateManager> => {
    const namespace = new AxisRequestStateManager(nsName);

    return namespace;
};
/**
 * ```
 */
export class AxisRequestStateManager {
    private _namespace: Namespace;

    constructor(nsName: string) {
        const existingNs = clsGetNamespace(nsName);

        if (!existingNs) this._namespace = clsCreateNamespace(nsName);
        else this._namespace = existingNs;
    }

    get namespace(): Namespace {
        return this._namespace;
    }

    /**
     * Asynchronously retrieves a property value from the given namespace.
     *
     * Example:
     * ```ts
     * const username = await getProperty("username", "request")
     * ```
     */
    public async getProperty(
        property: string
    ): Promise<string | number | boolean | null> {
        try {
            const result = this.namespace.get(property);
            return result;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * Asynchronously retrieves a property value from the given namespace, and returns the newly set value.
     *
     * Example:
     * ```ts
     * const username = await getProperty("username", "request")
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async setProperty(
        property: string,
        data: string | number | boolean
    ): Promise<string | number | boolean | null> {
        try {
            this.namespace.set(property, data);
            return this.namespace.get(property);
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Asynchronously collects all request state information from the namespace
     */
    public async composeRequestState(): Promise<RequestState> {
        const [
            user_uuid,
            username,
            ip_address,
            request_method,
            request_url,
            response_status,
            response_time,
            response_info,
            failed_login,
            basic_blocked,
            ip_blocked,
            new_ip_blocked,
        ] = await Promise.all([
            this.getProperty('user_uuid'),
            this.getProperty('username'),
            this.getProperty('ip_address'),
            this.getProperty('request_method'),
            this.getProperty('request_url'),
            this.getProperty('response_status'),
            this.getProperty('response_time'),
            this.getProperty('response_info'),
            this.getProperty('failed_login'),
            this.getProperty('ip_blocked'),
            this.getProperty('new_ip_blocked'),
            this.getProperty('basic_blocked'),
        ]);

        return {
            timestamp: new Date(),
            user_uuid: user_uuid as string,
            username: username as string,
            ip_address: ip_address as string,
            request_method: request_method as string,
            request_url: request_url as string,
            response_status: response_status as number,
            response_time: response_time as number,
            response_info: response_info as string,
            ip_blocked: ip_blocked as number,
            new_ip_blocked: new_ip_blocked as number,
            failed_login: failed_login as number,
            basic_blocked: basic_blocked as number,
        };
    }
}
