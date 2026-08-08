import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
//les ponemos pipes para validar los datos que vienen en el body de la request, para que no se rompa la app y se pueda manejar el error de manera correcta
export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsPositive()
    price!: number;

    @IsNumber()
    @Min(0)
    stock!: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean = true

    @IsNumber()
    @IsNotEmpty()
    categoryId!: number;
} 