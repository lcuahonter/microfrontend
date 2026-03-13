import { REGEX_SOLO_DIGITOS } from "@libs/shared/data-access-user/src";

/**
 * @constant CUPOS_PASOS
 * @description
 * Configuración de los pasos del wizard para el trámite de cupos.
 * 
 * Funcionalidad:
 * - Define los pasos que se renderizan dinámicamente en el wizard.
 * - Cada paso incluye propiedades como `indice`, `titulo`, `activo` y `completado`.
 * 
 * Campos:
 * - `indice`: Número que identifica el orden del paso.
 * - `titulo`: Título descriptivo del paso.
 * - `activo`: Indica si el paso está activo.
 * - `completado`: Indica si el paso ha sido completado.
 * 
 * @example
 * const pasos = CUPOS_PASOS.map(paso => paso.titulo);
 */
export const CUPOS_PASOS = [
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
 * @constant DATOS_GENERALES_DEL_SOLICITANTE
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Datos Generales del Solicitante".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
 * 
 * Campos:
 * - `rfc`: Campo de texto desactivado que muestra el RFC del solicitante.
 * - `denominacion`: Campo de texto desactivado que muestra la denominación o razón social.
 * - `actividad`: Campo de texto desactivado que muestra la actividad económica preponderante.
 * - `correoElectronico`: Campo de texto desactivado que muestra el correo electrónico del solicitante.
 * 
 * @example
 * // Uso en un formulario dinámico:
 * const formulario = DATOS_GENERALES_DEL_SOLICITANTE.map(campo => crearControl(campo));
 */
export const DATOS_GENERALES_DEL_SOLICITANTE = [
  {
    id: 'curp',
    labelNombre: 'CURP',
    campo: 'curp',
    clase: 'col-md-4',
    tipoInput: 'text',
    tooltipQuestionCircle: true,
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'LEQI810121HDGSXG05',
    marginTop: 0,
  },
  {
    id: 'rfc',
    labelNombre: 'RFC',
    campo: 'rfc',
    clase: 'col-md-4',
    tipoInput: 'text',
    tooltipQuestionCircle: true,
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'LEQI8101214S7',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'nombre',
    labelNombre: 'Nombre(s)',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado:
      'MISAEL',
    marginTop: 0,
  },
  {
    id: 'primerApellido',
    labelNombre: 'Primer apellido',
    campo: 'primerApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado:
      'BARRAGAN',
    marginTop: 0,
  },
  {
    id: 'segundoApellido',
    labelNombre: 'Segundo apellido',
    campo: 'segundoApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'RUIZ',
    marginTop: 0,
  },
  {
    id: 'actividadEconomica',
    labelNombre: 'Actividad económica preponderante',
    campo: 'actividadEconomica',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'Otros consultorios del sector privado para el cuidado de la salud',
    marginTop: 0,
  },
  {
    id: 'correoElectronico',
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'otros@ejemplo.com',
    marginTop: 0,
  }
];

/**
 * @constant DOMICILIO_FISCAL_DEL_SOLICITANTE
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Domicilio Fiscal del Solicitante".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
 * 
 * Campos:
 * - `pais`: Campo de texto desactivado que muestra el país del domicilio fiscal.
 * - `codigoPostal`: Campo de texto desactivado que muestra el código postal.
 * - `estado`: Campo de texto desactivado que muestra el estado del domicilio fiscal.
 * - `municipio`: Campo de texto desactivado que muestra el municipio o alcaldía.
 * - `localidad`: Campo de texto desactivado que muestra la localidad.
 * - `colonia`: Campo de texto desactivado que muestra la colonia.
 * - `calle`: Campo de texto desactivado que muestra la calle.
 * - `numeroExterior`: Campo de texto desactivado que muestra el número exterior.
 * - `numeroInterior`: Campo de texto desactivado que muestra el número interior.
 * - `lada`: Campo de texto desactivado que muestra la lada.
 * - `telephono`: Campo de texto desactivado que muestra el teléfono.
 * 
 * @example
 * // Uso en un formulario dinámico:
 * const formulario = DOMICILIO_FISCAL_DEL_SOLICITANTE.map(campo => crearControl(campo));
 */
export const DOMICILIO_FISCAL_DEL_SOLICITANTE = [
  {
    id: 'pais',
    labelNombre: 'País',
    campo: 'pais',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'ESTADOS UNIDOS MEXICANOS',
    marginTop: 0,
  },
  {
    id: 'codigoPostal',
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '31109',
    marginTop: 0,
  },
  {
    id: 'estado',
    labelNombre: 'Estado',
    campo: 'estado',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'CHIHUAHUA',
    marginTop: 0,
  },
  {
    id: 'municipio',
    labelNombre: 'Municipio o alcaldía',
    campo: 'municipio',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'CHIHUAHUA',
    marginTop: 0,
  },
  {
    id: 'localidad',
    labelNombre: 'Localidad',
    campo: 'localidad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'CHIHUAHUA',
    marginTop: 0,
  },
  {
    id: 'colonia',
    labelNombre: 'Colonia',
    campo: 'colonia',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'COMPLEJO INDUSTRIAL CHIHUAHUA',
    marginTop: 0,
  },
  {
    id: 'calle',
    labelNombre: 'Calle',
    campo: 'calle',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'PASEO 4 MILPAS',
    marginTop: 0,
  },
  {
    id: 'numeroExterior',
    labelNombre: 'Número exterior',
    campo: 'numeroExterior',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '102',
    marginTop: 0,
  },
  {
    id: 'numeroInterior',
    labelNombre: 'Número interior',
    campo: 'numeroInterior',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'lada',
    labelNombre: 'Lada',
    campo: 'lada',
    clase: 'col-md-1',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'telephono',
    labelNombre: 'Teléfono',
    campo: 'telephono',
    clase: 'col-md-3',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
];

/**
 * @constant CONSULTAR_CUPO
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Consultar Cupo".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
 * 
 * Campos:
 * - `tratado`: Campo de selección para elegir el tratado o acuerdo.
 * - `clasificacion`: Campo de selección para clasificar el régimen.
 * - `pais`: Campo de selección para especificar el país destino/origen.
 * - `fraccionArancelaria`: Campo de texto para ingresar la fracción arancelaria.
 * - `descripcion`: Campo de selección desactivado para mostrar la descripción de la fracción arancelaria.
 * 
 * @example
 * // Uso en un formulario dinámico:
 * const formulario = CONSULTAR_CUPO.map(campo => crearControl(campo));
 */
export const CONSULTAR_CUPO = [
  {
    id: 'tratado',
    labelNombre: 'Tratado o acuerdo',
    campo: 'tratado',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'clasificacion',
    labelNombre: 'Clasificación del regimen',
    campo: 'clasificacion',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
    
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'pais',
    labelNombre: 'País destino/origen',
    campo: 'pais',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'fraccionArancelaria',
    labelNombre: 'Fracción arancelaria',
    campo: 'fraccionArancelaria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' },{ tipo: 'pattern', valor:REGEX_SOLO_DIGITOS, mensaje: 'Por favor, escribe un número entero válido.' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'descripcion',
    labelNombre: 'Descripción Fracción arancelaria',
    campo: 'descripcion',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: false
  },
];
/**
 * @constant DESCRIPCION_DEL_CUPO
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Descripción del Cupo".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
 * 
 * Campos:
 * - `fraccionArancelaria`: Campo de texto desactivado que muestra la fracción arancelaria.
 * - `descripcionProducto`: Campo de texto desactivado que muestra la descripción del producto.
 * - `tratadoBloque`: Campo de texto desactivado que muestra el tratado o bloque.
 * - `clasificacionSubproducto`: Campo de texto desactivado que muestra la clasificación del subproducto.
 * - `mecanismo`: Campo de texto desactivado que muestra el mecanismo de asignación.
 * - `categoria`: Campo de texto desactivado que muestra la categoría textil.
 * - `clasificacionRegimen`: Campo de texto desactivado que muestra la clasificación de régimen.
 * - `descripcionCategoria`: Campo de texto desactivado que muestra la descripción de la categoría textil.
 * - `paisDestino`: Campo de texto desactivado que muestra el país destino/origen.
 * - `unidadDeMedida`: Campo de texto desactivado que muestra la unidad de medida de la categoría textil.
 * - `factor`: Campo de texto desactivado que muestra el factor de conversión de la categoría textil.
 * - `fechaDeInicio`: Campo de texto desactivado que muestra la fecha de inicio de vigencia.
 * - `fechaDeFin`: Campo de texto desactivado que muestra la fecha de fin de vigencia.
 * 
 * @example
 * // Uso en un formulario dinámico:
 * const formulario = DESCRIPCION_DEL_CUPO.map(campo => crearControl(campo));
 */
export const DESCRIPCION_DEL_CUPO = [
  {
    id: 'fraccionArancelaria',
    labelNombre: 'Fracción arancelaria',
    campo: 'fraccionArancelariaDescripcion',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'descripcionProducto',
    labelNombre: 'Descripción del producto',
    campo: 'descripcionProducto',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'tratadoBloque',
    labelNombre: 'Tratado o bloque',
    campo: 'tratadoBloque',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'clasificacionSubproducto',
    labelNombre: 'Clasificación del subproducto',
    campo: 'clasificacionSubproducto',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'mecanismo',
    labelNombre: 'Mecanismo de asignación',
    campo: 'mecanismo',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'categoria',
    labelNombre: 'Categoría textil',
    campo: 'categoria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'clasificacionRegimen',
    labelNombre: 'Clasificación de régimen',
    campo: 'clasificacionRegimen',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'descripcionCategoria',
    labelNombre: 'Descripción de la categoría textil',
    campo: 'descripcionCategoria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'paisDestino',
    labelNombre: 'País destino/origen',
    campo: 'paisDestino',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'unidadDeMedida',
    labelNombre: 'Unidad de medida categoría textil',
    campo: 'unidadDeMedida',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'factor',
    labelNombre: 'Factor de conversión de la categoría textil',
    campo: 'factor',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'fechaDeInicio',
    labelNombre: 'Fecha de inicio de vigencia',
    campo: 'fechaDeInicio',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'fechaDeFin',
    labelNombre: 'Fecha de fin de vigencia',
    campo: 'fechaDeFin',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
];

/**
 * @constant REPRESENTACION_FEDERAL
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Representación Federal".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
 * 
 * Campos:
 * - `estado`: Campo de selección para elegir el estado.
 * - `representacionFederal`: Campo de selección para especificar la representación federal.
 * 
 * @example
 * // Uso en un formulario dinámico:
 * const formulario = REPRESENTACION_FEDERAL.map(campo => crearControl(campo));
 */
export const REPRESENTACION_FEDERAL = [
  {
    id: 'estado',
    labelNombre: 'Estado',
    campo: 'estado',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'representacionFederal',
    labelNombre: 'Representación federal',
    campo: 'representacionFederal',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
];

/**
 * @constant BIEN_FINAL
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Bien Final".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
 * 
 * Campos:
 * - `descripcion`: Campo de texto para ingresar la descripción del bien final.
 * 
 * @example
 * // Uso en un formulario dinámico:
 * const formulario = BIEN_FINAL.map(campo => crearControl(campo));
 */
export const BIEN_FINAL = [
  {
    id: 'descripcion',
    labelNombre: 'Descripción del bien final',
    campo: 'descripcionBienFinal',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
]

/**
 * @constant ALERTA_DE_APLICACION_REGISTRADA
 * @description
 * Mensaje de alerta que se muestra al usuario cuando la solicitud ha sido registrada con éxito.
 * 
 * Funcionalidad:
 * - Informa al usuario que la solicitud ha sido registrada con un número temporal.
 * - Aclara que el número temporal no tiene validez legal y que un folio oficial será asignado al momento de firmar la solicitud.
 * 
 * @type {object}
 * @property {string} message - Contiene el mensaje HTML que se muestra en la alerta.
 * 
 * @example
 * console.log(ALERTA_DE_APLICACION_REGISTRADA.message);
 */
export const ALERTA_DE_APLICACION_REGISTRADA = {
  message: `
  <p>La solicitud ha quedado registrada con el número temporal 202770947. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial será asignado a la solicitud en el momento en que esta sea firmada.</a>`
};

/**
 * @constant PAIS_ELEGIDO_ALERT
 * @description
 * Mensaje de alerta que se muestra al usuario cuando el país elegido para el hilado no es válido para el régimen seleccionado.
 * 
 * Funcionalidad:
 * - Informa al usuario sobre los errores relacionados con la selección del país en el formulario.
 * - Proporciona un mensaje claro para que el usuario corrija los errores antes de continuar.
 * 
 * @type {object}
 * @property {string} message - Contiene el mensaje HTML que se muestra en la alerta.
 * 
 * @example
 * console.log(PAIS_ELEGIDO_ALERT.message);
 */
export const PAIS_ELEGIDO_ALERT = {
  message: `
  <p>Corrija los siguientes errores</p>
  <p>El pais elegido para el hilado no es valido para el regimen seleccionado</p>`
};

/**
  * @constant ERROR_FORMA_ALERT
  * @type {string}
  * @description
  * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede, 
  * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
  */
export const ERROR_FORMA_ALERT =
`
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro!</strong>
    </div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`;

/**
 * @constant RADIO_INDICAR
 * @description
 * Configuración de las opciones de selección para el control de tipo radio en el formulario.
 * 
 * Funcionalidad:
 * - Define las opciones disponibles para el usuario en el formulario `procesoProductivoForm`.
 * - Cada opción incluye una etiqueta (`label`) y un valor (`value`) que se utiliza para identificar la selección.
 * 
 * @type {Array<{label: string, value: string}>}
 * 
 * @example
 * const opciones = RADIO_INDICAR.map(opcion => opcion.label);
 * console.log(opciones); // ['Hilo', 'Tela', 'Bienes tejidos a forma', 'prendas y otras manufacturas']
 */
export const RADIO_INDICAR = [
  {
      label: 'Hilo',
      value: '1',
  },
  {
      label: 'Tela',
      value: '2',
  },
  {
      label: 'Bienes tejidos a forma',
      value: '3',
  },
  {
      label: 'prendas y otras manufacturas',
      value: '4',
  }
];

/**
  * @constant FORMULARIO_MODAL_INSUMOS
  * @description
  * Configuración de los campos del formulario dinámico para la sección "Modal Insumos".
  * 
  * Detalles:
  * - Define los campos que se renderizan dinámicamente en el formulario.
  * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
  * - Los valores predeterminados y las propiedades de validación están configurados para cada campo.
  * 
  * Campos:
  * - `descripcion`: Campo de texto para ingresar la descripción del insumo.
  * - `fraccion`: Campo de texto para ingresar la fracción arancelaria.
  * - `descfraccion`: Campo de selección para describir la fracción arancelaria.
  * - `Pais`: Campo de selección para especificar el país de origen.
  * 
  * @example
  * const formulario = FORMULARIO_MODAL_INSUMOS.map(campo => crearControl(campo));
  */
export const FORMULARIO_MODAL_INSUMOS = [
  {
      id: 'descripcion',
      labelNombre: 'Descripción del insumo',
      campo: 'descripcionInsumo',
      clase: 'col-md-6',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
    },
    {
      id: 'fraccion',
      labelNombre: 'Fracción arancelaria',
      campo: 'fraccion',
      clase: 'col-md-6',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' },{ tipo: 'pattern', valor:REGEX_SOLO_DIGITOS, mensaje: 'Por favor, escribe un número entero válido.' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
    },
  {
    id: 'fraccion',
    labelNombre: 'Descripción Fracción arancelaria',
    campo: 'descfraccion',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'Pais',
    labelNombre: 'País de origen',
    campo: 'Pais',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  }
];

/**
 * @constant PROCESO_PRODUCTIVO
 * @description
 * Configuración de los campos del formulario dinámico para la sección "Proceso Productivo".
 * 
 * Funcionalidad:
 * - Define los campos que se renderizan dinámicamente en el formulario.
 * - Cada campo incluye propiedades como `id`, `labelNombre`, `campo`, `tipoInput`, entre otras.
 * 
 * Campos:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta descriptiva del campo.
 * - `campo`: Nombre del campo en el formulario.
 * - `tipoInput`: Tipo de entrada del campo (en este caso, `radio`).
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `soloLectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Lista de validaciones aplicadas al campo.
 * - `marcadorDePosicion`: Texto de marcador de posición para el campo.
 * - `valorPredeterminado`: Valor inicial del campo.
 * 
 * @type {Array<{id: string, labelNombre: string, campo: string, clase: string, tipoInput: string, desactivado: boolean, soloLectura: boolean, validadores: any[], marcadorDePosicion: string, valorPredeterminado: string}>}
 * 
 * @example
 * const formulario = PROCESO_PRODUCTIVO.map(campo => crearControl(campo));
 */
export const PROCESO_PRODUCTIVO = [
  {
    id: 'indicar',
    labelNombre: 'Indicar el(los) país(es) donde se realizó o realizaron el(los) siguiente(s) proceso(s) productivo(s), segúncorresponda al bien final a exportar o importar',
    campo: 'indicar',
    clase: 'col-md-4',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
  },
]

