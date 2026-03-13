import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * @fileoverview
 * Modelos y utilidades para la gestión de datos del trámite de importación de acuicultura (220203).
 * Incluye la definición de las interfaces principales, auxiliares y la función para crear el estado inicial.
 * Cobertura compodoc 100%: cada interfaz y función está documentada.
 * @module importacionDeAcuiculturaModule
 */

/**
 * Interfaz que define la estructura de los pasos en un componente tipo wizard para el trámite 220203.
 * @interface ListaPasosWizard220203
 * @memberof importacionDeAcuiculturaModule
 * @property {number} indice - Índice del paso.
 * @property {string} titulo - Título del paso.
 * @property {boolean} activo - Indica si el paso está activo.
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
export interface ListaPasosWizard220203 {
    indice: number;
    titulo: string;
    activo: boolean;
    completado: boolean;
}

/**
 * Interfaz que define la estructura de las acciones de los botones.
 * @interface AccionBoton
 * @memberof importacionDeAcuiculturaModule
 * @property {string} accion - Acción del botón (ej: 'siguiente', 'anterior').
 * @property {number} valor - Valor asociado a la acción (ej: índice del paso).
 */
export interface AccionBoton {
    accion: string;
    valor: number;
}

/**
 * Interfaz que define la estructura de las opciones de un radio button.
 * @interface OpcionDeRadio
 * @memberof importacionDeAcuiculturaModule
 * @property {string} label - Etiqueta o texto visible para la opción de radio.
 * @property {string} value - Valor asociado a la opción de radio.
 */
export interface OpcionDeRadio {
    label: string;
    value: string;
}


/**
 * Interfaz que define los datos de ingreso y verificación de la mercancía.
 * @interface RealizarGroup
 * @memberof importacionDeAcuiculturaModule
 * @property {string} aduanaIngreso - Aduana de ingreso.
 * @property {string} oficinaInspeccion - Oficina de inspección.
 * @property {string} puntoInspeccion - Punto de inspección.
 * @property {string} numeroGuia - Número de guía.
 * @property {string} regimen - Régimen aduanero.
 */
export interface RealizarGroup {
    aduanaIngreso: string;
    oficinaInspeccion: string;
    puntoInspeccion: string;
    numeroGuia: string;
    regimen: string;
}

/**
 * Interfaz que define los datos específicos de la mercancía para el trámite de importación de acuicultura.
 * @interface MercanciaGroup
 * @memberof importacionDeAcuiculturaModule
 * @property {string} tipoRequisito - Tipo de requisito aplicable a la mercancía
 * @property {string} requisito - Descripción específica del requisito
 * @property {string} numeroCertificadoInternacional - Número del certificado internacional asociado
 * @property {string} numeroOficioCasoEspecial - Número de oficio para casos especiales
 * @property {string} fraccionArancelaria - Código de fracción arancelaria de la mercancía
 * @property {string} descripcionFraccionArancelaria - Descripción detallada de la fracción arancelaria
 * @property {string} nico - Código NICO (Nomenclatura de Identificación Comercial)
 * @property {string} descripcionNico - Descripción del código NICO
 * @property {string} descripcion - Descripción general de la mercancía
 * @property {string} cantidadUMT - Cantidad en unidad de medida de tarifa
 * @property {string} umt - Unidad de medida de tarifa
 * @property {string} cantidadUMC - Cantidad en unidad de medida comercial
 * @property {string} umc - Unidad de medida comercial
 * @property {string} uso - Uso destinado de la mercancía
 * @property {string} numeroDeLote - Número de lote de la mercancía
 * @property {string} faseDeDesarrollo - Fase de desarrollo del producto acuícola
 * @property {string} especie - Especie del producto acuícola
 * @property {string} paisDeOrigen - País de origen de la mercancía
 * @property {string} paisDeProcedencia - País de procedencia de la mercancía
 */
export interface MercanciaGroup {
    tipoRequisito: string;
    requisito: string;
    numeroCertificadoInternacional: string;
    numeroOficioCasoEspecial: string;
    fraccionArancelaria: string;
    descripcionFraccionArancelaria: string;
    nico: string;
    descripcionNico: string;
    descripcion: string;
    cantidadUMT: string;
    umt: string;
    cantidadUMC: string;
    umc: string;
    uso: string;
    numeroDeLote: string;
    faseDeDesarrollo: string;
    especie: string;
    paisDeOrigen: string;
    paisDeProcedencia: string;
}

/**
 * Interfaz que define los detalles adicionales de la mercancía.
 * @interface Detalles
 * @memberof importacionDeAcuiculturaModule
 * @property {string} nombreCientifico - Nombre científico de la mercancía.
 */
export interface Detalles {
    nombreCientifico: string;
}

/**
 * Interfaz que define los datos del formulario de movilización.
 * @interface FormularioMovilizacion
 * @memberof importacionDeAcuiculturaModule
 * @property {string} medioDeTransporte - Medio de transporte utilizado.
 * @property {string} identificacionTransporte - Identificación del transporte.
 * @property {string} puntoVerificacion - Punto de verificación.
 * @property {string} nombreEmpresaTransportista - Nombre de la empresa transportista.
 */
export interface FormularioMovilizacion {
    medioDeTransporte: string;
    identificacionTransporte: string;
    puntoVerificacion: string;
    nombreEmpresaTransportista: string;
}

/**
 * Interfaz que define los datos del formulario de pago para el trámite de acuicultura.
 * @interface FormularioPago
 * @memberof importacionDeAcuiculturaModule
 * @property {string} exentoPago - Indicador de exención de pago (Sí/No)
 * @property {string} justificacion - Justificación para la exención de pago
 * @property {string} claveReferencia - Clave de referencia del pago
 * @property {string} cadenaDependencia - Cadena de dependencia para el pago
 * @property {string} banco - Entidad bancaria donde se realiza el pago
 * @property {string} llavePago - Llave única de identificación del pago
 * @property {string} fechaPago - Fecha en que se efectuó el pago
 * @property {string} importePago - Monto total del pago realizado
 */
export interface FormularioPago {
    exentoPago: string;
    justificacion: string;
    claveReferencia: string;
    cadenaDependencia: string;
    banco: string;
    llavePago: string;
    fechaPago: string;
    importePago: string;
}

/**
 * Interfaz que indica el estado de validez de los datos para cada sección del trámite.
 * @interface EnviarDatos
 * @memberof importacionDeAcuiculturaModule
 * @property {boolean} pagoDeformaValida - Indica si el pago es válido.
 * @property {boolean} dataParaMovilizacion - Indica si los datos de movilización son válidos.
 * @property {boolean} dataDeLaSolicitud - Indica si los datos de la solicitud son válidos.
 */
export interface EnviarDatos {
    pagoDeformaValida: boolean,
    dataParaMovilizacion: boolean,
    dataDeLaSolicitud: boolean,
}

/**
 * Interfaz que define los datos de consulta del trámite de importación de acuicultura.
 * @interface Consulta
 * @memberof importacionDeAcuiculturaModule
 * @property {string} procedureId - Identificador único del procedimiento
 * @property {string} parameter - Parámetro de consulta específico
 * @property {string} department - Departamento o dependencia responsable
 * @property {string} folioTramite - Número de folio del trámite
 * @property {string} tipoDeTramite - Tipo específico de trámite
 * @property {string} estadoDeTramite - Estado actual del trámite
 * @property {boolean} readonly - Indicador de solo lectura
 * @property {boolean} create - Permiso de creación
 * @property {boolean} update - Permiso de actualización
 * @property {string} consultaioSolicitante - Información del solicitante de la consulta
 */
export interface Consulta {
    procedureId: string, 
    parameter: string, 
    department: string, 
    folioTramite: string, 
    tipoDeTramite: string, 
    estadoDeTramite: string, 
    readonly: boolean, 
    create: boolean, 
    update: boolean, 
    consultaioSolicitante: string, 
}

/**
 * Interfaz principal que agrupa todos los datos del trámite de importación de acuicultura 220203.
 * @interface Acuicultura
 * @memberof importacionDeAcuiculturaModule
 * @property {FormularioMovilizacion} formularioMovilizacion - Datos del formulario de movilización de mercancías
 * @property {RealizarGroup} realizarGroup - Datos de ingreso y verificación de la mercancía
 * @property {FilaSolicitud[]} mercanciaGroup - Lista de filas de mercancía del trámite
 * @property {TercerosrelacionadosdestinoTable[]} tercerosRelacionados - Lista de terceros relacionados al trámite
 * @property {PagoDeDerechos} pagoDeDerechos - Información de pago de derechos
 * @property {FilaSolicitud} selectedmercanciaGroupDatos - Datos de la fila de mercancía seleccionada
 * @property {DestinatarioForm[]} datosForma - Lista de formularios de destinatarios
 * @property {TercerosrelacionadosdestinoTable} selectedTerceros - Tercero relacionado actualmente seleccionado
 * @property {DestinatarioForm} seletedExdora - Destinatario exportador seleccionado
 */
export interface Acuicultura {
    formularioMovilizacion: FormularioMovilizacion;
    realizarGroup: RealizarGroup;
    mercanciaGroup: FilaSolicitud[];
    tercerosRelacionados: TercerosrelacionadosdestinoTable[];
    pagoDeDerechos:PagoDeDerechos;
  selectedmercanciaGroupDatos: FilaSolicitud | null;
    datosForma: DestinatarioForm[];
  selectedTerceros: TercerosrelacionadosdestinoTable;
  seletedExdora: DestinatarioForm;
}

/**
 * Función para crear el estado inicial del trámite de acuicultura, permitiendo sobreescribir valores por defecto.
 * @function createDatosState
 * @memberof importacionDeAcuiculturaModule
 * @param {Partial<Acuicultura>} [params={}] - Parámetros opcionales para inicializar el estado.
 * @returns {Acuicultura} Estado inicial de tipo Acuicultura.
 * @description Devuelve un objeto con todas las propiedades inicializadas, útil para el store Akita.
 */
export function createDatosState(params: Partial<Acuicultura> = {}): Acuicultura {
    return {
        formularioMovilizacion: params.formularioMovilizacion || {
            medioDeTransporte: '',
            identificacionTransporte: '',
            puntoVerificacion: '',
            nombreEmpresaTransportista: ''
        },
        realizarGroup: params?.realizarGroup || 
          {
                aduanaIngreso: '',
                oficinaInspeccion: '',
                puntoInspeccion: '',
                numeroGuia: '',
                regimen: ''
            }
        ,
        pagoDeDerechos: params?.pagoDeDerechos || {
            exentoPago: '',
            justificacion: '',
            claveReferencia: '',
            cadenaDependencia: '',
            banco: '',
            llavePago: '',
            importePago: '',
            fechaPago: ''
        },
        mercanciaGroup: params?.mercanciaGroup || [],
        selectedmercanciaGroupDatos: params?.selectedmercanciaGroupDatos || {} as FilaSolicitud,
        tercerosRelacionados: params.tercerosRelacionados || [],
        datosForma: params.datosForma || [] as DestinatarioForm[],
        selectedTerceros: params.selectedTerceros || {} as TercerosrelacionadosdestinoTable,
        seletedExdora: params.seletedExdora || {} as DestinatarioForm
    };
}
/**
 * Modelo para capturar la información correspondiente al pago de derechos.
 * @interface PagoDeDerechos
 * @memberof importacionDeAcuiculturaModule
 * @property {string} exentoPago - Indica si el pago está exento (Sí/No).
 * @property {string} justificacion - Justificación del motivo de exención (si aplica).
 * @property {string} claveReferencia - Clave de referencia para el pago.
 * @property {string} cadenaDependencia - Cadena generada por la dependencia para pago.
 * @property {string} banco - Nombre del banco donde se realiza el pago.
 * @property {string} llavePago - Llave única para realizar el pago.
 * @property {string} importePago - Monto del pago.
 * @property {string} fechaPago - Fecha en que se realizó el pago.
 */
export interface PagoDeDerechos {
  /**
   * Indica si el pago está exento (Sí/No).
   */
  exentoPago: string;
  /**
   * Justificación del motivo de exención (si aplica).
   */
  justificacion: string;
  /**
   * Clave de referencia para el pago.
   */
  claveReferencia: string;
  /**
   * Cadena generada por la dependencia para pago.
   */
  cadenaDependencia: string;
  /**
   * Nombre del banco donde se realiza el pago.
   */
  banco: string;
  /**
   * Llave única para realizar el pago.
   */
  llavePago: string;
  /**
   * Monto del pago.
   */
  importePago: string;
  /**
   * Fecha en que se realizó el pago.
   */
  fechaPago: string;
}
/**
 * Interfaz para los datos de la tabla de solicitudes.
 * @interface DatoTabla
 * @memberof importacionDeAcuiculturaModule
 * @property {string} solicitud - Número de solicitud.
 * @property {string} fechaCreacion - Fecha de creación de la solicitud.
 * @property {string} mercancia - Nombre de la mercancía.
 * @property {number} cantidad - Cantidad de mercancía.
 * @property {string} proveedor - Nombre del proveedor.
 */
export interface DatoTabla {
  solicitud: string;
  fechaCreacion: string;
  mercancia: string;
  cantidad: number;
  proveedor: string;
}

/**
 * Interfaz para los datos de las filas de mercancía en el trámite de importación de acuicultura.
 * @interface FilaSolicitud
 * @memberof importacionDeAcuiculturaModule
 * @property {string} noPartida - Número de partida arancelaria.
 * @property {string} tipoRequisito - Tipo de requisito sanitario aplicable.
 * @property {string} requisito - Descripción específica del requisito.
 * @property {string} numeroCertificado - Número de certificado internacional.
 * @property {string} fraccionArancelaria - Código de fracción arancelaria.
 * @property {string} descripcionFraccion - Descripción de la fracción arancelaria.
 * @property {string} nico - Código NICO (Nomenclatura de Identificación Comercial).
 * @property {string} descripcionNico - Descripción del código NICO.
 * @property {string} descripcion - Descripción general del producto.
 * @property {string} medidadetarifa - Medida de tarifa aplicable.
 * @property {string} cantidadUMT - Cantidad en unidad de medida de tarifa.
 * @property {string} umc - Unidad de medida comercial.
 * @property {string} cantidadUMC - Cantidad en unidad de medida comercial.
 * @property {string} uso - Uso destinado del producto acuícola.
 * @property {string} especie - Especie del producto acuícola.
 * @property {string} paisDeOrigen - País de origen del producto.
 * @property {string} paisDeProcedencia - País de procedencia del producto.
 * @property {string} numeroDeLote - Número de lote del producto.
 * @property {string} faseDeDesarrollo - Fase de desarrollo del producto acuícola.
 * @property {string} certificadoInternacional - Certificado internacional requerido.
 * @property {string} [numeroCertificadoInternacional] - Número del certificado internacional (opcional).
 * @property {string} [numeroOficioCasoEspecial] - Número de oficio para casos especiales (opcional).
 * @property {string} [descripcionFraccionArancelaria] - Descripción detallada de la fracción arancelaria (opcional).
 * @property {string} [umt] - Unidad de medida de tarifa (opcional).
 */
export interface FilaSolicitud {
  noPartida: string;
  tipoRequisito: string;
  requisito: string;
  numeroCertificado: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  nico: string;
  descripcionNico:string;
  descripcion:string;
  medidadetarifa:string;
  cantidadUMT:string;
  umc: string;
  cantidadUMC:string;
  uso: string;
  especie:string;
  paisDeOrigen: string;
  paisDeProcedencia: string;
  numeroDeLote: string;
  faseDeDesarrollo: string;
  certificadoInternacional: string;
  numeroCertificadoInternacional?:string
  numeroOficioCasoEspecial?:string;
  descripcionFraccionArancelaria?: string;
  umt?:string;
  id?:number;
  descripcionTipoRequisito?:string;
  descripcionUso?:string;
  descripcionUMT?:string;
  descripcionUMC?:string;
  descripcionPaisDeOrigen?:string;
  descripcionPaisDeProcedencia?:string;
  certificadoInternacionalElectronico?:string;
  tipoDeProducto?:string;
  idDescripcionFraccion: number;
  /**
 * Detalle de mercancia para fitosanitario.
 */
  lista_detalle_mercancia?: Detalles[];
}

/**
 * Interfaz para los datos de la tabla de solicitudes.
 * @interface SolicitudData
 * @memberof importacionDeAcuiculturaModule
 * @property {string} solicitud - Número de solicitud.
 * @property {string} fechaCreacion - Fecha de creación de la solicitud.
 * @property {string} mercancia - Nombre de la mercancía.
 * @property {number} cantidad - Cantidad de mercancía.
 * @property {string} proveedor - Nombre del proveedor.
 */
export interface SolicitudData {
  fecha_creacion: string;
  mercancia: string;
  cantidad: number;
  proveedor: string;
  id?: number;
  id_solicitud?: string;
}
/**
 * Interfaz que define la estructura de datos de catálogos utilizados en el trámite de acuicultura.
 * @interface CatalogoData
 * @memberof importacionDeAcuiculturaModule
 * @property {Catalogo[]} tipoRequisitoList - Lista de catálogo de tipos de requisito.
 * @property {Catalogo[]} arancelariaList - Lista de catálogo de fracciones arancelarias.
 * @property {Catalogo[]} nicoList - Lista de catálogo de códigos NICO.
 * @property {Catalogo[]} usoList - Lista de catálogo de usos de mercancía.
 * @property {Catalogo[]} paisDeOrigenList - Lista de catálogo de países de origen.
 * @property {Catalogo[]} paisDeProcedenciaList - Lista de catálogo de países de procedencia.
 * @property {Catalogo[]} umcList - Lista de catálogo de unidades de medida comercial.
 */
export interface CatalogoData {
  tipoRequisitoList: Catalogo[];
  arancelariaList: Catalogo[];
  nicoList: Catalogo[];
  usoList: Catalogo[];
  paisDeOrigenList: Catalogo[];
  paisDeProcedenciaList: Catalogo[];
  umcList: Catalogo[];
}

/**
 * Interfaz que define el formulario de datos del destinatario en el trámite de acuicultura.
 * @interface DestinatarioForm
 * @memberof importacionDeAcuiculturaModule
 * @property {'yes' | 'no'} tipoMercancia - Indicador del tipo de mercancía (sí/no).
 * @property {string} nombre - Nombre del destinatario.
 * @property {string} primerApellido - Primer apellido del destinatario.
 * @property {string} segundoApellido - Segundo apellido del destinatario.
 * @property {string} razonSocial - Razón social del destinatario (persona moral).
 * @property {string} pais - País del destinatario.
 * @property {string} domicilio - Domicilio completo del destinatario.
 * @property {string} lada - Código de área telefónica (LADA).
 * @property {string} telefono - Número telefónico del destinatario.
 * @property {string} correo - Dirección de correo electrónico del destinatario.
 */
export interface DestinatarioForm {
  tipoMercancia: 'yes' | 'no'; 
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  razonSocial: string;
  pais: string;
  paisDescripcion?: string;
  domicilio: string;
  lada: string;
  telefono: string;
  correo: string;
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