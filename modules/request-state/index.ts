import {getNamespace, Namespace, createNamespace} from 'cls-hooked';
import {IUser} from '../models/UserModel';

// DRY common operations on the request state namespace

export interface IRequestState {
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

class NamespaceHelper {
    /**
     * @class NamespaceHelper
     * @method getProperty
     * @param property property name of request namespace
     * @remarks retrieve a property from the request state
     */
    public async getProperty(property: string): Promise<any> {
        const nameSpace = getNamespace('request');

        const result = nameSpace.get(property);

        return result;
    }
    public async getNameSpace(nsName: string): Promise<Namespace> {
        return getNamespace(nsName);
    }

    public async createNameSpaceAsync(nsName: string): Promise<Namespace> {
        return createNamespace(nsName);
    }

    public async getUserData(): Promise<IUser> {
        return this.getProperty('userData');
    }

    public async getUserUuid(): Promise<string> {
        const userData = await this.getProperty('userData');

        return userData.user_uuid;
    }

    public async getUserTenant(): Promise<string> {
        const userData = await this.getProperty('userData');

        return userData.tenant;
    }

    public async getPlatformTenant(): Promise<string> {
        const platformData = await this.getProperty('platformData');

        return platformData.tenant;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async setProperty(name: string, data: any): Promise<void> {
        const nameSpace = getNamespace('request');

        nameSpace.set(name, data);
    }
    public async composeRequestState(): Promise<IRequestState> {
        const [
            userData,
            user_uuid,
            email,
            dataplatform_uuid,
            dataplatform_name,
            dataplatform_type,
            ip_address,
            tenant,
            request_url,
            response_status,
            response_time,
            response_info,
            ip_blocked,
            new_ip_blocked,
            failed_login,
            basic_blocked,
            data_insert_blocked,
            request_method,
        ] = await Promise.all([
            this.getUserData(),
            this.getProperty('user_uuid'),
            this.getProperty('email'),
            this.getProperty('dataplatform_uuid'),
            this.getProperty('dataplatform_name'),
            this.getProperty('dataplatform_type'),
            this.getProperty('ip_address'),
            this.getProperty('tenant'),
            this.getProperty('request_url'),
            this.getProperty('response_status'),
            this.getProperty('response_time'),
            this.getProperty('response_info'),
            this.getProperty('ip_blocked'),
            this.getProperty('new_ip_blocked'),
            this.getProperty('failed_login'),
            this.getProperty('basic_blocked'),
            this.getProperty('data_insert_blocked'),
            this.getProperty('method'),
        ]);

        return {
            timestamp: new Date(),
            user_uuid: userData?.user_uuid || user_uuid,
            email: userData?.email || email,
            dataplatform_uuid,
            dataplatform_name,
            dataplatform_type,
            tenant,
            ip_address,
            request_method,
            request_url,
            response_status,
            response_time,
            response_info,
            ip_blocked,
            new_ip_blocked,
            failed_login,
            basic_blocked,
            data_insert_blocked,
        };
    }
}
export default new NamespaceHelper();
