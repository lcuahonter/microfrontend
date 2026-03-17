/**
 * Importación de tipos y modelos necesarios para la configuración de catálogos y columnas.
 */
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import { FilaData, FilaData2 } from '../models/fila-model';

/**
 * Texto informativo que se muestra al usuario sobre la funcionalidad de copiar datos de una solicitud.
 */
export const TEXTOS_SOLICITUD = `Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.`

/**
 * Encabezados de la tabla de solicitudes.
 * Define los títulos de las columnas que se mostrarán en la tabla.
 */
export const SOLICITUD_HEADER = {
  "hSolicitud": [
    "Fecha Creación",
    "Mercancía",
    "Cantidad",
    "Proveedor"
  ]
}

/**
 * Configuración de catálogos utilizados en el formulario.
 * Cada catálogo contiene información como el nombre, si es requerido,
 * la primera opción que se muestra y una lista de opciones disponibles.
 */
export const CATALOGOS = {
  ENVASADO: {
    labelNombre: 'Envasado',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  UTILIZO_CAFE_COMO: {
    labelNombre: 'Utilizó cafe como materia prima importada para elaborar este producto?',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  PAIS_DE_IMPORTACION: {
    labelNombre: 'País de importación',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  FRACCION_ARANCELARIA: {
    labelNombre: 'Fracción arancelaria',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  UNIDAD_DE_MEDIDA: {
    labelNombre: 'Unidad de medida',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  DOLAR: {
    labelNombre: ' ',
    required: true,
    primerOpcion: 'Selecciona Moneda',
    catalogos: [],
  } as CatalogosSelect,

  EL_CAFE: {
    labelNombre: 'El café tiene características especiales?',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  PAIS_DE_TRANSBORDO: {
    labelNombre: 'País de transbordo',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,

  MEDIO_DE_TRANSPORTE: {
    labelNombre: 'Medio de transporte',
    required: true,
    primerOpcion: 'Seleccione una opción',
    catalogos: [],
  } as CatalogosSelect,
};

/**
 * Configuración de las columnas de la tabla de solicitudes.
 * Define el encabezado, la clave para obtener el valor de cada fila y el orden de las columnas.
 */
export const CONFIGURACION_COLUMNAS_SOLI: ConfiguracionColumna<FilaData>[] = [
  {
    encabezado: 'Envasado',
    clave: (fila) => fila.datosDelTramiteRealizar.envasadoen,
    orden: 1,
  },
  {
    encabezado: '¿Utilizó café como materia prima?',
    clave: (fila) => fila.datosDelTramiteRealizar.utilizoCafeComo,
    orden: 2,
  },
  {
    encabezado: 'Cantidad utilizada',
    clave: (fila) => fila.datosDelTramiteRealizar.cantidadutilizada,
    orden: 3,
  },
  {
    encabezado: 'No. pedimento',
    clave: (fila) => fila.datosDelTramiteRealizar.numerodepedimento,
    orden: 4,
  },
  {
    encabezado: 'País',
    clave: (fila) => fila.datosDelTramiteRealizar.paisdeimportacion,
    orden: 5,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (fila) => fila.datosDelTramiteRealizar.fraccionarancelaria,
    orden: 6,
  },
  {
    encabezado: 'Cantidad',
    clave: (fila) => fila.datosDelTramiteRealizar.cantidad,
    orden: 7,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (fila) => fila.datosDelTramiteRealizar.unidaddemedida,
    orden: 8,
  },
  {
    encabezado: 'Precio aplicable',
    clave: (fila) => fila.datosDelTramiteRealizar.precioapplicable,
    orden: 9,
  },
  {
    encabezado: 'Moneda',
    clave: (fila) => fila.datosDelTramiteRealizar.dolar,
    orden: 10,
  },
  {
    encabezado: 'Lote',
    clave: (fila) => fila.datosDelTramiteRealizar.lote,
    orden: 11,
  },
  {
    encabezado: 'Otras marcas',
    clave: (fila) => fila.datosDelTramiteRealizar.otrasmarcas,
    orden: 12,
  },
  {
    encabezado: 'El café  tiene características especiales',
    clave: (fila) => fila.datosDelTramiteRealizar.elcafe,
    orden: 13,
  },
  {
    encabezado: 'Otras características',
    clave: (fila) => fila.datosDelTramiteRealizar.otrasCaracteristicas,
    orden: 14,
  },
  {
    encabezado: 'Fecha de exportación',
    clave: (fila) => fila.datosDelTramiteRealizar.fechaexportacion,
    orden: 15,
  },
  {
    encabezado: 'País de transbordo',
    clave: (fila) => fila.datosDelTramiteRealizar.paisdetransbordo,
    orden: 16,
  },
  {
    encabezado: 'Medio de transporte',
    clave: (fila) => fila.datosDelTramiteRealizar.mediodetransporte,
    orden: 17,
  },
  {
    encabezado: 'Identifique transporte',
    clave: (fila) => fila.datosDelTramiteRealizar.Identificadordel,
    orden: 18,
  },
  {
    encabezado: 'Observaciones',
    clave: (fila) => fila.datosDelTramiteRealizar.observaciones,
    orden: 19,
  },
];

/**
 * Configuración de las columnas de la tabla de solicitudes (segunda tabla).
 * Similar a la primera configuración, pero con datos específicos para otra tabla.
 */
export const CONFIGURACION_COLUMNAS_SOLI_2: ConfiguracionColumna<FilaData2>[] = [
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (fila) => fila.datosDelTramiteRealizar.denominacion,
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (fila) => fila.datosDelTramiteRealizar.telefono,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (fila) => fila.datosDelTramiteRealizar.correoelectronico,
    orden: 3,
  },
  {
    encabezado: 'Domicilio',
    clave: (fila) => fila.datosDelTramiteRealizar.domicilio,
    orden: 4,
  },
  {
    encabezado: 'País',
    clave: (fila) => fila.datosDelTramiteRealizar.pais,
    orden: 5,
  },
  {
    encabezado: 'Código postal',
    clave: (fila) => fila.datosDelTramiteRealizar.codigopostal,
    orden: 6,
  },
];