export interface AccionBoton {
    accion: string;
    valor: number;
  }

  export interface PermisoModel {
    Nombre : string;
     RFC :string;
     CURP :string;
     Teléfono:number;
     CorreoElectrónico:string;
     calle:string;
     numeroExterior:number;
     numeroInterior:number;
        pais:string;
        colonia:string;
        municipio:string;
        localidad:string;
        entidadFederativa:string;
        estadoLocalidad:string;
        codigoPostal:number;
}