/**
 * @constant CONFIGURACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION = [
    {
      id: 'indiqueSi',
      row: 1,
      labelNombre: 'Indique si el procedimiento le permita identificar de forma permanente otras amenazas o riesgos en la cadena de suministros, que se originen por el resultado de algún incidente o por cambios en las condiciones iniciales de las instalaciones y procesos del Agente Aduanal.',
      campo: 'indiqueSi',
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
      id: 'senaleSi',
      row: 2,
      labelNombre: 'Señale si el procedimiento le permite identificar que las políticas, procedimientos y otros mecanismos de control y seguridad se estén cumpliendo.',
      campo: 'senaleSi',
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
      id: 'senaleQuienes',
      row: 3,
      labelNombre: 'Señale quienes conforman el Comité de Seguridad de la compañía (Nombre y puesto)',
      campo: 'senaleQuienes',
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
      id: 'indiqueCuales',
      row: 4,
      labelNombre: 'Indique cuáles son las fuentes de información utilizadas para calificar los riesgos durante la fase de análisis',
      campo: 'indiqueCuales',
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
 * @constant CONFIGURACION_POLITICAS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_POLITICAS = [
    {
      id: 'enunciarPoliticas',
      row: 1,
      labelNombre: 'Enunciar las políticas en materia de seguridad orientadas a prevenir, asegurar y reconocer amenazas en la cadena de suministros e instalaciones del Agente Aduanal',
      campo: 'enunciarPoliticas',
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
      id: 'indiqueCompromiso',
      row: 2,
      labelNombre: 'Indique quién es el responsable de su revisión, firma y difusión hacia los empleados',
      campo: 'indiqueCompromiso',
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
      id: 'indiqueActualizacion',
      row: 3,
      labelNombre: 'Indique la periodicidad con la que se lleva a cabo su actualización.',
      campo: 'indiqueActualizacion',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'textarea',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'indiqueSuministros',
      row: 4,
      labelNombre: 'Indique el programa y/o campaña de difusión que utiliza para comunicar a los empleados la política de seguridad en la cadena de suministros',
      campo: 'indiqueSuministros',
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
      id: 'capacitacion',
      row: 5,
      labelNombre: 'Indique si realiza capacitación inicial y de reforzamiento de la política de seguridad en la cadena de suministros.',
      campo: 'capacitacion',
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
 * @constant CONFIGURACION_AUDITORIAS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_AUDITORIAS = [

  {
      id: 'siCuentaProcedimiento',
      row: 1,
      labelNombre: 'Si cuenta con un procedimiento documentado para su realización.',
      campo: 'siCuentaProcedimiento',
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
      id: 'describaProcedimiento',
      row: 2,
      labelNombre: 'Describa el procedimiento documentado para llevar a cabo una auditoría interna, enfocada en la seguridad en la cadena de suministros.',
      campo: 'describaProcedimiento',
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
      id: 'nombreProcedimiento',
      row: 3,
      labelNombre: 'Nombre del procedimiento para llevar a cabo una auditoría interna enfocada en la seguridad en la cadena de suministros',
      campo: 'nombreProcedimiento',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'textarea',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'siElEnfoque',
      row: 4,
      labelNombre: 'Si el enfoque de las auditorías es en base al tamaño de la organización y a la naturaleza de los riesgos',
      campo: 'siElEnfoque',
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
      id: 'losProcesos',
      row: 5,
      labelNombre: 'Los procesos o tópicos que se auditan',
      campo: 'losProcesos',
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
      id: 'conRegistros',
      row: 6,
      labelNombre: 'Si cuenta con registros de los resultados de las auditorías y su seguimiento',
      campo: 'conRegistros',
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
      id: 'senaleComoLlevaACabo',
      row: 7,
      labelNombre: 'Señale cómo lleva a cabo la programación o calendarización para realizar una auditoría interna en materia de seguridad en la cadena de suministros.',
      campo: 'senaleComoLlevaACabo',
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
      id: 'indiqueComoLlevaACabo',
      row: 8,
      labelNombre: 'Indique los nombre y puestos de quienes participan, los registros que se efectúan y la periodicidad con la que se realizan las auditorías internas',
      campo: 'indiqueComoLlevaACabo',
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
      id: 'indiqueSiComo',
      row: 9,
      labelNombre: 'Indique cómo es que, la gerencia o el Agente Aduanal verifica el resultado de las auditorias en materia de seguridad, cómo realiza y/o implementa acciones preventivas, correctivas y de mejora además del seguimiento y cierre de las mismas',
      campo: 'indiqueSiComo',
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
 * @constant CONFIGURACION_CONTINGENCIA
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_CONTINGENCIA = [

  {
      id: 'indiqueSiCuentaProcedimiento',
      row: 1,
      labelNombre: 'Indique si cuenta con un procedimiento o plan de contingencia y/o emergencias documentado relacionado con la seguridad de la cadena de suministros y sus instalaciones, para asegurar la continuidad del negocio en caso de una situación de emergencia o de seguridad, que afecte el desarrollo normal de las actividades de comercio exterior',
      campo: 'indiqueSiCuentaProcedimiento',
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
      id: 'queSituaciones',
      row: 2,
      labelNombre: 'Qué situaciones contempla y describa el plan de acción y pasos que hay que seguir en caso de crisis, así como las tareas que el personal tenga asignadas durante el manejo de dichas contingencias.',
      campo: 'queSituaciones',
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
      id: 'queMecanismos',
      row: 3,
      labelNombre: 'Qué mecanismos utiliza para difundir y asegurarse que los planes de contingencia son efectivos.',
      campo: 'queMecanismos',
      clase: 'col-md-12',
      tipoInput: 'radio',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'textarea',
      marcadorDePosicion: '',
      marginTop: 4,
    },
    {
      id: 'indiqueSiCuentaConRegistros',
      row: 4,
      labelNombre: 'Indique si cuenta con registros de capacitaciones periódicas, pruebas, ejercicios prácticos o simulacros de los planes de contingencia.',
      campo: 'indiqueSiCuentaConRegistros',
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