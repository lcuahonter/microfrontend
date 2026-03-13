/**
 * Interfaz para definir la estructura de las filas.
 */
export interface Exportador {
    nombre: string;
    telefono: string;
    correo: string;
    domicilio: string;
    pais: string;
  }

  
  /**
   * Interfaz para definir la estructura de las filas con detalles adicionales.
   */
  export interface Destinatario {
    nombre: string;
    telefono: string;
    correo: string;
    calle: string;
    exterior: number;
    interior: number;
    pais: string;
    colonia: string;
    codigoPostal: string;
    municipio: string;
    entidadFederativa: string;
  }