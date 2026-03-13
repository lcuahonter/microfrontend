import { ConfiguracionVisibilidad } from "../models/datos-domicilio-legal.model";
import { CrossListLable } from "../models/datos-solicitud.model";

/*
 * Mensaje de alerta que informa al usuario sobre el cumplimiento de requisitos y normatividad aplicable.
 * También establece que la notificación del trámite será a través de la Ventanilla Única de Comercio Exterior.
 */
export const MENSAJE_DE_ALERTA = {
  message: `
    Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma. 
    `,
}

/*
 * Lista de países disponibles para selección en el formulario.
 */
export const CROSLISTA_DE_PAISES: string[] = [
  'AFGANISTÁN (EMIRATO ISLÁMICO)',
  'ALBANIA (REPÚBLICA DE)',
  'ALEMANIA (REPÚBLICA FEDERAL DE)',
  'ANDORRA (PRINCIPADO DE)',
  'ANGOLA (REPÚBLICA DE)',
  'ANGUILLA',
  'ANTIGUA Y BARBUDA',
  'ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)',
  'ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)',
  'ARGENTINA (REPÚBLICA)',
  'AUSTRALIA (COMMONWEALTH OF)',
  'AUSTRIA (REPUBLIC OF)',
  'BAHAMAS (COMMONWEALTH OF THE)',
  'BAHRAIN (KINGDOM OF)',
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  'BARbados',
  'BELGIUM (KINGDOM OF)',
  'BELIZE',
  'BENIN (REPUBLIC OF)',
  'BHUTAN (KINGDOM OF)',
];

/*
 * Configuración para el campo de fecha de caducidad en el formulario.
 * Incluye el nombre de la etiqueta, si es obligatorio y si está habilitado.
 */
export const INPUT_FECHA_CADUCIDAD_CONFIG = {
  labelNombre: 'Fecha de caducidad', // Nombre de la etiqueta del campo.
  required: false, // Indica si el campo es obligatorio.
  habilitado: true, // Indica si el campo está habilitado.
};

/*
 * Lista de aduanas de entrada disponibles para selección en el formulario.
 */
export const CROSLISTA_DE_ADUANAS_ENTRADA: string[] = [
  'ACAPULCO, PUERTO Y AEROPUERTO',
  'ADUANA DE PANTACO',
  'AEROPUERTO INT. DE LA CD DE MEXI',
  'AEROPUERTO INTERNACIONAL FELIF',
  'AGUA PRIETA',
  'AGUASCALIENTES, AGS.',
  'ALTAMIRA',
  'CANCUN, AEROPUERTO',
  'CD. CAMARGO, TAMPS.',
  'CD. DEL CARMEN',
  'CD. JUAREZ',
  'CHIHUAHUA, CHIH.',
];

/*
 * Mensaje de alerta que se muestra cuando faltan datos obligatorios como localidad y colonia.
 */
export const ALERT_INSUMOS = {
  ALERTA: `¡Precaución! Debes capturar localidad y colonia`, // Mensaje de alerta que se muestra al usuario.
};

/*
 * Representa la configuración de visibilidad predeterminada para varios campos relacionados con países.
 */
export const DEFAULT_CONFIGURACION_VISIBILIDAD: ConfiguracionVisibilidad = {
  paisOrigen: false, // Indica si el país de origen es visible. Por defecto es `false`.
  paisFabrica: true, // Indica si el país de fabricación es visible. Por defecto es `true`.
  paisElaboracion: true, // Indica si el país de elaboración es visible. Por defecto es `true`.
  paisProveedor: true, // Indica si el país del proveedor es visible. Por defecto es `true`.
  paisProcedencia: true, // Indica si el país de procedencia es visible. Por defecto es `true`.
};


/*
 * Configuración de la notificación de alerta para indicar la falta de comunicación con el Sistema de COFEPRIS.
 */
export const NUEVA_NOTIFICACION = {
  tipoNotificacion: 'alert', // Define el tipo de notificación como alerta.
  categoria: 'danger', // Categoría de la notificación, indica un mensaje crítico.
  modo: 'action', // Modo en el que se presenta la notificación, requiere acción del usuario.
  titulo: '', // Título de la notificación, actualmente vacío.
  mensaje: 
    'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.', 
    // Mensaje que informa sobre la falta de comunicación y solicita captura de datos.
  cerrar: false, // Indica si la notificación se puede cerrar manualmente. `false` significa que no se puede cerrar.
  tiempoDeEspera: 2000, // Tiempo de espera antes de que la notificación desaparezca automáticamente, en milisegundos.
  txtBtnAceptar: 'Aceptar', // Texto del botón para aceptar la notificación.
  txtBtnCancelar: 'Cancelar', // Texto del botón para cancelar la notificación.
};

/** Etiquetas para el campo de uso específico en el componente de selección cruzada. */
export const USO_ESPECIFICO_LABEL: CrossListLable = {
    tituluDeLaIzquierda: 'Uso específico',
    derecha: 'Uso específico seleccionado',
  }

/** Etiquetas para el campo de país de procedencia en el componente de selección cruzada. */
export const PAIS_DE_PROCEDENCIA_LABEL: CrossListLable = {
    tituluDeLaIzquierda: 'País de procedencia',
    derecha: 'País(es) seleccionado(s)',
  }

/** Etiquetas para el campo de país de origen en el componente de selección cruzada. */
export const PAIS_DE_ORIGEN_LABEL: CrossListLable = {
    tituluDeLaIzquierda: 'País de origen',
    derecha: 'País(es) seleccionado(s)',
  }

export const FUNCIONAMIENTO_LIST: number[] = [];