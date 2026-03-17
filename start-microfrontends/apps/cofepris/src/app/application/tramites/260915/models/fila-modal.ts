/**
 * Interfaz que representa los datos de una fila.
 */
export interface FilaData {
  /** Identificador único de la fila. */
  id: number;

  /** Objeto que contiene la clave y descripción del SCIAN. */
  claveScianG: {
    /** Clave del SCIAN. */
    claveScian: string;

    /** Descripción del SCIAN. */
    descripcionDelScian: string;
  };
}

/**
 * Interfaz que representa los datos de una fila extendida.
 */
export interface FilaData2 {
  /** Identificador único de la fila. */
  id: number;
  
  /** Clasificación de los productos. */
  clasificaionProductos: string;

  /** Especificación del producto. */
  especificarProducto: string;

  /** Nombre específico del producto. */
  nombreProductoEspecifico: string;

  /** denominacionDistintiva del producto. */
  denominacionDistintiva: string;

  /** Denominación del nombre del producto. */
  denominacionNombre: string;

  /** Tipo de producto. */
  tipoProducto: string;

  /** Estado físico del producto. */
  estadoFisico: string;

  /** Fracción arancelaria del producto. */
  fraccionArancelaria: string;

  /** Descripción de la fracción arancelaria. */
  descripcionFraccionArancelaria: string;

  /** Presentación farmacéutica del producto. */
  presentacionFarmaceutica: string;

  /** Cantidad en la unidad de medida de tarifa (UMT). */
  cantidadUMT: string;

  /** Unidad de medida de tarifa (UMT). */
  umt: string;

  /** Cantidad en la unidad de medida de comercialización (UMC). */
  cantidadUMC: string;

  /** Unidad de medida de comercialización (UMC). */
  umc: string;

  /** País de origen del producto. */
  paisDeOrigen: string;

  /** País de procedencia del producto. */
  paisDeProcedencia: string;

  /** Uso específico del producto. */
  usoEspecifico: string;
}

/**
 * Interfaz que representa los datos de una fila con información adicional.
 */
export interface FilaData3 {

 /** Identificador único. */
  id: number;

  /** Justificación del trámite. */
  justification: string;

  /** Denominación del solicitante. */
  denominacion: string;

  /** Correo electrónico del solicitante. */
  correoelectronico: string;

  /** Código postal del domicilio. */
  codigopostal: string;

  /** Estado del domicilio. */
  estado: string;

  /** Municipio o alcaldía del domicilio. */
  municipoyalcaldia: string;

  /** Localidad del domicilio. */
  localidad: string;

  /** Colonia del domicilio. */
  colonia: string;

  /** Calle del domicilio. */
  calle: string;

  /** Lada telefónica. */
  lada: string;

  /** Teléfono del solicitante. */
  telefono: string;

  /** Indica si se cuenta con aviso de funcionamiento. */
  avisoDeFuncionamiento: string;

  /** Licencia sanitaria del solicitante. */
  licenciaSanitaria: string;

  /** Régimen al que se destinarán las mercancías. */
  regimenalque: string;

  /** Aduana relacionada con el trámite. */
  aduana: string;

  /** RFC del solicitante. */
  rfc: string;

  /** Razón social legal del solicitante. */
  legalRazonSocial: string;

  /** Apellido paterno del solicitante. */
  apellidoPaterno: string;

  /** Apellido materno del solicitante. */
  apellidoMaterno: string;
}

/**
 * Interfaz que representa una lista de claves.
 */
export interface ListaClave {
  /** Identificador único de la clave. */
  id: number;

  /** Clave de los lotes. */
  claveDeLosLotes: string;

  /** Fecha de fabricación del lote. */
  fechaDeFabricacion: string;

  /** Fecha de caducidad del lote. */
  fechaDeCaducidad: string;
}
