import { IsEnum, IsString, MinLength, Validate } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { PasswordStrengthValidator } from 'src/auth/validators/passwordStrength.validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Validate(PasswordStrengthValidator)
  password: string;

  @IsEnum(UserRole, {
    message: 'Invalid role. Role must be "learner" or "admin".',
  })
  role: UserRole;
}
