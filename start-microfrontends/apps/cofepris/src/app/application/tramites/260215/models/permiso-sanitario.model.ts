/**
 * Modelo de datos para el permiso sanitario.
 * Contiene información básica sobre el permiso sanitario.
 */
export interface PermisoModel {
  Nombre: string;
  RFC: string;
  CURP: string;
  Teléfono: number;
  CorreoElectrónico: string;
  calle: string;
}
/**
 * Modelo de datos para la información NICO.
 * Contiene la clave y descripción del S.C.I.A.N.
 */
export interface NicoInfo {
  clave_Scian: string;
  descripcion_Scian: string;
}
/**
 * Configuración de las columnas para la tabla NICO.
 *  Contiene los encabezados y las funciones para obtener los valores de cada columna.
 */
export const NICO_TABLA = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (ele: NicoInfo): string => ele.clave_Scian,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (ele: NicoInfo): string => ele.descripcion_Scian,
    orden: 2,
  },
];

/**
 * Modelo de datos para la información de mercancías.
 * Contiene detalles específicos sobre las mercancías.
 */
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
/**
 * Configuración de las columnas para la tabla de mercancías.
 * Contiene los encabezados y las funciones para obtener los valores de cada columna.
 */
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

/**
 * Modelo de datos para una fila de una tabla.
 * Representa los datos que se mostrarán en la tabla.
 */
export interface TablaDatos {
  /**
   * Datos de la fila representados por un arreglo de cadenas.
   *
   * @property {string[]} tbodyData - Datos de la fila que se mostrarán en la tabla.
   */
  tbodyData: string[];
}

/**
 * Modelo de datos para una solicitud.
 * Contiene información básica sobre la solicitud.
 */
export interface SolicitudModel {
  fechaCreacion: string;
  mercancia: string;
  cantidad: string;
  proveedor: string;
}


/**
 * Interfaz que representa los datos de un representante.
 * 
 * @property {string} rfc - Registro Federal de Contribuyentes del representante.
 * @property {string} nombre - Nombre del representante.
 * @property {string} apellidoPaterno - Apellido paterno del representante.
 * @property {string} apellidoMaterno - Apellido materno del representante.
 */
export interface ReprestantanteData {
  rfc: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

 export const NACIONAL_FISICA = [
    'denominacionRazonSocial',
    'entidadFederativa',
    'coloniaoEquivalente',
    'extranjeroCodigo',
    'extranjeroEstado',
    'extranjeroColonia',
  ]
  export const NACIONAL_MORAL = [
    'curp',
    'nombre',
    'primerApellido',
    'segundoApellido',
    'entidadFederativa',
    'codigoPostaloEquivalente',
    'coloniaoEquivalente',
    'extranjeroCodigo',
    'extranjeroEstado',
    'extranjeroColonia',
  ]
  export const EXTRANJERO_MORAL = [
    'rfc',
    'curp',
    'nombre',
    'primerApellido',
    'segundoApellido',
    'municipioAlcaldia',
    'localidad',
    'entidadFederativa',
    'colonia',
    'extranjeroCodigo',
    'extranjeroEstado',
    'extranjeroColonia',
  ]
  export const EXTRANJERO_FISICA =[
    'rfc',
    'curp',
    'denominacionRazonSocial',
    'municipioAlcaldia',
    'localidad',
    'entidadFederativa',
    'colonia',
    'extranjeroCodigo',
    'extranjeroEstado',
    'extranjeroColonia'
  ]

  export const ID_PROCEDIMIENTO = 260215;