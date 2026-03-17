/**
 * @interfaz
 * @nombre VehiculosTabla
 * @descripción
 * Define la estructura de los datos de la tabla de vehículos.
 * Contiene información básica sobre los vehículos, como marca, modelo y VIN.
 */
export interface NumeroEmpleadosTabla {
  id: number; 
  denominacionSocial: string; 
  rfc: string; 
  numeroDeEmpleados: number; 
  bimestre:string; 
}

/**
 * Interface para la respuesta de búsqueda de RFC
 */
export interface BuscarRfcResponse {
  code: number;
  data: Partial<NumeroEmpleadosTabla>; 
  message: string;
}

/**
 * Interface para la respuesta de la API
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface ApiResponse<T> {
  code: number;
  data: T[];
  message: string;
}

/**
 * Interface para las entidades federativas
 */
export interface EntidadFederativa {
  id: number;
  descripcion: string;
}

/**
 * Interface para las instalaciones
 * @template T - Tipo de datos que se espera en la respuesta.
 */
export interface InstalacionesInterface {
    entidadFederativa: string;
    municipio: string;
    direccion: string;
    codigoPostal: string;
    registro: string
}

/**
 * Interface para las instalaciones principales del solicitante.
 * Contiene información detallada sobre los domicilios y actividades productivas.
 */
export interface DomiciliosRfcSolicitanteTabla {
  id?:number;
  InstalacionesPrincipales: string;
  tipoInstalacion: string;
  entidadFederativa: string;
  municipioAlcaldia: string;
  coloniaCalleNumero: string; 
  codigoPostal: string;
  registroSESAT: string;
  procesoProductivo: string;
  acreditaUsoGoceInmueble: string;
  realizaActividadComercioExterior: string;
  reconocimientoMutuoCTPAT: string;
  perfilEmpresa: string;
}


export interface ControlInventariosTabla {
  id:number;
  nombreSistema:string;
  lugarRadicacion:string;
  cumpleAnexo24: boolean;
}

export interface AgregarMiembroEmpresaTabla {
  id:number;
  tipoPersona: string;
  nombre: string;
  nombreColleccion?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreCompleto: string;
  rfc: string;
  caracter: string;
  nacionalidad: string;
  obligadoTributarMexico: string;
  nombreEmpresa: string;
}