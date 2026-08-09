
		import Joi from 'joi';
		import 'dotenv/config'; //se importa para que dotenv cargue las variables de entorno desde el archivo .env 

		interface IEnvConfig {
			HOST:string;
			PORT:number;
			PRODUCTS_MS_HOST: string;
			PRODUCTS_MS_PORT: number;
			CATEGORIES_MS_HOST: string
			CATEGORIES_MS_PORT: number
			CUSTOMERS_MS_HOST:string
			CUSTOMERS_MS_PORT:number
		}

		export const envSchema = Joi.object<IEnvConfig>({
			HOST: Joi.string().default('localhost'),
			PORT: Joi.number().integer().min(3000).max(65535).required(),
			PRODUCTS_MS_HOST: Joi.string().default('localhost'),
			PRODUCTS_MS_PORT: Joi.number().integer().min(3000).max(65535).default(3001),
			CATEGORIES_MS_HOST: Joi.string().default('localhost'),
			CATEGORIES_MS_PORT: Joi.number().integer().min(3000).max(65535).default(3002),
			CUSTOMERS_MS_HOST: Joi.string().default('localhost'),
			CUSTOMERS_MS_PORT: Joi.number().integer().min(3000).max(65535).default(3003)

		})
			.unknown(true)// permite que existan otras variables de entorno que no estén definidas en el esquema

		const {error,value} = envSchema.validate(process.env);
		//maneja el error de validación de las variables de entorno, si hay un error lanza una excepción con el mensaje de error
		if (error)
			throw new Error(`Error de validación de varialbes de entorno: ${error}`);

		export const envConfig = value as IEnvConfig;
