import {
  DocumentosParaCargar
} from '@libs/shared/data-access-user/src/core/models/shared/anexar-documentos.model';

/**
 * Contiene constantes de texto comunes utilizadas en toda la aplicación.
 */
export const DATOS_COMUNES_TEXTOS = {
    alerta: `<p><strong>Nota:</strong> Si no encuadra en los sectores o los servicios
            de los catálogos, deberá seleccionar el más cercano a sus actividades.</p>`,
}

/**
 * Contiene constantes de texto comunes utilizadas en toda la aplicación.
 */
export const DATOS_COMUNES_TEXTOS_DOS = {
    alerta: `<p><strong>Nota:</strong> En el caso de la Modalidad de IVA e IEPS,
          tendrá que contar con al menos 10 trabajadores registrados.</p>`,
}

/**
 * Contiene constantes de texto comunes utilizadas en la aplicación.
 */
export const DATOS_COMUNES_TEXTOS_TRES = {
    alerta: `<p><strong>Nota: </strong> De contar con un programa IMMEX activo y
          vigente al momento de ingresar la solicitud, se mostrarán los
          domicilios registrados ante la Secretaría de Economía. Así mismo,
          podrá incluir otros domicilios que se encuentren relacionados con el
          RFC del solicitante, dando click en el botón "Agregar" y seleccionado
          la Entidad Federativa.</p>`,
}

/**
 * Contiene constantes de texto comunes utilizadas en la aplicación.
 */
export const DATOS_COMUNES_TEXTOS_CUATRO = {
    alerta: `<p>Deberá anexar un archivo con el reporte de saldos de mercancía de
     importación temporal de un periodo de un mes, que se encuentre dentro de los
      tres meses anteriores a la fecha de la presente solicitud.</p>`,
}

/**
 * Interfaz que representa los detalles de una mención.
 */
export interface Mencione {
    denominacionSocial: string;
    rfc: string;
    numeroDeEmpleados: string;
    bimestre: string;
}

/**
 * Representa un arreglo constante `MENCIONE_TABLA` que define la estructura de una tabla
 * con encabezados, claves y orden para mostrar información sobre una entidad `Mencione`.
 *
 * Cada objeto en el arreglo contiene:
 * - `encabezado`: El nombre del encabezado de la columna.
 * - `clave`: Una función que extrae el valor correspondiente de un objeto `Mencione`.
 * - `orden`: El orden en el que la columna debe aparecer.
 */
export const MENCIONE_TABLA = [
    {
        encabezado: 'Denominación Social',
        clave: (ele: Mencione): string => ele.denominacionSocial,
        orden: 1,
    },
    {
        encabezado: 'RFC',
        clave: (ele: Mencione): string => ele.rfc,
        orden: 2,
    },
    {
        encabezado: 'Número de Empleados',
        clave: (ele: Mencione): string => ele.numeroDeEmpleados,
        orden: 3,
    },
    {
        encabezado: 'Bimestre',
        clave: (ele: Mencione): string => ele.bimestre,
        orden: 4,
    },
];

/**
 * Interfaz que representa información sobre mercancías.
 */
export interface MercanciasInfo {
    denominacion_social: string;
    rfc: string;
    numero_de_empleados: string;
    bimestre:string;
}

/**
 * Representa un arreglo constante `MERCANCIA_TABLA` que define la estructura de una tabla
 * para mostrar información sobre mercancías. Cada objeto en el arreglo corresponde
 * a una columna en la tabla.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: MercanciasInfo) => any; orden: number }>}
 *
 * @property {string} encabezado - El nombre del encabezado de la columna.
 * @property {(ele: MercanciasInfo) => any} clave - Una función que extrae el valor
 * de un objeto `MercanciasInfo` para la columna correspondiente.
 * @property {number} orden - El orden en el que la columna aparece en la tabla.
 */

export const MERCANCIA_TABLA = [
    {
      encabezado: 'Denominacion Social',
      clave: (ele: MercanciasInfo): string => ele.denominacion_social,
      orden: 1,
    },
    {
      encabezado: 'RFC',
      clave: (ele: MercanciasInfo): string => ele.rfc,
      orden: 2,
    },
    {
        
        encabezado: 'Numero de Empleados',
        clave: (ele: MercanciasInfo): string => ele.numero_de_empleados,
        orden: 3,
    },
    {
        
        encabezado: 'Bimestre',
        clave: (ele: MercanciasInfo): string => ele.bimestre,
        orden: 4,
    }
];

/**
 * Interfaz que representa la estructura de respuesta para una tabla.
 */
export interface RespuestaTabla {
    code: number;
    data: MercanciasInfo[];
    message: string;
}

/**
 * Interfaz que representa la información para la tabla de instalaciones principales.
 */
export interface InstalacionesPrincipalesTablaInfo {
    instalacionesPrincipales: string;
    tipoDeInstalacion: string;
    entidadFederativa: string;
    municipioODelegacion:string;
    colonia:string
}

/**
 * Representa un arreglo constante de objetos que define la estructura y metadatos
 * para la tabla de "Instalaciones Principales".
 *
 * Cada objeto en el arreglo contiene las siguientes propiedades:
 * - `encabezado`: Una cadena que representa el título del encabezado para la columna.
 * - `clave`: Una función que toma un objeto `InstalacionesPrincipalesTablaInfo`
 *   y devuelve el valor correspondiente para la columna respectiva.
 * - `orden`: Un número que indica el orden de la columna en la tabla.
 */

export const INSTALACIONES_PRINCIPALES_TABLA = [
    {
      encabezado: '*Instalaciones principales',
      clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.instalacionesPrincipales,
      orden: 1,
    },
    {
      encabezado: '*Tipo de instalación',
      clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.tipoDeInstalacion,
      orden: 2,
    },
    {
        
        encabezado: 'Entidad federativa',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.entidadFederativa,
        orden: 3,
    },
    {
        
        encabezado: 'Municipio o delegación',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.municipioODelegacion,
        orden: 4,
    },
    {
        
        encabezado: 'Colonia, calle y número',
        clave: (ele: InstalacionesPrincipalesTablaInfo): string => ele.colonia,
        orden: 5,
    }
];

/**
 * Interfaz que representa la estructura de respuesta para la tabla de instalaciones principales.
 */
export interface InstalacionesPrincipalesRespuestaTabla {
    code: number;
    data: InstalacionesPrincipalesTablaInfo[];
    message: string;
}

/**
 * Interfaz que representa el control de inventarios.
 */
export interface ControlInventarios {
    nombreSistema: string;
    lugarRadicacion: string;
    sistemaControlInventarios: string;
}


/**
 * Representa un arreglo constante `CONTROL_INVENTARIOS_TABLA` que define la estructura
 * de los datos de control de inventarios para una aplicación específica. Cada objeto
 * en el arreglo corresponde a una columna en una tabla, con propiedades para el encabezado,
 * una función para extraer el valor de un objeto `ControlInventarios`, y el orden de la columna.
 *
 * @constant
 * @type {Array<{ encabezado: string; clave: (ele: ControlInventarios) => any; orden: number }>}
 *
 * @property {string} encabezado - El texto del encabezado para la columna.
 * @property {(ele: ControlInventarios) => any} clave - Una función que extrae el valor
 * de un objeto `ControlInventarios` para la columna.
 * @property {number} orden - El orden en el que la columna aparece en la tabla.
 */
export const CONTROL_INVENTARIOS_TABLA = [
    {
        encabezado: 'Nombre del sistema o datos para su identificación',
        clave: (ele: ControlInventarios): string => ele.nombreSistema,
        orden: 1,
    },
    {
        encabezado: 'Lugar de radicación',
        clave: (ele: ControlInventarios): string => ele.lugarRadicacion,
        orden: 2,
    },
    {
        
        encabezado: 'Indique si se trata de un sistema de control de inventarios conforme el anexo 24',
        clave: (ele: ControlInventarios): string => ele.sistemaControlInventarios,
        orden: 3,
    }
];

/**
 * Interface representing the control of Miembro.
 */
export interface Miembro {
    tipoDePersona: string;
    nombre: string;
    rfc: string;
    caracter: string;
    nacionalidad: string;
    obligadoTributar: string;
    nombreEmpresa: string;
}

/**
 * Un arreglo constante que define la estructura de una tabla para agregar miembros.
 * Cada objeto en el arreglo representa una columna en la tabla, incluyendo su encabezado,
 * una función para extraer el valor correspondiente de un objeto `Miembro`, y su orden.
 *
 * @constant
 * @type {Array<{encabezado: string, clave: (ele: Miembro) => any, orden: number}>}
 *
 * @property {string} encabezado - El texto del encabezado para la columna.
 * @property {(ele: Miembro) => any} clave - Una función que extrae el valor para la columna de un objeto `Miembro`.
 * @property {number} orden - El orden de la columna en la tabla.
 */
export const AGREGAR_MIEMBRO_TABLA = [
    {
        encabezado: 'Tipo de Persona',
        clave: (ele: Miembro): string => ele.tipoDePersona,
        orden: 1,
    },
    {
        encabezado: 'Nombre',
        clave: (ele: Miembro): string => ele.nombre,
        orden: 2,
    },
    {
        
        encabezado: 'RFC',
        clave: (ele: Miembro): string => ele.rfc,
        orden: 3,
    },
    {
        
        encabezado: 'En su carácter de',
        clave: (ele: Miembro): string => ele.caracter,
        orden: 4,
    },
    {
        
        encabezado: 'Nacionalidad',
        clave: (ele: Miembro): string => ele.nacionalidad,
        orden: 5,
    },
    {
        
        encabezado: 'Obligado a tributar en México',
        clave: (ele: Miembro): string => ele.obligadoTributar,
        orden: 6,
    },
    {
        
        encabezado: 'Nombre de la empresa',
        clave: (ele: Miembro): string => ele.nombreEmpresa,
        orden: 7,
    }
];

/**
 * Contine la lista de documentos para cargar.
 */
export interface DocumentosParaCargarLista{
    obligatorios: DocumentosParaCargar[],
    opcionales: DocumentosParaCargar[]
}