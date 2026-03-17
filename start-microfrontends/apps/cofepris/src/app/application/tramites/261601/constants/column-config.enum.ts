
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { TramitesAsociados } from '../models/destinatario.model';

/**
 * Configuración de las columnas de la tabla para los trámites asociados.
 */
export const DESTINATARIO_CONFIGURACION_TABLA: ConfiguracionColumna<TramitesAsociados>[] = [
  {
    /** Configuración de la columna para el número */
    encabezado: '',
    clave: (fila) => fila?.No,
    orden: 1,
  },
  {
    /** Configuración de la columna para el folio del trámite */
    encabezado: 'Folio tramite',
    clave: (fila) => fila?.folioTramite,
    orden: 2,
  },
  {
    /** Configuración de la columna para el tipo de trámite */
    encabezado: 'Tipo tramite',
    clave: (fila) => fila?.tipoTramite,
    orden: 3,
  },
  {
    /** Configuración de la columna para el estatus */
    encabezado: 'Estatus',
    clave: (fila) => fila?.estatus,
    orden: 4,
  },
  {
    /** Configuración de la columna para la fecha de alta del registro */
    encabezado: 'Fecha alta de registro',
    clave: (fila) => fila?.fechaaltaderegistro,
    orden: 5,
  },
];