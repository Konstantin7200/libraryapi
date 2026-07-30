import { Controller } from '@nestjs/common';
import { BookListService } from './book-list.service';

@Controller('book-list')
export class BookListController {
  constructor(private readonly bookListService: BookListService) {}
}
