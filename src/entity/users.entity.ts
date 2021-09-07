import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'users' })
export class UsersEntity {
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
    email: string

    @Column({
        length: 3000,
        type: 'varchar'
    })
    password: string

    @Column('int', {
        default: 0
    })
    isInitialPasswordChanged: number

    @Column({
        type: 'varchar',
        length: '100',
        default: null
    })
    resetPasswordToken: string
}