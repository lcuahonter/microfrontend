/**
 * Título que se mostrará en el modal de aviso.
 */
export const TITULO_MODAL = 'Aviso';

/**
 * Mensaje que se mostrará en el modal, preguntando por la existencia de un documento
 * que acredite la autorización y vigencia del esquema de certificación.
 */
export const MENSAJE_MODAL = '¿Cuenta con algún documento que acredite la autorización y A vigencia de su esquema de certificación?';


/**
 * Campos del formulario para los detalles de certificación.
 */
export const FORMULARIO_CERTIFICACION_DETALLES = [
  {
    // Indica si se cuenta con certificación
    id: 'tieneCertificacion',
    labelNombre: '',
    campo: 'tieneCertificacion',
    clase: 'col-md-1',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop:0
  },
  {
    // Nombre de la empresa certificadora
    id: 'certificacionEmpresa',
    labelNombre: '',
    campo: 'certificacionEmpresa',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'Orto',
    marginTop: 0
  },
  {
    // Campo para especificar otra certificación
    id: 'otraCertificacion',
    labelNombre: 'Especifique otra certificación',
    campo: 'otraCertificacion',
    clase: 'col-md-7',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
      validadores: [
        { tipo: '', mensaje: 'Este campo es obligatorio.' },
        { tipo: 'pattern', valor: /^[a-zA-Z0-9\s]+$/, mensaje: 'Por favor, ingresa caracteres alfanuméricos' }
      ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  }
]

/**
 * Campos del formulario para los detalles generales del trámite.
 */
export const FORMULARIO_DETALLES = [
  {
    // Aduana seleccionada
    id: 'aduana',
    labelNombre: 'Aduana',
    campo: 'aduana',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    // Sección aduanera correspondiente
    id: 'seccionAduanera',
    labelNombre: 'Sección Aduanera',
    campo: 'seccionAduanera',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    // Tipo de operación a realizar
    id: 'tipoOperacion',
    labelNombre: 'Tipo de operación',
    campo: 'tipoOperacion',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    // Fecha en la que se realiza la operación
    id: 'fechaOperacion',
    labelNombre: 'Fecha de operación',
    campo: 'fechaOperacion',
    clase: 'col-md-6',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true,
    mostrar: false
  },
  {
   id: 'emptyColumn',
    labelNombre: '',
    campo: 'emptyColumn',
    clase: 'col-md-6',
    tipoInput: '',
    desactivado: true,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: false,
  },
  {
    // Fecha de inicio para operaciones por periodo
    id: 'fechaInicio',
    labelNombre: 'Inicio',
    campo: 'fechaInicio',
    clase: 'col-md-3',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true,
    mostrar: false
  },
  {
    // Fecha de fin para operaciones por periodo
    id: 'fechaFin',
    labelNombre: 'Fin',
    campo: 'fechaFin',
    clase: 'col-md-3',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true,
    mostrar: false
  },
  {
    // Título para días de la semana
    id: 'tituloSemana',
    labelNombre: '* Días de la semana en los que presentarán los pedimentos al módulo',
    campo: 'tituloSemana', 
    clase: 'col-md-12 mt-3',
    tipoInput: 'label-only',
    desactivado: false,
    soloLectura: true,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 15,
    mostrar: false
  },
  {
    // Días de la semana - Lunes
    id: 'lunes',
    labelNombre: 'Lunes',
    campo: 'lunes',
    clase: 'col-md-2',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Días de la semana - Martes
    id: 'martes',
    labelNombre: 'Martes',
    campo: 'martes',
    clase: 'col-md-2',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Días de la semana - Miércoles
    id: 'miercoles',
    labelNombre: 'Miércoles',
    campo: 'miercoles',
    clase: 'col-md-2',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Días de la semana - Jueves
    id: 'jueves',
    labelNombre: 'Jueves',
    campo: 'jueves',
    clase: 'col-md-2',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Días de la semana - Viernes
    id: 'viernes',
    labelNombre: 'Viernes',
    campo: 'viernes',
    clase: 'col-md-2',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Días de la semana - Sábado
    id: 'sabado',
    labelNombre: 'Sábado',
    campo: 'sabado',
    clase: 'col-md-2',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Días de la semana - Domingo  
    id: 'domingo',
    labelNombre: 'Domingo',
    campo: 'domingo',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: false,
    marginTop: 0,
    mostrar: false
  },
  {
    // Motivo o justificación para el despacho a domicilio
    id: 'motivoDespachoDomicilio',
    labelNombre: 'Motivo o justificación de despacho a domicilio',
    campo: 'motivoDespachoDomicilio',
    clase: 'col-md-6',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 4000, mensaje: 'Por favor, no escriba más de 4000 caracteres.' }],
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    // Observaciones adicionales
    id: 'observaciones',
    labelNombre: 'Observaciones',
    campo: 'observaciones',
    clase: 'col-md-6',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'customMaxlength', valor: 4000, mensaje: 'Por favor, no escriba más de 4000 caracteres.' }],
    valorPredeterminado: '',
    marginTop: 0
  }       
]

/**
 * Campos del formulario para los detalles de la mercancía.
 */
export const MERCANCIA_DETALLES = [
  {
    // Valor de la mercancía
    id: 'valorMercancia',
    labelNombre: 'Valor de la mercancía',
    campo: 'valorMercancia',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true
  },
  {
    // Tipo de moneda utilizada
    id: 'tipoMoneda',
    labelNombre: 'Tipo de moneda',
    campo: 'tipoMoneda',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true
  },
  {
    // Nombre o descripción comercial de la mercancía
    id: 'descripcionMercancia',
    labelNombre: 'Nombre o descripción comercial de la mercancía',
    campo: 'descripcionMercancia',
    clase: 'col-md-6',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'customMaxlength', valor: 500, mensaje: 'Por favor, no escriba más de 500 caracteres.' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true
  },
  {
    // Descripción detallada y/o especificaciones técnicas de la mercancía
    id: 'especificacionesMercancia',
    labelNombre: 'Descripción detallada y/o especificaciones técnicas de la mercancía',
    campo: 'especificacionesMercancia',
    clase: 'col-md-6',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'customMaxlength', valor: 4000, mensaje: 'Por favor, no escriba más de 4000 caracteres.' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    mostrar: true
  }
];
  
  /**
   * Campos del formulario para la logística y operaciones.
   */
  export const FORMULARIO_LOGISTICA_OPERACIONES = [
    {
      // Esquemas de control y seguridad de las operaciones
      id: 'esquemasControlSeguridad',
      labelNombre: 'Señale los esquemas de control y seguridad de las operaciones',
      campo: 'esquemasControlSeguridad',
      clase: 'col-md-6',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 4000, mensaje: 'Por favor, no escriba más de 4000 caracteres.' }],
      valorPredeterminado: '',
      marginTop: 0,
      habilitado: true
    },
    {
      // Distancia, ruta y tiempos de las operaciones
      id: 'distanciaRutaTiempos',
      labelNombre: 'Indique distancia, ruta y tiempos de las operaciones',
      campo: 'distanciaRutaTiempos',
      clase: 'col-md-6',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 4000, mensaje: 'Por favor, no escriba más de 4000 caracteres.' }],
      valorPredeterminado: '',
      marginTop: 0,
      habilitado: true
    }
  ];

  /**
   * Campos del formulario para la ubicación de la mercancía.
   */
  export const UBICACION_MERCANCIA = [
    {
      // Dirección donde se encuentra la mercancía
      id: 'direccion',
      labelNombre: 'Dirección',
      campo: 'direccion',
      clase: 'col-md-12',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 822, mensaje: 'Por favor, no escriba más de 822 caracteres.' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
      habilitado: true
    },
    {
      // Teléfono de contacto en la ubicación de la mercancía
      id: 'telefono',
      labelNombre: 'Teléfono',
      campo: 'telefono',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 30, mensaje: 'Por favor, no escriba más de 30 caracteres.' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
      habilitado: true
    },
    {
      // Distancia de la ubicación de la mercancía a la aduana (en kilómetros)
      id: 'distanciaAduana',
      labelNombre: 'Distancia a la aduana (km)',
      campo: 'distanciaAduana',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 40, mensaje: 'Por favor, no escriba más de 40 caracteres.' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
      habilitado: true
    },
    {
      // Referencias adicionales para localizar la mercancía
      id: 'referencias',
      labelNombre: 'Referencias',
      campo: 'referencias',
      clase: 'col-md-12',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [{ tipo: 'required' }, { tipo: 'customMaxlength', valor: 500, mensaje: 'Por favor, no escriba más de 500 caracteres.' }],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0,
      habilitado: true
    }
  ];
  
  