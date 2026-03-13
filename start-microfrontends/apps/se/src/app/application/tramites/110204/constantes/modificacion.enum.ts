import { Mercancias } from "../models/plantas-consulta.model";

/**
 * Paso del proceso de captura y firma de solicitud.
 * Define los pasos del proceso en una lista.
 */
export const PASOS = [
  {
    indice: 1, // Índice del paso
    titulo: 'Capturar solicitud', // Título del paso
    activo: true, // Indica si el paso está activo
    completado: true, // Indica si el paso ha sido completado
  },
  {
    indice: 2, // Índice del paso
    titulo: 'Firmar solicitud', // Título del paso
    activo: false, // Indica si el paso está activo
    completado: false, // Indica si el paso ha sido completado
  },
];

/**
 * Enum para representar los tipos de selección en las tablas.
 * Permite especificar si se utilizará un checkbox, un radio, o si no está definido.
 */
export enum TablaSeleccion {
  CHECKBOX = 'CHECKBOX', // Representa la selección con checkbox
  RADIO = 'RADIO', // Representa la selección con radio
  UNDEFINED = 'undefined', // Indica que la selección no está definida
}

/**
 * Configuración para los campos de mercancía.
 * Define los encabezados, claves y el orden para mostrar los datos relacionados con las mercancías.
 */
export const CONFIGURACION_MERCANCIA = [
  {
    encabezado: 'Fracción NALADI', // Título de la columna
    clave: (ele: Mercancias): string | undefined => ele.fraccionNaladi, // Función que devuelve la fracción Naladi
    orden: 1, // Orden en que se mostrará la columna
  },
  {
    encabezado: 'Fracción NALADISA93', // Título de la columna
    clave: (ele: Mercancias): string | undefined => ele.fraccionNaladiSa93, // Función que devuelve la fracción Naladi SA93
    orden: 2, // Orden en que se mostrará la columna
  },
  {
    encabezado: 'Fracción NALADISA96', // Título de la columna
    clave: (ele: Mercancias): string | undefined => ele.fraccionNaladiSa96, // Función que devuelve la fracción Naladi SA96
    orden: 3, // Orden en que se mostrará la columna
  },
  {
    encabezado: 'Fracción NALADISA02', // Título de la columna
    clave: (ele: Mercancias): string | undefined => ele.fraccionNaladiSa02, // Función que devuelve la fracción Naladi SA02
    orden: 4, // Orden en que se mostrará la columna
  },
  {
    encabezado: 'Nombre técnico', // Título de la columna
    clave: (ele: Mercancias): string | undefined => ele.nombreTecnico, // Función que devuelve el nombre técnico de la mercancía
    orden: 5, // Orden en que se mostrará la columna
  },
  {
    encabezado: 'Nombre comercial', // Título de la columna
    clave: (ele: Mercancias): string | undefined => ele.nombreComercial, // Función que devuelve el nombre comercial de la mercancía
    orden: 5, // Orden en que se mostrará la columna
  }
];

/**
 * @constant IDPROCEDIMIENTO
 * @description
 * Identificador numérico del procedimiento actual para el trámite 110204.
 * Se utiliza para configurar y asociar el proceso en los componentes y servicios relacionados.
 */
export const IDPROCEDIMIENTO = 110204;

/**
 * @constant ERROR_FORMA_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`
/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;