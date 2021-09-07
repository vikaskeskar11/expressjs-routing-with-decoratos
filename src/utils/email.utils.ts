import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import config from 'config'
import fs from 'fs'
import ejs from 'ejs'
import winston from 'winston'
import { Logger } from '../logger/logger'
import { EmailTemplateRepository } from '../repositories/email-template.repository'
import { CustomError } from '../error/custom.error'
import { HTTP_CODES } from '../constants/http-codes'
import { Service } from 'typedi'

@Service()
export class EmailUtils {
    transporter: nodemailer.Transporter
    logger: winston.Logger
    emailTemplateRepository: EmailTemplateRepository

    constructor() {
        this.logger = Logger.getLogger
        let options: any = config.get('smtp')
        const emailOptions = JSON.parse(JSON.stringify(options))
        if (emailOptions.auth) {
            emailOptions.auth.user = fs.readFileSync(<fs.PathOrFileDescriptor>options.auth.user, 'utf-8')
            emailOptions.auth.pass = fs.readFileSync(<fs.PathOrFileDescriptor>options.auth.pass, 'utf-8')
            emailOptions.host = fs.readFileSync(<fs.PathOrFileDescriptor>options.host, 'utf-8')
        }
        this.transporter = nodemailer.createTransport(emailOptions)
        this.transporter.on('error', (error) => {
            this.logger.error('Email transport failed to initialize', { error })
        })
        this.emailTemplateRepository = new EmailTemplateRepository()
    }

    /**
     * @function
     * @param templateName 
     * @param options 
     * @param placeholders 
     * @returns 
     */
    async send(templateName: string, options: Mail.Options, placeholders: any): Promise<any> {
        const template = await this.emailTemplateRepository.get(templateName)
        if (!template) {
            throw new CustomError('Email template not found', HTTP_CODES.NOT_FOUND)
        }
        const html = ejs.render(template.content, placeholders)
        options.html = html
        options.subject = template.subject
        const result = await this.transporter.sendMail(options)
        this.logger.info('EmailUtils:send: Email send ', { result })
        return result
    }
}