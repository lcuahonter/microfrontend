/**
 * Modelo que representa una partida de la mercancía en un trámite.
 */
export interface PartidasDeLaMercanciaModelo {
  id: string;
  cantidad: string;
  unidadDeMedida: string;
  fraccionFrancelaria: string;
  descripcion: string;
  precioUnitarioUSD: string;
  totalUSD: string;
  fraccionTigiePartidasDeLaMercancia?: string;
  fraccionDescripcionPartidasDeLaMercancia?: string;
}

/** Modelo que representa una fracción arancelaria PROSEC.
 */
export interface FraccionArancelariaProsec {
  id: string;
  fraccionArancelariaProsec: number | string,
  descripcionFraccionProsec: string
}

/**
 * Modelo que representa una partida para modificar en el trámite.
 */
export interface ModificarPartidasModelo {
  idPartidaSol?: number,
  idSolicitud?: string,
  unidadesSolicitadas: number,
  unidadesAutorizadas: number,
  fraccionClave?: string,
  fraccionDescripcion?: string,
  unidadMedidaClave?: string,
  unidadMedidaDescripcion?: string,
  descripcionSolicitada?: string,
  descripcionAutorizada?: string,
  importeUnitarioUSD: number,
  importeTotalUSD: number,
  autorizada?: boolean,
  importeUnitarioUSDAutorizado: number,
  importeTotalUSDAutorizado: number,
  descripcionOriginal?: string,
  candidatoEliminar?: null | boolean
}