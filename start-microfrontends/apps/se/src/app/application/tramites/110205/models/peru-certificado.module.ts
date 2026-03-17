/**
 * @interface ListaPasoWizard
 * @description
 * Interfaz que representa un paso dentro del asistente (wizard) del trámite.
 * Define la estructura de cada paso, incluyendo su índice, título, y los estados de activo y completado.
 *
 * @property {number} indice - Índice del paso dentro del flujo del wizard.
 * @property {string} titulo - Título descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está activo actualmente.
 * @property {boolean} completado - Indica si el paso ha sido completado por el usuario.
 */
export interface ListaPasoWizard {
  /** Índice del paso dentro del wizard */
  indice: number;
  /** Título descriptivo del paso */
  titulo: string;
  /** Indica si el paso está activo actualmente */
  activo: boolean;
  /** Indica si el paso ha sido completado */
  completado: boolean;
}

/**
 * @interface AccionBoton
 * @description
 * Interfaz que representa un botón de acción dentro del flujo del trámite.
 * Define la acción a ejecutar y el valor asociado a dicha acción, como el índice del paso al que se debe navegar.
 *
 * @property {string} accion - Acción que se debe realizar (por ejemplo, avanzar o retroceder en el wizard).
 * @property {number} valor - Valor asociado a la acción, generalmente el índice del paso al que se debe navegar.
 */
export interface AccionBoton {
  /** Acción que se debe realizar */
  accion: string;
  /** Valor asociado a la acción */
  valor: number;
}

/**
 * 
 * @interface TablaDatosModal
 * Interfaz que representa los datos de una tabla modal.
 * @property {number} id - Identificador único del registro.
 * @property {number} fraccionArancelaria - Código de fracción arancelaria asociado.
 * @property {string} nombreTecnico - Nombre técnico del producto.
 * @property {number} numeroDeRegistrodeProductos - Número de registro del producto.
 * @property {string} fechaExpedicion - Fecha de expedición del registro (en formato ISO).
 * @property {string} fechaVencimiento - Fecha de vencimiento del registro (en formato ISO).
 * @property {string} nombreComercial - Nombre comercial del producto.
 */
export interface TablaDatosModal {
  id: number,
  fraccionArancelaria: number,
  nombreTecnico: string,
  numeroDeRegistrodeProductos: number,
  fechaExpedicion: string,
  fechaVencimiento: string,
  nombreComercial: string
}

/**
 * Interfaz que representa las columnas históricas de un productor.
 * 
 * @property {number} id - Identificador único del registro histórico.
 * @property {string} nombreProductor - Nombre del productor asociado al registro.
 * @property {string} numeroRegistroFiscal - Número de registro fiscal del productor.
 * @property {string} direccion - Dirección física del productor.
 * @property {string} correoElectronico - Correo electrónico de contacto del productor.
 * @property {string} telefono - Número de teléfono del productor.
 * @property {string} fax - Número de fax del productor.
 */
export interface HistoricoColumnas {
  id: number;
  nombreProductor: string;
  numeroRegistroFiscal: string;
  direccion: string;
  correoElectronico: string;
  telefono: string;
  fax: string;
}

/**
 * @interface ProductorExportador
 * @description
 * Interfaz que representa los datos del productor exportador.
 * Contiene un arreglo de objetos `HistoricoColumnas` que almacena la información histórica de los productores exportadores registrados.
 *
 * @property {HistoricoColumnas[]} datos - Lista de registros históricos de productores exportadores.
 */
export interface ProductorExportador {
  datos: HistoricoColumnas[];
}


/**
 * @interface MercanciaTabla
 * @description
 * Interfaz que representa la estructura de una mercancía en la tabla de mercancías del trámite.
 * Contiene los datos principales de cada mercancía registrada, como fracción arancelaria, tipo de factura, cantidad, unidad de medida, nombres y valores.
 *
 * @property {string} fraccionArancelaria - Fracción arancelaria de la mercancía.
 * @property {string} tipoFactura - Tipo de factura asociada a la mercancía.
 * @property {string} cantidad - Cantidad de la mercancía.
 * @property {string} unidadMedida - Unidad de medida de la mercancía.
 * @property {string} nombreTecnico - Nombre técnico de la mercancía.
 * @property {string} nombreComercial - Nombre comercial de la mercancía.
 * @property {string} valorMercancia - Valor de la mercancía.
 * @property {string} rfcProductor - RFC del productor de la mercancía.
 */
export interface MercanciaTabla {
  fraccionArancelaria: string;
  tipoFactura: string;
  cantidad: string;
  unidadMedida: string;
  nombreTecnico: string;
  nombreComercial: string;
  valorMercancia: string;
  rfcProductor: string;
  numeroFactura?: string;
  complemento?: string;
  complementoDescripcion?: string;
  fetchFactura?: string;
  rfcProductor1?: string;
}
/**
 * @interface MercanciasHistorico
 * @description
 * Interfaz que representa el histórico de mercancías.
 * Contiene una lista de datos de tipo `MercanciaTabla` que almacena el historial de mercancías registradas en el trámite.
 *
 * @property {MercanciaTabla[]} datos - Lista de datos de tipo `MercanciaTabla` que contiene el histórico de mercancías.
 */
export interface MercanciasHistorico {
  datos: MercanciaTabla[];
}
/**
 * @interface GrupoRepresentativo
 * @description
 * Interfaz que representa los datos de un grupo representativo.
 */
export interface GrupoRepresentativo {
  lugar: string;
  nombreExportador: string;
  empresa: string;
  cargo: string;
  telefono: string;
  correoElectronico: string;
}