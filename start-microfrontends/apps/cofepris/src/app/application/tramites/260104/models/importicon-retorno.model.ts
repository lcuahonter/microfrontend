import { TablaMercanciasDatos } from "../../../shared/models/datos-solicitud.model";

/**
 * @interface TablaMercanciasImportacion
 * @description Representa el modelo de datos para mercancías importadas en formato de tabla.
 * Extiende la interfaz `TablaMercanciasDatos` y agrega propiedades adicionales específicas.
 * 
 * @property {string} [cantidadUmtValor] - Valor correspondiente a la cantidad en unidad de medida para tarifa (UMT).
 * @property {string} [cantidadUmcValor] - Valor correspondiente a la cantidad en unidad de medida para comercialización (UMC).
 * @property {string} [marca] - Marca o nombre comercial de la mercancía importada.
 */
export interface TablaMercanciasImportacion extends TablaMercanciasDatos {
  /** Cantidad en unidad de medida tarifa (UMT) */
  cantidadUmtValor?: string;

  /** Cantidad en unidad de medida comercialización (UMC) */
  cantidadUmcValor?: string;

  /** Marca del producto importado */
  marca?: string;
}

/**
 * @interface Facturador
 * @description Representa la información detallada de un facturador.
 */
export interface Facturador {
  /** Identificador único del facturador (opcional) */
  id?: number;

  /** CURP del facturador */
  curp: string;

  /** RFC del facturador (opcional) */
  rfc?: string;

  /** Nombre completo o descripción del facturador */
  nombreDescripcion: string;

  /** Nacionalidad del facturador (e.g., 'Nacional', 'Extranjero') */
  nacionalidad: string;

  /** Tipo de persona: 'Física' o 'Moral' */
  tipoPersona: string;

  /** Nombres del facturador (solo para persona física) */
  nombres: string;

  /** Primer apellido del facturador (solo para persona física) */
  primerApellido: string;

  /** Segundo apellido del facturador (solo para persona física) */
  segundoApellido: string;

  /** País de residencia del facturador */
  pais: string;

  /** Estado o entidad federativa donde reside el facturador */
  estado: string;

  /** Código postal del domicilio del facturador */
  codigoPostal: string;

  /** Colonia o barrio del domicilio */
  colonia: string;

  /** Calle donde reside el facturador */
  calle: string;

  /** Número exterior del domicilio */
  numeroExterior: string;

  /** Número interior del domicilio (si aplica) */
  numeroInterior: string;

  /** Clave LADA del número telefónico */
  lada: string;

  /** Número telefónico de contacto */
  telefono: string;

  /** Correo electrónico del facturador */
  correoElectronico: string;

  /** Localidad dentro del municipio o alcaldía */
  localidad: string;

  /** Municipio o alcaldía del domicilio */
  municipioAlcaldia: string;

  /** Denominación o razón social (solo para persona moral) */
  denominacionRazon: string;
}
