export interface DatosDelTramite {
    certificadosAutorizados: number;
}

export interface ResponsableInspeccion {
    puntoDeInspeccion: string;
    primerApellido: string;
    segundoApellido: string;
    cantidadContenedores: number;
}

export interface MercanciaDatos {
    fraccionArancelaria: string;
    descripcionFraccion: string;
    nico: string;
    descripcionNico: string;
    unidadMedidaTarifa: string;
    cantidadTotalUMT: number;
}

export interface PagoDeDerechos {
    claveDeReferencia: string;
    cadenaDependencia: string;
    banco: number;
    llaveDePago: string;
    fechaInicioInput: string;
    importeDePago: string;

}

export interface PagoDeDerechosRevision {
    claveDeReferenciaRevision: string;
    cadenaDependenciaRevision: string;
    bancoRevision: string;
    llaveDePagoRevision: string;
    fechaInicioRevision: string;
    importeDePagoRevision: string;
}

export interface DatosGenerales {
    folioDelTramite: string;
    aduanaDeIngreso: string;
    oficinaDeInspeccion: string;
    puntoDeInspeccion: string;
    numeroDeGuia: string;
    regimenAlQueDestina: string;
    datosParaMovilizacion: string;
    puntoDeVerificacion: string;
    identificacionDelTransporte: string;
    nombreDeLaEmpresaTransportista: string;
}

