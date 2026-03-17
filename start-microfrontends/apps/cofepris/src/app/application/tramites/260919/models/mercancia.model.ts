

export interface CrossListLable {
  /** Texto que aparece en la parte izquierda de la etiqueta. */
  tituluDeLaIzquierda: string;

  /** Texto que aparece en la parte derecha de la etiqueta. */
  derecha: string;
}

export interface CrossList {
  /** Etiquetas asociadas a la lista cruzada. */
  label: CrossListLable;

  /** Fechas asociadas con los datos de la lista cruzada. */
  fechas: string[];
}

export interface MercanciaCrossList {
  /** Lista cruzada para los países de origen de la mercancía. */
  paisOrigenCrossList: CrossList;

  /** Lista cruzada para los países de procedencia de la mercancía. */
  paisProcedencisCrossList: CrossList;

  /** Lista cruzada para los usos específicos de la mercancía. */
  usoEspecificoCrossList: CrossList;
}

export interface MercanciasInfo {
  /** Identificador único de la mercancía. */
  id: number;

  /** Clasificación de la mercancía. */
  clasificaionProductos: string;

  /** Especificación adicional de la mercancía. */
  especificarProducto: string;

  /** Denominación específica de la mercancía. */
  denominacionEspecifica: string;

  /** Denominación distintiva de la mercancía. */
  denominacionDistintiva: string;

  /** Denominación común de la mercancía. */
  denominacionComun: string;

  /** Forma farmacéutica de la mercancía. */
  formaFarmaceutica: string;

  /** Estado físico de la mercancía. */
  estadoFisico: string;

  /** Fracción arancelaria de la mercancía. */
  fraccionArancelaria: string;

  /** Descripción de la fracción arancelaria. */
  descripcionDeLaFraccion: string;

  /** Unidad de medida de la mercancía. */
  UMC: string;

  /** Cantidad en la unidad de medida comercial (UMC). */
  cantidadUMC: string;

  /** Unidad de medida de transporte (UMT). */
  UMT: string;

  /** Cantidad en la unidad de medida de transporte (UMT). */
  cantidadUMT: string;

  /** Presentación de la mercancía. */
  presentacion: string;

  numeroDeRegistoSanitario: string;

  /** País de origen de la mercancía. */
  paisDeOrigen: string;

  /** País de procedencia de la mercancía. */
  paisdeProcedencia: string;

  /** Tipo de producto de la mercancía. */
  tipoProducto: string;

  /** Uso específico de la mercancía. */
  usoEspecifico: string;

  fechaDeCaducidad: string;
}