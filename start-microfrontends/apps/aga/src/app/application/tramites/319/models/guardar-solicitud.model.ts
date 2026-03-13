import { Solicitante } from '../../31907/models/cadena-original-request';
import { FinalDataToSend } from './tramite319-state.model';

/**
 * @interface GuardarSolicitudT319
 * @description
 * Interfaz que representa la estructura de los datos necesarios para guardar una solicitud del trámite 319.
 */
export interface GuardarSolicitudT319 {
  /**
   * @property {string | null} idSolicitud
   * @description
   * Identificador único de la solicitud.
   */
  idSolicitud: string | null;

  /**
   * @property {Solicitante} solicitante
   * @description
   * Información del solicitante de la operación.
   */
  solicitante: Solicitante;

  /**
   * @property {string} cve_rol_capturista
   * @description
   * Clave del rol del usuario capturista.
   */
  cve_rol_capturista: string;

  /**
   * @property {string} cve_usuario_capturista
   * @description
   * Clave de usuario del capturista.
   */
  cve_usuario_capturista: string;

  /**
   * @property {FinalDataToSend} periodo
   * @description
   * Datos del período a guardar.
   */
  periodo: FinalDataToSend;
}
