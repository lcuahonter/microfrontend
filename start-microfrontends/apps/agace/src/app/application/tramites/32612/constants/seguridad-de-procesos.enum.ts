/**
 * @constant CONFIGURACION_PROCESOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_PROCESOS = [
    {
      id: 'transmisionInformacion',
      row: 1,
      labelNombre: 'Detalle cómo recibe y transmite información y documentación relevante al traslado de mercancía de comercio exterior con sus socios comerciales (indique si utiliza un sistema informático de control específico y explique brevemente su función). Asimismo, detalle cómo garantiza que la información proporcionada sea legible, completa, exacta, reportada en tiempo y protegida contra cambios, pérdidas o introducción de información errónea.',
      campo: 'transmisionInformacion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'informacionElectronica',
      row: 2,
      labelNombre: 'Indique cómo asegura que la información electrónica de los embarques y carga en general incluye el número de sello y/o candado con el que se aseguró la carga y en su caso de los cambios por la revisión de alguna autoridad.',
      campo: 'informacionElectronica',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'senaleDeQue',
      row: 3,
      labelNombre: 'Señale de qué forma los asociados de negocio transmiten información al Agente Aduanal, y cómo aseguran la protección de la misma.',
      campo: 'senaleDeQue',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    }
]

/**
 * @constant CONFIGURACION_COMMUNICACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_COMMUNICACION = [
    {
      id: 'detalladamente',
      row: 1,
      labelNombre: 'Describa detalladamente cómo se comunica el Agente Aduanal con el personal encargado de llevar a cabo el despacho de la mercancía, principalmente con aquellos que tienen contacto directo con la mercancía y con los medios de transporte (mandatarios, dependientes, clasificadores, etcétera), en caso de algún incidente de seguridad.',
      campo: 'detalladamente',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'comunicacion',
      row: 2,
      labelNombre: 'Indique cómo se asegura de que la comunicación con sus socios comerciales sea oportuna, precisa y segura.',
      campo: 'comunicacion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'administrativos',
      row: 3,
      labelNombre: 'Indique si el personal operativo y administrativo cuenta o dispone de aparatos (radios, móviles, teléfonos fijos) para comunicarse entre sí y/o con quien corresponda.Estos deberán estar accesibles a los usuarios, para poder tener una pronta reacción.',
      campo: 'administrativos',
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
      id: 'procedimiento',
      row: 4,
      labelNombre: 'Describa el procedimiento para el control y mantenimiento de los aparatos de comunicación.',
      campo: 'procedimiento',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'asignacion',
      row: 5,
      labelNombre: 'Políticas de asignación de aparatos de comunicación móvil.',
      campo: 'asignacion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'mantenimiento',
      row: 6,
      labelNombre: 'Programa de mantenimiento o reemplazo de aparatos de comunicación fija y móvil',
      campo: 'mantenimiento',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'aparatos',
      row: 7,
      labelNombre: 'Indique si cuenta con aparatos de comunicación de respaldo en caso de que el sistema permanente fallara, y en su caso, detalle brevemente.',
      campo: 'aparatos',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4,
    }
]
