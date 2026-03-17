/**
 * * Esta sección contiene los campos necesarios para completar el trámite de exportación de productos acuícolas.
 * @desc Configuración de los campos para la sección "Trámite a realizar".
 * @since 2024-06
 * @author Equipo Agricultura
 */
export const DATOS_TRAMITE_REALIZAR = [
    {
        labelNombre: 'Tipo de Certificado',
        campo: 'certificadoTipo',
        required: true,
        radioOptions: [],
        radioSelectedValue: '',
        jsonDataFileName: 'tipo-certificado.json',
        value: 'animal',
    },
    {
        labelNombre: 'Aduana de salida/lugar de embarque',
        campo: 'aduanaEmbarque',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Número de contenedor:',
        campo: 'numeroContenedor',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
    },
    {
        labelNombre: 'País origen',
        campo: 'paisOrigen',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Entidad federativa de origen',
        campo: 'entidadFederativaOrigen',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Municipio de origen',
        campo: 'municipioOrigen',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Punto de ingreso al país destino:',
        campo: 'paisDestino',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
    },
];

/**
 * Esta sección es necesaria para especificar la combinación de especie y país de destino, así como la instalación acuícola.
 * @desc Configuración de los campos para la sección "Combinación requerida".
 * @since 2024-06
 * @author Equipo Agricultura
 */
export const DATOS_COMBINACION_REQUERIDA = [
    {
        labelNombre: 'Especie',
        campo: 'especie',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'País de destino',
        campo: 'paisDeDestino',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Nombre, denominación o razón social de la empresa productora(Instalación acuícola)',
        campo: 'instalacionAcuicola',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Consultar',
        required: true,
    }
];

/**
 * Esta sección es necesaria para especificar los detalles del medio de transporte utilizado para la exportación.
 * @desc Configuración de los campos para la sección "Transporte".
 * @since 2024-06
 * @author Equipo Agricultura
 */
export const DATOS_TRANSPORTE = [
    {
        labelNombre: 'Medio de transporte',
        campo: 'medioTransporte',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Identificación del transporte:',
        campo: 'identificacionMedioTransporte',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
    },
    {
        labelNombre: 'Número de Contenedor:',
        campo: 'numeroDeContenedor',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
    },
    {
        labelNombre: 'Denominación o Razón Social:',
        campo: 'denominacionRazonSocial',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
    },
    {
        labelNombre: 'Número de Flejes:',
        campo: 'numeroFlejes',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
    },
];

/**
 * Esta sección es necesaria para registrar los datos de pago de derechos relacionados con el trámite.
 * @desc Configuración de los campos para la sección "Pago de derechos".
 * @since 2024-06
 * @author Equipo Agricultura
 */
export const DATOS_PAGO_DERECHOS = [
    {
        labelNombre: 'Clave de referencia*:',
        campo: 'claveReferencia',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
        disabled: true
    },
    {
        labelNombre: 'Cadena de la dependencia*:',
        campo: 'cadenaDependencia',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
        disabled: true
    },
    {
        labelNombre: 'Banco',
        campo: 'banco',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [],
    },
    {
        labelNombre: 'Llave de pago*:',
        campo: 'llavePago',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: ''
    },
    {
        labelNombre: 'Fecha de pago',
        campo: 'fechaPago',
        required: true,
        habilitado: true,
    },
    {
        labelNombre: 'Importe de pago*:',
        campo: 'importePago',
        class: 'col-md-12',
        tipo_input: 'text',
        placeholder: '',
        disabled: true
    },
];