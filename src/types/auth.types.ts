// ==================== AUTENTICAÇÃO ====================

import type { ApiResult } from "./api.types";

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	phone: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	createdAt?: string;
}

export interface AuthData {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
}

// Sobrescreve ApiResponse pra auth
export type AuthResponse = ApiResult<AuthData>;

export interface AuthContext {
	token: string | null;
	user: User | null;
	isLoading: boolean;
	signIn: (credentials: LoginRequest) => Promise<void>;
	signOut: () => Promise<void>;
	signUp: (credentials: RegisterRequest) => Promise<void>;
}
