export interface PlantasSubfabricante {
    calle :string,
    numExterior :number,
    numInterior :number,
    codigoPostal:number
    colonia :string
  }

  export interface DatosSubcontratista {
    rfc: string;
    estado : string;
  }

  export interface EmpressaSubFabricantePlantas{
    datosSubcontratista:DatosSubcontratista;
      plantasBuscadas:PlantasSubfabricante[],
      plantasSubfabricantesAgregar:PlantasSubfabricante [],
      plantasPorCompletar:PlantasSubfabricante[]
  }