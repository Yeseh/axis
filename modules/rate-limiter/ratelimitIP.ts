import {Request, Response} from "express";
import {NextFunction} from "express-serve-static-core";
import mysql from "mysql2";
import {RateLimiterMySQL} from "rate-limiter-flexible";
import Common from "../controllers/CommonController";
import NameSpace from "../Helpers/NamespaceHelper";
import Status from "../Helpers/StatusManager";
import {StatusCode} from "../models/BlybHTTP.model";

const envlimitip = process.env.LIMIT_LOGIN_FAIL_IP as unknown;

const envport = process.env.DB_PORT as unknown;

const limitIp = envlimitip as number;

const port = envport as number;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: port,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const ipLimiter = new RateLimiterMySQL({
    storeClient: pool,
    keyPrefix: "limit_consecutive_ip",
    dbName: process.env.DB_DATABASE,
    points: limitIp,
    duration: 60, // per minute
    blockDuration: 60 * 60 * 24,
});

export default async function(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> {
    try {
        const ip = await NameSpace.getProperty("ip_address");

        // Check of IP al geblokkeerd is
        const ipBlocked = await Common.checkIp(ip);

        if (ipBlocked) {
            await NameSpace.setProperty("ip_blocked", 1);
            return Status.handleControllerResult({res, status: StatusCode.TOO_MANY_REQUESTS});
        }
        // Haal gebruikte pogingen op
        const ipRateLimit = await ipLimiter.get(ip);

        if (ipRateLimit !== null && ipRateLimit.consumedPoints >= limitIp) {
            // Blokkeer IP als er meer verzoeken zijn geweest dan toegestaan
            const blocked = await Common.blockIp(ip);

            if (blocked) {
                await Promise.all([
                    NameSpace.setProperty("new_ip_blocked", 1),
                    NameSpace.setProperty("ip_blocked", 1),
                ]);
                return Status.handleControllerResult({res, status: StatusCode.TOO_MANY_REQUESTS});
            }
        } else {
            // Tel 1 login op voor deze ip
            await ipLimiter.consume(ip);

            next();
        }
    } catch (e) {
        console.log(e);
    }
}
