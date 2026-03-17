import { Asociados, ColumnasTabla, Destinatario, Fabricante, ListaClave, Mercancia } from '../models/consulta.model';
import { CatalogosSelect, ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
 * Constante que contiene textos relacionados con el aviso de privacidad y alertas.
 */
export const AVISO_PRIVACIDAD = {
  /**
   * Texto que indica que las tablas con asterisco son obligatorias y deben contener al menos un registro.
   */
    TEXTOS_TERCEROS: 'Las tables con asterisco son obligatorias y debes agregar por lo menos un registro.',
    /**
   * Texto de alerta que indica el cumplimiento de requisitos y normatividad aplicable.
   * También menciona la aceptación de notificaciones a través de la Ventanilla Única de Comercio Exterior.
   */
    TEXTO_DE_ALERTA:'Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.'
  }

/**
 * Texto que indica cómo copiar datos en una solicitud.
 */
export const TEXTOS_SOLICITUD = `Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.`


/**
 * Encabezados de la tabla de solicitudes.  
 */
export const SOLICITUD_HEADER = {
  "encabezadoSolicitud": [
    "Fecha Creación",
    "Mercancía",
    "Cantidad",
    "Proveedor"
  ]
}

/**
 * Identificadores de los diferentes catálogos.
 */
export const CATALOGOS_ID = {
  CAT_ESTADO: 'estado',
  CAT_CLAVE_SCIAN: 'clave-scian',
  CAT_DESCRIPCION_SCIAN: 'descripcion-scian',
  CAT_REGIMENES: 'regimenes',
  CAT_ADUANAS: 'aduanas',
  CAT_PRODUCTO_CLASIFICACION: 'producto-clasificacion',
  CAT_ESPECIFICO_PRODUCTO_CLASIFICACION: 'especifico-producto-clasificacion',
  CAT_TIPO_PRODUCTO: 'tipo-producto',
  CAT_PAIS_DESTINO: 'pais-destino',
  CAT_PAIS: 'pais'
}

/**
 * Define los paneles colapsables para diferentes secciones en la interfaz de datos mercancía.
 */
export const PANELS = [
  { label: 'País de orígen', isCollapsed: true },
  { label: 'País de procedencia', isCollapsed: true }
];

/**
 * Opciones de botones de radio con etiquetas y valores correspondientes.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
    label: 'Sí',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  }
];

/**
 * Opciones para seleccionar la nacionalidad de terceros.
 */
export const TERCEROS_NACIONALIDAD_OPCIONES = [
  {
    label: 'Nacional',
    value: 'nacional',
  },
  {
    label: 'Extranjero',
    value: 'extranjero',
  }
]

/**
 * Opciones para seleccionar el tipo de persona.
 */
export const TIPO_PERSONA_OPCIONES = [
  {
    label: 'Física',
    value: 'fisica',
  },
  {
    label: 'Moral',
    value: 'moral',
  },
  {
    label: 'No contribuyente',
    value: 'noContribuyente',
  }
]

/**
 * Constante que define las categorías de terceros para clasificación por nacionalidad y tipo de persona.
 */
export const DATOS_CATEGORIAS_TERCEROS = {
  NACIONAL: 'nacional',
  EXTRANJERO: 'extranjero',
  FISICA: 'fisica',
  MORAL: 'moral',
  NO_CONTRIBUYENTE: 'noContribuyente',
}

/**
 * Mensaje de error mostrado cuando el RFC del representante legal no es ingresado.
 */
export const MSG_ERROR_REPRESENTANTE_LEGAL = 'Debe ingresar el RFC.';

/**
 * Texto de alerta para tablas obligatorias.
 */
export const TERCEROR_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';

/**
 * Configuración de botones para acciones relacionadas con las tablas.
 */
export const BOTONS = [
  {
    btnNombre: 'Agregar todos',
    class: 'btn-primary'
  },
  {
    btnNombre: 'Agregar selección',
    class: 'btn-default'
  },
  {
    btnNombre: 'Restar selección',
    class: 'btn-danger'
  },
  {
    btnNombre: 'Restar todos',
    class: 'btn-default'
  },

];
/**
 * Configuración de columnas para la tabla de fabricantes.
 */
export const FABRICANTE_CONFIGURACION_TABLA: ConfiguracionColumna<Fabricante>[] = [
  {
    encabezado: "Nombre/denominación o razón social",
    clave: (item: Fabricante) => item.nombre,
    orden: 1,
  },
  { encabezado: "R.F.C.", clave: (item: Fabricante) => item.rfc, orden: 2 },
  { encabezado: "CURP", clave: (item: Fabricante) => item.curp, orden: 3 },
  {
    encabezado: "Teléfono",
    clave: (item: Fabricante) => item.telefono,
    orden: 4,
  },
  {
    encabezado: "Correo electrónico",
    clave: (item: Fabricante) => item.correoElectronico,
    orden: 5,
  },
  { encabezado: "Calle", clave: (item: Fabricante) => item.calle, orden: 6 },
  {
    encabezado: "Número exterior",
    clave: (item: Fabricante) => item.numeroExterior,
    orden: 7,
  },
  {
    encabezado: "Número interior",
    clave: (item: Fabricante) => item.numeroInterior,
    orden: 8,
  },
  { encabezado: "País", clave: (item: Fabricante) => item.pais, orden: 9 },
  {
    encabezado: "Colonia",
    clave: (item: Fabricante) => item.colonia,
    orden: 10,
  },
  {
    encabezado: "Municipio o alcaldía",
    clave: (item: Fabricante) => item.municipio,
    orden: 11,
  },
  {
    encabezado: "Localidad",
    clave: (item: Fabricante) => item.localidad,
    orden: 12,
  },
  {
    encabezado: "Estado",
    clave: (item: Fabricante) => item.estado,
    orden: 13,
  },
  {
    encabezado: "Estado",
    clave: (item: Fabricante) => item.estado2,
    orden: 14,
  },
  {
    encabezado: "Código postal",
    clave: (item: Fabricante) => item.codigo,
    orden: 15,
  },
];
  
/**
 * Configuración de columnas para la tabla de destinatarios.
 */
export const DESTINATARIO_CONFIGURACION_TABLA: ConfiguracionColumna<Destinatario>[] = [
  {
    encabezado: "Nombre/denominación o razón social",
    clave: (item: Destinatario) => item.nombre,
    orden: 1,
  },
  { encabezado: "R.F.C.", clave: (item: Destinatario) => item.rfc, orden: 2 },
  { encabezado: "CURP", clave: (item: Destinatario) => item.curp, orden: 3 },
  {
    encabezado: "Teléfono",
    clave: (item: Destinatario) => item.telefono,
    orden: 4,
  },
  {
    encabezado: "Correo electrónico",
    clave: (item: Destinatario) => item.correoElectronico,
    orden: 5,
  },
  {
    encabezado: "Calle",
    clave: (item: Destinatario) => item.calle,
    orden: 6,
  },
  {
    encabezado: "Número exterior",
    clave: (item: Destinatario) => item.numeroExterior,
    orden: 7,
  },
  {
    encabezado: "Número interior",
    clave: (item: Destinatario) => item.numeroInterior,
    orden: 8,
  },
  { encabezado: "País", clave: (item: Destinatario) => item.pais, orden: 9 },
  {
    encabezado: "Colonia",
    clave: (item: Destinatario) => item.colonia,
    orden: 10,
  },
  {
    encabezado: "Municipio o alcaldía",
    clave: (item: Destinatario) => item.municipio,
    orden: 11,
  },
  {
    encabezado: "Localidad",
    clave: (item: Destinatario) => item.localidad,
    orden: 12,
  },
  {
    encabezado: "Estado",
    clave: (item: Destinatario) => item.estado,
    orden: 13,
  },
  {
    encabezado: "Estado",
    clave: (item: Destinatario) => item.estado2,
    orden: 14,
  },
  {
    encabezado: "Código postal",
    clave: (item: Destinatario) => item.codigo,
    orden: 15,
  },
];

/**
 * Opciones de radio internas del componente.
 */
export const RADIO_OPCIONS = [
  { label: 'Prórroga', value: 'prorroga' },
  { label: 'Modificación', value: 'modificacion' },
  { label: 'Modificación y prórroga', value: 'modificacionYProrroga' },
];

/**
 * Opciones de radio para hacerlos.
 */
export const OPCIONES_RADIO_HACERLOS = [
  { label: 'No', value: 'no' },
  { label: 'Sí', value: 'si' },
];

/**
 * Configuración del catálogo para el estado.
 */
export const ESTADO_CATALOGO: CatalogosSelect = {
  labelNombre: 'Estado',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/**
 * Configuración del catálogo para la clave.
 */
export const CATALOGO_CLAVE: CatalogosSelect = {
  labelNombre: 'Estado',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/**
 * Encabezados para la tabla de SCIAN.
 */
export const ENCABEZADOS_SCIAN: ConfiguracionColumna<ColumnasTabla>[] = [
  {
    encabezado: 'Clave S.C.I.A.N.',
    clave: (ele: ColumnasTabla) => ele.claveScian,
    orden: 1,
  },
  {
    encabezado: 'Descripción del S.C.I.A.N.',
    clave: (ele: ColumnasTabla) => ele.descripcionScian,
    orden: 2,
  },
];

/**
 * Encabezados para la tabla de mercancías.
 */
export const MERCANCIAS_DATOS: ConfiguracionColumna<Mercancia>[] = [
  {
    encabezado: 'Clasificación del producto',
    clave: (item: Mercancia) => item.clasificaionProductos,
    orden: 1,
  },
  {
    encabezado: 'Especificar Clasificación del producto',
    clave: (item: Mercancia) => item.especificarProducto,
    orden: 2,
  },
  {
    encabezado: 'Denominación específico del producto',
    clave: (item: Mercancia) => item.nombreProductoEspecifico,
    orden: 3,
  },
  {
    encabezado: 'Marca',
    clave: (item: Mercancia) => item.marca,
    orden: 4,
  },
  {
    encabezado: 'Fracción arancelaria',
    clave: (item: Mercancia) => item.fraccionArancelaria,
    orden: 5,
  },
  {
    encabezado: 'Descripción de la fracción arancelaria',
    clave: (item: Mercancia) => item.descripcionFraccionArancelaria,
    orden: 6,
  },
  {
    encabezado: 'Unidad de medida de comercialización (UMC)',
    clave: (item: Mercancia) => item.umc,
    orden: 7,
  },
  {
    encabezado: 'Cantidad UMC',
    clave: (item: Mercancia) => item.cantidadUMC,
    orden: 8,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (item: Mercancia) => item.umt,
    orden: 9,
  },
  {
    encabezado: 'Cantidad UMT',
    clave: (item: Mercancia) => item.cantidadUMT,
    orden: 10,
  },
  {
    encabezado: 'País de origen',
    clave: (item: Mercancia) => item.paisDeOrigen,
    orden: 11,
  },
  {
    encabezado: 'País de procedencia',
    clave: (item: Mercancia) => item.paisDeProcedencia,
    orden: 12,
  },
  {
    encabezado: 'Tipo de producto',
    clave: (item: Mercancia) => item.tipoProducto,
    orden: 13,
  },
  {
    encabezado: 'Uso específico',
    clave: (item: Mercancia) => item.usoEspecifico,
    orden: 14,
  },
];

/**
 * Encabezados para la tabla de clave.
 */
export const LISTA_CLAVE: ConfiguracionColumna<ListaClave>[] = [
  {
    encabezado: 'Clave de los lotes',
    clave: (ele: ListaClave) => ele.claveDeLosLotes,
    orden: 1,
  },
  {
    encabezado: 'Fecha de fabricación',
    clave: (ele: ListaClave) => ele.fechaDeFabricacion,
    orden: 2,
  },
  {
    encabezado: 'Fecha de caducidad',
    clave: (ele: ListaClave) => ele.fechaDeCaducidad,
    orden: 3,
  },
];

/**
 * Configuración de columnas para la tabla de trámites asociados.
 */
export const DESTINATARIO_TABLA: ConfiguracionColumna<Asociados>[] = [
  {
    encabezado: 'Folio trámite',
    clave: (item: Asociados) => item.folioTramite,
    orden: 1,
  },
  {
    encabezado: 'Tipo trámite',
    clave: (item: Asociados) => item.tipoTramite,
    orden: 2,
  },
  {
    encabezado: 'Estatus',
    clave: (item: Asociados) => item.estatus,
    orden: 3,
  },
  {
    encabezado: 'Fecha alta de registro',
    clave: (item: Asociados) => item.fechaRegistro,
    orden: 4,
  },
];