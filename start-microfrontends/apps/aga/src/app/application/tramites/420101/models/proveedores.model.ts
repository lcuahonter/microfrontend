/**
 * Interfaz que define la estructura de los datos de un proveedor registrado.
 * @interface DatosDelRegistrar
 */
export interface DatosDelRegistrar {
  /** Identificador único del proveedor */
  id: number;
  /** Registro Federal de Contribuyentes */
  rfc: string;
  /** Razón social del proveedor */
  razonSocial: string;
  /** Nombre completo del proveedor */
  nombreCompleto: string;
  /** Domicilio fiscal del proveedor */
  domicilioFiscal: string;
  /** Norma aplicable al proveedor */
  norma: string;
  /** Número de programa IMMEX (opcional) */
  numeroProgramaImmex?: string;
  /** Número de programa PROSEC (opcional) */
  numeroProgramaProsec?: string;
  /** Aduanas donde opera el proveedor (opcional) */
  aduanasOpera?: string;
}

/**
 * Interfaz que define la estructura de los datos de un proveedor registrado manualmente.
 * @interface DatosDelRegistrarManual
 */
export interface DatosDelRegistrarManual {
  /** Identificador único del proveedor (opcional) */
  id?: number;
  /** Registro Federal de Contribuyentes (opcional) */
  rfc?: string;
  /** Razón social del proveedor (opcional) */
  razonSocial?: string;
  /** Nombre completo del proveedor (opcional) */
  nombreCompleto?: string;
  /** Domicilio fiscal del proveedor (opcional) */
  domicilioFiscal?: string;
  /** Norma aplicable al proveedor (opcional) */
  norma?: string;
  /** Número de programa IMMEX (opcional) */
  numeroProgramaImmex?: string;
  /** Número de programa PROSEC (opcional) */
  numeroProgramaProsec?: string;
  /** Aduanas donde opera el proveedor (opcional) */
  aduanasOpera?: string;
}

/**
 * Interfaz que define la estructura de etiquetas cruzadas para elementos de interfaz.
 * @interface CrossListEtiqueta
 */
export interface CrossListEtiqueta {
  /** Título que se muestra en la parte izquierda */
  tituluDeLaIzquierda: string;
  /** Contenido que se muestra en la parte derecha */
  derecha: string;
}

/**
 * Interfaz que define la estructura de los datos de proveedores para registro manual.
 * @interface DatosDelProveedoresManual
 */
export interface DatosDelProveedoresManual {
  /** Registro Federal de Contribuyentes */
  registroFederalContribuyente: string;
  /** Razón social del proveedor */
  razonSocial: string;
  /** Domicilio fiscal del proveedor */
  domicilioFiscal: string;
}


