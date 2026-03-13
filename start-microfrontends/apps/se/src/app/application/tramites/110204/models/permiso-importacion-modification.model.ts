import { CatalogosSelect } from '@ng-mf/data-access-user';
import { FormularioDinamico } from '@ng-mf/data-access-user';

/**
 * @interface ListaPasosWizard
 * @description
 * Representa la configuración de un paso dentro de un asistente o "wizard".
 * Se utiliza para controlar el flujo entre pasos, activación y finalización.
 */
export interface ListaPasosWizard {
  /** Índice del paso dentro del flujo del asistente */
  indice: number;
  /** Título mostrado para el paso */
  titulo: string;
  /** Indica si el paso está actualmente activo */
  activo: boolean;
  /** Indica si el paso ha sido completado */
  completado: boolean;
}

/**
 * @interface InputConfig
 * @description
 * Configuración para una sección o grupo de inputs en un formulario dinámico.
 */
export interface InputConfig {
  /** Título que se muestra para el grupo de inputs */
  title: string;
  /** Nombre del grupo o sección del formulario (formGroupName) */
  formGroupName: string;
  /** Lista de inputs y su configuración individual */
  menu: MenuConfig[];
}

/**
 * @interface MenuConfig
 * @description
 * Define las propiedades y configuración para un input dentro de un formulario.
 */
export interface MenuConfig {
  /** Tipo de input (e.g. 'text', 'select', 'radio') */
  inputType: string;
  /**
   * Propiedades que definen el comportamiento del input.
   * Puede ser un formulario dinámico o un catálogo selectivo.
   */
  props: FormularioDinamico | CatalogosSelect | undefined;
  /** Clase CSS asociada para estilos personalizados */
  class: string;
  /** (Opcional) Condición de visibilidad del input */
  visibility?: string;
  /** (Opcional) Configuración de opciones si es un radio button */
  radioConfig?: string[];
}

/**
 * @interface DatosMercancia
 * @description
 * Representa la estructura de datos necesaria para capturar información
 * detallada sobre una mercancía en un trámite de importación/exportación.
 */
export interface DatosMercancia {
  /** Descripción general de la mercancía */
  descripcion: string;
  /** Marca del producto o mercancía */
  marca: string;
  /** Tipo de entrada de la mercancía (e.g. importación, nacional, etc.) */
  tipoEntrada: string;
  /** Fracción arancelaria aplicable */
  fraccion: string;
  /** Número de Identificación Comercial (NICO) */
  nico: string;
  /** Unidad de medida tarifaria */
  umt: string;
  /** Número de la factura relacionada */
  facturaNumero: string;
  /** Fecha de emisión de la factura */
  facturaFecha: string;
  /** Unidad de medida comercial */
  umc: string;
  /** Otro tipo de unidad de medida comercial (si aplica) */
  otroUmc: string;
  /** Cantidad medida en unidades comerciales */
  cantidadUmc: string;
  /** Factor de conversión entre UMT y UMC */
  factorConversion: string;
  /** Cantidad medida en unidades tarifarias */
  cantidadUmt: string;
  /** Valor total expresado en la factura (moneda local) */
  valorFactura: string;
  /** Moneda en la que se comercializa la mercancía */
  monedaComercializacion: string;
  /** Valor total de la factura en dólares estadounidenses */
  valorFacturaUsd: string;
  /** Precio por unidad en dólares estadounidenses */
  precioUnitarioUsd: string;
  /** País desde donde se exporta la mercancía */
  paisExportador: string;
  /** País de origen de la mercancía */
  paisOrigen: string;
  /** Valor total en la moneda local */
  valorTotalFactura: string;
  /** Valor total convertido a dólares estadounidenses */
  valorTotalFacturaUsd: string;
}
