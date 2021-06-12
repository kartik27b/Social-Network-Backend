import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsIn(['photo', 'video', 'none'])
  type: string;
}
