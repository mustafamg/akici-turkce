import { IsArray, IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateVideoDto {
    id: number;

    @IsString()
    youtubeId: string;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    youtubeUrl: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    thumbnailUrl: string;

    
    transcriptUrl: string;

    @IsArray()
    categoryIds: number[]

    @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {
        message: 'Valid difficulty required'
    })
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

}
