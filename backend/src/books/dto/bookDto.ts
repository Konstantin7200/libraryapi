import { IsNotEmpty, IsPositive } from 'class-validator';

class bookDto {
  @IsNotEmpty()
  olid!: string;
  @IsNotEmpty()
  title!: string;
  @IsNotEmpty()
  authors!: string[];
  coversUrl!: string | null;
  liked!: boolean;
}
class extendedBookDto extends bookDto {
  @IsNotEmpty()
  description!: string;
  @IsPositive()
  likes!: number;
}
export { bookDto, extendedBookDto };
