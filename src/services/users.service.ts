import { Service } from "typedi";
import winston from "winston";
import { EmailTemplatesConstants } from "../constants/email-templates";
import { HTTP_CODES } from "../constants/http-codes";
import { UsersDTO } from "../dto/users.dto";
import { CustomError } from "../error/custom.error";
import { Logger } from "../logger/logger";
import { UsersRepository } from "../repositories/users.repository";
import { EmailUtils } from "../utils/email.utils";
import { JWTUtils } from "../utils/jwt-utils";
import { PasswordUtils } from "../utils/password.utils";

@Service()
export class UsersService {
    logger: winston.Logger
    constructor(private usersRepository: UsersRepository, private passwordUtils: PasswordUtils,
        private emailUtils: EmailUtils, private jwtUtils: JWTUtils) {
        this.logger = Logger.getLogger
    }

    /**
     * @function
     * @name getByEmail
     * @returns 
     */
    async getByEmail(email: string) {
        this.logger.debug('UsersService:get: Getting users from repo')
        const result = await this.usersRepository.getByEmail(email, ['id', 'name', 'email'])
        this.logger.debug('UsersService:get: Users list retrieved ', { result })
        return result
    }

    /**
     * @function
     * @name get
     * @returns 
     */
    async get() {
        this.logger.debug('UsersService:get: Getting users from repo')
        const result = await this.usersRepository.get()
        this.logger.debug('UsersService:get: Users list retrieved ', { result })
        return result
    }

    /**
     * @function
     * @name save
     * @param data 
     * @returns 
     */
    async save(data: UsersDTO) {
        this.logger.debug('UsersService:save: Saving user details')
        const user = await this.usersRepository.getByEmail(data.email, ['id', 'email', 'name'])
        if (user) {
            this.logger.debug('UsersService:save: User exists')
            throw new CustomError('User already exists', HTTP_CODES.INTERNAL_SERVER_ERROR)
        }
        if (!data.password) {
            // Variable length of password per user
            data.password = this.passwordUtils.generate(data.email.split('@')[0].length)
        }
        const password = data.password
        data.password = await this.passwordUtils.hashPassword(data.password)
        const result = await this.usersRepository.save(data)
        if (result) {
            await this.emailUtils.send(EmailTemplatesConstants.SIGN_UP, { to: result.email }, Object.assign({ password, appName: 'ts-mission', userName: result.email, name: result.name }))
        }
        this.logger.debug('UsersService:save: User details saved')
        return result
    }

    /**
     * @function
     * @name login
     * @param user 
     * @returns 
     */
    async login(user: { email: string, password: string }): Promise<Object> {
        const userDetails: any = await this.usersRepository.getByEmail(user.email, ['password', 'id', 'name', 'email'])
        const isMatch: boolean = await this.passwordUtils.comparePassword(user.password, <string>userDetails?.password)
        if (!isMatch) {
            throw new CustomError('User details does not match', HTTP_CODES.UNAUTHORIZED)
        }
        delete userDetails.password
        const token = this.jwtUtils.generate(userDetails)
        return {
            token,
            user: userDetails
        }
    }
}
