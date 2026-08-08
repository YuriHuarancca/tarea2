
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    constructor(private readonly service:  ProductsService) {}
    
    //para crear un producto
    @MessagePattern({cmd: 'products.create'}) //el parametro puede tener cualquier nombre, pero debe ser el mismo que se envia desde el microservicio
    async create(@Payload() dto:CreateProductDTO) {
        return await this.service.create(dto);
    }

    //para listar todos
    @MessagePattern({cmd: 'products.findAll'}) 
    async findAll() {
        return await this.service.findAll();
    }

    //para listar solo productos activos
    @MessagePattern({cmd: 'products.findActive'}) 
    async findActive() {
        return await this.service.findActive();
    }

//para listar solo productos dados de baja
    @MessagePattern({cmd: 'products.findInactive'}) 
    async findInactive() {
        return await this.service.findInactive();
    }

    //Buscar uno 
    @MessagePattern({cmd:'products.findOne'}) 
    async findOne(@Payload('id') id: string) {
        return await this.service.findOne(id);
    }

    //metodo para actualizar un producto
    @MessagePattern({cmd: 'products.update'}) 
    async updateProduct(@Payload() dto: UpdateProductDTO) {
        return await this.service.update(dto.id, dto);
    }


    //dar de baja
    @MessagePattern({cmd: 'products.deactivate'})
    async softDelete(@Payload('id') id: string) {
        return this.service.softDelete(id);
    }

    //restaurar
        @MessagePattern({cmd: 'products.activate'})
    async activate(@Payload('id') id: string) {
        return this.service.activate(id);
    }   
    
    //elimar duro
    @MessagePattern({cmd: 'products.remove'})
    async remove(@Payload() id:string) {
        return await this.service.remove(id);
    }
}