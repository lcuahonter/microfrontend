import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Opciones utilizadas en botones de selección tipo radio para respuestas "Sí" o "No".
 * Contiene las etiquetas y valores para campos de selección binaria en formularios.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  }
];

/**
 * Opciones disponibles para el registro de esquema de certificación.
 * Define las alternativas de autorización para esquemas de certificación empresarial.
 */
export const REGISTRO_ESQUEMA_CERTIFICACION_OPTIONS = [
  {
    label: 'Si Autorizo',
    value: '1',
  },
  {
    label: 'No Autorizo',
    value: '0',
  }
]

/**
 * Opciones de tipo de información de empresa disponibles.
 * Especifica si la información empresarial es de carácter público o privado.
 */
export const INFORMACION_EMPRESA_OPTIONS = [
  {
    label: 'Pública',
    value: '1',
  },
  {
    label: 'Privada',
    value: '0',
  }
]

/**
 * Configuración del campo de fecha de pago en formularios.
 * Define las propiedades básicas para el input de fecha de pago.
 */
export const FECHA_DE_PAGO = {
  labelNombre: '',
  required: false,
  habilitado: true,
};

/**
 * Configuración del campo de fecha de inicio de operaciones de comercio exterior.
 * Establece la etiqueta y propiedades para el campo de fecha de inicio comercial.
 */
export const FECHA_DE_INICIO = {
  labelNombre: 'Fecha de Inicio de Operaciones de Comercio Exterior',
  required: false,
  habilitado: true,
};

/**
 * Configuración del campo de fecha de la última operación comercial.
 * Define la etiqueta y propiedades para el registro de fechas de operaciones.
 */
export const FECHA_DELA_ULTIMA_OPERACION = {
  labelNombre: 'Fecha de la última operación',
  required: false,
  habilitado: true,
}

/**
 * Interfaz que define la estructura de datos para empresas del grupo comercial.
 * Contiene los campos principales para identificar y ubicar empresas relacionadas.
 */
export interface EmpresaDelGrupo{
  /**
   * RFC o clave operativa de la empresa del grupo.
   */
  rfcEnclaveOperativo: string;
  
  /**
   * Denominación social o razón social de la empresa.
   */
  denominacionRazonsocial: string;
  
  /**
   * Domicilio fiscal completo de la empresa.
   */
  domicilio: string;
  
  /**
   * Fecha de la última operación comercial registrada.
   */
  inputfechaDeLaUltimaOperacion: string;
}

/**
 * Configuración de columnas para la tabla de empresas del grupo sin fecha.
 * Define la estructura básica de la tabla con RFC, denominación y domicilio.
 */
export const EMPRESA_DEL_GRUPO = [
  {
    encabezado: 'RFC',
    clave: (ele: EmpresaDelGrupo): string => ele.rfcEnclaveOperativo,
    orden: 1,
  },
  {
    encabezado: 'Denominación o Razón social',
    clave: (ele: EmpresaDelGrupo): string => ele.denominacionRazonsocial,
    orden: 2,
  },
  {
    encabezado: 'Domicilio',
    clave: (ele: EmpresaDelGrupo): string => ele.domicilio,
    orden: 3,
  }
];

/**
 * Configuración de columnas para la tabla de empresas del grupo incluyendo fecha.
 * Extiende la configuración básica agregando la columna de fecha de última operación.
 */
export const EMPRESA_DEL_GRUPO_CON_FECHA = [
  {
    encabezado: 'RFC',
    clave: (ele: EmpresaDelGrupo): string => ele.rfcEnclaveOperativo,
    orden: 1,
  },
  {
    encabezado: 'Denominación o Razón social',
    clave: (ele: EmpresaDelGrupo): string => ele.denominacionRazonsocial,
    orden: 2,
  },
  {
    encabezado: 'Domicilio',
    clave: (ele: EmpresaDelGrupo): string => ele.domicilio,
    orden: 3,
  },
  {
    encabezado: 'Fecha de la última operación',
    clave: (ele: EmpresaDelGrupo): string => ele.inputfechaDeLaUltimaOperacion,
    orden: 4,
  }
];

/**
 * Configuración de paneles colapsables principales para la sección de empresas.
 * Define los paneles desplegables de la interfaz para gestionar empresas del grupo.
 */
export const PANELS = [
  { label: 'Empresas del Grupo', isCollapsed: false },
];

/**
 * Configuración de paneles colapsables secundarios para la sección de transportistas.
 * Define los paneles desplegables de la interfaz para gestionar información de transportistas.
 */
export const PANELS1 = [
  { label: 'Transportistas', isCollapsed: false },
];

/**
 * Interfaz que define la estructura de datos para transportistas.
 * Contiene los campos necesarios para identificar y validar transportistas autorizados.
 */
export interface TransportistasTable {
  /**
   * RFC o clave operativa del transportista.
   */
  rfcEnclaveOperativo: string;
  
  /**
   * Denominación social o razón social del transportista.
   */
  denominacionRazonsocial: string;
  
  /**
   * Domicilio fiscal del transportista.
   */
  domicilio: string;
  
  /**
   * Número de registro CAAT vigente del transportista.
   */
  ccat: string;
}

/**
 * Configuración de columnas para la tabla de transportistas.
 * Define la estructura completa de la tabla incluyendo RFC, denominación, domicilio y registro CAAT.
 */
export const TRANSPORTISTAS_CONFIGURACION: ConfiguracionColumna<TransportistasTable>[] = [
  {
    encabezado: 'RFC',
    clave: (item: TransportistasTable) => item.rfcEnclaveOperativo,
    orden: 1,
  },
  {
    encabezado: 'Denominación o Razón social',
    clave: (item: TransportistasTable) => item.denominacionRazonsocial,
    orden: 2,
  },
  {
    encabezado: 'Domicilio',
    clave: (item: TransportistasTable) => item.domicilio,
    orden: 3,
  },
  {
    encabezado: 'Registro CAAT vigente',
    clave: (item: TransportistasTable) => item.ccat,
    orden: 4,
  },
];