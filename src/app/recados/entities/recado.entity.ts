import { Pessoa } from 'src/app/pessoas/entities/pessoa.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('recados')
export class Recado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    texto: string;

    @Column({ type: 'boolean', default: false })
    lido: boolean;

    @Column({ type: 'date' })
    data: Date;

    @ManyToOne(
        () => Pessoa,
        (pessoa) => pessoa.recados /*  {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    } */,
    )
    de: Pessoa;

    @ManyToMany(() => Pessoa)
    @JoinTable()
    para: Pessoa[];

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updateAt?: Date;

    constructor(
        texto: string,
        de: Pessoa,
        para: Pessoa[],
        lido: boolean,
        data: Date,
    ) {
        if (texto !== undefined) this.texto = texto;
        if (de !== undefined) this.de = de;
        if (para !== undefined) this.para = para;
        if (lido !== undefined) this.lido = lido;
        if (data !== undefined) this.data = data;
    }
}
