/**
 * Modelo reponse para los fabricantes
 */
export interface FabricanteResponse{
  /** Lista de fabricantes */
  fabricantes: Fabricante[];

  /** Tipo de fabricantes */
  tipo_fabricante: string;
}
/**
 * Modelo que representa la respuesta del servicio de histórico de fabricantes.
 * Este modelo se utiliza para mapear los datos recibidos desde la API correspondiente.
 */
export interface Fabricante {
  /** Representa el nombre completo del fabricante. */
  razon_social?: string;

  /** Representa la clave única del fabricante. */
  clave_fabricante?: string;

  /** Representa la información del domicilio. */
  direccion?: string;

  /** Representa el correo electrónico. */
  correo_electronico?: string;

  /** Representa el número de teléfono. */
  telefono?: string;

  /** Representa el código postal. */
  codigo_postal?: string;

  /** Representa el nombre de la ciudad. */
  ciudad?: string;

  /** Representa el país. */
  pais?: string;
}