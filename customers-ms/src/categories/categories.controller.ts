
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, ParseIntPipe } from '@nestjs/common';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly service:  CategoriesService) {}
    
    //este es para comunicar al con el microservicio products
    @MessagePattern({cmd: 'categories.exists'}) //el parametro puede tener cualquier nombre, pero debe ser el mismo que se envia desde el microservicio
    async categoryExists(@Payload('id', ParseIntPipe) id: number) {
        return await this.service.categoryExists(id);
    }

    //para crear un categorieo
    @MessagePattern({cmd: 'categories.create'}) //el parametro puede tener cualquier nombre, pero debe ser el mismo que se envia desde el microservicio
    async create(@Payload() dto:CreateCategoryDTO) {
        return await this.service.create(dto);
    }

    //para listar todos
    @MessagePattern({cmd: 'categories.findAll'}) 
    async findAll() {
        return await this.service.findAll();
    }

    //para listar solo categorieos activos
    @MessagePattern({cmd: 'categories.findActive'}) 
    async findActive() {
        return await this.service.findActive();
    }

//para listar solo categorieos dados de baja
    @MessagePattern({cmd: 'categories.findInactive'}) 
    async findInactive() {
        return await this.service.findInactive();
    }

    //Buscar uno 
    @MessagePattern({cmd:'categories.findOne'}) 
    async findOne(@Payload('id') id: number) {
        return await this.service.findOne(id);
    }

    //metodo para actualizar un categorieo
    @MessagePattern({cmd: 'categories.update'}) 
    async updatecategorie(@Payload() dto: UpdateCategoryDTO) {
        return await this.service.update(dto.id, dto);
    }

    //dar de baja
    @MessagePattern({cmd: 'categories.deactivate'})
    async deactivate(@Payload('id') id: number) {
        return this.service.deactivate(id);
    }

    //restaurar
        @MessagePattern({cmd: 'categories.activate'})
    async activate(@Payload('id') id: number) {
        return this.service.activate(id);
    }

       

    //elimar duro
    @MessagePattern({cmd: 'categories.remove'})
    async remove(@Payload() id:number) {
        return await this.service.remove(id);
    }

}