import { LicitacionResponse, ParticipanteLicitacion } from "../models/solicitud.model";
/**
 * Identificador del procedimiento.
 * @constant {number} ID_PROCEDIMIENTO - El valor del identificador del procedimiento.
 */
export const ID_PROCEDIMIENTO = 120501;

/**
 * Configuración de las columnas para la tabla de licitaciones vigentes.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave de acceso y orden.
 * @constant {Array} CONFIGURACION_ACCIONISTAS_TABLA - Arreglo de configuraciones de columnas para la tabla.
 */
export const CONFIGURACION_ACCIONISTAS_TABLA = [
  {
    encabezado: 'Número de licitación',
    clave: (ele: LicitacionResponse): string => ele.numeroLicitacion,
    orden: 1
  },
  {
    encabezado: 'Fecha de evento de licitación pública',
    clave: (ele: LicitacionResponse): string => ele.fechaConcurso,
    orden: 2
  },
  {
    encabezado: 'Descripción del producto ',
    clave: (ele: LicitacionResponse): string => ele.nombreProducto,
    orden: 3
  },
  {
    encabezado: 'Monto adjudicado',
    clave: (ele: LicitacionResponse): number => ele.montoAdjudicado,
    orden: 4
  },
  {
    encabezado: 'Fecha inicio vigencia',
    clave: (ele: LicitacionResponse): string => ele.fechaInicioVigencia,
    orden: 5
  },
  {
    encabezado: 'Fecha fin vigencia',
    clave: (ele: LicitacionResponse): string => ele.fechaFinVigenciaAprobada,
    orden: 6
  }
];

/**
 * Configuración de las columnas para la tabla de participantes de licitación.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave de acceso y orden.
 * @constant {Array} CONFIGURACION_ACCIONISTAS - Arreglo de configuraciones de columnas para la tabla.
 */
export const CONFIGURACION_ACCIONISTAS = [
  {
    encabezado: 'Registro Federal de Contribuyentes ',
    clave: (ele: ParticipanteLicitacion): string => ele.rfc,
    orden: 1
  },
];

/**
 * Genera el mensaje HTML para error de registro
 * @returns Mensaje HTML formateado para error de registro
 */
export const MSG_ERROR_REGISTRO = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`;


/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;