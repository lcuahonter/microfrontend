/**
 * @constant CONFIGURACION_VERIFICACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_VERIFICACION = [
    {
        id: 'procedimientoContratacion',
        row: 1,
        labelNombre: 'Describir el procedimiento documentado para la contratación del personal.',
        campo: 'procedimientoContratacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'requisitosDocumentacion',
        row: 2,
        labelNombre: 'Señale los requisitos y documentación exigida.',
        campo: 'requisitosDocumentacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'lasPruebasExamenes',
        row: 3,
        labelNombre: 'Señale las pruebas y exámenes solicitados.',
        campo: 'lasPruebasExamenes',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'puestosCriticos',
        row: 4,
        labelNombre: 'Indicar las áreas y/o puestos críticos que se hayan identificado como de riesgo, conforme a su análisis.',
        campo: 'puestosCriticos',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'indicarPeriodicidad',
        row: 5,
        labelNombre: 'Indicar cuales son los requerimientos adicionales para áreas y/o puestos de trabajo específicos, como: antecedentes criminales (si la legislación y las políticas de la empresa lo permiten), carta de antecedentes no penales, estudios socioeconómicos, estudios clínicos, toxicológicos (uso de drogas), etcétera. En su caso, señale los puestos o áreas de trabajo en que se requieren y con qué periodicidad se llevan a cabo.',
        campo: 'indicarPeriodicidad',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'contratacion',
        row: 6,
        labelNombre: 'Indique si previo a la contratación, el candidato debe firmar un acuerdo de confidencialidad o un documento similar.',
        campo: 'contratacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'contratarUnaAgencia',
        row: 7,
        labelNombre: 'En caso de contratar una agencia de servicios para la contratación de personal, indique si ésta cuenta con procedimientos documentados para la contratación de personal y cómo se asegura de que cumplan con el mismo. Explique brevemente en qué consisten.',
        campo: 'contratarUnaAgencia',
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
 * @constant CONFIGURACION_PROCEDIMIENTO
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_PROCEDIMIENTO = [
    {
        id: 'describirElProcedimiento',
        row: 1,
        labelNombre: 'Describir el procedimiento para la baja del personal.',
        campo: 'describirElProcedimiento',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'responsableDeLlevar',
        row: 2,
        labelNombre: 'Quién es el responsable de llevar acabo y dar seguimiento a este procedimiento.',
        campo: 'responsableDeLlevar',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'entregaIdentificaciones',
        row: 3,
        labelNombre: 'Cómo se realiza y confirma la entrega de identificaciones, uniformes, llaves y demás equipo.',
        campo: 'entregaIdentificaciones',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'indicarControlRegistro',
        row: 4,
        labelNombre: 'Indicar el control, registro y/o formato, en el que se identifique y asegure la entrega de material y baja en sistemas informáticos (en su caso, anexar).',
        campo: 'indicarControlRegistro',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
        marginTop: 4
    },
    {
        id: 'senaleElTipoDeRegistro',
        row: 4,
        labelNombre: 'Señale el tipo de registros del personal que finalizó su relación laboral con el Agente Aduanal, para que en caso de que haya sido por motivos de seguridad, se prevenga a sus proveedores de servicios y/o asociados de negocio.',
        campo: 'senaleElTipoDeRegistro',
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
 * @constant CONFIGURACION_ADMINISTRACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_ADMINISTRACION = [
    {
        id: 'tipoDeAcceso',
        row: 1,
        labelNombre: '',
        campo: 'tipoDeAcceso',
        clase: 'col-md-12',
        tipoInput: 'radio',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marcadorDePosicion: '',
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
    }
]