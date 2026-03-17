import { Row, Rows } from '../models/pago-de-derechos.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { MercanciaTabla } from '../models/medio-transporte.model';
import { MercanciasLista } from '../models/datos-generales.model';

/**
 * Constantes para el catálogo de tipos de solicitud
 */
export const CATALOGOS_ID = {
  /**
   * Catálogo de tipos de solicitud.
   */
  CAT_TIPO_SOL: 'tipos-solicitud',

  /**
   * Catálogo de países.
   */
  CAT_PAISES: 'paises',

  /**
   * Catálogo de aduanas.
   */
  CAT_ADUANAS: 'aduanas',

  /**
   * Identificador del catálogo de secciones de aduanas.
   */
  CAT_SECCION_ADUANAS: 25,

  /**
   * Identificador para los datos generales de la solicitud.
   */
  DATOS_GNRLS_SOL: 5,

  /**
   * Catálogo de tipos de documento.
   */
  CAT_TIPO_DOCUMENTO: 'tipos-documento',

  /**
   * Identificador del catálogo de tipos de operación.
   */
  CAT_TIPO_OPERACION: 26,

  /**
   * Catálogo de medios de transporte.
   */
  CAT_MEDIO_DE_TRANSPORTE: 'medio-de-transporte',

  /**
   * Catálogo de regímenes de mercancía.
   */
  CAT_REGIMEN_MERCANCIA: 'regimen-mercancia',

  /**
   * Catálogo de clasificación de régimen.
   */
  CAT_CLASIFI_REGIMEN: 'clasifi-regimen',

  /**
   * Catálogo de fracciones arancelarias.
   */
  CAT_FRACCION_ARANCELARIA: 'fraccion-arancelaria',

  /**
   * Catálogo de NICO (Número de Identificación Comercial).
   */
  CAT_NICO: 'nico',

  /**
   * Catálogo de unidades de medida tarifaria.
   */
  CAT_UNIDAD_MEDIDA_TARIFARIA: 'unidad-medida-tarifaria',

  /**
   * Catálogo de países de origen.
   */
  CAT_PAIS_ORIGEN: 'pais-origen',

  /**
   * Catálogo de países de destino.
   */
  CAT_PAIS_DESTINO: 'pais-destino',

  /**
   * Catálogo de molinos.
   */
  CAT_MOLINO: 'molino',

  /**
   * Catálogo de estados.
   */
  CAT_ESTADO: 'estado',

  /**
   * Catálogo de representaciones federales.
   */
  CAT_REPRESENTACION_FEDERAL: 'representacion-federal',

  /**
   * Identificador para los datos de persona física.
   */
  DATOS_PERSONA_FISICA: 21,
};

/**
 * Lista de elementos de tipo Row.
 */
export const ITEMS: Row[] = [
  {
    nombre: 'Miriam Lopez Solis',
    telefono: '52-2298456543',
    correo: 'miriam@gmail.com',
    domicilio: 'este es un domicilio address',
    pais: 'ANGOLA(REPUBLIC DE)',
  },
];

/**
 * Lista de elementos de tipo Rows.
 */
export const PERSONA: Rows[] = [
  {
    nombre: 'Miriam Lopez Solis',
    telefono: '52-2298456543',
    correo: 'miriam@gmail.com',
    calle: '#10',
    exterior: 856,
    interior: 1,
    pais: 'MEXICO(ESTAD UNIDOS MEXICANOS',
  },
];

/**
 * Texto de alerta utilizado en el componente de terceros relacionados.
 * @constant {string}
 */
export const TERCEROS_TEXTO_DE_ALERTA =
  'Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.';
/**
 * Filas de datos predefinidas.
 */
export const MERCANCIAS_LISTA: MercanciasLista[] = [
  {
    partida: '1',
    tiporequisito: 'Inspección ocular',
    requisito: 'Requisito',
    certificado: 123456,
    fraccion: '01039201',
    fracciondescripcion: 'Con pedigree o certificado de alto registro.',
    nicod: '00',
    nicodescripcion: 'Descripción del NICO',
    descripcion: 'Descripción de la mercancía',
    umt: 'Kilogramo',
    cantidadumt: 100,
    umc: 'Unidad de medida comercialización',
    cantidadumc: 50,
    tipodeproducto: 'Especie de la mercancía',
    uso: 'Uso de la mercancía',
    paisorigen: 'País de origen',
    paisprocedencia: 'País de procedencia',
    certificadoInternacionalElectronico:
      'Certificado Internacional Electrónico',
  },
];

/**
 * Constante que define el parámetro utilizado para determinar el tipo de datos a mostrar.
 */
export const PARAMETERO = {
  /**
   * Acción que permite al funcionario evaluar el procedimiento.
   */
  EVALUAR: 'FLUJO_FUNCIONARIO_EVALUAR',

  /**
   * Acción que permite consultar la información de un procedimiento.
   */
  READ_PROCEDEMENTO: 'READ_PROCEDURE',

  /**
   * Acción relacionada con los trámites subsecuentes.
   */
  SUBSECUENTES: 'SUBSECUENTES',
};

/**
 * Configuración de campos y catálogos utilizados en el formulario de ingreso y control de mercancías.
 * Cada constante define las propiedades visuales y funcionales de un campo del formulario.
 *
 * @property {string} labelNombre - Texto que se muestra como etiqueta del campo.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de elementos para llenar el selector correspondiente.
 */
export const ADUANA_INGRESO = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Aduana de ingreso',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Oficina de Inspección de Sanidad Agropecuaria".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const OFICIANA_INSPECCION = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Oficina de Inspección de Sanidad Agropecuaria',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Punto de inspección".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const PUNTO_INSPECCION = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Punto de inspección',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Establecimiento TIF".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const ESTABLECIMIENTO = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Establecimiento TIF',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Régimen al que se destinará la mercancía".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const REGIMEN_DESTINARAN = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Régimen al que se destinará la mercancía',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Datos para movilización nacional".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const MOVILIZACION_NACIONAL = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Datos para movilización nacional',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Punto de verificación federal".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const PUNTO_VERIFICACION = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Punto de verificación federal',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Nombre de la empresa transportista".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const EMPRESA_TRANSPORTISTA = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Nombre de la empresa transportista',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración de las columnas que se mostrarán en la tabla de mercancías.
 * Cada objeto define el encabezado, la clave a mostrar y el orden de la columna.
 */
export const CONFIGURACION_MERCANCIAS_COLUMNAS: ConfiguracionColumna<MercanciasLista>[] =
  [
    {
      encabezado: 'No. partida',
      clave: (item: MercanciasLista) => item.partida,
      orden: 1,
    },
    {
      encabezado: 'Tipo de requisito',
      clave: (item: MercanciasLista) => item.tiporequisito,
      orden: 2,
    },
    {
      encabezado: 'Requisito',
      clave: (item: MercanciasLista) => item.requisito,
      orden: 3,
    },
    {
      encabezado: 'Número de certificado internacional',
      clave: (item: MercanciasLista) => item.certificado,
      orden: 4,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: MercanciasLista) => item.fraccion,
      orden: 5,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (item: MercanciasLista) => item.fracciondescripcion,
      orden: 6,
    },
    {
      encabezado: 'Nico',
      clave: (item: MercanciasLista) => item.nicod,
      orden: 7,
    },
    {
      encabezado: 'Descripción Nico',
      clave: (item: MercanciasLista) => item.nicodescripcion,
      orden: 8,
    },
    {
      encabezado: 'Descripción',
      clave: (item: MercanciasLista) => item.descripcion,
      orden: 9,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (item: MercanciasLista) => item.umt,
      orden: 10,
    },
    {
      encabezado: 'Cantidad UMT',
      clave: (item: MercanciasLista) => item.cantidadumt,
      orden: 11,
    },
    {
      encabezado: 'Unidad de medida de comercializacion (UMC)',
      clave: (item: MercanciasLista) => item.umc,
      orden: 12,
    },
    {
      encabezado: 'Cantidad UMC',
      clave: (item: MercanciasLista) => item.cantidadumc,
      orden: 13,
    },
    {
      encabezado: 'Uso',
      clave: (item: MercanciasLista) => item.uso,
      orden: 14,
    },
    {
      encabezado: 'Tipo de producto',
      clave: (item: MercanciasLista) => item.tipodeproducto,
      orden: 15,
    },
    {
      encabezado: 'País de orígen',
      clave: (item: MercanciasLista) => item.paisorigen,
      orden: 16,
    },
    {
      encabezado: 'Pais de procedencia',
      clave: (item: MercanciasLista) => item.paisprocedencia,
      orden: 17,
    },
    {
      encabezado: 'Certificado Internacional Electrónico',
      clave: (item: MercanciasLista) =>
        item.certificadoInternacionalElectronico,
      orden: 18,
    },
  ];

/**
 * Configuración para el campo "Certificados autorizados pendientes".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const CERTIFICADOS_AUTORIZADOS = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Certificados autorizados pendientes',

  /**
   * Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Hora de inspección".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const HORA_DE_INSPECCION = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Hora de inspección',

  /**
   * Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Aduana de ingreso".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const ADUANA_DE_INGRESO = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Aduana de ingreso',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Oficina de inspección de Sanidad Agropecuaria".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const SANIDAD_AGROPECUARIA = {
  /**
   * Etiqueta que se mostrará en el formulario.
   */
  labelNombre: 'Oficina de inspección de Sanidad Agropecuaria',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Punto de inspección".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const PUNTO_DE_INSPECCION = {
  /**
   * Etiqueta mostrada en el formulario.
   */
  labelNombre: 'Punto de inspección',

  /**
   * Indica si el campo es obligatorio.
   */
  required: true,

  /**
   * Texto que se mostrará como primera opción en el menú desplegable.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * Configuración para el campo "Tipo contenedor".
 *
 * @property {string} labelNombre - Etiqueta que se muestra en el formulario.
 * @property {boolean} required - Indica si el campo es obligatorio.
 * @property {string} primerOpcion - Texto que se muestra como primera opción en un selector.
 * @property {any[]} catalogos - Lista de opciones disponibles para seleccionar.
 */
export const TIPO_CONTENEDOR = {
  /**
   * Etiqueta mostrada en el formulario.
   */
  labelNombre: 'Tipo contenedor',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Texto que se mostrará como primera opción en el select.
   */
  primerOpcion: 'Selecciona una opción',

  /**
   * Lista de catálogos disponibles para el campo.
   */
  catalogos: [],
};

/**
 * @constant PROCEDURE_ID
 * @description
 * Identificador único del procedimiento relacionado con el trámite 220502.
 * Se utiliza en el componente/servicio para asociar operaciones y
 * configuraciones a este trámite específico.
 *
 * @type {number}
 */
export const PROCEDURE_ID = 220502;

/**
 * @description
 * Mensaje que indica al usuario la obligación de declarar la cantidad
 * que ingresa en cada parcialidad por fracción arancelaria.
 *
 * También informa que la columna **"Saldo pendiente"** mostrará el saldo
 * disponible para las siguientes parcialidades.
 *
 * Se utiliza como texto de notificación o ayuda contextual en la interfaz.
 */
export const SALDO_PENDIENTE_NOTIFICACION =
  'Debes declarar la cantidad que ingresa en esta parcialidad por cada fracción arancelaria. La columna "Saldo pendiente" mostrará el saldo disponible para las siguientes parcialidades.';

/**
 * @description
 * Configuración de las columnas de la tabla de mercancías.
 *
 * Cada objeto dentro del arreglo define:
 * - **encabezado**: Texto que se mostrará en la cabecera de la tabla.
 * - **clave**: Función que extrae el valor correspondiente del objeto `MercanciaTabla`.
 * - **orden**: Posición de la columna en la tabla.
 *
 * Se utiliza para construir dinámicamente la tabla de mercancías en la vista.
 */
export const MERCANICA_CONFIGURACION: ConfiguracionColumna<MercanciaTabla>[] = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (item: MercanciaTabla) => item.fraccionArancelaria,
    orden: 1,
  },
  {
    encabezado: 'Descripción de la fracción',
    clave: (item: MercanciaTabla) => item.descripcionFraccion,
    orden: 2,
  },
  {
    encabezado: 'Nico',
    clave: (item: MercanciaTabla) => item.nico,
    orden: 3,
  },
  {
    encabezado: 'Descripción Nico',
    clave: (item: MercanciaTabla) => item.descripcion,
    orden: 4,
  },
  {
    encabezado: 'Unidad de medida de tarifa (UMT)',
    clave: (item: MercanciaTabla) => item.unidaddeMedidaDeUMT,
    orden: 5,
  },
  {
    encabezado: 'Cantidad total UMT',
    clave: (item: MercanciaTabla) => item.cantidadTotalUMT,
    orden: 6,
  },
  {
    encabezado: 'Saldo pendiente',
    clave: (item: MercanciaTabla) => item.saldoPendiente,
    orden: 6,
  },
];
