import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
 * Representa un catálogo con información básica.
 *
 * @property id - Identificador único del catálogo.
 * @property descripcion - Descripción del catálogo.
 * @property clave - (Opcional) Clave asociada al catálogo.
 * @property tam - (Opcional) Tamaño relacionado con el catálogo.
 * @property dpi - (Opcional) DPI asociado al catálogo.
 */
export interface Catalogo {
  id: number;
  descripcion: string;
  clave?: string;
  tam?: string;
  dpi?: string;
  scianDescription?: string;
}
/**
 * Interfaz que representa la respuesta de un catálogo.
 *
 * @property {number} code - Código de respuesta.
 * @property {Catalogo[]} data - Lista de elementos del catálogo.
 * @property {string} message - Mensaje de respuesta.
 */
export interface RespuestaCatalogos {
  code: number;
  data: Catalogo[];
  message: string;
}

/**
 * Interfaz que representa una fila en la tabla SCIAN.
 *
 * @property {string} clave - Clave SCIAN.
 * @property {string} descripcion - Descripción del SCIAN.
 */
export interface TablaScianConfig {
  clave: string;
  descripcion: string;
}

/**
 * Interfaz que representa una fila en la tabla SCIAN.
 *
 * @property {string} clave - Clave SCIAN.
 * @property {string} descripcion - Descripción del SCIAN.
 */
export interface TablaMercanciaClaveConfig {
  id?: number;
  clave: string;
  fabricacion: string;
  caducidad: string;
}

/**
 * Interfaz que representa la configuración de una tabla de opciones.
 *
 * @property {string} fechaCreacion - Fecha en que se creó la opción.
 * @property {string} mercancia - Nombre de la mercancía.
 * @property {string} cantidad - Cantidad registrada.
 * @property {string} proveedor - Nombre del proveedor.
 */
export interface TablaOpcionConfig {
  fechaCreacion: string;
  mercancia: string;
  cantidad: string;
  proveedor: string;
   /** RFC Sanitario - Registro Federal de Contribuyentes */
   rfcSanitario: string;
  
   /** Denominación o Razón Social */
   denominacionRazon: string;
   
   /** Correo Electrónico */
   correoElectronico: string;
   
   /** Código Postal */
   codigoPostal: string;
   
   /** Estado */
   estado: string;
   
   /** Municipio o Alcaldía */
   municipioAlcaldia: string;
   
   /** Localidad */
   localidad: string;
   
   /** Colonia */
   colonia: string;
   
   /** Calle y Número */
   calleYNumero: string;
   
   /** Calle */
   calle: string;
   
   /** Código de área telefónica (LADA) */
   lada: string;
   
   /** Número de teléfono */
   telefono: string;
   
   /** Aviso */
   aviso: string;
   
   /** Licencia Sanitaria */
   licenciaSanitaria: string;
   
   /** Régimen */
   regimen: string;
   
   /** Aduanas de Entrada */
   adunasDeEntradas: string;
   
   /** Aeropuerto */
   aeropuerto: boolean;
   
   /** Aeropuerto Dos */
   aeropuertoDos: boolean;
   
   /** Público */
   publico: string;
   
   /** RFC del Representante */
   representanteRfc: string;
   
   /** Nombre del Representante */
   representanteNombre: string;
   
   /** Apellido Paterno */
   apellidoPaterno: string;
   
   /** Apellido Materno */
   apellidoMaterno: string;
   
   /** Régimen de la Mercancía */
   regimenLaMercancia: string;
   
   /** Aduana */
   aduana: string;
   
   /** Mercancías */
   mercancias: TablaMercanciasDatos[];

   scian: TablaScianConfig[];
   
   /** Manifiesto */
   manifesto: string;
   
   /** Manifestos Casilla de Verificación */
   manifiestosCasillaDeVerificacion: boolean;

   id_solicitud?: number,
  fecha_creacion?: string,
 }


/**
 * Interfaz genérica para la configuración de una tabla de opciones.
 *
 * @template T - Tipo de datos contenidos.
 * @property {TablaSeleccion | undefined} tipoSeleccionTabla - Tipo de selección (checkbox, radio, etc).
 * @property {ConfiguracionColumna<T>[]} configuracionTabla - Configuración de columnas.
 * @property {T[]} datos - Datos mostrados en la tabla.
 */
export interface OpcionConfig<T> {
  tipoSeleccionTabla: TablaSeleccion | undefined;
  configuracionTabla: ConfiguracionColumna<T>[];
  datos: T[];
}

/**
 * Interfaz para la configuración SCIAN.
 *
 * @template T - Tipo de datos SCIAN.
 * @property {TablaSeleccion} tipoSeleccionTabla - Tipo de selección en tabla.
 * @property {ConfiguracionColumna<T>[]} configuracionTabla - Columnas configuradas.
 * @property {T[]} datos - Datos SCIAN cargados.
 */
export interface ScianConfig<T> {
  tipoSeleccionTabla: TablaSeleccion;
  configuracionTabla: ConfiguracionColumna<T>[];
  datos: T[];
}

/**
 * Interfaz para la configuración de la tabla de mercancías.
 *
 * @template T - Tipo de datos de mercancía.
 * @property {TablaSeleccion} tipoSeleccionTabla - Tipo de selección usada.
 * @property {ConfiguracionColumna<T>[]} configuracionTabla - Columnas configuradas.
 * @property {T[]} datos - Lista de datos de mercancías.
 */
export interface TablaMercanciasConfig<T> {
  tipoSeleccionTabla: TablaSeleccion;
  configuracionTabla: ConfiguracionColumna<T>[];
  datos: T[];
}

/**
 * Interfaz para la configuración de datos en una solicitud.
 *
 * @template T - Tipo de datos solicitados.
 * @property {TablaSeleccion} tipoSeleccionTabla - Tipo de selección usada.
 * @property {ConfiguracionColumna<T>[]} configuracionTabla - Configuración de columnas.
 * @property {T[]} datos - Datos en la tabla.
 */
export interface DataSolicitudConfig<T> {
  tipoSeleccionTabla: TablaSeleccion;
  configuracionTabla: ConfiguracionColumna<T>[];
  datos: T[];
}

/**
 * Enumeración de los tipos de selección en una tabla.
 *
 * @enum {string}
 * @property {string} CHECKBOX - Selección múltiple.
 * @property {string} RADIO - Selección única.
 * @property {string} UNDEFINED - Selección no definida.
 */
export enum TablaSeleccion {
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  UNDEFINED = 'undefined',
}

/**
 * Interfaz que representa los datos de una mercancía mostrada en tabla.
 *
 * @property {string} clasificacionProducto - Clasificación del producto.
 * @property {string} especificarClasificacionProducto - Detalle de la clasificación.
 * @property {string} denominacionEspecificaProducto - Nombre específico.
 * @property {string} denominacionDistintiva - Denominación distintiva.
 * @property {string} denominacionComun - Nombre común.
 * @property {string} formaFarmaceutica - Forma farmacéutica.
 * @property {string} estadoFisico - Estado físico del producto.
 * @property {string} fraccionArancelaria - Fracción arancelaria.
 * @property {string} descripcionFraccion - Descripción de la fracción.
 * @property {string} unidadMedidaComercializacion - Unidad de comercialización.
 * @property {string} cantidadUMC - Cantidad en UMC.
 * @property {string} unidadMedidaTarifa - Unidad tarifaria.
 * @property {string} cantidadUMT - Cantidad en UMT.
 * @property {string} presentacion - Presentación del producto.
 * @property {string} numeroRegistroSanitario - Registro sanitario.
 * @property {string} paisOrigen - País de origen.
 * @property {string} paisProcedencia - País de procedencia.
 * @property {string} tipoProducto - Tipo de producto.
 * @property {string} usoEspecifico - Uso específico del producto.
 */
export interface TablaMercanciasDatos {
  clasificacionProducto: string;
  claveClasificacionProductoObj ?: Catalogo | undefined;
  especificarClasificacionObj ?: Catalogo | undefined;
  tipoProductoObj ?: Catalogo | undefined;
  formaFarmaceuticaObj ?: Catalogo | undefined;
  estadoFisicoObj ?: Catalogo | undefined;
  cantidadUMCObj ?: Catalogo | undefined;
  especificarClasificacionProducto: string;
  denominacionEspecificaProducto?: string;
  denominacionDistintiva?: string;
  denominacionComun?: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  descripcionFraccion?: string;
  unidadMedidaComercializacion?: string;
  cantidadUMC: string;
  unidadMedidaTarifa: string;
  cantidadUMT: string;
  cantidadUmtValor?:string;
  cantidadUmcValor?:string;
  presentacion: string;
  numeroRegistroSanitario: string;
  paisOrigen: string;
  paisProcedencia: string;
  tipoProducto: string;
  usoEspecifico: string;
  detallarUsoEspecifico?:string;
  numeroDePiezasAFabricar?:string;
  descripcionNumeroDePiezas?:string;
  numeroCAS?:string;
  cantidadDeLotes?:string;
  kgPorLote?:string;
  paisDeDestino?:string;
  denominacionCumonInternacional?:string;
  caducidad?:string;
  marcaComercialDenominacion?:string;
  especifique?: string;
  especifiqueForma?: string;
  especifiqueEstado?:string;
  especifiqueObligatorio?:string;
  fechaCaducidad?: string;
  paisDeOriginDatos?: string[];
  paisDeProcedenciaDatos?: string[];
  id?: number;
  usoEspecificoDatosClave?: Array<string>;
  paisProcedenciaDatosClave?: Array<string>;
  paisOrigenDatosClave?: Array<string>;
}

/**
 * Interfaz que representa los datos seleccionados por tabla.
 *
 * @property {TablaScianConfig[]} scianSeleccionados - Elementos SCIAN seleccionados.
 * @property {TablaMercanciasDatos[]} mercanciasSeleccionados - Mercancías seleccionadas.
 * @property {TablaOpcionConfig[]} opcionSeleccionados - Opciones seleccionadas.
 * @property {boolean} opcionesColapsableState - Estado del panel de opciones colapsables.
 */
export interface DatosDeTablaSeleccionados {
  scianSeleccionados: TablaScianConfig[];
  mercanciasSeleccionados: TablaMercanciasDatos[];
  opcionSeleccionados: TablaOpcionConfig[];
  opcionesColapsableState: boolean;
}

/**
 * Interfaz que representa las etiquetas de la lista cruzada.
 *
 * @property {string} tituluDeLaIzquierda - El título de la izquierda.
 * @property {string} derecha - El valor de la derecha.
 */
export interface CrossListLable {
  tituluDeLaIzquierda: string;
  derecha: string;
}

/**
 * Interfaz que representa el estado del formulario de datos del solicitante.
 *
 * @property {string} rfcSanitario - RFC sanitario del solicitante.
 * @property {string} denominacionRazon - Razón social o denominación.
 * @property {string} correoElectronico - Correo electrónico de contacto.
 * @property {string} codigoPostal - Código postal.
 * @property {string} estado - Estado de la dirección.
 * @property {string} municipioAlcaldia - Municipio o alcaldía.
 * @property {string} localidad - Localidad del domicilio.
 * @property {string} colonia - Colonia.
 * @property {string} calle - Calle principal.
 * @property {string} lada - Clave lada.
 * @property {string} telefono - Número de teléfono.
 * @property {string} aviso - Información del aviso.
 * @property {string} licenciaSanitaria - Número de licencia sanitaria.
 * @property {string} regimen - Régimen fiscal.
 * @property {string} adunasDeEntradas - Aduanas de entrada.
 * @property {boolean} aeropuerto - Indica si aplica aeropuerto.
 * @property {string} publico - Tipo de público objetivo.
 * @property {string} representanteRfc - RFC del representante.
 * @property {string} representanteNombre - Nombre del representante.
 * @property {string} apellidoPaterno - Apellido paterno del representante.
 * @property {string} apellidoMaterno - Apellido materno del representante.
 */
export interface DatosSolicitudFormState {
  rfcSanitario: string;
  denominacionRazon: string;
  correoElectronico: string;
  codigoPostal: string;
  estado: string | number;
  municipioAlcaldia: string;
  localidad: string;
  colonia: string;
  calleYNumero?: string;
  calle: string;
  lada: string;
  telefono: string;
  aviso: string;
  licenciaSanitaria: string;
  regimen: string | number;
  adunasDeEntradas: string | number;
  aeropuerto: boolean;
  aeropuertoDos?: boolean;
  publico: string;
  representanteRfc: string;
  representanteNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  marca?: string;
  especifique?: string;
  claveDeLos?: string;
  fechaDeFabricacio?: string;
  fechaDeCaducidad?: string;
  regimenLaMercancia?:string
  aduana?:string
  manifesto?: boolean;
  manifiestosCasillaDeVerificacion?: boolean;
  rfcRepresentante?:string;
  rfc?:string;
  nombreRazonSocial?:string;
}

/**
 * Interfaz que representa una mercancía dentro del formulario.
 *
 * @property {string} clasificacionProducto - Clasificación del producto.
 * @property {string} especificarClasificacionProducto - Especificación adicional de la clasificación.
 * @property {string} denominacionEspecificaProducto - Nombre específico del producto.
 * @property {string} denominacionDistintiva - Denominación distintiva.
 * @property {string} denominacionComun - Nombre común del producto.
 * @property {string} tipoProducto - Tipo del producto.
 * @property {string} formaFarmaceutica - Forma farmacéutica.
 * @property {string} estadoFisico - Estado físico.
 * @property {string} fraccionArancelaria - Fracción arancelaria.
 * @property {string} descripcionFraccion - Descripción de la fracción.
 * @property {string} cantidadUmtValor - Valor en UMT.
 * @property {string} cantidadUmt - Unidad de medida tarifaria.
 * @property {string} cantidadUmcValor - Valor en UMC.
 * @property {string} cantidadUmc - Unidad de medida de comercialización.
 * @property {string} presentacion - Presentación del producto.
 * @property {string} numeroRegistroSanitario - Registro sanitario.
 * @property {string} fechaCaducidad - Fecha de caducidad.
 * @property {string[]} paisDeOriginDatos - Países de origen.
 * @property {string[]} paisDeProcedenciaDatos - Países de procedencia.
 */
export interface MercanciaForm {
  clasificacionProducto: string;
  especificarClasificacionProducto: string;
  denominacionEspecificaProducto: string;
  denominacionDistintiva: string;
  denominacionComun: string;
  tipoProducto: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  cantidadUmtValor: string;
  cantidadUmt: string;
  cantidadUmcValor: string;
  cantidadUmc: string;
  presentacion: string;
  numeroRegistroSanitario: string;
  fechaCaducidad: string;
  paisDeOriginDatos: string[];
  paisDeProcedenciaDatos: string[];
  usoEspecifico?: string[]
  marca?: string;
  especifique?: string;
  especifiqueForma?: string;
  claveDeLos?: string;
  fechaDeFabricacio?: string;
  fechaDeCaducidad?: string;
  especifiqueObligatorio?:string;
  especifiqueEstado?:string;
}

/**
 * Interfaz que representa una mercancía dentro del formulario de estupefacientes.
 *
 * @property {string} clasificacionProducto - Clasificación del producto.
 * @property {string} especificarClasificacionProducto - Especificación adicional de la clasificación.
 * @property {string} denominacionEspecificaProducto - Nombre específico del producto.
 * @property {string} denominacionDistintiva - Denominación distintiva.
 * @property {string} denominacionComun - Nombre común del producto.
 * @property {string} tipoProducto - Tipo del producto.
 * @property {string} formaFarmaceutica - Forma farmacéutica.
 * @property {string} estadoFisico - Estado físico.
 * @property {string} fraccionArancelaria - Fracción arancelaria.
 * @property {string} descripcionFraccion - Descripción de la fracción.
 * @property {string} cantidadUmtValor - Valor en UMT.
 * @property {string} cantidadUmt - Unidad de medida tarifaria.
 * @property {string} cantidadUmcValor - Valor en UMC.
 * @property {string} cantidadUmc - Unidad de medida de comercialización.
 * @property {string} presentacion - Presentación del producto.
 * @property {string} numeroRegistroSanitario - Registro sanitario.
 * @property {string} fechaCaducidad - Fecha de caducidad.
 * @property {string[]} paisDeOriginDatos - Países de origen.
 * @property {string[]} paisDeProcedenciaDatos - Países de procedencia.
 */
export interface MercanciaFormEstupefacientes {
  clasificacionProducto: string;
  especificarClasificacionProducto: string;
  denominacionCumonInternacional:string;
  marcaComercialDenominacion:string;
  tipoProducto: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  cantidadUmtValor: string;
  cantidadUmt: string;
  cantidadUmcValor: string;
  cantidadUmc: string;
  numeroCAS:string;
  cantidadDeLotes:string
  kgPorLote:string,
  paisDeDestino:string,
  paisDeProcedencia:string,
  detallarUsoEspecifico:string,
  numeroDePiezasAFabricar:string,
  descripcionNumeroDePiezas:string,
  presentacion: string;
  numeroRegistroSanitario: string;
  usoEspecifico:string
  paisOrigen:string
}

