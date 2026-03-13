

export interface ProsecModificacionModel {
  calle: string; 
  numeroExterior: string; 
  numeroInterior : string; 
  codigoPostal: string; 
  colonia: string; 
  localidad:string;
  municipioOAlcaldia:string;
  entidadFederativa:string;
  pais:string;
  razonSocial:string;
  rfc:string;
  }


  export interface PLANTAS{
    calle: string; 
    numeroExterior: string; 
    numeroInterior : string; 
    codigoPostal: string; 
    colonia: string; 
    municipioOAlcaldia:string;
    entidadFederativa:string;
    pais:string;
    telefono:string;  
  }
  export interface SectorModel {
    listaDeSectores:string;
    claveDelSector:string;
    estatus:string;
  }
  export interface MercanciasModel {
    fraccionArancelaria : string;
    claveDelSector :string;
    eStatus:string;
  }
  export interface ProductorIndirecto {
    registroFederal :string;
    denominacion:string;
    correo :string;
    eStatus:string;
  }
  export interface BitacoraModel {
    tipoModificacion:string;
    fechaModificacion:string;
    valoresAnteriores:string;
    valoresNuevos:string;
  }
  export interface ModificacionInfo {
    registroFederalContribuyentes:string;
    representacionFederal:string;
    tipoModificacion:string;
    modificacionPrograma:string
  }
  export interface EstadoData {
    id :string;
    descripcion:string;
  }