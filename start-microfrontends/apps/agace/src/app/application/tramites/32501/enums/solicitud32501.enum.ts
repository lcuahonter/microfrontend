/**
 * Configuración para la fecha de ingreso de la mercancía.
 * Contiene la etiqueta descriptiva, si es un campo obligatorio y su estado de habilitación.
 */
export const FECHA_INGRESO = {
  labelNombre: 'Fecha en la que se empezará a utilizar la mercancía montada',
  required: true,
  habilitado: true,
};

/**
 * Configuración del catálogo "Entidad Federativa".
 * 
 * Campo requerido con lista desplegable para seleccionar una entidad federativa.
 */
export const ENTIDAD_FEDERATIVA = {
  catalogos: [],
  labelNombre: 'Entidad federativa',
  required: true,
  primerOpcion: 'Seleccione una opción',
};

/**
 * Configuración del catálogo "Delegación o Municipio".
 * 
 * Campo requerido para seleccionar una alcaldía o municipio.
 */
export const DELEGACION_MUNICIPIO = {
  catalogos: [],
  labelNombre: 'Alcaldía o municipio',
  required: true,
  primerOpcion: 'Seleccione una opción',
};

/**
 * Configuración del catálogo "Colonia".
 * 
 * Campo requerido para seleccionar una colonia correspondiente al municipio.
 */
export const COLONIA = {
  catalogos: [],
  labelNombre: 'Colonia',
  required: true,
  primerOpcion: 'Seleccione una opción',
};
/**
 * Configuración del catálogo "Aduana de Importación".
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  }
]; 
/**
 * Configuración del catálogo "Aduana de Importación".
 */
export const TODOS_PASOS = {
  Importante: `<p>Se sugiere verificar todos los datos capturados y documentos adjuntos antes de culminar el trámite, ya que, en caso de existir algún error, no se podrá modificar o eliminar la información posterior a su firma.</p>`
};

export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p>La solicitud ha quedado registrada con el número temporal ${
    numeroSolicitud ?? ''
  }. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`;


/**
 * Configuración del catálogo "Fracción arancelaria".
 * 
 * Campo requerido con lista desplegable para seleccionar una fracción arancelaria.
 */
export const FRACCION_ARANCELARIA = {
  catalogos: [],
  labelNombre: 'Fracción arancelaria',
  required: true,
  primerOpcion: 'Seleccione una opción',
};

/**
 * Configuración del catálogo "Fracción arancelaria".
 * 
 * Campo requerido con lista desplegable para seleccionar una fracción arancelaria.
 */
export const ADUANAS_ACTIVAS = {
  catalogos: [],
  labelNombre: 'Aduana',
  required: true,
  primerOpcion: 'Selecciona un valor',
};