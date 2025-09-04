import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from 'src/categories/entities/category.entity';

export enum Difficulty {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    youtubeId: string;

    @Column()
    youtubeUrl: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    thumbnailUrl: string;

    @Column({ nullable: true })
    transcriptUrl: string;

    @Column()
    difficulty: Difficulty;

    @Column({ default: false })
    isFeatured: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: 0 })
    views: number;

    @ManyToMany(() => Category, (category) => category.videos)
    categories: Category[];

}
