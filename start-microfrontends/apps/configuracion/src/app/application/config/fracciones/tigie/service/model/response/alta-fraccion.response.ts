import { AltaFraccionRequest } from '../request/alta-fraccion.request';

/**
 * Response de alta fraccion
 */
export interface AltaFraccionResponse {
  codigo: string;
  mensaje: string;
  datos?: AltaFraccionRequest;
}
