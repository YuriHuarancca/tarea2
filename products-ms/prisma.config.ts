import "dotenv/config";
		import { defineConfig } from "prisma/config";
		import { envConfig } from "./src/config/env.validation";

		export default defineConfig({
		  schema: "prisma/schema.prisma",
		  migrations: {
			path: "prisma/migrations",
		  },
		  datasource: {
			url: envConfig.DATABASE_URL,//Le cambiamos la dirección hacia el validador
		  },
		});