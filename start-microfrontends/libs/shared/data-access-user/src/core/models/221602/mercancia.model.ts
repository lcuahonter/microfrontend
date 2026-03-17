
export interface Mercancia {
  noPartida: number;
  tipoRequisito: string;
  requisito: string;
  numeroCertificadoInternacional: number;
  fraccionArancelaria: string;
  nico: string;
  descripcionNico: string;
  descripcion: string;
  unidadMedidaTarifa: string;
  cantidadUmt: number;
  unidadMedidaComercializacion: string;
  cantidadUmc: number;
  uso: string;
  tipoProducto: string;
  numeroLote: string;
  paisOrigen: string;
  paisProcedencia: string;
  certificadoInternacionalElectronico: string;
}

export interface Exportador {
  nombreDenominacionORazonSocial: string;
  telefono: string;
  correoElectronico: string;
  domicilio: string;
  pais: string;
}

export interface Destinatario {
  nombreDenominacionORazonSocial: string;
  telefono: string;
  correoElectronico: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  pais: string;
  colonia: string;
  municipioOAlcaldia: string;
  entidadFederativa: string;
  codigoPostal: string;
}

  export const PASOS = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Anexar requisitos',
        activo: false,
        completado: false,
    },
    {
        indice: 3,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    },
  ];
  
  export const MENSAJE_TABLA_OBLIGATORIA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';
  
  export const DATOS_SOLICITUD =
 ' Al dar clic en el boton "Cargar" se creara una nueva solicitud con los mismos datos de la solicitud 202768246';


 export const CONFIGURATION_TABLA_DATOS = [
  { encabezado: 'Nombre/denominación o razón social', clave: (item: Exportador): string => item.nombreDenominacionORazonSocial, orden: 1 },
  { encabezado: 'Teléfono', clave: (item: Exportador): string => item.telefono, orden: 2 },
  { encabezado: 'Correo electrónico', clave: (item: Exportador): string => item.correoElectronico, orden: 3 },
  { encabezado: 'Domicilio', clave: (item: Exportador): string => item.domicilio, orden: 4 },
  { encabezado: 'País', clave: (item: Exportador): string => item.pais, orden: 5 }
];

export const CONFIGURATION_TABLA_MERCANCIAS = [
  { encabezado: 'Número de partida', clave: (item: Mercancia): number => item.noPartida, orden: 1 },
  { encabezado: 'Tipo de requisito', clave: (item: Mercancia): string => item.tipoRequisito, orden: 2 },
  { encabezado: 'Requisito', clave: (item: Mercancia): string => item.requisito, orden: 3 },
  { encabezado: 'Número de Certificado Internacional', clave: (item: Mercancia): number => item.numeroCertificadoInternacional, orden: 4 },
  { encabezado: 'Fracción arancelaria', clave: (item: Mercancia): string => item.fraccionArancelaria, orden: 5 },
  { encabezado: 'NICO', clave: (item: Mercancia): string => item.nico, orden: 6 },
  { encabezado: 'Descripción NICO', clave: (item: Mercancia): string => item.descripcionNico, orden: 7 },
  { encabezado: 'Descripción', clave: (item: Mercancia): string => item.descripcion, orden: 8 },
  { encabezado: 'Unidad de medida de tarifa', clave: (item: Mercancia): string => item.unidadMedidaTarifa, orden: 9 },
  { encabezado: 'Cantidad UMT', clave: (item: Mercancia): number => item.cantidadUmt, orden: 10 },
  { encabezado: 'Unidad de medida de comercialización', clave: (item: Mercancia): string => item.unidadMedidaComercializacion, orden: 11 },
  { encabezado: 'Cantidad UMC', clave: (item: Mercancia): number => item.cantidadUmc, orden: 12 },
  { encabezado: 'Uso', clave: (item: Mercancia): string => item.uso, orden: 13 },
  { encabezado: 'Tipo de Producto', clave: (item: Mercancia): string => item.tipoProducto, orden: 14 },
  { encabezado: 'Número de lote', clave: (item: Mercancia): string => item.numeroLote, orden: 15 },
  { encabezado: 'País de origen', clave: (item: Mercancia): string => item.paisOrigen, orden: 16 },
  { encabezado: 'País de procedencia', clave: (item: Mercancia): string => item.paisProcedencia, orden: 17 },
  { encabezado: 'Certificado Internacional Electrónico', clave: (item: Mercancia): string => item.certificadoInternacionalElectronico, orden: 18 }
];


export const CONFIGURATION_TABLA_DESTINATARIO = [
  { encabezado: 'Nombre/denominación o razón social', clave: (item: Destinatario): string => item.nombreDenominacionORazonSocial, orden: 1 },
  { encabezado: 'Teléfono', clave: (item: Destinatario): string => item.telefono, orden: 2 },
  { encabezado: 'Correo electrónico', clave: (item: Destinatario): string => item.correoElectronico, orden: 3 },
  { encabezado: 'Calle', clave: (item: Destinatario): string => item.calle, orden: 4 },
  { encabezado: 'Número exterior', clave: (item: Destinatario): string => item.numeroExterior, orden: 5 },
  { encabezado: 'Número interior', clave: (item: Destinatario): string => item.numeroInterior, orden: 6 },
  { encabezado: 'País', clave: (item: Destinatario): string => item.pais, orden: 7 },
  { encabezado: 'Colonia', clave: (item: Destinatario): string => item.colonia, orden: 8 },
  { encabezado: 'Municipio o Alcaldía', clave: (item: Destinatario): string => item.municipioOAlcaldia, orden: 9 },
  { encabezado: 'Entidad Federativa', clave: (item: Destinatario): string => item.entidadFederativa, orden: 10 },
  { encabezado: 'Código Postal', clave: (item: Destinatario): string => item.codigoPostal, orden: 11 }
];
