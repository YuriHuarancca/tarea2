
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from './create-product.dto';
import { IsString } from 'class-validator';

export class UpdateProductDTO extends PartialType(CreateProductDTO) {
    @IsString()
    id!: string;
}
