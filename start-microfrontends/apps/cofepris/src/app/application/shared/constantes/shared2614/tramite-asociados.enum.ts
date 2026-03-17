/**
 * Configuración de las columnas para la tabla de trámites asociados.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente en el objeto, y un orden.
 */
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { TramiteAsociados } from "../../../shared/models/tramite-asociados.model";

export const CONFIGURACIONCOLUMNA: ConfiguracionColumna<TramiteAsociados>[] = [
  {
    /**
     * Encabezado de la columna.
     */
    encabezado: '',

    /**
     * Clave para acceder al identificador del trámite asociado.
     */
    clave: (item: TramiteAsociados) => item.id,

    /**
     * Orden de la columna.
     */
    orden: 1,
  },
  {
    encabezado: 'Folio trámite',
    clave: (item: TramiteAsociados) => item.folioTramite,
    orden: 2,
  },
  {
    encabezado: 'Tipo trámite',
    clave: (item: TramiteAsociados) => item.tipoTramite,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (item: TramiteAsociados) => item.estatus,
    orden: 4,
  },
  {
    encabezado: 'Fecha alta de registro',
    clave: (item: TramiteAsociados) => item.fetchaAltaDeRegistro,
    orden: 5,
  },
];