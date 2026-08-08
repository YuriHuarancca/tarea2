import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }


// esto es para buscar y comunicar si existe o no categoría.////////////////////////////////7
    async categoryExists(id: number) {
        try {
            const category =  await this.prisma.category.findUnique({
                where: { id:id },
            });
            return !!category; //true si existe la categoriay false si no.

        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: `error interno al intentar encontrar categoria `,
            });
        }
    }



    // Crear categoria
    async create(dto: CreateCategoryDTO) {
        try {
            return await this.prisma.category.create({ data: dto });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new RpcException({
                    statusCode: 409,
                    message: 'La categoría ya existe en el sistema',
                });
            }

            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar registrar la nueva categoría',
            });
        }
    }

    // Listar todos las categoria
    async findAll() {
        try {
            return await this.prisma.category.findMany();
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar todos las categorias',
            });
        }
    }

    // Listar solo category activos
    async findActive() {
        try {
            return await this.prisma.category.findMany({
                where: { isActive: true },
            });
            //
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar categorías activas',
            });
        }
    }

    // Listar solo categorias dados de baja (inactivos)
async findInactive() {
    try {
        const categories = await this.prisma.category.findMany({
            where: { isActive: false },
        });
        // Validar si el array está vacío
        if (categories.length === 0) {
            throw new RpcException({
                statusCode: 404,
                message: 'No se encontraron categorías inactivas',
            });
        }

        return categories;

    } catch (error: any) {
        // Si el error ya es un RpcException (como el 404 de arriba), lo dejamos pasar tal cual
        if (error instanceof RpcException) {
            throw error;
        }

        throw new RpcException({
            statusCode: 500,
            message: 'Error al intentar listar las categorías inactivas',
        });
    }
}

    // Buscar un categoria por ID
    async findOne(id: number) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id },
            });

            if (!category) {
                throw new RpcException({
                    statusCode: 404,
                    message: `Categoría no encontrado, ID ${id}`,
                });
            }
            return category; // Corregido: ahora retorna el categoria encontrado
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar buscar el categoría: ${error.message || error}`,
            });
        }
    }

    // Actualizar parcialmente un categoria
    async update(id: number, dto: UpdateCategoryDTO) {
        try {
            return await this.prisma.category.update({
                where: { id },
                data: dto
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Categoría no encontrada para actualizar, ID ${id}`,
                });
            }

            if (error.code === 'P2002') {
                throw new RpcException({
                    statusCode: 409,
                    message: 'Los datos actualizados entran en conflicto con una categoría existente',
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar actualizar : ${error.message || error}`,
            });
        }
    }

    // Dar de baja un categoria (Soft Delete)
    async deactivate(id: number) {
        try {
            return await this.prisma.category.update({
                where: { id },
                data: { isActive: false },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Categoría no encontrado para dar de baja, ID ${id}`,
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar dar de baja la categoría: ${error.message || error}`,
            });
        }
    }

    // Restaurar / Activar un categoria dado de baja
    async activate(id: number) {
        try {
            return await this.prisma.category.update({
                where: { id },
                data: { isActive: true },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Categoría no encontrado para activar, ID ${id}`,
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar activar el categoría: ${error.message || error}`,
            });
        }
    }

        // Eliminar un categoria físicamente
    async remove(id: number) {
        try {
            await this.prisma.category.delete({
                where: { id },
            });

            //retornamos un mensaje de éxito 
            return {
                statusCode: 200,
                message: `Categoría eliminado exitosamente, ID ${id}`,
            }
            //ahora manejamos el error de que el categoria no existe
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `Categoría no encontrada para eliminar, ID ${id}`,
                });
            }
            // si el error es de tipo RpcException, lo lanzamos directamente
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar eliminar la categoría: ${error.message || error}`,
            });
        }
    }
}