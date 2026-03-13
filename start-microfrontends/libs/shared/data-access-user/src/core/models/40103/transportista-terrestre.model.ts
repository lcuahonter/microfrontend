export interface Nacional {
    curp: string;
    nombre: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    paisChn: string;
    estado: string;
    apellidoPaterno: string;
    apellidoMaternoChn: string;
    rfc: string;
    gafete: string;
    vigenciaGafete: string;
    entidadFederativaChn: string;
    numeroDelSeguroSocial: string;
    nombres: string;
    delegacionChn: string;
    coloniaChn: string;
    paisOrigenChn: string;
    ciudad: string;
  }
  export interface Extranjero {
    curp: string;
    nombre: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    paisChn: string;
    estado: string;
    apelliDoPaterno: string;
    apelliDoMaternoChn: string;
    rfc: string;
    gafete: string;
    vigenciaGafete: string;
    entidadFederativaChn : string;
    numeroDelSeguroSocial: string;
  }
  export interface DatosDelVehículo {
    clave: string;
    descripcion: string;
  }
  export interface DatosDelVehículoPaisEmisor {
    clave1: number;
    descripcion2: string;
  }
  export interface VehiculoVEHs{
    clave: string;
    descripcion: string;
  }
  export interface VehiculoColor{
    clave: string;
    descripcion: string;
  }
  export interface Emisor2daPlaca{
    clave: string;
    descripcion: string;
  }
  export interface Catalogo {
    id: number;
    descripcion: string;
    clave?: string;
    tam?: string;
    dpi?: string;
  }
  export interface Tipos {
    tiposData: string; 
  }