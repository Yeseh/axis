import {Response} from "express";

export interface AxisControllerResult<T> {
    status: StatusCode;
    res?: Response;
    data?: T;
    info?: string;
    error?: Error;
    blocked?: boolean;
}
/**
 * Gives more declarative ways to use HTTP statusses
 */
export enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
}

/* eslint-disable @typescript-eslint/no-explicit-any */

import {Response} from "express";
import {red} from "chalk";

import {RequestLogger} from "./logger";

const logger = new RequestLogger();

class AxisStatusManager {
    public async handleControllerResult<T>(
        controllerResult: BlybControllerResult<T>
    ): Promise<Response> {
        try {
            const {
                data,
                status,
                info,
                error,
                res,
                validationErrors,
            } = controllerResult;
            if (!res) throw new TypeError("Response object undefined");
            if (process.env.ENABLE_DB_LOGGING == "1") {
                await Promise.all([
                    NamespaceHelper.setProperty("response_status", status),
                    NamespaceHelper.setProperty("response_info", info),
                    NamespaceHelper.setProperty("error", error),
                ]);

                const requestState = await NamespaceHelper.composeRequestState();
                logger.logRequest(requestState);
            }
            switch (status) {
                case StatusCode.OK:
                    return this.send200(res, data, info);

                case StatusCode.CREATED:
                    return this.send201(res, data, info);

                case StatusCode.ACCEPTED:
                    return this.send202(res, data, info);

                case StatusCode.NO_CONTENT:
                    return this.send204(res, data, info);

                case StatusCode.BAD_REQUEST:
                    return this.send400(res, info);

                case StatusCode.UNAUTHORIZED:
                    return this.send401(res, info);

                case StatusCode.FORBIDDEN:
                    return this.send403(res, info);

                case StatusCode.NOT_FOUND:
                    return this.send404(res, info);

                case StatusCode.CONFLICT:
                    return this.send409(res, info);

                case StatusCode.UNPROCESSABLE_ENTITY:
                    return this.send422(res, validationErrors, info);

                case StatusCode.TOO_MANY_REQUESTS:
                    return this.send429(res, info);

                case StatusCode.INTERNAL_SERVER_ERROR:
                    return this.send500(res, error);
                default:
                    return this.send500(res, error);
            }
        } catch (e) {
            console.log(e);
        }
    }

    public send200(res: Response, data?: any, info?: string): Response {
        return res.status(200).json({message: "[info] OK", data, info});
    }

    public send201(res: Response, data?: any, info?: string): Response {
        return res.status(201).json({message: "[info] Created", data, info});
    }
    public send202(res: Response, data?: any, info?: string): Response {
        return res.status(202).json({message: "[info] Accepted", data, info});
    }

    public send204(res: Response, data?: any, info?: string): Response {
        return res.status(204).json({message: "[info] No Content", data, info});
    }

    public send400(res: Response, info?: string): Response {
        return res.status(400).json({message: "[error] Bad request", info});
    }

    public send401(res: Response, info?: string): Response {
        return res.status(401).json({message: "[error] Unauthorized", info});
    }

    public send403(res: Response, info?: string): Response {
        return res.status(403).json({message: `[error] Forbidden`, info});
    }

    public send404(res: Response, info?: string): Response {
        return res.status(404).json({message: "[error] Not Found", info});
    }

    public send409(res: Response, info?: string): Response {
        return res.status(409).json({message: "[error] Conflict", info});
    }

    public send422(
        res: Response,
        errors?: BlybValidationError[],
        info?: string
    ): Response {
        return res
            .status(422)
            .json({message: "[error] Unprocessable Entity", errors, info});
    }

    public send429(res: Response, info?: string): Response {
        return res
            .status(429)
            .json({message: "[error] Too many requests", info});
    }

    public send500(res: Response, error: Error, info?: string): Response {
        console.error(red(error));

        return res.status(500).json({
            message: "[error] Internal Server Error",
            error: error.name,
            info,
        });
    }
}

export default new StatusManager();
