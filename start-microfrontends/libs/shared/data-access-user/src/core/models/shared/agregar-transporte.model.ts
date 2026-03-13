export interface TransporteCarretero {
  empTransportista: string;
  numeroPorte: string;
  fechaPorte: string;
  marcaTransporte: string;
  modeloTransporte: string;
  placasTransporte: string;
  contenedorTransporte: string;
  observaciones: string;
}

export interface TransporteFerroviario {
  numeroBL: string;
  tipoEquipo: string;
  inicialesEquipo: string;
  numeroEquipo: string;
  observaciones: string;
}

export interface TransportePeatonal {
  empTransportista: string;
  rfcEmpresa: string;
  nombreTransportista: string;
  numGafete: string;
  observaciones: string;
}

export interface TransporteOtro {
  tipoTransporteDes: string;
  empTransportista: string;
  datosTransporte: string;
  observaciones: string;
}

export interface TransporteAereo {
  arriboPendienteAereo: string;
  guiaMasterAereo: string;
  guiaHouseAereo: string;
  fechaArriboAereo: string;
  horaArriboAereo: string;
  guiaValida: string;
  observaciones: string;
}

export interface TransporteMaritimo {
  guiaBLMaritimo: string;
  guiaHouseMaritimo: string;
  nombreBuqueMaritimo: string;
  contenedorMaritimo: string;
  observaciones: string;
}

export interface ItemTransporte {
  llave:
    | keyof TransporteCarretero
    | keyof TransporteFerroviario
    | keyof TransportePeatonal
    | keyof TransporteOtro
    | keyof TransporteAereo
    | keyof TransporteMaritimo;
  valor: string;
}

export interface ItemTransporteDespacho {
  llave: keyof TransporteDespacho;
  valor: string;
}

export interface TransporteDespacho {
  seleccionado?: boolean;
  tipo_transporte: string;

  emp_transportista?: string;
  numero_porte?: string;
  fecha_porte?: string;
  marca_transporte?: string;
  modelo_transporte?: string;
  placas_transporte?: string;
  contenedor_transporte?: string;

  numero_bl?: string;
  tipo_equipo?: string;
  iniciales_equipo?: string;
  numero_equipo?: string;

  rfc_empresa?: string;
  nombre_transportista?: string;
  num_gafete?: string;

  guia_bl_Maritimo?: string;
  guia_house_maritimo?: string;
  nombre_buque_maritimo?: string;
  contenedor_maritimo?: string;

  guia_house_valida?: boolean | string;
  guia_master_valida?: boolean | string;
  descripcion_equipo?: string;

  arribo_pendiente_aereo?: boolean;
  arribo_pendiente_aereo_des?: string;
  guia_master_aereo?: string;
  guia_house_aereo?: string;
  fecha_arribo_aereo?: string;
  hora_arribo_aereo?: string;
  guia_valida?: boolean;
  guia_valida_des?: string;

  tipo_transporte_des?: string;
  datos_transporte?: string;

  observaciones?: string;
  mismos_datos_transporte?: boolean;
}
