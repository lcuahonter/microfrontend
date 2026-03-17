export interface ColumnasTabla {
  numeroCertificado: string;
  pais: string;
  tratado: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
}

export interface CertificadoApiData {
  [key: string]: unknown;
  numeroCertificado: string;
  paisAsociado?: {
    nombre?: string;
    codigo?: string;
    descripcion?: string;
  };
  tratadoAsociado?: {
    nombre?: string;
    codigo?: string;
    descripcion?: string;
  };
  fechaExpedicion?: string;
  fechaVencimiento?: string;
  nombre: string;
  observaciones?: string;
  nombreEmbarcacion?: string;
  mercancias?: MercanciaCertificado[];
  solicitud: {
    destinatario: {
    nombre?: string;
    apellidoMaterno?: string;
    apellidoPaterno?: string;
    razonSocial?: string;
    numeroPermiso?: string;
    correoElectronico?: string;
    domicilio: {
      telefono?: string;
      ciudad?: string;
      fax?: string;
    }
    };  
    representanteLegal: {
      nombre?: string;
      telefono?: string;
      correoElectronico?: string;
    };
  };
  mercanciasAsociadas: [
    {
      numeroRegistro: string;
      numeroOrden: string;
      idMercanciaCertificado: string;
      fraccionArancelaria?: string;
      nombreTecnico?: string;
      nombreComercial?: string;
      nombreIngles?: string;
      complementoDescripcion?: string;
      cantidad: string;
      unidadMedidaComercial: string;
      unidadMedidaDescripcion: string;
      masaBruta: string;
      unidadMedidaMasaBruta: string;
      numeroFactura: string;
      fechaFactura: string;
      tipoFactura: string;
      valorMercancia: string;
      marca: string;
    }
  ];
  productores: [
    {
      nombre: string;
      telefono: string;
      razonSocial: string;
      correoElectronico: string;
      direcciones: string;
      domicilio: {
        fax: string;
      };
    }
  ]
}

export interface MercanciaCertificado {
  numeroOrden: string;
  fraccionArancelaria: string;
  nombreTecnico: string;
  nombreComercial: string;
  nombreIngles: string;
  complementoDescripcion: string;
  marca: string;
  criterio: string;
  norma: string;
  cantidadExportar: string;
  unidad: string;
  masaBruta : string;
  comercializacion : string;
  valorMercancia: string;
  numeroFactura: string;
  fechaFactura: string;
  registroProductos: string;
}

export interface ProductoresAsociados {
  nombreProductor: string;
  numeroRegistroFiscal: string;
  direccion: string;
  correoElectronico: string;
  telefono: string;
  fax: string;
}

export const FECHAI_NICIAL = {
  labelNombre: 'Fecha inicial:',
  required: false,
  habilitado: true,
};

export const FECHA_FINAL = {
  labelNombre: 'Fecha final:',
  required: false,
  habilitado: true,
};

export const FECHA_EXPEDICION = {
  labelNombre: 'Fecha de expedición',
  required: false,
  habilitado: true,
};

export const FECHA_VENCIMIENTO = {
  labelNombre: 'Fecha de vencimiento',
  required: false,
  habilitado: true,
  readonly: true,
 
};
