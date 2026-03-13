export interface PlantasSubfabricante {
    calle :string,
    numExterior :number,
    numInterior :number,
    codigoPostal:number
    colonia :string,
    municipio :string,
    entidadFederativa :string,
    pais :string,
    rfc :string,
    domicilioFiscal :string,
    razonSocial :string
  }

  export interface DatosSubcontratista {
    rfc: string;
    estado : string | null;
  }

  export interface EmpressaSubFabricantePlantas{
    datosSubcontratista:DatosSubcontratista;
      plantasBuscadas:PlantasSubfabricante[],
      plantasSubfabricantesAgregar:PlantasSubfabricante [],
      plantasPorCompletar:PlantasSubfabricante[]
  }

export interface RespuestaSubfabricantes {
  code: number;
  data: PlantasSubfabricante[];
}


export interface BuscarPayload {
    rfcEmpresaSubManufacturera: string;
    entidadFederativa: string;
    idPrograma: string | null;
}