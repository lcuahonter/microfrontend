import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { DisponiblesTabla } from '../models/certificado-origen.model';
import { HistoricoColumnas } from '../models/certificado-origen.model';
import { SeleccionadasTabla } from '../models/certificado-origen.model';

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
export const TERCEROS_TEXTO_DE_ALERTA =
  'Para continuar con el trámite, debes agregar por lo menos una mercancía.';

/**
 * Configuración para la fecha inicial.
 *
 * Define las propiedades de la fecha inicial, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHA_INICIAL = {
  labelNombre: 'Fecha inicio:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha final.
 *
 * Define las propiedades de la fecha final, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha fin:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha de factura.
 *
 * Define las propiedades de la fecha de factura, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHA_FACTURA = {
  labelNombre: 'Fecha de factura:',
  required: false,
  habilitado: true,
};

/**
 * Configuración de las columnas para la tabla de mercancías disponibles.
 *
 * Esta constante define los encabezados y claves de las columnas que se mostrarán en la tabla de mercancías disponibles.
 */
export const DISPONIBLES_ENCABEZADOS: ConfiguracionColumna<DisponiblesTabla>[] = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: DisponiblesTabla) => ele.fraccionArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: DisponiblesTabla) => ele.nombreTecnico,
    orden: 2,
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: DisponiblesTabla) => ele.nombreComercial,
    orden: 3,
  },
  {
    encabezado: 'Número de registro de productos',
    clave: (ele: DisponiblesTabla) => ele.numeroRegistroProductos,
    orden: 4,
  },
  {
    encabezado: 'Fecha expedición',
    clave: (ele: DisponiblesTabla) => ele.fechaExpedicion,
    orden: 5,
  },
  {
    encabezado: 'Fecha vencimiento',
    clave: (ele: DisponiblesTabla) => ele.fechaVencimiento,
    orden: 6,
  },
];

/**
 * Configuración de las columnas para la tabla de mercancías seleccionadas.
 * 
 * Esta constante define los encabezados y claves de las columnas que se mostrarán 
 * en la tabla de mercancías seleccionadas en el certificado de origen.
 * 
 * @type {ConfiguracionColumna<SeleccionadasTabla>[]}
 * @constant
 * @property {string} encabezado - El título de la columna que se mostrará en la tabla.
 * @property {function} clave - Una función que toma un elemento de tipo SeleccionadasTabla y devuelve el valor a mostrar en la columna.
 * @property {number} orden - El orden en que se mostrará la columna en la tabla.
 * @returns {ConfiguracionColumna<SeleccionadasTabla>[]} Un array de objetos que representan la configuración de las columnas.
 */ 
export const SLECCIONADAS_ENCABEZADOS: ConfiguracionColumna<SeleccionadasTabla>[] = [
  {
    /** Encabezado para la fracción arancelaria */
    encabezado: 'Fracción arancelaria',
    /** Función que extrae la fracción arancelaria del elemento */
    clave: (ele: SeleccionadasTabla) => ele.fraccionArancelaria,
    /** Orden de la columna en la tabla */
    orden: 1,
  },
  {
    /** Encabezado para la cantidad de mercancía */
    encabezado: 'Cantidad',
    /** Función que extrae la cantidad del elemento */
    clave: (ele: SeleccionadasTabla) => ele.cantidad,
    /** Orden de la columna en la tabla */
    orden: 2,
  },
  {
    /** Encabezado para la unidad de medida */
    encabezado: 'Unidad de medida',
    /** Función que extrae la unidad de medida del elemento */
    clave: (ele: SeleccionadasTabla) => ele.unidadMedida,
    /** Orden de la columna en la tabla */
    orden: 3,
  },
  {
    /** Encabezado para el valor de la mercancía */
    encabezado: 'Valor mercancía',
    /** Función que extrae el valor de la mercancía del elemento */
    clave: (ele: SeleccionadasTabla) => ele.valorMercancia,
    /** Orden de la columna en la tabla */
    orden: 4,
  },
  {
    /** Encabezado para el tipo de factura */
    encabezado: 'Tipo de factura',
    /** Función que extrae el tipo de factura del elemento */
    clave: (ele: SeleccionadasTabla) => ele.tipoFactura,
    /** Orden de la columna en la tabla */
    orden: 5,
  },
  {
    /** Encabezado para el número de factura */
    encabezado: 'Número factura',
    /** Función que extrae el número de factura del elemento */
    clave: (ele: SeleccionadasTabla) => ele.numFactura,
    /** Orden de la columna en la tabla */
    orden: 6,
  },
  {
    /** Encabezado para el complemento de descripción */
    encabezado: 'Complemento descripción',
    /** Función que extrae el complemento de descripción del elemento */
    clave: (ele: SeleccionadasTabla) => ele.complementoDescripcion,
    /** Orden de la columna en la tabla */
    orden: 7,
  },
  {
    /** Encabezado para la fecha de factura */
    encabezado: 'Fecha factura',
    /** Función que extrae la fecha de factura del elemento */
    clave: (ele: SeleccionadasTabla) => ele.fechaFactura,
    /** Orden de la columna en la tabla */
    orden: 8,
  },
];


/**
 * Configuración de las columnas para la tabla de historial de productores.
 * 
 * Esta constante define los encabezados y claves de las columnas que se mostrarán 
 * en la tabla de historial de productores exportadores.
 * 
 * @type {ConfiguracionColumna<HistoricoColumnas>[]}
 * @constant
 * @property {string} encabezado - El título de la columna que se mostrará en la tabla.
 * @property {function} clave - Una función que toma un elemento de tipo HistoricoColumnas y devuelve el valor a mostrar en la columna.
 * @property {number} orden - El orden en que se mostrará la columna en la tabla.
 * @returns {ConfiguracionColumna<HistoricoColumnas>[]} Un array de objetos que representan la configuración de las columnas.
 */
export const HISTORICO_ENCABZADOS: ConfiguracionColumna<HistoricoColumnas>[] = [
  {
    /** Encabezado para el nombre del productor */
    encabezado: 'Nombre del productor',
    /** Función que extrae el nombre del productor del elemento */
    clave: (elementos) => elementos.nombreProductor,
    /** Orden de la columna en la tabla */
    orden: 1
  },
  {
    /** Encabezado para el número de registro fiscal */
    encabezado: 'Número de registro fiscal',
    /** Función que extrae el número de registro fiscal del elemento */
    clave: (elementos) => elementos.numeroRegistroFiscal,
    /** Orden de la columna en la tabla */
    orden: 2,
  },
  {
    /** Encabezado para la dirección */
    encabezado: 'Dirección',
    /** Función que extrae la dirección del elemento */
    clave: (elementos) => elementos.direccion,
    /** Orden de la columna en la tabla */
    orden: 3,
  },
  {
    /** Encabezado para el correo electrónico */
    encabezado: 'Correo Electrónico',
    /** Función que extrae el correo electrónico del elemento */
    clave: (elementos) => elementos.correoElectronico,
    /** Orden de la columna en la tabla */
    orden: 4,
  },
  {
    /** Encabezado para el teléfono */
    encabezado: 'Teléfono',
    /** Función que extrae el teléfono del elemento */
    clave: (elementos) => elementos.telefono,
    /** Orden de la columna en la tabla */
    orden: 5,
  },
  {
    /** Encabezado para el fax */
    encabezado: 'Fax',
    /** Función que extrae el fax del elemento */
    clave: (elementos) => elementos.fax,
    /** Orden de la columna en la tabla */
    orden: 6,
  },
];

/**
 * Constante que define el mensaje de error para validación de formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro! </strong> Faltan campos por capturar
    </div>
  </div>
</div>
`;