import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('recados')
export class Recado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    texto: string;

    @Column({ type: 'varchar', length: 50 })
    de: string;

    @Column({ type: 'varchar', length: 50 })
    para: string;

    @Column({ type: 'boolean', default: false })
    lido: boolean;

    @Column({ type: 'date' })
    data: Date;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updateAt?: Date;

    constructor(
        texto: string,
        de: string,
        para: string,
        lido: boolean,
        data: Date,
        id?: number,
    ) {
        if (id !== undefined) this.id = id;
        if (texto !== undefined) this.texto = texto;
        if (de !== undefined) this.de = de;
        if (para !== undefined) this.para = para;
        if (lido !== undefined) this.lido = lido;
        if (data !== undefined) this.data = data;
    }
}
