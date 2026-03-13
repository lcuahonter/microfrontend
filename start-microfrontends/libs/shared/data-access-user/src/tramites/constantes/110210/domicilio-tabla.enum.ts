/** Datos de la tabla de domicilios
 * @interface DomicilioTabla
 * @description Interface que contiene los datos específicos de la tabla de domicilios
 */
export interface DomicilioTabla {
    numeroOrden: string;
    fraccionArancelaria: string;
    nombreTecnico: string;
    nombreComercial: string;
    nombreEnIngles: string;
    marca: string;
    complementoDescripcion: string;
    cantidadExportar: string;
    unidadMedidaComercializacion: string;
    valorMercancia: string;
    numeroFactura: string;
    fechaFactura: string;
    notas: string;
}

/** Configuración de las columnas para la tabla de domicilios
 * @constant DOMICILIO_TABLA_COLUMNAS
 * @type {Array}
 */
export const DOMICILIO_TABLA_COLUMNAS = [
    {
        encabezado: 'Número de orden',
        clave: (ele: DomicilioTabla): string => ele.numeroOrden,
        orden: 1
    },
    {
        encabezado: 'Fracción arancelaria',
        clave: (ele: DomicilioTabla): string => ele.fraccionArancelaria,
        orden: 2
    },
    {
        encabezado: 'Nombre técnico',
        clave: (ele: DomicilioTabla): string => ele.nombreTecnico,
        orden: 3
    },
    {
        encabezado: 'Nombre comercial',
        clave: (ele: DomicilioTabla): string => ele.nombreComercial,
        orden: 4
    },
    {
        encabezado: 'Nombre en Inglés',
        clave: (ele: DomicilioTabla): string => ele.nombreEnIngles,
        orden: 5
    },
    {
        encabezado: 'Marca',
        clave: (ele: DomicilioTabla): string => ele.marca,
        orden: 6
    },
    {
        encabezado: 'Complemento de la Descripción',
        clave: (ele: DomicilioTabla): string => ele.complementoDescripcion,
        orden: 7
    },
    {
        encabezado: 'Cantidad a exportar',
        clave: (ele: DomicilioTabla): string => ele.cantidadExportar,
        orden: 8
    },
    {
        encabezado: 'Unidad de medida de comercialización',
        clave: (ele: DomicilioTabla): string => ele.unidadMedidaComercializacion,
        orden: 9
    },
    {
        encabezado: 'Valor de la mercancía',
        clave: (ele: DomicilioTabla): string => ele.valorMercancia,
        orden: 10
    },
    {
        encabezado: 'Número de factura',
        clave: (ele: DomicilioTabla): string => ele.numeroFactura,
        orden: 11
    },
    {
        encabezado: 'Fecha de Factura',
        clave: (ele: DomicilioTabla): string => ele.fechaFactura,
        orden: 12
    },
    {
        encabezado: 'Norma',
        clave: (ele: DomicilioTabla): string => ele.notas,
        orden: 13
    }
];

/** Datos de mercancía para el Certificado ALADI
 * @interface MercanciaCertificadoALADI
 * @description Interface que contiene los datos específicos de la mercancía para el Certificado ALADI
 */
export interface MercanciaCertificadoALADI {
  numeroOrden?: number;

  naladi?: string;
  desNaladi?: string;

  naladisa93?: string;
  descNaladisa93?: string;

  naladisa96?: string;
  descNaladisa96?: string;

  naladisa02?: string;
  descNaladisa02?: string;

  fraccionArancelaria?: string;

  nombreTecnico?: string;
  nombreComercial?: string;
  complementoDescripcion?: string;

  cantidadExportar?: number;
  umc?: string; // Unidad de medida de comercialización

  valorMercancia?: number;

  numFactura?: string;
  fecFactura?: string;

  norma?: string;
}

/** Configuración de las columnas para la tabla de mercancías del Certificado ALADI
 * @constant MERCANCIAS_CERTIFICADO_ALADI_COLUMNAS
 * @type {Array}
 */
export const MERCANCIAS_CERTIFICADO_ALADI_COLUMNAS = [
  {
    encabezado: 'Número de orden',
    clave: (ele: MercanciaCertificadoALADI): string => ele.numeroOrden !== undefined ? ele.numeroOrden.toString() : '',
    orden: 1
  },
  {
    encabezado: 'NALADI',
    clave: (ele: MercanciaCertificadoALADI): string => ele.naladi ?? '',
    orden: 2
  },
  {
    encabezado: 'Descripción NALADI',
    clave: (ele: MercanciaCertificadoALADI): string => ele.desNaladi ?? '',
    orden: 3
  },
  {
    encabezado: 'NALADISA 1993',
    clave: (ele: MercanciaCertificadoALADI): string => ele.naladisa93 ?? '',
    orden: 4
  },
  {
    encabezado: 'Descripción NALADISA 1993',
    clave: (ele: MercanciaCertificadoALADI): string => ele.descNaladisa93 ?? '',
    orden: 5
  },
  {
    encabezado: 'NALADISA 1996',
    clave: (ele: MercanciaCertificadoALADI): string => ele.naladisa96 ?? '',
    orden: 6
  },
  {
    encabezado: 'Descripción NALADISA 1996',
    clave: (ele: MercanciaCertificadoALADI): string => ele.descNaladisa96 ?? '',
    orden: 7
  },
  {
    encabezado: 'NALADISA 2002',
    clave: (ele: MercanciaCertificadoALADI): string => ele.naladisa02 ?? '',
    orden: 8
  },
  {
    encabezado: 'Descripción NALADISA 2002',
    clave: (ele: MercanciaCertificadoALADI): string => ele.descNaladisa02 ?? '',
    orden: 9
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: MercanciaCertificadoALADI): string => ele.fraccionArancelaria ?? '',
    orden: 10
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: MercanciaCertificadoALADI): string => ele.nombreTecnico ?? '',
    orden: 11
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: MercanciaCertificadoALADI): string => ele.nombreComercial ?? '',
    orden: 12
  },
  {
    encabezado: 'Complemento de la Descripción',
    clave: (ele: MercanciaCertificadoALADI): string => ele.complementoDescripcion ?? '',
    orden: 13
  },
  {
    encabezado: 'Cantidad a exportar',
    clave: (ele: MercanciaCertificadoALADI): string => ele.cantidadExportar !== undefined ? ele.cantidadExportar.toString() : '',
    orden: 14
  },
  {
    encabezado: 'Unidad de medida de comercialización',
    clave: (ele: MercanciaCertificadoALADI): string => ele.umc ?? '',
    orden: 15
  },
  {
    encabezado: 'Valor de la mercancía',
    clave: (ele: MercanciaCertificadoALADI): string => ele.valorMercancia !== undefined ? ele.valorMercancia.toString() : '',
    orden: 16
  },
  {
    encabezado: 'Número de factura',
    clave: (ele: MercanciaCertificadoALADI): string => ele.numFactura ?? '',
    orden: 17
  },
  {
    encabezado: 'Fecha de Factura',
    clave: (ele: MercanciaCertificadoALADI): string => ele.fecFactura ?? '',
    orden: 18
  },
  {
    encabezado: 'Norma',
    clave: (ele: MercanciaCertificadoALADI): string => ele.norma ?? '',
    orden: 19
  }
];

/** Datos del certificado SGP
 * @interface SGPcertificado
 * @description Interface que contiene los datos específicos del certificado SGP
 */
export interface SGPcertificado {
  numeroOrden?: string;
  fraccionArancelaria?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  nombreEnIngles?: string;
  complementoDescripcion?: string;
  cantidad?: string;
  umc?: string;
  numFactura?: string;
  fecFactura?: string;
}

/** Configuración de las columnas para la tabla del certificado SGP
 * @constant SGP_CERTIFICADO_COLUMNAS
 * @type {Array}
 */
export const SGP_CERTIFICADO_COLUMNAS = [
  {
    encabezado: 'Número de orden',
    clave: (ele: SGPcertificado): string => ele.numeroOrden ?? '',
    orden: 1
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: SGPcertificado): string => ele.fraccionArancelaria ?? '',
    orden: 2
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: SGPcertificado): string => ele.nombreTecnico ?? '',
    orden: 3
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: SGPcertificado): string => ele.nombreComercial ?? '',
    orden: 4
  },
  {
    encabezado: 'Nombre en Inglés',
    clave: (ele: SGPcertificado): string => ele.nombreEnIngles ?? '',
    orden: 5
  },
  {
    encabezado: 'Complemento de la Descripción',
    clave: (ele: SGPcertificado): string => ele.complementoDescripcion ?? '',
    orden: 6
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: SGPcertificado): string => ele.cantidad ?? '',
    orden: 7
  },
  {
    encabezado: 'Unidad de medida de comercialización',
    clave: (ele: SGPcertificado): string => ele.umc ?? '',
    orden: 8
  },
  {
    encabezado: 'Número de factura',
    clave: (ele: SGPcertificado): string => ele.numFactura ?? '',
    orden: 9
  },
  {
    encabezado: 'Fecha de Factura',
    clave: (ele: SGPcertificado): string => ele.fecFactura ?? '',
    orden: 10
  }
]

/** Datos del certificado SGP (versión extendida)
 * @interface SGPcertificadoExtendido
 * @description Interface que contiene los datos del certificado SGP para la tabla detallada
 */
export interface CertificadoPanama {
  numeroOrden?: string;
  fraccionArancelaria?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  complementoDescripcion?: string;
  cantidadExportar?: string;
  umc?: string;
  valorMercancia?: string;
  numFactura?: string;
  fecFactura?: string;
  norma?: string;
}

/** Configuración de las columnas para la tabla del certificado SGP (extendido)
 * @constant SGP_CERTIFICADO_EXTENDIDO_COLUMNAS
 * @type {Array}
 */
export const CERTIFICADO_PANAMA_COLUMNAS = [
  {
    encabezado: 'Número de orden',
    clave: (ele: CertificadoPanama): string => ele.numeroOrden ?? '',
    orden: 1
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: CertificadoPanama): string => ele.fraccionArancelaria ?? '',
    orden: 2
  },
  {
    encabezado: 'Nombre técnico',
    clave: (ele: CertificadoPanama): string => ele.nombreTecnico ?? '',
    orden: 3
  },
  {
    encabezado: 'Nombre comercial',
    clave: (ele: CertificadoPanama): string => ele.nombreComercial ?? '',
    orden: 4
  },
  {
    encabezado: 'Complemento de la descripción',
    clave: (ele: CertificadoPanama): string => ele.complementoDescripcion ?? '',
    orden: 5
  },
  {
    encabezado: 'Cantidad a exportar',
    clave: (ele: CertificadoPanama): string => ele.cantidadExportar ?? '',
    orden: 6
  },
  {
    encabezado: 'Unidad de medida de comercialización',
    clave: (ele: CertificadoPanama): string => ele.umc ?? '',
    orden: 7
  },
  {
    encabezado: 'Valor de la mercancía',
    clave: (ele: CertificadoPanama): string => ele.valorMercancia ?? '',
    orden: 8
  },
  {
    encabezado: 'Número de factura',
    clave: (ele: CertificadoPanama): string => ele.numFactura ?? '',
    orden: 9
  },
  {
    encabezado: 'Fecha de factura',
    clave: (ele: CertificadoPanama): string => ele.fecFactura ?? '',
    orden: 10
  },
  {
    encabezado: 'Norma',
    clave: (ele: CertificadoPanama): string => ele.norma ?? '',
    orden: 11
  }
];


