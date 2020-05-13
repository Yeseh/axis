import {Request, Response} from 'express';
import {NextFunction} from 'express-serve-static-core';
import mysql from 'mysql2';
import {RateLimiterMySQL} from 'rate-limiter-flexible';

const envlimituserip = process.env.LIMIT_BASIC_USE_USER_IP as unknown;

const envport = process.env.DB_PORT as unknown;

const limitUserIp = envlimituserip as number;

const port = envport as number;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: port,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const basicLimiter = new RateLimiterMySQL({
    storeClient: pool,
    keyPrefix: 'limit_basic_tenant_ip_user',
    dbName: process.env.DB_DATABASE,
    points: limitUserIp,
    duration: 60, // Per minute
    blockDuration: 60 * 5,
});

export default async function (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> {
    try {
        const {ip} = req;
        const user_uuid: string = await NameSpace.

        const RLKey = `${ip}_${user_uuid}`;

        const basicRateLimit = await basicLimiter.get(RLKey);

        if (
            basicRateLimit !== null &&
            basicRateLimit.consumedPoints >= limitUserIp
        ) {
            await NameSpace.setProperty('basic_blocked', 1);
            return Status.handleControllerResult({
                res,
                status: StatusCode.TOO_MANY_REQUESTS,
            });
        }
        await basicLimiter.consume(RLKey);

        next();
    } catch (e) {
        console.log(e);
    }
}
