/**
 * Representa una entidad de sociedad con información fiscal y aduanera relevante.
 *
 * @property rfc - El RFC (Registro Federal de Contribuyentes) de la sociedad.
 * @property denominacion - El nombre oficial o denominación de la sociedad.
 * @property aduanaEnLaQueActua - La aduana en la que la sociedad opera.
 * @property fiscales - Información fiscal relacionada con la sociedad.
 */
export interface Sociedades {
    rfc: string;
    denominacion: string;
    aduanaEnLaQueActua: string;
    fiscales: string;
}

/**
 * Representa los datos de las instalaciones de una sociedad.
 *
 * @property rfc - RFC de la sociedad.
 * @property instalacionesPrincipales - Descripción de las instalaciones principales.
 * @property tipoDeInstalacion - Tipo de instalación.
 * @property entidadFederativa - Entidad federativa donde se ubica la instalación.
 * @property municipioDelegacion - Municipio o delegación de la instalación.
 * @property colonia - Colonia de la instalación.
 * @property codigoPostal - Código postal de la instalación.
 * @property realizaLaValidacion - Indica si se realiza la validación.
 * @property actualizarPerfil - Indica si se debe actualizar el perfil.
 */
export interface DatosDeLasInstalaciones {
    rfc: string;
    instalacionesPrincipales: string;
    tipoDeInstalacion: string;
    entidadFederativa: string;
    municipioDelegacion: string;
    colonia: string;
    codigoPostal: string;
    realizaLaValidacion: string;
    actualizarPerfil: string;
}

/**
 * Representa los detalles de la instalación para una ubicación.
 *
 * @property entidadFederativa - La entidad federativa (estado) donde se encuentra la instalación.
 * @property municipioODelegacion - El municipio o delegación de la instalación.
 * @property colonia - La colonia o barrio de la instalación.
 * @property codigoPostal - El código postal de la instalación.
 */
export interface Instalaciones {
    entidadFederativa: string;
    municipioODelegacion: string;
    colonia: string;
    codigoPostal: string;
}

/**
 * Representa los mandatarios (representantes legales) de un agente aduanal.
 *
 * @property rfc - El RFC (Registro Federal de Contribuyentes) del mandatario.
 * @property nombre - El nombre completo del mandatario.
 * @property aiCorriente - Indica si el mandatario está al corriente con sus obligaciones.
 */
export interface MandatariosDeAgenteAduanal {
    rfc: string;
    razonSocial: string;
    fiscales: string;
}

/**
 * Arreglo de objetos que define la configuración de las columnas para la tabla de sociedades.
 * Cada objeto representa una columna con su encabezado, función para obtener el valor de la celda,
 * y el orden en el que aparece en la tabla.
 *
 * Propiedades:
 * - encabezado: Nombre de la columna que se muestra en la tabla.
 * - clave: Función que recibe un objeto de tipo `Sociedades` y retorna el valor a mostrar en la celda.
 * - orden: Número que indica la posición de la columna en la tabla.
 */
export const ENLACE_TABLA = [
  {
    encabezado: 'RFC',
    clave: (ele: Sociedades): string => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'Denominación o Razón social ',
    clave: (ele: Sociedades): string => ele.denominacion,
    orden: 2,
  },
  {
    encabezado: 'Aduana en la que actua',
    clave: (ele: Sociedades): string => ele.aduanaEnLaQueActua,
    orden: 3,
  },
  {
    encabezado: 'Al corriente de sus obligaciones fiscales',
    clave: (ele: Sociedades): string => ele.fiscales,
    orden: 4,
  }
];

/**
 * Configuración de las columnas para mostrar información de instalaciones en una tabla.
 * Cada objeto representa una columna con su encabezado, función para obtener el valor de la celda,
 * y el orden en el que debe aparecer.
 *
 * @remarks
 * La función `clave` recibe un objeto de tipo {@link DatosDeLasInstalaciones} y retorna el valor correspondiente para la columna.
 *
 * @example
 * CONFIGURACION_INSTALACIONES.forEach(col => {
 *   console.log(col.encabezado, col.clave(instalacion));
 * });
 *
 * @see DatosDeLasInstalaciones
 */
export const CONFIGURACION_INSTALACIONES = [
    {
        encabezado: 'RFC',
        clave: (ele: DatosDeLasInstalaciones): string => ele.rfc,
        orden: 1,
    },
    {
        encabezado: 'Instalaciones Principales',
        clave: (ele: DatosDeLasInstalaciones): string => ele.instalacionesPrincipales,
        orden: 2,
    },
    {
        encabezado: 'Tipo de Instalación',
        clave: (ele: DatosDeLasInstalaciones): string => ele.tipoDeInstalacion,
        orden: 3,
    },
    {
        encabezado: 'Entidad Federativa',
        clave: (ele: DatosDeLasInstalaciones): string => ele.entidadFederativa,
        orden: 4,
    },
    {
        encabezado: 'Municipio/Delegación',
        clave: (ele: DatosDeLasInstalaciones): string => ele.municipioDelegacion,
        orden: 5,
    },
    {
        encabezado: 'Colonia',
        clave: (ele: DatosDeLasInstalaciones): string => ele.colonia,
        orden: 6,
    },
    {
        encabezado: 'Código Postal',
        clave: (ele: DatosDeLasInstalaciones): string => ele.codigoPostal,
        orden: 7,
    },
    {
        encabezado: 'Realiza la Validación',
        clave: (ele: DatosDeLasInstalaciones): string => ele.realizaLaValidacion,
        orden: 8,
    },
    {
        encabezado: 'Actualizar Perfil',
        clave: (ele: DatosDeLasInstalaciones): string => ele.actualizarPerfil,
        orden: 9,
    }
];

/**
 * Configuración de la tabla de instalaciones.
 * 
 * Cada objeto en el arreglo representa una columna en la tabla de instalaciones,
 * especificando el encabezado, la clave para extraer el valor de una instancia de `Instalaciones`,
 * y el orden en el que aparece la columna.
 * 
 * @remarks
 * - `encabezado`: El nombre de la columna que se muestra en la tabla.
 * - `clave`: Función que recibe una instancia de `Instalaciones` y retorna el valor correspondiente para la columna.
 * - `orden`: Número que indica la posición de la columna en la tabla.
 */
export const CONFIGURACION_INSTALACIONES_TABLA = [
    {
        encabezado: 'Entidad Federativa',
        clave: (ele: Instalaciones): string => ele.entidadFederativa,
        orden: 1,
    },
    {
        encabezado: 'Municipio o Delegación',
        clave: (ele: Instalaciones): string => ele.municipioODelegacion,
        orden: 2,
    },
    {
        encabezado: 'Colonia, calle y número',
        clave: (ele: Instalaciones): string => ele.colonia,
        orden: 3,
    },
    {
        encabezado: 'Código Postal',
        clave: (ele: Instalaciones): string => ele.codigoPostal,
        orden: 4,
    }
]

/**
 * Arreglo de objetos de configuración que representa las columnas para mostrar
 * "Mandatarios de Agente Aduanal".
 *
 * Cada objeto define:
 * - `encabezado`: El texto del encabezado de la columna.
 * - `clave`: Función que extrae el valor correspondiente de un objeto `MandatariosDeAgenteAduanal`.
 * - `orden`: El orden en que debe aparecer la columna.
 */
export const MANDATARIOS_DE_AGENTE_ADUANAL = [
    {
        encabezado: 'RFC',
        clave: (ele: MandatariosDeAgenteAduanal): string => ele.rfc,
        orden: 1,
    },
    {
        encabezado: 'Nombre',
        clave: (ele: MandatariosDeAgenteAduanal): string => ele.razonSocial,
        orden: 2,
    },
    {
        encabezado: 'AI Corriente',
        clave: (ele: MandatariosDeAgenteAduanal): string => ele.fiscales,
        orden: 3,
    }
];
