import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
   
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}