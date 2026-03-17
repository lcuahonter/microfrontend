import { Mercancia } from "../../../shared/models/modificacion.enum";

/**
 * Representa las columnas del historial de productores.
 */
export interface HistoricoColumnas {
  /** Identificador único del productor. */
  id: number;
  /** Nombre del productor. */
  nombreProductor: string;
  /** Número de registro fiscal del productor. */
  numeroRegistroFiscal: string;
  /** Dirección del productor. */
  direccion: string;
  /** Correo electrónico del productor. */
  correoElectronico: string;
  /** Número telefónico del productor. */
  telefono: string;
  /** Número de fax del productor. */
  fax: string;
}

/**
 * Representa los datos del productor exportador.
 */
export interface ProductorExportador {
  datos: HistoricoColumnas[];
}
/**
 * Representa un elemento de un catálogo.
 */
export interface Catalogo {
  id: number;
  descripcion: string;
}
/**
 * Representa una lista de elementos de un catálogo.
 */
export interface CatalogoLista {
  datos: Catalogo[];
}
/**
 * Representa el formulario para agregar datos del productor.
 */
export interface AgregarDatosProductorFormulario {
  numeroRegistroFiscal: string;
  fax: string;
}
/**
 * Representa los datos del grupo receptor.
 */
export interface GrupoReceptor {
  nombre: string;
  apellidoPrimer: string;
  apellidoSegundo: string;
  numeroFiscal: string;
  razonSocial: string;
}
/**
 * Representa los datos del grupo de direcciones.
 */
export interface GrupoDeDirecciones {
  ciudad: string;
  calle: string;
  numeroLetra: string;
  lada: string;
  telefono: string;
  fax: string;
  correoElectronico: string;
}
/**
 * Representa los datos del grupo representativo.
 */
export interface GrupoRepresentativo {
  lugar: string;
  nombreExportador: string;
  empresa: string;
  cargo: string;
  registroFiscal: string;
  correoElectronico: string;
  telefono: string;
  fax: string;
}

/**
 * Representa los datos del grupo de transporte.
 */
export interface GrupoDeTransporte {
  puertoEmbarque: string;
  puertoDesembarque: string;
  puertoTransito: string;
  nombreEmbarcacion: string;
  numeroVuelo: string;
}
/**
 * Representa una acción de un botón.
 */
export interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Representa los datos del grupo operador.
 */
export interface GrupoOperador {
  nombre: string;
  apellidoPrimer: string;
  apellidoSegundo: string;
  numeroFiscal: string;
  razonSocial: string;
}
/**
 * Representa los datos del grupo de domicilio.
 */
export interface GrupoDeDomicilio {
  pais: string;
  ciudad: string;
  calle: string;
  numeroLetra: string;
  lada: string;
  telefono: string;
  fax: string;
  correoElectronico: string;
}
/**
 * Representa los datos del grupo tratado.
 */
export interface GrupoTratado {
  tratado: string;
  pais: string;
  fraccionArancelaria: string;
  numeroRegistro: string;
  nombreComercial: string;
  fechaFinalInput: string;
  fechaInicialInput: string;
}

/**
 * Representa los datos de la tabla de mercancías disponibles.
 */
export interface DisponiblesTabla {
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  numeroRegistroProductos: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
}
/**
 * Representa los datos de la tabla de mercancías seleccionadas.
 */
export interface SeleccionadasTabla {
  id: number;
  fraccionArancelaria: string;
  cantidad: string;
  unidadMedida: string;
  valorMercancia: string;
  tipoFactura: string;
  numFactura: string;
  complementoDescripcion: string;
  fechaFactura: string;
}
/**
 * Representa los datos del formulario de mercancías.
 */
export interface FormularioMercancia {
  fraccionMercanciaArancelaria: string;
  nombreTecnico: string;
  nombreComercialDelaMercancia: string;
  criterioParaConferir: string;
  nombreEnIngles: string;
  otrasInstancias: string;
  cantidad: string;
  pais: string;
  valorDelaMercancia: string;
  complementoDelaDescripcion: string;
  tipoFactura: string;
  fecha: string;
  numeroFactura: string;
}

/**
 * Interfaz que representa la información detallada de una mercancía.
 */
export interface Mercancias {
  /** 
   * Fracción arancelaria Naladi asignada a la mercancía.
   */
  fraccionNaladi: string;

  /**
   * Fracción arancelaria Naladi SA 93 correspondiente.
   */
  fraccionNaladiSa93: string;

  /**
   * Fracción arancelaria Naladi SA 96 correspondiente.
   */
  fraccionNaladiSa96: string;

  /**
   * Fracción arancelaria Naladi SA 02 correspondiente.
   */
  fraccionNaladiSa02: string;

  /**
   * Nombre técnico descriptivo de la mercancía.
   */
  nombreTecnico: string;

  /**
   * Nombre comercial utilizado para la mercancía.
   */
  nombreComercial: string;

  /**
   * Norma de origen aplicable a la mercancía.
   * @optional
   */
  normaOrigen?: string;

  /**
   * Identificador único de la mercancía.
   * @optional
   */
  id?: string;

  /**
   * Cantidad total de la mercancía.
   * @optional
   */
  cantidad?: string;

  /**
   * Unidad de medida comercial para la cantidad.
   * @optional
   */
  umc?: string;

  /**
   * Tipo de factura asociada a la mercancía.
   * @optional
   */
  tipoFactura?: string;

  /**
   * Valor económico total de la mercancía.
   * @optional
   */
  valorMercancia?: string;

  /**
   * Fecha final relacionada con la entrada o registro de la mercancía.
   * @optional
   */
  fechaFinalInput?: string;

  /**
   * Número de la factura asociada.
   * @optional
   */
  numeroFactura?: string;

  /**
   * Código Nalad relacionado con la mercancía.
   * @optional
   */
  nalad?: string;

  /**
   * Complemento adicional para la clasificación arancelaria.
   * @optional
   */
  complementoClasificacion?: string;
}
/**
 * @interface MercanciasHistorico
 * @description
 * Interfaz que representa el historial de mercancías.
 * Contiene una lista de objetos de tipo `MercanciaTabla` que almacenan los datos históricos de las mercancías asociadas al trámite.
 * 
 */
export interface MercanciasHistorico {
  /**
  * @property {MercanciaTabla[]} datos - Lista de datos históricos de mercancías.
  * @description
  * Arreglo que contiene los datos históricos de mercancías, cada uno representado por un
  * objeto de tipo `MercanciaTabla`.
  */
  datos: Mercancia[];
}
export interface MercanciasHistoricos {
  /**
  * @property {MercanciaTabla[]} datos - Lista de datos históricos de mercancías.
  * @description
  * Arreglo que contiene los datos históricos de mercancías, cada uno representado por un
  * objeto de tipo `MercanciaTabla`.
  */
  datos: MercanciaTabla[];
}

/**
 * @interface MercanciaTabla
 * @description
 * Interfaz que representa la tabla de mercancías.
 * Contiene información detallada sobre las mercancías, incluyendo fracción arancelaria,
 * tipo de factura, cantidad, unidad de medida, nombres técnicos y comerciales, 
 * valor de la mercancía y RFC del productor.
 * 
 */
export interface MercanciaTabla {
  fraccionArancelaria?: string;
  tipoFactura?: string;
  cantidad?: string;
  unidadMedida?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  valorMercancia: string;
  rfcProductor?: string;
  numeroFactura?: string;
  complemento?: string;
  complementoDescripcion?: string;
  fetchFactura?: string;
  rfcProductor1?: string;
}

/** Interfaz que define la estructura de un ítem de mercancía en la respuesta de búsqueda.
 */
export interface MercanciaResponseItem {
  idMercancia: number;
  fraccionArancelaria?: string;
  numeroRegistroProducto?: string;
  fechaExpedicion?: string;
  fechaVencimiento?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  criterioOrigen?: string;
  valorContenidoRegional?: string;
  normaOrigen?: string;
  nombreIngles?: string;
}

/** Interfaz que define la estructura de la respuesta de búsqueda de mercancías.
 */
export interface BuscarMercanciasResponse {
  datos?: MercanciaResponseItem[];
}