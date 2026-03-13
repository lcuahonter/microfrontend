/**
 * @fileoverview
 * Este archivo contiene constantes y configuraciones utilizadas en el módulo de ampliación de servicios.
 * Proporciona configuraciones para tablas, textos, pasos del proceso y alertas que se utilizan en la interfaz de usuario.
 *
 * @module ModificacionEnum
 * @description
 * Este archivo define configuraciones para sectores, fracciones arancelarias, fracciones de importación, textos de instrucciones,
 * alertas y pasos del proceso de ampliación de servicios.
 */

import {
  Bitacora,
  DatosDelModificacion,
  MercanciasAProducir,
  Plantas,
  ProductorIndirecto,
  Sector,
} from '../models/datos-info.model';
/**
 * Pasos del proceso de ampliación de servicios.
 * @export
 * @constant {Array<Object>} PASOS
 */
export const PASOS = [
  {
    /**
     * Índice del paso.
     * @property {number} indice
     */
    indice: 1,

    /**
     * Título del paso.
     * @property {string} titulo
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo.
     * @property {boolean} activo
     */
    activo: true,

    /**
     * Indica si el paso está completado.
     * @property {boolean} completado
     */
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Configuración utilizada para definir las propiedades de la bitácora de modificaciones.
 * @export
 * @constant {Array<Object>} CONFIGURACION_BITCORA
 */
export const CONFIGURACION_BITCORA = [
  {
    /**
     * Encabezado de la columna: Tipo modificación.
     * @property {string} encabezado
     */
    encabezado: 'Tipo modificación',

    /**
     * Función que devuelve el valor del tipo de modificación.
     * @property {(ele: Bitacora) => string | undefined} clave
     */
    clave: (ele: Bitacora): string | undefined => ele.tipoModificacion,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Fecha modificación',
    clave: (ele: Bitacora): string | undefined => ele.fechaModificacion,
    orden: 2,
  },
  {
    encabezado: 'Valores anteriores',
    clave: (ele: Bitacora): string | undefined => ele.valoresAnteriores,
    orden: 3,
  },
  {
    encabezado: 'Valores nuevos',
    clave: (ele: Bitacora): string | undefined => ele.valoresNuevos,
    orden: 4,
  },
];

/**
 * Configuración utilizada para definir las propiedades de los sectores en la aplicación.
 * @export
 * @constant {Array<Object>} CONFIGURACION_SECTOR
 */
export const CONFIGURACION_SECTOR = [
  {
    /**
     * Encabezado de la columna: Lista de sectores.
     * @property {string} encabezado
     */
    encabezado: 'Lista de sectores',

    /**
     * Función que devuelve el valor de la lista de sectores.
     * @property {(ele: Sector) => string | undefined} clave
     */
    clave: (ele: Sector): string | undefined => ele.listaSectores,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Clave del sector',
    clave: (ele: Sector): string | undefined => ele.claveSector,
    orden: 2,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Sector): string | undefined => ele.estatus,
    orden: 3,
  },
];

/**
 * Configuración utilizada para definir las propiedades de los productores indirectos en el sistema.
 * @export
 * @constant {Array<Object>} CONFIGURACION_PRODUCTOR_INDIRECTO
 */
export const CONFIGURACION_PRODUCTOR_INDIRECTO = [
  {
    /**
     * Encabezado de la columna: Registro federal de contribuyentes.
     * @property {string} encabezado
     */
    encabezado: 'Registro federal de contribuyentes',

    /**
     * Función que devuelve el RFC del productor indirecto.
     * @property {(ele: ProductorIndirecto) => string | undefined} clave
     */
    clave: (ele: ProductorIndirecto): string | undefined => ele.rfc,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: ProductorIndirecto): string | undefined => ele.denominacion,
    orden: 2,
  },
  {
    encabezado: 'Correo',
    clave: (ele: ProductorIndirecto): string | undefined => ele.correo,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: ProductorIndirecto): string | undefined => ele.estatus,
    orden: 4,
  },
];

/**
 * Configuración utilizada para definir las propiedades de las mercancías a producir.
 * @export
 * @constant {Array<Object>} CONFIGURACION_MERCANCIAS_A_PRODUCIR
 */
export const CONFIGURACION_MERCANCIAS_A_PRODUCIR = [
  {
    /**
     * Encabezado de la columna: Fracción arancelaria.
     * @property {string} encabezado
     */
    encabezado: 'Fracción arancelaria',

    /**
     * Función que devuelve la fracción arancelaria de la mercancía.
     * @property {(ele: MercanciasAProducir) => string | undefined} clave
     */
    clave: (ele: MercanciasAProducir): string | undefined =>
      ele.fraccionArancelaria,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Clave del sector',
    clave: (ele: MercanciasAProducir): string | undefined => ele.claveSector,
    orden: 2,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: MercanciasAProducir): string | undefined => ele.estatus,
    orden: 3,
  },
];
/**
 * Configuración de las columnas para la visualización de datos relacionados con las plantas.
 * @export
 * @constant {Array<Object>} CONFIGURACION_PLANTAS
 */
export const CONFIGURACION_PLANTAS = [
  {
    /**
     * Encabezado de la columna: Calle.
     * @property {string} encabezado
     */
    encabezado: 'Calle',

    /**
     * Función que devuelve el valor de la calle.
     * @property {(ele: Plantas) => string | undefined} clave
     */
    clave: (ele: Plantas): string | undefined => ele.calle,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: Plantas): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: Plantas): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: Plantas): string | undefined => ele.codingPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Plantas): string | undefined => ele.colonia,
    orden: 4,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: Plantas): string | undefined => ele.municipio,
    orden: 5,
  },
  {
    encabezado: 'Estado',
    clave: (ele: Plantas): string | undefined => ele.estado,
    orden: 6,
  },
  {
    encabezado: 'País',
    clave: (ele: Plantas): string | undefined => ele.pais,
    orden: 7,
  },
  {
    encabezado: 'Registro federal de contribuyentes',
    clave: (ele: Plantas): string | undefined => ele.rfc,
    orden: 8,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: Plantas): string | undefined => ele.razonSocial,
    orden: 8,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Plantas): string | undefined => ele.domicilioFisical,
    orden: 9,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Plantas): string | undefined => ele.estatus,
    orden: 9,
  },
];

/**
 * Configuración utilizada para definir las propiedades de modificación en una lista de datos.
 * @export
 * @constant {Array<Object>} CONFIGURACION_MODIFICACION
 */
export const CONFIGURACION_MODIFICACION = [
  {
    /**
     * Encabezado de la columna: Estatus.
     * @property {string} encabezado
     */
    encabezado: 'Estatus',

    /**
     * Función que devuelve el valor del estatus.
     * @property {(ele: DatosDelModificacion) => string | undefined} clave
     */
    clave: (ele: DatosDelModificacion): string | undefined => ele.desEstatus,

    /**
     * Orden de la columna.
     * @property {number} orden
     */
    orden: 1,
  },
  {
    encabezado: 'Calle',
    clave: (ele: DatosDelModificacion): string | undefined => ele.calle,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: DatosDelModificacion): number | undefined =>
      ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: DatosDelModificacion): number | undefined =>
      ele.numeroExterior,
    orden: 4,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: DatosDelModificacion): number | undefined => ele.codigoPostal,
    orden: 5,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DatosDelModificacion): string | undefined => ele.colonia,
    orden: 6,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (ele: DatosDelModificacion): string | undefined =>
      ele.municipioOAlcaldia,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: DatosDelModificacion): string | undefined =>
      ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: DatosDelModificacion): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: DatosDelModificacion): string | undefined => ele.telefono,
    orden: 10,
  },
];