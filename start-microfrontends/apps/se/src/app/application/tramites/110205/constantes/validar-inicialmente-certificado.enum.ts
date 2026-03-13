import { AcuseLista, DisponiblesTabla, HistoricoColumnas, SeleccionadasTabla } from "../models/validar-inicialmente-certificado.model";

/**
 * Constante que define los pasos del wizard en el trámite.
 * 
 * Esta constante contiene un array de objetos que representan los pasos del wizard,
 * incluyendo su índice, título, y estado (activo o completado).
 */
export const PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },

  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Texto de alerta para terceros.
 * 
 * Este texto se muestra como un mensaje de advertencia cuando no se han agregado mercancías al trámite.
 */
export const TERCEROS_TEXTO_DE_ALERTA = 'Para continuar con el trámite, debes agregar por lo menos una mercancía.';
export const TEXTO_DE_ALERTA = 'Existen mercancías sin productor';
export const TEXTO_DE_PELIGRO = `<p>Corrija los siguientes errores: </p>
      <p style="color:#d0021b; display: flex; justify-content: center; position: relative;"><span style="position: absolute; left: 2px;">1</span>Existen mercancías sin productor </p>`
/**
 * Configuración para la fecha inicial.
 * 
 * Define las propiedades de la fecha inicial, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAINICIAL = {
  labelNombre: 'Fecha inicio:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha final.
 * 
 * Define las propiedades de la fecha final, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAFINAL = {
  labelNombre: 'Fecha fin:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha de factura.
 * 
 * Define las propiedades de la fecha de factura, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAFACTURA = {
  labelNombre: 'Fecha de factura',
  required: true,
  habilitado: true,
};
/**
 * Encabezados de la tabla de mercancías seleccionadas.
 * 
 * Define las columnas y su configuración para la tabla de mercancías seleccionadas.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente
 * en los datos y un orden para determinar su posición en la tabla.
 */
export const SELECCIONADAS_ENCABEZADOS = [
  {
    encabezado: 'RFC productor',
    clave: (ele: SeleccionadasTabla): string => ele.rfcProductor,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: SeleccionadasTabla): string => ele.fraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: SeleccionadasTabla): string => ele.cantidad,
    orden: 3,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (ele: SeleccionadasTabla): string => ele.unidadMedida,
    orden: 4,
  },
  {
    encabezado: 'Valor mercancía',
    clave: (ele: SeleccionadasTabla): string => ele.valorMercancia,
    orden: 5,
  },
  {
    encabezado: 'Tipo de factura',
    clave: (ele: SeleccionadasTabla): string => ele.tipoFactura,
    orden: 6,
  },
  {
    encabezado: 'Número factura',
    clave: (ele: SeleccionadasTabla): string => ele.numFactura,
    orden: 7,
  },
  {
    encabezado: 'Complemento descripción',
    clave: (ele: SeleccionadasTabla): string => ele.complementoDescripcion,
    orden: 8,
  },
  {
    encabezado: 'Fecha factura',
    clave: (ele: SeleccionadasTabla): string => ele.fechaFactura,
    orden: 9,
  },
];
/**
 * Encabezados de la tabla de productores históricos.
 * 
 * Define las columnas y su configuración para la tabla de productores históricos.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente
 * en los datos y un orden para determinar su posición en la tabla.
 */
export const TABLE_COLUMNS = [
  {
    encabezado: 'Nombre del productor',
    clave: (elementos: HistoricoColumnas): string => elementos.nombreProductor,
    orden: 1
  },
  {
    encabezado: 'Número de registro fiscal',
    clave: (elementos: HistoricoColumnas): string => elementos.numeroRegistroFiscal,
    orden: 2,
  },
  {
    encabezado: 'Dirección',
    clave: (elementos: HistoricoColumnas): string => elementos.direccion,
    orden: 3,
  },
  {
    encabezado: 'Correo Electrónico',
    clave: (elementos: HistoricoColumnas): string => elementos.correoElectronico,
    orden: 4,
  },
  {
    encabezado: 'Teléfono',
    clave: (elementos: HistoricoColumnas): string => elementos.telefono,
    orden: 5,
  },
  {
    encabezado: 'Fax',
    clave: (elementos: HistoricoColumnas): string => elementos.fax,
    orden: 6,
  },
];

/**
 * Encabezados de la tabla de mercancías seleccionadas.
 * 
 * Define las columnas y su configuración para la tabla de mercancías seleccionadas.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente
 * en los datos y un orden para determinar su posición en la tabla.
 */
export const MERCANCIAS_ENCABEZADOS = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: SeleccionadasTabla): string => ele.fraccionArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: SeleccionadasTabla): string => ele.cantidad,
    orden: 2,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (ele: SeleccionadasTabla): string => ele.unidadMedida,
    orden: 3,
  },
  {
    encabezado: 'Valor mercancía',
    clave: (ele: SeleccionadasTabla): string => ele.valorMercancia,
    orden: 4,
  },
  {
    encabezado: 'Tipo de factura',
    clave: (ele: SeleccionadasTabla): string => ele.tipoFactura,
    orden: 5,
  },
  {
    encabezado: 'Número factura',
    clave: (ele: SeleccionadasTabla): string => ele.numFactura,
    orden: 6,
  },
  {
    encabezado: 'Complemento descripción',
    clave: (ele: SeleccionadasTabla): string => ele.complementoDescripcion,
    orden: 7,
  },
  {
    encabezado: 'Fecha factura',
    clave: (ele: SeleccionadasTabla): string => ele.fechaFactura,
    orden: 8,
  },
];
/**
 * Encabezados de la tabla de mercancías disponibles.
 * 
 * Define las columnas y su configuración para la tabla de mercancías disponibles.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente
 * en los datos y un orden para determinar su posición en la tabla.
 */
export const DISPONIBLES_ENCABEZADOS = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: DisponiblesTabla): string => ele.fraccionArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: DisponiblesTabla): string => ele.nombreTecnico,
    orden: 2,
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: DisponiblesTabla): string => ele.nombreComercial,
    orden: 3,
  },
  {
    encabezado: 'Número de registro de productos',
    clave: (ele: DisponiblesTabla): string => ele.numeroRegistroProductos,
    orden: 4,
  },
  {
    encabezado: 'Fecha expedición',
    clave: (ele: DisponiblesTabla): string => ele.fechaExpedicion,
    orden: 5,
  },
  {
    encabezado: 'Fecha vencimiento',
    clave: (ele: DisponiblesTabla): string => ele.fechaVencimiento,
    orden: 6,
  },
];
/**
 * Encabezados de la tabla de acuses.
 * 
 * Define las columnas y su configuración para la tabla de acuses.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente
 * en los datos y un orden para determinar su posición en la tabla.
 */
export const ACUSE_ENCABEZADOS = [
  {
    encabezado: 'No.',
    clave: (ele: AcuseLista): number => ele.id,
    orden: 1,
  },
  {
    encabezado: 'Documento',
    clave: (ele: AcuseLista): string => ele.documento,
    orden: 2,
  }];
/**
* Datos de ejemplo para la tabla de acuses.
* 
* Contiene un ejemplo de acuse con su identificador, nombre del documento y enlace de descarga.
*/
export const ACUSE_DATOS = [
  {
    id: 1,
    documento: 'Vista previa del Certificado de origen',
    descargar: ''
  }
];

/**
 * Opciones para el componente de radio buttons.
 * 
 * Define las opciones disponibles para un conjunto de botones de radio,
 * incluyendo la etiqueta que se muestra y el valor asociado a cada opción.
 */
export const RADIO_OPTIONS = [
  { label: 'Periodo:', value: 'periodo' },
  { label: 'Una sola importación', value: 'una_sola_importacion' },
];