import bcrypt from 'bcryptjs'
import { Service } from 'typedi'

@Service()
export class PasswordUtils {
    /**
     * @function
     * @name hashPassword
     * @param password 
     * @returns 
     */
    async hashPassword(password: string) {
        const rounds = 10
        const salt = await bcrypt.genSalt(rounds)
        const passwordHash = await bcrypt.hash(password, salt)
        return passwordHash
    }

    /**
     * @function
     * @name comparePassword
     * @param password 
     * @param hash 
     * @returns 
     */
    comparePassword(password: string, hash: string): boolean {
        const isCompare = bcrypt.compareSync(password, hash)
        return isCompare
    }

    /**
     * @function
     * @name generate
     * @param length 
     * @returns 
     */
    generate(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+={}[]:.';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}