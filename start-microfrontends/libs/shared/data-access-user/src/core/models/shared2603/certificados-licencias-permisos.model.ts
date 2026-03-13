import { Catalogo} from "@libs/shared/data-access-user/src";

/**
 * Representa los datos de un catálogo SCIAN.
 */
export interface ScianDatos {
    clave: string,
    descripcion: string,
}

/**
 * Representa los datos de mercancías para el trámite 2603.
 */
export interface MercanciasDatos {
  clasificacion?: string,
  especificar?: string,
  dci?: string,
  denominacion?: string,
  numero?: string,
  fraccion?: string,
  descripcionDeLa?: string,
  tipoDeProducto?: string,
  formaFarmaceutica?: string,
  umt?: string,
  umc?: string,
  numeroCas?: string,
  cantidad?: string,
  kg?: string,
  numeroFabricar?: string,
  descripcionFabricar?: string;
  registroSanitario?: string;
  uso?: string,
  detalle?: string,
  cantidadUmc?: string,
  cantidadUmt?: string
  dePiezas?: string,
  descripcionDePiezas?: string,
  numeroDeReg?: string,
  presentacion?: string,
  paisDeDestino?: string;
  paisDeOrigen?: string;
  paisDeProcedencia?: string;
}

/**
 * Representa los datos de un fabricante para el trámite 2603.
 */
export interface Fabricante {
  nombre: string,
  rfc: string,
  curp: string,
  telefono: string,
  correoElectronico: string,
  calle: string,
  numeroExterior: string,
  numeroInterior: string,
  pais: string,
  colonia: string,
  municipio: string,
  localidad: string,
  entidadFederativa: string,
  estado: string,
  cp: string,
}

/**
 * Representa los datos de terceros relacionados para el trámite 2603.
 */
export interface Otros {
  tercero: string,
  nombre: string,
  rfc: string,
  curp: string,
  telefono: string,
  correoElectronico: string,
  calle: string,
  numeroExterior: string,
  numeroInterior: string,
  pais: string,
  colonia: string,
  municipio: string,
  localidad: string,
  entidadFederativa: string,
  estado: string,
  cp: string,
}

/**
 * Modelo para representar los datos de terceros en el trámite 2603.
 * Incluye información personal, dirección, nacionalidad, tipo de persona y otros campos relacionados.
 */
export interface Otros2603 {
  tercero?: string,
  nombre?: string,
  rfc?: string,
  curp?: string,
  telefono?: string,
  correoElectronico?: string,
  calle?: string,
  numeroExterior?: string,
  numeroInterior?: string,
  pais?: string,
  colonia?: string,
  municipio?: string,
  localidad?: string,
  entidadFederativa?: string,
  estado?: string,
  cp?: string|null|undefined,
  denominacionSocial?: string,
  terceroNombre?: string,
  tercerosNacionalidad?: string,
  tipoPersona?: string,
  datosPersonalesNombre?: string,
  datosPersonalesPrimerApellido?: string,
  datosPersonalesSegundoApellido?: string,
  codigoPostal?: string,
  lada?: string,
}

/**
 * Modelo para representar un producto terminado en el trámite 2603.
 * Incluye la clave y la descripción del producto.
 */
export interface ProductoTerminado {
  clave: string,
  descripcion: string,
}

export interface ProductoTerminadoDos {
 // Corresponds to 'Cantidad'
  cantidad: string;

  presentacion: string; // Corresponds to 'Presentacion'
  numeroFabricar: string; // Corresponds to 'Numero de piezas'
  descripcionDePiezas: string; // Corresponds to 'Descripción del número de piezas a fabricar'
  registroSanitario: string; // Corresponds to 'Registro sanitario'
}

/**
 * Respuesta de catálogo de estado.
 */
export interface EstadoCatalogResponse {
  code: number;
  data: Catalogo[];
  message: string;
}

/**
 * Interfaz que representa una opción de radio.
 */
export interface RadioOpcion {
  /** Etiqueta que describe la opción de radio. */
  label: string;

  /** Valor asociado a la opción de radio. */
  value: string;
}

/**
 * Información de clasificación SCIAN para NICO.
 */
export interface NicoInfo {
  /** 
   * Código de clasificación SCIAN único que identifica la actividad económica
   * @type {string}
   * @example "111110"
   */
  clave_Scian: string;
}