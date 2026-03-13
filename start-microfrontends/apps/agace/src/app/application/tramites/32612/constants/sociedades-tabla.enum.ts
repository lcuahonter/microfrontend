/**
 * @constant CONFIGURACION_SOCIEDADES
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_SOCIEDADES = [
    {
      id: 'resigtro',
      row: 1,
      labelNombre: 'RFC',
      campo: 'resigtro',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required'
        }
      ],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0
    },
    {
      id: 'consultarIDC',
      row: 1,
      labelNombre: 'Buscar',
      campo: 'buscar',
      clase: 'col-md-8',
      tipoInput: 'button',
      desactivado: false,
      marginTop: 5,
    },
    {
      id: 'rfc',
      row: 2,
      labelNombre: 'RFC',
      campo: 'rfc',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores:[
        {
          tipo: 'required'
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'denominacion',
      row: 3,
      labelNombre: 'Denominación o razón social',
      campo: 'denominacion',
      clase: 'col-md-12',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        { tipo: 'required' }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'aduanaEnLaQueActua',
      row: 4,
      labelNombre: 'Aduana en la que actua',
      campo: 'aduanaEnLaQueActua',
      clase: 'col-md-5',
      tipoInput: 'select-catalogos',
      desactivado: false,
      soloLectura: false,
      validadores: [
        { tipo: '' }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'fiscales',
      row: 5,
      labelNombre: 'Se encuentra al corriente en el cumplimiento de sus obligaciones fiscales',
      campo: 'fiscales',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginBottom: 5,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    }
];

/**
 * @constant CONFIGURACION_AGREGAR
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_AGREGAR = [
    {
      id: 'rfcDelAgente',
      row: 1,
      labelNombre: 'RFC del Agente o Sociedad',
      campo: 'rfcDelAgente',
      clase: 'col-md-6',
      tipoInput: 'select-catalogos',
      desactivado: false,
      soloLectura: false,
      validadores: [
        { tipo: '' }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'entidadFederativa',
      row: 1,
      labelNombre: 'Entidad federativa',
      campo: 'entidadFederativa',
      clase: 'col-md-6',
      tipoInput: 'select-catalogos',
      desactivado: false,
      soloLectura: false,
      validadores: [
        { tipo: '' }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    }
]

/**
 * @constant CONFIGURACION_IDIQUESI
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_IDIQUESI = [
    {
      id: 'indiqueSi',
      row: 5,
      labelNombre: 'Indique si ha promovido por cuenta ajena el despacho de mercancías en los 2 años anteriores a aquél en que solicita el Registro del Esquema de Certificación de Empresas modalidad de Socio Comercial Certificado rubro Agente Aduanal.',
      campo: 'indiqueSi',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginBottom: 5,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    }
]

/**
 * @constant MANDATARIOS_DEL_AGENT
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const MANDATARIOS_DEL_AGENT = [
    {
      id: 'rfcRegistro',
      row: 1,
      labelNombre: 'RFC',
      campo: 'rfcRegistro',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        {
          tipo: 'required'
        }
      ],
      marcadorDePosicion: '',
      valorPredeterminado: '',
      marginTop: 0
    },
    {
      id: 'consultarIDC',
      row: 1,
      labelNombre: 'Buscar',
      campo: 'buscar',
      clase: 'col-md-8',
      tipoInput: 'button',
      desactivado: false,
      marginTop: 5,
    },
    {
      id: 'rfc',
      row: 2,
      labelNombre: 'RFC',
      campo: 'rfc',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores:[
        {
          tipo: 'required'
        }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'razonSocial',
      row: 3,
      labelNombre: 'Denominación o razón social',
      campo: 'razonSocial',
      clase: 'col-md-12',
      tipoInput: 'text',
      desactivado: true,
      soloLectura: false,
      validadores: [
        { tipo: 'required' }
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'fiscales',
      row: 5,
      labelNombre: 'Se encuentra al corriente en el cumplimiento de sus obligaciones fiscales',
      campo: 'fiscales',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginBottom: 5,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    }
];

/**
 * @constant CONFIGURACION_MODIFICAR
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_MODIFICAR = [
    {
      id: 'instalacionesPrincipales',
      row: 1,
      labelNombre: 'Instalaciones principales',
      campo: 'instalacionesPrincipales',
      clase: 'col-md-6',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 3,
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    },
    {
      id: 'municipio',
      row: 1,
      labelNombre: 'Municipio o alcaldía',
      campo: 'municipio',
      clase: 'col-md-6',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores:[
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'tipoInstalacion',
      row: 2,
      labelNombre: 'Tipo de instalación',
      campo: 'tipoInstalacion',
      clase: 'col-md-4',
      tipoInput: 'select-catalogos',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'entidadFederativa',
      row: 2,
      labelNombre: 'Entidad federativa',
      campo: 'entidadFederativa',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'registroAnteSAT',
      row: 2,
      labelNombre: 'Registro ante el SAT',
      campo: 'registroAnteSAT',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'colonia',
      row: 3,
      labelNombre: 'Colonia, calle y número',
      campo: 'colonia',
      clase: 'col-md-8',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'codigoPostal',
      row: 3,
      labelNombre: 'Código postal',
      campo: 'codigoPostal',
      clase: 'col-md-4',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3
    },
    {
      id: 'correoInstalacion',
      row: 4,
      labelNombre: 'Corresponde a una instalación asociada a la aduana de adscripción, o alguna de las aduanas adicionales de la patente.',
      campo: 'correoInstalacion',
      clase: 'col-md-4',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3,
      layout: 'horizontal',
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    },
    {
      id: 'actualizarPerfil',
      row: 4,
      labelNombre: 'Actualizar perfil',
      campo: 'actualizarPerfil',
      clase: 'col-md-4',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
      ],
      marcadorDePosicion: '',
      marginTop: 3,
      layout: 'horizontal',
      opciones: [
          {
          "label": "Si",
          "value": "Si"
         },
          {
          "label": "No",
          "value": "No"
         }
      ]
    }
]