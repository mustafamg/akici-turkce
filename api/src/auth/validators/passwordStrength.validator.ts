// src/auth/validators/password.validator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'passwordStrength', async: false })
@Injectable()
export class PasswordStrengthValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?~]/.test(password);

    return hasLetter && hasNumber && hasSymbol;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must contain at least one letter, one number, and one symbol.';
  }
}
