import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService,
        @Inject('CATEGORIES_MS_CLIENT') private categoriesClient: ClientProxy
    ) { }

    // Crear producto pero validando categoría
    async create(dto: CreateProductDTO) {
        try {
            //1. validamos si existe la categoria
            const exists = await firstValueFrom(await this.categoriesClient.send({ cmd: 'categories.exists' }, { id: dto.categoryId }));
           //2. Si no existe lanaza error
            if (!exists) {
                throw new RpcException({
                    status: 404,
                    message: `La categoria ${dto.categoryId} no existe`,
                })
            }
            //3. Si existe continuamo con el registro
            return await this.prisma.product.create({data:dto});
        } catch (error: any) {

            if(error instanceof RpcException) throw error; //si hay error lo vuelve a lanzar 

            if (error.code === 'P2002') {
                throw new RpcException({
                    statusCode: 409,
                    message: 'El producto ya existe en el sistema',
                });
            }

            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar registrar el nuevo producto',
            });
        }
    }

    // Listar todos los productos
    async findAll() {
        try {
            return await this.prisma.product.findMany();
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar todos los productos',
            });
        }
    }

    // Listar solo productos activos
    async findActive() {
        try {
            return await this.prisma.product.findMany({
                where: { isActive: true },
            });
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar los productos activos',
            });
        }
    }

    // Listar solo productos dados de baja (inactivos)
    async findInactive() {
        try {
            return await this.prisma.product.findMany({
                where: { isActive: false },
            });
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar los productos inactivos',
            });
        }
    }

    // Buscar un producto por ID
    async findOne(id: string) {
        try {
            const product = await this.prisma.product.findUnique({
                where: { id },
            });

            if (!product) {
                throw new RpcException({
                    statusCode: 404,
                    message: `Producto no encontrado, ID ${id}`,
                });
            }
            return product; // Corregido: ahora retorna el producto encontrado
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar buscar el producto: ${error.message || error}`,
            });
        }
    }

    // Actualizar parcialmente un producto
    async update(id: string, dto: UpdateProductDTO) {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: dto,
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Producto no encontrado para actualizar, ID ${id}`,
                });
            }

            if (error.code === 'P2002') {
                throw new RpcException({
                    statusCode: 409,
                    message: 'Los datos actualizados entran en conflicto con un registro existente',
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar actualizar el producto: ${error.message || error}`,
            });
        }
    }

    // Dar de baja un producto (Soft Delete)
    async softDelete(id: string) {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: { isActive: false },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Producto no encontrado para dar de baja, ID ${id}`,
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar dar de baja el producto: ${error.message || error}`,
            });
        }
    }

    // Restaurar / Activar un producto dado de baja
    async activate(id: string) {
        try {
            return await this.prisma.product.update({
                where: { id },
                data: { isActive: true },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Producto no encontrado para activar, ID ${id}`,
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar activar el producto: ${error.message || error}`,
            });
        }
    }

    // Eliminar un producto físicamente
    async remove(id: string) {
        try {
            await this.prisma.product.delete({
                where: { id },
            });

            //retornamos un mensaje de éxito 
            return {
                statusCode: 200,
                message: `Producto eliminado exitosamente, ID ${id}`,
            }
            //ahora manejamos el error de que el producto no existe
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Producto no encontrado para eliminar, ID ${id}`,
                });
            }
            // si el error es de tipo RpcException, lo lanzamos directamente
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar eliminar el producto: ${error.message || error}`,
            });
        }
    }
}