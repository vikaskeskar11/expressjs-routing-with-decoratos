import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'emailtemplates' })
export class EmailTemplatesEntity {
    @PrimaryColumn("int", {
        primary: true
    })
    @PrimaryGeneratedColumn('increment')
    id: string

    @Column({
        length: 300
    })
    name: string

    @Column({
        length: 300,
        type: 'varchar'
    })
    subject: string

    @Column({
        type: 'text'
    })
    content: string
}