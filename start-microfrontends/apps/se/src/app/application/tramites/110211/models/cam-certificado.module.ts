/**
 * Interface representing a step in a wizard.
 */
export interface ListaPasoWizard {
  /** Index of the step */
  indice: number;
  /** Title of the step */
  titulo: string;
  /** Indicates if the step is active */
  activo: boolean;
  /** Indicates if the step is completed */
  completado: boolean;
}

/**
 * Interface representing an action button.
 */
export interface AccionBoton {
  /** Action to be performed */
  accion: string;
  /** Value associated with the action */
  valor: number;
}

/**
 * Interface representing the data structure for a modal table.
 */
export interface TablaDatosModal {
  /** Unique identifier for the data entry */
  id: number,
  /** Fracción arancelaria de la mercancía */
  fraccionArancelaria: number,
  /** Número de identificación comercial (NICO) */
  nombreTecnico: string,
  /** Descripción del NICO */
  numeroDeRegistrodeProductos: number,
  /** Cantidad de la mercancía */
  fechaExpedicion: string,
  /** Unidad de medida comercial (UMC) */
  fechaVencimiento: string,
  /** Tipo de factura asociada */
  nombreComercial: string
}


/**
 * @description
 * Representa la información de una mercancía en el trámite de certificado.
 * @property {string} fraccion - Fracción arancelaria de la mercancía.
 * @property {string} descripcionFraccion - Descripción de la fracción arancelaria.
 * @property {string} nico - Número de Identificación Comercial (NICO).
 * @property {string} descripcionNico - Descripción del NICO.
 * @property {number} cantidadSolicitadaUMT - Cantidad solicitada en la unidad de medida de tarifa.
 * @property {string} unidadMedidaTarifa - Unidad de medida utilizada en la tarifa.
 * @property {number} cantidadTotalUMT - Cantidad total en la unidad de medida de tarifa.
 * @property {number} saldoPendiente - Saldo pendiente de la mercancía.
 * @author Compodoc
 */
export interface Merchandise {
  /** Fracción arancelaria de la mercancía */
  fraccion: string;
  /** Descripción de la fracción arancelaria */
  descripcionFraccion: string;
  /** Número de Identificación Comercial (NICO) */
  nico: string;
  /** Descripción del NICO */
  descripcionNico: string;
  /** Cantidad solicitada en la unidad de medida de tarifa */
  cantidadSolicitadaUMT: number;
  /** Unidad de medida utilizada en la tarifa */
  unidadMedidaTarifa: string;
  /** Cantidad total en la unidad de medida de tarifa */
  cantidadTotalUMT: number;
  /** Saldo pendiente de la mercancía */
  saldoPendiente: number;
}

/**
 * Representa los datos del grupo representativo.
 * 
 * Esta interfaz define la información del representante legal
 * o comercial del exportador en las operaciones.
 */
export interface GrupoRepresentativo {
  /** Lugar donde se encuentra el representante */
  lugar: string;
  
  /** Nombre del exportador representado */
  nombreExportador: string;
  
  /** Empresa del representante */
  empresa: string;
  
  /** Cargo del representante en la empresa */
  cargo: string;
  
  /** Código de área telefónica (LADA) */
  lada: string;
  
  /** Número telefónico del representante */
  telefono: string;
  
  /** Número de fax del representante (opcional) */
  fax: string;
  
  /** Dirección de correo electrónico del representante */
  correoElectronico: string;
}
