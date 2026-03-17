/**
 * Interfaces y tipos utilizados en el trámite 220701 para la importación de acuicultura.
 *
 * Este archivo contiene todas las interfaces y tipos TypeScript necesarios para manejar
 * el flujo de datos del trámite de importación de productos acuícolas, incluyendo
 * la configuración de pasos del wizard, formularios de pago, movilización y mercancía.
 */

/**
 * Interfaz que define la estructura de los pasos en un componente tipo wizard.
 *
 * Cada paso del wizard contiene información sobre su estado actual y posición
 * en el flujo del proceso de importación.
 *
 * @interface ListaPasosWizard220701
 */
export interface ListaPasosWizard220701 {
    /**
     * Índice del paso en el flujo del wizard.
     *
     * @property {number} indice
     * Número que identifica la posición del paso.
     */
    indice: number;

    /**
     * Título descriptivo del paso.
     *
     * @property {string} titulo
     * Texto que describe la acción o contenido del paso.
     */
    titulo: string;

    /**
     * Estado de activación del paso.
     *
     * @property {boolean} activo
     * Indica si el paso está activo y puede ser accedido por el usuario.
     */
    activo: boolean;

    /**
     * Estado de completitud del paso.
     *
     * @property {boolean} completado
     * Indica si el paso ha sido completado exitosamente.
     */
    completado: boolean;
}

/**
 * Interfaz que define la estructura de las acciones de los botones.
 *
 * Define el comportamiento y valores asociados a las acciones que pueden
 * ser ejecutadas a través de botones en la interfaz de usuario.
 *
 * @interface AccionBoton
 */
export interface AccionBoton {
    /**
     * Tipo de acción a ejecutar.
     *
     * @property {string} accion
     * Identifica el tipo de acción del botón (ej: 'siguiente', 'anterior', 'guardar').
     */
    accion: string;

    /**
     * Valor numérico asociado a la acción.
     *
     * @property {number} valor
     * Valor que acompaña la acción, típicamente un índice de paso o identificador.
     */
    valor: number;
}

/**
 * Interfaz que define la estructura de las opciones de un radio button.
 *
 * Establece la configuración para elementos de tipo radio button,
 * definiendo tanto el texto visible como el valor interno.
 *
 * @interface OpcionDeRadio
 */
export interface OpcionDeRadio {
    /**
     * Etiqueta visible para la opción de radio.
     *
     * @property {string} label
     * Texto que se muestra al usuario para identificar la opción.
     */
    label: string;

    /**
     * Valor interno de la opción de radio.
     *
     * @property {string} value
     * Valor que se asigna cuando la opción es seleccionada.
     */
    value: string;
}


/**
 * Interfaz que define los datos completos de mercancía para el trámite 220701.
 *
 * Agrupa toda la información relacionada con la mercancía a importar,
 * incluyendo datos del trámite, especificaciones de la mercancía y detalles adicionales.
 *
 * @interface DatosMercancia220701
 */
export interface DatosMercancia220701 {
    /**
     * Grupo de datos para realizar el trámite.
     *
     * @property {RealizarGroup} realizarGroup
     * Contiene información sobre aduanas, oficinas de inspección y documentación del trámite.
     */
    realizarGroup: RealizarGroup;

    /**
     * Grupo de datos específicos de la mercancía.
     *
     * @property {MercanciaGroup} mercanciaGroup
     * Incluye clasificaciones arancelarias, descripciones y características de la mercancía.
     */
    mercanciaGroup: MercanciaGroup;

    /**
     * Detalles adicionales de la mercancía.
     *
     * @property {Detalles} detalles
     * Información complementaria específica del producto.
     */
    detalles: Detalles;
}

/**
 * Interfaz que define los datos para realizar el trámite de importación.
 *
 * Contiene la información administrativa y logística necesaria para
 * el procesamiento del trámite de importación en las diferentes instancias.
 *
 * @interface RealizarGroup
 */
export interface RealizarGroup {
    /**
     * Aduana de ingreso seleccionada para el trámite.
     *
     * @property {string} aduanaIngreso
     * Código o identificador de la aduana por donde ingresará la mercancía.
     */
    aduanaIngreso: string;

    /**
     * Oficina de inspección asignada.
     *
     * @property {string} oficinaInspeccion
     * Identificador de la oficina responsable de la inspección de la mercancía.
     */
    oficinaInspeccion: string;

    /**
     * Punto de inspección específico.
     *
     * @property {string} puntoInspeccion
     * Ubicación exacta donde se realizará la inspección física de la mercancía.
     */
    puntoInspeccion: string;

    /**
     * Número de guía del transporte.
     *
     * @property {string} numeroGuia
     * Identificador único del documento de transporte de la mercancía.
     */
    numeroGuia: string;

    /**
     * Régimen aduanero aplicable.
     *
     * @property {string} regimen
     * Tipo de régimen bajo el cual se clasifica la importación.
     */
    regimen: string;
}

/**
 * Interfaz que define los datos específicos de la mercancía a importar.
 *
 * Contiene toda la información técnica, comercial y regulatoria
 * necesaria para la clasificación e identificación de la mercancía.
 *
 * @interface MercanciaGroup
 */
export interface MercanciaGroup {
    /**
     * Tipo de requisito aplicable a la mercancía.
     *
     * @property {string} tipoRequisito
     * Categoría del requisito sanitario o fitosanitario que debe cumplir la mercancía.
     */
    tipoRequisito: string;

    /**
     * Requisito específico que debe cumplir la mercancía.
     *
     * @property {string} requisito
     * Descripción detallada del requisito particular aplicable.
     */
    requisito: string;

    /**
     * Número del certificado internacional requerido.
     *
     * @property {string} numeroCertificadoInternacional
     * Identificador del certificado sanitario o fitosanitario internacional.
     */
    numeroCertificadoInternacional: string;

    /**
     * Número de oficio para casos especiales.
     *
     * @property {string} numeroOficioCasoEspecial
     * Referencia del documento oficial para situaciones particulares.
     */
    numeroOficioCasoEspecial: string;

    /**
     * Fracción arancelaria de la mercancía.
     *
     * @property {string} fraccionArancelaria
     * Código de clasificación arancelaria según el Sistema Armonizado.
     */
    fraccionArancelaria: string;

    /**
     * Descripción de la fracción arancelaria.
     *
     * @property {string} descripcionFraccionArancelaria
     * Texto descriptivo correspondiente al código arancelario.
     */
    descripcionFraccionArancelaria: string;

    /**
     * Código NICO (Nomenclatura de Identificación Comercial).
     *
     * @property {string} nico
     * Identificador específico del producto en el sistema de nomenclatura comercial.
     */
    nico: string;

    /**
     * Descripción del código NICO.
     *
     * @property {string} descripcionNico
     * Texto explicativo del código de nomenclatura comercial.
     */
    descripcionNico: string;

    /**
     * Descripción general de la mercancía.
     *
     * @property {string} descripcion
     * Descripción comercial detallada del producto a importar.
     */
    descripcion: string;

    /**
     * Cantidad en Unidad de Medida de Tarifa.
     *
     * @property {string} cantidadUMT
     * Cantidad del producto expresada en la unidad oficial para efectos arancelarios.
     */
    cantidadUMT: string;

    /**
     * Unidad de Medida de Tarifa.
     *
     * @property {string} umt
     * Unidad oficial utilizada para la clasificación arancelaria (kg, piezas, etc.).
     */
    umt: string;

    /**
     * Cantidad en Unidad de Medida Comercial.
     *
     * @property {string} cantidadUMC
     * Cantidad del producto en términos comerciales habituales.
     */
    cantidadUMC: string;

    /**
     * Unidad de Medida Comercial.
     *
     * @property {string} umc
     * Unidad utilizada comercialmente para la venta del producto.
     */
    umc: string;

    /**
     * Uso destinado para la mercancía.
     *
     * @property {string} uso
     * Finalidad o aplicación prevista del producto importado.
     */
    uso: string;

    /**
     * Número del lote de la mercancía.
     *
     * @property {string} numeroDeLote
     * Identificador del lote de producción o fabricación del producto.
     */
    numeroDeLote: string;

    /**
     * Fase de desarrollo del producto.
     *
     * @property {string} faseDeDesarrollo
     * Estado de madurez o procesamiento del producto acuícola.
     */
    faseDeDesarrollo: string;

    /**
     * Especie del producto.
     *
     * @property {string} especie
     * Identificación de la especie acuícola específica del producto.
     */
    especie: string;

    /**
     * País de origen de la mercancía.
     *
     * @property {string} paisDeOrigen
     * País donde fue producida o cultivada originalmente la mercancía.
     */
    paisDeOrigen: string;

    /**
     * País de procedencia de la mercancía.
     *
     * @property {string} paisDeProcedencia
     * País desde el cual se embarca directamente la mercancía hacia México.
     */
    paisDeProcedencia: string;
}

/**
 * Interfaz que define los detalles específicos adicionales de la mercancía.
 *
 * Contiene información científica y técnica complementaria
 * que es requerida para productos biológicos y acuícolas.
 *
 * @interface Detalles
 */
export interface Detalles {
    /**
     * Nombre científico del producto.
     *
     * @property {string} nombreCientifico
     * Denominación científica binomial de la especie acuícola o biológica.
     */
    nombreCientifico: string;
}

/**
 * Interfaz que define los datos del formulario de movilización.
 *
 * Establece la información relacionada con el transporte y traslado
 * de la mercancía durante el proceso de importación.
 *
 * @interface FormularioMovilizacion
 */
export interface FormularioMovilizacion {
    /**
     * Medio de transporte utilizado.
     *
     * @property {string} medioDeTransporte
     * Tipo de transporte empleado (terrestre, marítimo, aéreo).
     */
    medioDeTransporte: string;

    /**
     * Identificación del vehículo o medio de transporte.
     *
     * @property {string} identificacionTransporte
     * Número de placas, matrícula o identificador único del vehículo transportador.
     */
    identificacionTransporte: string;

    /**
     * Punto de verificación establecido.
     *
     * @property {string} puntoVerificacion
     * Ubicación designada para la verificación de la mercancía y documentación.
     */
    puntoVerificacion: string;

    /**
     * Nombre de la empresa transportista.
     *
     * @property {string} nombreEmpresaTransportista
     * Razón social de la compañía responsable del transporte de la mercancía.
     */
    nombreEmpresaTransportista: string;
}

/**
 * Interfaz que define los datos del formulario de pago.
 *
 * Contiene toda la información financiera y de facturación
 * relacionada con el pago de derechos del trámite de importación.
 *
 * @interface FormularioPago
 */
export interface FormularioPago {
    /**
     * Estado de exención de pago.
     *
     * @property {string} exentoPago
     * Indica si el trámite está exento del pago de derechos.
     */
    exentoPago: string;

    /**
     * Justificación para la exención de pago.
     *
     * @property {string} justificacion
     * Razón legal o reglamentaria que sustenta la exención de pago (si aplica).
     */
    justificacion: string;

    /**
     * Clave de referencia del pago.
     *
     * @property {string} claveReferencia
     * Código único que identifica la transacción de pago en el sistema.
     */
    claveReferencia: string;

    /**
     * Cadena de dependencia asociada al pago.
     *
     * @property {string} cadenaDependencia
     * Identificador de la dependencia gubernamental receptora del pago.
     */
    cadenaDependencia: string;

    /**
     * Institución bancaria donde se realizó el pago.
     *
     * @property {string} banco
     * Nombre o código de la institución financiera utilizada para el pago.
     */
    banco: string;

    /**
     * Llave o número de confirmación del pago.
     *
     * @property {string} llavePago
     * Código de autorización o confirmación proporcionado por el banco.
     */
    llavePago: string;

    /**
     * Fecha en que se realizó el pago.
     *
     * @property {string} fechaPago
     * Fecha de ejecución de la transacción de pago.
     */
    fechaPago: string;

    /**
     * Importe total del pago realizado.
     *
     * @property {string} importePago
     * Cantidad monetaria total pagada por los derechos del trámite.
     */
    importePago: string;

    /**
     * Fecha de emisión de la factura.
     *
     * @property {string} fechaFactura
     * Fecha en que fue emitido el comprobante fiscal correspondiente al pago.
     */
    fechaFactura: string;
}
/**
 * Interfaz que define el estado de validación de los datos a enviar.
 *
 * Establece los indicadores de validez para cada sección del formulario,
 * permitiendo controlar el flujo de envío de la solicitud.
 *
 * @interface EnviarDatos
 */
export interface EnviarDatos {
    /**
     * Estado de validez del formulario de pago.
     *
     * @property {boolean} pagoDeformaValida
     * Indica si todos los campos del formulario de pago contienen datos válidos.
     */
    pagoDeformaValida: boolean;

    /**
     * Estado de validez de los datos de movilización.
     *
     * @property {boolean} dataParaMovilizacion
     * Indica si la información de transporte y movilización es válida y completa.
     */
    dataParaMovilizacion: boolean;

    /**
     * Estado de validez de los datos de la solicitud.
     *
     * @property {boolean} dataDeLaSolicitud
     * Indica si todos los datos de la solicitud principal son válidos y están completos.
     */
    dataDeLaSolicitud: boolean;
}

/**
 * Interfaz principal que agrupa todos los formularios y datos del trámite de agricultura.
 *
 * Estructura central que consolida toda la información requerida para
 * el procesamiento completo del trámite de importación de productos acuícolas.
 *
 * @interface Agricultura
 */
export interface Agricultura {
    /**
     * Datos del formulario de pago.
     *
     * @property {FormularioPago} formularioPago
     * Información completa sobre el pago de derechos y facturación del trámite.
     */
    formularioPago: FormularioPago;

    /**
     * Datos del formulario de movilización.
     *
     * @property {FormularioMovilizacion} formularioMovilizacion
     * Información sobre el transporte y traslado de la mercancía.
     */
    formularioMovilizacion: FormularioMovilizacion;

    /**
     * Datos completos de la mercancía.
     *
     * @property {DatosMercancia220701} datosMercancia
     * Toda la información técnica, comercial y regulatoria de la mercancía a importar.
     */
    datosMercancia: DatosMercancia220701;

    /**
     * Estado de validación de los formularios.
     *
     * @property {EnviarDatos} formaValida
     * Indicadores de validez para cada sección del formulario de solicitud.
     */
    formaValida: EnviarDatos;
}

/**
 * Función factory que crea un estado inicial para los datos del trámite de agricultura.
 *
 * Proporciona una instancia completa del objeto Agricultura con todos los campos
 * inicializados con valores por defecto, permitiendo la configuración opcional
 * de propiedades específicas a través de parámetros.
 *
 * @function createDatosState
 * @param {Partial<Agricultura>} params - Parámetros opcionales para inicializar el estado.
 * @returns {Agricultura} Objeto con todos los formularios y datos inicializados con valores por defecto.
 *
 * @example
 * ```typescript
 * // Crear estado completamente vacío
 * const estadoInicial = createDatosState();
 *
 * // Crear estado con algunos valores predefinidos
 * const estadoConDatos = createDatosState({
 *   formularioPago: {
 *     exentoPago: 'SI',
 *     justificacion: 'Exención por ley especial'
 *   }
 * });
 * ```
 */
export function createDatosState(params: Partial<Agricultura> = {}): Agricultura {
    return {
        formularioPago: params.formularioPago || {
            exentoPago: '',
            justificacion: '',
            claveReferencia: '',
            cadenaDependencia: '',
            banco: '',
            llavePago: '',
            fechaPago: '',
            importePago: '',
            fechaFactura: ''
        },
        formularioMovilizacion: params.formularioMovilizacion || {
            medioDeTransporte: '',
            identificacionTransporte: '',
            puntoVerificacion: '',
            nombreEmpresaTransportista: ''
        },
        datosMercancia: params?.datosMercancia || {
            realizarGroup: {
                aduanaIngreso: '',
                oficinaInspeccion: '',
                puntoInspeccion: '',
                numeroGuia: '',
                regimen: ''
            },
            mercanciaGroup: {
                tipoRequisito: '',
                requisito: '',
                numeroCertificadoInternacional: '',
                numeroOficioCasoEspecial: '',
                fraccionArancelaria: '',
                descripcionFraccionArancelaria: '',
                nico: '',
                descripcionNico: '',
                descripcion: '',
                cantidadUMT: '',
                umt: '',
                cantidadUMC: '',
                umc: '',
                uso: '',
                numeroDeLote: '',
                faseDeDesarrollo: '',
                especie: '',
                paisDeOrigen: '',
                paisDeProcedencia: ''
            },
            detalles: {
                nombreCientifico: ''
            },
        },
        formaValida: params?.formaValida || {
            pagoDeformaValida: false,
            dataParaMovilizacion: false,
            dataDeLaSolicitud: false
        }
    };
}