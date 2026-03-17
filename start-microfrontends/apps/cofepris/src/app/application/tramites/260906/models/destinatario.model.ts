import { CatalogosSelect } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que representa los datos de un destinatario.
 */
export interface Destinatario {
  /** Nombre completo del destinatario. */
  nombre: string;

  /** Registro Federal de Contribuyentes (RFC) del destinatario. */
  rfc: string;

  /** Clave Única de Registro de Población (CURP) del destinatario. */
  curp: string;

  /** Número telefónico de contacto del destinatario. */
  telefono: string;

  /** Correo electrónico del destinatario. */
  correoElectronico: string;

  /** Calle correspondiente al domicilio del destinatario. */
  calle: string;

  /** Número exterior del domicilio del destinatario. */
  numeroExterior: string;

  /** Número interior del domicilio del destinatario, si aplica. */
  numeroInterior: string;

  /** País donde reside el destinatario. */
  pais: string;

  /** Colonia del domicilio del destinatario. */
  colonia: string;

  /** Municipio donde reside el destinatario. */
  municipio: string;

  /** Localidad específica del domicilio del destinatario. */
  localidad: string;

  /** Estado asociado al domicilio del destinatario. */
  estado: string;

  /** Estado alternativo (o subdivisión administrativa) asociado al domicilio del destinatario, si aplica. */
  estado2: string;

  /** Código postal del domicilio del destinatario. */
  codigo: string;
}

/**
 * Interfaz que agrupa los catálogos relacionados con la información de un destinatario.
 */
export interface DestinatarioCatalogos {
  /** Catálogo de países disponibles para el domicilio del destinatario. */
  paisCatalogo: CatalogosSelect;

  /** Catálogo de estados disponibles para el domicilio del destinatario. */
  estadoCatalogo: CatalogosSelect;

  /** Catálogo de municipios disponibles para el domicilio del destinatario. */
  municipioCatalogo: CatalogosSelect;

  /** Catálogo de localidades disponibles para el domicilio del destinatario. */
  localidadCatalogo: CatalogosSelect;

  /** Catálogo de códigos postales disponibles para el domicilio del destinatario. */
  codigoCatalogo: CatalogosSelect;

  /** Catálogo de colonias disponibles para el domicilio del destinatario. */
  coloniaCatalogo: CatalogosSelect;
}
