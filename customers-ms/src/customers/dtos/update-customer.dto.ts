
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDTO } from './create-customer.dto';
import { IsString } from 'class-validator';

export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) {
    @IsString()
    id!: string;
}
