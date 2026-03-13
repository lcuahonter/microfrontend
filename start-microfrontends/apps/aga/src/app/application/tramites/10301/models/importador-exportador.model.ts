import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * Respuesta de la consulta de datos del trámite.
 */
export interface RespuestaConsulta {
  success: boolean;
  datos: ConsultaDatos;
  message: string;
}

/**
 * Datos generales de la consulta del trámite.
 */
export interface ConsultaDatos {

  /** Identificador del manifiesto asociado al trámite */
  manifesto: string; 

  /** Identificador de la aduana */
  aduana: Catalogo[]; 

  /** Nombre de la empresa o persona que realiza la solicitud. */
  nombre: string;

  /** Tipo de mercancía involucrada en la solicitud. */
  tipoMercancia: string;

  /** Uso específico declarado para la mercancía. */
  usoEspecifico: string;

  /** Marca del artículo o producto. */
  marca: string;

  /** Modelo del artículo o producto. */
  modelo: string;

  /** Número de serie del artículo o producto. */
  serie: string;

  /** Nombre de la calle del domicilio fiscal u operativo. */
  calle: string;

  /** Número exterior del domicilio. */
  numeroExterior: number;

  /** Número interior del domicilio. */
  numeroInterior: number;

  /** Número telefónico de contacto principal. */
  telefono: number;

  /** Correo electrónico principal de contacto. */
  correoElectronico: string;

  /** Código postal del domicilio declarado. */
  codigoPostal: number;

  /** Identificador del estado o entidad federativa del domicilio. */
  estado: number;

  /** Identificador de la colonia del domicilio. */
  colonia: number;

  /** Opción seleccionada por el usuario (casilla, alternativa, etc.). */
  opcion: string;

  /** Identificador del país del domicilio. */
  pais: Catalogo[];

  /** Datos de la mercancía, incluyendo fines, tipo, uso, condición, marca, año, modelo y serie. */
  mercanciaDatos: DatosMercancia[];

}

/**
 * Datos de una mercancía específica.
 */
export interface DatosMercancia {
  /** Identificador único de la mercancía. */
  id: number;

  /** Fines o propósito de la mercancía. */
  fines: string;

  /** Tipo de mercancía registrada. */
  tipoMercancia: string;

  /** Uso específico de la mercancía. */
  usoEspecifico: string;

  /** Condición de la mercancía (nuevo, usado, etc.). */
  condicion: string;

  /** Marca de la mercancía. */
  marca: string;

  /** Año de fabricación o modelo de la mercancía. */
  ano: string;

  /** Modelo de la mercancía. */
  modelo: string;

  /** Número de serie de la mercancía. */
  serie: string;
   
}

/**
 * Respuesta de la operación relacionada con mercancía.
 */
export interface RespuestaMercancia {
  /** Indica si la operación fue exitosa. */
  success: boolean;

  /** Datos de la mercancía registrada o consultada. */
  datos: DatosMercancia;

  /** Mensaje descriptivo de la operación. */
  message: string;
}

/**
 * Interfaz que representa la respuesta de un catálogo.
 * Utilizada para definir la estructura de la respuesta al consultar catálogos relacionados con el trámite.
 */
export interface RespuestaCatalog {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Mensaje de la respuesta.
   */
  message: string;

  /**
   * Datos generales del catálogo consultado.
   */
  datos: {
    /** Fines o propósito de la mercancía. */
    fines: string;

    /** Tipo de mercancía registrada. */
    tipoMercancia: string;

    /** Uso específico de la mercancía. */
    usoEspecifico: string;

    /** Condición de la mercancía (nuevo, usado, etc.). */
    condicion: string;

    /** Marca de la mercancía. */
    marca: string;

    /** Año de fabricación o modelo de la mercancía. */
    ano: string;

    /** Modelo de la mercancía. */
    modelo: string;

    /** Número de serie de la mercancía. */
    serie: string;

    /** Datos de la mercancía, incluyendo fines, tipo, uso, condición, marca, año, modelo y serie. */
    mercanciaDatos: DatosMercancia[];

  };
}