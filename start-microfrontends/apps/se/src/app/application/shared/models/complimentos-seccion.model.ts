import { Catalogo, CatalogoPaises } from '@ng-mf/data-access-user';

import {
  AnexoDosEncabezado,
  AnexoEncabezado,
  AnexoUnoEncabezado,
} from './nuevo-programa-industrial.model';

/**
 * * compodoc
 * Interfaz para representar la nacionalidad mexicana.
 * @interface NacionalidadMaxicana
 */
export interface NacionalidadMaxicana {
  label: string; // Etiqueta visible para el usuario
  value: string; // Valor asociado a la etiqueta
}

/**
 * * compodoc
 * Interfaz para representar los datos de socios y accionistas.
 * @interface SociaoAccionistas
 */
export interface SociaoAccionistas {
  id?: string; // Identificador único del socio o accionista
  rfc?: string; // Registro Federal de Contribuyentes
  taxId?: string; // Identificación fiscal (Tax ID)
  razonSocial?: string; // Denominación o razón social
  pais?: string; // País de origen
  codigoPostal?: string; // Código postal
  estado?: string; // Estado o región
  correoElectronico?: string; // Correo electrónico
  nombre?: string; // Nombre del socio o accionista
  apellidoPaterno?: string; // Apellido paterno
  apellidoMaterno?: string; // Apellido materno
  cp?: string; // Código postal (abreviado)
}

/**
 * * compodoc
 * Interfaz para representar la respuesta de los catálogos.
 * @interface RespuestaCatalogos
 */
export interface RespuestaCatalogos {
  code: number; // Código de respuesta (por ejemplo, 200 para éxito)
  data: Catalogo[]; // Lista de elementos del catálogo
  message: string; // Mensaje asociado a la respuesta
}
/**
 * * compodoc
 * @interface ServicioInmex
 * Representa los datos de un servicio IMMEX.
 */
export interface ServicioInmex {
  servicio?: string; // Nombre del servicio
  registroContribuyentes?: string; // Registro de contribuyentes
  denominacionSocial?: string; // Denominación social
  numeroIMMEX?: string; // Número IMMEX
  anoIMMEX?: string; // Año IMMEX
}

/**
 * * compodoc
 * @interface Servicio
 * Representa los datos de un servicio general.
 */
export interface Servicio {
  descripionDelServicio?: string; // Descripción del servicio
  descripcion?: string; // Descripción adicional
  tipode?: string; // Tipo de servicio
}

/**
 * * compodoc
 * @interface InfoServicios
 * Representa la información básica de los servicios.
 */
export interface InfoServicios {
  seleccionaLaModalidad: string; // Modalidad seleccionada
  folio: string; // Folio del servicio
  ano: string; // Año del servicio
}

/**
 * * compodoc
 * @interface Servicios
 * Representa los servicios disponibles.
 */
export interface Servicios {
  seleccionaLaModalidad: string; // Modalidad seleccionada
  folio: string; // Folio del servicio
  ano: string; // Año del servicio
}

/**
 * @interface AccionBoton
 * Representa una acción asociada a un botón.
 */
export interface AccionBoton {
  accion: string; // Nombre de la acción
  valor: number; // Valor asociado a la acción
}

/**
 * * compodoc
 * @interface DatosEmpresaExtranjera
 * Representa los datos de una empresa extranjera.
 */
export interface DatosEmpresaExtranjera {
  id: string; // Identificador único
  taxIdEmpresaExt: string; // Tax ID de la empresa extranjera
  nombreEmpresaExt: string; // Nombre de la empresa extranjera
  entidadFederativaEmpresaExt: string; // Entidad federativa
  direccionEmpresaExtranjera: string; // Dirección de la empresa extranjera
}

/**
 * * compodoc
 * @interface DatosCatalago
 * Representa los datos de un catálogo.
 */
export interface DatosCatalago {
  labelNombre: string; // Nombre visible del campo
  campo: string; // Nombre del campo
  class: string; // Clase CSS asociada
  tipo_input: string; // Tipo de entrada (input)
  required: boolean; // Indica si es obligatorio
  opciones?: CatalogoPaises[]; // Opciones de países
  opcionesCatalogo?: Catalogo[]; // Opciones del catálogo
  orden: number; // Orden de aparición
  maxlength?: number; // Longitud máxima de caracteres
}

/**
 * * compodoc
 * @interface AnnexoDosTres
 * Representa los datos de los anexos dos y tres.
 */
export interface AnnexoDosTres {
  anexoDosTablaLista: AnexoEncabezado[]; // Lista de datos del anexo dos
  anexoTresTablaLista: AnexoEncabezado[]; // Lista de datos del anexo tres
}

/**
 * * compodoc
 * @interface AnnexoUno
 * Representa los datos del anexo uno.
 */
export interface AnnexoUno {
  exportarDatosTabla: AnexoDosEncabezado[]; // Datos para exportar
  importarDatosTabla: AnexoUnoEncabezado[]; // Datos para importar
  datosParaNavegar: AnexoUnoEncabezado | AnexoDosEncabezado; // Datos para navegación
  seccionActiva: string; // Sección activa
}

/**
 * * compodoc
 * @interface AnexoUnoProducto
 * Representa los datos de un producto en el anexo uno.
 */
export interface AnexoUnoProducto {
  fraccion: string; // Fracción
  fraccionArancelaria: string; // Fracción arancelaria
  descripcion: string; // Descripción del producto
  anexoII: string; // Anexo II
  tipo: string; // Tipo de producto
  umt: string; // Unidad de medida
  categoria: string; // Categoría del producto
  valorModedaMensual: string; // Valor mensual en moneda
  valorModedaAnual: string; // Valor anual en moneda
  valorMensual: string; // Valor mensual
  valorAnual: string; // Valor anual
}

/**
 * * compodoc
 * @interface ProveedorCliente
 * Representa los datos de un proveedor o cliente.
 */
export interface ProveedorCliente {
  fraccion: string; // Fracción
  paisDeOrigen: string; // País de origen
  rfcTaxIdProveedor: string; // RFC o Tax ID del proveedor
  razonSocialProveedor: string; // Razón social del proveedor
  paisDestino: string; // País de destino
  rfcTaxClient: string; // RFC o Tax ID del cliente
  razonsocialCliente: string; // Razón social del cliente
}

/**
 * 
 * @interface ProyectoImmex
 * Representa los datos de un proyecto IMMEX.
 */
export interface ProyectoImmex {
  encabezadoFraccion: string; // Fracción
  encabezadoTipoDocument: string; // Tipo de documento
  encabezadoDescripcionOtro: string; // Descripción adicional
  encabezadoFechaFirma: string; // Fecha de firma
  encabezadoFechaVigencia: string; // Fecha de vigencia
  encabezadoRfc: string; // RFC
  encabezadoRazonFirmante: string; // Razón social del firmante
}

/**
 * compodoc
 * @interface AnexoFraccionAnarelaria
 * Representa los datos de una fracción arancelaria en el anexo.
 */
export interface AnexoFraccionAnarelaria {
  anexoFraccion: string; // Fracción
  anexoFraccionExportacion: string; // Fracción de exportación
  anexoDescripcionComercialExportacion: string; // Descripción comercial
  anexoFraccionImportacion: string; // Fracción de importación
  anexoDescripcionComercialImportacion: string; // Descripción comercial
  anexoDos: string; // Anexo II
  tipo: string; // Tipo
  umt: string; // Unidad de medida
  catagoria: string; // Catagoría
  valorEnMonedaMensual: string; // Valor en moneda mensual
  valorEnMonedaAnual: string; // Valor en moneda anual
  volumenMensual: string; // Volumen mensual
  volumenAnual: string; // Volumen anual
}