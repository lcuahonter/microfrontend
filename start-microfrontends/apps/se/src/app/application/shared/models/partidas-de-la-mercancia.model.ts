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


