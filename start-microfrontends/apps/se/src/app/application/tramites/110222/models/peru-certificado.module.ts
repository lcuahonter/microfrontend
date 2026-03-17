/**
 * @interface ListaPasoWizard
 * @description
 * Interfaz que representa un paso en el asistente (wizard) del trámite PROSEC.
 * Cada objeto de esta interfaz define la información necesaria para mostrar y controlar el estado de un paso dentro del flujo del wizard.
 */
export interface ListaPasoWizard {
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
 * @interface AccionBoton
 * @description
 * Interfaz que representa un botón de acción utilizado en el flujo del wizard del trámite PROSEC.
 * Define la acción a ejecutar y el valor asociado a dicha acción, como el índice del paso al que se debe navegar.
 */
export interface AccionBoton {
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
 * @interface TablaDatosModal
 * @description
 * Interfaz que representa los datos de una tabla modal en el contexto de un certificado en Perú.
 * 
 */
export interface TablaDatosModal {
  /**
   * @property {number} id - Identificador único del registro.
   * @description
   * Identificador único del registro en la tabla de datos del certificado.
   */
  id: number,
  /**
   * @property {number} fraccionArancelaria - Código de la fracción arancelaria asociada.
   * @description
   * Código de la fracción arancelaria asociada al producto del certificado.
   */
  fraccionArancelaria: number,
  /**
   * @property {string} nombreTecnico - Nombre técnico del producto.
   * @description
   * Nombre técnico del producto registrado en el certificado.
   */
  nombreTecnico: string,
  /**
   * @property {number} numeroDeRegistrodeProductos - Número de registro del producto.
   *  @description
   * Número de registro del producto en el certificado, utilizado para identificarlo de manera única.
   */
  numeroDeRegistrodeProductos: number,
  /**
   * @property {string} fechaExpedicion - Fecha de expedición del certificado (formato ISO 8601).
   * @description
   * Fecha de expedición del certificado, representada en formato ISO 8601 (YYYY
   */
  fechaExpedicion: string,
  /**
   * @property {string} fechaVencimiento - Fecha de vencimiento del certificado (formato ISO 8601).
   * @description
   * Fecha de vencimiento del certificado, representada en formato ISO 8601 (YYYY
   */
  fechaVencimiento: string,
  /**
   * @property {string} nombreComercial - Nombre comercial del producto.
   * @description
   * Nombre comercial del producto registrado en el certificado, utilizado para su identificación en el mercado.
   */
  nombreComercial: string
}

/**
 * @interface RespuestaCatalogos
 * @description
 * Interfaz que representa las columnas históricas de un productor.
 *
 */
export interface HistoricoColumnas {
  /**
   * @property {number} id - Identificador único del productor.
   * @description
   * Identificador único del productor en el sistema.
   */
  id: number;
  /**
   * @property {string} nombreProductor - Nombre del productor.
   * @description
   * Nombre completo del productor registrado en el sistema.
   */
  nombreProductor: string;
  /**
   * @property {string} numeroRegistroFiscal - Número de registro fiscal del productor.
   * @description
   * Registro fiscal del productor, utilizado para fines tributarios y legales.
   */
  numeroRegistroFiscal: string;
  /**
   * @property {string} direccion - Dirección del productor.
   * @description
   * Dirección física del productor, donde se pueden localizar sus instalaciones.
   */
  direccion: string;
  /**
   * @property {string} correoElectronico - Correo electrónico de contacto del productor.
   * @description
   * Correo electrónico utilizado para la comunicación con el productor.
   */
  correoElectronico: string;
  /**
   * @property {string} telefono - Número de teléfono de contacto del productor.
   * @description
   * Número telefónico utilizado para contactar al productor.
   */
  telefono: string;
  /**
   * @property {string} fax - Número de fax del productor.
   * @description
   * Número de fax utilizado para enviar documentos al productor.
   */
  fax: string;
}

/**
 * @interface ProductorExportador
 * @description
 * Interfaz que representa un productor exportador con un historial de datos asociados.
 * 
 */
export interface ProductorExportador {
  /**
  * @property {HistoricoColumnas[]} datos - Lista de columnas históricas asociadas al productor exportador.
  * @description
  * Arreglo que contiene los datos históricos del productor exportador, cada uno representado por un
  * objeto de tipo `HistoricoColumnas`.
  */
  datos: HistoricoColumnas[];
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
  datos: MercanciaTabla[];
}

/**
 * @interface Catalogo
 * @description
 * Interfaz que representa un elemento de un catálogo.
 * 
 */
export interface Catalogo {
  /**
   * @property {number} id - Identificador único del elemento del catálogo.
   * @description
   * Identificador único que distingue cada elemento dentro del catálogo.
   */
  id: number;
  /**
   * @property {string} description - Descripción del elemento del catálogo.
   * @description
   * Texto descriptivo que proporciona información sobre el elemento del catálogo.
   */
  descripcion: string;
}

/**
 * Representa los datos del grupo representativo.
 */
export interface GrupoRepresentativo {
  lugar: string;
  nombre: string;
  empresa: string;
  cargo: string;
  registroFiscal: string;
  correo: string;
  telefono: string;
  fax: string;
}
