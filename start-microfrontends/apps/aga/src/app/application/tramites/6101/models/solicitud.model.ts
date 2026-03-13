import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que representa los catálogos utilizados en la solicitud 6101,
 * incluyendo la aduana y la junta técnica derivada.
 */
export interface SolicitudCatologo {
  /**
   * @description Catálogo de aduanas.
   * Representa las aduanas disponibles para la solicitud.
   */
  aduana: CatalogosSelect;
  /**
   * @description Catálogo de juntas técnicas derivadas.
   * Representa las juntas técnicas derivadas disponibles para la solicitud.
   */
  juntaTecnicaDerivada: CatalogosSelect;
}

/**
 * Interfaz que representa la estructura de una fracción arancelaria dividida
 * en sus componentes: capítulo, partida, subpartida y subdivisión.
 */
export interface DivideFraccion {
  /**
   * @description Capítulo de la fracción arancelaria.
   * Representa la categoría general a la que pertenece la mercancía.
   */
  capitulo: string;
  /**
   * @description Partida de la fracción arancelaria.
   * Representa una subcategoría dentro del capítulo.
   */
  partida: string;
  /**
   * @description Subpartida de la fracción arancelaria.
   *  Representa una división más específica dentro de la partida.
   */
  subpartida: string;
  /**
   * @description Subdivisión de la fracción arancelaria.
   * Representa la división más específica dentro de la subpartida.
   */
  subdivision: string;
}

export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   * @type {boolean}
   */
  success: boolean;

  /**
   * Datos resultantes de la consulta.
   * @type {ConsultaDatos}
   */
  datos: ConsultaDatos;

  /**
   * Mensaje de la respuesta.
   * @type {string}
   */
  message: string;
}

export interface ConsultaDatos {
  /**
   * Información sobre exención de impuestos.
   * @type {SolicitudForm}
   */
  solicitudForm: SolicitudForm;
}
/**
 * Interfaz que representa los datos del formulario a guardar.
 */
export interface SolicitudForm {
  /**
   * Clave o número de la aduana auxiliar.
   */
  aduanaAux: string | number;

  /**
   * Número o identificador de la junta técnica derivada.
   */
  juntaTecnicaDerivada: string | number;

  /**
   * Número de pedimento de importación o exportación.
   */
  numeroPedimento: string;

  /**
   * Nombre comercial de la mercancía declarada.
   */
  nombreComercialMercancia: string;

  /**
   * Descripción detallada de la mercancía.
   */
  descDetalladaMercancia: string;

  /**
   * Fracción arancelaria primaria.
   */
  fraccionI: string;

  /**
   * Capítulo correspondiente de la fracción I.
   */
  capitulo: string;

  /**
   * Partida correspondiente de la fracción I.
   */
  partida: string;

  /**
   * Subpartida correspondiente de la fracción I.
   */
  subpartida: string;

  /**
   * Subdivisión correspondiente de la fracción I.
   */
  subdivision: string;

  /**
   * Fracción arancelaria secundaria.
   */
  fraccionII: string;

  /**
   * Capítulo correspondiente de la fracción II.
   */
  capituloII: string;

  /**
   * Partida correspondiente de la fracción II.
   */
  partidaII: string;

  /**
   * Subpartida correspondiente de la fracción II.
   */
  subpartidaII: string;

  /**
   * Subdivisión correspondiente de la fracción II.
   */
  subdivisionII: string;

  /**
   * Fracción arancelaria terciaria.
   */
  fraccionIII: string;

  /**
   * Capítulo correspondiente de la fracción III.
   */
  capituloIII: string;

  /**
   * Partida correspondiente de la fracción III.
   */
  partidaIII: string;

  /**
   * Subpartida correspondiente de la fracción III.
   */
  subpartidaIII: string;

  /**
   * Subdivisión correspondiente de la fracción III.
   */
  subdivisionIII: string;

  /**
   * Indica si los manifiestos han sido seleccionados.
   */
  manifiestosSeleccionados: boolean;
}
