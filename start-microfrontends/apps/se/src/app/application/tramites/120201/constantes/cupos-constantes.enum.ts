import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { InstrumentoCupoTPLForm } from "../models/cupos.model";

/**
 * Constantes para el manejo de los pasos del wizard de cupos
 * 
 */
export const CUPOS_PASOS = [
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
 * Constantes para el manejo de los pasos del wizard de cupos
 * @type {ConfiguracionColumna<InstrumentoCupoTPLForm>[]}
 * @description Configuración de las columnas para la tabla de cupos
 */
export const CONFIGURACION_PARA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<InstrumentoCupoTPLForm>[] = [
  { encabezado: 'Tratado o acuerdo', clave: (fila) => fila.cveTratado, orden: 1 },
  { encabezado: 'Clasificación del regimen', clave: (fila) => fila.cveRegimenClasificacion, orden: 2 },
  { encabezado: 'País destino/origen', clave: (fila) => fila.cvePaisDestino, orden: 3 },
  { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionArancelaria, orden: 4 },
  { encabezado: 'Descripción de la categoría textil', clave: (fila) => fila.categoriaTextilDescripcion, orden: 5 },
  { encabezado: 'Descripción del producto', clave: (fila) => fila.productoDescripcion, orden: 6 },
  { encabezado: 'Clasificación del subproducto', clave: (fila) => fila.subProductoClasificacion, orden: 7 },
  { encabezado: 'Fecha inicio vigencia', clave: (fila) => fila.fechaInicioVigencia, orden: 8 },
  { encabezado: 'Fecha fin vigencia', clave: (fila) => fila.fechaFinVigencia, orden: 9 },
  { encabezado: 'Monto disponible', clave: (fila) => fila.montoDisponible, orden: 10 },
  { encabezado: 'Categoría textil', clave: (fila) => fila.categoriaTextil, orden: 11 }
];

/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;