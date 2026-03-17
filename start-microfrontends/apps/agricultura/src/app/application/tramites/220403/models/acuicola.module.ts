/**
 * @interface ListsPasoWizard
 * @description
 * Representa la información de un paso en el wizard del trámite.
 */
export interface ListsPasoWizard {
  /** 
   * @property {number} indice
   * @description
   * Índice del paso dentro del wizard. Determina el orden de aparición del paso.
   * Índice del paso 
   */
  indice: number;
  /** 
   * @property {string} titulo
   * @description
   * Título del paso que se muestra al usuario en la interfaz del wizard.
   * Título del paso */
  titulo: string;
  /**
   * @property {boolean} activo
   * @description
   * Indica si el paso está activo actualmente en el flujo del wizard.
   * Indica si el paso está activo */
  activo: boolean;
  /**
   * @property {boolean} completado
   * @description
   * Indica si el paso ha sido completado por el usuario. 
   * Indica si el paso está completado */
  completado: boolean;
}

/**
 * @interface AccionBoton
 * @description
 * Representa un botón de acción en la interfaz.
 */
export interface AccionBoton {
  /**
   * @property {string} accion
   * @description 
   * Acción que se debe realizar */
  accion: string;
  /**
   * @property {number} valor
   * @description 
   * Valor asociado a la acción */
  valor: number;
}

/**
 * @interface DatosPasos
 * @description
 * Contiene la información de los botones y el estado de los pasos del wizard.
 */
export interface DatosPasos {
  /**
   * @property {string} txtBtnSig
   * @description 
   * Texto del botón siguiente */
  txtBtnSig: string;
  /**
   * @property {string} txtBtnAnt
   * @description 
   * Texto del botón anterior */
  txtBtnAnt: string;
  /**
   * @property {number} indice
   * @description
   *  Índice del paso actual */
  indice: number;
  /**
   * @property {number} nroPasos
   * @description
   *  Número total de pasos */
  nroPasos: number;
}

/**
 * @interface FormularioGrupo
 * @description
 * Agrupa los datos de los diferentes formularios del trámite.
 */
export interface FormularioGrupo {
  /**
   * @property {DatosRealizar} datosRealizar
   * @description
   * Datos requeridos para realizar el trámite.
   */
  datosRealizar: DatosRealizar,
  /**
   * @property {CombinacionRequerida} combinacionRequerida
   * @description
   * Información sobre la combinación requerida para el trámite.
   */
  combinacionRequerida: CombinacionRequerida,
  /**
   * @property {Transporte} transporte
   * @description
   * Información relacionada con el transporte de la mercancía.
   */
  transporte: Transporte,
  /**
   * @property {PagoDerechos} pagoDerechos
   * @description
   * Información referente al pago de derechos del trámite.
   */
  pagoDerechos: PagoDerechos,
  /**
   * @property {TercerosRelacionados[]} tercerosRelacionados
   * @description
   * Lista de terceros relacionados con el trámite.
   */
  tercerosRelacionados: TercerosRelacionados,
  /**
   * @property {ColumnasTabla[]} columnasTabla
   * @description
   * Columnas de la tabla de partidas arancelarias y mercancías.
   */
  datosRealizarValidada: boolean,
  /**
   * @property {boolean} combinacionRequeridaValidada
   * @description
   * Indica si la combinación requerida ha sido validada.
   * */
  combinacionRequeridaValidada: boolean,
  /**
   * @property {boolean} transporteValidada
   * @description
   * Indica si la información de transporte ha sido validada.
   */
  transporteValidada: boolean,
  /**
   * @property {boolean} pagoDerechosValidada
   * @description
   * Indica si el pago de derechos ha sido validado.
   */
  pagoDerechosValidada: boolean,

  /**
   * @property {ColumnasTabla[]} mercanciasTablaDatos
   * @description
   * Datos de las mercancías en la tabla.
   */
  mercanciasTablaDatos: ColumnasTabla[];

  /**
   * @property {EmpresaProductora[]} empresaProductoraDatos
   * @description
   * Datos de la empresa productora.
   */
  empresaProductoraDatos: EmpresaProductora[];

  /**
   * @property {Importador[]} importadorDatos
   * @description
   * Datos del importador.
   */
  importadorDatos: Importador[];
}

/**
 * @interface DatosRealizar
 * @description
 * Datos requeridos para realizar el trámite.
 */
export interface DatosRealizar {
  /**
   * @property {string} certificadoTipo
   * @description
   * Tipo de certificado requerido para el trámite.
   */
  certificadoTipo: string,
  /**
   * @property {string} especie
   * @description
   * Especie de la mercancía relacionada con el trámite.
   */
  aduanaEmbarque: string,
  /**
   * @property {string} numeroContenedor
   * @description
   * numeroContenedor de la mercancía relacionada con el trámite.
    */
  numeroContenedor: string,
  /**
   * @property {string} paisOrigen
   * @description
   * paisOrigen de la mercancía relacionada con el trámite.
   */
  paisOrigen: string,
  /**
   * @property {string} entidadFederativaOrigen
   * @description
   * entidadFederativaOrigen de la mercancía relacionada con el trámite.
   */
  entidadFederativaOrigen: string,
  /**
   * @property {string} municipioOrigen
   * @description
   * municipioOrigen de la mercancía relacionada con el trámite.
   */
  municipioOrigen: string,
  /**
   * @property {string} paisDestino
   * @description
   * paisDestino de la mercancía relacionada con el trámite.
   */
  paisDestino: string,
}

/**
 * @interface CombinacionRequerida
 * @description
 * Información sobre la combinación requerida para el trámite.
 */
export interface CombinacionRequerida {
  /**
   * @property {string} especie
   * @description
   * Especie de la mercancía relacionada con el trámite.
   */
  especie: string,
  /**
   * @property {string} faseDesarrollo
   * @description
   * Fase de desarrollo de la mercancía relacionada con el trámite.
   */
  paisDeDestino: string,
  /**
   * @property {string} faseDesarrollo
   * @description
   * Fase de desarrollo de la mercancía relacionada con el trámite.
   */
  instalacionAcuicola: string
}

/**
 * @interface Transporte
 * @description
 * Información relacionada con el transporte de la mercancía.
 */
export interface Transporte {
  /**
   * @property {string} medioTransporte
   * @description
   * Medio de transporte utilizado para el envío de la mercancía.
   */
  medioTransporte: string,
  /**
   * @property {string} identificacionMedioTransporte
   * @description
   * Identificación del medio de transporte utilizado.
   */
  identificacionMedioTransporte: string,
  /**
   * @property {string} numeroContenedor
   * @description
   * Número de contenedor asociado al transporte de la mercancía.
   */
  numeroDeContenedor: string,
  /**
   * @property {string} denominacionRazonSocial
   * @description
   * Denominación o razón social del propietario del medio de transporte.
   */
  denominacionRazonSocial: string,
  /**
   * @property {string} numeroFlejes
   * @description
   * Número de flejes utilizados en el transporte de la mercancía.
   */
  numeroFlejes: string,
}

/**
 * @interface PagoDerechos
 * @description
 * Información referente al pago de derechos del trámite.
 */
export interface PagoDerechos {
  /**
   * @property {string} claveReferencia
   * @description
   * Clave de referencia del pago realizado.
   */
  claveReferencia: string,
  /**
   * @property {string} cadenaDependencia
   * @description
   * Cadena de dependencia asociada al pago.
   */
  cadenaDependencia: string,
  /**
   * @property {string} banco
   * @description
   * Banco donde se realizó el pago.
   */
  banco: string,
  /**
   * @property {string} llavePago
   * @description
   * Llave de pago utilizada para identificar la transacción.
   */
  llavePago: string,
  /**
   * @property {string} fechaPago
   * @description
   * Fecha en que se realizó el pago.
   */
  fechaPago: string,
  /**
   * @property {string} importePago
   * @description
   * Importe total del pago realizado.
   */
  importePago: string,
}

/**
 * @interface TercerosRelacionados
 * @description
 * Representa los terceros relacionados con el trámite.
 */
export interface TercerosRelacionados {

  /**
   * @property {string} tipoPersona
   * @description
   * Tipo de persona (física o moral) del importador.
   */
  tipoPersona: string;

  /**
   * @property {string} nombre
   * @description
   * Nombre del importador.
   */
  nombre: string;

  /**
   * @property {string} apellidoPaterno
   * @description
   * Apellido paterno del importador.
   */
  apellidoPaterno: string;

  /**
   * @property {string} apellidoMaterno
   * @description
   * Apellido materno del importador.
   */
  apellidoMaterno: string;

  /**
   * @property {string} razonSocial
   * @description
   * Razón social del importador.
   */
  razonSocial: string;

  /**
   * @property {string} pais
   * @description
   * País del importador.
   */
  pais: string;

  /**
   * @property {string} domicilio
   * @description
   * Domicilio del importador.
   */
  domicilio: string;

  /**
   * @property {string} lada
   * @description
   * Lada telefónica del importador.
   */
  lada: string;

  /**
   * @property {string} telefono
   * @description
   * Teléfono del importador.
   */
  telefono: string;

  /**
   * @property {string} correoElectronico
   * @description
   * Correo electrónico del importador.
   */
  correoElectronico: string;
}

/**
 * @interface ColumnasTabla
 * @description
 * Define las columnas de la tabla de partidas arancelarias y mercancías.
 */
export interface ColumnasTabla {
  /**
   * @property {string} noPartida
   * @description
   * Número de partida arancelaria de la mercancía.
   */
  noPartida: string,
  /**
   * @property {string} fraccionArancelaria
   * @description
   * Fracción arancelaria asociada a la mercancía.
   */
  fraccionArancelaria: string,
  /**
   * @property {string} descripcionFrccion
   * @description
   * Descripción de la fracción arancelaria.
   */
  descripcionFrccion: string,
  /**
   * @property {string} descripcion
   * @description
   * Descripción detallada de la mercancía.
   */
  descripcion: string,
  /**
   * @property {string} tipoFactura
   * @description
   * Tipo de factura asociada a la mercancía.
   */
  undidadUmt: string,
  /**
   * @property {string} cantidadUmt
   * @description
   * Cantidad de la mercancía medida en la unidad UMT.
   */
  cantidadUmt: string,
  /**
   * @property {string} unidadUmc
   * @description
   * Unidad de medida comercial (UMC) de la mercancía.
   */
  unidadUmc: string,
  /**
   * @property {string} cantidadUmc
   * @description
   * Cantidad de la mercancía medida en la unidad UMC.
   */
  cantidadUmc: string,
  /**
   * @property {string} valorMercancia
   * @description
   * Valor total de la mercancía.
   */
  tipoMercancia: string,
  /**
   * @property {string} tipoMercancia
   * @description
   * Tipo de mercancía (por ejemplo, acuícola, agrícola).
   */
  uso: string,
  /**
   * @property {string} uso
   * @description
   * Uso previsto de la mercancía (por ejemplo, consumo, industrial).
   */
  nombreCientifico: string,
  /**
   * @property {string} nombreCientifico
   * @description
   * Nombre científico de la especie acuícola o agrícola.
   */
  nombreComun: string,
  /**
   * @property {string} nombreComun
   * @description
   * Nombre común de la especie acuícola o agrícola.
   */
  faseDesarrollo: string,
  /**
   * @property {string} faseDesarrollo
   * @description
   * Fase de desarrollo de la especie acuícola o agrícola (por ejemplo, larva, juvenil).
   */
  presentacion: string,
  /**
   * @property {string} presentacion
   * @description
   * Presentación de la mercancía (por ejemplo, congelada, fresca).
   */
  paisProcedencia: string,
}

/**
 * @interface FilaSolicitud
 * @description
 * Representa una fila de la tabla de solicitudes, incluyendo información relevante sobre la solicitud.
 */
export interface FilaSolicitud {
  /**
   * @property {string} fechaCreacion
   * @description
   * Fecha de creación de la solicitud en formato ISO 8601.
   */
  fechaCreacion: string;
  /**
   * @property {string} mercancia
   * @description
   * Nombre o descripción de la mercancía solicitada.
   */
  mercancia: string;
  /**
   * @property {number} cantidad
   * @description
   * Cantidad de la mercancía solicitada.
   */
  cantidad: number;
  /**
   * @property {string} proveedor
   * @description
   * Nombre del proveedor de la mercancía.
   */
  proveedor: string;
}

/**
 * @interface FilaSolicitudRespuesta
 * @description
 * Representa la respuesta del servidor al solicitar datos de una fila de solicitud.
 */
export interface FilaSolicitudRespuesta {
  /**
   * @property {number} code
   * @description
   * Código de respuesta del servidor.
   */
  code: number;

  /**
   * @property {FilaSolicitud[]} data
   * @description
   * Lista de filas de solicitud obtenidas.
   */
  data: FilaSolicitud[];

  /**
   * @property {string} message
   * @description
   * Mensaje de respuesta del servidor.
   */
  message: string;
}

/**
 * @interface Exportador
 * @description Representa un exportador de productos acuícolas.
 */
export interface EmpresaProductora {
  /**
   * @property {string} nombre
   * @description Nombre de la empresa productora.
   */
  nombre: string;

  /**
   * @property {string} telefono
   * @description Número de teléfono de la empresa productora.
   */
  telefono: string;

  /**
   * @property {string} correoElectronico
   * @description Correo electrónico de la empresa productora.
   */
  correoElectronico: string;

  /**
   * @property {string} numeroCertificado
   * @description Número de certificado de la empresa productora.
   */
  numeroCertificado: string;

  /**
   * @property {string} domicilio
   * @description Domicilio de la empresa productora.
   */
  domicilio: string;

  /**
   * @property {string} pais
   * @description País de la empresa productora.
   */
  pais: string;
}

/**
 * Representa la información de un importador.
 */
export interface Importador {
  /**
   * @property {string} nombre
   * @description Nombre del importador.
   */
  nombre: string;

  /**
   * @property {string} telefono
   * @description Número de teléfono del importador.
   */
  telefono: string;

  /**
   * @property {string} correoElectronico
   * @description Correo electrónico del importador.
   */
  correoElectronico: string;

  /**
   * @property {string} domicilio
   * @description Domicilio del importador.
   */
  domicilio: string;

  /**
   * @property {string} pais
   * @description País del importador.
   */
  pais: string;
}

/**
 * Representa la información de una empresa productora consultada.
 */
export interface ConsultarEmpresaProductora {
  /**
   * Nombre o razón social de la empresa.
   */
  razonSocial: string;

  /**
   * Código postal de la dirección de la empresa.
   */
  codigoPostal: string;

  /**
   * País donde se encuentra la empresa.
   */
  pais: string;

  /**
   * Estado o provincia de la empresa.
   */
  estado: string;

  /**
   * Calle de la dirección de la empresa.
   */
  calle: string;

  /**
   * Número exterior de la dirección.
   */
  numeroExterior: string;

  /**
   * Número interior de la dirección (si aplica).
   */
  numeroInterior: string;

  /**
   * Número telefónico de contacto de la empresa.
   */
  telefono: string;

  /**
   * Correo electrónico de contacto de la empresa.
   */
  correoElectronico: string;
}