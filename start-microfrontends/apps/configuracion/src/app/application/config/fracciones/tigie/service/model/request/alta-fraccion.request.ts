
/**
 * Request de alta fraccion
 */
export interface AltaFraccionRequest {
  fraccionArancelaria: string;
  tipoOperacion: string;
  unidadMedida: string;
  prohibida: boolean;
  exenta: boolean;
  impuestoAdValorem: string;
  impuestoEspecifico: string;
  tipoImpuestoEspecifico: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
}
