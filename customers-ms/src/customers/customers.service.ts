import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDTO } from './dtos/create-customer.dto';
import { UpdateCustomerDTO } from './dtos/update-customer.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService) { }


    // Crear cliente
    async create(dto: CreateCustomerDTO) {
        try {
            return await this.prisma.customer.create({ data: dto });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new RpcException({
                    statusCode: 409,
                    message: 'La cliente ya existe en el sistema',
                });
            }

            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar registrar el nuevo cliente',
            });
        }
    }

    // Listar todos el cliente
    async findAll() {
        try {
            return await this.prisma.customer.findMany();
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar todos el clientes',
            });
        }
    }

    // Listar solo customer activos
    async findActive() {
        try {
            return await this.prisma.customer.findMany({
                where: { isActive: true },
            });
            //
        } catch (error: any) {
            throw new RpcException({
                statusCode: 500,
                message: 'Error al intentar listar clientes activas',
            });
        }
    }

    // Listar solo clientes dados de baja (inactivos)
async findInactive() {
    try {
        const categories = await this.prisma.customer.findMany({
            where: { isActive: false },
        });
        // Validar si el array está vacío
        if (categories.length === 0) {
            throw new RpcException({
                statusCode: 404,
                message: 'No se encontraron clientes inactivas',
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
            message: 'Error al intentar listar el clientes inactivas',
        });
    }
}

    // Buscar un cliente por ID
    async findOne(id: string) {
        try {
            const customer = await this.prisma.customer.findUnique({
                where: { id },
            });

            if (!customer) {
                throw new RpcException({
                    statusCode: 404,
                    message: `cliente no encontrado, ID ${id}`,
                });
            }
            return customer; // Corregido: ahora retorna el cliente encontrado
        } catch (error: any) {
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar buscar el cliente: ${error.message || error}`,
            });
        }
    }

    // Actualizar parcialmente un cliente
    async update(id: string, dto: UpdateCustomerDTO) {
        try {
            return await this.prisma.customer.update({
                where: { id },
                data: dto
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `cliente no encontrada para actualizar, ID ${id}`,
                });
            }

            if (error.code === 'P2002') {
                throw new RpcException({
                    statusCode: 409,
                    message: 'Los datos actualizados entran en conflicto con una cliente existente',
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar actualizar : ${error.message || error}`,
            });
        }
    }

    // Dar de baja un cliente (Soft Delete)
    async deactivate(id: string) {
        try {
            return await this.prisma.customer.update({
                where: { id },
                data: { isActive: false },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `cliente no encontrado para dar de baja, ID ${id}`,
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar dar de baja el cliente: ${error.message || error}`,
            });
        }
    }

    // Restaurar / Activar un cliente dado de baja
    async activate(id: string) {
        try {
            return await this.prisma.customer.update({
                where: { id },
                data: { isActive: true },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `cliente no encontrado para activar, ID ${id}`,
                });
            }

            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar activar el cliente: ${error.message || error}`,
            });
        }
    }

        // Eliminar un cliente físicamente
    async remove(id: string) {
        try {
            await this.prisma.customer.delete({
                where: { id },
            });

            //retornamos un mensaje de éxito 
            return {
                statusCode: 200,
                message: `cliente eliminado exitosamente, ID ${id}`,
            }
            //ahora manejamos el error de que el cliente no existe
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new RpcException({
                    statusCode: 404,
                    message: `cliente no encontrada para eliminar, ID ${id}`,
                });
            }
            // si el error es de tipo RpcException, lo elzamos directamente
            if (error instanceof RpcException) throw error;

            throw new RpcException({
                statusCode: 500,
                message: `Error al intentar eliminar el cliente: ${error.message || error}`,
            });
        }
    }
}