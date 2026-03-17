import { FabricanteDatos } from "../models/permiso-sanitario.enum";

/* *
 * @constant
 * @type {object}
 * @property {string} labelNombre - Etiqueta que se mostrará para el campo.
 * @property {boolean} required - Indica si el campo es obligatorio (true) o no (false).
 * @property {boolean} habilitado - Indica si el campo está habilitado (true) o deshabilitado (false).
 *
*/
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago',
  required: false,
  habilitado: true,
};
/**
 * Lista de bancos disponibles para selección.
 * Contiene identificador y descripción de cada banco.
 * Utilizado para formularios o catálogos desplegables.
 */
export const BANCOS_DATA = [
  {
    id: 1,
    descripcion: "Banco de Comercio"
  },
  {
    id: 2,
    descripcion: "Banco de Desarrollo"
  },
  {
    id: 3,
    descripcion: "Banco de Inversión"
  },
  {
    id: 4,
    descripcion: "Banco de Ahorro"
  },
  {
    id: 5,
    descripcion: "Banco de Crédito"
  }
];
/**
 * Configuración de las columnas de la tabla de fabricantes.
 * Define los encabezados, la clave de acceso a cada propiedad del objeto `FabricanteDatos`
 * y el orden en el que deben mostrarse en la tabla.
 */
export const CONFIGURATION_TABLA_FABRICANTE = [
  { encabezado: 'Nombre/denominación o razón social', clave: (item: FabricanteDatos): string => item.nombre, orden: 1 },
  { encabezado: 'R.F.C', clave: (item: FabricanteDatos): string => item.rfc, orden: 2 },
  { encabezado: 'CURP', clave: (item: FabricanteDatos): string => item.curp, orden: 3 },
  { encabezado: 'Teléfono', clave: (item: FabricanteDatos): string => item.telefono, orden: 4 },
  { encabezado: 'Correo electrónico', clave: (item: FabricanteDatos): string => item.correo, orden: 5 },
  { encabezado: 'Calle', clave: (item: FabricanteDatos): string => item.calle, orden: 6 },
  { encabezado: 'Número exterior', clave: (item: FabricanteDatos): string => item.numeroExterior, orden: 7 },
  { encabezado: 'Número interior', clave: (item: FabricanteDatos): string => item.numeroInterior, orden: 8 },
  { encabezado: 'País', clave: (item: FabricanteDatos): string => item.pais, orden: 9 },
  { encabezado: 'Colonia', clave: (item: FabricanteDatos): string => item.colonia, orden: 10 },
  { encabezado: 'Municipio o alcaldía', clave: (item: FabricanteDatos): string => item.municipio, orden: 11 },
  { encabezado: 'Localidad', clave: (item: FabricanteDatos): string => item.localidad, orden: 12 },
  { encabezado: 'Entidad federativa', clave: (item: FabricanteDatos): string => item.entidadFederativa, orden: 13 },
  { encabezado: 'Estado/localidad', clave: (item: FabricanteDatos): string => item.estado, orden: 14 },
  { encabezado: 'Código postal', clave: (item: FabricanteDatos): string => item.codigoPostal, orden: 15 },
  { encabezado: 'Colonia o equivalente', clave: (item: FabricanteDatos): string => item.coloniaEquivalente, orden: 16 }
];
/**
 * @description
 * Datos de ejemplo para la tabla de fabricantes. Cada objeto representa
 * un registro de un fabricante con sus respectivos detalles como nombre,
 * RFC, CURP, contacto, domicilio y ubicación.
 */
export const TABLA_ROWDATA: FabricanteDatos[] = [
  {
    nombre: "Laboratorios S.A.",
    rfc: "LAB123456789",
    curp: "CURP123456HDFRRL01",
    telefono: "55-12345678",
    correo: "contacto@laboratorios.com",
    calle: "Calle 1",
    numeroExterior: "100",
    numeroInterior: "2",
    pais: "México",
    colonia: "Centro",
    municipio: "CDMX",
    localidad: "CDMX",
    entidadFederativa: "CDMX",
    estado: "CDMX",
    codigoPostal: "06000",
    coloniaEquivalente:"sdw"
  }
];
/**
 * @constant {string} TERCEROS_TEXTO_DE_ALERTA
 * 
 * Texto HTML de alerta que se muestra en la interfaz.
 * Indica al usuario que las tablas marcadas con un asterisco (*) son obligatorias
 * y que debe agregarse al menos un registro en ellas.
 */
export const TERCEROS_TEXTO_DE_ALERTA =
   `
  <div class="text-center">
    Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.
  </div>
  `;
