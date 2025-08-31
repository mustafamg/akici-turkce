import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Video } from "src/videos/entities/video.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Video, (video) => video.category)
    videos: Video[];

    @ManyToMany(()=> Video, (video)=>video.categories)
    @JoinTable({name:'video_categories'})
    videoss: Video[];

}