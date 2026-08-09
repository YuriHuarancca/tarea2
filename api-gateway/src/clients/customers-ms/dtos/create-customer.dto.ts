import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
//les ponemos pipes para validar los datos que vienen en el body de la request, para que no se rompa la app y se pueda manejar el error de manera correcta
export class CreateCustomerDTO {
    @IsString()
    @IsNotEmpty()
    firstname!: string;

    @IsString()
    @IsNotEmpty()
    lastname!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsOptional()
    phone!: string;

    @IsString()
    @IsOptional()
    address!: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean = true

} 
