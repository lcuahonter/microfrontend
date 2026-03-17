import { AnexoEncabezado, AnexoUnoEncabezado, ProveedorClienteTabla } from "../../../shared/models/nuevo-programa-industrial.model";
import { Catalogo, CatalogoPaises } from "@ng-mf/data-access-user";
import { AnexoDosEncabezado } from "../../../shared/models/nuevo-programa-industrial.model";


/**
 * Representa un servicio IMMEX con información relevante sobre el programa industrial.
 */
export interface ServicioInmex {
  /**
   * El nombre del servicio proporcionado.
   * @type {string}
   */
  Servicio?: string;

  /**
   * El registro de contribuyentes asociado al servicio.
   * @type {string}
   */
  RegistroContribuyentes?: string;

  /**
   * La denominación social de la empresa que utiliza el servicio.
   * @type {string}
   */
  DenominaciónSocial?: string;

  /**
   * El número IMMEX asignado al programa industrial.
   * @type {string}
   */
  NumeroIMMEX?: string;

  /**
   * El año en que se otorgó el número IMMEX.
   * @type {string}
   */
  AñoIMMEX?: string;
}


/**
 * Representa un servicio con información detallada.
 */
export interface Servicio {
  /**
   * La descripción detallada del servicio.
   * Este campo es opcional.
   */
  descripiónDelServicio?: string;

  /**
   * Una descripción breve del servicio.
   * Este campo es opcional.
   */
  descripcion?: string;

  /**
   * El tipo del servicio.
   * Este campo es opcional.
   */
  tipode?: string;
}


/**
 * Representa la información de los servicios en el modelo de programa industrial.
 */
export interface InfoServicios {
  /**
   * Indica la modalidad seleccionada por el usuario.
   * @example "Modalidad A"
   */
  seleccionaLaModalidad: string;

  /**
   * Representa el folio único asociado al servicio.
   * @example "FOL123456"
   */
  folio: string;

  /**
   * Año en el que se realiza el trámite o servicio.
   * @example "2023"
   */
  ano: string;
}

/**
 * Representa los servicios relacionados con un programa industrial.
 */
export interface Servicios {
  /**
   * La modalidad seleccionada para el servicio.
   * @example "Modalidad A"
   */
  seleccionaLaModalidad: string;

  /**
   * El folio único asociado al servicio.
   * @example "12345"
   */
  folio: string;

  /**
   * El año en el que se realiza el servicio.
   * @example "2023"
   */
  ano: string;
}

/**
 * Representa la estructura de un botón de acción con su correspondiente acción y valor.
 */
export interface AccionBoton {
  /**
   * La acción que se ejecutará al presionar el botón.
   * Ejemplo: "guardar", "eliminar", "actualizar".
   */
  accion: string;

  /**
   * El valor asociado a la acción del botón.
   * Puede representar un identificador, un estado o cualquier valor numérico relacionado.
   */
  valor: number;
}


/**
 * Representa los datos de una empresa extranjera.
 */
export interface DatosEmpresaExtranjera {
  /**
   * Identificador único de la empresa extranjera.
   */
  id: string;

  /**
   * Identificación fiscal de la empresa extranjera.
   */
  taxIdEmpresaExt: string;

  /**
   * Nombre de la empresa extranjera.
   */
  nombreEmpresaExt: string;

  /**
   * Entidad federativa donde se encuentra la empresa extranjera.
   */
  entidadFederativaEmpresaExt: string;

  /**
   * Dirección física de la empresa extranjera.
   */
  direccionEmpresaExtranjera: string;
}


/**
 * Representa los datos de un catálogo utilizados en la aplicación.
 * Esta interfaz define las propiedades necesarias para configurar un catálogo con opciones y características específicas.
 */
export interface DatosCatalago {
  /**
   * El nombre que se mostrará como etiqueta en el catálogo.
   * @example "Nombre del Producto"
   */
  labelNombre: string;

  /**
   * El nombre del campo asociado al catálogo.
   * Este campo se utiliza para identificar el valor en el modelo de datos.
   * @example "nombreProducto"
   */
  campo: string;

  /**
   * La clase CSS que se aplicará al elemento del catálogo.
   * Permite personalizar el estilo visual del catálogo.
   * @example "form-control"
   */
  class: string;

  /**
   * El tipo de entrada que se utilizará en el catálogo.
   * Define el tipo de control de entrada, como texto, número, etc.
   * @example "text"
   */
  tipo_input: string;

  /**
   * Indica si el campo es obligatorio en el formulario.
   * @example true
   */
  required: boolean;

  /**
   * Opciones disponibles para el catálogo, representadas como una lista de países.
   * Este campo es opcional.
   */
  opciones?: CatalogoPaises[];

  /**
   * Opciones adicionales disponibles para el catálogo, representadas como una lista genérica.
   * Este campo es opcional.
   */
  opcionesCatalogo?: Catalogo[];

  /**
   * El orden en el que se mostrará el catálogo en el formulario.
   * @example 1
   */
  orden: number;
}


/**
 * Representa la estructura de datos para los anexos dos y tres.
 * Esta interfaz define las listas de encabezados para los anexos dos y tres.
 */
export interface AnnexoDosTres {
  /**
   * Lista de encabezados para el anexo dos.
   * Cada elemento de la lista representa un encabezado relacionado con el anexo dos.
   */
  anexoDosTablaLista: AnexoEncabezado[];

  /**
   * Lista de encabezados para el anexo tres.
   * Cada elemento de la lista representa un encabezado relacionado con el anexo tres.
   */
  anexoTresTablaLista: AnexoEncabezado[];
}



/**
 * Representa la estructura de datos para el modelo "AnnexoUno".
 * Este modelo se utiliza para gestionar información relacionada con tablas de exportación e importación,
 * datos de navegación y la sección activa en el contexto de un programa industrial.
 */
export interface AnnexoUno {
  /**
   * Contiene los datos de la tabla de exportación.
   * Cada elemento de la tabla está representado por un objeto de tipo `AnexoDosEncabezado`.
   */
  exportarDatosTabla: AnexoDosEncabezado[];

  /**
   * Contiene los datos de la tabla de importación.
   * Cada elemento de la tabla está representado por un objeto de tipo `AnexoUnoEncabezado`.
   */
  importarDatosTabla: AnexoUnoEncabezado[];

  /**
   * Representa los datos utilizados para la navegación entre secciones.
   * Puede ser un objeto de tipo `AnexoUnoEncabezado` o `AnexoDosEncabezado`.
   */
  datosParaNavegar: AnexoUnoEncabezado | AnexoDosEncabezado;

  /**
   * Indica la sección activa en el programa industrial.
   * Este valor es una cadena que identifica la sección actual.
   */
  seccionActiva: string;

 /**
   * Contiene los datos de la tabla de importación.
   * Cada elemento de la tabla está representado por un objeto de tipo `ProveedorClienteTabla`.
   */

  proveedorClienteDatosTabla:ProveedorClienteTabla[];
  proveedorClienteDatosTablaDos:ProveedorClienteTabla[];
}
/**
 * Obtiene los datos de la submanufacturera desde un archivo local JSON.
 * Devuelve un observable con los datos de modalidad, folio y año.
 * Utilizado para inicializar el formulario con información precargada.
 */
export interface SubmanufactureraDisponible {
  modalidad: string;
  folio: string;
  ano: string;
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

      export interface AnexoDosItem {
      idProveedor: number;
      paisOrigen: string;
      rfcProveedor: string;
      razonProveedor: string;
      paisDestino: string;
      rfcCliente: string;
      razonCliente: string;
      domicilio: string;
      testado: boolean;
      idProductoP: number;
      descTestado: string;
    }

