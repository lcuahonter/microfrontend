import {
  ConfiguracionColumna,
  CrossListLable,
} from '@libs/shared/data-access-user/src';
import { LineaCaptura } from '../../models/5701/linea-captura.model';

/**
 * @description Constantes para el manejo de los campos de fecha de inicio y fecha final
 * en la aplicación.
 */
export const FECHA_INICIO = {
  labelNombre: 'Fecha inicio',
  required: true,
  habilitado: true,
};

/**
 * @description Constantes para el manejo de los campos de fecha de inicio y fecha final
 * en la aplicación.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha final',
  required: true,
  habilitado: true,
};

/**
 * @description Constantes para el manejo de las etiquetas de los inputs de la autorización LDA y DDEX
 * @param LABEL_DESPACHO_LDA: Etiqueta del input de la autorización LDA
 * @param LABEL_DESPACHO_DD: Etiqueta del input de la autorización DDEX
 */
export const LABEL_DESPACHO_LDA = 'RFC autorización LDA';
export const LABEL_DESPACHO_DD = 'Autorizacion DDEX';

/**
 * @description Constantes para el manejo de los ids de los inputs de la autorización LDA y DDEX
 * @param ID_NAME_LDA: Id del input de la autorización LDA
 * @param ID_NAME_DD: Id del input de la autorización DDEX
 */
export const ID_NAME_DD = 'autorizacionDDEX';
export const ID_NAME_LDA = 'autorizacionLDA';

/**
 * @description Constantes para el manejo de los nombres de las funciones del store
 * @param FUNCION_STORE_LDA: Función para guardar la autorización LDA en el store
 * @param FUNCION_STORE_DD: Función para guardar la autorización DDEX en el store
 */
export const FUNCION_STORE_LDA = 'setAutorizacionLDA';
export const FUNCION_STORE_DD = 'setAutorizacionDDEX';

/**
 * @description Constantes para el manejo del tipo de vehiculos en la seccion --

*/
export const VEHICULO = ['Carretero', 'Ferroviario', 'Peatonal', 'Otro'];

/**
 * @description Constantes para el manejo del tipo de transporte en la seccion --
 */
export const TRANSPORTE = [
  'Carretero',
  'Ferroviario',
  'Aéreo',
  'Marítimo',
  'Otro',
];

/**
 * Constante para el endpoint de la API de la consulta de las patentes en data dummy
 * se va a eliminar
 */
export const PATENTES_ID = 33;

/**
 * @description Constantes para el manejor de los tipos de empresas certificadas y su valor.
 * Se requiere para el parametro que le se pasa al input-radio component
 */
export const EMPRESAS_CERTIFICADAS = [
  {
    label: 'I.V.A e I.E.P.S Certificación A',
    value: 'a',
  },
  {
    label: 'I.V.A e I.E.P.S Certificación AA',
    value: 'aa',
  },
  {
    label: 'I.V.A e I.E.P.S Certificación AAA',
    value: 'aaa',
  },
];

/**
 * @description Constante para el manejo del tipo de tramite 5701
 */
export const TIPO_TRAMITE: number = 5701;

/**
 * @description Constante para el manejo del valor sin valor en el select.
 */
export const SIN_VALOR = -1;

/**
 * @description Constante para el manejo del valor del select cuando no hay valores.
 */
export const SIN_VALORES = '-1';

/**
 * @description Constante para el manejo del valor del select cuando no hay valores.
 */
export const SIN_ITEMS = '-2';

export const CONFIGURACION_ENCABEZADO_TABLA_PAGOS: ConfiguracionColumna<LineaCaptura>[] =
  [
    /**
     * Encabezado de la columna que muestra el nombre de la persona.
     * - Encabezado: "Nombre".
     * - Clave: Obtiene el valor de `nombre` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Línea de captura',
      clave: (fila) => fila.lineaCaptura,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra el correo electrónico de la persona.
     * - Encabezado: "Correo".
     * - Clave: Obtiene el valor de `correo` de la fila.
     * - Orden: 2.
     */
    { encabezado: 'Monto', clave: (fila) => fila.monto, orden: 2 },
  ];

/**
 * @description Constante estauts pagado
 */
export const ESTATUS_PAGADO = 'Pagado';

/**
 * @description Mensaje del registro exitoso de la solicitud
 *@param {string} numeroSolicitud - El número de la solicitud registrada.
 */

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p>La solicitud ha quedado regitrada con el número temporal ${numeroSolicitud ?? ''}. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;

/**
 * @description Almacena el valor de un dia = 1
 */
export const UN_DIA = 1;

/**
 * @description Etiquetas para el crosslist de fechas
 */
export const LABEL_CROSSLIST: CrossListLable = {
  tituluDeLaIzquierda: 'Fechas dentro del periodo',
  derecha: 'Fechas seleccionadas para el servicio extraordinario',
};

/**
 * @description Campos requetridos
 */
export const CAMPOS_OBLIGATORIOS = 'Este campo es obligatorio';

/**
 *  @description RFC no válido
 */
export const ERR_RFC_NO_VALIDO = 'El RFC no es válido';

/**
 * @description Constante para la sección aduanera
 */
export const SECCION_ADUANERA = 'seccionAduanera';

/**
 * @description Constante para el recinto fiscalizado
 */
export const RECINTO_FISCALIZADO = 'recintoFiscalizado';

/**
 *@descrption Constante para el RFC del solicitante, este se va a eliminar, cuando se implemente el store del inicio de sesion
 */
export const RFC_SOLICITANTE = 'DODM930823EG4';

/**
 * @desccription Valor del select DDEX
 */
export const TIPO_DESPACHO_DDEX = 3;

/**
 * @description Valor select Tipo Operacion Exportacion
 */
export const TIPO_OPERACION_EXPORTACION = 2;

/**
 * @desdcription Link para generar la línea de captura
 */
export const URL_GENERAR_LINEA_CAPTURA =
  'https://pccem.mat.sat.gob.mx/PTSC/cet/FmpceContr/faces/resources/pages/pagos/formularioMultiplePago.jsf ';


  export const TIPO_ENUM = {
    IMPORTACION: "1",
    EXPORTACION: "2",
    TRANSITO: "3",
  } as const;
