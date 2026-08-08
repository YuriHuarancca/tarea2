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
import { CreateProductDTO } from './dtos/create-product.dto'; 
import { UpdateProductDTO } from './dtos/update-product.dto'; 

@Controller('products') 
export class ProductsMsController {
    constructor(
        @Inject('PRODUCTS-MS-CLIENT')
        private readonly clientProductsMS: ClientProxy, 
    ) { }

    // crear
    @Post()
    create(@Body() dto: CreateProductDTO) {
        return this.clientProductsMS.send({ cmd: 'products.create' }, dto).pipe(
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
        return this.clientProductsMS.send({ cmd: 'products.findAll' }, {}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

      // listar solo activos
    @Get('/active')
    findActive() {
        return this.clientProductsMS.send({ cmd: 'products.findActive' }, {}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

    // listar solo inactivos
    @Get('/inactive')
    findInactive() {
        return this.clientProductsMS.send({ cmd: 'products.findInactive' }, {}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

    // listar por id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientProductsMS.send({ cmd: 'products.findOne' }, { id }).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }

    // actualizar
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDTO) {
        return this.clientProductsMS.send({ cmd: 'products.update' }, { ...dto, id }).pipe(//aqui pusimos los ...dto adelante para que el id no se sobreescriba con el dto, ya que el dto no tiene id
        catchError((err) => {
            const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
            throw new HttpException(err.message || 'Error en el microservicio', statusCode);
        })
    );
    }

    // Soft Delete (Desactivar)
    @Patch('/deactivate/:id')
    softDelete(@Param('id') id: string ) {
        return this.clientProductsMS.send({ cmd: 'products.deactivate' },{id}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message || 'Error en el microservicio', statusCode);
            })
        );
    }

    // Activar
    @Patch('/activate/:id')
    activate(@Param('id') id: string) {
        // Enviamos el id directo
        return this.clientProductsMS.send({ cmd: 'products.activate' }, {id}).pipe(
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message || 'Error en el microservicio', statusCode);
            })
        );
    }

    // eliminar
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientProductsMS.send(
            { cmd: 'products.remove' }, id).pipe( //aqui el id se envia directo, no como objeto
            catchError((err) => {
                const statusCode = typeof err.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;
                throw new HttpException(err.message, statusCode);
            })
        );
    }
}