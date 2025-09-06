import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type VideoStatus = 'ok' | 'unavailable' | 'private';

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ name: 'youtube_id', type: 'varchar', length: 32 })
  youtubeId!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ name: 'duration_sec', type: 'int', unsigned: true, default: 0 })
  durationSec!: number;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 512, nullable: true })
  thumbnailUrl!: string | null;

  @Index()
  @Column({ type: 'enum', enum: ['ok', 'unavailable', 'private'], default: 'ok' })
  status!: VideoStatus;

  @Column({ name: 'has_transcript', type: 'boolean', default: false })
  hasTranscript!: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt!: Date;
}
