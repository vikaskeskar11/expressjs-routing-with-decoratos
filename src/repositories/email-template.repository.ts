import { Service } from "typedi";
import { getRepository } from "typeorm";
import { EmailTemplatesDTO } from "../dto/email-template.dto";
import { EmailTemplatesEntity } from "../entity/email-template.entity";

@Service()
export class EmailTemplateRepository {
    get(templateName: string): Promise<EmailTemplatesEntity | undefined> {
        const result = getRepository(EmailTemplatesEntity).findOne({
            where: { name: templateName }
        })
        return result
    }

    save(template: EmailTemplatesDTO) {
        const result = getRepository(EmailTemplatesEntity).save(<EmailTemplatesEntity>template)
        return result
    }
}