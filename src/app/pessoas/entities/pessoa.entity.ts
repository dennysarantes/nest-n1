import { Role } from 'src/app/roles/entities/role.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { StatusPessoaEnum } from '../model/status-pessoa.enum';
import { UtilShared } from 'src/app/shared/util.shared';
import { Recado } from 'src/app/recados/entities/recado.entity';

@Entity()
@Unique(['email'])
export class Pessoa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ default: StatusPessoaEnum.ATIVO })
    status: StatusPessoaEnum;

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

    @OneToMany(() => Recado, (reacado) => reacado.de)
    recados: Recado[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updateAt?: Date;

    constructor(
        email: string,
        passwordHash: string,
        nome: string,
        roles?: Role[],
        recados?: Recado[],
    ) {
        if (email !== undefined) this.email = email;
        if (passwordHash !== undefined) this.passwordHash = passwordHash;
        if (nome !== undefined) this.nome = nome;
        if (roles !== undefined) this.roles = roles;
        if (recados !== undefined) this.recados = recados;
    }

    @BeforeInsert()
    @BeforeUpdate()
    updatePassword() {
        this.passwordHash = UtilShared.criptografar(this.passwordHash);
    }
}
