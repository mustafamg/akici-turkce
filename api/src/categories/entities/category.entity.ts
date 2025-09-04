import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Video } from "src/videos/entities/video.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(()=> Video, (video)=>video.categories)
    @JoinTable({name:'video_categories'})
    videos: Video[];

}