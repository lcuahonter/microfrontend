import { CAATRegistradoEmpresaForm, PersonaFisicaExtranjeraForm, PersonaFisicaNacionalForm, PersonaMoralExtranjeraForm, PersonaMoralNacionalForm } from "../models/transportacion-maritima.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Enum para los pasos del trámite de transporte marítimo
 * @enum {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 */
export const TRANSPORTACION_MARITIMA_PASO = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
]

/**
 * Enum para los pasos del trámite de asignación de CAAT marítimo
 * @enum {Array<{indice: number, titulo: string, activo: boolean, completado: boolean}>}
 */
export const ASIGNAR_CAAT_MARITIMO_PASOS = [
    {
        indice: 1,
        titulo: 'Pers. física nal.',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Pers. moral nal.',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Pers. física extranjera',
        activo: false,
        completado: false,
    },
    {
        indice: 4,
        titulo: 'Pers. moral extranjera',
        activo: false,
        completado: false,
    },
    {
        indice: 5,
        titulo: 'Buscar emp.con CAAT',
        activo: false,
        completado: false,
    }
]

/**
 * Enum para los textos del empresa marítima requerida
 * @enum {string}
 */
export const EMPRESA_MARITIMA_REQUERIDA = 'Registra al menos una empresa marítima para continuar.';

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa
 * @enum {Array<{encabezado: string, clave: (fila: CAATRegistradoEmpresaForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaFisicaNacionalForm>[] = [
    { encabezado: 'Nombre', clave: (fila) => fila.nombrePFN, orden: 1 },
    { encabezado: 'RFC', clave: (fila) => fila.rfcPFN, orden: 2 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPFN, orden: 3 },
    { encabezado: 'País', clave: (fila) => fila.paisPFN, orden: 4 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoPFN, orden: 5 },
    { encabezado: 'Municipio o Alcaldía', clave: (fila) => fila.municipioPFN, orden: 6 },
    { encabezado: 'Colonia', clave: (fila) => fila.coloniaPFN, orden: 7 },
    { encabezado: 'Localidad', clave: (fila) => fila.localidadPFN, orden: 8 }
];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa Persona Moral Nacional
 * @enum {Array<{encabezado: string, clave: (fila: PersonaMoralNacionalForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_PMN_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaMoralNacionalForm>[] = [
    { encabezado: 'Razón social', clave: (fila) => fila.denominacionPMN, orden: 1 },
    { encabezado: 'RFC', clave: (fila) => fila.rfcPMN, orden: 2 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPMN, orden: 3 },
    { encabezado: 'País', clave: (fila) => fila.paisPMN, orden: 4 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoPMN, orden: 5 },
    { encabezado: 'Municipio o Alcaldía', clave: (fila) => fila.municipioPMN, orden: 6 },
    { encabezado: 'Colonia', clave: (fila) => fila.coloniaPMN, orden: 7 },
    { encabezado: 'Localidad', clave: (fila) => fila.localidadPMN, orden: 8 },
    { encabezado: 'Nombre del director general', clave: (fila) => fila.nombreDirectorGeneral, orden: 9 },
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correoPMN, orden: 10 }
];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa Persona Física Extranjera
 * @enum {Array<{encabezado: string, clave: (fila: PersonaFisicaExtranjeraForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaFisicaExtranjeraForm>[] = [
    { encabezado: 'Nombre', clave: (fila) => fila.nombrePFE, orden: 1 },
    { encabezado: 'Número del seguro social', clave: (fila) => fila.seguroNumero, orden: 2 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPFE, orden: 3 },
    { encabezado: 'País', clave: (fila) => fila.paisPFE, orden: 4 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoPFE, orden: 5 },
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correoPFE, orden: 6 }
]

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa Persona Moral Extranjera
 * @enum {Array<{encabezado: string, clave: (fila: PersonaMoralExtranjeraForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaMoralExtranjeraForm>[] = [
    { encabezado: 'Denominación o razón social', clave: (fila) => fila.denominacionPME, orden: 1 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPME, orden: 2 },
    { encabezado: 'País', clave: (fila) => fila.paisPME, orden: 3 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoPME, orden: 4 },
    { encabezado: 'Código postal', clave: (fila) => fila.codigoPostalPME, orden: 5 },
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correoPME, orden: 6 }
];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa
 * @enum {Array<{encabezado: string, clave: (fila: CAATRegistradoEmpresaForm) => string, orden: number}>}
 */
export const CAAT_REGISTRADO_EMPRESA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<CAATRegistradoEmpresaForm>[] = [
    { encabezado: 'RFC/CURP/NSS', clave: (fila) => fila.rfc, orden: 1 },
    { encabezado: 'Nombre/Denominación/Razón social', clave: (fila) => fila.nombreDenominacionRazonSocial, orden: 2 },
    { encabezado: 'CAAT', clave: (fila) => fila.caat, orden: 3 },
    { encabezado: 'Perfil del CAAT', clave: (fila) => fila.perfilCaat, orden: 4 },
    { encabezado: 'Inicio de Vigencia', clave: (fila) => fila.inicioVigencia, orden: 5 },
    { encabezado: 'Fin de Vigencia', clave: (fila) => fila.finVigencia, orden: 6 },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 7 }
]

/**
 * Enum para los textos de la búsqueda de persona física
 * @enum {string}
 */
export const TEXTOS = {
    PN: 'Para iniciar la búsqueda de una persona física, ingresa un RFC y da clic en el botón buscar',
    CORREO_TITULO_TOOLTIP: 'ejemplo@dominio.com',
    RFC_TITULO_TOOLTIP: 'Registro Federal de Contribuyente',
    CAAT_TITULO_TOOLTIP: 'Código alfanumérico armonizado del transportista',
    NUMERO_DE_SEGURO_TITULO_TOOLTIP: 'Número de Seguro Social o Número de Identificación Fiscal en el País de Residencia'
};

/**
 * Opciones para el botón de radio de tipo de empresa
 * @enum {Array<{label: string, value: string}>}
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
        label: 'Nacional',
        value: '1',
    },
    {
        label: 'Extranjera',
        value: '2',
    }
];