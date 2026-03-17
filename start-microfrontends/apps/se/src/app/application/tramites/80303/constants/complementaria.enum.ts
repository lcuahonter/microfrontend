import { AnexoExportacion, AnexoImportacion, DatosContribuyente, Federatario, FederatarioRealizaranLasOperaciones, Sensible, ServiciosImmex } from "../models/complementaria.model";
import { Empresas, Plantas } from "../../../shared/models/complementaria.model";

/**
 * CONFIGURACION_CONTRIBUYENTES
 * 
 * Esta constante define una configuración para la representación de datos de contribuyentes
 * en una tabla o lista. Cada objeto dentro del arreglo representa una columna con:
 * 
 * - `encabezado`: El nombre visible de la columna.
 * - `clave`: Una función que extrae el valor del objeto `DatosContribuyente` correspondiente.
 * - `orden`: El orden en el que aparece la columna.
 */
export const CONFIGURACION_CONTRIBUYENTES_ACCIONISTAS = [
  {
    encabezado: 'Registro Federal de Contribuyente (RFC)',
    clave: (ele: DatosContribuyente): string | undefined => ele.RFC,
    orden: 1,
  },
  {
    encabezado: 'Nombre(s)',
    clave: (ele: DatosContribuyente): string | undefined => ele.Nombres,
    orden: 2,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: DatosContribuyente): string | undefined => ele.PrimerApellido,
    orden: 3,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: DatosContribuyente): string | undefined => ele.SegundoApellido,
    orden: 4,
  },
];


/**
 * Configuración de los federatarios utilizada para definir las columnas
 * de una tabla o lista. Cada objeto en la configuración representa una columna
 * con su encabezado, clave de acceso a los datos y orden de aparición.
 *
 * Propiedades de cada columna:
 * - `encabezado`: El título que se mostrará en la cabecera de la columna.
 * - `clave`: Una función que toma un objeto de tipo `Federatario` y devuelve
 *   el valor correspondiente a la columna, o `undefined` si no existe.
 * - `orden`: El número que indica la posición de la columna en la tabla.
 *
 * Ejemplo de uso:
 * Este arreglo puede ser utilizado para generar dinámicamente las columnas
 * de una tabla en una interfaz de usuario.
 */
export const CONFIGURACION_FEDERATARIOS = [
  {
    encabezado: 'Nombre',
    clave: (ele: Federatario): string | undefined => ele.nombreNotario,
    orden: 1,
  },
  {
    encabezado: 'Primer apellido',
    clave: (ele: Federatario): string | undefined => ele.apellidoMaterno,
    orden: 2,
  },
  {
    encabezado: 'Segundo apellido',
    clave: (ele: Federatario): string | undefined => ele.apellidoPaterno,
    orden: 3,
  },
  {
    encabezado: 'Número acta',
    clave: (ele: Federatario): string | undefined => ele.numeroActa,
    orden: 4,
  },
  {
    encabezado: 'Fecha acta',
    clave: (ele: Federatario): string | undefined => ele.fechaActa,
    orden: 5,
  },
  {
    encabezado: 'Número notaría',
    clave: (ele: Federatario): string | undefined => ele.numeroNotaria,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: Federatario): string | undefined => ele.delegacionMunicipio,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: Federatario): string | undefined => ele.entidadFederativa,
    orden: 8,
  },
];


/**
 * CONFIGURACION_FEDERATARIOS_DOMICILIO
 * 
 * Esta constante define una configuración para la representación de datos de los federatarios
 * en una tabla o lista. Cada objeto dentro del arreglo representa una columna con:
 * 
 * - `encabezado`: El nombre visible de la columna.
 * - `clave`: Una función que extrae el valor del objeto `Federatario` correspondiente.
 * - `orden`: El orden en el que aparece la columna.
 */
export const CONFIGURACION_FEDERATARIOS_DOMICILIO = [
  {
    encabezado: 'Calle',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.calle,
    orden: 1,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.numeroExterior,
    orden: 2,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.numeroInterior,
    orden: 3,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Localidad',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.localidad,
    orden: 6,
  },
  {
    encabezado: 'Municipio o Delegación',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.municipioDelegacion,
    orden: 7,
  },
  {
    encabezado: 'Estado o Distrito Federal',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.estadoDistrito,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.pais,
    orden: 9,
  },
  {
    encabezado: 'Registro Federal de Contribuyente (RFC)',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.rfc,
    orden: 10,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.domicilioFiscal,
    orden: 11,
  },
  {
    encabezado: 'Denominación o razón social',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.denominacionSocial,
    orden: 12,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: FederatarioRealizaranLasOperaciones): string | undefined => ele.estatus,
    orden: 13,
  }
];

/**
 * Configuración de las empresas submanufactureras.
 * 
 * Este arreglo define la estructura de los datos que se mostrarán para las empresas submanufactureras,
 * incluyendo encabezados, claves de acceso a los datos y el orden en el que se deben presentar.
 * 
 * Cada objeto en el arreglo contiene las siguientes propiedades:
 * 
 * - `encabezado`: El título o encabezado que se mostrará en la tabla o interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `DatosEmpresaSubmanufacturera` y devuelve el valor correspondiente
 *   para la columna especificada. Si no se encuentra el valor, devuelve `undefined`.
 * - `orden`: Un número que indica el orden en el que se deben mostrar las columnas.
 * 
 * Propiedades incluidas en la configuración:
 * - Registro Federal de Contribuyentes
 * - Razón social
 * - Calle
 * - Número interior
 * - Número exterior
 * - Código postal
 * - Colonia
 * - Municipio o delegación
 * - Entidad federativa
 * - País
 * - Teléfono
 * - Estatus
 * 
 * @constant
 */
export const CONFIGURACION_EMPRESAS_SUBMANUFACTURERAS = [
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Empresas): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Razón social',
    clave: (ele: Empresas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Calle',
    clave: (ele: Empresas): string | undefined => ele.calle,
    orden: 3,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: Empresas): string | undefined => ele.numeroInterior,
    orden: 4,
  },
  {
    encabezado: 'Número exterior',
    clave: (ele: Empresas): string | undefined => ele.numeroExterior,
    orden: 5,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: Empresas): string | undefined => ele.codigoPostal,
    orden: 6,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Empresas): string | undefined => ele.colonia,
    orden: 7,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Empresas): string | undefined => ele.municipioDelegacion,
    orden: 8,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: Empresas): string | undefined => ele.estado,
    orden: 9,
  },
  {
    encabezado: 'País',
    clave: (ele: Empresas): string | undefined => ele.pais,
    orden: 10,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: Empresas): string | undefined => ele.telefono,
    orden: 11,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Empresas): string | undefined => ele.estatus,
    orden: 12,
  },
];

/**
 * Configuración de las columnas para las plantas manufactureras.
 * 
 * Este arreglo define la estructura de las columnas que se utilizarán
 * para mostrar información relacionada con las plantas manufactureras.
 * Cada objeto en el arreglo representa una columna con las siguientes propiedades:
 * 
 * - `encabezado`: El título de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `DatosPlantaManufacturera` y 
 *   devuelve el valor correspondiente a la columna.
 * - `orden`: El orden en el que se deben mostrar las columnas.
 * 
 * Propiedades específicas:
 * - Incluye información como dirección (calle, número exterior/interior, código postal, colonia),
 *   ubicación (municipio o delegación, entidad federativa, país), datos fiscales (RFC, domicilio fiscal)
 *   y el estatus de la planta manufacturera.
 */
export const CONFIGURACION_PLANTAS_MANUFACTURERAS = [
  {
    encabezado: 'Calle',
    clave: (ele: Plantas): string | undefined => ele.calle,
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
    clave: (ele: Plantas): string | undefined => ele.codigoPostal,
    orden: 4,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: Plantas): string | undefined => ele.colonia,
    orden: 5,
  },
  {
    encabezado: 'Municipio o delegación',
    clave: (ele: Plantas): string | undefined => ele.municipioDelegacion,
    orden: 6,
  },
  {
    encabezado: 'Entidad Federativa',
    clave: (ele: Plantas): string | undefined => ele.estado,
    orden: 7,
  },
  {
    encabezado: 'País',
    clave: (ele: Plantas): string | undefined => ele.pais,
    orden: 8,
  },
  {
    encabezado: 'Registro Federal de Contribuyentes',
    clave: (ele: Plantas): string | undefined => ele.rfc,
    orden: 9,
  },
  {
    encabezado: 'Domicilio fiscal del solicitante',
    clave: (ele: Plantas): string | undefined => ele.fiscalSolicitante,
    orden: 10,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: Plantas): boolean | undefined => ele.estatus,
    orden: 11,
  },
];

/**
 * Configuración de los servicios IMMEX.
 * 
 * Este arreglo define la configuración de los servicios IMMEX, incluyendo
 * los encabezados, claves y el orden de las columnas que se mostrarán.
 * 
 * Cada objeto en el arreglo representa una columna con las siguientes propiedades:
 * - `encabezado`: El título de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `ServicioImmex` y devuelve
 *   el valor correspondiente para esa columna, o `undefined` si no aplica.
 * - `orden`: El orden en el que se mostrará la columna.
 * 
 * @constant
 */
export const CONFIGURACION_SERVICIOS_IMMEX = [
  {
    encabezado: 'Descripción del servicio',
    clave: (ele: ServiciosImmex): string | undefined => ele.descripcion,
    orden: 1,
  },
  {
    encabezado: 'Tipo de servicio',
    clave: (ele: ServiciosImmex): string | undefined => ele.descripcionTipo,
    orden: 2,
  },
  {
    encabezado: 'Testado',
    clave: (ele: ServiciosImmex): string | undefined => ele.descripcionTestado,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: ServiciosImmex): string | undefined => ele.desEstatus,
    orden: 4,
  },
];

/**
* CONFIGURACION_ANEXO_EXPORTACION
* 
* Esta constante define la configuración de columnas para mostrar los datos del anexo de exportación
* en la tabla dinámica.
*/
export const CONFIGURACION_ANEXO_EXPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoExportacion): string | undefined => ele.fraccionArancelaria?.descripcion,
    orden: 1,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: AnexoExportacion): string | undefined => ele.descripcion,
    orden: 2,
  },
  {
    encabezado: 'Tipo fracción',
    clave: (ele: AnexoExportacion): string | undefined => ele.tipoFraccion,
    orden: 3,
  },
];


/**
 * Configuración de las columnas para el anexo de importación.
 * 
 * Este arreglo define la estructura de las columnas que se utilizarán
 * para mostrar información relacionada con el anexo de importación.
 * Cada objeto dentro del arreglo representa una columna con las siguientes propiedades:
 * 
 * - `encabezado`: El título de la columna que se mostrará en la interfaz de usuario.
 * - `clave`: Una función que toma un objeto de tipo `AnexoImportacion` y devuelve
 *   el valor correspondiente a mostrar en la columna.
 * - `orden`: El orden en el que se deben mostrar las columnas.
 * 
 * @constant
 */
export const CONFIGURACION_ANEXO_IMPORTACION = [
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoImportacion): string | undefined => ele.fraccionExportacion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: AnexoImportacion): string | undefined => ele.fraccionImportacion,
    orden: 2,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: AnexoImportacion): string | undefined => ele.descripcion,
    orden: 3,
  },
  {
    encabezado: 'Tipo fracción',
    clave: (ele: AnexoImportacion): string | undefined => ele.tipoFraccion,
    orden: 4,
  },
];


/**
 * Configuración de datos sensibles utilizada para definir las propiedades
 * y el orden de las columnas en una tabla. Cada objeto en la configuración
 * representa una columna con un encabezado, una clave que define cómo se 
 * obtiene el valor de un objeto de tipo `Sensible`, y un orden que indica 
 * la posición de la columna en la tabla.
 *
 * Propiedades:
 * - `encabezado`: El título de la columna que se mostrará en la tabla.
 * - `clave`: Una función que toma un objeto de tipo `Sensible` y devuelve 
 *   el valor correspondiente para la columna.
 * - `orden`: Un número que indica la posición de la columna en la tabla.
 */
export const CONFIGURACION_SENSIBLES = [
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: Sensible): string | undefined => ele.fraccionImportacion,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: Sensible): string | undefined => ele.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Valor',
    clave: (ele: Sensible): string | undefined => ele.valor,
    orden: 3,
  },
  {
    encabezado: 'Unidad de medida tarifaria',
    clave: (ele: Sensible): string | undefined => ele.unidadMedida,
    orden: 4,
  },
];

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