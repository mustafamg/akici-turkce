import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private UserRepo: Repository<User>) {}
  async create(userDetails: CreateUserDto) {
    const user = await this.UserRepo.create(userDetails);
    return this.UserRepo.save(user);
  }

  findAll() {
    return this.UserRepo.find();
  }

  async findByUsername(username: string) {
    return this.UserRepo.findOne({ where: { username } });
  }

  async findOne(id: number) {
    return this.UserRepo.findOne({
      where: { id },
      select: ['id', 'username', 'role'],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
