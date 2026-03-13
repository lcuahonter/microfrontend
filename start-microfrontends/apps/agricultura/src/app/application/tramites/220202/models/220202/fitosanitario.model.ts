import { CROSLISTA_DE_DATOS } from '../../constantes/220202/fitosanitario.enums';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { DetalleVidaSilvestre, Sensible } from '../../../../shared/models/datos-de-la-solicitue.model';
import { PersonaTerceros } from '@libs/shared/data-access-user/src';


/**
 * Representa una lista de pasos en un asistente (wizard).
 */
export interface ListaPasosWizard {
    /**
     * Índice del paso dentro del asistente.
     * Este valor indica la posición del paso en la secuencia.
     */
    indice: number;

    /**
     * Título descriptivo del paso.
     * Este texto se utiliza para mostrar el nombre o descripción del paso en la interfaz de usuario.
     */
    titulo: string;

    /**
     * Indica si el paso está activo.
     * Un paso activo es el que actualmente está seleccionado o en progreso.
     */
    activo: boolean;

    /**
     * Indica si el paso ha sido completado.
     * Un paso completado es aquel que ya ha sido finalizado por el usuario.
     */
    completado: boolean;
}

/**
 * Representa una acción asociada a un botón en la interfaz de usuario.
 */
export interface AccionBoton {
    /**
     * Especifica el tipo de acción que se realizará al interactuar con el botón.
     * @example "guardar", "eliminar", "editar"
     */
    accion: string;

    /**
     * Representa un valor numérico asociado a la acción del botón.
     * Este valor puede ser utilizado para identificar o parametrizar la acción.
     * @example 1, 2, 3
     */
    valor: number;
}

/**
 * Interfaz que define la estructura de los datos para una tabla.
 */
export interface DatosDeTabla {
    /** Código de respuesta. */
    code: number;

    /** Array de datos de las filas de la tabla. */
    data: DatosDeFila[];

    /** Mensaje de respuesta. */
    message: string;
}

/**
 * Representa los datos de una fila en el modelo fitosanitario.
 */
export interface DatosDeFila {
    /**
     * Fecha de creación de la fila.
     * Representada como una cadena en formato ISO 8601.
     */
    fechaCreacion: string;

    /**
     * Nombre de la mercancía asociada a la fila.
     */
    mercancia: string;

    /**
     * Cantidad de la mercancía especificada.
     * Representada como un número.
     */
    cantidad: number;

    /**
     * Nombre del proveedor de la mercancía.
     */
    proveedor: string;
}

/**
 * Interfaz que representa los datos finales necesarios para el envío de información.
 */
export interface FinalEnviar {
    /**
     * Indica si los datos del formulario han sido validados correctamente.
     */
    datosFormaValidacion: boolean;

    /**
     * Indica si la validación de la movilización ha sido realizada correctamente.
     */
    movilizacionValidacion: boolean;

    /**
     * Indica si el formulario de pago ha sido validado correctamente.
     */
    validaciondeFormulariodePago: boolean;
}

/**
 * @interface ListaDeDatosFinal
 * @description
 * Interfaz que agrupa los datos principales, información de movilización y pago.
 *
 * @property {DatosForma} datos - Información de los productos y mercancías.
 * @property {Movilizacion} movilizacion - Datos relacionados con el transporte.
 * @property {PagoForm} pago - Datos de pago asociados a la transacción.
 */
export interface ListaDeDatosFinal {
    /**
     * Datos relacionados con la forma o formulario.
     */
    datos: DatosForma;

    /**
     * Información sobre la movilización.
     */
    movilizacion: Movilizacion;

    /**
     * Información del formulario de pago.
     */
    pago: PagoDeDerechos;

    /**
     * Datos finales preparados para enviar.
     */
    finalEnviar: FinalEnviar;

    /**
     * Arreglo de filas de solicitud para la tabla de datos.
     */
    tablaDatos: FilaSolicitud[];

    /**
     * Fila de solicitud seleccionada actualmente.
     */
    selectedDatos: FilaSolicitud[];

    /**
     * Arreglo de personas terceros asociadas.
     */
    personas: PersonaTerceros[];

    /**
     * Lista de terceros relacionados con la solicitud.
     */
    tercerosRelacionados: TercerosrelacionadosdestinoTable[];

    /**
     * Datos de la forma relacionados con terceros.
     */
    datosForma: TercerosrelacionadosExportadorTable[];

    /**
     * que deben ser considerados para operaciones de uso compartido o validaciones cruzadas.
     * @type {string[]}
     */
    usoCrossListDatos: string[];

      seletedTerceros: TercerosrelacionadosdestinoTable;
      seletedExdora: TercerosrelacionadosExportadorTable;
}

/**
 * Representa la información relacionada con la movilización de bienes o productos.
 */
export interface Movilizacion {
    /**
     * El tipo de transporte utilizado para la movilización.
     * Puede ser terrestre, marítimo, aéreo, entre otros.
     */
    transporte: string;

    /**
     * Identificación única de la guía asociada a la movilización.
     * Este valor es utilizado para rastrear y verificar el transporte.
     */
    identificacion: string;

    /**
     * Medio específico de transporte utilizado.
     * Ejemplo: camión, barco, avión, etc.
     */
    puntoVerificacion: string;

    /**
     * Nombre de la empresa encargada del transporte.
     * Representa la entidad responsable de la movilización.
     */
    empresaTransportista: string;


}

/**
 * Representa la información relacionada con un pago realizado en el sistema.
 */
export interface PagoForm {
    /** Indica si el pago está exento. */
    exentoPago: string;

    /** Justificación para la exención o detalles adicionales del pago. */
    justificacion: string;

    /** Clave de referencia asociada al pago. */
    claveReferencia: string;

    /** Cadena que identifica la dependencia relacionada con el pago. */
    cadenaDependencia: string;

    /** Nombre del banco donde se realizó el pago. */
    banco: string;

    /** Llave única que identifica el pago. */
    llavePago: string;

    /** Monto total pagado. */
    importePago: string;

    /** Fecha en la que se realizó el pago. */
    fechaDePago: string;

    /** Fecha de inicio ingresada para el pago. */
    fechaInicioInput: string;

    /** Fecha efectiva del pago. */
    fechaPago: string;
}

/**
 * Representa la información de una mercancía en el sistema.
 */
export interface Mercancia {
    /**
     * Indica si la mercancía está seleccionada.
     * @example "true" o "false"
     */
    seleccionado: string;

    /**
     * Número de partida de la mercancía.
     * @example "123456"
     */
    noPartida: string;

    /**
     * Tipo de requisito asociado a la mercancía.
     * @example "Sanitario", "Fitosanitario"
     */
    tipoRequisito: string;

    /**
     * Descripción del requisito asociado a la mercancía.
     * @example "Certificado de inspección"
     */
    requisito: string;

    /**
     * Número del certificado internacional relacionado con la mercancía.
     * @example "INT-2023-001"
     */
    numCertificadoInternacional: string;

    /**
     * Fracción arancelaria de la mercancía.
     * @example "0101.21.00"
     */
    fraccionArancelaria: string;

    /**
     * Descripción de la fracción arancelaria.
     * @example "Caballos pura sangre para reproducción"
     */
    descFraccion: string;

    /**
     * Número de Identificación Comercial (NICO) de la mercancía.
     * @example "NICO-12345"
     */
    nico: string;
}

/**
 * Representa los datos de un formulario fitosanitario.
 */
export interface DatosForma {
    /**
     * Aduana de ingreso donde se realizará el trámite.
     */
    aduanaDeIngreso?: string;

    /**
     * Oficina de inspección asignada para la revisión.
     */
    oficinaDeInspeccion: string;

    /**
     * Punto de inspección donde se llevará a cabo la verificación.
     */
    puntoDeInspeccion: string;

    /**
     * Número de guía asociado al trámite (opcional).
     */
    numeroDeGuia?: string;

    /**
     * Régimen aduanero aplicable al trámite.
     */
    regimen: string;

    /**
     * Número del carro utilizado para el transporte (opcional).
     */
    numeroDeCarro?: string;

    /**
     * Tipo de mercancía relacionada con el trámite (opcional).
     */
    tipoMercancia?: string;
}

/**
 * Representa una fila de solicitud en el modelo fitosanitario.
 */
export interface FilaSolicitud {
    [key: string]: unknown;
    /**
     * ID de la fila, puede ser un número o un booleano para indicar si es nuevo
     */
    id: number | boolean;

    /**
     * Número de partida asociado a la solicitud.
     */
    noPartida: string;

    /**
     * Tipo de requisito relacionado con la solicitud.
     */
    tipoRequisito?: string;

    /**
     * Descripción del requisito solicitado.
     */
    requisito: string;

    /**
    * Descripción del requisito solicitado.
    */
    descripcionTipoRequisito?: string;

    /**
     * Número del certificado internacional asociado.
     */
    numeroCertificadoInternacional: string;

    /**
     * Fracción arancelaria correspondiente al producto.
     */
    fraccionArancelaria: string;

    /**
     * Descripción de la fracción arancelaria.
     */
    descripcionFraccion: string;

    /**
     * id de la Descripción de la fracción arancelaria.
     */
    idDescripcionFraccion: number;

    /**
     * Número de Identificación Comercial (NICO) del producto.
     */
    nico: string;

    /**
     * Descripción del Número de Identificación Comercial (NICO).
     */
    descripcionNico: string;

    /**
     * Descripción general del producto.
     */
    descripcion: string;

    /**
     * Unidad de medida de transporte (UMT) utilizada.
     */
    umt: string;

    /**
    * Desripcion de la unidad de medida de transporte (UMT) utilizada.
    */
    descripcionUMT?: string;

    /**
     * Cantidad en la unidad de medida de transporte (UMT).
     */
    cantidadUMT: string | number;

    /**
     * Unidad de medida de comercialización (UMC) utilizada.
     */
    umc: string;

    /**
    * Desripcion de la unidad de medida de comercialización (UMC) utilizada.
    */
    descripcionUMC?: string;

    /**
     * Cantidad en la unidad de medida de comercialización (UMC).
     */
    cantidadUMC: string | number;

    /**
     * Uso previsto del producto.
     */
    uso: string;

  /**
   * descripcion del Uso previsto del producto.
   */
    descripcionUso?: string;

    /**
     * Tipo de producto especificado en la solicitud.
     */
    tipoDeProducto: number;

    /**
     * Descripción del tipo de producto.
     * */
    descripcionTipoDeProducto?: string;

    /**
     * Número de lote asociado al producto.
     */
    numeroDeLote: string;

    /**
     * País de origen del producto.
     */
    paisDeOrigen: string;

    /**
     * Nombre del país de origen del producto.
     */
    descripcionPaisDeOrigen?: string;

    /**
     * País de procedencia del producto.
     */
    paisDeProcedencia: string;

    /**
     * País de procedencia del producto.
     */
    descripcionPaisDeProcedencia?: string;

    /**
     * Certificado internacional electrónico asociado al producto.
     */
    certificadoInternacionalElectronico: string;

  /**
   * Detalle de mercancia para fitosanitario.
   */
  detalleVidaSilvestre?: DetalleVidaSilvestre[];
}

/**
 * Representa la información relacionada con el pago de derechos.
 */
export interface PagoDeDerechos {
    /**
     * Indica si el pago está exento.
     * @example "si" o "no"
     */
    exentoPago: string;

    /**
     * Justificación para la exención del pago.
     * @example "Exención por convenio especial"
     */
    justificacion: string;

    /**
     * Clave de referencia asociada al pago.
     * @example "REF123456789"
     */
    claveReferencia: string;

    /**
     * Cadena que identifica a la dependencia relacionada con el pago.
     * @example "Dependencia XYZ"
     */
    cadenaDependencia: string;

    /**
     * Nombre del banco donde se realizó el pago.
     * @example "Banco Nacional"
     */
    banco: string;

    /**
     * Llave única que identifica el pago.
     * @example "LLAVE123456"
     */
    llavePago: string;

    /**
     * Importe total del pago realizado.
     * @example "1500.00"
     */
    importePago: string;

    /**
     * Fecha en la que se realizó el pago.
     * @example "2023-10-05"
     */
    fechaPago: string;
}

/**
 * Representa una fila de la tabla de solicitudes en el sistema.
 */
export interface SolicitudFilaTabla {
    /**
     * Fecha de creación de la solicitud.
     * Formato esperado: cadena de texto que representa una fecha.
     */
    fechaCreacion: string;

    /**
     * Nombre de la mercancía asociada a la solicitud.
     */
    mercancia: string;

    /**
     * Cantidad de mercancía solicitada.
     * Representada como un número.
     */
    cantidad: number;

    /**
     * Nombre del proveedor de la mercancía.
     */
    proveedor: string;
}

/**
 * Representa una fila de la tabla de solicitudes en el sistema.
 */
export interface SolicitudData {
    id?: number;

    /**
     * Identificador de la solicitud.
     */
    id_solicitud?: string;
    /**
     * Fecha en la que se creó la solicitud.
     */
    fecha_creacion: string;
    /**
     * Nombre o descripción de la mercancía solicitada.
     */
    mercancia: string;
    /**
     * Cantidad de mercancía solicitada.
     */
    cantidad: number;
    /**
     * Nombre del proveedor de la mercancía.
     */
    proveedor: string;
}

/**
 * Representa la información del solicitante para la consulta de un trámite fitosanitario.
 */
export interface ConsultaioSolicitante {
    /**
     * El folio único que identifica el trámite.
     * @example "FT-123456789"
     */
    folioDelTramite: string;

    /**
     * La fecha en la que se inició el trámite.
     * Formato esperado: "YYYY-MM-DD".
     * @example "2023-01-15"
     */
    fechaDeInicio: string;

    /**
     * El estado actual del trámite.
     * Puede representar estados como "En Proceso", "Completado", "Cancelado", etc.
     * @example "En Proceso"
     */
    estadoDelTramite: string;
}

/**
 * Devuelve el valor proporcionado si no es `undefined` ni `null`; de lo contrario, retorna el valor por defecto especificado.
 *
 * @param value - El valor que se desea comprobar.
 * @param defaultValue - El valor por defecto que se retornará si `value` es `undefined` o `null`.
 * @returns El valor original si está definido, o el valor por defecto en caso contrario.
 */
export function getDefaultValue(
    value: string | undefined,
    defaultValue: string
): string {
    return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * Devuelve el valor proporcionado si no es `undefined` ni `null`, de lo contrario retorna el valor por defecto.
 *
 * @param value - El valor a evaluar.
 * @param defaultValue - El valor por defecto a retornar si `value` es `undefined` o `null`.
 * @returns El valor de `value` si está definido y no es nulo, de lo contrario `defaultValue`.
 */
export function finalEnviar(value: boolean, defaultValue: boolean): boolean {
    return value !== undefined && value !== null ? value : defaultValue;
}

/**
 * Crea y retorna un objeto de estado `ListaDeDatosFinal` con valores predeterminados,
 * permitiendo la inicialización parcial a través del parámetro `params`.
 *
 * @param params - Objeto parcial de tipo `ListaDeDatosFinal` que permite sobreescribir los valores predeterminados.
 *                 Si no se proporciona, se utilizarán los valores por defecto para todas las propiedades.
 *
 * @returns Un objeto completamente inicializado de tipo `ListaDeDatosFinal`, donde cada campo se establece
 *          con el valor proporcionado en `params` o, en su defecto, con un valor predeterminado.
 *
 * @remarks
 * - Utiliza la función `getDefaultValue` para asignar valores por defecto a los campos de tipo string.
 * - Utiliza la función `finalEnviar` para asignar valores por defecto a los campos booleanos de validación.
 * - Los campos `tablaDatos` y `personas` se inicializan como arreglos vacíos si no se proporcionan.
 * - Esta función es útil para asegurar que el estado de los datos siempre tenga una estructura completa y consistente.
 */
export function createDatosState(params: Partial<ListaDeDatosFinal> = {}): ListaDeDatosFinal {
    return {
        datos: {
            aduanaDeIngreso: getDefaultValue(params.datos?.aduanaDeIngreso, ''),
            oficinaDeInspeccion: getDefaultValue(
                params.datos?.oficinaDeInspeccion,
                ''
            ),
            puntoDeInspeccion: getDefaultValue(params.datos?.puntoDeInspeccion, ''),
            numeroDeGuia: getDefaultValue(params.datos?.numeroDeGuia, ''),
            regimen: getDefaultValue(params.datos?.regimen, ''),
            numeroDeCarro: getDefaultValue(params.datos?.numeroDeCarro, ''),
        },
        movilizacion: {
            transporte: getDefaultValue(params.movilizacion?.transporte, ''),
            identificacion: getDefaultValue(params.movilizacion?.identificacion, ''),
            puntoVerificacion: getDefaultValue(params.movilizacion?.puntoVerificacion, ''),
            empresaTransportista: getDefaultValue(params.movilizacion?.empresaTransportista, ''),
        },
        pago: {
            exentoPago: getDefaultValue(params.pago?.exentoPago, ''),
            justificacion: getDefaultValue(params.pago?.justificacion, ''),
            claveReferencia: getDefaultValue(params.pago?.claveReferencia, ''),
            cadenaDependencia: getDefaultValue(params.pago?.cadenaDependencia, ''),
            banco: getDefaultValue(params.pago?.banco, ''),
            llavePago: getDefaultValue(params.pago?.llavePago, ''),
            importePago: getDefaultValue(params.pago?.importePago, ''),
            fechaPago: getDefaultValue(params.pago?.fechaPago, ''),
        },
        finalEnviar: {
            datosFormaValidacion: finalEnviar(
                params.finalEnviar?.datosFormaValidacion as boolean,
                false
            ),
            movilizacionValidacion: finalEnviar(
                params.finalEnviar?.movilizacionValidacion as boolean,
                false
            ),
            validaciondeFormulariodePago: finalEnviar(
                params.finalEnviar?.validaciondeFormulariodePago as boolean,
                false
            ),
        },
        tablaDatos: params.tablaDatos || [],
        selectedDatos: params.selectedDatos || [],
        personas: params.personas || [],
        tercerosRelacionados: params.tercerosRelacionados || [],
        datosForma: params.datosForma || [],
        usoCrossListDatos: CROSLISTA_DE_DATOS,
        seletedTerceros: params.seletedTerceros || {} as TercerosrelacionadosdestinoTable,
        seletedExdora: params.seletedExdora || {} as TercerosrelacionadosdestinoTable
    };
}

/**
 * Interfaz que define una opción para un control de selección tipo radio button.
 * @interface RadioOpcion
 * @property {string} label - Etiqueta visible para el usuario.
 * @property {string} value - Valor interno asignado a la opción seleccionada.
 */
export interface RadioOpcion {
    /**
     * Etiqueta visible para el usuario.
     */
    label: string;
    /**
     * Valor interno asignado a la opción seleccionada.
     */
    value: string;
}

/**
 * Modelo de datos para un exportador relacionado.
 * @interface
 */
export interface TercerosrelacionadosTable {
    /**
     * Nombre, denominación o razón social del exportador.
     */
    exportadorNombre: string;
    /**
     * Teléfono del exportador.
     */
    exportadorTelefono: string;
    /**
     * Correo electrónico del exportador.
     */
    exportadorCorreo: string;
    /**
     * Domicilio del exportador.
     */
    exportadorDomicilio: string;
    /**
     * País del exportador.
     */
    exportadorPais: string;
}

/**
 * Interfaz que define la estructura de datos para la información de la solicitud.
 * @interface DatosDeLaSolicitud
 */
export interface DatosDeLaSolicitud {
    /**
     * Catálogo de países.
     */
    paises: Catalogo[];
    /**
     * Catálogo de estados.
     */
    estados: Catalogo[];
}


/**
 * Interfaz que define la estructura de datos para la información de la solicitud.
 * @interface DatosDeLaSolicitud
 */
export interface TercerosRelacionados {
    /**
     * Catálogo de países.
     */
    paises: Catalogo[];
    /**
     * Catálogo de estados.
     */
    estados: Catalogo[];

    /**
     * Catálogo de municipios o alcaldías.
     */
    municipio: Catalogo[];

    /**
     * Catálogo de colonias.
     */
    colonias: Catalogo[];
}

/**
 * Interfaz que define la estructura de datos para la información de mercancías.
 * @interface DatosMercancia
 */
export interface DatosMercancia {

    /**
   * Lista de tipos de requisitos asociados a la solicitud.
   */
    tipoRequisitoList: Catalogo[];

    /**
     * Lista de requisitos específicos relacionados con la solicitud.
     */
    requisitoList: Catalogo[];

    /**
     * Lista de fracciones arancelarias aplicables.
     */
    fraccionArancelariaList: Catalogo[];

    /**
     * Lista de NICO (Números de Identificación Comercial) relacionados.
     */
    nicoList: Catalogo[];

    /**
     * Lista de unidades de medida de transporte (UMT).
     */
    umtList: Catalogo[];

    /**
     * Lista de unidades de medida comercial (UMC).
     */
    umcList: Catalogo[];

    /**
     * Lista de especies relacionadas con la solicitud.
     */
    especieList: Catalogo[];

    /**
     * Lista de usos específicos asociados a la solicitud.
     */
    usoList: Catalogo[];

    /**
     * Lista de países de origen de los productos o bienes.
     */
    paisOrigenList: Catalogo[];

    /**
     * Lista de países de procedencia de los productos o bienes.
     */
    paisDeProcedenciaList: Catalogo[];

    /**
     * Lista de sexos aplicables en el contexto de la solicitud.
     */
    sexoList: Catalogo[];

    /**
     * Lista de tipos de productos aplicables en el contexto de la solicitud.
     */
    tipoDeProductoList: Catalogo[];
}
/**
 * Interfaz que define la estructura de etiquetas cruzadas para elementos de interfaz.
 * @interface CrossListEtiqueta
 */
export interface CrossListEtiqueta {
    /** Título que se muestra en la parte izquierda */
    tituluDeLaIzquierda: string;
    /** Contenido que se muestra en la parte derecha */
    derecha: string;
}

/**
 * Modelo de datos para un destinatario relacionado.
 * @interface
 */
export interface TercerosrelacionadosdestinoTable {
    /**
     * Tipo de persona (Física/Moral).
     */
    tipoMercancia: string;
    /**
     * Nombre(s) del destinatario.
     */
    nombre: string;
    /**
     * Primer apellido del destinatario.
     */
    primerApellido: string;
    /**
     * Segundo apellido del destinatario (opcional).
     */
    segundoApellido?: string;
    /**
     * Denominación o razón social del destinatario.
     */
    razonSocial: string;
    /**
     * País del destinatario.
     */
    pais: string;
    /**
     * Código postal del destinatario.
     */
    codigoPostal: string;
    /**
     * Estado del destinatario.
     */
    estado: string;
    /**
     * Municipio del destinatario (opcional).
     */
    municipio?: string;
    /**
     * Colonia del destinatario (opcional).
     */
    colonia?: string;
    /**
     * Calle del destinatario.
     */
    calle: string;
    /**
     * Número exterior del domicilio del destinatario.
     */
    numeroExterior: string;
    /**
     * Número interior del domicilio del destinatario (opcional).
     */
    numeroInterior?: string;
    /**
     * Lada telefónica del destinatario (opcional).
     */
    lada?: string;
    /**
     * Teléfono del destinatario (opcional).
     */
    telefono?: string;
    /**
     * Correo electrónico del destinatario (opcional).
     */
    correo?: string;
    /**
     * Planta del destinatario (opcional).
     */
    planta?: string;

    /**
     * Domicilio completo del destinatario (opcional).
     */
    domicilio?: string;

    /**
     * Descripción del municipio (para mostrar en tabla).
     */
    municipioDescripcion?: string;

    /**
     * Descripción del estado (para mostrar en tabla).
     */
    estadoDescripcion?: string;

    /**
     * Descripción del país (para mostrar en tabla).
     */
    paisDescripcion?: string;

    /**
     * Descripción de la colonia (para mostrar en tabla).
     */
    coloniaDescripcion?: string;
}

/**
 * Información del exportador relacionado con el trámite fitosanitario.
 * @interface TercerosrelacionadosExportadorTable
 */
export interface TercerosrelacionadosExportadorTable {

    /**
     * Tipo de persona (Física/Moral).
     */
    tipoMercancia: string;

    /**
     * Nombre(s) del destinatario.
     */
    nombre: string;

    /**
     * Denominación o razón social del destinatario.
     */
    razonSocial: string;

    /**
     * País del destinatario.
     */
    pais: string;

    /**
     * Teléfono del destinatario (opcional).
     */
    telefono?: string;

    /**
     * Domicilio completo del destinatario (opcional).
     */
    domicilio?: string;

    /**
     * Correo electrónico del destinatario (opcional).
     */
    correo?: string;

    /**
     * Primer apellido del destinatario.
     */
    primerApellido: string;

    /**
     * Segundo apellido del destinatario (opcional).
     */
    segundoApellido?: string;

    /**
     * Lada telefónica del destinatario (opcional).
     */
    lada?: string;
}



export interface Documentos {
  documento_fraccion_esquema?: [],
  documento_fraccion?: [],
  documento_programa?: [],
  documento_tramite?: [
    {
      tipo_documento: {
        id_tipo_documento: number,
        tipo_documento: string,
        fecha_captura: string,
        fecha_fin_vigencia: string,
        fecha_ini_vigencia: string,
        activo: boolean,
        ide_rango_resolucion_imagen: string,
        tamanio_maximo: number
      },
      especifico: boolean,
      ide_clasificacion_documento: string,
      ide_tipo_solicitante_rfe: string,
      fecha_ini_vigencia: string,
      fecha_fin_vigencia: string,
      activo: boolean,
      solo_anexar: boolean | null,
      ide_regla_anexado: string
    }
  ]
}

export interface DocumentoTramite {
  tipo_documento: {
    id_tipo_documento: number,
    tipo_documento: string,
    fecha_captura: string,
    fecha_fin_vigencia: string,
    fecha_ini_vigencia: string,
    activo: boolean,
    ide_rango_resolucion_imagen: string,
    tamanio_maximo: number
  },
  especifico: boolean,
  ide_clasificacion_documento: string,
  ide_tipo_solicitante_rfe: string,
  fecha_ini_vigencia: string,
  fecha_fin_vigencia: string,
  activo: boolean,
  solo_anexar: boolean | null,
  ide_regla_anexado: string
}

/**
 * Representa los eventos relacionados con los animales en una solicitud.
 */
export interface AnimalesEventos {
    /**
     * El formulario asociado a la solicitud de animales.
     */
    formulario: FilaSolicitud;

    /**
     * Una lista de datos sensibles relacionados con los animales.
     */
    tablaDatos: Sensible[];
}
