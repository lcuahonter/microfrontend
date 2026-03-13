import { ConfiguracionColumna } from "@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model";
import { TramiteAsociados } from "../../../shared/models/tramite-asociados.model";
/**
   * Configuración para las columnas de la tabla.
   * Define cómo se mostrarán los datos de los trámites asociados.
   */
  export const CONFIGURACIONCOLUMNA: ConfiguracionColumna<TramiteAsociados>[] = [
    { encabezado: '', clave: (item: TramiteAsociados) => item.id, orden: 1 },
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
