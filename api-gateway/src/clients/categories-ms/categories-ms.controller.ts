import { 
  Controller, 
  Inject, 
  Get, 
  HttpException, 
  HttpStatus, // <-- 1. Importamos HttpStatus
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { CreateCategoryDTO } from './dtos/create-category.dto'; 
import { UpdateCategoryDTO } from './dtos/update-category.dto'; 

@Controller('categories') 
export class CategoriesMsController {
    constructor(
        @Inject('CATEGORIES-MS-CLIENT')
        private readonly clientCategoriesMS: ClientProxy, 
    ) { }

    // crear
    @Post()
    create(@Body() dto: CreateCategoryDTO) {
        return this.clientCategoriesMS.send({ cmd: 'categories.create' }, dto).pipe(
            catchError((err) => {
                // 2. Evaluamos si err.status es un número válido. Si no, mandamos un error 500 o 400.
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message || 'Error en el microservicio', statusCode);
            })
        );
    }

    // listar
    @Get()
    findAll() {
        return this.clientCategoriesMS.send({ cmd: 'categories.findAll' }, {}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

      // listar solo activos
    @Get('/active')
    findActive() {
        return this.clientCategoriesMS.send({ cmd: 'categories.findActive' }, {}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

    // listar solo inactivos
    @Get('/inactive')
    findInactive() {
        return this.clientCategoriesMS.send({ cmd: 'categories.findInactive' }, {}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

    // listar por id
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.clientCategoriesMS.send({ cmd: 'categories.findOne' }, { id }).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

    // actualizar
    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateCategoryDTO) {
        return this.clientCategoriesMS.send({ cmd: 'categories.update' }, { ...dto, id }).pipe(//aqui pusimos los ...dto adelante para que el id no se sobreescriba con el dto, ya que el dto no tiene id
        catchError((err) => {
            const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(err.message || 'Error en el microservicio', statusCode);
        })
    );
    }

    // Soft Delete (Desactivar)
    @Patch('/deactivate/:id')
    softDelete(@Param('id') id: number ) {
        return this.clientCategoriesMS.send({ cmd: 'categories.deactivate' },{id}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message || 'Error en el microservicio', statusCode);
            })
        );
    }

    // Activar
    @Patch('/activate/:id')
    activate(@Param('id') id: number) {
        // Enviamos el id directo
        return this.clientCategoriesMS.send({ cmd: 'categories.activate' }, {id}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message || 'Error en el microservicio', statusCode);
            })
        );
    }

    // eliminar
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.clientCategoriesMS.send(
            { cmd: 'categories.remove' }, id).pipe( //aqui el id se envia directo, no como objeto
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }
}