/**
 * Interface representing a step in the wizard.
 */
export interface LISTAPASOWIZARD {
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
export interface ACCIONBOTON {
  /** Action to be performed */
  accion: string;
  /** Value associated with the action */
  valor: number;
}

/**
 * Interface representing a plant.
 */
export interface Plantas {
  /** Modality of the plant */
  modalidad: string;
  /** State where the plant is located */
  Estado: string;
  /** Federal representation of the plant */
  RepresentacionFederal: string;
  /** Productive activity of the plant */
  ActividadProductiva: string;
}

export interface FilaPlantas {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: number;
  colonia: string;
  municipioOAlcaldia: string;
  pais: string;
  registro: string;
  registroFederalDeContribuyentes: string;
  razonSocial : string;
  domicilioFiscalDelSolicitante: string;
}

export interface FilaProductos {
  contribuyentes: string;
  razonSocial: string;
  Correo: string;
}

export interface FilaSectors {
  sectorLista: string;
  sectorClave: string;
}
export interface FilaProducir{
  arancelaria: string;
  sector: string;
}
/**
 * Interface representing sectors and goods.
 */
export interface SectoresYMercancias {
  /** Sector of the goods */
  sector: string;
  /** Tariff fraction of the goods */
  Fraccion_arancelaria: string;
}

/**
 * Interface representing the final data list.
 */
export interface ListaDeDatosFinal {
  /** List of plants */
  plantas: Plantas[];
  /** List of sectors and goods */
  sectoresYMercancias: SectoresYMercancias[];
}

/**
 * Function to create the state of the data.
 * @param params Partial parameters to initialize the state
 * @returns The initialized state
 */
export function createDatosState(params: Partial<ListaDeDatosFinal> = {}): ListaDeDatosFinal {
  return {
    plantas: params.plantas || [],
    sectoresYMercancias: params.sectoresYMercancias || [],
  };
}