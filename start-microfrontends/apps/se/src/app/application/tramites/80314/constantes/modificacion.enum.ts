import {
  Anexo,
  Bitacora,
  Complimentaria,
  DomicilioInfo,
  Federetarios,
  Operacions,
} from '../estados/models/plantas-consulta.model';
import {
  DatosDelModificacion,
  DatosDelServicios,
} from '../estados/models/datos-tramite.model';
import { FraccionSensible } from '../models/datos-tramite.model';

/**
 * Representa los pasos de un proceso en una solicitud.
 *
 * Cada paso contiene la siguiente información:
 * - `indice`: Número que indica el orden del paso.
 * - `titulo`: Descripción del paso.
 * - `activo`: Indica si el paso está activo actualmente.
 * - `completado`: Indica si el paso ha sido completado.
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
    titulo: 'Requisitos necesarios',
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
 * Configuración para la modificación de datos en la aplicación.
 *
 * Esta constante define una lista de objetos que especifican las propiedades
 * y el orden de los encabezados que se mostrarán en la interfaz de usuario
 * para la sección de modificación.
 *
 * Cada objeto en la lista contiene:
 * - `encabezado`: El título que se mostrará en la columna.
 * - `clave`: Una función que toma un objeto de tipo `DatosDelModificacion` y
 *   devuelve el valor correspondiente a mostrar en la columna.
 * - `orden`: El orden en el que se mostrará la columna.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: DatosDelModificacion) => any; orden: number }>}
 */
export const CONFIGURACION_MODIFICACION = [
  {
    encabezado: 'Estatus',
    clave: (ele: DatosDelModificacion): string | undefined => ele.desEstatus,
    orden: 1,
  },
  {
    encabezado: 'Descripción del servicio',
    clave: (ele: DatosDelModificacion): string | undefined => ele.descripcion,
    orden: 1,
  },
  {
    encabezado: 'Tipo de servicio',
    clave: (ele: DatosDelModificacion): string | undefined => ele.tipoDeServicio,
    orden: 1,
  },
];

/**
 * Configuración de domicilios utilizada para definir las propiedades
 * y el orden de los datos relacionados con la información de domicilios.
 *
 * Cada objeto en el arreglo representa una columna con las siguientes propiedades:
 *
 * - `encabezado`: El nombre de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `DomicilioInfo` y devuelve el valor correspondiente
 *   a la propiedad especificada en la columna.
 * - `orden`: El orden en el que se debe mostrar la columna.
 *
 * Propiedades incluidas:
 * - Calle
 * - Número Exterior
 * - Número Interior
 * - Código Postal
 * - Colonia
 * - Localidad
 * - Municipio o alcaldía
 * - Entidad Federativa
 * - País
 * - RFC
 * - Razón Social
 */
export const CONFIGURACION_DOMICILIOS = [
  {
    encabezado: 'Calle',
    clave: (ele: DomicilioInfo): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: DomicilioInfo): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: DomicilioInfo): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: DomicilioInfo): string | undefined => ele.codigoPostal,
    orden: 4,
  },

  {
    encabezado: 'Colonia',
    clave: (ele: DomicilioInfo): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: DomicilioInfo): string | undefined => ele.localidad,
    orden: 6,
  },

  {
    encabezado: 'Municipio o delegación',
    clave: (ele: DomicilioInfo): string | undefined => ele.delegacionMunicipio,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: DomicilioInfo): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: DomicilioInfo): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: DomicilioInfo): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Operacions): string | undefined => ele.fiscalSolicitante,
    orden: 11,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    orden: 12,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    orden: 13,
  },
];

/**
 * Configuración de los accionistas utilizada para definir las propiedades
 * y el orden de las columnas en una tabla o lista.
 *
 * Cada objeto en la configuración representa una columna con las siguientes propiedades:
 * - `encabezado`: El título o encabezado de la columna.
 * - `clave`: Una función que toma un objeto de tipo `Complimentaria` y devuelve el valor correspondiente
 *   para esa columna, o `undefined` si no existe.
 * - `orden`: El orden en el que se debe mostrar la columna.
 */
export const CONFIGURACION_ACCIONISTAS = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Complimentaria): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Nombre(s)',
    clave: (ele: Complimentaria): string | undefined => ele.nombre,
    orden: 2,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: Complimentaria): string | undefined => ele.apellidoPrimer,
    orden: 3,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: Complimentaria): string | undefined => ele.apellidoSegundo,
    orden: 4,
  },
];

/**
 * Configuración de los campos para la entidad "Federetarios".
 *
 * Este arreglo define las columnas que se utilizarán para mostrar información
 * de los federatarios, incluyendo encabezados, claves de acceso a los datos
 * y el orden en que se deben mostrar.
 *
 * Cada objeto en el arreglo contiene:
 * - `encabezado`: El nombre del encabezado de la columna.
 * - `clave`: Una función que toma un objeto de tipo `Federetarios` y devuelve
 *   el valor correspondiente al campo especificado.
 * - `orden`: El orden en que se debe mostrar la columna.
 *
 * @constant
 * @type {Array<{encabezado: string, clave: (ele: Federetarios) => string | undefined, orden: number}>}
 */
export const CONFIGURACION_FEDERETARIOS = [
  {
    encabezado: 'Nombre',
    clave: (ele: Federetarios): string | undefined => ele.nombre,
    orden: 1,
  },
  {
    encabezado: 'Apellido Paterno',
    clave: (ele: Federetarios): string | undefined => ele.apellidoPaterno,
    orden: 2,
  },
  {
    encabezado: 'Apellido Materno',
    clave: (ele: Federetarios): string | undefined => ele.apellidoMaterno,
    orden: 3,
  },
  {
    encabezado: 'Número Acta',
    clave: (ele: Federetarios): string | undefined => ele.numeroActa,
    orden: 4,
  },
  {
    encabezado: 'Fecha Acta',
    clave: (ele: Federetarios): string | undefined => ele.fetchActa,
    orden: 5,
  },
  {
    encabezado: 'Número notaria',
    clave: (ele: Federetarios): string | undefined => ele.numeroNotaria,
    orden: 6,
  },
  {
    encabezado: 'Delegación Municipio',
    clave: (ele: Federetarios): string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Federetarios): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
];

/**
 * Configuración de operaciones utilizada para definir las propiedades
 * y el orden de las columnas en una tabla de datos.
 *
 * Cada objeto en el arreglo `CONFIGURACION_OPERACIONES` representa una columna
 * con las siguientes propiedades:
 *
 * - `encabezado`: El nombre que se mostrará como encabezado de la columna.
 * - `clave`: Una función que toma un objeto de tipo `Operacions` y devuelve
 *   el valor correspondiente a mostrar en la columna. Puede devolver un `string`
 *   o `undefined`.
 * - `orden`: Un número que indica el orden en el que se mostrará la columna.
 *
 * Propiedades específicas:
 * - `Calle`: Dirección de la calle.
 * - `Número Exterior`: Número exterior del domicilio.
 * - `Número Interior`: Número interior del domicilio.
 * - `Código Postal`: Código postal del domicilio.
 * - `Colonia`: Colonia del domicilio.
 * - `Localidad`: Localidad del domicilio.
 * - `Municipio o Delegación`: Municipio o delegación del domicilio.
 * - `Estado o Distrito Federal`: Estado o distrito federal del domicilio.
 * - `País`: País del domicilio.
 * - `Registro Federal de Contribuyente (RFC)`: RFC del solicitante.
 * - `Domicilio fiscal del solicitante`: Dirección fiscal del solicitante.
 * - `Denominación o razón social`: Razón social del solicitante.
 * - `Estatus`: Estado actual de la operación, que puede ser "Activada" o "Baja".
 */
export const CONFIGURACION_OPERACIONES = [
  {
    encabezado: 'Calle',
    clave: (ele: Operacions): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: Operacions): string | undefined => ele.localidad,
    orden: 6,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Operacions): string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Federetarios): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
  { 
    encabezado: 'País',
    clave: (ele: Operacions): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Operacions): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Operacions): string | undefined => ele.fiscalSolicitante,
    orden: 11,
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    orden: 12,
  },

  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    orden: 13,
  },
];

/**
 * Configuración de los servicios que define las columnas y su orden
 * para la visualización de datos en una tabla.
 *
 * Cada objeto en la configuración representa una columna con las siguientes propiedades:
 *
 * - `encabezado`: El título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `DatosDelServicios` y devuelve el valor
 *   correspondiente para esa columna.
 * - `orden`: Un número que indica el orden en el que se deben mostrar las columnas.
 *
 * Propiedades:
 * - `Estatus`: Representa el estado del servicio.
 * - `Testado`: Representa el estado de prueba del servicio.
 * - `Descripción del servicio`: Proporciona una descripción del servicio.
 * - `Tipo de servicio`: Indica el tipo de servicio.
 */
export const CONFIGURACION_SERVICIOS = [
  {
    encabezado: 'Estatus',
    clave: (ele: DatosDelServicios): string | undefined => ele.desEstatus,
    orden: 4,
  },
  {
    encabezado: 'Testado',
    clave: (ele: DatosDelServicios): string | undefined => ele.testado,
    orden: 3,
  },
  {
    encabezado: 'Descripción del servicio',
    clave: (ele: DatosDelServicios): string | undefined => ele.descripcion,
    orden: 1,
  },
  {
    encabezado: 'Tipo de servicio',
    clave: (ele: DatosDelServicios): string | undefined => ele.tipoDeServicio,
    orden: 2,
  },
];

/**
 * Configuración de la planta que define las propiedades y su orden para la visualización de datos.
 * Cada objeto en la configuración representa una columna con un encabezado, una clave para obtener
 * el valor correspondiente de un objeto `Operacions`, y un orden para determinar su posición.
 *
 * Propiedades:
 * - `encabezado`: Nombre de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Función que toma un objeto `Operacions` y devuelve el valor correspondiente para la columna.
 * - `orden`: Número que indica la posición de la columna en la tabla.
 * ```
 */
export const CONFIGURACION_PLANTA = [
  {
    encabezado: 'Calle',
    clave: (ele: Operacions): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Operacions): string | undefined => ele.municipioDelegacion,
    orden: 6,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Operacions): string | undefined => ele.entidadFederativa,
    orden: 7,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions): string | undefined => ele.pais,
    orden: 8,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Operacions): string | undefined => ele.rfc,
    orden: 9,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Operacions): string | undefined => ele.fiscalSolicitante,
    orden: 10,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    orden: 11,
  },
];

/**
 * Configuración de empresas utilizada para definir las columnas de una tabla.
 * Cada objeto en el arreglo representa una columna con su encabezado, clave de acceso y orden.
 *
 * @constant
 * @type {Array<{ encabezado: string, clave: (ele: Operacions) => string | undefined, orden: number }>}
 *
 * @property {string} encabezado - El nombre de la columna que se mostrará en la tabla.
 * @property {(ele: Operacions) => string | undefined} clave - Una función que toma un objeto de tipo `Operacions` y devuelve el valor correspondiente para la columna.
 * @property {number} orden - El orden en el que se mostrará la columna en la tabla.
 *
 */
export const CONFIGURACION_EMPRESAS = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Operacions): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón Social',
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Calle',
    clave: (ele: Operacions): string | undefined => ele.calle,
    orden: 3,
  },
  {
    encabezado: 'Número Interior',
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    orden: 4,
  },
  {
    encabezado: 'Número Exterior',
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    orden: 5,
  },
  {
    encabezado: 'Código Postal',
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Operacions): string | undefined => ele.colonia,
    orden: 7,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Operacions): string | undefined => ele.municipioDelegacion,
    orden: 8,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Operacions): string | undefined => ele.entidadFederativa,
    orden: 9,
  },
  {
    encabezado: 'País',
    clave: (ele: Operacions): string | undefined => ele.pais,
    orden: 10,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: Operacions): string | undefined => ele.telefono,
    orden: 11,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Operacions): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    orden: 12,
  },
];

/**
 * Configuración de la tabla de bitácora utilizada para mostrar información
 * relacionada con las modificaciones realizadas en el sistema.
 *
 * Cada objeto en la configuración representa una columna de la tabla con
 * las siguientes propiedades:
 *
 * - `encabezado`: El título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `Bitacora` y devuelve
 *   el valor correspondiente para esa columna. Puede devolver un string
 *   o `undefined`.
 * - `orden`: El orden en el que se mostrará la columna en la tabla.
 *
 * Propiedades de las columnas:
 *
 * 1. **Tipo modificación**: Muestra el tipo de modificación realizada.
 * 2. **Fecha modificación**: Muestra la fecha en la que se realizó la modificación.
 * 3. **Valores anteriores**: Muestra los valores anteriores antes de la modificación.
 * 4. **Valores nuevos**: Muestra los valores nuevos después de la modificación.
 */
export const CONFIGURACION_BITACORA_TABLA = [
  {
    encabezado: 'Tipo Modificación',
    clave: (ele: Bitacora): string | undefined => ele.tipoModificion,
    orden: 1,
  },
  {
    encabezado: 'Fecha Modificación',
    clave: (ele: Bitacora): string | undefined => ele.fetchModificion,
    orden: 2,
  },
  {
    encabezado: 'Valores Anteriores',
    clave: (ele: Bitacora): string | undefined => ele.valoresAnteriores,
    orden: 3,
  },
  {
    encabezado: 'Valores Nuevos',
    clave: (ele: Bitacora): string | undefined => ele.valoresNuevos,
    orden: 4,
  },
];

/**
 * Configuración de la tabla de anexos utilizada en la aplicación.
 *
 * Cada objeto en la configuración representa una columna de la tabla con las siguientes propiedades:
 * - `encabezado`: El título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `Anexo` y devuelve el valor correspondiente para esa columna.
 * - `orden`: El orden en el que se mostrará la columna en la tabla.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: Anexo) => string | undefined; orden: number }>}
 */
export const CONFIGURACION_ANEXOS_TABLA = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): string | undefined => ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * Configuración de los anexos para importación.
 *
 * Este arreglo contiene objetos que definen la configuración de los anexos
 * utilizados en el proceso de importación. Cada objeto incluye información
 * sobre el encabezado, la clave asociada y el orden de los campos.
 *
 * Propiedades de cada objeto:
 * - `encabezado`: Título del campo que se mostrará en la interfaz de usuario.
 * - `clave`: Función que toma un objeto de tipo `Anexo` y devuelve el valor
 *   correspondiente al campo especificado.
 * - `orden`: Número que indica el orden en el que se deben mostrar los campos.
 */
export const CONFIGURACION_ANEXOS_IMPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: Anexo): string | undefined => ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Anexo): string | undefined => ele.fraccionArancelariaImportacion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    orden: 2,
  },
  {
    encabezado: 'Tipo Fracción',
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    orden: 3,
  },
];

/**
 * Texto constante que describe el mensaje mostrado al registrar una solicitud.
 *
 * Este mensaje informa al usuario que la solicitud ha sido registrada con un número temporal,
 * el cual no tiene validez legal y sirve únicamente para identificar la solicitud.
 * También indica que un folio oficial será asignado cuando la solicitud sea firmada.
 */
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

/**
 * Configuración de actividades productivas.
 *
 * Este arreglo contiene objetos que representan las actividades productivas
 * disponibles en el sistema. Cada objeto incluye un identificador único (`id`)
 * y una descripción (`descripcion`) de la actividad.
 *
 * Propiedades:
 * - `id`: Identificador único de la actividad productiva.
 * - `descripcion`: Descripción de la actividad productiva.
 */
export const ACTIVIDAD_PRODUCTIVA = [
  { id: 1, descripcion: 'AGRICULTURA' },
  { id: 2, descripcion: 'BORDADO O IMPRESIÓN DE PRENDAS' },
];

/**
 * Configuración de las columnas de la tabla para las fracciones sensibles.
 * Define cómo se mostrarán los datos relacionados con las fracciones sensibles en la tabla.
 */
export const CONFIGURACION_FRACCION_SENSIBLE = [
  {
    encabezado: 'Fracción arancelaria de la mercancia de importación',
    clave: (ele: FraccionSensible): number | undefined =>
      ele.fraccionArancelariaExportacion,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: FraccionSensible): number | undefined => ele.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Valor',
    clave: (ele: FraccionSensible): number | undefined => ele.valor,
    orden: 3,
  },
  {
    encabezado: 'Unidad de medida tarifaria',
    clave: (ele: FraccionSensible): string | undefined =>
      ele.unidadMedidaTarifaria,
    orden: 4,
  },
];
