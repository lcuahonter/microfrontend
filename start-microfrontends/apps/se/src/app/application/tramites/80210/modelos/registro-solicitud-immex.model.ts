/**
 * @interfaz
 * @nombre FormularioDatos
 * @descripción
 * Define la estructura de los datos del formulario.
 * Contiene información básica como modalidad, folio y año.
 */
export interface FormularioDatos {
  modalidad: string;
  folio: string;
  ano: string;
}

/**
 * @interfaz
 * @nombre RespuestaPlantas
 * @descripción
 * Define la estructura de la respuesta para las plantas.
 * Contiene un código de respuesta, un mensaje y una lista de plantas.
 */
export interface RespuestaPlantas {
  code: number;
  message: string;
  datos: Plantas[];
}

/**
 * @interfaz
 * @nombre Plantas
 * @descripción
 * Define la estructura de los datos de una planta.
 * Contiene información como dirección, razón social y registro federal.
 */
export interface Plantas {
  id: string;
  calle: string;
  numExterior: string;
  numInterior: string;
  codigoPostal: string;
  colonia: string;
  municipio: string;
  entidadFederativa: string;
  pais: string;
  registroFederal: string;
  domicilio: string;
  razon: string;
}
