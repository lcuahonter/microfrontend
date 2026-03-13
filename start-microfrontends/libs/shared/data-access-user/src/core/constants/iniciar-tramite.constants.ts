import { BaseResponse } from '../models/5701/base-response.model';

/**
 * Constantes e interfaces para el resolver y servicio de inicialización de trámites
 */

/**
 * Interface para la configuración del trámite
 */
export interface IniciarConfig {
  procedureId: string;
}

/**
 * Interface para la request de inicialización
 */
export interface IniciarRequest {
  rfc_solicitante: string;
  rol_actual: string;
  folio_programa?:string;
  idTipoTramite?:number;
  discriminador?:string;
  tipoPrograma?:string;
  idProgramaAutorizado?:string
}

/**
 * Interface para el resultado del resolver
 */
export interface IniciarResolverResult {
  success: boolean;
  error?: string;
  response?: BaseResponse<unknown>;
  payload?: IniciarRequest;
}

/**
 * Constantes para el servicio de inicialización
 */
export const INICIAR_TRAMITE_CONSTANTS = {
  
  /**
   * Código de respuesta exitosa
   */
  SUCCESS_CODE: '00',
  
  /**
   * Mensajes de error por defecto
   */
  ERROR_MESSAGES: {
    SAVE_ERROR: 'Ocurrió un error al guardar la solicitud.',
    INIT_ERROR: 'Error al iniciar el trámite',
    CONNECTION_ERROR: 'Error de conexión',
    UNEXPECTED_ERROR: 'Error inesperado al iniciar el trámite.'
  },
  
  /**
   * Configuración de alertas
   */
  ALERT_CONFIG: {
    TIMEOUT: 5000,
    ENABLE_HTML: true,
    CLOSE_BUTTON: true
  }
} as const;
