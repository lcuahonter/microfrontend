/**
 * @constant CONFIGURACION_CAPACITACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_CAPACITACION = [
    {
      id: 'indiqueCuales',
      row: 1,
      labelNombre: 'Indique cuáles son los temas que se imparten en el programa.',
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
    },
    {
        id: 'impartenMomentos',
        row: 2,
        labelNombre: 'Señale en qué momento se imparten (inducción, períodos específicos, derivado de auditorías, incidentes de seguridad, etcétera)',
        campo: 'impartenMomentos',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'periodicidad',
        row: 3,
        labelNombre: 'Señale la periodicidad de las capacitaciones, así como, las actualizaciones y reforzamiento.',
        campo: 'periodicidad',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'indicarDeQueForma',
        row: 4,
        labelNombre: 'Indicar de qué forma se documenta la participación en las capacitaciones de seguridad en la cadena de suministros (videos, fotografías, minutas, listas de asistencias, intranet u otro sistema, material didáctico, presentaciones en PowerPoint, folletos, etcétera). Los registros de capacitación deben incluir la fecha, los nombres de los asistentes, los temas impartidos, además de tener medidas para verificar que la capacitación brindada cumplió con todos los objetivos de la misma.',
        campo: 'indicarDeQueForma',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
      id: 'paraca9',
      row: 5,
      labelNombre: 'Explicar cómo se fomenta la participación de los empleados en cuestiones de seguridad en la cadena de suministros.',
      campo: 'paraca9',
      clase: 'col-md-12',
      tipoInput: 'textarea',
      desactivado: false,
      soloLectura: false,
      validadores: [],
      layout: 'horizontal',
      marcadorDePosicion: '',
      marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_CAPACITACIONDOS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_CAPACITACIONDOS = [
    {
        id: 'sobreRevisiones',
        row: 1,
        labelNombre: 'La capacitación sobre revisiones agrícolas debe abarcar las medidas de prevención de plagas, los requisitos reglamentarios aplicables a los materiales de embalaje de madera, en concordancia con la Norma Internacional de Medidas Fitosanitarias No. 15 denominada "Reglamentación del embalaje de madera utilizado en el Comercio Internacional," las cuales emanan de la Organización de las Naciones Unidas para la Alimentación y la Agricultura y la identificación de la madera infestada.',
        campo: 'sobreRevisiones',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        layout: 'horizontal',
        marcadorDePosicion: '',
        marginTop: 4
    }
]