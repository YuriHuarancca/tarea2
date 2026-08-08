
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDTO } from './create-category.dto';
import { IsNumber } from 'class-validator';

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {
    @IsNumber()
    id!: number;
}
