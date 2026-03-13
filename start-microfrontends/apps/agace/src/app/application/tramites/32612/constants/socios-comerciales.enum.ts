/**
 * @constant CONFIGURACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION = [
    {
      id: 'lleva',
      row: 1,
      labelNombre: 'Indique cómo lleva a cabo su programa de cumplimiento social entre sus empleados y socios comerciales que, como mínimo, aborde cómo la empresa garantiza que los bienes, insumos o mercancías nacionales e importadas a México para la elaboración de productos o mercancías no provienen de la extracción, producción o fabricación, total o parcialmente, con formas prohibidas de trabajo, es decir, forzoso u obligado incluido el trabajo infantil forzoso u obligado, y cómo lo documenta.',
      campo: 'lleva',
      clase: 'col-md-11',
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
 * @constant CONFIGURACION_REQUERIMIENTOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_REQUERIMIENTOS = [
    {
        id: 'procedimiento',
        row: 1,
        labelNombre: 'Describa el procedimiento que indique cómo lleva a cabo la identificación de socios comerciales que requieran el cumplimiento de estándares mínimos en materia de seguridad.',
        campo: 'procedimiento',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            
        ],
        marginTop: 4
    },
    {
        id: 'registro',
        row: 2,
        labelNombre: 'Indique si cuenta con un registro de los socios comerciales que deben cumplir con requisitos en materia de seguridad, y mencione que tipo de proveedores son estos (transporte, almacenaje, servicio de custodios, empresa de seguridad privada, corresponsalías, servicio para carga y descarga de mercancía, etcétera).',
        campo: 'registro',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            
        ],
        marginTop: 4
    },
    {
        id: 'documental',
        row: 3,
        labelNombre: 'Indique de qué forma documental (convenios, acuerdos, cláusulas contractuales y/o adendas), asegura que sus socios comerciales cumplan con los requisitos en materia de seguridad.',
        campo: 'documental',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [
            
        ],
        marginTop: 4
    },
    {
        id: 'convenios',
        row: 4,
        labelNombre: 'Indique si existen convenios, acuerdos, cláusulas contractuales y/o adendas, respecto a la implementación de medidas de seguridad con sus proveedores de servicios al interior de su empresa, tales como: seguridad privada, comedor, jardinería, servicios de limpieza y mantenimiento, proveedores de Tecnología de la Información, etcétera.',
        campo: 'convenios',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'comercial',
        row: 5,
        labelNombre: 'Indique si cuenta con socios comerciales que se les exija pertenecer a un programa de seguridad de la cadena de suministros (por ejemplo: CTPAT o algún otro Programa de Operador Económico Autorizado de la OMA), así como la información y documentación que le son solicitadas.',
        campo: 'comercial',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'identificacion',
        row: 6,
        labelNombre: 'Describa cómo lleva a cabo la identificación de socios comerciales que requieran el cumplimiento de estándares mínimos en materia de seguridad.',
        campo: 'identificacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'annualDePendimentos',
        row: 7,
        labelNombre: 'Indique el número total anual de pedimentos y el valor global de los mismos que se realizan por cada una de las instalaciones desde las que transmita la validación de los pedimentos en cada una de las aduanas autorizadas de la patente aduanal.',
        campo: 'annualDePendimentos',
        clase: 'col-md-12',
        tipoInput: 'text',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'encuentranOtros',
        row: 8,
        labelNombre: 'Indique si las sociedades en las que se encuentra incorporado/constituido, se encuentran otros agentes aduanales.',
        campo: 'encuentranOtros',
        clase: 'col-md-12',
        tipoInput: 'radio',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4,
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
        id: 'indiqueElNumero',
        row: 9,
        labelNombre: 'Indique el número total anual de pedimentos y el valor global de los mismos que son gestionados por cada una de las sociedades con otros agentes aduanales a las que pertenecen.',
        campo: 'indiqueElNumero',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'denominacion',
        row: 10,
        labelNombre: 'Nombre o denominación de la sociedad.',
        campo: 'denominacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'adunanasPorLasQueOpera',
        row: 11,
        labelNombre: 'Aduanas por las que opera la sociedad.',
        campo: 'aduanasPorLasQueOpera',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'direccionCompleta',
        row: 12,
        labelNombre: 'Dirección completa de la(s) instalación(es).',
        campo: 'direccionCompleta',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'describaComoSeAsegura',
        row: 13,
        labelNombre: 'Describa como se asegura que las sociedades que tiene con otros agentes aduanales y en las que su patente no es adscripción o adicional cumple con los requerimientos mínimos en materia de seguridad.',
        campo: 'describaComoSeAsegura',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_REVISIONES
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_REVISIONES = [
    {
        id: 'revision1',
        row: 1,
        labelNombre: '',
        campo: 'revision1',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'periodicidad',
        row: 2,
        labelNombre: 'Indique la periodicidad con la que realiza las visitas al socio comercial (estas deben de ser por lo menos una vez al año y derivadas de situaciones de riesgo).',
        campo: 'periodicidad',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'calendario',
        row: 3,
        labelNombre: 'Describa el programa o calendario para la ejecución de las revisiones de seguridad',
        campo: 'calendario',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'verificacion',
        row: 4,
        labelNombre: 'Indique el registro o reporte de la verificación, y en su caso del seguimiento correspondiente.',
        campo: 'verificacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'tendranQueEstar',
        row: 5,
        labelNombre: 'El o los formatos de verificación tendrán que estar debidamente requisitados, colocando la fecha, nombre y cargo de quienes participan en la revisión, firmas, etcétera.',
        campo: 'tendranQueEstar',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'comerciales',
        row: 6,
        labelNombre: 'Señalar qué medidas de acción se toman en caso de que los socios comerciales no cumplan con los requisitos de seguridad establecidos.',
        campo: 'comerciales',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    },
    {
        id: 'certificacion',
        row: 7,
        labelNombre: 'En caso de contar con socios comerciales con la certificación de CTPAT u otro programa de certificación de seguridad en la cadena de suministros, indique la periodicidad con la que es revisado su estatus, cómo lo registran y las acciones que toma en caso de detectarse que esté suspendida y/o cancelada, conforme a lo establecido en su procedimiento.',
        campo: 'certificacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [

        ],
        marginTop: 4
    }
]