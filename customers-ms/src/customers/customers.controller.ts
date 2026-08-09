
import { CustomersService } from './customers.service';
import { CreateCustomerDTO } from './dtos/create-customer.dto';
import { UpdateCustomerDTO } from './dtos/update-customer.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, ParseIntPipe } from '@nestjs/common';

@Controller('customers')
export class CustomersController {
    constructor(private readonly service:  CustomersService) {}
    
    //para crear un cliente
    @MessagePattern({cmd: 'customers.create'}) //el parametro puede tener cualquier nombre, pero debe ser el mismo que se envia desde el microservicio
    async create(@Payload() dto:CreateCustomerDTO) {
        return await this.service.create(dto);
    }

    //para listar todos
    @MessagePattern({cmd: 'customers.findAll'}) 
    async findAll() {
        return await this.service.findAll();
    }

    //para listar solo clientes activos
    @MessagePattern({cmd: 'customers.findActive'}) 
    async findActive() {
        return await this.service.findActive();
    }

//para listar solo clientes dados de baja
    @MessagePattern({cmd: 'customers.findInactive'}) 
    async findInactive() {
        return await this.service.findInactive();
    }

    //Buscar uno 
    @MessagePattern({cmd:'customers.findOne'}) 
    async findOne(@Payload('id') id: string) {
        return await this.service.findOne(id);
    }

    //metodo para actualizar un cliente
    @MessagePattern({cmd: 'customers.update'}) 
    async updatecategorie(@Payload() dto: UpdateCustomerDTO) {
        return await this.service.update(dto.id, dto);
    }

    //dar de baja
    @MessagePattern({cmd: 'customers.deactivate'})
    async deactivate(@Payload('id') id: string) {
        return this.service.deactivate(id);
    }

    //restaurar
        @MessagePattern({cmd: 'customers.activate'})
    async activate(@Payload('id') id: string) {
        return this.service.activate(id);
    }

       

    //elimar duro
    @MessagePattern({cmd: 'customers.remove'})
    async remove(@Payload() id:string) {
        return await this.service.remove(id);
    }

}