/**
 * Interfaz que representa una acción de un botón.
 */
export interface AccionBoton {
  /**
   * Nombre de la acción que se ejecutará al presionar el botón.
   */
  accion: string;

  /**
   * Valor asociado a la acción del botón.
   */
  valor: number;
}

/**
 * Interfaz que representa el modelo de un permiso.
 */
export interface PermisoModel {
  /**
   * Nombre del titular del permiso.
   */
  nombre: string;

  /**
   * Registro Federal de Contribuyentes (RFC) del titular.
   */
  rfc: string;

  /**
   * Clave Única de Registro de Población (CURP) del titular.
   */
  curp: string;

  /**
   * Número de teléfono del titular.
   */
  Teléfono: number;

  /**
   * Correo electrónico del titular.
   */
  CorreoElectrónico: string;

  /**
   * Nombre de la calle donde se encuentra el domicilio del titular.
   */
  calle: string;

  /**
   * Número exterior del domicilio del titular.
   */
  numeroExterior: number;

  /**
   * Número interior del domicilio del titular (si aplica).
   */
  numeroInterior: number;

  /**
   * País donde se encuentra el domicilio del titular.
   */
  pais: string;

  /**
   * Colonia donde se encuentra el domicilio del titular.
   */
  colonia: string;

  /**
   * Municipio donde se encuentra el domicilio del titular.
   */
  municipio: string;

  /**
   * Localidad donde se encuentra el domicilio del titular.
   */
  localidad: string;

  /**
   * Entidad federativa donde se encuentra el domicilio del titular.
   */
  entidadFederativa: string;

  /**
   * Estado o región de la localidad donde se encuentra el domicilio del titular.
   */
  estadoLocalidad: string;

  /**
   * Código postal del domicilio del titular.
   */
  codigoPostal: number;
}

/**
 * @description
 * Configuración de la tabla NICO que define las columnas y sus propiedades.
 * Cada columna incluye un encabezado, una clave para acceder al valor correspondiente
 * en el modelo `PermisoModel` y un orden para su posición en la tabla.
 */
export const NICO_TABLA = [
  /**
   * @description
   * Columna que muestra el nombre, denominación o razón social del titular.
   */
  { encabezado: 'Nombre/denominación o razón social', clave: (item: PermisoModel): string => item.nombre, orden: 1 },

  /**
   * @description
   * Columna que muestra el Registro Federal de Contribuyentes (RFC) del titular.
   */
  { encabezado: 'R.F.C.', clave: (item: PermisoModel): string => item.rfc, orden: 2 },

  /**
   * @description
   * Columna que muestra la Clave Única de Registro de Población (CURP) del titular.
   */
  { encabezado: 'CURP', clave: (item: PermisoModel): string => item.curp, orden: 3 },

  /**
   * @description
   * Columna que muestra el número de teléfono del titular.
   */
  { encabezado: 'Teléfono', clave: (item: PermisoModel): number => item.Teléfono, orden: 4 },

  /**
   * @description
   * Columna que muestra el correo electrónico del titular.
   */
  { encabezado: 'Correo electrónico', clave: (item: PermisoModel): string => item.CorreoElectrónico, orden: 5 },

  /**
   * @description
   * Columna que muestra el nombre de la calle del domicilio del titular.
   */
  { encabezado: 'Calle', clave: (item: PermisoModel): string => item.calle, orden: 6 },

  /**
   * @description
   * Columna que muestra el número exterior del domicilio del titular.
   */
  { encabezado: 'Número exterior', clave: (item: PermisoModel): number => item.numeroExterior, orden: 7 },

  /**
   * @description
   * Columna que muestra el número interior del domicilio del titular (si aplica).
   */
  { encabezado: 'Número interior', clave: (item: PermisoModel): number => item.numeroInterior, orden: 8 },

  /**
   * @description
   * Columna que muestra el país donde se encuentra el domicilio del titular.
   */
  { encabezado: 'País', clave: (item: PermisoModel): string => item.pais, orden: 9 },

  /**
   * @description
   * Columna que muestra la colonia donde se encuentra el domicilio del titular.
   */
  { encabezado: 'Colonia', clave: (item: PermisoModel): string => item.colonia, orden: 10 },

  /**
   * @description
   * Columna que muestra el municipio donde se encuentra el domicilio del titular.
   */
  { encabezado: 'Municipio o alcaldía', clave: (item: PermisoModel): string => item.municipio, orden: 11 },

  /**
   * @description
   * Columna que muestra la localidad donde se encuentra el domicilio del titular.
   */
  { encabezado: 'Localidad', clave: (item: PermisoModel): string => item.localidad, orden: 12 },

  /**
   * @description
   * Columna que muestra la entidad federativa donde se encuentra el domicilio del titular.
   */
  { encabezado: 'Entidad federativa', clave: (item: PermisoModel): string => item.entidadFederativa, orden: 13 },

  /**
   * @description
   * Columna que muestra el estado o región de la localidad donde se encuentra el domicilio del titular.
   */
  { encabezado: 'Estado/localidad', clave: (item: PermisoModel): string => item.estadoLocalidad, orden: 14 },

  /**
   * @description
   * Columna que muestra el código postal del domicilio del titular.
   */
  { encabezado: 'Código postal', clave: (item: PermisoModel): number => item.codigoPostal, orden: 15 },
];
