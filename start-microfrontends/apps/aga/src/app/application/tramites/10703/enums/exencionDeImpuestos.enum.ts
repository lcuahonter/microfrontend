import { MercanciaInstalada, RatioOption } from '../models/exencion-impuestos.model';
import { Catalogo } from '@ng-mf/data-access-user'
/**
 * Definición de las opciones disponibles para indicar si hay mercancía o no.
 * Se representan como un array de objetos `RatioOption` con etiquetas y valores asociados.
 */
export const MECANCIA_OPTIONS: RatioOption[] = [
  {
      /**
       * Opción para indicar que sí hay mercancía.
       */
      label: 'Si',
      value: '1',
  },
  {
      /**
       * Opción para indicar que no hay mercancía.
       */
      label: 'No',
      value: '0',
  },
];

/**
* Lista de documentos seleccionados que se requieren para un procedimiento.
* Se representan como un array de objetos `Catalogo`, cada uno con un `id` y una `descripción`.
*/
export const DOCUMENTOS_SELECCIONADOS: Catalogo[] = [
  {
      /**
       * Documento que respalda el valor de la mercancía.
       */
      id: 1,
      descripcion: 'Documentos que ampare el valor de la mercancía',
  },
  {
      /**
       * Documentos relacionados con el medio de transporte utilizado.
       * Incluye guías, conocimientos de embarque (`BL`), o carta porte según corresponda.
       */
      id: 2,
      descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)',
  },
];

/**
 * Definición de la interfaz `MercanciaInstalada` que describe la estructura de los datos de la mercancía instalada.
 */
export const MERCANCIA_INSTALADA:MercanciaInstalada[] = [
  {
    TipoDeMercancía: "S",
    Cantidad: "1",
    UnidadDeMedidaDeComercialización: "Matro Cubico",
    Año: "",
    Modelo: "",
    Marco: "",
    NúmeroDeSerie: "",
    UsoEspecíficoDeLaMercancía: "S",
    CondiciónDeLaMercancía: "Usado",
    Vehículo: "No"
  }
]
/**
 * Definición de las columnas de la tabla que se utilizará para mostrar los datos de las mercancías instaladas.
 * Cada objeto en el array representa una columna con su encabezado, clave para acceder a los datos y orden.
 */

export const AGENTES_TABLA_DATOS = [
  {
    encabezado: 'Tipo de mercancía',
    clave: (item: MercanciaInstalada): string => item.TipoDeMercancía,
    orden: 1,
  },
  {
    encabezado: 'Unidad de medida de Comercialización',
    clave: (item: MercanciaInstalada): string => item.UnidadDeMedidaDeComercialización,
    orden: 2,
  },
  {
    encabezado: 'Año',
    clave: (item: MercanciaInstalada): string => item.Año,
    orden: 3,
  },
  {
    encabezado: 'Modelo',
    clave: (item: MercanciaInstalada): string => item.Modelo,
    orden: 4,
  },
  {
    encabezado: 'Marco',
    clave: (item: MercanciaInstalada): string => item.Marco,
    orden: 5,
  },
  {
    encabezado: 'Número de serie',
    clave: (item: MercanciaInstalada): string => item.NúmeroDeSerie,
    orden: 6,
  },
  {
    encabezado: 'Uso específico de la mercancía',
    clave: (item: MercanciaInstalada): string => item.UsoEspecíficoDeLaMercancía,
    orden: 7,
  },
  {
    encabezado: 'Condición de la mercancía',
    clave: (item: MercanciaInstalada): string => item.CondiciónDeLaMercancía,
    orden: 8,
  },
  {
    encabezado: 'Vehículo',
    clave: (item: MercanciaInstalada): string => item.Vehículo,
    orden: 9,
  },
];