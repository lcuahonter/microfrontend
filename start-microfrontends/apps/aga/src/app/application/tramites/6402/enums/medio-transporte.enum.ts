import { Catalogo } from '../models/autorizacion-importacion.model';

/**
 * Enum que define los tipos de medios de transporte disponibles
 * y sus correspondientes descripciones.
 */
export enum MedioTransporteEnum {
  AEREO = 'Aéreo',
  MARITIMO = 'Marítimo',
  FERROVIARIO = 'Ferroviario',
  CARRETERO = 'Carretero'
}

/**
 * Utility class para trabajar con medios de transporte
 */
export class MedioTransporteUtil {
  /**
   * Obtiene la descripción del medio de transporte basado en el catálogo.
   * @param medioDeTransporte Array del catálogo de medios de transporte indexado por ID
   * @param id ID del medio de transporte seleccionado
   * @returns Descripción del medio de transporte o string vacío si no se encuentra
   */
  static getDescripcion(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): string {
    if (!id || !medioDeTransporte) {
      return '';
    }
    
    const STRING_ID = String(id);
    const ITEM = Array.isArray(medioDeTransporte) ? 
      medioDeTransporte.find(item => item.id.toString() === STRING_ID) : 
      medioDeTransporte[STRING_ID];
      
    return ITEM?.descripcion || '';
  }

  /**
   * Verifica si el medio de transporte es de un tipo específico
   * @param medioDeTransporte Array del catálogo de medios de transporte
   * @param id ID del medio de transporte seleccionado
   * @param tipo Tipo de medio de transporte a verificar
   * @returns true si coincide con el tipo especificado
   */
  static esTipo(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined, tipo: MedioTransporteEnum): boolean {
    const DESCRIPCION = this.getDescripcion(medioDeTransporte, id);
    return DESCRIPCION === tipo;
  }

  /**
   * Verifica si el medio de transporte es Aéreo
   */
  static esAereo(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): boolean {
    return this.esTipo(medioDeTransporte, id, MedioTransporteEnum.AEREO);
  }

  /**
   * Verifica si el medio de transporte es Marítimo
   */
  static esMaritimo(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): boolean {
    return this.esTipo(medioDeTransporte, id, MedioTransporteEnum.MARITIMO);
  }

  /**
   * Verifica si el medio de transporte es Ferroviario
   */
  static esFerroviario(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): boolean {
    return this.esTipo(medioDeTransporte, id, MedioTransporteEnum.FERROVIARIO);
  }

  /**
   * Verifica si el medio de transporte es Carretero
   */
  static esCarretero(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): boolean {
    return this.esTipo(medioDeTransporte, id, MedioTransporteEnum.CARRETERO);
  }

  /**
   * Verifica si el medio de transporte NO es Carretero
   */
  static noEsCarretero(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): boolean {
    return !this.esCarretero(medioDeTransporte, id);
  }

  /**
   * Verifica si el medio de transporte NO es Ferroviario
   */
  static noEsFerroviario(medioDeTransporte: { [key: string]: Catalogo } | Catalogo[], id: string | number | null | undefined): boolean {
    return !this.esFerroviario(medioDeTransporte, id);
  }
}