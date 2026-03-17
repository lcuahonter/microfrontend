
/**
 * Modelo que representa un SCIAN (Sistema de Clasificación Industrial de América del Norte).
 * 
 * @property claveScian - La clave única del SCIAN.
 * @property descripcionScian - La descripción asociada al SCIAN.
 */
export interface ScianModel {
  claveScian: string;
  descripcionScian: string;
}

/**
 * Modelo que representa un tipo de persona propietario.
 * 
 * @property label - La etiqueta asociada al tipo de persona.
 * @property value - El valor correspondiente al tipo de persona.
 */
export interface PropietarioTipoPersona {
  label: string;
  value: string;
}

/**
 * Modelo que representa la información de mercancías.
 * 
 * @property clasificacion - Clasificación de la mercancía.
 * @property especificar - Detalle adicional de la clasificación.
 * @property denominacionEspecifica - Denominación específica de la mercancía.
 * @property denominacionDistintiva - Denominación distintiva de la mercancía.
 * @property denominacionComun - Denominación común de la mercancía.
 * @property formaFarmaceutica - Forma farmacéutica de la mercancía.
 * @property estadoFisico - Estado físico de la mercancía.
 * @property fraccionArancelaria - Fracción arancelaria de la mercancía.
 * @property descripcionFraccion - Descripción de la fracción arancelaria.
 * @property unidad - Unidad de medida de la mercancía.
 * @property cantidadUMC - Cantidad en la unidad de medida comercial.
 * @property unidadUMT - Unidad de medida de transporte.
 * @property cantidadUMT - Cantidad en la unidad de medida de transporte.
 * @property presentacion - Presentación de la mercancía.
 * @property numeroRegistro - Número de registro de la mercancía.
 * @property paisDeOrigen - País de origen de la mercancía.
 * @property paisDeProcedencia - País de procedencia de la mercancía.
 * @property tipoProducto - Tipo de producto de la mercancía.
 * @property usoEspecifico - Uso específico de la mercancía.
 */
export interface MercanciasInfo {
  clasificacion: string;
  especificar: string;
  denominacionEspecifica: string;
  denominacionDistintiva: string;
  denominacionComun: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  unidad: string;
  cantidadUMC: string;
  unidadUMT: string;
  cantidadUMT: string;
  presentacion: string;
  numeroRegistro: string;
  paisDeOrigen: string;
  paisDeProcedencia: string;
  tipoProducto: string;
  usoEspecifico: string;
}
