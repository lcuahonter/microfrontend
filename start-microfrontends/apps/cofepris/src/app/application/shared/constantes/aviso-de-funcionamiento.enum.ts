import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

import {
  Asociados,
  DatosDeLaProductoModel,
  MercanciasInfo,
  PropietarioModel,
  ScianModel,
} from '../models/datos-de-la-solicitud.model';
/**
 * Configuración para el campo de RFC de autorización LDA.
 */
export const DESPACHO_LDA = {
  labelNombre: 'RFC autorización LDA',
  required: false,
  alfanumerico: true,
};
/**
 * Declaración de manifiestos para cumplir con normatividad.
 */
export const MANIFIESTOS_DECLARACION = {
  MANIFIESTOS: `Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.`

};

export const TRAMITES_ASOCIADOS : ConfiguracionColumna<Asociados>[] = [
    { encabezado: '', clave: (item: Asociados) => item.id, orden: 1 },
    { encabezado: 'Folio trámite', clave: (item: Asociados) => item.folio, orden: 2 },
    { encabezado: 'Tipo trámite', clave: (item: Asociados) => item.tipoTramite, orden: 3 },
    { encabezado: 'Estatus', clave: (item: Asociados) => item.estatus, orden: 4 },
    { encabezado: 'Fecha alta de registro', clave: (item: Asociados) => item.fechaAltaRegistro, orden: 5 },
  ];
/**
 * Configuración de columnas para la tabla de SCIAN.
 */
export const SCIAN_TABLE_CONFIG: ConfiguracionColumna<ScianModel>[] = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (item: ScianModel) => item.claveScian,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (item: ScianModel) => item.descripcionScian,
    orden: 2,
  },
];
/**
 * Configuración de columnas para los datos del producto.
 */

export const DATOS_DE_LA_PRODUCTO_MODEL: ConfiguracionColumna<DatosDeLaProductoModel>[] =
  [
    {
      encabezado: 'Tipo de producto',
      clave: (item: DatosDeLaProductoModel) => item.tipoDeProducto,
      orden: 1,
    },
    {
      encabezado: 'Nombre Específico',
      clave: (item: DatosDeLaProductoModel) => item.nombreEspecifico,
      orden: 2,
    },
    {
      encabezado: 'Cantidad o Volúmen',
      clave: (item: DatosDeLaProductoModel) => item.cantidadOVolumen,
      orden: 3,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (item: DatosDeLaProductoModel) => item.unidadDeMedida,
      orden: 4,
    },
    {
      encabezado: 'Presentación',
      clave: (item: DatosDeLaProductoModel) => item.Presentacion,
      orden: 5,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: DatosDeLaProductoModel) => item.fraccionArancelaria,
      orden: 6,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (item: DatosDeLaProductoModel) => item.descripcionDeLaFraccion,
      orden: 7,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (item: DatosDeLaProductoModel) => item.unidadDeMedidaDeTarifa,
      orden: 8,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (item: DatosDeLaProductoModel) => item.cantidadUMT,
      orden: 9,
    },
    {
      encabezado: 'Envase primario',
      clave: (item: DatosDeLaProductoModel) => item.envasePrimario,
      orden: 10,
    },
    {
      encabezado: 'Envase secundario',
      clave: (item: DatosDeLaProductoModel) => item.envaseSecundario,
      orden: 11,
    },
    {
      encabezado: 'Envase primario',
      clave: (item: DatosDeLaProductoModel) => item.transporteEnvasePrimario,
      orden: 12,
    },
    {
      encabezado: 'Envase secundario',
      clave: (item: DatosDeLaProductoModel) => item.transporteEnvaseSecundario,
      orden: 13,
    },
    {
      encabezado: 'País de origen',
      clave: (item: DatosDeLaProductoModel) => item.paisDeOrigen,
      orden: 14,
    },
    {
      encabezado: 'País de procedencia',
      clave: (item: DatosDeLaProductoModel) => item.paisDeProcedencia,
      orden: 15,
    },
    {
      encabezado: 'País de destino',
      clave: (item: DatosDeLaProductoModel) => item.paisDeDestino,
      orden: 16,
    },
    {
      encabezado: 'Uso específico',
      clave: (item: DatosDeLaProductoModel) => item.usoEpecifico,
      orden: 17,
    },
  ];
  /**
 * Configuración de columnas para la tabla de propietarios.
 */
export const ESTABLECIMIENTO_TABLE_CONFIG: ConfiguracionColumna<PropietarioModel>[] =
[
  {
    encabezado: 'Nombre/denominación o razón social',
    clave: (item: PropietarioModel) => item.NombredenominacionORazonSocial,
    orden: 1,
  },
  {
    encabezado: 'R.F.C.',
    clave: (item: PropietarioModel) => item.rfc,
    orden: 2,
  },
  {
    encabezado: 'CURP',
    clave: (item: PropietarioModel) => item.curp,
    orden: 3,
  },
  {
    encabezado: 'Teléfono',
    clave: (item: PropietarioModel) => item.telefono,
    orden: 4,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (item: PropietarioModel) => item.CorreoElectronico,
    orden: 5,
  },
  {
    encabezado: 'Calle',
    clave: (item: PropietarioModel) => item.calle,
    orden: 6,
  },
  {
    encabezado: 'Número exterior',
    clave: (item: PropietarioModel) => item.numeroExterior,
    orden: 7,
  },
  {
    encabezado: 'Número interior',
    clave: (item: PropietarioModel) => item.numeroInterior,
    orden: 8,
  },
  {
    encabezado: 'País',
    clave: (item: PropietarioModel) => item.pais,
    orden: 9,
  },
  {
    encabezado: 'Colonia',
    clave: (item: PropietarioModel) => item.colonia,
    orden: 10,
  },
  {
    encabezado: 'Municipio o alcaldía',
    clave: (item: PropietarioModel) => item.municipioOAlcaldia,
    orden: 11,
  },
  {
    encabezado: 'Localidad',
    clave: (item: PropietarioModel) => item.localidad,
    orden: 12,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (item: PropietarioModel) => item.entidadFederativa,
    orden: 13,
  },
  {
    encabezado: 'Estado/localidad',
    clave: (item: PropietarioModel) => item.estadoLocalidad,
    orden: 14,
  },
  {
    encabezado: 'Código postal',
    clave: (item: PropietarioModel) => item.codigoPostal,
    orden: 15,
  },
];
/**
 * Configuración de datos para la tabla de mercancías.
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
    clave: (ele: MercanciasInfo):string => ele.denominacionDistintiva,
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
    clave: (ele: MercanciasInfo): string => (ele.paisOrigenDatosClave ?? '').toString(),
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (ele: MercanciasInfo): string => (ele.paisProcedenciaDatosClave ?? '').toString(),
    orden: 17,
  },
  {
    encabezado: 'Tipo producto',
    clave: (ele: MercanciasInfo): string => ele.tipoProducto,
    orden: 18,
  },
  {
    encabezado: 'Uso específico',
    clave: (ele: MercanciasInfo): string => (ele.usoEspecificoDatosClave ?? '').toString(),
    orden: 19,
  },
 
];
export const MERCANCIAS_DATA1 = [
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
    clave: (ele: MercanciasInfo):string => ele.denominacionDistintiva,
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
    clave: (ele: MercanciasInfo): string => (ele.paisOrigenDatosClave ?? '').toString(),
    orden: 16,
  },
  {
    encabezado: 'País de procedencia',
    clave: (ele: MercanciasInfo): string => (ele.paisProcedenciaDatosClave ?? '').toString(),
    orden: 17,
  },
  {
    encabezado: 'Tipo producto',
    clave: (ele: MercanciasInfo): string => ele.tipoProducto,
    orden: 18,
  },
  {
    encabezado: 'Uso específico',
    clave: (ele: MercanciasInfo): string => (ele.usoEspecificoDatosClave ?? '').toString(),
    orden: 19,
  },
  {
    encabezado: 'Fech de caducidad',
    clave: (ele: MercanciasInfo): string => ele.fechaDeCaducidad ?? '',
    orden: 20,
  }
];
/**
 * Configuración para la fecha de pago.
 */
export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de caducidad',
  required: false,
  habilitado: false,
};

/**
 * Lista de países disponibles para la selección en el formulario.
 * Cada elemento de la lista representa el nombre oficial de un país o territorio.
 */
export const CROSLISTA_DE_PAISES: string[] = [
  "AFGANISTÁN (EMIRATO ISLÁMICO)",
  "ALBANIA (REPÚBLICA DE)",
  "ALEMANIA (REPÚBLICA FEDERAL DE)",
  "ANDORRA (PRINCIPADO DE)",
  "ANGOLA (REPÚBLICA DE)",
  "ANGUILLA",
  "ANTIGUA Y BARBUDA",
  "ARABIA SAUDITA (COMUNIDAD ECONÓMICA EUROPEA)",
  "ARGELIA (REPÚBLICA DEMOCRÁTICA Y POPULAR DE)",
  "ARGENTINA (REPÚBLICA)",
  "AUSTRALIA (COMMONWEALTH OF)",
  "AUSTRIA (REPUBLIC OF)",
  "BAHAMAS (COMMONWEALTH OF THE)",
  "BAHRAIN (KINGDOM OF)",
  "BANGLADESH (PEOPLE'S REPUBLIC OF)",
  "BARBADOS",
  "BELGIUM (KINGDOM OF)",
  "BELIZE",
  "BENIN (REPUBLIC OF)",
  "BHUTAN (KINGDOM OF)"
];
/**
 * Textos utilizados en la aplicación.
 */
export const TEXTOS = {
  ALERTA: `<p style="text-align: center;"><b>¡Precaución!</b> Debes capturar localidad y colonia </p>`,
  /**
   * Texto para la solicitud.
   */
  TEXTOS_SOLICITUD: '<p style="text-align: center;">Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud. </p>',

  /**
   * Texto para la leyenda de confirmación de la sección.
   */
  SECCION_LEYENDA_CONFIRMAR_TEXTOS: 'Debes declarar la cantidad que ingresa en parcialidad por cada fracción arancelaria. La columna "Saldo pendiente" mostrará el saldo disponible para las siguientes parcialidades.'
}
/**
 * Mensajes de validación para los campos del formulario.
 * Cada clave representa un campo específico y su valor es el mensaje de error correspondiente.
 * */
export const MENSAJE_DE_VALIDACI0N : { [key: string]: string } = {
  clasificacion: 'La clasificación del producto es obligatoria.',
  especificarClasificacionProducto: 'Este campo es obligatorio.',
  denominacionEspecifica: 'Este campo es obligatorio.',
  denominacionDistintiva: 'Este campo es obligatorio.',
  denominacionComun: 'Este campo es obligatorio.',
  tipoDeProducto: 'Este campo es obligatorio.',
  estadoFisico: 'Este campo es obligatorio.',
  estadoFormaFarmaceutica: 'Este campo es obligatorio..',
  fraccionArancelaria: 'Este campo es obligatorio.',
  descripcionFraccion: 'Este campo es obligatorio.',
  cantidadUMT: 'Este campo es obligatorio.',
  UMT: 'Este campo es obligatorio.',
  cantidadUMC: 'Este campo es obligatorio.',
  UMC: 'Este campo es obligatorio.',
  presentacion: 'Este campo es obligatorio.',
  numeroRegistro: 'El número de registro sanitario es obligatorio.',
};

export const PROCEDIMIENTOS_ESPECIALES=[260912, 260914,260902, 260917, 260903, 260918];

/**
 * Lista de procedimientos que permiten modificaciones específicas.
 */
export const PROCEDIMIENTOS_MODIFICACION = [260903];