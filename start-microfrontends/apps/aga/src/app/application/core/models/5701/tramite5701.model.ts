export interface DatosTipoEmpresa {
    certificacionA: boolean;
    certificacionAA: boolean;
    certificacionAAA: boolean;
    socioComercial: boolean;
    opEconomicoAut: boolean;
    revisionOrigen: boolean;
}
export interface Solicitud5701 {
    idSolicitud: string;
    tipoSolicitud: string;
    datosImportadorExportador: DatosImportadorExportador;
    datosServicio: DatosServicio;
    datosDespacho: DatosDespacho;
    datosPedimento: DatosPedimento;
    mercancia: DatosMercancia;
    responsablesDespacho: ResponsablesDespacho[];
    pagos: DatosPago;

    tercerosRelacionados: Personas[];
}

export interface DatosImportadorExportador {
    rfcImportExport: string;
    nombreImportExport: string;
    nroRegistro: string;
    programaFomento: string;
    immex: string;
    immexValue: string;
    industriaAutomotriz: string;
    tipoEmpresaCertificada: string;
    idSocioComercial: string;
    opEconomicoAut: boolean;
    revisionOrigen: boolean;
}
export interface DatosServicio {
    fechaInicio: string;
    horaInicio: string;
    fechaFinal: string;
    horaFinal: string;
    fechasSeleccionadas: string[];
}

export interface DatosDespacho {
    despacho: string;
    rfcAutorizacion: string;
    ddexAutorizacion: string;

    idAduana: string;
    descripcionAduana: string;

    idSeccionDespacho: string;
    seccionAduanera: string;

    nombreRecinto: string;
    tipoDespacho: string;
    tipoOperacion: string;
    patente: string;
    relacionSociedad: boolean;
    encargoConferido: boolean;
    domicilio: string;
}

export interface DatosPedimento {
    idPedimento: number;
    patentePedimento: number;
    pedimento: string;
    aduana: number;
    tipoPedimento: string;
    numero: number;
    comprobanteValor: string;
    pedimentoValidado: boolean;
}

export interface DatosMercancia {
    paisOrigen: number;
    paisProcedencia: number;
    descripcion: string;
    justificacion: string;
}

export interface ResponsablesDespacho {
    gafeteRespoDespacho: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
}


export interface DatosPago {
    montoPagar: string;
    lineaCaptura: string;
    monto: number;
}

export interface Personas {
    razonSocial: string;
    correo: string;
}


// Pedimento
export interface DatosComponentePedimento {
    patente: string;
    idAduanaDespacho: number;
}

export interface Persona {
    gafeteRespoDespacho?: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
}

/**
 * Representa un pedimento en el sistema.
 * 
 * @interface Pedimento
 * 
 * @property {number} patente - Número de patente asociado al pedimento.
 * @property {number} pedimento - Número único del pedimento.
 * @property {number} aduana - Código de la aduana correspondiente.
 * @property {string} estadoPedimento - Estado actual del pedimento.
 * @property {string} subEstadoPedimento - Subestado específico del pedimento.
 * @property {number} idTipoPedimento - Identificador del tipo de pedimento.
 * @property {string} descTipoPedimento - Descripción del tipo de pedimento.
 * @property {string} numero - Número de referencia del pedimento.
 * @property {string} comprobanteValor - Comprobante de valor asociado al pedimento.
 * @property {string} pedimentoValidado - Indicador de validación del pedimento.
 */
export interface Pedimento {
    idPedimento: number;
    patente: string;
    pedimento: number;
    aduana: number;
    tipoPedimento: number;
    estadoPedimento: string;
    subEstadoPedimento: string;
    descTipoPedimento: string;
    numero: string;
    comprobanteValor: string;
    pedimentoValidado: string;
}
