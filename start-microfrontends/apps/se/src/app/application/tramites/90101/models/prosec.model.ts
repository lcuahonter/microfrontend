/**
 * @interface LISTAPASOWIZARD
 * @description
 * Interfaz que representa un paso en el asistente (wizard) del trámite PROSEC.
 * Cada objeto de esta interfaz define la información necesaria para mostrar y controlar el estado de un paso dentro del flujo del wizard.
 */
export interface LISTAPASOWIZARD {
  /**
   * @property {number} indice
   * @description
   * Índice del paso dentro del wizard. Determina el orden de aparición del paso.
   */
  indice: number;

  /**
   * @property {string} titulo
   * @description
   * Título del paso que se muestra al usuario en la interfaz del wizard.
   */
  titulo: string;

  /**
   * @property {boolean} activo
   * @description
   * Indica si el paso está activo actualmente en el flujo del wizard.
   */
  activo: boolean;

  /**
   * @property {boolean} completado
   * @description
   * Indica si el paso ha sido completado por el usuario.
   */
  completado: boolean;
}

/**
 * @interface ACCIONBOTON
 * @description
 * Interfaz que representa un botón de acción utilizado en el flujo del wizard del trámite PROSEC.
 * Define la acción a ejecutar y el valor asociado a dicha acción, como el índice del paso al que se debe navegar.
 */
export interface ACCIONBOTON {
  /**
   * @property {string} accion
   * @description
   * Acción que se debe realizar (por ejemplo, avanzar o retroceder en el wizard).
   */
  accion: string;

  /**
   * @property {number} valor
   * @description
   * Valor asociado a la acción, generalmente el índice del paso al que se debe navegar.
   */
  valor: number;
}

/**
 * @interface Plantas
 * @description
 * Interfaz que representa una planta registrada en el trámite PROSEC.
 * Contiene la información básica de la planta, como modalidad, estado, representación federal y actividad productiva.
 */
export interface Plantas {
  /**
   * @property {string} modalidad
   * @description
   * Modalidad de la planta.
   */
  modalidad: string;

  /**
   * @property {string} Estado
   * @description
   * Estado donde se encuentra la planta.
   */
  Estado: string;

  /**
   * @property {string} RepresentacionFederal
   * @description
   * Representación federal de la planta.
   */
  RepresentacionFederal: string;

  /**
   * @property {string} ActividadProductiva
   * @description
   * Actividad productiva de la planta.
   */
  ActividadProductiva: string;
}

/**
 * @interface FilaPlantas
 * @description
 * Interfaz que representa una fila de datos de una planta en el trámite PROSEC.
 * Incluye la información detallada de la ubicación de la planta, como calle, número, código postal, colonia y municipio o alcaldía.
 */
export interface FilaPlantas {
  /**
   * @property {any} domicilioDto
   * @description
   * Información del domicilio de la planta.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  domicilioDto: any;
  /**
   * @property {any} empresaDto
   * @description
   * Información de la empresa asociada a la planta.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  empresaDto: any;
  /**
   * @property {string} calle
   * @description
   * Calle de la planta.
   */
  calle: string;

  /**
   * @property {string} numeroExterior
   * @description
   * Número exterior de la planta.
   */
  numeroExterior: string;

  /**
   * @property {string} numeroInterior
   * @description
   * Número interior de la planta.
   */
  numeroInterior: string;

  /**
   * @property {number} codigoPostal
   * @description
   * Código postal de la planta.
   */
  codigoPostal: number;

  /**
   * @property {string} colonia
   * @description
   * Colonia de la planta.
   */
  colonia: string;

  /**
   * @property {string} municipioOAlcaldia
   * @description
   * Municipio o alcaldía de la planta.
   */
  municipioOAlcaldia: string;
}

/**
 * @interface FilaProductos
 * @description
 * Interfaz que representa una fila de datos de productos en el trámite PROSEC.
 * Incluye información relevante del contribuyente, como el RFC, la razón social y el correo electrónico.
 */
export interface FilaProductos {
  /**
   * @property {string} rfc
   * @description
   * Registro Federal de Contribuyentes del contribuyente.
   */
  rfc: string;
  /**
   * @property {string} correoElectronico
   * @description
   * Correo electrónico del contribuyente.
   */
  correoElectronico: string;

  /**
   * @property {string} razonSocial
   * @description
   * Denominación o razón social.
   */
  razonSocial: string;
}

/**
 * @interface FilaSectors
 * @description
 * Interfaz que representa una fila de sectores económicos en el trámite PROSEC.
 * Incluye el nombre del sector y su clave correspondiente.
 */
export interface FilaSectors {
  /**
   * @property {string} sector
   * @description
   * Nombre del sector económico.
   */
  sector: string;
  /**
   * @property {string} cvSectorCatalogo
   * @description
   * Clave del sector en el catálogo correspondiente.
   */
  cvSectorCatalogo: string;
  /**
   * @property {number} idConfProgramaSE
   * @description
   * Identificador de la configuración del programa SE.
   */
  idConfProgramaSE: number;
}

export interface FilaProducir{
  /**
   * @property {string} fraccionCompuesta
   * @description
   * Fracción arancelaria compuesta.
   */
  fraccionCompuesta: string;
  /**
   * @property {string} cveSector
   * @description
   * Clave del sector asociado a la fracción arancelaria.
   */
  cveSector: string;
  /**
   * @property {unknown} fraccionArancelaria
   * @description
   * Fracción arancelaria detallada.
   */
  fraccionArancelaria: {
    /**
     * @property {string}
     * @description
     * Clave de la fracción arancelaria.
     */
    cveFraccion: string;
  };
}

/**
 * @interface SectoresYMercancias
 * @description
 * Interfaz que representa los sectores y sus mercancías asociadas en el trámite PROSEC.
 * Incluye el nombre del sector y la fracción arancelaria correspondiente a la mercancía.
 */
export interface SectoresYMercancias {
  /**
   * @property {string} sector
   * @description
   * Nombre del sector correspondiente.
   */
  sector: string;

  /**
   * @property {string} Fraccion_arancelaria
   * @description
   * Fracción arancelaria asignada a la mercancía.
   */
  Fraccion_arancelaria: string;
}

/**
 * @interface ListaDeDatosFinal
 * @description
 * Interfaz que representa la lista final consolidada de datos del trámite PROSEC.
 * Incluye la colección de plantas registradas y la lista de sectores y mercancías seleccionadas por el usuario.
 */
export interface ListaDeDatosFinal {
  /**
   * @property {Plantas[]} plantas
   * @description
   * Lista de plantas registradas.
   */
  plantas: Plantas[];

  /**
   * @property {SectoresYMercancias[]} sectoresYMercancias
   * @description
   * Lista de sectores y mercancías seleccionadas.
   */
  sectoresYMercancias: SectoresYMercancias[];
}

/**
 * @function createDatosState
 * @method
 * @name createDatosState
 * @description
 * Genera el estado inicial de los datos del formulario para el trámite PROSEC.
 * Esta función es utilizada para inicializar el estado global o local de los datos relacionados con plantas
 * y sectores/mercancías. Si se proporcionan valores en el objeto `params`, estos se utilizan para establecer
 * el estado inicial; de lo contrario, se asignan arreglos vacíos por defecto.
 *
 * @param {Partial<ListaDeDatosFinal>} params - Objeto opcional con propiedades `plantas` y `sectoresYMercancias`.
 * Si no se proporciona, se inicializan con arreglos vacíos.
 *
 * @returns {ListaDeDatosFinal} El estado completamente inicializado de tipo `ListaDeDatosFinal`.
 * Este objeto contiene las listas de plantas y sectores/mercancías listas para usarse.
 *
 * @example
 * const estado = createDatosState({ plantas: [{ id: 1, nombre: 'Planta 1' }] });
 * console.log(estado.plantas); // [{ id: 1, nombre: 'Planta 1' }]
 */
export function createDatosState(params: Partial<ListaDeDatosFinal> = {}): ListaDeDatosFinal {
  return {
    plantas: params.plantas || [],
    sectoresYMercancias: params.sectoresYMercancias || [],
  };
}

/**
 * @interface PlantasDatosResponse
 * @description
 * Interfaz que representa la respuesta del servicio para datos de plantas en el trámite PROSEC.
 * Permite recibir un arreglo de filas con la información de las plantas y propiedades adicionales opcionales.
 */
export interface PlantasDatosResponse {
  /**
   * @property {FilaPlantas[]} plantasDatos
   * @description
   * Arreglo de filas de información de plantas.
   * Cada elemento contiene los datos detallados de una planta registrada.
   */
  plantasDatos: FilaPlantas[];

  /**
   * @property {unknown} [key]
   * @description
   * Propiedades adicionales opcionales contenidas en la respuesta.
   * Permite extender la respuesta con información extra según sea necesario.
   */
  [key: string]: unknown;
}
