import fs from 'fs'
import config from 'config'
import { sign, verify, decode } from 'jsonwebtoken'
import { CustomError } from '../error/custom.error';
import { HTTP_CODES } from '../constants/http-codes';
import { Service } from 'typedi';
const jwtSecretKeyPath: fs.PathOrFileDescriptor = config.get('jwtSecretKey')

@Service()
export class JWTUtils {
    private jwtSecretKey: string;
    constructor() {
        this.jwtSecretKey = fs.readFileSync(jwtSecretKeyPath, 'utf-8')
    }

    /**
     * @function
     * @name generate
     * @param userDetails 
     * @returns 
     */
    generate(userDetails: { name: string, email: string, id: number }) {
        return sign(Object.assign({}, userDetails), this.jwtSecretKey, { expiresIn: '1h' })
    }

    /**
     * @function
     * @name verify
     * @param token 
     * @param email 
     */
    verify(token: string): { email: string, name: string, id: number } {
        try {
            const result = <{ email: string, name: string, id: number }>verify(token, this.jwtSecretKey)
            return result
        } catch (error: any) {
            throw new CustomError(error.message, HTTP_CODES.UNAUTHORIZED)
        }
    }
}
