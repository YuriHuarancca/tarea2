import Joi from 'joi';
import 'dotenv/config'; //se importa para que dotenv cargue las variables de entorno desde el archivo .env 

interface IEnvConfig {
    HOST: string;
    PORT: number;
    NODE_ENV: string
    DATABASE_URL: string; // aquí añadimos la coneción con la base de datos
}

export const envSchema = Joi.object<IEnvConfig>({
    HOST: Joi.string().default('localhost'),
    PORT: Joi.number().integer().min(3000).max(65535).required(),
    NODE_ENV: Joi.string().required().default('development'),
    DATABASE_URL: Joi.string().required(),
})
    .unknown(true)// permite que existan otras variables de entorno que no estén definidas en el esquema

const { error, value } = envSchema.validate(process.env);
//maneja el error de validación de las variables de entorno, si hay un error lanza una excepción con el mensaje de error
if (error)
    throw new Error(`Error de validación de variabes de entorno: ${error}`);

export const envConfig = value as IEnvConfig; //exportamos para usar en main