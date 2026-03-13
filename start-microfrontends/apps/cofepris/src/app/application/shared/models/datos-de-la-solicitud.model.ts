import { Catalogo } from "@libs/shared/data-access-user/src";

export interface PropietarioModel {
  NombredenominacionORazonSocial: string;
  rfc: string;
  curp: string;
  telefono: string;
  CorreoElectronico: string;
  calle:string;
  numeroExterior:string;
  numeroInterior:string;
  pais:string;
  colonia:string;
  municipioOAlcaldia:string;
  localidad:string;
  entidadFederativa:string;
  estadoLocalidad:string;
  codigoPostal:string;
}

export interface ScianModel {
  claveScian: string;
  descripcionScian: string;
}
export interface DatosDeLaProductoModel {
  tipoDeProducto: string;
  tipoDeProductoId?: string;
  nombreEspecifico : string;
  cantidadOVolumen : string;
  unidadDeMedida: string;
  unidadDeMedidaId?: string;
  Presentacion: string;
  fraccionArancelaria: string;
  descripcionDeLaFraccion: string;
  unidadDeMedidaDeTarifa : string;
  cantidadUMT :string;
  envasePrimario: string;
  envaseSecundario: string;
  paisDeOrigen: string;
  paisDeProcedencia: string;
  paisDeDestino: string;
  usoEpecifico: string;
  usoEpecificoId?: string;
  transporteEnvasePrimario?: string;
  transporteEnvaseSecundario?: string;
}
export interface Representante {
  rfc: string;
  curp: string;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  denominacionRazonSocial: string;
  pais: string;
  estadoLocalidad: string;
  municipioAlcaldia: string;
  localidad: string;
  codigoPostal: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  lada: string;
  telefono: string;
  correoElectronico: string;
}
export interface Manifiestistos {
  rfc: string;
  representanteNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

export interface PropietarioRadio {
  id: number;
  label: string; 
  value: string; 
}
export interface PropietarioTipoPersona {
  label: string;
  value: string;
}

export interface MercanciasTabla {
  code: number;
  data: MercanciasInfo[];
  message: string;
}

export interface MercanciasInfo {
  cantidadUmcValor?: string;
  cantidadUmtValor?: string;
  idSubClasificacionProducto?: string;
  idClasificacionProducto?: string;
  fraccionArancelariaDescripcion?: string;
  descripcionMercancia?: string;
  id?: string;
  clasificacion: string;
  especificar: string;
  denominacionEspecifica: string;
  denominacionDistintiva: string;
  denominacionComun: string;
  formaFarmaceutica: string;
  estadoFisico: string;
  estadoFormaFarmaceutica:string;
  fraccionArancelaria: string;
  descripcionFraccion: string;
  unidad: string;
  cantidadUMC: string;
  unidadUMT: string;
  cantidadUMT: string;
  presentacion: string;
  numeroRegistro: string;
  paisDeOrigen: string;
  paisDeProcedencia: string;
  tipoProducto: string;
  tipoProductoEspecifique?: string;
  estadoFisicoEspecifique?: string;
  usoEspecifico: string;
  usoEspecificoDatosClave?: Array<string>;
  paisProcedenciaDatosClave?: Array<string>;
  paisOrigenDatosClave?: Array<string>;
  claveClasificacionProductoObj ?: Catalogo | undefined;
  especificarClasificacionObj ?: Catalogo | undefined;
  fechaDeCaducidad?: string;
}
export interface Asociados {
  id: number;
  folioTramite: string;
  tipoTramite: string;
  estatus:string;
  fechaAltaDeRegistro:string;
  folio?: string;
  fechaAltaRegistro?: string;
}

export interface Contribuyente {
  id_persona_sol: number | null;
  id_persona_persona_sol_r: number | null;
  id_solicitud: number | null;
  tipo_persona: string;
  nombre: string | null;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  bln_persona_moral: boolean;
  tipo_sociedad: string;
  razon_social: string;
  rfc: string;
  curp: string | null;
  correo_electronico: string;
  telefono: string;
  descripcion_giro: string;
  bln_extranjero: boolean;
  domicilio: {
    id_direccion_sol: number | null;
    calle: string;
    cp: string;
    num_exterior: string;
    num_interior: string;
    colonia: { clave: string; nombre: string };
    localidad: { clave: string; nombre: string };
    delegacion_municipio: { clave: string; nombre: string };
    entidad_federativa: { clave: string; nombre: string };
    pais: { clave: string; nombre: string };
  };
}

export interface RepresentanteApiResponseItem {
  apellidoMaterno: string | null;
  apellidoPaterno: string | null;
  curp: string | null;
  nombre: string;
  resultadoIDC: boolean;
  rfc: string;
  contribuyente: Contribuyente;
}

export interface BuscarRepresentanteRfcApiResponse {
  codigo: string;
  mensaje: string;
  datos: RepresentanteApiResponseItem[];
}

export interface ParticipanteInfo {
  apellidoMaterno: string | null;
  apellidoPaterno: string | null;
  curp: string | null;
  nombre: string | null;
  resultadoIDC: boolean;
  rfc: string | null;
}