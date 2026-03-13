/**
 * @constant CONFIGURACION_SELLOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_SELLOS = [
    {
      id: 'aduanalCuenta',
      row: 1,
      labelNombre: 'Indique si el Agente Aduanal cuenta con unidades de transporte, contenedores y/o remolques propios o de un tercero.',
      campo: 'aduanalCuenta',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
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
      id: 'procedimientoDocumentado',
      row: 2,
      labelNombre: 'Indique si cuenta con un procedimiento documentado para la colocación y revisión de los sellos y/o candados en los vehículos, medios de transporte, contenedores, carros de tren, remolques y/o semirremolques.',
      campo: 'procedimientoDocumentado',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
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
 * @constant CONFIGURACION_PROCEDIMIENTO
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_PROCEDIMIENTO = [
  {
    id: 'documentado',
    row: 1,
    labelNombre: 'Indique si cuenta con un procedimiento documentado para el control y manejo de los candados.',
    campo: 'documentado ',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 4,
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
 * @constant CONFIGURACION_ANEXE_PROCEDIMIENTO
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ANEXE_PROCEDIMIENTO = [
    {
        id: 'paraElCaso',
        row: 1,
        labelNombre: 'Para el caso de sellos y/o candados extraviados o robados describa el procedimiento que sigue el Agente Aduanal.',
        campo: 'paraElCaso',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'indiqueQuien',
        row: 2,
        labelNombre: 'Indique quien es el proveedor(es) y cómo se comprueba que las especificaciones de los sellos y/o candados cumplan con la ISO 17712.',
        campo: 'indiqueQuien',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'certificado',
        row: 3,
        labelNombre: 'Anexe certificado de conformidad, expedido por la empresa certificadora encargada de verificar el cumplimiento de la ISO correspondiente).',
        campo: 'certificado',
        clase: 'col-md-12',
        tipoInput: 'radio',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4,
    },
    {
        id: 'paraAlmacenaje',
        row: 4,
        labelNombre: 'En el caso de contar con patio para almacenaje de vehículos de carga en las instalaciones del Agente Aduanal, describa cómo se asegura de cuidar la integridad de los medios de transporte.',
        campo: 'paraAlmacenaje',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_ADUANAL_CUENTA
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ADUANAL_CUENTA = [
{
    id: 'agenciaAduanal',
    row: 1,
    labelNombre: 'Indique si la agencia aduanal cuenta con patio para almacenaje de medios de transporte en la instalación.',
    campo: 'agenciaAduanal ',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 4,
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
    id: 'procedimientoDocumentado',
    row: 2,
    labelNombre: 'Indique si cuenta con un procedimiento documentado para llevar a cabo la inspección de los medios de transporte, contenedores, remolques y semirremolques',
    campo: 'procedimientoDocumentado',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 4,
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
 * @constant CONFIGURACION_CONSERVARSE
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_CONSERVARSE = [
    {
    id: 'formatoEstablecido',
    row: 1,
    labelNombre: 'Indique si cuenta con un formato establecido para la inspección de los medios de transporte, contenedores, remolques y semirremolques',
    campo: 'formatoEstablecido',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    layout: 'horizontal',
    marcadorDePosicion: '',
    marginTop: 4,
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
        id: 'reparacionMantenimiento',
        row: 2,
        labelNombre: 'Indique si la reparación o mantenimiento de las unidades de transporte, contenedores o remolques se realizan en las mismas instalaciones o son llevados con un proveedor externo.',
        campo: 'reparacionMantenimiento',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    }
]