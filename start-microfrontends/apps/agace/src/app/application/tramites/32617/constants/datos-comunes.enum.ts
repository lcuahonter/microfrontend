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
  labelNombre: '', // Etiqueta del campo de fecha de pago, se deja vacío para personalizar en uso
  required: false, // Indica si el campo es obligatorio
  habilitado: true,// Indica si el campo está habilitado para edición
};

/**
 * Configuración del campo de fecha de inicio de operaciones de comercio exterior.
 * Establece la etiqueta y propiedades para el campo de fecha de inicio comercial.
 */
export const FECHA_DE_INICIO = {
  labelNombre: 'Fecha de Inicio de Operaciones de Comercio Exterior',// Etiqueta del campo de fecha de inicio
  required: true, // Indica que este campo es obligatorio
  habilitado: true,// Indica que el campo está habilitado para edición
};

/**
 * Configuración del campo de fecha de la última operación comercial.
 * Define la etiqueta y propiedades para el registro de fechas de operaciones.
 */
export const FECHA_DELA_ULTIMA_OPERACION = {
  labelNombre: 'Fecha de la última operación', // Etiqueta del campo de fecha de la última operación
  required: false, // Indica que este campo no es obligatorio
  habilitado: true,// Indica que el campo está habilitado para edición
}

/**
 * Interfaz que define la estructura de datos para empresas del grupo comercial.
 * Contiene los campos principales para identificar y ubicar empresas relacionadas.
 */
export interface EmpresaDelGrupo {
  rfcEnclaveOperativo:string;//RFC o clave operativa de la empresa del grupo
  denominacionRazonsocial:string;//Denominación social o razón social de la empresa
  domicilio:string;//Domicilio fiscal completo de la empresa
  inputfechaDeLaUltimaOperacion:string;//Fecha de la última operación comercial registrada
}

/**
 * Configuración de columnas para la tabla de empresas del grupo sin fecha.
 * Define la estructura básica de la tabla con RFC, denominación y domicilio.
 */
export const EMPRESA_DEL_GRUPO = [
  {
    // Encabezado de la columna para RFC
    encabezado: 'RFC',
    clave: (ele: EmpresaDelGrupo): string => ele.rfcEnclaveOperativo,
    orden: 1,
  },
  {
    // Encabezado de la columna para Denominación o Razón social
    encabezado: 'Denominación o Razón social',
    clave: (ele: EmpresaDelGrupo): string => ele.denominacionRazonsocial,
    orden: 2,
  },
  {
    // Encabezado de la columna para Domicilio
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
    // Encabezado de la columna para RFC
    encabezado: 'RFC',
    clave: (ele: EmpresaDelGrupo): string => ele.rfcEnclaveOperativo,
    orden: 1,
  },
  {
    // Encabezado de la columna para Denominación o Razón social
    encabezado: 'Denominación o Razón social',
    clave: (ele: EmpresaDelGrupo): string => ele.denominacionRazonsocial,
    orden: 2,
  },
  {
    // Encabezado de la columna para Domicilio
    encabezado: 'Domicilio',
    clave: (ele: EmpresaDelGrupo): string => ele.domicilio,
    orden: 3,
  },
  {
    // Encabezado de la columna para Fecha de la última operación
    encabezado: 'Fecha de la última operación',
    clave: (ele: EmpresaDelGrupo): string => ele.inputfechaDeLaUltimaOperacion,
    orden: 4,
  }
];

/**
 * Configuración de paneles colapsables principales para la sección de empresas.
 * Define los paneles desplegables de la interfaz para gestionar empresas del grupo.
 */
export const EMPRESA_DE_GRUPO_PANELS = [
  { label: 'Empresas del Grupo', isCollapsed: false } // Panel principal para empresas del grupo
];

/**
 * Configuración de paneles colapsables secundarios para la sección de transportistas.
 * Define los paneles desplegables de la interfaz para gestionar información de transportistas.
 */
export const TRANSPORTISTAS_PANELS = [
  { label: 'Transportistas', isCollapsed: false } // Panel principal para transportistas autorizados
];

/**
 * Interfaz que define la estructura de datos para transportistas.
 * Contiene los campos necesarios para identificar y validar transportistas autorizados.
 */
export interface TransportistasTable {
  rfcEnclaveOperativo:string;//RFC o clave operativa del transportista
  denominacionRazonsocial:string;//Denominación social o razón social del transportista
  domicilio:string;//Domicilio fiscal del transportista
  ccat:string;//Número de registro CAAT vigente del transportista
}

/**
 * Configuración de columnas para la tabla de transportistas.
 * Define la estructura completa de la tabla incluyendo RFC, denominación, domicilio y registro CAAT.
 */
export const TRANSPORTISTAS_CONFIGURACION: ConfiguracionColumna<TransportistasTable>[] = [
  {
    // Encabezado de la columna para RFC
    encabezado: 'RFC',
    clave: (item: TransportistasTable) => item.rfcEnclaveOperativo,
    orden: 1,
  },
  {
    // Encabezado de la columna para Denominación o Razón social
    encabezado: 'Denominación o Razón social',
    clave: (item: TransportistasTable) => item.denominacionRazonsocial,
    orden: 2,
  },
  {
    // Encabezado de la columna para Domicilio
    encabezado: 'Domicilio',
    clave: (item: TransportistasTable) => item.domicilio,
    orden: 3,
  },
  {
    // Encabezado de la columna para Registro CAAT vigente
    encabezado: 'Registro CAAT vigente',
    clave: (item: TransportistasTable) => item.ccat,
    orden: 4,
  }
];