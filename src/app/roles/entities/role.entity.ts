import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'varchar', length: 100 })
    descricao: string;

    constructor(nome: string, descricao: string) {
        if (nome !== undefined) this.nome = nome;
        if (descricao !== undefined) this.descricao = descricao;
    }
}
