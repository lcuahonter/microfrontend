import { CatalogosSelect, ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { HistoricoColumnas } from './certificado-origen.model';
import { TramiteState } from '../estados/Tramite110223.store';

/**
 * Interfaz que define la estructura de las columnas de la tabla.
 * 
 * @interface ColumnasTabla
 * @property {string} fraccionArancelaria - Fracción arancelaria del producto.
 * @property {string} nombreTecnico - Nombre técnico del producto.
 * @property {string} nombreComercial - Nombre comercial del producto.
 * @property {string} numeroRegistroProductos - Número de registro del producto.
 * @property {string} fechaExpedicion - Fecha de expedición del producto.
 * @property {string} fechaVencimiento - Fecha de vencimiento del producto.
 */
export interface ColumnasTabla {
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  numeroRegistroProductos: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
}

/**
 * Interfaz que define la estructura de las filas seleccionadas de la tabla.
 * 
 * @interface SeleccionadasTabla
 * @property {string} fraccionArancelaria - Fracción arancelaria del producto seleccionado.
 * @property {string} cantidad - Cantidad de productos seleccionados.
 * @property {string} unidadMedida - Unidad de medida del producto.
 * @property {string} valorMercancia - Valor de la mercancía.
 * @property {string} tipoFactura - Tipo de factura.
 * @property {string} numFactura - Número de la factura.
 * @property {string} complementoDescripcion - Descripción complementaria de la factura.
 * @property {string} fechaFactura - Fecha de la factura.
 */
export interface SeleccionadasTabla {
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
 * Configuración de la fecha inicial para los filtros.
 * 
 * @constant FECHA_INICIAL
 * @type {Object}
 * @property {string} labelNombre - Nombre de la etiqueta para la fecha de inicio.
 * @property {boolean} required - Indica si es un campo obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_INICIAL = {
  labelNombre: 'Fecha inicio',
  required: false,
  habilitado: true,
};

/**
 * Configuración de la fecha final para los filtros.
 * 
 * @constant FECHA_FINAL
 * @type {Object}
 * @property {string} labelNombre - Nombre de la etiqueta para la fecha de fin.
 * @property {boolean} required - Indica si es un campo obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha fin',
  required: false,
  habilitado: true,
};

/**
 * Configuración de la fecha de la factura o referencia.
 * 
 * @constant FECHA_FACTURA
 * @type {Object}
 * @property {string} labelNombre - Nombre de la etiqueta para la fecha de factura.
 * @property {boolean} required - Indica si es un campo obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_FACTURA = {
  labelNombre: 'Fecha de factura / Referencia',
  required: true,
  habilitado: true,
};

/**
 * Configuración del campo para el despacho LDA.
 * 
 * @constant DESPACHO_LDA
 * @type {Object}
 * @property {string} labelNombre - Etiqueta que indica si es un despacho LDA.
 * @property {number} maxlength - Longitud máxima permitida.
 * @property {number} minlenght - Longitud mínima permitida.
 * @property {boolean} required - Indica si es un campo obligatorio.
 * @property {boolean} alfanumerico - Indica si solo acepta caracteres alfanuméricos.
 */
export const DESPACHO_LDA = {
  labelNombre: 'Sí',
  maxlength: 10,
  minlenght: 0,
  required: false,
  alfanumerico: true,
};

/**
 * Representa la respuesta de una consulta realizada en el trámite.
 */
export interface RespuestaConsulta {
  /**
   * Indica si la consulta fue exitosa.
   */
  success: boolean;

  /**
   * Contiene los datos obtenidos de la consulta.
   */
  datos: TramiteState;

  /**
   * Mensaje asociado a la respuesta de la consulta.
   */
  message: string;
}

/**
 * Contiene los datos obtenidos de una consulta.
 */
export interface ConsultaDatos {
  /**
   * Indica si hay un tercer operador involucrado.
   */
  tercerOperador: boolean;

  /**
   * Tratado aplicable a la consulta.
   */
  tratado: string;

  /**
   * País relacionado con la consulta.
   */
  pais: string;

  /**
   * Fracción arancelaria de la mercancía.
   */
  fraccionArancelaria: string;

  /**
   * Número de registro del producto.
   */
  numeroRegistro: string;

  /**
   * Nombre comercial del producto.
   */
  nombreComercial: string;

  /**
   * Fecha inicial del periodo consultado.
   */
  fechaInicial: string;

  /**
   * Fecha final del periodo consultado.
   */
  fechaFinal: string;

  /**
   * Archivo asociado a la consulta.
   */
  archivo: string;

  /**
   * Fracción arancelaria específica de la mercancía.
   */
  fraccionMercanciaArancelaria: string;

  /**
   * Nombre técnico del producto.
   */
  nombreTecnico: string;

  /**
   * Nombre comercial de la mercancía.
   */
  nombreComercialDelaMercancia: string;

  /**
   * Criterio aplicado para determinar el origen preferencial.
   */
  criterioParaPreferencial: string;

  /**
   * Valor del contenido regional.
   */
  valorContenidoRegional: string;

  /**
   * Otras instancias involucradas.
   */
  otrasInstancias: string;

  /**
   * Cantidad de mercancía.
   */
  cantidad: string;

  /**
   * Unidad de medida de la cantidad (UMC).
   */
  umc: string;

  /**
   * Valor monetario de la mercancía.
   */
  valorDelaMercancia: string;

  /**
   * Descripción complementaria de la mercancía.
   */
  complementoDelaDescripcion: string;

  /**
   * Tipo de factura asociada.
   */
  tipoFactura: string;

  /**
   * Fecha relevante asociada.
   */
  fecha: string;

  /**
   * Número de la factura.
   */
  numeroFactura: string;

  /**
   * Número de serie del documento.
   */
  numeroSerie: string;

  /**
   * Observaciones adicionales.
   */
  observaciones: string;

  /**
   * Entidad relacionada.
   */
  entidad: string;

  /**
   * Tipo de representación.
   */
  representacion: string;

  /**
   * Estado de la casilla de verificación.
   */
  casillaVerificacion: boolean;

  /**
   * Justificación proporcionada.
   */
  justificacion: string;

  /**
   * Nombre del productor o exportador.
   */
  nombre: string;

  /**
   * Número fiscal asociado.
   */
  numeroFiscal: string;

  /**
   * Ciudad de origen/destino.
   */
  ciudad: string;

  /**
   * Calle de la dirección.
   */
  calle: string;

  /**
   * Número y letra de la dirección.
   */
  numeroLetra: string;

  /**
   * Número de registro fiscal.
   */
  numeroDeRegistroFiscal: string;

  /**
   * Número de teléfono de contacto.
   */
  telefono: string;

  /**
   * Número de fax.
   */
  fax: string;

  /**
   * Correo electrónico de contacto.
   */
  correoElectronico: string;

  /**
   * Nacionalidad asociada.
   */
  nacion: string;

  /**
   * Indica si los datos del productor son confidenciales.
   */
  datosConfidencialesProductor: boolean;

  /**
   * Indica si el productor es el mismo que el exportador.
   */
  productorMismoExportador: boolean;

  /**
   * Número de registro fiscal (alternativo).
   */
  numeroRegistroFiscal: string;

  /**
   * Fax adicional para el productor.
   */
  agregarDatosProductorFax: string;

  /**
   * Lugar de la operación o actividad.
   */
  lugar: string;

  /**
   * Nombre del representante legal del exportador.
   */
  nombreRepresentanteLegalExportador: string;

  /**
   * Nombre del representante legal del productor.
   */
  empresa: string;

  /**
   * Cargo del representante legal.
   */
  cargo: string;

  /**
   * Datos de las mercancías seleccionadas en la tabla.
   */
  mercanciaSeleccionadasTablaData: SeleccionadasTabla[];

  /**
   * Datos de las mercancías disponibles en la tabla.
   */
  mercanciaDisponsiblesTablaDatos: ColumnasTabla[];
}

/**
 * Columnas para la tabla del historial de certificados.
 * 
 * @constant HISTORICOTABLECOLUMNS
 * @type {ConfiguracionColumna<HistoricoColumnas>[]}
 */
export const HISTORICOTABLECOLUMNS: ConfiguracionColumna<HistoricoColumnas>[] = [
  { encabezado: 'Nombre del productor', clave: (elementos) => elementos.nombreProductor, orden: 1 },
  { encabezado: 'Número de registro fiscal', clave: (elementos) => elementos.numeroRegistroFiscal, orden: 2 },
  { encabezado: 'Dirección', clave: (elementos) => elementos.direccion, orden: 3 },
  { encabezado: 'Correo Electrónico', clave: (elementos) => elementos.correoElectronico, orden: 4 },
  { encabezado: 'Teléfono', clave: (elementos) => elementos.telefono, orden: 5 },
  { encabezado: 'Fax', clave: (elementos) => elementos.fax, orden: 6 },
];

/**
 * Columnas para la tabla de elementos seleccionados.
 * 
 * @constant HEADERSDATASELECCIONADASTABLA
 * @type {ConfiguracionColumna<SeleccionadasTabla>[]}
 */
export const HEADERSDATASELECCIONADASTABLA: ConfiguracionColumna<SeleccionadasTabla>[] = [
  { encabezado: 'Fracción arancelaria', clave: (ele: SeleccionadasTabla) => ele.fraccionArancelaria, orden: 1 },
  { encabezado: 'Cantidad', clave: (ele: SeleccionadasTabla) => ele.cantidad, orden: 2 },
  { encabezado: 'Unidad de medida', clave: (ele: SeleccionadasTabla) => ele.unidadMedida, orden: 3 },
  { encabezado: 'Valor mercancía', clave: (ele: SeleccionadasTabla) => ele.valorMercancia, orden: 4 },
  { encabezado: 'Tipo de factura', clave: (ele: SeleccionadasTabla) => ele.tipoFactura, orden: 5 },
  { encabezado: 'Número factura', clave: (ele: SeleccionadasTabla) => ele.numFactura, orden: 6 },
  { encabezado: 'Complemento descripción', clave: (ele: SeleccionadasTabla) => ele.complementoDescripcion, orden: 7 },
  { encabezado: 'Fecha factura', clave: (ele: SeleccionadasTabla) => ele.fechaFactura, orden: 8 },
];

/**
 * @interface Tramite110221State
 * Interfaz que define el estado global del trámite 110221 para el certificado zoosanitario.
 * Contiene todas las propiedades y formularios requeridos en el flujo del trámite, así como los datos y banderas de validación.
 * 
 */

export interface DestinatarioForm {
  nombre: string;
  numeroFiscal: string;
}

export interface DomicilioForm {
  calle: string;
  numeroLetra: string;
  paisDestino: string | null;
  ciudad: string;
  correoElectronico: string;
  lada: string;
  telefono: string;
}

export interface RepresentanteLegalForm{
  lugar: string;
  nombreRepresentante: string;
  empresa: string;
  cargo: string;
  lada: string;
  telefono: string;
  fax: string;
  correoElectronico: string;
}

/** Opciones del catálogo de tratados comerciales */
export const OPTIONS_TRATADO: CatalogosSelect = {
  labelNombre: 'Tratado/Acuerdo',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}
