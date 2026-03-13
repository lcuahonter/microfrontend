export interface TramitesAsociados {
    folioTramite: string;
    tipoTramite: string;
    estatus: string;
    fetchAlta: string;
}

export interface Destinatario {
    nombre: string;
    rfc: string;
    curp: string;
    telefono: string;
    correoElectronico: string;
    calle: string;
    numeroExterior: string;
    numeroInterior: string;
    pais: string;
    colonia: string;
    municipio: string;
    localidad: string;
    entidadFederativa: string;
    estado: string;
    codigoPostal: string;
    coloniaEquivalente: string;
}

export interface Fabricante260701 {
    nombre: string,
    rfc: string,
    curp: string,
    telefono: string,
    correoElectronico: string,
    calle: string,
    numeroExterior: string,
    numeroInterior: string,
    pais: string,
    colonia: string,
    municipio: string,
    localidad: string,
    entidadFederativa: string,
    estado: string,
    cp: string,
}

export interface ScianModel {
    clave: string,
    descripcion: string,
}

export interface MercanciasInfo {
    clasificacion: string;
    especificar: string;
    denominacionEspecifica: string;
    denominacionDistintiva: string;
    denominacionComun: string;
    formaFarmaceutica: string;
    estadoFisico: string;
    fraccionArancelaria: string;
    descripcionFraccion: string;
    unidad: string;
    cantidadUMC: string;
    unidadUMT: string;
    cantidadUMT: string;
    presentacion: string;
    numeroRegistro: string;
    paisDeOrigen: string;
    paisDeProcedencia: string;
    tipoProducto: string;
    usoEspecifico: string;
    fechaCaducidad: string;
}

export interface Pedimento {
  patente: number;
  pedimento: number;
  aduana: number;
  idTipoPedimento: number;
  descTipoPedimento: string;
  numero: string;
  comprobanteValor: string;
  pedimentoValidado: boolean;
}

export interface Listaclaves {
    clave: string;
    fecha: string;
    fechaDeCaducidad: string;
}

export const NICO_TABLA = [
    {
      encabezado: 'Clave S.C.I.A.N.',
      clave: (ele: ScianModel): string => ele.clave,
      orden: 1,
    },
    {
      encabezado: 'Descripción del S.C.I.A.N.',
      clave: (ele: ScianModel): string => ele.descripcion,
      orden: 2,
    },
];

export const MERCANCIAS_DATA = [
    {
      encabezado: 'Clasificación del producto',
      clave: (ele: MercanciasInfo): string => ele.clasificacion,
      orden: 1,
    },
    {
      encabezado: 'Especificar clasificación del producto',
      clave: (ele: MercanciasInfo): string => ele.especificar,
      orden: 2,
    },
    {
      encabezado: 'Denominación específica del producto',
      clave: (ele: MercanciasInfo): string => ele.denominacionEspecifica,
      orden: 3,
    },
    {
      encabezado: 'Denominación distintiva',
      clave: (ele: MercanciasInfo): string => ele.denominacionDistintiva,
      orden: 4,
    },
    {
      encabezado: 'Denominación común, nombre común o nombre científico',
      clave: (ele: MercanciasInfo): string => ele.denominacionComun,
      orden: 5,
    },
    {
      encabezado: 'Forma farmacéutica',
      clave: (ele: MercanciasInfo): string => ele.formaFarmaceutica,
      orden: 6,
    },
    {
      encabezado: 'Estado físico',
      clave: (ele: MercanciasInfo): string => ele.estadoFisico,
      orden: 7,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciasInfo): string => ele.fraccionArancelaria,
      orden: 8,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (ele: MercanciasInfo): string => ele.descripcionFraccion,
      orden: 9,
    },
    {
      encabezado: 'Unidad de medida de comercialización (UMC)',
      clave: (ele: MercanciasInfo): string => ele.unidad,
      orden: 10,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (ele: MercanciasInfo): string => ele.cantidadUMC,
      orden: 11,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (ele: MercanciasInfo): string => ele.unidadUMT,
      orden: 12,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (ele: MercanciasInfo): string => ele.cantidadUMT,
      orden: 13,
    },
    {
      encabezado: 'Presentación',
      clave: (ele: MercanciasInfo): string => ele.presentacion,
      orden: 14,
    },
    {
      encabezado: 'Número de registro sanitario',
      clave: (ele: MercanciasInfo): string => ele.numeroRegistro,
      orden: 15,
    },
    {
      encabezado: 'País de orígen',
      clave: (ele: MercanciasInfo): string => ele.paisDeOrigen,
      orden: 16,
    },
    {
      encabezado: 'País de procedencia',
      clave: (ele: MercanciasInfo): string => ele.paisDeProcedencia,
      orden: 17,
    },
    {
      encabezado: 'Tipo producto',
      clave: (ele: MercanciasInfo): string => ele.tipoProducto,
      orden: 18,
    },
    {
      encabezado: 'Uso específico',
      clave: (ele: MercanciasInfo): string => ele.usoEspecifico,
      orden: 19,
    },
    {
      encabezado: 'Fecha de caducidad',
      clave: (ele: MercanciasInfo): string => ele.fechaCaducidad,
      orden: 20,
    },
  ];
  
  export const LISTACLAVESDELOSLOTES = [
    {
      encabezado: 'Clave de los lotes',
      clave: (ele: Listaclaves): string => ele.clave,
      orden: 1,
    },
    {
      encabezado: 'Fecha de fabricación',
      clave: (ele: Listaclaves): string => ele.fecha,
      orden: 2,
    },
    {
      encabezado: 'Fecha de caducidad',
      clave: (ele: Listaclaves): string => ele.fechaDeCaducidad,
      orden: 3,
    }
  ];