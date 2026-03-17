/**
 * Representa una fila de datos en una tabla, compuesta por múltiples celdas.
 * @interface
 */
export interface TablaDatos {
  /** Datos correspondientes a las celdas del cuerpo de la tabla. */
  Datosdeltabledata: string[];
}

/**
 * Información relacionada con el transporte involucrado en el trámite.
 * @interface
 */
export interface Transporte {
  /** Número de identificación del transporte. */
  numeroIdentificacion: string;
  /** Número económico del transporte. */
  numeroEconomico: string;
  /** Placa del vehículo de transporte. */
  placa: string;
}

/**
 * Representa un requisito del trámite, incluyendo su número, fecha y tipo.
 * @interface
 */
export interface Requisito {
  /** Número o identificador del requisito. */
  No: string;
  /** Fecha en la que se presentó o generó el requisito. */
  Fecha: string;
  /** Tipo de requisito (puede ser indefinido si no se ha seleccionado). */
  Tipo: string | undefined;
}

/**
 * Representa la información básica de un producto relacionado al trámite.
 * @interface
 */
export interface Producto {
  /** Identificador único del producto. */
  id: number;
  /** Descripción general del producto (puede ser indefinida). */
  descripcion: string | undefined;
}

/**
 * Representa el detalle de una mercancía o producto dentro del trámite,
 * incluyendo información arancelaria, cantidades y origen.
 * @interface
 */
export interface Detalle {
  /** Fracción arancelaria del producto (puede ser indefinida). */
  fraccionArancelaria: string | undefined;
  /** Cantidad del producto. */
  cantidad: string;
  /** Unidad de medida utilizada (puede ser indefinida). */
  unidadMedida: string | undefined;
  /** Nombre científico del producto o especie (puede ser indefinido). */
  nombreCientifico: string | undefined;
  /** Nombre común del producto o especie (puede ser indefinido). */
  nombreComun: string | undefined;
  /** País de origen del producto (puede ser indefinido). */
  paisOrigen: string | undefined;
  /** País de procedencia del producto (puede ser indefinido). */
  paisProcedencia: string | undefined;
}

/**
 * Configuración de columnas para una tabla que muestra productos.
 * Cada objeto define el encabezado, cómo obtener el valor de cada celda
 * y el orden de aparición de la columna.
 * @constant
 */
export const CONFIGURATION_TABLA = [
  {
    /** Texto del encabezado de la columna. */
    encabezado: 'Descripción de la mercancía',
    /**
     * Función que retorna el valor a mostrar en la celda.
     * En este caso, obtiene la descripción del producto.
     * @param item Producto del cual se extrae la información.
     * @returns {string | undefined} Descripción del producto.
     */
    clave: (item: Producto): string | undefined => item.descripcion,
    /** Orden en el que aparece la columna dentro de la tabla. */
    orden: 1,
  },
];

/**
 * Configuración de columnas para una tabla que muestra detalles de mercancías.
 * Cada objeto define el encabezado de la columna, cómo obtener el valor de cada celda
 * y el orden de aparición de las columnas dentro de la tabla.
 * @constant
 */
export const CONFIGURATION_TABLA_MERCANCIAS = [
  {
    /** Texto del encabezado de la columna 'Fracción arancelaria'. */
    encabezado: 'Fracción arancelaria',
    /**
     * Función que retorna el valor a mostrar en la celda para la fracción arancelaria.
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Fracción arancelaria.
     */
    clave: (item: Detalle): string | undefined => item.fraccionArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    /**
     * Retorna la cantidad del detalle.
     * @param item Detalle de la mercancía.
     * @returns {string} Cantidad.
     */
    clave: (item: Detalle): string => item.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida',
    /**
     * Retorna la unidad de medida.
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Unidad de medida.
     */
    clave: (item: Detalle): string | undefined => item.unidadMedida,
    orden: 3,
  },
  {
    encabezado: 'Nombre científico',
    /**
     * Retorna el nombre científico.
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Nombre científico.
     */
    clave: (item: Detalle): string | undefined => item.nombreCientifico,
    orden: 4,
  },
  {
    encabezado: 'Nombre común',
    /**
     * Retorna el nombre común.
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} Nombre común.
     */
    clave: (item: Detalle): string | undefined => item.nombreComun,
    orden: 5,
  },
  {
    encabezado: 'País de origen',
    /**
     * Retorna el país de origen.
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} País de origen.
     */
    clave: (item: Detalle): string | undefined => item.paisOrigen,
    orden: 6,
  },
  {
    encabezado: 'País de procedencia',
    /**
     * Retorna el país de procedencia.
     * @param item Detalle de la mercancía.
     * @returns {string | undefined} País de procedencia.
     */
    clave: (item: Detalle): string | undefined => item.paisProcedencia,
    orden: 7,
  },
];

/**
 * Configuración de columnas para una tabla que muestra información del transporte.
 * @constant
 */
export const CONFIGURATION_TABLA_TRANSPORTE = [
  {
    encabezado: 'No. de Identificación',
    /**
     * Retorna el número de identificación del transporte.
     * @param item Información del transporte.
     * @returns {string} Número de identificación.
     */
    clave: (item: Transporte): string => item.numeroIdentificacion,
    orden: 1,
  },
  {
    encabezado: 'No. económico',
    /**
     * Retorna el número económico del transporte.
     * @param item Información del transporte.
     * @returns {string} Número económico.
     */
    clave: (item: Transporte): string => item.numeroEconomico,
    orden: 2,
  },
  {
    encabezado: 'Placa',
    /**
     * Retorna la placa del transporte.
     * @param item Información del transporte.
     * @returns {string} Placa.
     */
    clave: (item: Transporte): string => item.placa,
    orden: 3,
  },
];

/**
 * Configuración de columnas para una tabla que muestra los requisitos del trámite.
 * @constant
 */
export const CONFIGURATION_TABLA_REQUISITOS = [
  {
    encabezado: 'No',
    /**
     * Retorna el número del requisito.
     * @param item Requisito relacionado.
     * @returns {string} Número del requisito.
     */
    clave: (item: Requisito): string => item.No,
    orden: 1,
  },
  {
    encabezado: 'Fecha',
    /**
     * Retorna la fecha del requisito.
     * @param item Requisito relacionado.
     * @returns {string} Fecha.
     */
    clave: (item: Requisito): string => item.Fecha,
    orden: 2,
  },
  {
    encabezado: 'Tipo',
    /**
     * Retorna el tipo del requisito.
     * @param item Requisito relacionado.
     * @returns {string | undefined} Tipo del requisito.
     */
    clave: (item: Requisito): string | undefined => item.Tipo,
    orden: 3,
  },
];

/**
 * Configuración de las columnas para la tabla de certificados en el modal.
 * @constant
 */
export const CERTIFICADO_MODAL_TABLA = [
  {
    encabezado: 'Certificado',
    /**
     * Retorna el certificado.
     * @param item CertificadoModal.
     * @returns {string} Certificado.
     */
    clave: (item: CertificadoModal): string => item.certificado,
    orden: 1
  }
];

/**
 * Configuración de las columnas para la tabla de permisos.
 * @constant
 */
export const CONFIGURACION_COLUMNA = [
  {
    encabezado: 'Certificado',
    /**
     * Retorna el certificado.
     * @param item ClavesDePermisos.
     * @returns {string} Certificado.
     */
    clave: (item: ClavesDePermisos): string => item.certificado,
    orden: 1,
  },
  {
    encabezado: 'Fecha expedición',
    /**
     * Retorna la fecha de expedición.
     * @param item ClavesDePermisos.
     * @returns {string} Fecha de expedición.
     */
    clave: (item: ClavesDePermisos): string => item.fechaExpedicion,
    orden: 2,
  },
  {
    encabezado: 'Tipo de movimiento',
    /**
     * Retorna el tipo de movimiento.
     * @param item ClavesDePermisos.
     * @returns {string} Tipo de movimiento.
     */
    clave: (item: ClavesDePermisos): string => item.tipoMovimiento,
    orden: 3,
  },
];

/**
 * Representa los datos de las columnas de una tabla de certificados.
 * Contiene un arreglo con los nombres de las columnas que se mostrarán en la tabla.
 * @interface
 */
export interface CertificadosTablaDatos {
  /** Lista de nombres de las columnas para la tabla de certificados. */
  columns: string[];
}

/**
 * Representa los datos de las columnas de una tabla de destinatarios.
 * Contiene un arreglo con los nombres de las columnas que se mostrarán en la tabla.
 * @interface
 */
export interface Destinatarios {
  /** Nombre o razón social del destinatario. */
  nombre: string;
  /** País del destinatario. */
  pais: string;
  /** Ciudad del destinatario. */
  ciudad: string;
  /** Entidad federativa del destinatario. */
  entidadfederativa: string;
  /** Domicilio del destinatario. */
  domicilio: string;
  /** Código postal del destinatario. */
  codigopostal: string;
}

/**
 * Representa los datos de las columnas de una tabla de destinatarios.
 * @interface
 */
export interface DestinatarioTablaDatos {
  /** Lista de nombres de las columnas para la tabla de destinatarios. */
  columns: string[];
}

/**
 * Configuración de columnas para la tabla de miembros/destinatarios.
 * @constant
 */
export const AGREGAR_MIEMBRO_TABLA = [
  {
    encabezado: 'Nombre/denominación razón social',
    /**
     * Retorna el nombre del destinatario.
     * @param ele Destinatarios.
     * @returns {string} Nombre.
     */
    clave: (ele: Destinatarios): string => ele.nombre,
    orden: 1,
  },
  {
    encabezado: 'País',
    /**
     * Retorna el país del destinatario.
     * @param ele Destinatarios.
     * @returns {string} País.
     */
    clave: (ele: Destinatarios): string => ele.pais,
    orden: 2,
  },
  {
    encabezado: 'Ciudad',
    /**
     * Retorna la ciudad del destinatario.
     * @param ele Destinatarios.
     * @returns {string} Ciudad.
     */
    clave: (ele: Destinatarios): string => ele.ciudad,
    orden: 3,
  },
  {
    encabezado: 'Entidad federativa',
    /**
     * Retorna la entidad federativa del destinatario.
     * @param ele Destinatarios.
     * @returns {string | undefined} Entidad federativa.
     */
    clave: (ele: Destinatarios): string | undefined => ele.entidadfederativa,
    orden: 4,
  },
  {
    encabezado: 'Domicilio',
    /**
     * Retorna el domicilio del destinatario.
     * @param ele Destinatarios.
     * @returns {string} Domicilio.
     */
    clave: (ele: Destinatarios): string => ele.domicilio,
    orden: 5,
  },
  {
    encabezado: 'Código postal o equivalente',
    /**
     * Retorna el código postal del destinatario.
     * @param ele Destinatarios.
     * @returns {string} Código postal.
     */
    clave: (ele: Destinatarios): string => ele.codigopostal,
    orden: 6,
  },
];

/**
 * Interfaz para datos de agente aduanal.
 * @interface
 */
export interface Adunal {
  /** Nombre del agente aduanal. */
  nombre: string;
  /** Primer apellido del agente aduanal. */
  primerapellido: string;
  /** Segundo apellido del agente aduanal. */
  segundoapellido: string;
  /** Patente del agente aduanal. */
  patente: string;
}

/**
 * Configuración de columnas para la tabla de agentes aduanales.
 * @constant
 */
export const TABLA_AGENT_ADUNALDATA = [
  {
    encabezado: 'Nombre',
    /**
     * Retorna el nombre del agente aduanal.
     * @param ele Adunal.
     * @returns {string} Nombre.
     */
    clave: (ele: Adunal): string => ele.nombre,
    orden: 1,
  },
  {
    encabezado: 'Primer apellido',
    /**
     * Retorna el primer apellido del agente aduanal.
     * @param ele Adunal.
     * @returns {string} Primer apellido.
     */
    clave: (ele: Adunal): string => ele.primerapellido,
    orden: 2,
  },
  {
    encabezado: 'Segundo apellido',
    /**
     * Retorna el segundo apellido del agente aduanal.
     * @param ele Adunal.
     * @returns {string} Segundo apellido.
     */
    clave: (ele: Adunal): string => ele.segundoapellido,
    orden: 3,
  },
  {
    encabezado: 'Patente',
    /**
     * Retorna la patente del agente aduanal.
     * @param ele Adunal.
     * @returns {string} Patente.
     */
    clave: (ele: Adunal): string => ele.patente,
    orden: 4,
  },
];

/**
 * Interfaz que define la estructura de los datos de certificados para el modal.
 * @interface
 */
export interface CertificadoModal {
  /** Identificador del certificado. */
  id: number;
  /** Nombre o clave del certificado. */
  certificado: string;
}

/**
 * Interfaz que representa las claves de un lote, incluyendo datos de fabricación y caducidad.
 * @interface
 */
export interface ClavesDePermisos {
  /** Certificado del lote. */
  certificado: string;
  /** Fecha de expedición del certificado. */
  fechaExpedicion: string;
  /** Tipo de movimiento asociado al certificado. */
  tipoMovimiento: string;
}