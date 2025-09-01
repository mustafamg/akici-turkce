import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  LEARNER = 'learner',
  ADMIN = 'admin',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    default: UserRole.LEARNER,
  })
  role: UserRole;
}
