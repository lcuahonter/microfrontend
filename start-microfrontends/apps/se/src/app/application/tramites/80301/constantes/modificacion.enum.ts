import {
  Anexo,
  Complimentaria,
  DomicilioInfo,
  Federetarios,
  Operacions,
  ProgramaLista,
} from '../models/plantas-consulta.model';
import { Bitacora } from '../../../shared/models/bitacora.model';
import { DatosDelServicios } from '../models/datos-tramite.model';
import { Empresas } from '../../../shared/models/complementaria.model';

/**
 * Constante que define los pasos para el proceso de exportación.
 * Cada paso incluye un índice, título, y estados de activo y completado.
 * @constant {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>} PASOS_EXPORTACION
 */
export const PASOS_EXPORTACION = [
  {
    /** Índice del paso. */
    indice: 1,
    /** Título del paso. */
    titulo: 'Capturar solicitud',
    /** Indica si el paso está activo. */
    activo: true,
    /** Indica si el paso está completado. */
    completado: true,
  },
  {
    /** Índice del paso. */
    indice: 2,
    /** Título del paso. */
    titulo: 'Anexar requisitos',
    /** Indica si el paso está activo. */
    activo: false,
    /** Indica si el paso está completado. */
    completado: false,
  },
  {
    /** Índice del paso. */
    indice: 3,
    /** Título del paso. */
    titulo: 'Firmar solicitud',
    /** Indica si el paso está activo. */
    activo: false,
    /** Indica si el paso está completado. */
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
    /** Encabezado de la columna. */
    encabezado: 'Fracción - Relación',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.testado,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Fracción',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.tipoDeServicio,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Descripción',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.descripcion,
    /** Orden de la columna. */
    orden: 3,
  },

  {
    /** Encabezado de la columna. */
    encabezado: 'Estatus',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.desEstatus,
    /** Orden de la columna. */
    orden: 4,
  },
];

/**
 * @constant CONFIGURACION_IMPORTACION
 * @description
 * Configuración utilizada para definir las columnas y el orden de visualización
 * en el módulo de importación de servicios.  
 * Cada objeto de la configuración representa una columna con su encabezado, 
 * la clave a mostrar (función que obtiene el valor del objeto `DatosDelServicios`)
 * y el orden en que debe aparecer.
 *
 * @example
 * // Ejemplo de uso:
 * CONFIGURACION_IMPORTACION.forEach(columna => {
 *   console.log(columna.encabezado, columna.clave(elemento));
 * });
 */
export const CONFIGURACION_IMPORTACION = [
  {
    /** Encabezado de la columna. */
    encabezado: 'Fracción',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.tipoDeServicio,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Descripción',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.descripcion,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Fracción - Relación',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.testado,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Estatus',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios. */
    clave: (ele: DatosDelServicios): string | undefined => ele.desEstatus,
    /** Orden de la columna. */
    orden: 4,
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
    /** Encabezado de la columna. */
    encabezado: 'Calle',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.calle,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Número Exterior',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.numeroExterior,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Número Interior',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.numeroInterior,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Código Postal',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.codigoPostal,
    /** Orden de la columna. */
    orden: 4,
  },

  {
    /** Encabezado de la columna. */
    encabezado: 'Colonia',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.colonia,
    /** Orden de la columna. */
    orden: 5,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Localidad',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.localidad,
    /** Orden de la columna. */
    orden: 6,
  },

  {
    /** Encabezado de la columna. */
    encabezado: 'Municipio o alcaldía',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.delegacionMunicipio,
    /** Orden de la columna. */
    orden: 7,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Entidad Federativa',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.entidadFederativa,
    /** Orden de la columna. */
    orden: 8,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'País',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.pais,
    /** Orden de la columna. */
    orden: 9,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'RFC',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.rfc,
    /** Orden de la columna. */
    orden: 10,
  },

  {
    /** Encabezado de la columna. */
    encabezado: 'Razón Social',
    /** Función para obtener el valor de la columna desde un objeto DomicilioInfo. */
    clave: (ele: DomicilioInfo): string | undefined => ele.razonSocial,
    /** Orden de la columna. */
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
    /** Encabezado de la columna. */
    encabezado: 'Registro Federal de Contribuyente(RFC)',
    /** Función para obtener el valor de la columna desde un objeto Complimentaria. */
    clave: (ele: Complimentaria): string | undefined => ele.rfc,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Nombre(s)',
    /** Función para obtener el valor de la columna desde un objeto Complimentaria. */
    clave: (ele: Complimentaria): string | undefined => ele.nombre,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Primer apellido',
    /** Función para obtener el valor de la columna desde un objeto Complimentaria. */
    clave: (ele: Complimentaria): string | undefined => ele.apellidoPaterno,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Segundo apellido',
    /** Función para obtener el valor de la columna desde un objeto Complimentaria. */
    clave: (ele: Complimentaria): string | undefined => ele.apellidoMaterno,
    /** Orden de la columna. */
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
    /** Encabezado de la columna. */
    encabezado: 'Nombre',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.nombreNotario,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Apellido Paterno',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.apellidoPaterno,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Apellido Materno',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.apellidoMaterno,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Número Acta',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.numeroActa,
    /** Orden de la columna. */
    orden: 4,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Fecha Acta',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.fechaActa,
    /** Orden de la columna. */
    orden: 5,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Número notaría',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.numeroNotaria,
    /** Orden de la columna. */
    orden: 6,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Delegación Municipio',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.delegacionMunicipio,
    /** Orden de la columna. */
    orden: 7,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Entidad Federativa',
    /** Función para obtener el valor de la columna desde un objeto Federetarios. */
    clave: (ele: Federetarios): string | undefined => ele.entidadFederativa,
    /** Orden de la columna. */
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
    /** Encabezado de la columna. */
    encabezado: 'Calle',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.calle,
    /** Orden de la columna. */
    orden: 1,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Número Exterior',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    /** Orden de la columna. */
    orden: 2,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Número Interior',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    /** Orden de la columna. */
    orden: 3,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Código Postal',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    /** Orden de la columna. */
    orden: 4,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Colonia',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.colonia,
    /** Orden de la columna. */
    orden: 5,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Localidad',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.localidad,
    /** Orden de la columna. */
    orden: 6,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Municipio o delegación',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.delegacionMunicipio,
    /** Orden de la columna. */
    orden: 7,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Entidad Federativa',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.entidadFederativa,
    /** Orden de la columna. */
    orden: 8,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'País',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.pais,
    /** Orden de la columna. */
    orden: 9,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Registro Federal de Contribuyentes',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.rfc,
    /** Orden de la columna. */
    orden: 10,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Domicilio fiscal del solicitante',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.domicilioFiscal,
    /** Orden de la columna. */
    orden: 11,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Razón Social',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    /** Orden de la columna. */
    orden: 12,
  },
  {
    /** Encabezado de la columna. */
    encabezado: 'Estatus',
    /** Función para obtener el valor de la columna desde un objeto Operacions. */
    clave: (ele: Operacions): string | undefined => ele.desEstatus,
    /** Orden de la columna. */
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
    /** Encabezado de la columna */
    encabezado: 'Estatus',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios */
    clave: (ele: DatosDelServicios): string | undefined => ele.desEstatus,
    /** Orden de la columna */
    orden: 4,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Testado',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios */
    clave: (ele: DatosDelServicios): string | undefined => ele.testado,
    /** Orden de la columna */
    orden: 3,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Descripción del servicio',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios */
    clave: (ele: DatosDelServicios): string | undefined => ele.descripcion,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Tipo de servicio',
    /** Función para obtener el valor de la columna desde un objeto DatosDelServicios */
    clave: (ele: DatosDelServicios): string | undefined => ele.tipoDeServicio,
    /** Orden de la columna */
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
    /** Encabezado de la columna */
    encabezado: 'Calle',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.calle,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Número Exterior',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.numeroExterior,
    /** Orden de la columna */
    orden: 2,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Número Interior',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.numeroInterior,
    /** Orden de la columna */
    orden: 3,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Código Postal',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.codigoPostal,
    /** Orden de la columna */
    orden: 4,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Colonia',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.colonia,
    /** Orden de la columna */
    orden: 5,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Localidad',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.localidad,
    /** Orden de la columna */
    orden: 6,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Municipio o Delegación',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.municipioDelegacion,
    /** Orden de la columna */
    orden: 7,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Estado o Distrito Federal',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.estado,    
    /** Orden de la columna */
    orden: 8,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'País',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.pais,
    /** Orden de la columna */
    orden: 9,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Registro Federal de Contribuyente(RFC)',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.rfc,
    /** Orden de la columna */
    orden: 10,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Domicilio fiscal del solicitante',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.domicilioFiscal,
    /** Orden de la columna */
    orden: 11,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Denominación o razón social',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined => ele.razonSocial,
    /** Orden de la columna */
    orden: 12,
  },

  {
    /** Encabezado de la columna */
    encabezado: 'Estatus',
    /** Función para obtener el valor de la columna desde un objeto Operacions */
    clave: (ele: Operacions): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    /** Orden de la columna */
    orden: 13,
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
    /** Encabezado de la columna */
    encabezado: 'Registro Federal de Contribuyentes',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.rfc,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Razón Social',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.razonSocial,
    /** Orden de la columna */
    orden: 2,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Calle',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.calle,
    /** Orden de la columna */
    orden: 3,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Número Interior',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.numeroInterior,
    /** Orden de la columna */
    orden: 4,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Número Exterior',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.numeroExterior,
    /** Orden de la columna */
    orden: 5,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Código Postal',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.codigoPostal,
    /** Orden de la columna */
    orden: 6,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Colonia',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.colonia,
    /** Orden de la columna */
    orden: 7,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Municipio o Delegación',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.municipioDelegacion,
    /** Orden de la columna */
    orden: 8,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Entidad Federativa',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.estado,
    /** Orden de la columna */
    orden: 9,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'País',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.pais,
    /** Orden de la columna */
    orden: 10,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Teléfono',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined => ele.telefono,
    /** Orden de la columna */
    orden: 11,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Estatus',
    /** Función para obtener el valor de la columna desde un objeto Empresas */
    clave: (ele: Empresas): string | undefined =>
      ele.estatus ? 'Activada' : 'Baja',
    /** Orden de la columna */
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
    /** Encabezado de la columna */
    encabezado: 'Tipo modificación',
    /** Función para obtener el valor de la columna desde un objeto Bitacora */
    clave: (ele: Bitacora): string | undefined => ele.tipoModificacion,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Fecha modificación',
    /** Función para obtener el valor de la columna desde un objeto Bitacora */
    clave: (ele: Bitacora): string | undefined => ele.fechaModificacion,
    /** Orden de la columna */
    orden: 2,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Valores anteriores',
    /** Función para obtener el valor de the columna desde un objeto Bitacora */
    clave: (ele: Bitacora): string | undefined => ele.valoresAnteriores,
    /** Orden de la columna */
    orden: 3,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Valores nuevos',
    /** Función para obtener el valor de la columna desde un objeto Bitacora */
    clave: (ele: Bitacora): string | undefined => ele.valoresNuevos,
    /** Orden de la columna */
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
    /** Encabezado de la columna */
    encabezado: 'Fracción arancelaria del producto de exportación',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined =>
      ele.fraccionArancelariaExportacion,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Descripción',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    /** Orden de la columna */
    orden: 2,
  },
  {
    /** Encabezado de la columna */ 
    encabezado: 'Tipo Fracción',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    /** Orden de la columna */
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
    /** Encabezado de la columna */
    encabezado: 'Fracción arancelaria del producto de exportación',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined =>
      ele.fraccionArancelariaExportacion,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined =>
      ele.fraccionArancelariaImportacion,
    /** Orden de la columna */
    orden: 1,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Descripción',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined => ele.descripcion,
    /** Orden de la columna */
    orden: 2,
  },
  {
    /** Encabezado de la columna */
    encabezado: 'Tipo Fracción',
    /** Función para obtener el valor de la columna desde un objeto Anexo */
    clave: (ele: Anexo): string | undefined => ele.tipoFraccion,
    /** Orden de la columna */
    orden: 3,
  },
];

/**
 * Genera un mensaje HTML que indica el registro exitoso de una solicitud.
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.</p>`;

/**
 * Configuración de la lista de programas utilizada para definir las columnas
 * y el orden de visualización en una tabla o lista.
 */
export const CONFIGURACION_LISTA_PROGRAMA = [
    {
      /** Encabezado de la columna */
      encabezado: 'Folio de programa',
      /** Función para obtener el valor de la columna desde un objeto ProgramaLista */
      clave: (ele: ProgramaLista): string | undefined => ele.idProgramaCompuesto,
      /** Orden de la columna */
      orden: 1,
    },
    {
      /** Encabezado de la columna */
      encabezado: 'Tipo de programa',
      /** Función para obtener el valor de la columna desde un objeto ProgramaLista */
      clave: (ele: ProgramaLista): string | undefined => ele.tipoPrograma,
      /** Orden de la columna */
      orden: 2,
    }
];

/**
 * Constante que define los tipos de TICPSE disponibles.
 */
export const TICPSE = {
  /**
   * Tipo TICPSE para IMMEX.
   */
  TICPSE_IMMEX: 'TICPSE.IMMEX',

  /**
   * Tipo TICPSE para PROSEC.
   */
  TICPSE_PROSEC: 'TICPSE.PROSEC'
}

/**
 * Constante que define el valor del discriminador para el trámite 80301.
 */
export const DISCRIMINATOR_VALUE = '80301';

/**
 * Expresión regular para identificar comas al final de una cadena.
 */
export const REGEX_COMAS_FINALES = /,+$/;