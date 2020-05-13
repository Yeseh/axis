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
interface CreateNamespaceResult {
    namespace: Namespace;
    stateManager: AxisRequestStateManager;
}

/**
 * Asynchronously creates a new namespace with the given name.
 * If the provided name is already in use by an existing namespace, user the exsisting namespace
 */
export async function createNamespace(
    nsName: string
): Promise<CreateNamespaceResult> {
    const stateManager = new AxisRequestStateManager(nsName);

    return {namespace: stateManager.namespace, stateManager};
}

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
     * Usage:
     * ```ts
     * const username = await getProperty("username", "request")
     * ```
     */
    public async get(property: string): Promise<string>;
    public async get(property: string): Promise<number>;
    public async get(property: string): Promise<boolean>;
    public async get(property: string): Promise<Date>;
    public async get<T>(property: string): Promise<T | null> {
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
     * Usage:
     * ```ts
     * const username = await getProperty("username", "request")
     * ```
     */
    public async set(property: string, data: string): Promise<string>;
    public async set(property: string, data: number): Promise<number>;
    public async set(property: string, data: boolean): Promise<boolean>;
    public async set(property: string, data: Date): Promise<Date>;
    public async set<T>(property: string, data: T): Promise<T | null> {
        try {
            this.namespace.set(property, data);
            return this.namespace.get(property);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
    /**
     * Asynchronously collects all request state information from the namespace.
     * Override to use custom property names
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
            this.get('user_uuid'),
            this.get('username'),
            this.get('ip_address'),
            this.get('request_method'),
            this.get('request_url'),
            this.get('response_status'),
            this.get('response_time'),
            this.get('response_info'),
            this.get('failed_login'),
            this.get('ip_blocked'),
            this.get('new_ip_blocked'),
            this.get('basic_blocked'),
        ]);

        return {
            timestamp: new Date(),
            user_uuid,
            username,
            ip_address,
            request_method,
            request_url: request_url as string,
            response_status: (response_status as unknown) as number,
            response_time: (response_time as unknown) as number,
            response_info: (response_info as unknown) as string,
            ip_blocked: (ip_blocked as unknown) as number,
            new_ip_blocked: (new_ip_blocked as unknown) as number,
            failed_login: (failed_login as unknown) as number,
            basic_blocked: (basic_blocked as unknown) as number,
        };
    }
}
