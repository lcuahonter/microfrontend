

/**
 * Constante que representa la configuración de la fecha de pago.
 * 
 * @property {string} labelNombre - Etiqueta que describe el nombre del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {boolean} habilitado - Indica si el campo está habilitado.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha del acta',
  required: true,
  habilitado: true,
};

/**
 * Información de domicilio y datos fiscales del solicitante.
 *
 * @property calle - Nombre de la calle del domicilio fiscal.
 * @property numeroExterior - Número exterior del domicilio fiscal.
 * @property numeroInterior - Número interior del domicilio fiscal.
 * @property codigoPostal - Código postal del domicilio fiscal.
 * @property localidad - Localidad del domicilio fiscal.
 * @property colonia - Colonia del domicilio fiscal.
 * @property municipioODelegacion - Municipio o delegación del domicilio fiscal.
 * @property entidadFederativa - Entidad federativa del domicilio fiscal.
 * @property pais - País del domicilio fiscal.
 * @property registroFederalDeContribuyentes - RFC del solicitante.
 * @property domicilioFiscalDelSolicitante - Domicilio fiscal completo del solicitante.
 * @property razonSocial - Razón social del solicitante.
 */
export const FECHA_DE_Tabla = {
  calle: "Insurgentes Sur",
  numeroExterior: "456",
  numeroInterior: "12A",
  codigoPostal: "03100",
  localidad: "Ciudad de México",
  colonia: "Del Valle",
  municipioODelegacion: "Benito Juárez",
  entidadFederativa: "Ciudad de México",
  pais: "México",
  registroFederalDeContribuyentes: "XYZ890123LMN",
  domicilioFiscalDelSolicitante: "Insurgentes Sur 456, Interior 12A, Colonia Del Valle, Benito Juárez, Ciudad de México, C.P. 03100, México",
  razonSocial: "Servicios Digitales Ejemplo S.A. de C.V."
}


/**
 * Información de la planta INMEX, incluyendo detalles de ubicación, domicilio fiscal y razón social.
 *
 * @property {string} planta - Nombre de la planta.
 * @property {string} calle - Calle donde se ubica la planta.
 * @property {string} numeroExterior - Número exterior del domicilio.
 * @property {string} numeroInterior - Número interior o suite del domicilio.
 * @property {string} codigoPostal - Código postal de la ubicación.
 * @property {string} localidad - Localidad de la planta.
 * @property {string} colonia - Colonia donde se encuentra la planta.
 * @property {string} delegacionMunicipio - Delegación o municipio correspondiente.
 * @property {string} entidadFederativa - Entidad federativa (estado) de la planta.
 * @property {string} pais - País donde se ubica la planta.
 * @property {string} registroFederalDeContribuyentes - RFC de la empresa.
 * @property {string} domicilioDelSolicitante - Domicilio completo del solicitante.
 * @property {string} razonSocial - Razón social de la empresa.
 */
export const INMEX_PLANTAS= {
  planta: "Planta Baja",
  calle: "Av. Paseo de la Reforma",
  numeroExterior: "789",
  numeroInterior: "Suite 15",
  codigoPostal: "06600",
  localidad: "Ciudad de México",
  colonia: "Cuauhtémoc",
  delegacionMunicipio: "Cuauhtémoc",
  entidadFederativa: "Ciudad de México",
  pais: "México",
  registroFederalDeContribuyentes: "LMN456789QRS",
  domicilioDelSolicitante: "Av. Paseo de la Reforma 789, Suite 15, Colonia Cuauhtémoc, Delegación Cuauhtémoc, Ciudad de México, C.P. 06600, México",
  razonSocial: "Tecnologías Innovadoras Ejemplo S.A. de C.V."
};

/**
 * Constante que define los estados predeterminados para un formulario.
 * 
 * Esta constante es un objeto que contiene tres propiedades:
 * - `estadoUno`: Representa el primer estado del formulario, inicialmente vacío.
 * - `estadoDos`: Representa el segundo estado del formulario, inicialmente vacío.
 * - `estadoTres`: Representa el tercer estado del formulario, inicialmente vacío.
 * 
 * Estos estados pueden ser utilizados para inicializar o resetear un formulario
 * en una aplicación Angular.
 */
export const DEFAULT_ESTADOS = {
  estadoUno: '',
  estadoDos: '',
  estadoTres: ''
}

/**
 * Constante que define las opciones predeterminadas para los estados de un formulario.
 * 
 * Esta constante es un objeto que contiene tres propiedades:
 * - `estadoOptionUno`: Representa la primera opción del estado, inicialmente vacío.
 * - `estadoOptionDos`: Representa la segunda opción del estado, inicialmente vacío.
 * - `estadoOptionTres`: Representa la tercera opción del estado, inicialmente vacío.
 * 
 * Estas opciones pueden ser utilizadas para inicializar o resetear un formulario
 * en una aplicación Angular.
 */
export const DEFAULT_ESTADOS_OPTIONS = {
  estadoOptionUno: '',
  estadoOptionDos: '',
  estadoOptionTres: ''
}
/**
 * Constante que define los datos de configuración para los campos de entrada
 * relacionados con federatarios y plantas.
 * 
 * Cada objeto dentro del arreglo `DATOS_FEDERATARIOS` representa un campo con
 * las siguientes propiedades:
 * 
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta que se muestra como nombre del campo.
 * - `campo`: Nombre del atributo asociado al campo.
 * - `clase`: Clase CSS que define el diseño del campo.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, texto, fecha, select, etc.).
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `solo_lectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Arreglo de validadores aplicados al campo, cada validador tiene:
 *   - `tipo`: Tipo de validación (por ejemplo, requerido).
 * - `marcadorDePosicion`: Texto que se muestra como marcador de posición en el campo.
 * - `valorPredeterminado`: Valor inicial del campo.
 * - `margin_top`: Margen superior aplicado al campo (en unidades CSS).
 * - `marginTop`: Alternativa para definir el margen superior (en unidades CSS).
 * - `habilitado`: Indica si el campo está habilitado (opcional).
 */
export const DATOS_FEDERATARIOS = [
  {
    id: 'nombre',
    labelNombre: 'Nombre(s)*',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    solo_lectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {
    id: 'primerApellido',
    labelNombre: 'Primer apellido*',
    campo: 'primerApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    solo_lectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {
    id: 'segundoApellido',
    labelNombre: 'Segundo apellido',
    campo: 'segundoApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    solo_lectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {
    id: 'numeroDeActa',
    labelNombre: 'Número de acta*',
    campo: 'numeroDeActa',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    solo_lectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {

    id: 'fechaDelActa',
    labelNombre: 'Fecha del acta',
    campo: 'fechaDelActa',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: 'numeroDeNotaria',
    labelNombre: 'Número de notaría*',
    campo: 'numeroDeNotaria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    solo_lectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {
    id: 'estado',
    labelNombre: 'Estado*',
    campo: 'estado',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marginTop: 0,
    opciones: []
  },
  {
    id: 'estadoOptions',
    labelNombre: 'Municipio o alcaldía*',
    campo: 'estadoOptions',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    valorPredeterminado: '',
    marginTop: 0,
    opciones: []     
  
  },
  
];

/**
 * Constante `EXPRESAS` que define un arreglo de objetos utilizados para configurar
 * los campos de un formulario. Cada objeto representa un campo con sus propiedades
 * y validaciones específicas.
 * 
 * Propiedades de cada objeto:
 * - `id`: Identificador único del campo.
 * - `labelNombre`: Etiqueta que describe el nombre del campo.
 * - `campo`: Nombre del campo asociado.
 * - `clase`: Clase CSS aplicada al campo para definir su estilo.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, texto, selección, área de texto).
 * - `desactivado`: Indica si el campo está deshabilitado.
 * - `solo_lectura`: Indica si el campo es de solo lectura.
 * - `validadores`: Arreglo de validaciones aplicadas al campo. Cada validador tiene:
 *   - `tipo`: Tipo de validación (por ejemplo, requerido).
 * - `marcadorDePosicion`: Texto de marcador de posición para el campo.
 * - `valorPredeterminado`: Valor inicial del campo.
 * - `margin_top`: Margen superior aplicado al campo.
 * 
 * Ejemplo de uso:
 * Esta constante puede ser utilizada para generar dinámicamente un formulario
 * en una aplicación Angular, donde cada campo se renderiza según las propiedades
 * definidas en este arreglo.
 */
export const EXPRESAS = [
  {
    id: 'taxId',
    labelNombre: 'Tax ID',
    campo: 'taxId',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    solo_lectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {
    id: 'nombreDelEmpresa',
    labelNombre: 'Nombre de la Empresa',
    campo: 'nombreDelEmpresa',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    solo_lectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 3
  },
  {
    id: 'pais',
    labelNombre: 'País',
    campo: 'pais',
    clase: 'col-md-12',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un valor',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'direccion',
    labelNombre: 'Dirección',
    campo: 'direccion',
    clase: 'col-md-12',
    tipoInput: 'textarea',
    desactivado: false,
    solo_lectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    margin_top: 5
  }
];
