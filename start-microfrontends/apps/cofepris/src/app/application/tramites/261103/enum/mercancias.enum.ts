import { ConfiguracionColumna } from "@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model";
import { Mercancias } from "../modelos/mercancias.model";
/**
   * Configuración para las columnas de la tabla.
   * Define cómo se mostrarán los datos de los trámites Mercancias.
   */
  export const CONFIGURACIONCOLUMNA: ConfiguracionColumna<Mercancias>[] = [
    /** Configuración para las columnas de la tabla */
      { encabezado: 'Clasificación del producto ', clave: (item: Mercancias) => item.clasificacionDelProducto, orden: 1 },
      { encabezado: 'Especificar clasificación del product  ', clave: (item: Mercancias) => item.especificarClasificacionDelProduct, orden: 2 },
      { encabezado: 'Denominación ', clave: (item: Mercancias) => item.denominacion, orden: 3 },
      { encabezado: 'Denominación distintiva  ', clave: (item: Mercancias) => item.denominacionDistintiva, orden: 4 },
      { encabezado: 'Número CAS  ', clave: (item: Mercancias) => item.numeroCAS, orden: 5 },
      { encabezado: 'Fracción arancelaria', clave: (item: Mercancias) => item.fraccionArancelaria, orden: 6 },
      { encabezado: 'Descripción de I fracción ', clave: (item: Mercancias) => item.descripcionDeFraccion, orden: 7 },
    ];

/**
 * Identificador del procedimiento administrativo correspondiente al trámite.
 *
 * @constant
 * @type {number}
 */
export const ID_PROCEDIMIENTO = 261103;
/**
 * @const ELEMENTOS_REQUERIDOS
 * @description Lista de elementos requeridos para completar el formulario o proceso.
 */
export const ELEMENTOS_REQUERIDOS = [
  'correoElectronico',
  'denominacionRazon',
  'scian'
];
/**
 * @const MENSAJE_DE_VALIDACION
 * @description Mensaje de validación que se muestra cuando faltan campos por capturar.
 */
export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';
/**
 * @const TITULO_MENSAJE
 * @description Título del mensaje que se muestra en la interfaz de usuario.
 */
export const TITULO_MENSAJE =
'Solicitud de Modificación de Importación de Medicamentos que sean o contengan Estupefacientes o Psicotrópicos ';

/**
 * @const PASOS
 * @description Define los pasos del proceso de solicitud.
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
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];
/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_PAGE= '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?';
/** * Mensaje de validación en formato HTML que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos.
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';