import { nanoid } from 'nanoid';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

/**
 * Genera un token único usando nanoid
 * @returns Token único de 21 caracteres
 */
export function generateToken(): string {
    return nanoid(21);
}

/**
 * Crea la URL completa del formulario con el token
 * @param token - Token único
 * @param baseUrl - URL base opcional (por ejemplo, del Origin de la petición)
 * @returns URL completa
 */
export function createFormURL(token: string, baseUrl?: string): string {
    const base = baseUrl || FRONTEND_URL;
    return `${base}/form/${token}`;
}

/**
 * Valida el formato de un token
 * @param token - Token a validar
 * @returns true si el formato es válido
 */
export function isValidTokenFormat(token: string): boolean {
    // nanoid genera tokens de 21 caracteres con caracteres URL-safe
    return typeof token === 'string' && token.length === 21 && /^[A-Za-z0-9_-]+$/.test(token);
}
