/**
 * @interface Solicitante
 * @description Modelo para la información del solicitante en el trámite de elegibilidad de textiles.
 * @property {string} rfc - Registro Federal de Contribuyentes (RFC) del solicitante, debe seguir el formato establecido por el SAT.
 * @property {string} nombreRazonSocial - Nombre completo o razón social del solicitante persona física o moral.
 * @property {string} aPaterno - Apellido paterno del solicitante (aplicable solo para personas físicas).
 * @property {string} correo - Dirección de correo electrónico del solicitante para notificaciones y comunicaciones oficiales.
 */
export interface Solicitante {
  /** Registro Federal de Contribuyentes (RFC) del solicitante */
  rfc: string;
  /** Nombre completo o razón social del solicitante */
  nombreRazonSocial: string;
  /** Apellido paterno del solicitante */
  aPaterno: string;
  /** Correo electrónico del solicitante */
  correo: string;
}
/**
 * @interface ListaPasosWizard
 * @description Modelo para controlar los pasos del wizard en el proceso de solicitud de elegibilidad de textiles.
 * @property {number} indice - Número de índice del paso en la secuencia del wizard (comenzando desde 0).
 * @property {string} titulo - Título descriptivo del paso que se muestra al usuario en la interfaz.
 * @property {boolean} activo - Indica si el paso está actualmente activo o seleccionado en el wizard.
 * @property {boolean} completado - Indica si el paso ha sido completado exitosamente por el usuario.
 */
export interface ListaPasosWizard {
  /** Número de índice del paso en la secuencia */
  indice: number;
  /** Título descriptivo del paso */
  titulo: string;
  /** Indica si el paso está actualmente activo */
  activo: boolean;
  /** Indica si el paso ha sido completado */
  completado: boolean;
}

/**
 * @interface DatosDeLaSolicitud
 * @description Modelo para almacenar los datos principales de la solicitud de elegibilidad de textiles.
 * @property {string} aduanaIngreso - Código o nombre de la aduana de ingreso donde se realizará la importación.
 * @property {string} oficinaInspeccion - Oficina de inspección asignada para la verificación de la mercancía.
 * @property {string} puntoInspeccion - Punto específico dentro de la aduana donde se realizará la inspección física.
 * @property {string} claveUCON - Clave de la Unidad de Control (UCON) asignada para el seguimiento del trámite.
 * @property {string} establecimientoTIF - Establecimiento Tipo Inspección Federal autorizado para el manejo de productos.
 * @property {string} nombreVeterinario - Nombre completo del médico veterinario responsable de la inspección sanitaria.
 * @property {string} numeroGuia - Número de guía de transporte o documento de embarque de la mercancía.
 * @property {string} certificacion - Tipo de certificación requerida para la importación del producto textil.
 * @property {string} regimen - Régimen aduanero bajo el cual se realizará la importación (temporal, definitivo, etc.).
 */
export interface DatosDeLaSolicitud {
  /** Aduana de ingreso para la importación */
  aduanaIngreso: string;
  /** Oficina de inspección asignada */
  oficinaInspeccion: string;
  /** Punto específico de inspección */
  puntoInspeccion: string;
  /** Clave de la Unidad de Control (UCON) */
  claveUCON: string;
  /** Establecimiento Tipo Inspección Federal */
  establecimientoTIF: string;
  /** Nombre del veterinario responsable */
  nombreVeterinario: string;
  /** Número de guía de transporte */
  numeroGuia: string;
  /** Tipo de certificación requerida */
  certificacion: string;
  /** Régimen aduanero aplicable */
  regimen: string;
}

/**
 * @interface DatosParaMovilizacionNacional
 * @description Modelo para los datos necesarios en el proceso de movilización nacional de productos textiles.
 * @property {string} coordenadas - Coordenadas geográficas (latitud y longitud) del punto de origen o destino.
 * @property {string} nombre - Nombre completo del responsable o contacto para la movilización.
 * @property {string} medio - Medio de transporte utilizado (terrestre, marítimo, aéreo, ferroviario).
 * @property {string} transporte - Tipo específico de transporte (camión, barco, avión, tren, etc.).
 * @property {string} punto - Descripción del punto de encuentro o entrega de la mercancía.
 */
export interface DatosParaMovilizacionNacional {
  /** Coordenadas geográficas del punto */
  coordenadas: string;
  /** Nombre del responsable de la movilización */
  nombre: string;
  /** Medio de transporte utilizado */
  medio: string;
  /** Tipo específico de transporte */
  transporte: string;
  /** Punto de encuentro o entrega */
  punto: string;
}

/**
 * @interface PagoDeDerechos
 * @description Modelo para gestionar la información de pago de derechos del trámite de elegibilidad de textiles.
 * @property {string} exentoPagoNo - Indicador de que NO está exento del pago de derechos (valor booleano como string).
 * @property {string} exentoPagoSi - Indicador de que SÍ está exento del pago de derechos (valor booleano como string).
 * @property {string} justificacion - Justificación legal o reglamentaria para la exención de pago cuando aplique.
 * @property {string} claveReferencia - Clave de referencia única generada por el sistema para identificar el pago.
 * @property {string} cadenaDependencia - Cadena original generada por la dependencia para validar la autenticidad del pago.
 * @property {string} banco - Nombre o código de la institución bancaria donde se realizó el pago.
 * @property {string} llavePago - Llave o código único de transacción proporcionado por el banco al realizar el pago.
 * @property {string} importePago - Monto total del pago realizado expresado en pesos mexicanos.
 */
export interface PagoDeDerechos {
  /** Indicador de NO exención de pago */
  exentoPagoNo: string;
  /** Indicador de SÍ exención de pago */
  exentoPagoSi: string;
  /** Justificación para la exención de pago */
  justificacion: string;
  /** Clave de referencia única del pago */
  claveReferencia: string;
  /** Cadena original de la dependencia */
  cadenaDependencia: string;
  /** Banco donde se realizó el pago */
  banco: string;
  /** Llave única de transacción bancaria */
  llavePago: string;
  /** Monto total del pago en pesos mexicanos */
  importePago: string;
}

/**
 * @interface ImportadorForm
 * @description Modelo para el formulario con los datos del importador de productos textiles.
 * @property {string} tipo - Tipo de importador (persona física, persona moral, empresa extranjera, etc.).
 * @property {string} cantidadTotal - Cantidad total de productos textiles a importar expresada en la unidad correspondiente.
 * @property {string} razonSocial - Razón social completa de la empresa importadora o nombre de la persona física.
 * @property {string} domicilio - Dirección completa del domicilio fiscal del importador.
 * @property {string} ciudad - Ciudad donde se encuentra establecido el domicilio fiscal del importador.
 * @property {string} cp - Código postal del domicilio fiscal del importador (5 dígitos en México).
 * @property {string} pais - País de origen o residencia del importador según su registro fiscal.
 */
export interface ImportadorForm {
  /** Tipo de importador (persona física/moral) */
  tipo: string;
  /** Cantidad total de productos a importar */
  cantidadTotal: string;
  /** Razón social o nombre del importador */
  razonSocial: string;
  /** Dirección completa del domicilio fiscal */
  domicilio: string;
  /** Ciudad del domicilio fiscal */
  ciudad: string;
  /** Código postal del domicilio */
  cp: string;
  /** País de origen del importador */
  pais: string;
}

/**
 * @interface HistoricoFabricantesForm
 * @description 
 * Modelo para el formulario del historial de fabricantes de productos textiles.
 * Esta interfaz define la estructura de datos necesaria para capturar información
 * sobre los fabricantes de los productos textiles importados, incluyendo la relación
 * entre exportador y fabricante, así como los datos de registro fiscal del fabricante.
 * 
 * Es utilizada en el componente HistoricoFabricantesComponent para validar y procesar
 * la información relacionada con la cadena de producción y fabricación de textiles.
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * 
 * @example
 * ```typescript
 * // Inicialización del formulario
 * const historicoForm: HistoricoFabricantesForm = {
 *   exportadorFabricanteMismo: 'SI',
 *   numeroRegistroFiscal: 'RFC123456789'
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Uso en reactive forms
 * this.historicoFabricantesForm = this.fb.group({
 *   exportadorFabricanteMismo: ['', Validators.required],
 *   numeroRegistroFiscal: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]]
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Validación condicional
 * if (form.exportadorFabricanteMismo === 'NO') {
 *   // Requerir información adicional del fabricante
 *   form.numeroRegistroFiscal = ''; // Limpiar si no aplica
 * }
 * ```
 * 
 * @see {@link HistoricoFabricantesComponent} - Componente que utiliza esta interfaz
 * @see {@link ImportadorForm} - Interfaz relacionada para datos del importador
 * 
 * @property {string} exportadorFabricanteMismo - Indica si la empresa exportadora es la misma que fabrica el producto (Sí/No).
 *                                               Valores válidos: 'SI', 'NO'. Determina si se requiere información
 *                                               adicional del fabricante independiente.
 * @property {string} numeroRegistroFiscal - Número de registro fiscal del fabricante en su país de origen.
 *                                          Formato alfanumérico que identifica oficialmente al fabricante
 *                                          ante las autoridades fiscales correspondientes.
 */
export interface HistoricoFabricantesForm {
  /** 
   * Indica si la empresa exportadora es la misma entidad que fabrica el producto textil.
   * Valores aceptados: 'SI' cuando exportador y fabricante son la misma empresa,
   * 'NO' cuando son entidades diferentes que requieren documentación por separado.
   * Esta información es crucial para determinar los requisitos de trazabilidad.
   * 
   * @example 'SI' - El exportador también es el fabricante
   * @example 'NO' - El exportador y fabricante son entidades diferentes
   */
  exportadorFabricanteMismo: string;
  
  /** 
   * Número de registro fiscal oficial del fabricante en su país de origen.
   * Identificador único que permite verificar la legitimidad y registro legal
   * del fabricante ante las autoridades fiscales del país donde se produce el textil.
   * Debe ser un código alfanumérico válido según las normas del país de origen.
   * 
   * @example 'RFC123456789' - Registro fiscal del fabricante mexicano
   * @example 'TAX987654321' - Registro fiscal del fabricante extranjero
   */
  numeroRegistroFiscal: string;
}

/**
 * @interface FormularioAsociacionFactura
 * @description 
 * Modelo para el formulario de asociación de facturas en el trámite de elegibilidad de textiles.
 * Esta interfaz define la estructura de datos utilizada para capturar y validar la información
 * sobre la cantidad de facturas comerciales que se asociarán al trámite de importación.
 * Es fundamental para establecer la relación entre las facturas comerciales y el permiso
 * de importación solicitado.
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * 
 * @example
 * ```typescript
 * // Inicialización del formulario
 * const formularioAsociacion: FormularioAsociacionFactura = {
 *   cantidad: '5' // Asociar 5 facturas al trámite
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Uso en reactive forms
 * this.formularioAsociacionFactura = this.fb.group({
 *   cantidad: ['', [Validators.required, Validators.min(1)]]
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Validación de datos
 * if (formulario.cantidad && parseInt(formulario.cantidad) > 0) {
 *   // Proceder con la asociación de facturas
 * }
 * ```
 * 
 * @see {@link FormularioAsociacionFacturaComponent} - Componente que utiliza esta interfaz
 * @see {@link FacturaForm} - Interfaz relacionada para datos individuales de facturas
 * 
 * @property {string} cantidad - Cantidad de facturas que serán asociadas al trámite de importación actual.
 *                               Debe ser un número entero positivo representado como string.
 *                               Valor mínimo: "1", valor máximo: depende de las reglas de negocio.
 */
export interface FormularioAsociacionFactura {
  /** 
   * Número de facturas comerciales a asociar al trámite de elegibilidad de textiles.
   * Representa la cantidad total de facturas que respaldarán la importación solicitada.
   * Debe ser un valor numérico positivo en formato string para compatibilidad con formularios web.
   * 
   * @example "5" - Para asociar cinco facturas al trámite
   * @example "1" - Para asociar una sola factura al trámite
   */
  cantidad: string;
}

/**
 * @interface FitosanitarioForm
 * @description Modelo para el formulario fitosanitario con información detallada del producto textil y su categorización.
 * @property {string} flexRadioRegistro - Opción seleccionada en el registro de tipo radio button para clasificación.
 * @property {string} estado - Estado o entidad federativa donde se realizará la importación o inspección.
 * @property {string} representacionFederal - Representación federal o delegación responsable del proceso.
 * @property {string} fraccionArancelaria - Fracción arancelaria que corresponde al producto textil según el Sistema Armonizado.
 * @property {string} descripcionProducto - Descripción detallada del producto textil a importar.
 * @property {string} tratado - Tratado comercial internacional aplicable para beneficios arancelarios.
 * @property {string} subproducto - Clasificación específica del subproducto dentro de la categoría textil.
 * @property {string} mecanismo - Mecanismo regulatorio o de control aplicable al producto.
 * @property {string} typoCategoria - Tipo de categoría textil según la clasificación oficial.
 * @property {string} typoRegimen - Tipo de régimen aduanero bajo el cual se importará el producto.
 * @property {string} descripcionCategoriaTextil - Descripción detallada de la categoría textil específica.
 * @property {string} pais - País de origen del producto textil según certificado de origen.
 * @property {string} unidadMedidaCategoriaTextil - Unidad de medida oficial para la categoría textil (metros, kilogramos, piezas, etc.).
 * @property {string} factorConversionCategoriaTextil - Factor de conversión entre diferentes unidades de medida para la categoría.
 * @property {string} fechaInicioVigencia - Fecha de inicio de vigencia de la clasificación o regulación aplicable.
 * @property {string} fechaFinVigencia - Fecha de fin de vigencia de la clasificación o regulación aplicable.
 */
export interface FitosanitarioForm {
  /** Opción seleccionada en registro tipo radio */
  flexRadioRegistro: string;
  /** Estado donde se realizará la importación */
  estado: string;
  /** Representación federal responsable */
  representacionFederal: string;
  /** Fracción arancelaria del producto */
  fraccionArancelaria: string;
  /** Descripción detallada del producto */
  descripcionProducto: string;
  /** Tratado comercial aplicable */
  tratado: string;
  /** Clasificación del subproducto */
  subproducto: string;
  /** Mecanismo regulatorio aplicable */
  mecanismo: string;
  /** Tipo de categoría textil */
  typoCategoria: string;
  /** Tipo de régimen aduanero */
  typoRegimen: string;
  /** Descripción de la categoría textil */
  descripcionCategoriaTextil: string;
  /** País de origen del producto */
  pais: string;
  /** Unidad de medida para la categoría textil */
  unidadMedidaCategoriaTextil: string;
  /** Factor de conversión entre unidades */
  factorConversionCategoriaTextil: string;
  /** Fecha de inicio de vigencia */
  fechaInicioVigencia: string;
  /** Fecha de fin de vigencia */
  fechaFinVigencia: string;
}

/**
 * @interface FacturaForm
 * @description Modelo para el formulario de factura comercial de productos textiles.
 * @property {string} numeroFactura - Número único de identificación de la factura comercial.
 * @property {string} cantidadTotal - Cantidad total de productos textiles incluidos en la factura.
 * @property {string} unidadDeMedida - Unidad de medida utilizada para expresar la cantidad (metros, kilogramos, piezas, etc.).
 * @property {string} fechaInicioInput - Fecha de expedición o inicio de validez de la factura comercial.
 * @property {string} valorDolares - Valor total de la factura expresado en dólares estadounidenses.
 * @property {EmisorConsignatario} emisorConsignatario - Información completa del emisor o consignatario de la factura.
 */
export interface FacturaForm {
  /** Número único de la factura comercial */
  numeroFactura: string;
  /** Cantidad total de productos en la factura */
  cantidadTotal: string;
  /** Unidad de medida utilizada */
  unidadDeMedida: string;
  /** Fecha de expedición de la factura */
  fechaInicioInput: string;
  /** Valor total en dólares estadounidenses */
  valorDolares: string;
  /** Datos del emisor o consignatario */
  emisorConsignatario: EmisorConsignatario;
}

/**
 * @interface EmisorConsignatario
 * @description Modelo para los datos del emisor o consignatario de la factura comercial.
 * @property {string} taxId - Número de identificación fiscal (TAX ID) del emisor en su país de origen.
 * @property {string} razonSocial - Razón social completa o nombre comercial del emisor de la factura.
 * @property {string} calle - Dirección de la calle donde se encuentra ubicado el emisor.
 * @property {string} ciudad - Ciudad donde está establecido el domicilio del emisor.
 * @property {string} cp - Código postal del domicilio del emisor según el sistema de su país.
 * @property {string} pais - País donde está registrado fiscalmente el emisor de la factura.
 */
export interface EmisorConsignatario {
  /** Número de identificación fiscal del emisor */
  taxId: string;
  /** Razón social del emisor */
  razonSocial: string;
  /** Dirección de la calle */
  calle: string;
  /** Ciudad del domicilio */
  ciudad: string;
  /** Código postal */
  cp: string;
  /** País de registro fiscal */
  pais: string;
}

/**
 * @interface ElegibilidadDeTextiles
 * @description Modelo principal que agrupa todos los formularios necesarios para el trámite de elegibilidad de textiles.
 * @property {ImportadorForm} importadorForm - Formulario con los datos completos del importador.
 * @property {FacturaForm} facturaForm - Formulario con la información de las facturas comerciales.
 * @property {FitosanitarioForm} fitosanitarioForm - Formulario fitosanitario con datos del producto y su categorización.
 * @property {FormularioAsociacionFactura} formularioAsociacionFactura - Formulario para asociar facturas al trámite.
 * @property {HistoricoFabricantesForm} historicoFabricantesForm - Formulario del historial de fabricantes.
 */
export interface ElegibilidadDeTextiles {
  /** Datos del formulario del importador */
  importadorForm: ImportadorForm;
  /** Datos del formulario de facturas */
  facturaForm: FacturaForm;
  /** Datos del formulario fitosanitario */
  fitosanitarioForm: FitosanitarioForm;
  /** Datos del formulario de asociación de facturas */
  formularioAsociacionFactura: FormularioAsociacionFactura;
  /** Datos del formulario de fabricantes */
  historicoFabricantesForm: HistoricoFabricantesForm;
}

/**
 * @interface ElegibilidadDeTextilesState
 * @description 
 * Modelo para el estado global del trámite de elegibilidad de textiles en el store de la aplicación.
 * Esta interfaz define la estructura del estado que se mantiene en el store de Redux/Akita
 * para gestionar toda la información relacionada con el proceso de solicitud de elegibilidad
 * de productos textiles. Permite centralizar y coordinar el estado entre todos los componentes
 * del módulo.
 * 
 * @since 1.0.0
 * @version 1.0.0
 * @author Sistema VUCEM 3.0
 * 
 * @example
 * ```typescript
 * // Uso en el store service
 * const initialState: ElegibilidadDeTextilesState = {
 *   textileSolicitudCargaUtil: {
 *     solicitante: { rfc: '', nombreRazonSocial: '', aPaterno: '', correo: '' },
 *     // ... otros datos del trámite
 *   }
 * };
 * ```
 * 
 * @example
 * ```typescript
 * // Actualización del estado
 * updateState(partialState: Partial<ElegibilidadDeTextilesState>) {
 *   this.store.update(partialState);
 * }
 * ```
 * 
 * @see {@link ElegibilidadDeTextiles} - Estructura de datos contenida en textileSolicitudCargaUtil
 * @see {@link ElegibilidadDeTextilesStore} - Store que utiliza esta interfaz
 * 
 * @property {ElegibilidadDeTextiles} textileSolicitudCargaUtil - Payload con todos los datos del trámite de textiles.
 *                                                               Contiene información completa de la solicitud incluyendo
 *                                                               datos del solicitante, productos, facturas, y certificaciones.
 */
export interface ElegibilidadDeTextilesState {
  /** 
   * Payload con los datos completos del trámite de elegibilidad de textiles.
   * Incluye toda la información necesaria para procesar la solicitud: datos del solicitante,
   * información de productos textiles, facturas asociadas, documentación requerida,
   * y estado del proceso de validación.
   */
  textileSolicitudCargaUtil: ElegibilidadDeTextiles;
}

/**
 * @interface CapturarColumns
 * @description Modelo para las columnas de la tabla de captura de facturas en el proceso de elegibilidad de textiles.
 * @property {string} numeroDeLaFactura - Número único de identificación de la factura comercial.
 * @property {string} razonSocial - Razón social o nombre comercial del emisor de la factura.
 * @property {string} domicilio - Dirección completa del domicilio fiscal del emisor.
 * @property {string} fechaExpedicionFactura - Fecha de expedición de la factura en formato estándar.
 * @property {string} cantidadTotal - Cantidad total de productos textiles incluidos en la factura.
 * @property {string} cantidadDisponible - Cantidad disponible para asociar a nuevos trámites de importación.
 * @property {string} unidadMedida - Unidad de medida utilizada para expresar las cantidades.
 * @property {string} valorDolares - Valor total de la factura expresado en dólares estadounidenses.
 */
export interface CapturarColumns {
  /** Número único de la factura */
  numeroDeLaFactura: string;
  /** Razón social del emisor */
  razonSocial: string;
  /** Domicilio fiscal del emisor */
  domicilio: string;
  /** Fecha de expedición de la factura */
  fechaExpedicionFactura: string;
  /** Cantidad total en la factura */
  cantidadTotal: string;
  /** Cantidad disponible para asociar */
  cantidadDisponible: string;
  /** Unidad de medida utilizada */
  unidadMedida: string;
  /** Valor en dólares estadounidenses */
  valorDolares: string;
  /** TAX ID del emisor */
  taxId?: string;
  /** Calle del domicilio fiscal */
  calle?: string;
  /** Ciudad del domicilio fiscal */
  ciudad?: string;
  /** Código postal del domicilio fiscal */
  cp?: string;
  /** País del domicilio fiscal */
  pais?: string;
  /** ID único de la expedición */
  idExpedicion: number;
  /** ID único de la factura de expedición */
  idFacturaExpedicion?: number;
}

/**
 * @interface AsociadasTableColumns
 * @description Modelo para las columnas de la tabla de facturas asociadas al trámite de elegibilidad de textiles.
 * @property {string} candidadAsociada - Cantidad específica que ha sido asociada al trámite actual.
 * @property {string} numeroDeLaFactura - Número único de identificación de la factura comercial asociada.
 * @property {string} razonSocial - Razón social o nombre comercial del emisor de la factura asociada.
 * @property {string} domicilio - Dirección completa del domicilio fiscal del emisor.
 * @property {string} fechaExpedicionFactura - Fecha de expedición de la factura en formato estándar.
 * @property {string} cantidadTotal - Cantidad total de productos textiles incluidos en la factura original.
 * @property {string} cantidadDisponible - Cantidad que aún queda disponible después de la asociación.
 * @property {string} unidadMedida - Unidad de medida utilizada para expresar las cantidades.
 * @property {string} valorDolares - Valor proporcional de la cantidad asociada expresado en dólares.
 */
export interface AsociadasTableColumns {
  /** Cantidad asociada al trámite actual */
  candidadAsociada: string;
  /** Número único de la factura asociada */
  numeroDeLaFactura: string;
  /** Razón social del emisor */
  razonSocial: string;
  /** Domicilio fiscal del emisor */
  domicilio: string;
  /** Fecha de expedición de la factura */
  fechaExpedicionFactura: string;
  /** Cantidad total original de la factura */
  cantidadTotal: string;
  /** Cantidad disponible restante */
  cantidadDisponible: string;
  /** Unidad de medida utilizada */
  unidadMedida: string;
  /** Valor proporcional en dólares */
  valorDolares: string;
  /** ID único de la factura de expedición */
  idFacturaExpedicion: number;
  /** ID único de la expedición asociada */
  idExpedicion: number;
}

/**
 * @interface HistoricoColumns
 * @description Modelo para las columnas de la tabla del historial de fabricantes de productos textiles.
 * @property {string} nombreFabricante - Nombre completo o razón social de la empresa fabricante.
 * @property {string} numeroRegistroFiscal - Número de registro fiscal del fabricante en su país de origen.
 * @property {string} direccion - Dirección completa de las instalaciones de fabricación.
 * @property {string} correoElectronico - Dirección de correo electrónico de contacto del fabricante.
 * @property {string} telefono - Número telefónico de contacto del fabricante incluyendo código de país.
 */
export interface HistoricoColumns {
  /** Nombre completo del fabricante */
  nombreFabricante: string;
  /** Número de registro fiscal del fabricante */
  numeroRegistroFiscal: string;
  /** Dirección de las instalaciones */
  direccion: string;
  /** Correo electrónico de contacto */
  correoElectronico: string;
  /** Número telefónico de contacto */
  telefono: string;
}