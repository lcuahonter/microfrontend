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

export const EXPEDICION_FACTURA_FECHA = {
  labelNombre: 'Fecha de expedición de la factura:',
  required: true,
  habilitado: true,
};

export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de pago:',
  required: true,
  habilitado: true,
};

export const TITULOMENSAJE =
  'Registro de solicitud de modificación programa IMMEX (Modificación Alta a domicilio de una planta, bodega o almacén)';
export const TEXTOS_REQUISITOS =
  'La solicitud ha quedado registrada con el número temporal [202767640]. Este no tiene validez legal y sirve solamente para efectos de identificar tu Solicitud. Un folio oficial le será asignado a la solicitud al momento en que esta sea firmada.';

export const INSTRUCCION_DOBLE_CLIC =
  'Al dar clic en el botón "Cargar" se creará una nueva solicitud con los mismos datos de la solcitud 202766288 ';

export const INSTRUCCION_OBLIGATORIA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

export const TEXTOS_220703 = {
  TEXTOS_SOLICITUD:
    'Al dar doble clic en el registro seleccionado creará una Nueva solicitud con los mismos datos de la solicitud elegida.',

  SECCION_LEYENDA_CONFIRMAR_TEXTOS:
    'Debes declarar la cantidad que ingresa en parcialidad por cada fracción arancelaria. La columna "Saldo pendiente" mostrará el saldo disponible para las siguientes parcialidades.',
};

export const MERCANCIA_SERVICIO = [
  {
    encabezado: 'No. pardita',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna1,
    orden: 1,
  },
  {
    encabezado: 'Tipo de requisito',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna2,
    orden: 2,
  },
  {
    encabezado: 'Requisito',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna3,
    orden: 3,
  },
  {
    encabezado: 'Número Certificado Internacional',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna4,
    orden: 4,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna5,
    orden: 5,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna6,
    orden: 6,
  },
  {
    encabezado: 'Nico',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna7,
    orden: 7,
  },
  {
    encabezado: 'Descripción Nico',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna8,
    orden: 8,
  },
  {
    encabezado: 'Descripción',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna8,
    orden: 8,
  },
  {
    encabezado: 'Unidad de medida tarifa (UMT)',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna9,
    orden: 9,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna10,
    orden: 10,
  },
  {
    encabezado: 'Unidad de medida de comercializacion (UMC)',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna11,
    orden: 11,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna12,
    orden: 12,
  },
  {
    encabezado: 'Uso',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna13,
    orden: 13,
  },
  {
    encabezado: 'Especie',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna14,
    orden: 14,
  },
  {
    encabezado: 'Países de origen',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna15,
    orden: 15,
  },
  {
    encabezado: 'Países de procedencia',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna16,
    orden: 16,
  },  

  {
    encabezado: 'Número de lote',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna17,
    orden: 17,
  },

  {
    encabezado: 'Fase de desarrollo',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna18,
    orden: 18,
  },
  {
    encabezado: 'Certificado Internacional Electrónico',
    clave: (ele: MercanciaInfo): string => ele.tablaColumna19,
    orden: 19,
  },
];

export interface MercanciaInfo {
  tablaColumna1: string;
  tablaColumna2: string;
  tablaColumna3: string;
  tablaColumna4: string;
  tablaColumna5: string;
  tablaColumna6: string;
  tablaColumna7: string;
  tablaColumna8: string;
  tablaColumna9: string;
  tablaColumna10: string;
  tablaColumna11: string;
  tablaColumna12: string;
  tablaColumna13: string;
  tablaColumna14: string;
  tablaColumna15: string;
  tablaColumna16: string;
  tablaColumna17: string;
  tablaColumna18: string;
  tablaColumna19: string;
  estatus: boolean;
}

export const EXPORTADOR_SERVICIO = [
  {
    encabezado: 'Nombre/ denominación o razón social',
    clave: (ele: ExportadorInfo): string => ele.tablaColumna1,
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: ExportadorInfo): string => ele.tablaColumna2,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (ele: ExportadorInfo): string => ele.tablaColumna3,
    orden: 3,
  },
  {
    encabezado: 'Domicilio',
    clave: (ele: ExportadorInfo): string => ele.tablaColumna4,
    orden: 4,
  },
  {
    encabezado: 'País',
    clave: (ele: ExportadorInfo): string => ele.tablaColumna5,
    orden: 5,
  },
];
export interface ExportadorInfo {
  tablaColumna1: string;
  tablaColumna2: string;
  tablaColumna3: string;
  tablaColumna4: string;
  tablaColumna5: string;
  estatus: boolean;
}

export const DESTINO_SERVICIO = [
  {
    encabezado: 'Nombre/ denominación o razón social',
    clave: (ele: DestinoInfo): string => ele.tablaColumna1,
    orden: 1,
  },
  {
    encabezado: 'Teléfono',
    clave: (ele: DestinoInfo): string => ele.tablaColumna2,
    orden: 2,
  },
  {
    encabezado: 'Correo electrónico',
    clave: (ele: DestinoInfo): string => ele.tablaColumna3,
    orden: 3,
  },
  {
    encabezado: 'Calle',
    clave: (ele: DestinoInfo): string => ele.tablaColumna4,
    orden: 4,
  },
  {
    encabezado: 'Número extrior',
    clave: (ele: DestinoInfo): string => ele.tablaColumna5,
    orden: 5,
  },
  {
    encabezado: 'Número interior',
    clave: (ele: DestinoInfo): string => ele.tablaColumna6,
    orden: 6,
  },
  {
    encabezado: 'País',
    clave: (ele: DestinoInfo): string => ele.tablaColumna7,
    orden: 7,
  },
  {
    encabezado: 'Colonia',
    clave: (ele: DestinoInfo): string => ele.tablaColumna8,
    orden: 8,
  },
  {
    encabezado: 'Mucinipio o alcaldía',
    clave: (ele: DestinoInfo): string => ele.tablaColumna9,
    orden: 9,
  },
  {
    encabezado: 'Entidad federativa',
    clave: (ele: DestinoInfo): string => ele.tablaColumna10,
    orden: 10,
  },
  {
    encabezado: 'Código postal',
    clave: (ele: DestinoInfo): string => ele.tablaColumna11,
    orden: 11,
  },
];

export interface DestinoInfo {
  tablaColumna1: string;
  tablaColumna2: string;
  tablaColumna3: string;
  tablaColumna4: string;
  tablaColumna5: string;
  tablaColumna6: string;
  tablaColumna7: string;
  tablaColumna8: string;
  tablaColumna9: string;
  tablaColumna10: string;
  tablaColumna11: string;
  estatus: boolean;
}

export const MEDIO_SERVICIO = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: MercanciaDatosInfo): string => ele.tablaColumna1,
    orden: 1,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (ele: MercanciaDatosInfo): string => ele.tablaColumna2,
    orden: 2,
  },
  {
    encabezado: 'Nico',
    clave: (ele: MercanciaDatosInfo): string => ele.tablaColumna3,
    orden: 3,
  },
  {
    encabezado: 'Descripción Nico',
    clave: (ele: MercanciaDatosInfo): string => ele.tablaColumna4,
    orden: 4,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (ele: MercanciaDatosInfo): string => ele.tablaColumna5,
    orden: 5,
  },
  {
    encabezado: 'Cantidad total UMT',
    clave: (ele: MercanciaDatosInfo): string => ele.tablaColumna6,
    orden: 6,
  },
];
  export interface MercanciaDatosInfo {
  tablaColumna1: string;
  tablaColumna2: string;
  tablaColumna3: string;
  tablaColumna4: string;
  tablaColumna5: string;
  tablaColumna6: string;
  estatus: boolean;
}

export const SECCIONES_TRAMITE_220703 = {
  PASO_1: {
    VALIDACION_SECCION_1: false,
    VALIDACION_SECCION_2: true,
    VALIDACION_SECCION_3: false,
  },
  PASO_2: {
    VALIDACION_SECCION: true,
  },
  PASO_3: {
    requiereValidacion: true,
  },
};
