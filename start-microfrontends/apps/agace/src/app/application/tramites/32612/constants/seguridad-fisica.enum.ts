/**
 * @constant CONFIGURACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION = [
    {
      id: 'senaleQuienes',
      row: 1,
      labelNombre: 'Indique los materiales predominantes con los que se encuentran construidas las instalaciones (por ejemplo, de estructura de metal y paredes de lámina, paredes de ladrillo, concreto, malla ciclónica, entre otros.), y señale de qué forma se lleva a cabo la revisión y mantenimiento de las estructuras.',
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
      id: 'senaleSi',
      row: 2,
      labelNombre: 'Señale si realiza inspecciones periódicas a las instalaciones para mantener la integridad de las estructuras.',
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
      id: 'describirComo',
      row: 3,
      labelNombre: 'Describir cómo lleva a cabo la revisión y mantenimiento de la integridad de las estructuras.',
      campo: 'describirComo',
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
      id: 'indiquePersonal',
      row: 4,
      labelNombre: 'Indique el personal o área responsable para realizar las tareas de inspección, mantenimiento y reparación de daños de las instalaciones.',
      campo: 'indiquePersonal',
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
 * @constant CONFIGURACION_ACCESOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ACCESOS = [
    {
      id: 'cuantasPuertas',
      row: 1,
      labelNombre: 'Cuantas puertas y/o accesos existen en las instalaciones, así como el horario de operación de cada una, e indique de qué forma son monitoreadas (En caso de tener personal asignado, indicar la cantidad).',
      campo: 'cuantasPuertas',
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
      id: 'detallePuertas',
      row: 2,
      labelNombre: 'Detalle si existen puertas y/o accesos bloqueados o permanentemente cerradas.',
      campo: 'detallePuertas',
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
      id: 'describaComo',
      row: 3,
      labelNombre: 'Describa cómo asegura que el acceso a las áreas sensibles este restringido según la descripción del trabajo o las tareas asignadas (incluya el tipo de registros y controles que utiliza).',
      campo: 'describaComo',
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
 * @constant CONFIGURACION_PERIMETRALES
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_PERIMETRALES = [
    {
      id: 'describaTipo',
      row: 1,
      labelNombre: 'Describa el tipo de cerca, barrera periférica y/o bardas con las que cuentan las instalaciones del Agente Aduanal.',
      campo: 'describaTipo',
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
      id: 'indiqueSiCuenta',
      row: 2,
      labelNombre: 'Indique si cuenta la agencia aduanal cuenta con bardas perimetrales.',
      campo: 'indiqueSiCuenta',
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
      id: 'caracteristicas',
      row: 3,
      labelNombre: 'Señale las características de las mismas (material, dimensiones, etcétera).',
      campo: 'caracteristicas',
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
        id: 'periodicidadVerificacion',
        row: 4,
        labelNombre: 'Periodicidad con la que se verifica la integridad de las bardas perimétricas, y los registros que se llevan a cabo, con la finalidad de asegurar su integridad e identificar daños, mismos que deben repararse lo antes posible.',
        campo: 'periodicidadVerificacion',
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
      id: 'personalResponsable',
      row: 5,
      labelNombre: 'Indique el personal o área responsable para realizar las tareas de inspección y reparación de daños.',
      campo: 'personalResponsable',
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
      id: 'enCasoDeContar',
      row: 6,
      labelNombre: 'En caso de contar con patio para medios de transporte en la agencia aduanal, describa como se encuentra delimitado.',
      campo: 'enCasoDeContar',
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
      id: 'justifiqueDetalladamente',
      row: 7,
      labelNombre: 'Justifique detalladamente la razón que la agencia aduanal no cuenta con bardas perimetrales.',
      campo: 'justifiqueDetalladamente',
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

]

/**
 * @constant CONFIGURACION_ESTACIONAMIENTOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ESTACIONAMIENTOS = [
    {
      id: 'describaProcedimiento',
      row: 1,
      labelNombre: 'Describa el procedimiento para el control y monitoreo de los estacionamientos.',
      campo: 'describaProcedimiento',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'responsablesControlar',
      row: 2,
      labelNombre: 'Responsables de controlar y monitorear el acceso a los estacionamientos.',
      campo: 'responsablesControlar',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
        id: 'indentificacionEstacionamientos',
        row: 3,
        labelNombre: 'Identificación de los estacionamientos (en su caso) especifique si el estacionamiento de empleados, visitantes, se encuentra separado de las áreas de almacenaje y manejo de mercancías.',
        campo: 'identificacionEstacionamientos',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
          
        ],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
      id: 'comoSeLleva',
      row: 4,
      labelNombre: ' Cómo se lleva a cabo el control de entrada y salida de vehículos a las instalaciones. Indicar los registros que se realizan para el control del estacionamiento, los mecanismos de control existentes, por ejemplo: tarjetones, tarjetas lectoras, corbatines, etcétera, cómo se asignan y el área responsable de hacerlo.',
      campo: 'comoSeLleva',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'politicasMecanismos',
      row: 5,
      labelNombre: 'Políticas o mecanismos (en su caso) para no permitir el ingreso de vehículos privados a las áreas de almacenaje y manejo de mercancía.',
      campo: 'politicasMecanismos',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_DISPOSITIVOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_DISPOSITIVOS = [
    {
      id: 'responsablesSeguridad',
      row: 1,
      labelNombre: 'Responsables de administrar y controlar la seguridad de las llaves.',
      campo: 'responsablesSeguridad',
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
      id: 'formatoRegistro',
      row: 2,
      labelNombre: 'Formato y/o registro de control para el préstamo de llaves.',
      campo: 'formatoRegistro',
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
      id: 'tratamientoPerdida',
      row: 3,
      labelNombre: 'Tratamiento de pérdida o no devolución de llaves.',
      campo: 'tratamientoPerdida',
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
      id: 'indiqueSiTodas',
      row: 4,
      labelNombre: 'Indique si todas las puertas, ventanas, entradas interiores y exteriores disponen de mecanismos de cierre o seguridad.',
      campo: 'indiqueSiTodas',
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
      id: 'existenAreas',
      row: 5,
      labelNombre: 'Señalar si existen áreas en las que se acceda con dispositivos electrónicos y/o algún otro mecanismo de acceso.',
      campo: 'existenAreas',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_ALUMBRADO
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ALUMBRADO = [
    {
      id: 'cuentaConSistema',
      row: 2,
      labelNombre: 'Si cuenta con un sistema de emergencia y/o respaldo en las áreas sensibles.',
      campo: 'cuentaConSistema',
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
        row: 1,
        labelNombre: 'Describir el procedimiento para la operación y mantenimiento del sistema de iluminación',
        campo: 'describaProcedimiento',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
          
        ],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
      id: 'señaleAreas',
      row: 3,
      labelNombre: 'Señale qué áreas se encuentran iluminadas y cuáles cuentan con un sistema de respaldo',
      campo: 'señaleAreas',
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
      id: 'indiqueSiCuenta',
      row: 4,
      labelNombre: 'Indique si cuenta con una planta de poder auxiliar.',
      campo: 'indiqueSiCuenta',
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
      id: 'mencioneSiCuenta',
      row: 5,
      labelNombre: 'Mencione si cuenta con otro mecanismo para suministrar energía eléctrica en caso de alguna contingencia.',
      campo: 'mencioneSiCuenta',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'deQueManera',
      row: 6,
      labelNombre: 'De qué manera se cerciora que el sistema de iluminación tenga continuidad ante la falta de suministro en cada una de las áreas de las instalaciones, de manera que permita una clara identificación del personal, material y/o equipo que ahí se encuentra.',
      campo: 'deQueManera',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'responsableControl',
      row: 7,
      labelNombre: 'Indique el responsable del control de los sistemas de iluminación.',
      campo: 'responsableControl',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'describaPrograma',
      row: 8,
      labelNombre: 'Describa su programa de mantenimiento y revisión (en caso de coincidir con otro proceso, indicarlo)',
      campo: 'describaPrograma',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_SISTEMAS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_SISTEMAS = [
    {
      id: 'describaSistema',
      row: 1,
      labelNombre: 'Describa el procedimiento en el que indique el funcionamiento del sistema de central de alarmas externo o sensores.',
      campo: 'describaSistema',
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
      id: 'indiqueSiTodas',
      row: 2,
      labelNombre: 'Indique si todas las puertas y ventanas tienen sensores de alarma, así como las áreas donde se cuenta con sensores de movimiento.',
      campo: 'indiqueSiTodas',
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
        row: 3,
        labelNombre: 'Procedimiento a seguir en caso de activarse una alarma.',
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
      id: 'areaResponsable',
      row: 4,
      labelNombre: 'Indique el personal, área responsable o proveedor de servicio de dar mantenimiento, cómo se reportan fallas y los registros que utilizan.',
      campo: 'areaResponsable',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
        id: 'describaProcedimiento',
        row: 5,
        labelNombre: 'Describa el procedimiento para la operación de los sistemas de alarma y de circuito cerrado de televisión y video vigilancia y las tecnologías de seguridad (este debe revisarse y actualizarse anualmente y de acuerdo con el análisis de riesgo o las circunstancias).',
        campo: 'describaProcedimiento',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
      id: 'camarasSeguridad',
      row: 6,
      labelNombre: 'Indique el número de cámaras de seguridad de los sistemas de alarma y de circuito cerrado de televisión y video vigilancia instaladas, características técnicas y su ubicación. Detallar si cubre los puntos de entrada y salida de las instalaciones, para cubrir el movimiento de vehículos e individuos, así como el lugar de almacenaje de los vehículos).',
      campo: 'camarasSeguridad',
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
        id: 'senaleUbicacion',
        row: 7,
        labelNombre: 'Señalar la ubicación de los sistemas de alarma y de circuito cerrado de televisión y video vigilancia y las tecnologías de seguridad, dónde se localizan los monitores, quién los revisa.',
        campo: 'senaleUbicacion',
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
      id: 'horasOperacion',
      row: 8,
      labelNombre: 'Indique los horarios de operación, y en su caso, si existen estaciones de monitoreo remoto. Toda la infraestructura de tecnología de seguridad debe estar protegida físicamente contra el acceso no autorizado',
      campo: 'horasOperacion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'formaRevisan',
      row: 9,
      labelNombre: 'Indique de qué forma revisan las grabaciones (aleatoria, cada semana, eventos especiales, áreas restringidas, etcétera).',
      campo: 'formaRevisan',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'personalDesignado',
      row: 10,
      labelNombre: 'Indique quién es el personal designado y cómo la gerencia se involucra en las revisiones.',
      campo: 'personalDesignado',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'documentanResultados',
      row: 11,
      labelNombre: 'Cómo se documentan los resultados de las revisiones para incluir acciones correctivas para fines de auditoría.',
      campo: 'documentanResultados',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'tiempoMantenimiento',
      row: 12,
      labelNombre: ' Indique por cuánto tiempo se mantienen estas grabaciones (debiendo ser por lo menos de un mes).',
      campo: 'tiempoMantenimiento',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'sistemasRespaldo',
      row: 13,
      labelNombre: 'Indique si los sistemas de alarma y de circuito cerrado de televisión y video vigilancia y las tecnologías de seguridad se encuentran respaldadas por una planta de poder eléctrica.',
      campo: 'sistemasRespaldo',
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
      id: 'poderElectrica',
      row: 14,
      labelNombre: 'En caso de no contar con una planta de poder eléctrica, mencione algún otro mecanismo para suministrar energía eléctrica, que garanticen su funcionamiento.',
      campo: 'poderElectrica',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'estosSistemas',
      row: 15,
      labelNombre: 'Estos sistemas deberían de tener una función de alarma/notificación, que indique una condición de falla en el funcionamiento y/ o grabación, señale si sus sistemas tienen dicha función.',
      campo: 'estosSistemas',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'adicionalmente',
      row: 16,
      labelNombre: 'Indicar si adicionalmente a los sistemas de alarma y de circuito cerrado de televisión y video vigilancia utiliza algún otro tipo de tecnología para robustecer las medidas de seguridad con las que ya cuenta.',
      campo: 'adicionalmente',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
      id: 'procedimientoInspeccion',
      row: 17,
      labelNombre: 'Describa el procedimiento que se ha implementado para probar e inspeccionar de manera regular los sistemas de alarma y de circuito cerrado de televisión y video vigilancia y las tecnologías de seguridad y asegurar su buen funcionamiento. Los resultados de las inspecciones y las pruebas de funcionamiento deben estar documentadas, al igual que las acciones correctivas necesarias (estas se deben implementar lo antes posible). Adicionalmente, que los resultados documentados de estas inspecciones se mantengan durante un tiempo suficiente para fines de auditoría.',
      campo: 'procedimientoInspeccion',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    },
    {
        id: 'proveedorAlarmas',
        row: 18,
        labelNombre: 'Indicar si el proveedor de alarmas y sistemas de alarma y de circuito cerrado de televisión y video vigilancia tiene acceso a las cámaras de seguridad, si es el encargado de realizar el monitoreo de las mismas.',
        campo: 'proveedorAlarmas',
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
      id: 'controlanAccesos',
      row: 19,
      labelNombre: 'Indique de qué forma se controlan los accesos y quién es el responsable de dicho monitoreo.',
      campo: 'controlanAccesos',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [
        
      ],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    }

]