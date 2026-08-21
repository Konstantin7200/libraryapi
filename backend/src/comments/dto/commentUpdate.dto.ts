import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CommentUpdateDto {
  @IsNotEmpty()
  @IsString()
  text!: string;
  @IsPositive()
  @IsInt()
  id!: number;
}
