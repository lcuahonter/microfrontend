import {
  ConfiguracionColumna,
  TipoPersona,
} from '@ng-mf/data-access-user';
import { Destinatario, Fabricante } from '../../../shared/models/terceros-relacionados.model';
import { TablaMercanciasImportacion } from '../models/importicon-retorno.model';

/**
 * Arreglo constante que define los pasos del proceso para la gestión de permisos.
 * Cada objeto representa un paso específico con su índice, título, y los estados de activo y completado.
 *
 * @property {number} indice - El número de orden del paso dentro del proceso.
 * @property {string} titulo - El nombre descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo para el usuario.
 * @property {boolean} completado - Indica si el paso ya ha sido completado.
 *
 * Ejemplo de uso:
 * - Para mostrar el flujo de pasos en un formulario de solicitud.
 * - Para controlar la navegación entre pasos según el estado de cada uno.
 */
export const PASOS = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
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
    }
];

/**
 * Title message used for the sanitary permit required for the prior importation of returned products.
 */
export const TITULOMENSAJE = 'Permiso sanitario previo de importación por retorno de productos';


/**
 * Mensaje informativo que se muestra al usuario después de registrar una solicitud.
 * 
 * Indica que la solicitud ha sido registrada con un número temporal, el cual no tiene validez legal
 * y solo sirve para identificar la solicitud de manera provisional. Un folio oficial será asignado
 * cuando la solicitud sea firmada.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/** * @const ID_PROCEDIMIENTO
 * @description Identificador único del procedimiento de importación/retorno sanitario.
 * Este ID es utilizado para referenciar el trámite específico dentro del sistema.      
 * @constant
 * @type {number}
 * @default 260103
 * */
export const ID_PROCEDIMIENTO = 260103;

/**
 * Configuración de las columnas para la tabla de destinatarios en el trámite de importación/retorno sanitario.
 *
 * Cada objeto en el arreglo representa una columna de la tabla, especificando:
 * - `encabezado`: El nombre que se mostrará en la cabecera de la columna.
 * - `clave`: Una función que recibe una fila de tipo `Destinatario` y retorna el valor a mostrar en la columna correspondiente.
 * - `orden`: El orden en el que aparecerá la columna en la tabla.
 *
 * Las columnas incluyen información como nombre o razón social, RFC, CURP, teléfono, correo electrónico, dirección y otros datos relevantes del destinatario.
 *
 * @see ConfiguracionColumna
 * @see Destinatario
 */
export const DESTINATARIO_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Destinatario>[] = [
  {
    /** Nombre o razón social del destinatario */
    encabezado: 'Nombre/Denominación o Razón Social',
    clave: (fila) => fila.nombreRazonSocial,
    orden: 1,
  },
  { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
  { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
  { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
  { encabezado: 'Correo Electrónico', clave: (fila) => fila.correoElectronico, orden: 5 },
  { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
  { encabezado: 'Número Exterior', clave: (fila) => fila.numeroExterior, orden: 7 },
  { encabezado: 'Número Interior', clave: (fila) => fila.numeroInterior, orden: 8 },
  { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
  { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
  { encabezado: 'Municipio o Alcaldía', clave: (fila) => fila.municipioAlcaldia, orden: 11 },
  { encabezado: 'Estado', clave: (fila) => fila.localidad, orden: 12 },
  { encabezado: 'Estado', clave: (fila) => fila.localidad, orden: 13 },
  { encabezado: 'Código Postal', clave: (fila) => fila.codigoPostal, orden: 14 },
];


/**
 * Arreglo de configuración que define las columnas para la tabla de fabricantes.
 * 
 * Cada objeto en el arreglo representa una columna, especificando:
 * - `encabezado`: El nombre que se mostrará en la cabecera de la columna.
 * - `clave`: Una función que recibe una fila de tipo `Fabricante` y retorna el valor a mostrar en esa columna.
 * - `orden`: El orden en el que la columna debe aparecer en la tabla.
 * 
 * Este arreglo es utilizado para renderizar dinámicamente la tabla de fabricantes en la interfaz de usuario,
 * asegurando consistencia en los encabezados y el mapeo de datos.
 */
export const FABRICANTE_ENCABEZADO_DE_TABLA: ConfiguracionColumna<Fabricante>[] = [
  { encabezado: 'Nombre/Denominación o Razón Social', clave: (fila) => fila.nombreRazonSocial, orden: 1 },
  { encabezado: 'R.F.C.', clave: (fila) => fila.rfc, orden: 2 },
  { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 3 },
  { encabezado: 'Teléfono', clave: (fila) => fila.telefono, orden: 4 },
  { encabezado: 'Correo Electrónico', clave: (fila) => fila.correoElectronico, orden: 5 },
  { encabezado: 'Calle', clave: (fila) => fila.calle, orden: 6 },
  { encabezado: 'Número Exterior', clave: (fila) => fila.numeroExterior, orden: 7 },
  { encabezado: 'Número Interior', clave: (fila) => fila.numeroInterior, orden: 8 },
  { encabezado: 'País', clave: (fila) => fila.pais, orden: 9 },
  { encabezado: 'Colonia', clave: (fila) => fila.colonia, orden: 10 },
  { encabezado: 'Municipio o Alcaldía', clave: (fila) => fila.municipioAlcaldia, orden: 11 },
  { encabezado: 'Estado', clave: (fila) => fila.localidad, orden: 12 },
  { encabezado: 'Estado', clave: (fila) => fila.localidad, orden: 13 },
  { encabezado: 'Código Postal', clave: (fila) => fila.codigoPostal, orden: 14 },
];

/**
 * @enum TIPO_TABLA_DATOS
 * @description Identifica el tipo de tabla mostrada: destinatario o fabricante.
 */
export enum TIPO_TABLA_DATOS {
  /** Tabla de destinatario (destino final) */
  DESTINATARIO = 'Destinatario(Destino final)',
  /** Tabla de fabricante */
  Fabricante = 'Fabricante',
}


/**
 * Arreglo de definiciones de columnas para la tabla de productos de importación sanitaria.
 *
 * Cada objeto en el arreglo representa una columna de la tabla, especificando:
 * - `encabezado`: El nombre visible de la columna.
 * - `clave`: Función que extrae el valor correspondiente de un objeto `TablaMercanciasImportacion`.
 * - `orden`: El orden en el que la columna debe aparecer.
 *
 * Las columnas incluyen información como clasificación, denominación, marca, fracción arancelaria,
 * unidades de medida, cantidades, país de origen y procedencia, tipo y uso específico del producto.
 *
 * @constant
 * @type {{
 *   encabezado: string;
 *   clave: (ele: TablaMercanciasImportacion) => string | undefined;
 *   orden: number;
 * }[]}
 */
export const PRODUCTO_TABLA_IMPORTACION = [
  {
    /** Clasificación del producto */
    encabezado: 'Clasificación del producto',
    clave: (ele: TablaMercanciasImportacion): string => ele.clasificacionProducto,
    orden: 1,
  },
  {
    /** Detalle adicional de la clasificación */
    encabezado: 'Especificar clasificación del producto',
    clave: (ele: TablaMercanciasImportacion): string => ele.especificarClasificacionProducto,
    orden: 2,
  },
  {
    /** Nombre específico del producto */
    encabezado: 'Denominación específica del producto',
    clave: (ele: TablaMercanciasImportacion): string | undefined => ele.denominacionEspecificaProducto,
    orden: 3,
  },
  {
    /** Marca del producto */
    encabezado: 'Marca',
    clave: (ele: TablaMercanciasImportacion): string | undefined => ele.marca,
    orden: 4,
  },
  {
    /** Fracción arancelaria aplicable */
    encabezado: 'Fracción arancelaria',
    clave: (ele: TablaMercanciasImportacion): string => ele.fraccionArancelaria,
    orden: 5,
  },
  {
    /** Descripción de la fracción arancelaria */
    encabezado: 'Descripción de la fracción',
    clave: (ele: TablaMercanciasImportacion): string | undefined => ele.descripcionFraccion,
    orden: 6,
  },
  {
    /** Unidad de medida de tarifa (UMT) */
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: TablaMercanciasImportacion): string | undefined => ele.unidadMedidaTarifa,
    orden: 7,
  },
  {
    /** Cantidad correspondiente a UMT */
    encabezado: 'Cantidad UMT',
    clave: (ele: TablaMercanciasImportacion): string => ele.cantidadUMT,
    orden: 8,
  },
  {
    /** Unidad de medida de comercialización (UMC) */
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (ele: TablaMercanciasImportacion): string | undefined => ele.unidadMedidaComercializacion,
    orden: 9,
  },
  {
    /** Cantidad correspondiente a UMC */
    encabezado: 'Cantidad UMC',
    clave: (ele: TablaMercanciasImportacion): string => ele.cantidadUMC,
    orden: 10,
  },
  {
    /** País de origen del producto */
    encabezado: 'Pais de origen',
    clave: (ele: TablaMercanciasImportacion): string => ele.paisOrigen,
    orden: 11,
  },
  {
    /** País de procedencia del producto */
    encabezado: 'Pais de procedencia',
    clave: (ele: TablaMercanciasImportacion): string => ele.paisProcedencia,
    orden: 12,
  },
  {
    /** Tipo de producto (por categoría) */
    encabezado: 'Tipo producto',
    clave: (ele: TablaMercanciasImportacion): string => ele.tipoProducto,
    orden: 13,
  },
  {
    /** Uso específico del producto importado */
    encabezado: 'Uso especifico',
    clave: (ele: TablaMercanciasImportacion): string => ele.usoEspecifico,
    orden: 14,
  },
];

/**
 * Opciones para el radio button que permite seleccionar la nacionalidad de terceros.
 * 
 * Cada opción contiene una etiqueta (`label`) que representa el texto visible para el usuario,
 * y un valor (`value`) en formato string que indica si la nacionalidad es nacional ("true") o extranjera ("false").
 * 
 * @example
 * // Uso típico en un formulario de selección de nacionalidad:
 * // [
 * //   { label: 'Nacional', value: 'true' },
 * //   { label: 'Extranjero', value: 'false' }
 * // ]
 */
export const TERCEROS_NACIONALIDAD_RADIO_OPCIONS = [
  { label: 'Nacional', value: 'true' },
  { label: 'Extranjero', value: 'false' },
];


/**
 * Opciones de radio para seleccionar el tipo de persona (Física o Moral) en el formulario de terceros.
 *
 * Cada opción contiene:
 * - `label`: Texto mostrado al usuario.
 * - `value`: Valor asociado, correspondiente a una constante del enum `TipoPersona`.
 * - `hint`: Texto de ayuda adicional mostrado junto a la opción.
 *
 * Utilizado para determinar si el tercero es una persona física o moral en los trámites de importación y retorno sanitario.
 */
export const TERCEROS_PERSONA_RADIO_OPCIONS = [
  { label: 'Física', value: TipoPersona.FISICA, hint: 'Física' },
  { label: 'Moral', value: TipoPersona.MORAL, hint: 'Moral' },
];


/**
 * Lista de elementos requeridos para el trámite de importación o retorno sanitario.
 * 
 * Contiene los nombres de los campos obligatorios que deben ser proporcionados:
 * - 'denominacionRazon': Denominación o razón social de la empresa.
 * - 'scian': Código SCIAN correspondiente a la actividad económica.
 * - 'correoElectronico': Correo electrónico de contacto.
 */
export const ELEMENTOS_REQUERIDOS = [
  'denominacionRazon',
  'scian',
  'correoElectronico',
  'licenciaSanitaria',
  'aviso'
];


/**
 * Lista de identificadores de elementos que han sido añadidos en el proceso de importación o retorno sanitario.
 * 
 * @remarks
 * Cada elemento de este arreglo representa una clave utilizada para identificar campos o secciones específicas
 * dentro del trámite correspondiente.
 * 
 * @example
 * // Uso típico:
 * ELEMENTOS_ANADIDOS.forEach(elemento => {
 *   console.log(elemento);
 * });
 * 
 * @const
 * @type {string[]}
 */
export const ELEMENTOS_ANADIDOS = [
  'regimenLaMercancia',
  'domicilio-aduana',
];
