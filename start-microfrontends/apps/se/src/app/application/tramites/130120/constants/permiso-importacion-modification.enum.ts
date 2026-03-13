/**
 * Conjunto de constantes de configuración para los campos y catálogos del trámite de Permiso de Importación.
 *
 * Este archivo contiene los arreglos y objetos que definen la estructura, validaciones, catálogos y textos
 * utilizados en los formularios del trámite, incluyendo datos del solicitante, domicilio fiscal, datos de la mercancía,
 * exportador, productor, representación federal y textos de ayuda.
 *
 * @const
 * @export
 * @category Configuración
 * @description
 * Cada constante representa la configuración de un grupo de campos o catálogos para una sección específica del trámite.
 * Incluye validaciones, tipos de entrada, opciones de catálogo y textos HTML para instrucciones.
 *
 * @ejemplo
 * DATOS_GENERALES_SOLICITANTE, DOMICILIO_FISCAL_SOLICITANTE, DATOS_REALIZAR, DATOS_MERCANCIA, DATOS_EXPORTACION,
 * DATOS_PRODUCTOR, DATOS_EXPORTADOR, DATOS_FEDERAL, TEXTOS_REQUISITOS, TEXTOS
 */

/**
 * Configuración de los campos para los datos generales del solicitante.
 */
export const DATOS_GENERALES_SOLICITANTE = [
    {
        labelNombre: 'Registro federal de contribuyentes:',
        campo: 'Registro federal de contribuyentes:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        tooltip: 'Registro federal de contribuyentes:',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Denominación o razón social',
        campo: 'Denominacion o razon social',
        class: 'col-md-8',
        tipo_input: 'text',
        disabled: true,
        tooltip: 'Denominacion o razon social',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Actividad económica preponderante:',
        campo: 'Actividad económica preponderante',
        class: 'col-md-12',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Correo electrónico',
        campo: 'Correo electrónico',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    }
];

/**
 * Configuración de los campos para el domicilio fiscal del solicitante.
 */
export const DOMICILIO_FISCAL_SOLICITANTE = [
    {
        labelNombre: 'País:',
        campo: 'País:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        tooltip: 'País:',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Código postal:',
        campo: 'Código postal',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        tooltip: 'Código postal',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Estado:',
        campo: 'Estado',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Municipio o alcaldía:',
        campo: 'Municipio o alcaldía:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Localidad:',
        campo: 'Localidad:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Colonia:',
        campo: 'Colonia:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Calle:',
        campo: 'Calle:',
        class: 'col-md-8',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Número exterior:',
        campo: 'Número exterior:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Número interior:',
        campo: 'Número interior:',
        class: 'col-md-4',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Lada:',
        campo: 'Lada:',
        class: 'col-md-1',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Teléfono:',
        campo: 'Teléfono:',
        class: 'col-md-3',
        tipo_input: 'text',
        disabled: true,
        validators: ['required'],
        placeholder: '',
    }
];

/**
 * Configuración de los campos para los datos del trámite a realizar.
 */
export const DATOS_REALIZAR = [
    {
        labelNombre: 'Régimen al que destinará la mercancía',
        campo: 'régimen',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [
            { "id": 1, "descripcion": "Definitivos" },
            { "id": 2, "descripcion": "Temporales" },
            { "id": 3, "descripcion": "Depósito Fiscal" },
            { "id": 4, "descripcion": "Tránsito de mercancías" },
            { "id": 5, "descripcion": "Elaboración, transformación o reparación en recinto fiscalizado" },
            { "id": 6, "descripcion": "Recinto fiscalizado estratégico" },
            { "id": 7, "descripcion": "Importación" },
            { "id": 8, "descripcion": "Exportación" },
            { "id": 9, "descripcion": "Tránsito internacional" },
            { "id": 10, "descripcion": "Depósito fiscal de gas licuado de petróleo o de gas natural" },
            { "id": 11, "descripcion": "Depósito fiscal de vehículos" },
            { "id": 12, "descripcion": "Definitivo de importación" },
            { "id": 13, "descripcion": "Temporales de importación para retornar al extranjero en el mismo estado" },
            { "id": 14, "descripcion": "Temporales de importación para elaboración, transformación o reparación para empresas con programa IMMEX" }
        ],
    },
    {
        labelNombre: 'Clasificación de régimen',
        campo: 'classifición_régimen',
        required: true,
        primerOpcion: 'Selecciona un valor',
        catalogos: [
            { "id": 1, "descripcion": "De Importaci¿¿n" },
        ],
    }
];

/**
 * Configuración de los campos para los datos de la mercancía.
 */
export const DATOS_MERCANCIA = [
    {
        labelNombre: 'Descripción de la mercancía*:',
        campo: 'descripción',
        class: 'col-md-8',
        tipo_input: 'textarea',
        validators: ['required', 'maxLength:4000'],
        placeholder: '',
        required: true,
        storeFunction: 'setDescripcion',
    },
    {
        labelNombre: 'Marca(s) comercial(es) y modelo(s)*:',
        campo: 'marca',
        class: 'col-md-8',
        tipo_input: 'text',
        validators: ['required', 'maxLength:256', 'pattern:^[a-zA-Z0-9 ]*$'],
        required: true,
        placeholder: '',
        storeFunction: 'setMarca',
    },
    {
        labelNombre: 'Tipo de aduana de entrada',
        campo: 'tipo_entrada',
        required: true,
        primerOpcion: 'Selecciona un valor',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "Aeroportuaria" },
            { "id": 2, "descripcion": "Fronteriza" },
            { "id": 3, "descripcion": "Interior" },
            { "id": 4, "descripcion": "Maritima" },
            { "id": 5, "descripcion": "Terrestre" },
        ],
        storeFunction: 'setTipoEntrada',
    },
    {
        labelNombre: 'Fracción arancelaria',
        campo: 'fracción',
        required: true,
        primerOpcion: 'Selecciona un valor',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "opción de selección simple uno" },
        ],
        storeFunction: 'setFraccion',
    },
    {
        labelNombre: 'NICO',
        campo: 'nico',
        class: 'col-md-8',
        required: true,
        primerOpcion: 'Selecciona un valor',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "opción de selección simple uno" },
        ],
        storeFunction: 'setNico',
    },
    {
        labelNombre: 'Unidad de medida la tarifa(UMT)',
        campo: 'umt',
        class: 'col-md-4',
        required: true,
        primerOpcion: 'Selecciona un valor',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "opción de selección simple uno" },
        ],
        storeFunction: 'setUmt',
    },
    {
        labelNombre: 'Numero de factura*:',
        campo: 'factura_número',
        class: 'col-md-4',
        tipo_input: 'number',
        validators: ['required', 'maxLength:50', 'pattern:^[0-9]*$'],
        required: true,
        placeholder: '',
        storeFunction: 'setFacturaNumero',
    },
    {
        labelNombre: 'Fecha de factura',
        campo: 'factura_fecha',
        required: true,
        validators: ['required'],
        habilitado: true,
        storeFunction: 'setFacturaFecha',
    },
    {
        labelNombre: 'Unidad de medida de comercialización(UMC)',
        campo: 'umc',
        class: 'col-md-4',
        required: true,
        primerOpcion: 'Selecciona un valor',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "Abastecer combustible" },
            { "id": 2, "descripcion": "Absorcion" },
            { "id": 3, "descripcion": "access line" },
            { "id": 4, "descripcion": "access line" },
            { "id": 5, "descripcion": "accounting unit" },
            { "id": 6, "descripcion": "Aceptacion de las condiciones del negocio" },
            { "id": 7, "descripcion": "acre" },
            { "id": 8, "descripcion": "acre" },
            { "id": 9, "descripcion": "acre-foot (based on U.S. survey foot)" },
            { "id": 10, "descripcion": "active unit" },
            { "id": 11, "descripcion": "active unit" },
            { "id": 12, "descripcion": "activity" },
            { "id": 13, "descripcion": "activity" },
            { "id": 14, "descripcion": "actual ton" }
        ],
        storeFunction: 'setUmc',
    },
    {
        labelNombre: 'Otro UMC:',
        campo: 'otro_umc',
        class: 'col-md-4',
        tipo_input: 'text',
        placeholder: '',
        storeFunction: 'setOtroUmc',
    },
    {
        labelNombre: 'Cantidad UMC*:',
        campo: 'cantidad_umc',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: [
            'required',
            'pattern:^\\d{1,14}(\\.\\d{1,2})?$'
        ],
        placeholder: '',
        required: true,
        storeFunction: 'setCantidadUmc',
    },
    {
        labelNombre: 'Factor de conversión*:',
        campo: 'factor_conversión',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: [
            'required',
            'pattern:^\\d{1,14}(\\.\\d{1,4})?$'
        ],
        placeholder: '',
        required: true,
        storeFunction: 'setFactorConversion',
    },
    {
        labelNombre: 'Cantidad UMT*:',
        campo: 'cantidad_umt',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: [
            'required',
            'pattern:^\\d{1,14}(\\.\\d{1,2})?$'
        ],
        required: true,
        placeholder: '',
        storeFunction: 'setCantidadUmt',
    },
    {
        labelNombre: 'Valor de la factura de la mercancía a importar en términos de la Moneda de Comercialización*:',
        campo: 'valor_factura',
        class: 'col-md-8',
        tipo_input: 'text',
        validators: [
            'required',
            'pattern:^\\d{1,14}(\\.\\d{1,2})?$'
        ],
        required: true,
        placeholder: '',
        storeFunction: 'setValorFactura',
    },
    {
        labelNombre: 'Moneda de comercialización',
        campo: 'moneda_comercialización',
        class: 'col-md-8',
        required: true,
        primerOpcion: 'Selecciona una opcion',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "Kuwaiti Dinar" },
        ],
        storeFunction: 'setMonedaComercializacion',
    },
    {
        labelNombre: 'Valor de la factura en USD de la mercancía a importar*:',
        campo: 'valor_factura_usd',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        required: true,
        placeholder: '',
        storeFunction: 'setValorFacturaUsd',
    },
    {
        labelNombre: 'Precio unitario en USD*:',
        campo: 'precio_unitario_usd',
        class: 'col-md-4',
        tipo_input: 'text',
        required: true,
        validators: ['required'],
        placeholder: '',
        storeFunction: 'setPrecioUnitarioUsd',
    },
    {
        labelNombre: 'País exportador',
        campo: 'país_exportador',
        class: 'col-md-4',
        required: true,
        primerOpcion: 'Selecciona el País',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "Selecciona el país" },
            { "id": 2, "descripcion": "AFGANISTAN (EMIRATO ISLAMICO DE)" },
            { "id": 3, "descripcion": "ALBANIA (REPUBLICA DE)" },
            { "id": 4, "descripcion": "ALEMANIA (REPUBLICA FEDERAL DE)" },
            { "id": 5, "descripcion": "ANDORRA (PRINCIPADO DE)" },
            { "id": 6, "descripcion": "ANGOLA (REPUBLICA DE)" },
            { "id": 7, "descripcion": "ANGUILA" },
            { "id": 8, "descripcion": "ANTARTIDA" },
            { "id": 9, "descripcion": "ANTIGUA Y BARBUDA (COMUNIDAD BRITANICA DE NACIONES)" },
            { "id": 10, "descripcion": "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)" },
            { "id": 11, "descripcion": "ARABIA SAUDITA (REINO DE)" },
            { "id": 12, "descripcion": "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)" },
            { "id": 13, "descripcion": "ARGENTINA (REPUBLICA)" },
            { "id": 14, "descripcion": "ARMENIA (REPUBLICA DE)" },
            { "id": 15, "descripcion": "ARUBA (TERRITORIO HOLANDES DE ULTRAMAR)" },
            { "id": 16, "descripcion": "AUSTRALIA (COMUNIDAD DE)" },
            { "id": 17, "descripcion": "AUSTRIA (REPUBLICA DE)" },
            { "id": 18, "descripcion": "AZERBAIJAN (REPUBLICA AZERBAIJANI)" },
            { "id": 19, "descripcion": "BAHAMAS (COMUNIDAD DE LAS)" },
            { "id": 20, "descripcion": "Kuwaiti Dinar" },
        ],
        storeFunction: 'setPaisExportador',
    },
    {
        labelNombre: 'País origen',
        campo: 'país_origen',
        class: 'col-md-4',
        required: true,
        primerOpcion: 'Selecciona el País',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "Selecciona el país" },
            { "id": 2, "descripcion": "AFGANISTAN (EMIRATO ISLAMICO DE)" },
            { "id": 3, "descripcion": "ALBANIA (REPUBLICA DE)" },
            { "id": 4, "descripcion": "ALEMANIA (REPUBLICA FEDERAL DE)" },
            { "id": 5, "descripcion": "ANDORRA (PRINCIPADO DE)" },
            { "id": 6, "descripcion": "ANGOLA (REPUBLICA DE)" },
            { "id": 7, "descripcion": "ANGUILA" },
            { "id": 8, "descripcion": "ANTARTIDA" },
            { "id": 9, "descripcion": "ANTIGUA Y BARBUDA (COMUNIDAD BRITANICA DE NACIONES)" },
            { "id": 10, "descripcion": "ANTILLAS NEERLANDESAS (TERRITORIO HOLANDES DE ULTRAMAR)" },
            { "id": 11, "descripcion": "ARABIA SAUDITA (REINO DE)" },
            { "id": 12, "descripcion": "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)" },
            { "id": 13, "descripcion": "ARGENTINA (REPUBLICA)" },
            { "id": 14, "descripcion": "ARMENIA (REPUBLICA DE)" },
            { "id": 15, "descripcion": "ARUBA (TERRITORIO HOLANDES DE ULTRAMAR)" },
            { "id": 16, "descripcion": "AUSTRALIA (COMUNIDAD DE)" },
            { "id": 17, "descripcion": "AUSTRIA (REPUBLICA DE)" },
            { "id": 18, "descripcion": "AZERBAIJAN (REPUBLICA AZERBAIJANI)" },
            { "id": 19, "descripcion": "BAHAMAS (COMUNIDAD DE LAS)" },
            { "id": 20, "descripcion": "BAHREIN (REINO DE)" },
            { "id": 21, "descripcion": "Kuwaiti Dinar" },
        ],
        storeFunction: 'setPaisOrigen',
    },
    {
        labelNombre: 'Valor total de la factura en términos de la Moneda de Comercialización*:',
        campo: 'valor_total_factura',
        class: 'col-md-8',
        tipo_input: 'text',
        validators: [
            'required',
            'pattern:^\\d{1,14}(\\.\\d{1,2})?$'
        ],
        placeholder: '',
        required: true,
        storeFunction: 'setValorTotalFactura',
    },
    {
        labelNombre: 'Valor total de la factura USD de la mercancía a importar*:',
        campo: 'valor_total_factura_usd',
        class: 'col-md-8',
        tipo_input: 'number',
        validators: ['required'],
        placeholder: '',
        required: true,
        storeFunction: 'setValorTotalFacturaUsd',
    },
];

/**
 * Configuración de los campos para los datos de exportación.
 */
export const DATOS_EXPORTACION = [
    {
        labelNombre: 'Número de documento*:',
        campo: 'número_documento',
        class: 'col-md-8',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Fecha del documento',
        campo: 'fecha_documento',
        required: true,
        habilitado: true,
    },
    {
        labelNombre: 'Descripción de la mercancía*:',
        campo: 'descripción',
        class: 'col-md-8',
        tipo_input: 'textarea',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Código arancelario*:',
        campo: 'código_arancelario',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
    },
    {
        labelNombre: 'Cantidad en la unidad de medida señalada en el documento de exportación*:',
        campo: 'cantidad_umt',
        class: 'col-md-4',
        tipo_input: 'number',
        validators: ['required', 'maxLength:50', 'pattern:^[0-9]*$'],
        placeholder: '',
    },
    {
        labelNombre: 'Valor en USD de la mercancía a importar*:',
        campo: 'valor_usd',
        class: 'col-md-4',
        tipo_input: 'number',
        validators: ['required', 'maxLength:50', 'pattern:^[0-9]*$'],
        placeholder: '',
    },
    {
        labelNombre: 'Precio unitario en USD*:',
        campo: 'precio_unitario_usd',
        class: 'col-md-4',
        tipo_input: 'number',
        validators: ['required', 'maxLength:50', 'pattern:^[0-9]*$'],
        placeholder: '',
    },
];

/**
 * Configuración de los campos para los datos del productor.
 */
export const DATOS_PRODUCTOR = [
    {
        labelNombre: 'Tipo de persona*:',
        campo: 'persona_tipo',
        required: true,
        options: [],
        selectedValue: 'Física',
    },
    {
        labelNombre: 'Nombre(s)*:',
        campo: 'personales_nombre',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required', 'maxLength:200'],
        placeholder: '',
        availableRadioOptions: ['Física',],
    },
    {
        labelNombre: 'Primer apellido*:',
        campo: 'primer_apellido',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required', 'maxLength:200'],
        placeholder: '',
        availableRadioOptions: ['Física',],
    },
    {
        labelNombre: 'Segundo apellido*:',
        campo: 'segundo_apellido',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required', 'maxLength:200'],
        placeholder: '',
        availableRadioOptions: ['Física',],
    },
    {
        labelNombre: 'Denominación o razón social*',
        campo: 'denominación_razón_social',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required', 'maxLength:250'],
        placeholder: '',
        availableRadioOptions: ['Moral'],
    },
    {
        labelNombre: 'Domicilio*:',
        campo: 'domicilio',
        class: 'col-md-4',
        tipo_input: 'textarea',
        validators: ['required', 'maxLength:200'],
        placeholder: '',
        availableRadioOptions: ['Física', 'Moral', 'Ninguno'],
    },
];

/**
 * Configuración de los campos para los datos del exportador.
 */
export const DATOS_EXPORTADOR = [
    {
        labelNombre: 'Tipo de persona',
        campo: 'persona_tipo',
        required: true,
        options: [],
        selectedValue: 'Física',
    },
    {
        labelNombre: 'Nombre(s)*:',
        campo: 'personales_nombre',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
        availableRadioOptions: ['Física',],
    },
    {
        labelNombre: 'Primer apellido*:',
        campo: 'primer_apellido',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
        availableRadioOptions: ['Física',],
    },
    {
        labelNombre: 'Segundo apellido*:',
        campo: 'segundo_apellido',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
        availableRadioOptions: ['Física',],
    },
    {
        labelNombre: 'Denominación o razón social*',
        campo: 'denominación_razón_social',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
        availableRadioOptions: ['Moral'],
    },
    {
        labelNombre: 'Domicilio:',
        campo: 'domicilio',
        class: 'col-md-4',
        tipo_input: 'textarea',
        validators: ['required'],
        placeholder: '',
        availableRadioOptions: ['Física', 'Moral'],
    },
    {
        labelNombre: 'Observaciones:',
        campo: 'observaciones',
        class: 'col-md-4',
        tipo_input: 'text',
        validators: ['required'],
        placeholder: '',
        availableRadioOptions: ['Física', 'Moral'],
    },
];

/**
 * Configuración de los campos para la representación federal.
 */
export const DATOS_FEDERAL = [
    {
        labelNombre: 'Entidad Federativa',
        campo: 'entidad_federativa',
        class: 'col-md-8',
        required: true,
        primerOpcion: 'Seleccione una opción',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "Aguascalientes" },
            { "id": 2, "descripcion": "Baja California" },
            { "id": 3, "descripcion": "Baja California Sur" },
            { "id": 4, "descripcion": "Campeche" },
            { "id": 5, "descripcion": "Chiapas" },
            { "id": 6, "descripcion": "Chihuahua" },
            { "id": 7, "descripcion": "Ciudad de México" },
            { "id": 8, "descripcion": "Coahuila" },
            { "id": 9, "descripcion": "Colima" },
            { "id": 10, "descripcion": "Durango" },
        ],
    },
    {
        labelNombre: 'Representación federal',
        campo: 'representacion_federal',
        class: 'col-md-8',
        required: true,
        primerOpcion: 'Seleccione una opción',
        validators: ['required'],
        catalogos: [
            { "id": 1, "descripcion": "MEXICALI" },
            { "id": 2, "descripcion": "TIJUANAN" },
            { "id": 3, "descripcion": "LAP AZ" }
        ],
    },
];

/**
 * Textos HTML para los requisitos del trámite.
 */
export const TEXTOS_REQUISITOS = {
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo".</p>`,
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
};

/**
 * Textos HTML generales para instrucciones y adjuntar documentos.
 */
export const TEXTOS = {
    INSTRUCCIONES: `<h6>Instrucciones</h6>
    <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
    <p>- En caso de que no requieras algún documento, selecciónalo y elíminalo</p>
    <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista.</p>`,
    ADJUNTAR: `<p>Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar dcumentos"</p>`,
};


export const FECHA_FACTURA = {
    labelNombre: 'Fecha de factura',
    required: true,
    habilitado: true,
};

export const FECHA_DOCUMENTO = {
    labelNombre: 'Fecha del documento',
    required: true,
    habilitado: true,
};

/**
 * Enum para definir los tipos de persona disponibles en el sistema.
 * @enum {string}
 */
export enum TIPO_PERSONA {
    /** Persona física */
    FISICA = 'Física',
    /** Persona moral */
    MORAL = 'Moral',
    /** Ninguno */
    NINGUNO = 'Ninguno'
}

export const OPCION_DE_RADIO = [
    {
        /**
         * Etiqueta para persona física.
         * @type {string}
         */
        "label": "Física",
        /**
         * Valor para persona física.
         * @type {string}
         */
        "value": "Física"
    },
    {
        /**
         * Etiqueta para persona moral.
         * @type {string}
         */
        "label": "Moral",
        /**
         * Valor para persona moral.
         * @type {string}
         */
        "value": "Moral"
    },
    {
        "label": "Ninguno",
        "value": "Ninguno"
    }
];

export const OPCION_DE_RADIO_EXPORTADOR = [
    {
        /**
         * Etiqueta para persona física.
         * @type {string}
         */
        "label": "Física",
        /**
         * Valor para persona física.
         * @type {string}
         */
        "value": "Física"
    },
    {
        /**
         * Etiqueta para persona moral.
         * @type {string}
         */
        "label": "Moral",
        /**
         * Valor para persona moral.
         * @type {string}
         */
        "value": "Moral"
    }
];

/**
 * Textos HTML para mensajes de error en el formulario.
 */
export const ERROR_FORMA_FALTAN = `
    <p class="text-danger m-0">Favor de verificar los campos que marcan error.</p>
`;

/**
 * Textos HTML para mensajes de error en el formulario.
 */
export const ERROR_FORMA_ALERT = `
    <p class="m-0">Corrija los siguientes errores:</p>
    <p class="text-danger m-0">Debe seleccionar una constancia de registro.</p>
`;

