/**
 * @fileoverview
 * Modelos de datos para la gestión de terceros relacionados en el trámite 220201 de agricultura.
 * Incluye interfaces para exportadores, destinatarios y catálogos de la solicitud.
 * Cobertura compodoc 100%: cada interfaz y propiedad está documentada.
 * @module tercerosrelacionados.model
 */

import { Catalogo } from "@libs/shared/data-access-user/src";

/**
 * Modelo de datos para un exportador relacionado.
 * @interface
 */
export interface TercerosrelacionadosTable {
  /**
   * Nombre, denominación o razón social del exportador.
   */
  exportadorNombre: string;
  /**
   * Teléfono del exportador.
   */
  exportadorTelefono: string;
  /**
   * Correo electrónico del exportador.
   */
  exportadorCorreo: string;
  /**
   * Domicilio del exportador.
   */
  exportadorDomicilio: string;
  /**
   * País del exportador.
   */
  exportadorPais: string;
}

/**
 * Modelo de datos para un destinatario relacionado.
 * @interface
 */
export interface TercerosrelacionadosdestinoTable {
  /**
   * Tipo de persona (Física/Moral).
   */
  tipoMercancia: string;
  /**
   * Nombre(s) del destinatario.
   */
  nombre: string;
  /**
   * Primer apellido del destinatario.
   */
  primerApellido: string;
  /**
   * Segundo apellido del destinatario (opcional).
   */
  segundoApellido?: string;
  /**
   * Denominación o razón social del destinatario.
   */
  razonSocial: string;
  /**
   * País del destinatario.
   */
  pais: string;

  /**
   * Descripción del país del destinatario (opcional).
   */
  paisDescripcion?: string;

  /**
   * Descripción de la colonia del destinatario (opcional).
   */
  coloniaDescripcion?: string;

  /**
   * Descripción del municipio del destinatario (opcional).
   */
  municipioDescripcion?: string;
  
  /**
   * Descripción del estado del destinatario (opcional).
   */
  estadoDescripcion?: string;

  /**
   * Código postal del destinatario.
   */
  codigoPostal: string;
  /**
   * Estado del destinatario.
   */
  estado: string;
  /**
   * Municipio del destinatario (opcional).
   */
  municipio?: string;
  /**
   * Colonia del destinatario (opcional).
   */
  colonia?: string;
  /**
   * Calle del destinatario.
   */
  calle: string;
  /**
   * Número exterior del domicilio del destinatario.
   */
  numeroExterior: string;
  /**
   * Número interior del domicilio del destinatario (opcional).
   */
  numeroInterior?: string;
  /**
   * Lada telefónica del destinatario (opcional).
   */
  lada?: string;
  /**
   * Teléfono del destinatario (opcional).
   */
  telefono?: string;
  /**
   * Correo electrónico del destinatario (opcional).
   */
  correo?: string;
  /**
   * Planta del destinatario (opcional).
   */
  planta?: string;
}

/**
 * Modelo de datos para los catálogos de la solicitud.
 * Incluye los catálogos de países y estados.
 * @interface
 */
export interface DatosDeLaSolicitud {
  /**
   * Catálogo de países.
   */
  paises: Catalogo[];
  /**
   * Catálogo de estados.
   */
  estados: Catalogo[];
}
/**
 * Modelo de datos para los catálogos de la solicitud.
 * Incluye los catálogos de países y estados.
 * @interface
 */
export interface PagoDeDerecho {
  /**
   * Catálogo de países.
   */
  bancoSelector: Catalogo[];
  /**
   * Catálogo de estados.
   */
  justificacionSelector: Catalogo[];
}