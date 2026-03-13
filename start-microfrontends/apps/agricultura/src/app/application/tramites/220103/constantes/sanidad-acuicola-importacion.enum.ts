/**
 * Importaciones de expresiones regulares y utilidades para validaciones de formularios
 * que se utilizan en todo el módulo de sanidad acuícola de importación.
 */
import {
  REGEX_ALFANUMERICO_CON_ESPACIOS,
  REGEX_CORREO_ELECTRONICO,
  REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
  REGEX_PATRON_DECIMAL_15_4,
  REGEX_POSTAL,
  REGEX_TELEFONO,
} from '@libs/shared/data-access-user/src';

/**
 * Importaciones de modelos de datos que definen la estructura de la información
 * utilizada en el trámite de sanidad acuícola de importación.
 */
import {
  DatosDelTerceroDestinatario,
  Instalacion,
  Mercancia,
} from '../modelos/sanidad-acuicola-importacion.model';

/**
 * Constante que define los pasos del proceso de trámite.
 * Cada paso tiene un índice, título y estado (activo y completado).
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
    titulo: 'Requisitos neccesarios',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Mensaje importante que se muestra en el componente para indicar al usuario
 * que las tablas con asterisco son obligatorias y requieren al menos un registro.
 */
export const IMPORTANTE = {
  Importante: `Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.`,
};

/**
 * Configuración de los campos del formulario de datos del trámite.
 * Define la estructura, validaciones y comportamiento de cada campo.
 */
export const CAMPOS_FORMULARIO_DATOS_DEL_TRAMITE = [
  /**
   * Campo para seleccionar la aduana de ingreso.
   * Es un campo obligatorio que utiliza un catálogo de opciones.
   */
  {
    id: 'aduanaDeIngreso',
    labelNombre: 'Aduana de ingreso',
    campo: 'aduanaDeIngreso',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row :1
  },
  /**
   * Campo para seleccionar el medio de transporte.
   * No es obligatorio y utiliza un catálogo de opciones.
   */
  {
    id: 'medioDeTransporte',
    labelNombre: 'Medio de transporte',
    campo: 'medioDeTransporte',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    opciones: [],
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row: 1
  },
  /**
   * Campo para ingresar la identificación del transporte.
   * Permite sólo letras y números mediante validación de expresión regular.
   */
  {
    id: 'identificacionDelTransporte',
    labelNombre: 'Identificación del transporte',
    campo: 'identificacionDelTransporte',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'pattren',
        valor: REGEX_ALFANUMERICO_CON_ESPACIOS,
        mensaje: 'El campo solo acepta letras y números',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row: 1
  },
];

/**
 * Configuración de los campos del formulario de mercancías.
 * Define la estructura, validaciones y comportamiento de cada campo
 * relacionado con las mercancías a importar.
 */
export const CAMPOS_FORMULARIO_MERCANCIAS = [
  /**
   * Campo para la descripción de la mercancía.
   * Es obligatorio y valida que no tenga espacios al inicio ni al final.
   */
  {
    id: 'descripcion',
    labelNombre: 'Descripción',
    campo: 'descripcion',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija la descripción',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row: 1
  },
  /**
   * Campo para la fracción arancelaria.
   * No tiene validadores específicos.
   */
  {
    id: 'fraccionArancelaria',
    labelNombre: 'Fracción arancelaria',
    campo: 'fraccionArancelaria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row: 2
  },
  /**
   * Campo para la descripción de la fracción.
   * Es un campo desactivado (se llena automáticamente).
   */
  {
    id: 'descripcionFraccion',
    labelNombre: 'Descripción de la fracción',
    campo: 'descripcionFraccion',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row:2,
    tooltipQuestionCircle: true,
  },
  /**
   * Campo para la cantidad en UMT (Unidad de Medida de Tarifa).
   * Valida formato decimal con hasta 15 dígitos enteros y 4 decimales.
   */
  {
    id: 'cantidadUMT',
    labelNombre: 'Cantidad UMT',
    campo: 'cantidadUMT',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'pattern',
        valor: REGEX_PATRON_DECIMAL_15_4,
        mensaje:
          'El valor debe ser un número con hasta 15 dígitos enteros y hasta 4 dígitos decimales.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row :3
  },
  /**
   * Campo para la unidad de medida UMT.
   * Es un campo desactivado (se llena automáticamente).
   */
  {
    id: 'umt',
    labelNombre: 'UMT',
    campo: 'umt',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row:3,
    tooltipQuestionCircle: true
  },
  /**
   * Campo para la cantidad en UMC (Unidad de Medida Comercial).
   * No tiene validadores específicos.
   */
  {
    id: 'cantidadUMC',
    labelNombre: 'Cantidad UMC',
    campo: 'cantidadUMC',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row :4
  },
  /**
   * Campo para seleccionar la unidad de medida UMC.
   * Utiliza un catálogo de opciones.
   */
  {
    id: 'umc',
    labelNombre: 'UMC',
    campo: 'umc',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    opciones: [],
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row: 4,
    tooltipQuestionCircle: true
  },
  /**
   * Campo para el nombre común de la mercancía.
   * Es obligatorio y valida que no tenga espacios al inicio ni al final.
   */
  {
    id: 'nombreComun',
    labelNombre: 'Nombre común',
    campo: 'nombreComun',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el nombre común',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row:5
  },
  /**
   * Campo para el nombre científico de la mercancía.
   * Es obligatorio y valida que no tenga espacios al inicio ni al final.
   */
  {
    id: 'nombreCientifico',
    labelNombre: 'Nombre científico',
    campo: 'nombreCientifico',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el nombre científico',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row:5
  },
  /**
   * Campo para la fase de desarrollo de la mercancía.
   * No tiene validadores específicos.
   */
  {
    id: 'faseDesarrollo',
    labelNombre: 'Fase de desarrollo',
    campo: 'faseDesarrollo',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row:6
  },
  /**
   * Campo para seleccionar el uso de la mercancía.
   * Utiliza un catálogo de opciones.
   */
  {
    id: 'uso',
    labelNombre: 'Uso',
    campo: 'uso',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    opciones: [],
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row:7
  },
  /**
   * Campo para especificar otro uso cuando no está en las opciones predefinidas.
   * Solo se muestra cuando se selecciona "Otro" en el campo de uso.
   */
  {
    id: 'otroUso',
    labelNombre: 'Otro uso',
    campo: 'otroUso',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: false,
    habilitado: true,
    row:7
  },
  /**
   * Campo para seleccionar el origen de la mercancía.
   * Utiliza un catálogo de opciones.
   */
  {
    id: 'origen',
    labelNombre: 'Origen',
    campo: 'origen',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    opciones: [],
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row:8
  },

  /**
   * Campo para seleccionar el país de origen de la mercancía.
   * Es obligatorio y utiliza un catálogo de países.
   */
  {
    id: 'paisOrigen',
    labelNombre: 'País de origen',
    campo: 'paisOrigen',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row: 9
  },
  /**
   * Campo para seleccionar el país de procedencia de la mercancía.
   * Es obligatorio y utiliza un catálogo de países.
   */
  {
    id: 'paisProcedencia',
    labelNombre: 'País de procedencia',
    campo: 'paisProcedencia',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row: 9
  },
];

/**
 * Configuración de los campos del formulario de datos de instalación.
 * Define la estructura, validaciones y comportamiento de cada campo
 * relacionado con las instalaciones.
 */
export const CAMPOS_FORMULARIO_DATOS_DE_INSTALACION = [
  /**
   * Campo para el número de establecimiento aprobado o autorizado.
   * No tiene validadores específicos.
   */
  {
    id: 'numeroEstablecimiento',
    labelNombre: 'Número de establecimiento aprobado o autorizado',
    campo: 'numeroEstablecimiento',
    clase: 'col-md-8',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true,
    habilitado: true,
    row:1
  },
  /**
   * Campo para las coordenadas geográficas de la instalación.
   * No tiene validadores específicos.
   */
  {
    id: 'coordenadasGeograficas',
    labelNombre: 'Coordenadas geográficas',
    campo: 'coordenadasGeograficas',
    clase: 'col-md-8',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    mostrar: true,
    habilitado: true,
    row:2
  },
];

/**
 * Configuración de los campos del formulario para agregar destinatarios.
 * Define la estructura, validaciones y comportamiento de cada campo
 * relacionado con los datos personales del destinatario.
 */
export const CAMPOS_FORMULARIO_DATOS_PERSONALES_AGREGAR_DESTINATARIO = [
  /**
   * Campo para el nombre del destinatario.
   * Es obligatorio cuando se trata de persona física y valida espacios.
   */
  {
    id: 'nombre',
    labelNombre: 'Nombre(s)',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el nombre.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row:1
  },
  /**
   * Campo para el primer apellido del destinatario.
   * Es obligatorio cuando se trata de persona física y valida espacios.
   */
  {
    id: 'primerApellido',
    labelNombre: 'primer apellido',
    campo: 'primerApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el primer apellido.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row:1
  },
  /**
   * Campo para el segundo apellido del destinatario.
   * No es obligatorio pero valida espacios.
   */
  {
    id: 'segundoApellido',
    labelNombre: 'Segundo apellido',
    campo: 'segundoApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el segundo apellido.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row:1
  },
  /**
   * Campo para la razón social del destinatario.
   * Es obligatorio cuando se trata de persona moral y valida espacios.
   */
  {
    id: 'razonSocial',
    labelNombre: 'Denominación/razón social',
    campo: 'razonSocial',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija la denominación/razón social.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row:1
  },
  /**
   * Campo para el país del destinatario.
   * Es obligatorio y está preestablecido como México.
   */
  {
    id: 'pais',
    labelNombre: 'País',
    campo: 'pais',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    opciones: [{ id: '1', descripcion: 'MEXICO(ESTADOS UNIDOS MEXICANOS)' }],
    marcadorDePosicion: '',
    valorPredeterminado: '1',
    marginTop: 0,
    row: 2
  },
  /**
   * Campo para el código postal del destinatario.
   * Valida el formato de código postal mexicano (5 números).
   */
  {
    id: 'codigoPostal',
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'pattern',
        valor: REGEX_POSTAL,
        mensaje: 'Debe contener sólo 5 números.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 2
  },
  /**
   * Campo para el estado del destinatario.
   * Es obligatorio y está preestablecido como Veracruz.
   */
  {
    id: 'estado',
    labelNombre: 'Estado',
    campo: 'estado',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    opciones: [{ id: '1', descripcion: 'VERACRUZ' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 2
  },
  /**
   * Campo para el municipio o alcaldía del destinatario.
   * Está preestablecido como Alvarado.
   */
  {
    id: 'municipioAlcaldia',
    labelNombre: 'Municipio o Alcaldía',
    campo: 'municipioAlcaldia',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    opciones: [{ id: '1', descripcion: 'ALVARADO' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 3
  },
  /**
   * Campo para la colonia del destinatario.
   * Las opciones se cargan dinámicamente.
   */
  {
    id: 'colonia',
    labelNombre: 'Colonia',
    campo: 'colonia',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 3
  },
  /**
   * Campo para la calle del destinatario.
   * Es obligatorio y valida espacios.
   */
  {
    id: 'calle',
    labelNombre: 'Calle',
    campo: 'calle',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija la calle.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 3
  },
  /**
   * Campo para el número exterior del destinatario.
   * Es obligatorio.
   */
  {
    id: 'numeroExterior',
    labelNombre: 'Número exterior',
    campo: 'numeroExterior',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 4
  },
  /**
   * Campo para el número interior del destinatario.
   * No es obligatorio.
   */
  {
    id: 'numeroInterior',
    labelNombre: 'Número interior',
    campo: 'numeroInterior',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 4
  },
  /**
   * Campo para la lada telefónica del destinatario.
   * No es obligatorio.
   */
  {
    id: 'lada',
    labelNombre: 'Lada',
    campo: 'lada',
    clase: 'col-md-1',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 5
  },
  /**
   * Campo para el teléfono del destinatario.
   * Es obligatorio y valida el formato de teléfono.
   */
  {
    id: 'telefono',
    labelNombre: 'Teléfono',
    campo: 'telefono',
    clase: 'col-md-3',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_TELEFONO,
        mensaje: 'Por favor, corrija el teléfono.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 5
  },
  /**
   * Campo para el correo electrónico del destinatario.
   * Es obligatorio y valida el formato de correo electrónico.
   */
  {
    id: 'correoElectronico',
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    clase: 'col-md-4',tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_CORREO_ELECTRONICO,
        mensaje: 'Por favor, escriba una dirección de correo válida.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row: 5,
    tooltipQuestionCircle: true
  },
];

/**
 * Configuración de los campos del formulario para agregar instalaciones.
 * Define la estructura, validaciones y comportamiento de cada campo
 * relacionado con los datos personales de la instalación de procedencia.
 */
export const CAMPOS_FORMULARIO_DATOS_PERSONALES_AGREGAR_INSTALACI = [
  /**
   * Campo para el nombre de la persona responsable de la instalación.
   * Es obligatorio cuando se trata de persona física y valida espacios.
   */
  {
    id: 'nombre',
    labelNombre: 'Nombre(s)',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el nombre.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 1
  },
  /**
   * Campo para el primer apellido de la persona responsable de la instalación.
   * Es obligatorio cuando se trata de persona física y valida espacios.
   */
  {
    id: 'primerApellido',
    labelNombre: 'primer apellido',
    campo: 'primerApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el primer apellido.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 1
  },
  /**
   * Campo para el segundo apellido de la persona responsable de la instalación.
   * No es obligatorio pero valida espacios.
   */
  {
    id: 'segundoApellido',
    labelNombre: 'Segundo apellido',
    campo: 'segundoApellido',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el segundo apellido.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 1
  },
  /**
   * Campo para la razón social de la instalación.
   * Es obligatorio cuando se trata de persona moral y valida espacios.
   */
  {
    id: 'razonSocial',
    labelNombre: 'Denominación/razón social',
    campo: 'razonSocial',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija la denominación/razón social.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 1
  },

  /**
   * Campo para el país de la instalación.
   * Es obligatorio y está preestablecido como México.
   */
  {
    id: 'pais',
    labelNombre: 'País',
    campo: 'pais',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    opciones: [{ id: '1', descripcion: 'MEXICO(ESTADOS UNIDOS MEXICANOS)' }],
    marcadorDePosicion: '',
    valorPredeterminado: '1',
    marginTop: 0,
    row: 2
  },
  /**
   * Campo para el domicilio completo de la instalación.
   * Es obligatorio y valida espacios. Permite ingresar toda la dirección en un solo campo.
   */
  {
    id: 'domicillio',
    labelNombre: 'Domicillio',
    campo: 'domicillio',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_NO_ESPACIOS_AL_INICIO_NI_AL_FINAL,
        mensaje: 'Por favor, corrija el domicilio.',
      },
    ],
    marcadorDePosicion: 'Calle, No Ext, No Int, Ciudad, C.P.',
    valorPredeterminado: '',
    marginTop: 2,
    row: 3
  },
  /**
   * Campo para la lada telefónica de la instalación.
   * No es obligatorio.
   */
  {
    id: 'lada',
    labelNombre: 'Lada',
    campo: 'lada',
    clase: 'col-md-2',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row:4
  },
  /**
   * Campo para el teléfono de la instalación.
   * Es obligatorio y valida el formato de teléfono.
   */
  {
    id: 'telefono',
    labelNombre: 'Teléfono',
    campo: 'telefono',
    clase: 'col-md-3',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_TELEFONO,
        mensaje: 'Por favor, corrija el teléfono.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    row:4
  },
  /**
   * Campo para el correo electrónico de la instalación.
   * Es obligatorio y valida el formato de correo electrónico.
   */
  {
    id: 'correoElectronico',
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' },
      {
        tipo: 'pattern',
        valor: REGEX_CORREO_ELECTRONICO,
        mensaje: 'Por favor, escriba una dirección de correo válida.',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 2,
    tooltipQuestionCircle: true,
    row:4
  },
];

/**
 * Arreglo vacío para configuración de datos de propietario.
 * Parece ser un placeholder para una futura implementación.
 */
export const FORMULARIO_DATOS_PROPIETARIO_NOMBRE = [];

/**
 * Configuración de columnas para la tabla de mercancías.
 * Define la estructura y función de mapeo para cada columna de la tabla.
 */
export const CONFIGURACION_MERCANCIAS = [
  /**
   * Columna para mostrar la fracción arancelaria de la mercancía.
   */
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: Mercancia): string => ele.fraccionArancelaria,
    orden: 1,
  },
  /**
   * Columna para mostrar la descripción de la fracción arancelaria.
   */
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: Mercancia): string => ele.descripcionFraccion,
    orden: 2,
  },
  /**
   * Columna para mostrar la descripción de la mercancía.
   */
  {
    encabezado: 'Descripción de la mercancía',
    clave: (ele: Mercancia): string => ele.descripcion,
    orden: 3,
  },
  /**
   * Columna para mostrar la cantidad en UMT de la mercancía.
   */
  {
    encabezado: 'Cantidad en UMT',
    clave: (ele: Mercancia): string => ele.cantidadUMT,
    orden: 4,
  },
  /**
   * Columna para mostrar la unidad de medida UMT de la mercancía.
   */
  {
    encabezado: 'Unidad de medida (UMT)',
    clave: (ele: Mercancia): string => ele.umt,
    orden: 5,
  },
  /**
   * Columna para mostrar la cantidad en UMC de la mercancía.
   */
  {
    encabezado: 'Cantidad en UMC',
    clave: (ele: Mercancia): string => ele.cantidadUMC,
    orden: 6,
  },
  /**
   * Columna para mostrar la unidad de medida UMC de la mercancía.
   */
  {
    encabezado: 'Unidad de medida (UMC)',
    clave: (ele: Mercancia): string => ele.umc,
    orden: 7,
  },
  /**
   * Columna para mostrar el nombre común de la mercancía.
   */
  {
    encabezado: 'Nombre común',
    clave: (ele: Mercancia): string => ele.nombreComun,
    orden: 8,
  },
  /**
   * Columna para mostrar el nombre científico de la mercancía.
   */
  {
    encabezado: 'Nombre científico',
    clave: (ele: Mercancia): string => ele.nombreCientifico,
    orden: 9,
  },
  /**
   * Columna para mostrar la fase de desarrollo de la mercancía.
   */
  {
    encabezado: 'Fase de desarrollo',
    clave: (ele: Mercancia): string => ele.faseDesarrollo,
    orden: 10,
  },
  /**
   * Columna para mostrar el uso de la mercancía.
   */
  {
    encabezado: 'Uso',
    clave: (ele: Mercancia): string => ele.uso,
    orden: 11,
  },
  /**
   * Columna para mostrar otro uso de la mercancía cuando aplica.
   */
  {
    encabezado: 'Otro uso',
    clave: (ele: Mercancia): string => ele.otroUso,
    orden: 12,
  },
  /**
   * Columna para mostrar el origen de la mercancía.
   */
  {
    encabezado: 'Origen',
    clave: (ele: Mercancia): string => ele.origen,
    orden: 13,
  },
  /**
   * Columna para mostrar el país de origen de la mercancía.
   */
  {
    encabezado: 'País de origen',
    clave: (ele: Mercancia): string => ele.paisOrigen,
    orden: 14,
  },
  /**
   * Columna para mostrar el país de procedencia de la mercancía.
   */
  {
    encabezado: 'País de procedencia',
    clave: (ele: Mercancia): string => ele.paisProcedencia,
    orden: 15,
  },
];

/**
 * Opciones para el selector de tipo de persona.
 * Define las opciones disponibles: Física y Moral.
 */
export const TIPO_PERSONA = [
  {
    label: 'Física',
    value: 'Fisica',
  },
  {
    label: 'Moral',
    value: 'Moral',
  },
];

/**
 * Configuración de columnas para la tabla de contactos (destinatarios).
 * Define la estructura y función de mapeo para cada columna de la tabla.
 */
export const CONFIGURACION_CONTACTO = [
  /**
   * Columna para mostrar el nombre o razón social del destinatario.
   * Usa lógica condicional para mostrar nombre+apellidos o razón social según corresponda.
   */
  {
    encabezado: 'Nombre/denominaciC o razón social',
    clave: (ele: DatosDelTerceroDestinatario): string =>
      ele.nombre
        ? `${ele.nombre} ${ele.primerApellido} ${ele.segundoApellido}`
        : ele.razonSocial,
    orden: 1,
  },
  /**
   * Columna para mostrar el teléfono del destinatario.
   */
  {
    encabezado: 'Teléfono',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.telefono,
    orden: 2,
  },
  /**
   * Columna para mostrar el correo electrónico del destinatario.
   */
  {
    encabezado: 'Correo electrónico',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.correoElectronico,
    orden: 3,
  },
  /**
   * Columna para mostrar la calle del destinatario.
   */
  {
    encabezado: 'Calle',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.calle,
    orden: 4,
  },
  /**
   * Columna para mostrar el número exterior del destinatario.
   */
  {
    encabezado: 'Número exterior',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.numeroExterior,
    orden: 5,
  },
  /**
   * Columna para mostrar el número interior del destinatario.
   */
  {
    encabezado: 'Número interior',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.numeroInterior,
    orden: 6,
  },
  /**
   * Columna para mostrar el país del destinatario.
   */
  {
    encabezado: 'País',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.pais,
    orden: 7,
  },
  /**
   * Columna para mostrar el estado del destinatario.
   */
  {
    encabezado: 'Estado',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.estado,
    orden: 8,
  },
  /**
   * Columna para mostrar el municipio o alcaldía del destinatario.
   */
  {
    encabezado: 'Municipio o Alcaldía',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.municipioAlcaldia,
    orden: 9,
  },
  /**
   * Columna para mostrar la colonia del destinatario.
   */
  {
    encabezado: 'Colonia',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.colonia,
    orden: 10,
  },
  /**
   * Columna para mostrar la lada telefónica del destinatario.
   */
  {
    encabezado: 'Lada',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.lada,
    orden: 11,
  },
  /**
   * Columna para mostrar el código postal del destinatario.
   */
  {
    encabezado: 'Código postal',
    clave: (ele: DatosDelTerceroDestinatario): string => ele.codigoPostal,
    orden: 12,
  },
];

/**
 * Configuración para la tabla de instalaciones.
 * Define la estructura y el comportamiento de cómo se muestran los datos de instalaciones.
 */
export const CONFIGURACION_TABLA_INSTALACION = [
  /**
   * Columna que muestra el nombre de la instalación o razón social.
   * Usa lógica condicional para mostrar el nombre de persona o razón social según corresponda.
   */
  {
    /** Columna que muestra el nombre de la instalación o razón social */
    encabezado: 'Nombre de la instalación',
    clave: (ele: Instalacion): string => {
      // Si existe razón social, usarla; si no, usar nombre de persona
      if (ele.razonSocial && ele.razonSocial.trim()) {
        return ele.razonSocial;
      } 
        // Concatenar nombre y apellidos para personas físicas
        let nombreCompleto = ele.nombre || '';
        if (ele.primerApellido) {
          nombreCompleto += ' ' + ele.primerApellido;
        }
        if (ele.segundoApellido) {
          nombreCompleto += ' ' + ele.segundoApellido;
        }
        return nombreCompleto.trim();
      
    },
    orden: 1,
  },
  /**
   * Columna que muestra la dirección completa de la instalación.
   * Usa lógica condicional para mostrar el domicilio completo o construirlo a partir de componentes.
   */
  {
    /** Columna que muestra la dirección completa de la instalación */
    encabezado: 'Dirección',
    clave: (ele: Instalacion): string => {
      // Si existe domicilio completo, usarlo; si no, construirlo con componentes
      if (ele.domicillio) {
        return ele.domicillio;
      } 
        /** Construir dirección concatenando sus partes */
        let direccion = '';
        if (ele.calle) {
          direccion += ele.calle;
        }
        if (ele.numeroExterior) {
          direccion += ' #' + ele.numeroExterior;
        }
        if (ele.numeroInterior) {
          direccion += '-' + ele.numeroInterior;
        }
        if (ele.colonia) {
          direccion += ', ' + ele.colonia;
        }
        if (ele.municipio) {
          direccion += ', ' + ele.municipio;
        }
        if (ele.estado) {
          direccion += ', ' + ele.estado;
        }
        if (ele.codigoPostal) {
          direccion += ', C.P. ' + ele.codigoPostal;
        }
        return direccion.trim();
      
    },
    orden: 2,
  },
  /**
   * Columna que muestra el teléfono con formato (lada) número.
   * Formatea el número telefónico con la lada si está disponible.
   */
  {
    /** Columna que muestra el teléfono con formato (lada) número */
    encabezado: 'Teléfono',
    clave: (ele: Instalacion): string => {
      // Formatear número telefónico con lada si está disponible
      if (ele.lada && ele.telefono) {
        return `(${ele.lada}) ${ele.telefono}`;
      }
      return ele.telefono || '';
    },
    orden: 3,
  },
  /**
   * Columna que muestra el correo electrónico de contacto de la instalación.
   */
  {
    /** Columna que muestra el correo electrónico de contacto */
    encabezado: 'Correo electrónico',
    clave: (ele: Instalacion): string => ele.correoElectronico || '',
    orden: 4,
  },
  /**
   * Columna que muestra el país donde se encuentra la instalación.
   */
  {
    /** Columna que muestra el país donde se encuentra la instalación */
    encabezado: 'País',
    clave: (ele: Instalacion): string => ele.pais || '',
    orden: 5,
  },
];