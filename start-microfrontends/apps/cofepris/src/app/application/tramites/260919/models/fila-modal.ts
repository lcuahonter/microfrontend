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
  /**
 * Clasificación de los productos.
 */
clasificaionProductos: string,

/**
 * Especificación del producto.
 */
especificarProducto: string,

/**
 * Denominación específica del producto.
 */
denominacionEspecifica: string,

/**
 * Denominación distintiva del producto.
 */
denominacionDistintiva: string,

/**
 * Denominación común del producto.
 */
denominacionComun: string,

/**
 * Forma farmacéutica del producto.
 */
formaFarmaceutica: string,

/**
 * Estado físico del producto.
 */
estadoFisico: string,

/**
 * Fracción arancelaria del producto.
 */
fraccionArancelaria: string,

/**
 * Descripción de la fracción arancelaria.
 */
descripcionDeLaFraccion: string,

/**
 * Unidad de medida comercial (UMC) del producto.
 */
UMC: string,

/**
 * Cantidad en la unidad de medida comercial (UMC).
 */
cantidadUMC: string,

/**
 * Unidad de medida de transporte (UMT) del producto.
 */
UMT: string,

/**
 * Cantidad en la unidad de medida de transporte (UMT).
 */
cantidadUMT: string,

/**
 * Presentación del producto.
 */
presentacion: string,

/**
 * Número de registro sanitario del producto.
 */
numeroDeRegistoSanitario: string,

/**
 * País de origen del producto.
 */
paisDeOrigen: string,

/**
 * País de procedencia del producto.
 */
paisdeProcedencia: string,

/**
 * Tipo de producto.
 */
tipoProducto: string,

/**
 * Uso específico del producto.
 */
usoEspecifico: string,

/**
 * Fecha de caducidad del producto.
 */
fechaDeCaducidad: string
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

export interface FilaTablaData{
  
  id: number;
  /**
 * Nombre del tercero relacionado.
 */
nombre: string,

/**
 * RFC del tercero relacionado.
 */
rfc: string,

/**
 * CURP del tercero relacionado.
 */
curp: string,

/**
 * Teléfono del tercero relacionado.
 */
telefono: number,

/**
 * Correo electrónico del tercero relacionado.
 */
correoElectronico: string,

/**
 * Calle del domicilio del tercero relacionado.
 */
calle: string,

/**
 * Número exterior del domicilio del tercero relacionado.
 */
numeroExterior: number,

/**
 * Número interior del domicilio del tercero relacionado.
 */
numeroInterior: number,

/**
 * País del domicilio del tercero relacionado.
 */
pais: string,

/**
 * Colonia del domicilio del tercero relacionado.
 */
colonia: string,

/**
 * Municipio del domicilio del tercero relacionado.
 */
municipio: string,

/**
 * Localidad del domicilio del tercero relacionado.
 */
localidad: string,

/**
 * Entidad federativa del domicilio del tercero relacionado.
 */
entidadFederativa: string,

/**
 * Estado o localidad del domicilio del tercero relacionado.
 */
estadoLocalidad: string,

/**
 * Código postal del domicilio del tercero relacionado.
 */
codigo: string,

/**
 * Colonia o equivalente del domicilio del tercero relacionado.
 */
coloniaoEquivalente: string



/** Tipo de persona (física o moral). */
tipoPersona: string;



/** Estado del domicilio del destinatario. */
estado: string;

/** Estado alternativo del domicilio del destinatario. */
estado2: string;

/** Código postal del domicilio del destinatario. */
codigopostal: string;

/** Domicilio completo del destinatario. */
domicilio: string;

/** Lada telefónica del destinatario. */
lada: string;

/** Primer apellido del destinatario. */
primerApellido: string;

/** Segundo apellido del destinatario. */
segundoApellido: string;

/** Denominación del destinatario (en caso de persona moral). */
denominacion: string;
}

