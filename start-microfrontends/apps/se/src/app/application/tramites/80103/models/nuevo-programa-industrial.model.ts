import { AnexoEncabezado, AnexoUnoEncabezado, ProveedorClienteTabla } from "../../../shared/models/nuevo-programa-industrial.model";
import { AnexoFraccionAnarelaria, AnexoUnoProducto, ProveedorCliente } from "../../../shared/models/complimentos-seccion.model";
import { Catalogo, CatalogoPaises } from "@ng-mf/data-access-user";
import { AnexoDosEncabezado } from "../../../shared/models/nuevo-programa-industrial.model";
import { PlantasSubfabricante } from "../../../shared/models/empresas-subfabricanta.model";

/**
 * Representa la estructura de datos para un servicio IMMEX.
 * 
 * @interface ServicioInmex
 * @property {string} [Servicio] - Nombre del servicio asociado al programa IMMEX.
 * @property {string} [RegistroContribuyentes] - Registro de contribuyentes relacionado con el servicio.
 * @property {string} [DenominaciónSocial] - Denominación social de la empresa asociada.
 * @property {string} [NumeroIMMEX] - Número de identificación del programa IMMEX.
 * @property {string} [AñoIMMEX] - Año en el que se otorgó el programa IMMEX.
 */
export interface ServicioInmex {
  Servicio?: string;
  RegistroContribuyentes?: string;
  DenominaciónSocial?: string;
  NumeroIMMEX?: string;
  AñoIMMEX?: string;
}
/**
 * Representa un servicio con información opcional sobre su descripción y tipo.
 * Esta interfaz se utiliza para modelar los datos relacionados con un servicio específico.
 */
export interface Servicio {
  descripiónDelServicio?: string;
  descripcion?: string;
  tipode?: string;
}

/**
 * Representa la información relacionada con los servicios.
 * 
 * @interface InfoServicios
 * @property {string} seleccionaLaModalidad - Modalidad seleccionada para el servicio.
 * @property {string} folio - Número de folio asociado al servicio.
 * @property {string} ano - Año relacionado con el servicio.
 */
export interface InfoServicios {
  seleccionaLaModalidad: string;
  folio: string;
  ano: string;
}

/**
 * Representa la estructura de los servicios relacionados con un programa industrial.
 * 
 * @interface Servicios
 * @property {string} seleccionaLaModalidad - Modalidad seleccionada para el servicio.
 * @property {string} folio - Número de folio asociado al servicio.
 * @property {string} ano - Año correspondiente al servicio.
 */
export interface Servicios {
  seleccionaLaModalidad: string;
  folio: string;
  ano: string;
}

/**
 * Representa la estructura de un botón de acción con una acción específica y un valor asociado.
 */
export interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Representa los datos de una empresa extranjera.
 * 
 * @interface DatosEmpresaExtranjera
 * @property {string} id - Identificador único de la empresa extranjera.
 * @property {string} taxIdEmpresaExt - Identificación fiscal de la empresa extranjera.
 * @property {string} nombreEmpresaExt - Nombre de la empresa extranjera.
 * @property {string} entidadFederativaEmpresaExt - Entidad federativa donde se encuentra la empresa extranjera.
 * @property {string} direccionEmpresaExtranjera - Dirección física de la empresa extranjera.
 */
export interface DatosEmpresaExtranjera {
  id: string;
  taxIdEmpresaExt: string;
  nombreEmpresaExt: string;
  entidadFederativaEmpresaExt: string;
  direccionEmpresaExtranjera: string;
}

/**
 * Representa los datos de un catálogo utilizados en la aplicación.
 * Esta interfaz define las propiedades necesarias para configurar
 * y mostrar un elemento de catálogo en la interfaz de usuario.
 *
 * @property labelNombre - El nombre que se mostrará como etiqueta del campo.
 * @property campo - El identificador del campo asociado al catálogo.
 * @property class - La clase CSS que se aplicará al elemento para estilos personalizados.
 * @property tipo_input - El tipo de entrada (input) que se utilizará, como texto, número, etc.
 * @property required - Indica si el campo es obligatorio (true) o no (false).
 * @property opciones - Una lista opcional de países disponibles en el catálogo.
 * @property opcionesCatalogo - Una lista opcional de elementos genéricos del catálogo.
 * @property orden - El orden en el que se mostrará el elemento en la interfaz.
 */
export interface DatosCatalago {
  labelNombre: string;
  campo: string;
  class: string;
  tipo_input: string;
  required: boolean;
  opciones?: CatalogoPaises[]
  opcionesCatalogo?: Catalogo[];
  orden: number;
}

/**
 * Representa la estructura de datos para los anexos dos y tres.
 * Contiene listas de encabezados para cada uno de los anexos.
 */
export interface AnnexoDosTres{
  anexoDosTablaLista: AnexoEncabezado[];
  anexoTresTablaLista: AnexoEncabezado[];
}

/**
 * Representa la estructura de datos para el modelo de "Anexo Uno".
 * Esta interfaz define las propiedades necesarias para manejar la información
 * relacionada con la exportación, importación y navegación de datos, así como
 * la sección activa en el contexto de un programa industrial.
 *
 * Propiedades:
 * - `exportarDatosTabla`: Lista de encabezados de tipo `AnexoDosEncabezado` que representan los datos a exportar.
 * - `importarDatosTabla`: Lista de encabezados de tipo `AnexoUnoEncabezado` que representan los datos a importar.
 * - `datosParaNavegar`: Encabezado de tipo `AnexoUnoEncabezado` o `AnexoDosEncabezado` utilizado para la navegación de datos.
 * - `seccionActiva`: Cadena que indica la sección activa actual.
 */
export interface AnnexoUno{
  exportarDatosTabla: AnexoDosEncabezado[];
  importarDatosTabla:AnexoUnoEncabezado[];
  datosParaNavegar:AnexoUnoEncabezado | AnexoDosEncabezado;
  seccionActiva: string;
  proveedorClienteDatosTabla: ProveedorClienteTabla[];
      proveedorClienteDatosTablaDos: ProveedorClienteTabla[];
}
/**
 * Representa la respuesta de una solicitud de ampliación de servicios.
 * 
 * @interface AmpliacionServiciosResponse
 * @property {number} code - Código de respuesta del servicio.
 * @property {object} data - Datos relacionados con la ampliación de servicios.
 * @property {string} data.idsubmanufacturer - ID del subfabricante.
 * @property {InfoServicios} data.infoServicios - Información sobre los servicios.
 */
export interface AmpliacionServiciosResponse {
  code: number;
  data: {
    idsubmanufacturer: string;
    infoServicios: InfoServicios;
  };
}
/*
  * Representa la respuesta de una solicitud de ampliación de servicios.
  * 
  * @interface AmpliacionServiciosResponse
  * @property {number} code - Código de respuesta del servicio.
  * @property {object} data - Datos relacionados con la ampliación de servicios.
  * @property {string} data.idsubmanufacturer - ID del subfabricante.
  * @property {InfoServicios} data.infoServicios - Información sobre los servicios.
  */
export interface CatalogoResponso {
  code: number;
  data: Catalogo[];
  message: string;
}
/*
  * Representa la respuesta de una solicitud de catálogo.
  * 
  * @interface CatalogoResponse
  * @property {number} code - Código de respuesta del catálogo.
  * @property {Catalogo[]} data - Datos del catálogo.
  * @property {string} message - Mensaje asociado a la respuesta.
  */
export interface PlantasSubfabricanteResponse {
  code: number;
  data: PlantasSubfabricante[];
}

 /**
 * Representa los datos de la tabla para proveedores y clientes en el contexto de un programa industrial.
 *
 * @property {number} idProveedor - Identificador único del proveedor.
 * @property {string} paisOrigen - País de origen del proveedor.
 * @property {string} rfcProveedor - RFC del proveedor.
 * @property {string} razonProveedor - Razón social del proveedor.
 * @property {string} paisDestino - País de destino del cliente.
 * @property {string} rfcClinte - RFC del cliente.
 * @property {string} razonSocial - Razón social del cliente.
 * @property {string} domicilio - Domicilio del cliente.
 * @property {boolean} testado - Indica si el producto ha sido testado.
 * @property {number} idProductoP - Identificador del producto.
 * @property {string} descTestado - Descripción del estado de testado.
 */
export interface ProveedorClienteDatosTabla {
      idProveedor: number;
      paisOrigen: string;
      rfcProveedor: string;
      razonProveedor: string;
      paisDestino: string;
      rfcClinte: string;
      razonSocial: string;
      domicilio: string;
      testado: boolean;
      idProductoP: number;
      descTestado: string;
    }

    /**
     * Representa la estructura del Anexo 1, que contiene información sobre el encabezado de la fracción y su descripción.
     *
     * @property {string} encabezadoFraccion - Texto que identifica el encabezado de la fracción.
     * @property {string} encabezadoDescripcion - Descripción asociada al encabezado de la fracción.
     */
    export interface Anexo1{
       encabezadoFraccion: string; 
      encabezadoDescripcion: string
     }

 /** Representa los datos necesarios para la navegación en el contexto de un programa industrial.
 *
 * @property {string} [encabezadoAnexoII] - Información relacionada con el Anexo II.
 */
export interface DatosParaNavegar {
   encabezadoAnexoII?: string;
   encabezadoTipo?: string;
   encabezadoCategoria?: string;
   encabezadoDescripcionComercial?: string;
   encabezadoVolumenMensual?: string;
   encabezadoVolumenAnual?: string;
   encabezadoValorEnMonedaMensual?: string;
   encabezadoValorEnMonedaAnual?: string;
}

/** Representa un ítem del Anexo Dos, que incluye detalles sobre fracciones de exportación e importación, descripciones comerciales, valores y volúmenes.
 *
 * @property {string} [encabezadoFraccionExportacion] - Fracción de exportación.
 */
  export interface AnexoDosItem {
      encabezadoFraccionExportacion?: string;
      encabezadoFraccionImportacion?: string;
      encabezadoDescripcionComercial?: string;
      encabezadoAnexoII?: string;
      encabezadoIdProducto?: string;
      encabezadoFraccionDescripcionAnexo?: string;
      encabezadoValorEnMonedaAnual?: string;
      encabezadoValorEnMonedaMensual?: string;
      encabezadoVolumenMensual?: string;
      encabezadoVolumenAnual?: string;
      encabezadoCategoria?: string;
      encabezadoTipo?: string;
      encabezadoUmt?: string;
    }
/** Representa la estructura del encabezado de un proyecto IMMEX, que incluye detalles sobre el tipo de documento, descripción, fechas y datos del firmante.
 *
 * @property {string} encabezadoFraccion - Fracción asociada al proyecto IMMEX.
 */
export interface ProyectoImmexEncabezado {
  encabezadoFraccion: string;
  encabezadoTipoDocument: string;
  encabezadoDescripcionOtro: string;
  encabezadoFechaFirma: string;
  encabezadoFechaVigencia: string;
  encabezadoRfc: string;
  encabezadoRazonFirmante: string;
  estatus: boolean;
}

/** Representa un ítem de la capacidad instalada en el contexto de un programa industrial.
 *
 * @property {string} [FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO] - Fracción arancelaria del producto terminado.
 */
export interface CapacidadInstaladaItem {
    FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO?: string;
    UMT?: string;
    DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO?: string;
    CAPACIDAD_EFECTIVAMENTE_UTILIZADA?: string;
    CALCULO_CAPACIDAD_INSTALADA?: string;
    TURNOS?: number | string;
    HORAS_POR_TURNO?: number | string;
    CANTIDAD_EMPLEADOS?: number | string;
    CANTIDAD_MAQUINARIA?: number | string;
    DESCRIPCION_MAQUINARIA?: string;
    CAPACIDAD_INSTALADA_MENSUAL?: number | string;
    CAPACIDAD_INSTALADA_ANUAL?: string;
  }

/** Representa un ítem del monto de inversión en el contexto de un programa industrial.
 *
 * @property {string} [PLANTA] - Nombre o identificador de la planta.
 */
export interface MontoInversionItem {
    PLANTA?: string;
    MONTO?: number | string;
    TIPO?: string;
    DESC_TIPO?: string;
    CANTIDAD?: number | string;
    DESCRIPCION?: string;
    TESTADO?: string;
    DESC_TESTADO?: string;
}

/** Representa un ítem de empleados en el contexto de un programa industrial.
 *
 * @property {string} [PLANTA] - Nombre o identificador de la planta.
 */
export interface EmpleadoItem {
    PLANTA?: string;
    ID_EMPLEADOS?: string | number;
    TOTAL?: string | number;
    DIRECTOS?: string | number;
    CEDULA_DE_CUOTAS?: string;
    FECHA_DE_CEDULA?: string;
    INDIRECTOS_TEST?: string | number;
    CONTRATO?: string;
    OBJETO_DEL_CONTRATO_DEL_SERVICIO?: string;
    FECHA_FIRMA?: string;
    FECHA_FIN_VIGENCIA?: string;
    RFC?: string;
    RAZON_SOCIAL?: string;
    TESTADO?: string;
    DESC_TESTADO?: string;
  }

  /** Representa un ítem de complementos en el contexto de un programa industrial.
 *
 * @property {string} [PLANTA] - Nombre o identificador de la planta.
 */
export interface ComplementarItem {
    PLANTA?: string;
    DATO?: string;
    PERMANECERA_MERCANCIA_PROGRAMA?: string;
    TIPO_DOCUMENTO?: string;
    DESCRIPCION_DOCUMENTO?: string;
    DESCRIPCION_OTRO?: string;
    DOCUMENTO_RESPALDO?: string;
    DESC_DOCUMENTO_RESPALDO?: string;
    RESPALDO_OTRO?: string;
    FECHA_DE_FIRMA?: string;
    FECHA_DE_FIN_DE_VIGENCIA?: string;
    FECHA_DE_FIRMA_DOCUMENTO?: string;
    FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO?: string;
  }

  /** Representa un ítem de firmantes en el contexto de un programa industrial.
 *
 * @property {string} [planta] - Nombre o identificador de la planta.
 */
  export interface FirmanteItem {
    planta?: string;
    tipoFirmante?: string;
    descTipoFirmante?: string;
  }