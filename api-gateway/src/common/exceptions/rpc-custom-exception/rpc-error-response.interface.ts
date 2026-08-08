		export interface RpcErrorResponse {
		  status: number;
		  message: string;
		  code?: string;
		  details?: unknown;
		  path: string;
		  timestamp: string;
		}
