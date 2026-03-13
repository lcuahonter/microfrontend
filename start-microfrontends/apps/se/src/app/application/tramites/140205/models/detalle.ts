/**
 * Representa la respuesta de una consulta de certificado de origen.
 *
 * @interface RespuestaConsulta
 */
export interface RespuestaConsulta {
  /** Indica si la consulta fue exitosa. */
  success: boolean;

  /** Datos devueltos como resultado de la consulta. */
  datos: ConsultaDatos;

  /** Mensaje informativo de la respuesta. */
  message: string;
}

/**
 * Representa los datos de la consulta de un certificado de origen.
 *
 * @interface ConsultaDatos
 */
export interface ConsultaDatos {
  /** Datos del grupo de folio asociados a la consulta. */
  GrupoFolio: GrupoFolio;

  /** Datos del grupo de empresa asociados a la consulta. */
  GrupoEmpresa: GrupoEmpresa;

  /** Datos del grupo de cupo asociados a la consulta. */
  GrupoCupo: GrupoCupo;

  /** Datos del detalle de cupo asociados a la consulta. */
  GrupoDatalleCupo: GrupoDatalleCupo;
}

/**
 * Representa los datos de un Grupo de Empresa.
 *
 * @interface GrupoEmpresa
 */
export interface GrupoEmpresa {
  /** RFC (Registro Federal de Contribuyentes) de la empresa. */
  rfc: string;

  /** Nombre de la empresa. */
  nombre: string;

  /** Primer apellido del representante legal de la empresa. */
  primerApellido: string;

  /** Segundo apellido del representante legal de la empresa. */
  segundoApellido: string;

  /** Actividad económica principal de la empresa. */
  actividadEconomica: string;

  /** Información adicional asociada al RFC. */
  datosRfc: string;

  /** Clave de identificación interna de la empresa. */
  clave: string;

  /** Correo electrónico de contacto de la empresa. */
  correo: string;

  /** Nombre de la calle de la dirección fiscal. */
  calle: string;

  /** Número exterior de la dirección de la empresa. */
  numeroExterior: string;

  /** Número interior de la dirección de la empresa. */
  numeroInterior: string;

  /** Código postal correspondiente a la dirección. */
  codigoPostal: string;

  /** Colonia de la dirección de la empresa. */
  colonia: string;

  /** País donde se encuentra ubicada la empresa. */
  pais: string;

  /** Estado o entidad federativa donde se ubica la empresa. */
  estado: string;

  /** Localidad correspondiente a la dirección de la empresa. */
  localidad: string;

  /** Teléfono de contacto de la empresa. */
  telefono: string;

  /** Municipio o alcaldía donde se encuentra la empresa. */
  municipio: string;
}

/**
 * Representa los datos de un GrupoCupo.
 */
/**
 * Representa los datos de un Grupo de Cupo.
 *
 * @interface GrupoCupo
 */
export interface GrupoCupo {
  /** Identificador aduanero asociado al cupo. */
  aduanero: string;

  /** Mecanismo de asignación del cupo. */
  mecanismo: string;

  /** Tratado comercial asociado al cupo. */
  tratado: string;

  /** Nombre del producto principal dentro del cupo. */
  nombreProducto: string;

  /** Nombre del subproducto relacionado al cupo. */
  nombreSubproducto: string;

  /** Indicador federal relacionado con el cupo. */
  federal: string;
}

/**
 * Representa los datos de un GrupoDatalleCupo.
 */
/**
 * Representa los detalles de un cupo.
 *
 * @interface GrupoDatalleCupo
 */
export interface GrupoDatalleCupo {
  /** Identificador aduanero del cupo. */
  aduanero: string;

  /** Clasificación del subproducto asociado al cupo. */
  clasificacionSubproducto: string;

  /** Descripción del producto incluido en el cupo. */
  descripcionProducto: string;

  /** Unidad de medida del producto o subproducto. */
  unidad: string;

  /** Mecanismo de asignación del cupo. */
  mecanismo: string;

  /** Tratado comercial aplicable al cupo. */
  tratado: string;

  /** Fracciones arancelarias relacionadas con el cupo. */
  arancelarias: string;

  /** Países a los que aplica el cupo. */
  paises: string;

  /** Observaciones adicionales sobre el cupo. */
  observaciones: string;

  /** Fundamentos legales o normativos del cupo. */
  fundamentos: string;

  /** Fecha de finalización de la vigencia del cupo. */
  fin: string;

  /** Fecha de inicio de la vigencia del cupo. */
  inicio: string;
}

/**
 * Representa los datos de un GrupoFolio.
 */
/**
 * Representa los datos de un Grupo de Folio.
 *
 * @interface GrupoFolio
 */
export interface GrupoFolio {
  /** Monto total asignado al folio. */
  montoAsignado: string;

  /** Monto aún disponible en el folio. */
  montoDisponible: string;

  /** Monto ya expedido del folio. */
  montoExpedido: string;
}

/**
 * Interfaz que representa la estructura de un cupo, incluyendo detalles del producto, mecanismo y tipo.
 */
export interface Cupos {
  /** Cantidad asignada del cupo */
  cupo: number;
  /** Nombre del producto asociado al cupo */
  nombreProducto: string;
  /** Nombre del subproducto asociado al cupo */
  nombreSubproducto: string;
  /** Mecanismo utilizado para la asignación del cupo */
  mecanismoAsignacion: string;
  /** Tipo de cupo asignado */
  tipoCupo: string;
}
/**
 * Representa la configuración de un cupo con datos como folio, razón social,
 * estado, fabricante, importador, unidades y montos económicos asociados.
 * Funciona como contrato de datos para validar y gestionar la información.
 */
export interface ConfiguracionCertificados {
  idExpedicion: number;
  numCertificado: number;
  rfc: string;
  denominacion: string;
  numFolioOficio: string;
  numFolioTramite: string | null;
  estado: string;
  estadoCancelacion: number;
  montoAsignado: number;
  montoDisponible: number;
  montoExpedido: number;
  montoCancelado: number;
  representacionFederal: string;
  claveRepresentacionFederal: string;
  factorConversion: number;
  estadoTransmision: string | null;
  montoEjercidoCBP: number;
  fabricante: string;
  importador: string;
}

/**
 * Representa la estructura de un cupo con detalles adicionales como vigencia,
 * fundamentos, régimen, unidad de medida, producto asociado, entre otros.
 */
export interface CupoDetalle {
  idCupo: number;
  fechaInicioVigencia: string;
  fechaFinVigencia: string;
  fundamentos: string;
  regimen: string;
  unidadMedidaComercializacion: boolean;
  ideClasifSubproducto: string | null;
  descSubProductoOtro: string | null;
  ideTipoCupo: string;
  cveUsuario: string;
  cveProducto: string;
  idTratadoAcuerdo: number;
  cveUnidadMedidaOficialCupo: string;
  idCupoR: number | null;
  producto: ProductoDetalle;
}

/**
 * Representa los detalles de un producto asociado a un cupo.
 */
export interface ProductoDetalle {
  clave: string;
  sigla: string;
  nombre: string;
  descripcion: string;
  fechaCaptura: string;
  fechaInicioVigencia: string;
  fechaFinVigencia: string | null;
  blnActivo: boolean;
}

  
  export interface Facturas {
    numeroDeFactura: string;
    importeInicial: string;
    saldoaDevolver?: string;
  }
  
  export interface Facturase {
    numeroDeFactura: string;
    importeInicial: string;
  
  }