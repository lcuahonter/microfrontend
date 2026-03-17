/**
 * @constant CONFIGURACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION = [
    {
      id: 'procedimientoDocumentado',
      row: 1,
      labelNombre: 'Describa el procedimiento documentado para la operación del personal de seguridad.',
      campo: 'procedimientoDocumentado',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'procedimientoContacto',
      row: 2,
      labelNombre: 'Describa el procedimiento que el personal debe realizar para contactar al personal de seguridad, personal designado o en su caso, con la autoridad correspondiente.',
      campo: 'procedimientoContacto',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'comunicacion',
      row: 3,
      labelNombre: 'Indique qué aparatos de comunicación utiliza el personal de seguridad o el personal designado (teléfonos fijos, celulares, radios, sistema de alarma, etciétera).',
      campo: 'comunicacion',
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
      id: 'numeroPersonalSeguridad',
      row: 4,
      labelNombre: 'Indique el Número de personal de seguridad que labora en las instalaciones del Agente Aduanal',
      campo: 'numeroPersonalSeguridad',
      clase: 'col-md-12',
      tipoInput: 'text',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4,
    
    },
    {
      id: 'cargoFuncionesPersonal',
      row: 5,
      labelNombre: 'Señale los cargos y/o funciones del personal, y horarios de operación.',
      campo: 'cargoFuncionesPersonal',
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
      id: 'contratacionServicioExterno',
      row: 6,
      labelNombre: 'En caso de contratarse un servicio externo, proporcionar los datos generales de la empresa (RFC, Razón social, domicilio), y especificar número del personal empleado, detalles de operación, registros y reportes que utilizan para desempeñar sus funciones.',
      campo: 'contratacionServicioExterno',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'personalArmado',
      row: 7,
      labelNombre: 'En caso de contar con personal armado, describa el procedimiento para el control y resguardo de las armas.',
      campo: 'personalArmado',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_IDENTIFICACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_IDENTIFICACION = [
    {
      id: 'identificacion',
      row: 1,
      labelNombre: 'Describir el procedimiento para la identificación de los empleados',
      campo: 'identificacion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'indiqueAreasAcceso',
      row: 2,
      labelNombre: 'Indique las áreas a las que tienen acceso los empleados.',
      campo: 'indiqueAreasAcceso',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'mecanismosIdentificacion',
      row: 3,
      labelNombre: 'Indique los mecanismos de identificación (gafete y/o credencial con foto, uniforme, control de acceso, biométricos, tarjetas de proximidad, etcétera).',
      campo: 'mecanismosIdentificacion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [

      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'untilizacionUniformes',
      row: 4,
      labelNombre: 'Indique si los empleados utilizan uniformes, cómo son asignados (por puesto, área, funciones, etcétera) y retirados (en su caso).',
      campo: 'utilizacionUniformes',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'agenteAduanal',
      row: 5,
      labelNombre: 'Describa cómo el Agente Aduanal entrega, cambia y retira las identificaciones y controles de acceso del empleado y asegúrese de incluir las áreas responsables de autorizarlas y administrarlas.',
      campo: 'agenteAduanal',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'aseguramientoAcceso',
      row: 6,
      labelNombre: 'Indique cómo asegura que el acceso a las áreas sensibles este restringido según la descripción del trabajo o las tareas asignadas (incluya el tipo de registros y controles que utiliza).',
      campo: 'aseguramientoAcceso',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'procesoControlAcceso',
      row: 7,
      labelNombre: 'Describa el procedimiento para el control de acceso de los visitantes y proveedores.',
      campo: 'procesoControlAcceso',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'registros',
      row: 8,
      labelNombre: ' Señale qué registros se llevan a cabo. (Formatos personales por cada visita, bitácoras, entre otros).',
      campo: 'registros',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'visitantes',
      row: 9,
      labelNombre: 'El registro de visitantes y proveedores incluye lo siguiente:',
      campo: 'visitantes',
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
      id: 'seguridadRetiro',
      row: 10,
      labelNombre: 'Señale quién es la persona responsable de acompañar al visitante y/o proveedor y si existen áreas restringidas para su ingreso.',
      campo: 'seguridadRetiro',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    }

]

/**
 * @constant CONFIGURACION_ENTREGAS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ENTREGAS = [
    {
      id: 'procedimientoRecepcion',
      row: 1,
      labelNombre: 'Describa el procedimiento para la recepción y revisión de mensajería y paquetería.',
      campo: 'procedimientoRecepcion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'encargadoRecepcion',
      row: 2,
      labelNombre: 'Señale al personal encargado de llevar a cabo el procedimiento.',
      campo: 'encargadoRecepcion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'identificaPersonal',
      row: 3,
      labelNombre: 'Indique cómo se identifica al personal o proveedor del servicio de mensajería y paquetería (señale si requiere de procedimiento adicional al de acceso a proveedores).',
      campo: 'identificaPersonal',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'revisionMensajeria',
      row: 4,
      labelNombre: 'Señale cómo se lleva a cabo la revisión de la mensajería y/o paquetes, qué mecanismo utiliza, los registros que se llevan a cabo y en su caso, los incidentes detectados.',
      campo: 'revisionMensajeria',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'characteristicas',
      row: 5,
      labelNombre: 'Describa las características o elementos para determinar qué mensajería y/o paquetería es sospechosa.',
      campo: 'characteristicas',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
    },
    {
      id: 'accionRealiza',
      row: 6,
      labelNombre: 'Señale qué acción realiza en el caso de detectar mensajería y/o paquetes sospechosos.',
      campo: 'accionRealiza',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      marcadorDePosicion: '',
      marginTop: 4
    }
]