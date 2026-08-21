import { IsNotEmpty, IsString } from 'class-validator';

class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  bookOlid!: string;
  @IsNotEmpty()
  @IsString()
  text!: string;
}
export { CreateCommentDto };
