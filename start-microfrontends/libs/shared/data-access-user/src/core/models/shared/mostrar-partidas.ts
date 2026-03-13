export interface MostrarPartidas {
    idPartidaSol: number,
    idSolicitud: string,
    unidadesSolicitadas: number,
    unidadesAutorizadas: number,
    fraccionClave: string,
    fraccionDescripcion: string,
    unidadMedidaClave: string,
    unidadMedidaDescripcion: string,
    descripcionSolicitada: string,
    descripcionAutorizada: string,
    importeUnitarioUSD: number,
    importeTotalUSD: number,
    autorizada: boolean,
    importeUnitarioUSDAutorizado: number,
    importeTotalUSDAutorizado: number,
    descripcionOriginal: string,
    candidatoEliminar: null | string | number;
}