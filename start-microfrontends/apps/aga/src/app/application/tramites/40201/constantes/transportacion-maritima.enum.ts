import {
  ConfiguracionColumna,
  ListaPasosWizard,
} from '@libs/shared/data-access-user/src';
import {
  PersonaFisicaExtranjeraForm,
  PersonaFisicaNacionalForm,
  PersonaMoralExtranjeraForm,
  PersonaMoralNacionalForm,
} from '../models/transportacion-maritima.model';
import { EmpresasCaat } from '../models/contributente.model';

/**
 * ID del trámite de transporte marítimo
 * @constant {number}
 */
export const TRAMITE_ID = 40201;

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
  },
];

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
  },
];

/**
 * Enum para los textos del empresa marítima requerida
 * @enum {string}
 */
export const EMPRESA_MARITIMA_REQUERIDA =
  'Registra al menos una empresa marítima para continuar.';

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa
 * @enum {Array<{encabezado: string, clave: (fila: CAATRegistradoEmpresaForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaFisicaNacionalForm>[] =
  [
    { encabezado: 'Nombre', clave: (fila) => fila.nombrePFN, orden: 1 },
    { encabezado: 'RFC', clave: (fila) => fila.rfcPFN, orden: 2 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPFN, orden: 3 },
    { encabezado: 'País', clave: (fila) => fila.paisDesc, orden: 4 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoDesc, orden: 5 },
    {
      encabezado: 'Municipio o Alcaldía',
      clave: (fila) => fila.municipioDesc,
      orden: 6,
    },
    { encabezado: 'Colonia', clave: (fila) => fila.coloniaDesc, orden: 7 },
    { encabezado: 'Localidad', clave: (fila) => fila.localidadPFN, orden: 8 },
  ];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa Persona Moral Nacional
 * @enum {Array<{encabezado: string, clave: (fila: PersonaMoralNacionalForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_PMN_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaMoralNacionalForm>[] =
  [
    {
      encabezado: 'Razón social',
      clave: (fila) => fila.denominacionPMN,
      orden: 1,
    },
    { encabezado: 'RFC', clave: (fila) => fila.rfcPMN, orden: 2 },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPMN, orden: 3 },
    { encabezado: 'País', clave: (fila) => fila.paisDesc, orden: 4 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoDesc, orden: 5 },
    {
      encabezado: 'Municipio o Alcaldía',
      clave: (fila) => fila.municipioDesc,
      orden: 6,
    },
    { encabezado: 'Colonia', clave: (fila) => fila.coloniaDesc, orden: 7 },
    { encabezado: 'Localidad', clave: (fila) => fila.localidadPMN, orden: 8 },
    {
      encabezado: 'Nombre del director general',
      clave: (fila) => fila.directorNombreCompleto,
      orden: 9,
    },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correoPMN,
      orden: 10,
    },
  ];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa Persona Física Extranjera
 * @enum {Array<{encabezado: string, clave: (fila: PersonaFisicaExtranjeraForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaFisicaExtranjeraForm>[] =
  [
    { encabezado: 'Nombre', clave: (fila) => fila.nombreCompleto, orden: 1 },
    {
      encabezado: 'No. seguro social',
      clave: (fila) => fila.seguroNumero,
      orden: 2,
    },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPFE, orden: 3 },
    { encabezado: 'País', clave: (fila) => fila.paisDesc, orden: 4 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoPFE, orden: 5 },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correoPFE,
      orden: 6,
    },
  ];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa Persona Moral Extranjera
 * @enum {Array<{encabezado: string, clave: (fila: PersonaMoralExtranjeraForm) => string, orden: number}>}
 */
export const CONFIGURACION_PARA_PME_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonaMoralExtranjeraForm>[] =
  [
    {
      encabezado: 'Razón social',
      clave: (fila) => fila.denominacionPME,
      orden: 1,
    },
    { encabezado: 'Domicilio', clave: (fila) => fila.domicilioPME, orden: 2 },
    { encabezado: 'País', clave: (fila) => fila.paisDesc, orden: 3 },
    { encabezado: 'Estado', clave: (fila) => fila.estadoPME, orden: 4 },
    { encabezado: 'C.P.', clave: (fila) => fila.codigoPostalPME, orden: 5 },
    {
      encabezado: 'Nombre del director general',
      clave: (fila) => fila.nombreDG,
      orden: 6,
    },
    {
      encabezado: 'Correo electrónico',
      clave: (fila) => fila.correoPME,
      orden: 7,
    },
  ];

/**
 * Enum para los configuración de la tabla de CAAT registrado empresa
 * @enum {Array<{encabezado: string, clave: (fila: EmpresasCaat) => string, orden: number}>}
 */
export const CAAT_REGISTRADO_EMPRESA_ENCABEZADO_DE_TABLA: ConfiguracionColumna<EmpresasCaat>[] =
  [
    {
      encabezado: 'RFC/CURP/NSS',
      clave: (fila) => fila.rfc || fila.curp || fila.nss,
      orden: 1,
    },
    {
      encabezado: 'Nombre/Denominación/Razón social',
      clave: (fila) => fila.nombre || fila.razon_social,
      orden: 2,
    },
    {
      encabezado: 'CAAT',
      clave: (fila) => fila.clave_folio_maritimo,
      orden: 3,
    },
    {
      encabezado: 'Perfil del CAAT',
      clave: (fila) => TIPCAAT_DESC[fila.tipo_maritimo],
      orden: 4,
    },
    {
      encabezado: 'Inicio de Vigencia',
      clave: (fila) => fila.fec_ini_vigencia,
      orden: 5,
    },
    {
      encabezado: 'Fin de Vigencia',
      clave: (fila) => fila.fec_fin_vigencia,
      orden: 6,
    },
    { encabezado: 'País', clave: (fila) => fila.nombre_pais, orden: 7 },
  ];

/**
 * Enum para los textos de la búsqueda de persona física
 * @enum {string}
 */
export const TEXTOS = {
  PN: 'Para iniciar la búsqueda de una persona física, ingresa un RFC y da clic en el botón buscar',
  CORREO_TITULO_TOOLTIP: 'ejemplo@dominio.com',
  RFC_TITULO_TOOLTIP: 'Registro Federal de Contribuyente',
  CAAT_TITULO_TOOLTIP: 'Código alfanumérico armonizado del transportista',
};

/**
 * Mensaje de error cuando el número de seguro social ya existe.
 * @param seguro Número de seguro social que ya existe.
 * @returns Mensaje HTML con el error.
 */
export const ERROR_SEGURO_EXISTE = (seguro: string): string => `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Los siguientes contribuyentes ya estan ingresados:
    </div>
     <div class="col-md-12">
      - Número del seguro social [${seguro}]
    </div>
  </div>
</div>
`;

/** Mensaje de validación para campos obligatorios. */
export const CAMPO_OBLIGATORIO = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;

/**
 * Enum para los textos de error de nombre ya existente
 * @enum {string}
 */
export const ERROR_NOMBRE_EXISTE = (nombre: string, campo: string): string => `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Los siguientes contribuyentes ya estan ingresados:
    </div>
     <div class="col-md-12">
      - ${campo} [${nombre}]
    </div>
  </div>
</div>
`;

/**
 * Enum para los textos de error de nombre ya existente
 * @enum {string}
 */
export const ERROR_AGENTE_NAVIERO =`
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      El usuario no es un agente naviero o consignatario de buques.
    </div>
  </div>
</div>`;

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
  },
];

/**
 * Pasos del wizard para el trámite (estructura usada en la UI).
 */
export const PASOS: ListaPasosWizard[] = [
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
  },
];

/**
 * Modelo para representar errores retornados en bruto por la API o validaciones.
 */
export interface ErrorModeloRaw {
  /** Nombre del campo relacionado con el error (opcional). */
  campo?: string;
  /** Errores asociados al campo (puede ser string, arreglo de strings o null/undefined). */
  errores?: string | string[] | null | undefined;
}

/**
 * Mensaje de registro exitoso con número temporal de solicitud.
 * @param numeroSolicitud id de la solicitud temporal.
 * @returns mensaje HTML con el número de solicitud.
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''
  }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;


/**
 * Enum para los tipos de CAAT
 */
export enum TIPCAAT {
  TE = 'TIPCAAT.TE',
  MA = 'TIPCAAT.MA',
  NA = 'TIPCAAT.NA',
  AE = 'TIPCAAT.AE'
}

/**
 * Descripción de los tipos de CAAT
 */
export const TIPCAAT_DESC: Record<string, string> = {
  ['TIPCAAT.TE']: 'Terrestre',
  ['TIPCAAT.MA']: 'Marítimo',
  ['TIPCAAT.NA']: 'Naviero',
  ['TIPCAAT.AE']: 'Aéreo'
};

/**
 * Tipos de modales para los pasos del trámite
 */
export type ModalPaso = 'ERROR' | 'CONFIRMACION' | null;
