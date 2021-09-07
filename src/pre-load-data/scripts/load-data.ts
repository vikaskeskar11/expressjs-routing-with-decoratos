import { EmailTemplateRepository } from "../../repositories/email-template.repository";
import fs from 'fs'
import path from "path/posix";
import { EmailTemplatesConstants, EmailTemplatesSubject } from "../../constants/email-templates";
import winston from "winston";
import { Logger } from "../../logger/logger";

export class LoadData {
    emailTemplateRepository: EmailTemplateRepository
    logger: winston.Logger

    constructor() {
        this.logger = Logger.getLogger
        this.emailTemplateRepository = new EmailTemplateRepository()
        this.createEmailTemplate().then(() => {
            this.logger.info('Email templates created')
        }, err => {
            this.logger.error('Error while creating email templates', { err })
        })
    }

    async createEmailTemplate(): Promise<void> {
        const isExists = await this.emailTemplateRepository.get(EmailTemplatesConstants.SIGN_UP)
        if (isExists) {
            this.logger.info('Email template already exists')
        } else {
            await this.emailTemplateRepository.save({
                content: fs.readFileSync(path.join(path.resolve(__dirname, '..'), 'sign-up.html'), 'utf-8'),
                name: EmailTemplatesConstants.SIGN_UP,
                subject: EmailTemplatesSubject.SIGN_UP
            })
        }
    }
}
