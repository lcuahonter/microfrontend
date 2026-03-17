/**
 * @constant CONFIGURACION_REPORTE_ANOMALIAS
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_REPORTE_ANOMALIAS = [
    {
        id: 'procedimiento',
        row: 1,
        labelNombre: 'Describa el procedimiento para denunciar o reportar anomalías y/o actividades sospechosas, así como los contengan los mecanismos para informar de forma anónima los problemas relacionados con la seguridad.',
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
        id: 'quienEsElResponsable',
        row: 2,
        labelNombre: 'Quién es el responsable de reportar los incidentes.',
        campo: 'quienEsElResponsable',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marginTop: 4
    },
    {
        id: 'determinacionAutoridad',
        row: 3,
        labelNombre: 'Detalle cómo determina e identifica con qué autoridad comunicarse en distintos supuestos o presunción de actividades sospechosas.',
        campo: 'determinacionAutoridad',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marginTop: 4
    },
    {
        id: 'mencionSiLleva',
        row: 4,
        labelNombre: 'Mencione si lleva un registro del reporte de estas actividades y/o sospechas.',
        campo: 'mencionSiLleva',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marginTop: 4
    }
]

/**
 * @constant CONFIGURACION_INVESTIGACION
 * @description
 * Arreglo que contiene la configuración para el campo de clasificación de la información proporcionada
 * durante el trámite de Registro de Certificación de Empresas. Define las propiedades visuales, de validación
 * y opciones disponibles para el input tipo radio, permitiendo seleccionar si la información es pública o privada.
 */
export const CONFIGURACION_INVESTIGACION = [
    {
        id: 'procedimientoInvestigacion',
        row: 1,
        labelNombre: 'Describa el procedimiento documentado para iniciar una investigación en caso de ocurrir algún incidente de seguridad',
        campo: 'procedimientoInvestigacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marginTop: 4
    },
    {
        id: 'responsableInvestigacion',
        row: 2,
        labelNombre: 'Responsable de llevar a cabo la investigación.',
        campo: 'responsableInvestigacion',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marginTop: 4
    },
    {
        id: 'documentacionQueIntegra',
        row: 3,
        labelNombre: 'Documentación que integra el expediente de la investigación.',
        campo: 'documentacionQueIntegra',
        clase: 'col-md-12',
        tipoInput: 'textarea',
        desactivado: false,
        soloLectura: false,
        validadores: [],
        marginTop: 4
    }
]