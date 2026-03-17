import {ProductoTable,ScianTable, SolicitudTable} from '../models/aviso-model';
/**
 * Contiene el aviso de privacidad simplificado con su correspondiente enlace al aviso integral.
 */
export const AVISO_PRIVACIDAD = {
  ADJUNTAR: `<h5>Aviso de privacidad simplificado</h5>
    <p style="text-align: justify">El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el Sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidad en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federaciónel 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><a href="">Aviso de privacidad integral</a>`
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
 * @const ALERTA_TEXTO
 * @description
 * Mensaje de alerta mostrado cuando no hay comunicación con el Sistema de COFEPRIS.
 * Indica al usuario que debe capturar su establecimiento manualmente.
 */
export const ALERTA_TEXTO = 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar suestablecimiento.';

/**
 * @const IDPROCEDIMIENTO
 * @description
 * Identificador numérico del procedimiento utilizado en el trámite 260601.
 * Se emplea para asociar lógica y configuración específica en los formularios y componentes relacionados.
 */
export const IDPROCEDIMIENTO = 260601;
/**
 *  @const PRODUCTO_TABLA_CONFIGURACION
 * @description
 * Configuración de la tabla de productos, incluyendo encabezados, claves y orden.
 * Cada objeto en el array representa una columna de la tabla.
 * @type {Array<{encabezado: string, clave: (ele: ProductoTable) => string | undefined, orden: number}>}
 * */
export const PRODUCTO_TABLA_CONFIGURACION =[{
  encabezado: 'Clasificación del producto',
  clave: (ele: ProductoTable): string | undefined => ele.clasificacionDelProducto,
  orden: 1
}, {
  encabezado: 'Tipo de producto',
  clave: (ele: ProductoTable): string | undefined => ele.tipoDeProducto,
  orden: 2
}, {
  encabezado: 'Fracción arancelaria',
  clave: (ele: ProductoTable): string | undefined => ele.fraccionArancelaria,
  orden: 3
}, {
  encabezado: 'Descripción de la fracción',
  clave: (ele: ProductoTable): string | undefined => ele.descripcionDeLaFraccion,
  orden: 4
}, {
  encabezado: 'Modelo',
  clave: (ele: ProductoTable): string | undefined => ele.modelo,
  orden: 5
}, {
  encabezado: 'Descripción del producto',
  clave: (ele: ProductoTable): string | undefined => ele.descripcionDelProducto,
  orden: 6
}, {
  encabezado: '	País de orígen',
  clave: (ele: ProductoTable): string | undefined => ele.paisDeOrigen,
  orden: 7
},
{
  encabezado: 'País de procedencia',
  clave: (ele: ProductoTable): string | undefined => ele.paisDeProcedencia,
  orden: 8
}, {
  encabezado: 'País de destino',
  clave: (ele: ProductoTable): string | undefined => ele.paisDeDestino,
  orden: 9
},
{
  encabezado: 'Uso específico',
  clave: (ele: ProductoTable): string | undefined => ele.usoEspecifico,
  orden: 10
}
]

export const SCIAN_TABLA_CONFIGURACION = [{
  encabezado: 'Clave S.C.I.A.N.',
  clave: (ele: ScianTable): string | undefined => ele.claveScian,
  orden: 1
}, {
  encabezado: 'Descripción S.C.I.A.N.',
  clave: (ele: ScianTable): string | undefined => ele.descripcionScian,
  orden: 2
}]; 

/**
 * @const SOLICITUD_TABLA_CONFIGURACION
 * @description
 * Configuración de columnas para la tabla de solicitudes.
 * Define la estructura y comportamiento de cada columna en la tabla dinámica.
 * @type {Array<{encabezado: string, clave: (ele: SolicitudTable) => string | undefined, orden: number}>}
 */
export const SOLICITUD_TABLA_CONFIGURACION = [{
  encabezado: 'Fecha Creación',
  clave: (ele: SolicitudTable): string | undefined => ele.fechaCreacion,
  orden: 1
}, {
  encabezado: 'Mercancía',
  clave: (ele: SolicitudTable): string | undefined => ele.mercancia,
  orden: 2
}, {
  encabezado: 'Cantidad',
  clave: (ele: SolicitudTable): string | undefined => ele.cantidad,
  orden: 3
}, {
  encabezado: 'Proveedor',
  clave: (ele: SolicitudTable): string | undefined => ele.proveedor,
  orden: 4
}]; 

/**
 * @constant ERROR_FORMA_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <b>¡Error de registro! Faltan campos por capturar.</b>
    </div>
  </div>
</div>
`

export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<p>La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado al momento en que ésta sea firmada.</p>`;