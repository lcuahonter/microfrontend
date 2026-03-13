import { Solicitud220502State } from '../../220502/estados/tramites220502.store';

/**
 * Interfaz que representa los datos de la solicitud.
 */
export interface DatosDelaSolicitud {
  /** Aduana de ingreso seleccionada para la solicitud. */
  aduanaIngreso: string;

  /** Oficina de inspección asignada para la solicitud. */
  oficinaInspeccion: string;

  /** Punto de inspección donde se llevará a cabo la revisión. */
  puntoInspeccion: string;

  /** Clave UCON asociada a la solicitud. */
  claveUCON: string;

  /** Establecimiento TIF relacionado con la solicitud. */
  establecimientoTIF: string;

  /** Régimen bajo el cual se encuentra la solicitud. */
  regimen: string;

  /** Número de folio de la solicitud. */
  foliodel: string;
}

/**
 * Interfaz que representa los datos de la movilización.
 */
export interface Movilizacion {
  /** Coordenadas geográficas del punto de movilización. */
  coordenadas: string;

  /** Nombre del lugar o entidad relacionado con la movilización. */
  nombre: string;

  /** Medio utilizado para la movilización (ejemplo: terrestre, aéreo, marítimo). */
  medio: string;

  /** Tipo de transporte utilizado para la movilización. */
  transporte: string;

  /** Punto específico donde se realiza la movilización. */
  punto: string;
}

/**
 * Interfaz que representa los datos de registro de toma de muestras de mercancías.
 * Contiene el estado de las solicitudes 220502.
 */
export interface RegistroTomaMuestrasMercanciasDatos {
  /**
   * Estado de la solicitud 220502.
   */
  solicitud220502State: Solicitud220502State;
}

/**
 * Representa la información de una mercancía incluida en la solicitud.
 */
export interface MercanciasLista {
  /** Número de partida arancelaria de la mercancía. */
  partida: string;

  /** Tipo de requisito aplicable a la mercancía. */
  tiporequisito: string;

  /** Descripción del requisito. */
  requisito: string;

  /** Identificador del certificado asociado. */
  certificado: number;

  /** Código de fracción arancelaria. */
  fraccion: string;

  /** Descripción de la fracción arancelaria. */
  fracciondescripcion: string;

  /** Código NICOD de la mercancía. */
  nicod: string;

  /** Descripción asociada al código NICOD. */
  nicodescripcion: string;

  /** Descripción general de la mercancía. */
  descripcion: string;

  /** Unidad de medida de trabajo (UMT). */
  umt: string;

  /** Cantidad expresada en la unidad de medida de trabajo (UMT). */
  cantidadumt: number;

  /** Unidad de medida comercial (UMC). */
  umc: string;

  /** Cantidad expresada en la unidad de medida comercial (UMC). */
  cantidadumc: number;

  /** Uso o destino de la mercancía. */
  uso: string;

  /** Tipo de producto de la mercancía. */
  tipodeproducto: string;

  /** País de origen de la mercancía. */
  paisorigen: string;

  /** País de procedencia de la mercancía. */
  paisprocedencia: string;

  /** Identificador del certificado internacional electrónico asociado. */
  certificadoInternacionalElectronico: string;
}
