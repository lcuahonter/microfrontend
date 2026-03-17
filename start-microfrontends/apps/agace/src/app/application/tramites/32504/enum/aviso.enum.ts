import { ColumnasTabla, ColumnsTableMercancia } from "../models/aviso.model";
/**
 * Tipos de acciones posibles en el formulario o en las tablas.
 */
export enum ActionType {
    FORM_ACTION = 'FORM_ACTION',
    TABLE_ACTION = 'TABLE_ACTION'
}
/** Ejemplo de columnas de aviso. 
 *  Representa datos de empresa ficticia. 
 *  Útil para inicialización o pruebas. */
export const NUEVAS_COLUMNAS: ColumnasTabla = {
  rfc: 'XAXX010101000',
  nombreComercial: 'Comercial ABC',
  entidadFederativa: 'Ciudad de México',
  alcaldiaMunicipio: 'Benito Juárez',
  colonias: 'Del Valle'
};
/** Ejemplo de mercancía. 
 *  Incluye fracción arancelaria y descripción. 
 *  Útil para pruebas o datos iniciales. */
export const NUEVA_MERCANCIA: ColumnsTableMercancia = {
  fracArancelaria: '01012100',
  nico: '00',
  unidadMedida: 'KG',
  cantidad: '100',
  valorUsd: '5000',
  descripcionMercancia: 'Ganado bovino puro de raza para reproducción',
};
