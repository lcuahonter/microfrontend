export interface Complementaria {
  numerodelicitacion: string;
  fechadelicitacion: string;
  descripcion: string;
  montoadjudicado: string;
  fechainiciovigencia: string;
  fechafinvigencia: string;
  registrofederaldecontribuyentes: string;
}
export interface Adquiriente {
    rfc:string,
    adquirienteMontoDisponible:string,
    montoRecibir:string
}
export interface LicitacionesDisponibles {
  numerodelicitacion: string;
  fechadelicitacion: string;
  descripcion: string;
  montoadjudicado: string;
  fechainiciovigencia: string;
  fechafinvigencia: string;

}
export interface DetallesLicitacion {
  numeraDelicitacion: string;
  fechaDelEventoDelicitacion: string;
  descripcionDelProducto: string;
  unidadTarifaria: string;
  regimenAduanero: string;
  fraccionArancelaria: string;
  fechaDeiniciodeVigenciadelCupo:string,
  adquirienteMontoDisponible:string,
  fechaDefindeVigenciadelCupo:string,
  obserVaciones:string,
  bloqueComercial:string,
  paises:string,
  montoadJudicado:string,
  montoDisponible:string,
  montoMaximo:string
}
export const CONFIGURACION_ACCIONISTAS_TABLA = [
  {
    encabezado: 'Número de licitación',
    clave: (ele: Complementaria):string => ele.numerodelicitacion,
    orden: 1
  },
  {
    encabezado: 'Fecha de evento de licitación pública',
    clave: (ele: Complementaria):string => ele.fechadelicitacion,
    orden: 2
  },
  {
    encabezado: 'Descripción del producto ',
    clave: (ele: Complementaria): string => ele.descripcion,
    orden: 3
  },
  {
    encabezado: 'Monto adjudicado',
    clave: (ele: Complementaria):string => ele.montoadjudicado,
    orden: 4
  },
  {
    encabezado: 'Fecha inicio vigencia',
    clave: (ele: Complementaria):string => ele.fechainiciovigencia,
    orden: 5
  },
  {
    encabezado: 'Fecha fin vigencia',
    clave: (ele: Complementaria):string => ele.fechafinvigencia,
    orden: 6
  }
]
 