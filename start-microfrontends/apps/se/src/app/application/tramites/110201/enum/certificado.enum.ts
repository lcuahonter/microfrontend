import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { SeleccionadasTabla } from "../models/registro.model";

/**
 * Encabezados de la tabla de mercancías seleccionadas.
 * 
 * Define la configuración de las columnas que se mostrarán en la tabla de mercancías seleccionadas,
 * incluyendo el nombre del encabezado, la clave para obtener el valor de cada columna y el orden de aparición.
 */
export const HEADERS_DATA: ConfiguracionColumna<SeleccionadasTabla>[] = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: SeleccionadasTabla) => ele.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Cantidad',
      clave: (ele: SeleccionadasTabla) => ele.cantidad,
      orden: 2,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (ele: SeleccionadasTabla) => ele.unidadMedida,
      orden: 3,
    },
    {
      encabezado: 'Valor mercancía',
      clave: (ele: SeleccionadasTabla) => ele.valorMercancia,
      orden: 4,
    },
    {
      encabezado: 'Tipo de factura',
      clave: (ele: SeleccionadasTabla) => ele.tipoFactura,
      orden: 5,
    },
    {
      encabezado: 'Número factura',
      clave: (ele: SeleccionadasTabla) => ele.numFactura,
      orden: 6,
    },
    {
      encabezado: 'Complemento descripción',
      clave: (ele: SeleccionadasTabla) => ele.complementoDescripcion,
      orden: 7,
    },
    {
      encabezado: 'Fecha factura',
      clave: (ele: SeleccionadasTabla) => ele.fechaFactura,
      orden: 8,
    },
];

/**
 * Mapeo de los encabezados de la tabla a las claves de los datos.
 * 
 * Permite relacionar el nombre del encabezado mostrado en la tabla con la propiedad correspondiente
 * en el modelo de datos SeleccionadasTabla.
 */
export const HEADER_MAP_DATOS: { [key: string]: string } = {
    'Fracción arancelaria': 'fraccionArancelaria',
    'Cantidad': 'cantidad',
    'Unidad de medida': 'unidadMedida',
    'Valor mercancía': 'valorMercancia',
    'Tipo de factura': 'tipoFactura',
    'Número factura': 'numFactura',
    'Complemento descripción': 'complementoDescripcion',
    'Fecha factura': 'fechaFactura',
};

/**
 * Mensaje HTML utilizado para mostrar una alerta de error en el formulario.
 *
 * Se despliega cuando el usuario intenta registrar información pero 
 * existen campos obligatorios sin capturar. El mensaje aparece centrado 
 * y con formato destacado para resaltar el error.
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro!</strong>Faltan campos por capturar.
    </div>
  </div>
</div>
`



/**
 * Representa un elemento de mercancía recibido desde la respuesta del backend.
 * 
 * Contiene información técnica, comercial y regulatoria de la mercancía.
 * Excepto el campo `idMercancia`, todos los demás son opcionales en la respuesta.
 */
export interface MercanciaResponseItem {
  /**
   * Identificador único de la mercancía registrado en el sistema.
   */
  idMercancia: number;

  /**
   * Fracción arancelaria asignada a la mercancía.
   * Generalmente corresponde a la clasificación arancelaria utilizada para comercio exterior.
   */
  fraccionArancelaria?: string;

  /**
   * Número de registro sanitario, regulatorio o de producto.
   */
  numeroRegistroProducto?: string;

  /**
   * Fecha en la que se expidió el registro, documento o autorización.
   * Formato esperado: YYYY-MM-DD.
   */
  fechaExpedicion?: string;

  /**
   * Fecha de vencimiento del registro, documento o autorización.
   * Formato esperado: YYYY-MM-DD.
   */
  fechaVencimiento?: string;

  /**
   * Nombre técnico o científico asociado a la mercancía.
   */
  nombreTecnico?: string;

  /**
   * Nombre comercial con el que se identifica o vende la mercancía.
   */
  nombreComercial?: string;

  /**
   * Criterio aplicado para determinar el origen de la mercancía,
   * según la normatividad de comercio exterior.
   */
  criterioOrigen?: string;

  /**
   * Valor de contenido regional (VCR) aplicado, cuando corresponda.
   * Usado en reglas de origen.
   */
  valorContenidoRegional?: string;

  /**
   * Norma o regla de origen aplicable a la mercancía.
   */
  normaOrigen?: string;

  /**
   * Nombre del producto o mercancía en idioma inglés.
   */
  nombreIngles?: string;
}


/**
 * Representa la respuesta del backend al realizar la búsqueda de mercancías.
 *
 * La propiedad `datos` contiene el listado de mercancías encontradas,
 * cada una representada mediante la interfaz `MercanciaResponseItem`.
 * Este campo es opcional, ya que la respuesta podría no incluir resultados.
 */
export interface BuscarMercanciasResponse {
  /**
   * Arreglo de mercancías obtenidas como resultado de la búsqueda.
   * Puede estar vacío o no existir si no se encontraron coincidencias.
   */
  datos?: MercanciaResponseItem[];
}



/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;