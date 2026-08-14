import { PartialType } from '@nestjs/mapped-types';
import { CreateMixedListDto } from './create-mixed-list.dto';

export class UpdateMixedListDto extends PartialType(CreateMixedListDto) {}
