import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { ExpedirMonto } from "../models/expedicion-certificados-asignacion.model";

/**
 * Constantes para la asignación de expedición de certificados
 */
export const EXPEDICION_CERTIFICADO_ASIGNACION_PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  }
];

/**
 * Constantes para la configuración de la tabla de expedición de certificados
 */
export const CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA: ConfiguracionColumna<ExpedirMonto>[] = [
  { encabezado: 'Monto a expedir', clave: (fila) => fila.montoExpedir, orden: 1 },
];


/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;