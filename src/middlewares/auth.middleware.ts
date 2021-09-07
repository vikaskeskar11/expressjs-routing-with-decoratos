import { NextFunction, Request, Response } from "express";
import { Service } from "typedi";
import { HTTP_CODES } from "../constants/http-codes";
import { unsecuredRoutes } from "../constants/unsecure-routes";
import { CustomError } from "../error/custom.error";
import { JWTUtils } from "../utils/jwt-utils";

@Service()
export class UsersMiddleware {
    constructor(private jwtUtils: JWTUtils) { }

    /**
     * @function
     * @param req 
     * @param res 
     * @param next 
     */
    validateSession() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const isUnsecured = unsecuredRoutes.findIndex(route => route.path === req.path && route.method === req.method.toUpperCase()) > -1
                if (isUnsecured) {
                    return next()
                }
                const token = <string>req.headers.authorization?.substr('Bearer '.length)
                if (!token) {
                    throw new CustomError('Invalid authorization token', HTTP_CODES.FORBIDDEN)
                }
                const user = this.jwtUtils.verify(token)
                if (user) {
                    req.user = user
                    return next();
                } else {
                    res.status(HTTP_CODES.UNAUTHORIZED).send({ error: 'User is not authorized to access this resource' });
                }
            } catch (error: any) {
                res.status(HTTP_CODES.FORBIDDEN).send({ error: error.message });
            }
        }
    }
}