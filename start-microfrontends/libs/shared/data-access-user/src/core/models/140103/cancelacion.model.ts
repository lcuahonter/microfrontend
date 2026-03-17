export interface Cupo {
    cupo: number;// The amount of the "cupo" as a number
    nombreProducto: string;// The product name as a string
    nombreSubproducto: string;// The subproduct name as a string
    mecanismoAsignacion: string; // The mechanism of assignment as a string
    tipoCupo: string;// The type of "cupo" as a string
  }
  
  export interface Facturas {
    numeroDeFactura: string;// The number of the invoice (string)
    importeInicial: string;// The initial amount (string)
    saldoaDevolver?: string;// The amount to be refunded (string, optional as it may be empty)
  }
  
  export interface Facturase {
    numeroDeFactura: string;// The number of the invoice (string)
    importeInicial: string;// The initial amount (string)
  
  }
  
  export interface CertificadosCancelar {
    folioOficioCertificado: string;
    nombreRazonSocial: string;
    estado: string;
    fabricante: string;
    importador: string;
    unidadPrimaria: number;
    montoExpediente: number;
    montocancelar: number;
    montoutilizado: number;
  }
  export interface AccionBoton {
    accion: string;
    valor: number;
  }
  