import { Cupo } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
/**
 * Definición de datos de prueba para cupos y configuraciones.
 * Sirve como valores iniciales o mocks para pruebas unitarias.
 * Incluye información de producto, subproducto, empresa y montos.
 */
export const NUEVO_CUPOS: Cupo = {
  cupo: 100,
  nombreProducto: 'Producto X',
  nombreSubproducto: 'Subproducto Y',
  mecanismoAsignacion: 'Automático',
  tipoCupo: 'Anual',
};

/**
 * Texto de alerta para terceros.
 * 
 * Este texto se muestra como un mensaje de advertencia cuando no se han agregado mercancías al trámite.
 */
export const BUSCAR_EMPRESA_ERROR = 'RFC es un dato requerido para realizar la bÃºsqueda.';