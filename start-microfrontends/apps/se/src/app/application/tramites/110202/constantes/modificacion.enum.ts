import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { Mercancia } from '../../../shared/models/modificacion.enum';
import {
  Mercancias,
} from '../models/configuracion-columna.model';

/**
 * Arreglo constante que define los pasos del proceso para la gestión de permisos.
 * Cada objeto representa un paso específico con su índice, título, y los estados de activo y completado.
 *
 * @property {number} indice - El número de orden del paso dentro del proceso.
 * @property {string} titulo - El nombre descriptivo del paso.
 * @property {boolean} activo - Indica si el paso está actualmente activo para el usuario.
 * @property {boolean} completado - Indica si el paso ya ha sido completado.
 *
 * Ejemplo de uso:
 * - Para mostrar el flujo de pasos en un formulario de solicitud.
 * - Para controlar la navegación entre pasos según el estado de cada uno.
 */
export const PASOS = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: true,
    },
    {
        indice: 2,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
    }
];

/**
 * @enum {TablaSeleccion}
 * @description
 * Enumeración que define los tipos de selección posibles en una tabla. Se utiliza para decidir cómo los usuarios seleccionan filas (checkbox, radio, ninguno).
 *
 * @property {string} CHECKBOX - Representa la selección múltiple con casillas de verificación.
 * @property {string} RADIO - Representa la selección única usando botones de opción.
 * @property {string} UNDEFINED - Indica que no se ha definido ningún tipo de selección.
 *
 * @example
 * if (tipoSeleccion === TablaSeleccion.CHECKBOX) { ... }
 */
export enum TablaSeleccion {
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO',
  UNDEFINED = 'undefined',
}



/**
 * Arreglo de configuración para la visualización de columnas relacionadas con objetos de tipo `Mercancia` en una tabla.
 *
 * Cada objeto dentro del arreglo representa una columna y contiene:
 * - `encabezado`: El título visible de la columna.
 * - `clave`: Función que recibe un objeto `Mercancia` y retorna el valor a mostrar en la columna.
 * - `orden`: La posición de la columna en la tabla.
 *
 * Las columnas configuradas incluyen:
 * - Fracción arancelaria
 * - Nombre técnico
 * - Nombre comercial
 * - Número de registro de productos
 * - Fecha expedición
 * - Fecha vencimiento
 */
export const CONFIGURACION_MERCANCIA = [
  {
    /** Título visible: Fracción arancelaria */
    encabezado: 'Fracción arancelaria',
    /** Función que retorna la fracción arancelaria del objeto `Mercancia` */
    clave: (ele: Mercancia): string | undefined => ele.fraccionArancelaria,
    /** Posición de esta columna en la tabla */
    orden: 1,
  },
  {
    /** Título visible: Nombre técnico */
    encabezado: 'Nombre técnico',
    clave: (ele: Mercancia): string | undefined => ele.nombreTecnico,
    orden: 2,
  },
  {
    /** Título visible: Nombre comercial */
    encabezado: 'Nombre comercial',
    clave: (ele: Mercancia): string | undefined => ele.nombreComercial,
    orden: 3,
  },
  {
    /** Título visible: Número de registro de productos */
    encabezado: 'Número de registro de productos',
    clave: (ele: Mercancia): string | undefined => ele.numeroDeRegistrodeProductos,
    orden: 4,
  },
  {
    /** Título visible: Fecha expedición */
    encabezado: 'Fecha expedición',
    clave: (ele: Mercancia): string | undefined => ele.fechaExpedicion,
    orden: 5,
  },
  {
    /** Título visible: Fecha vencimiento */
    encabezado: 'Fecha vencimiento',
    clave: (ele: Mercancia): string | undefined => ele.fechaVencimiento,
    orden: 6,
  }
];

 /**
 * Configuración de las columnas para la tabla de mercancías.
 * Define el encabezado, la clave a mostrar por fila y el orden.
 * Utiliza funciones para mapear datos del modelo Mercancias.
 */
export const CONFIGURATION_TABLA_MERCANCIAS = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (item: Mercancias): string => item.fraccionArancelaria,
    orden: 1
  },
  {
    encabezado: 'Cantidad',
    clave: (item: Mercancias): string => item.cantidad,
    orden: 2
  },
    {
    encabezado: 'Unidad de medida',
    clave: (item: Mercancias): string => item.unidadDeMedida,
    orden: 3
  },
  {
    encabezado: 'Valor mercancía',
    clave: (item: Mercancias): string => item.valorMercancia,
    orden: 4
  },
  {
    encabezado: 'Tipo de factura',
    clave: (item: Mercancias): string => item.tipoDeFactura,
    orden: 5
  }
];

/**
 * Datos de ejemplo utilizados para poblar la tabla de mercancías.
 * Representa una lista de objetos del modelo Mercancias.
 * Se utiliza como valor inicial o para pruebas locales.
 */
export const MERCANCIAS_DATOS: Mercancias[] = [
  {
    unidadDeMedida: 'Kilogramos',
    cantidad: '100',
    fraccionArancelaria: '15800202',
    valorMercancia: '50000',
    tipoDeFactura: 'Comercial'
  },]

   /**
 * Mensaje informativo sobre las tablas obligatorias.
 */
export const CAPTURA_MERCANCIAS = `
  <p style="text-align: center;">
    Para continuar con el trámite, debes agregar por lo menos una mercancía.
  </p>
`;
/**
 * Configuración del campo de fecha final en el formulario.
 * Define la etiqueta, si es requerido y si está habilitado.
 * Se utiliza para parametrizar la vista del componente.
 */
export const FECHA_FINALS = {
  labelNombre: 'Fecha fin',
  required: true,
  habilitado: true,
};
/**
 * Lista de catálogos de bancos disponibles.
 * Cada banco tiene un identificador único (id) y una descripción.
 * Esta lista se utiliza para poblar selectores de bancos en formularios.
 */
export const CATALOGOS_DATOS = [
        {
            "id": 1,
            "descripcion": "Banco Central"
        },
        {
            "id": 2,
            "descripcion": "Banco del Pueblo"
        }

    ];
    /**
 * MERCANCIA_PREFILL contiene datos de ejemplo para pruebas.
 * Incluye fracción arancelaria, registro, fechas y nombres técnicos/comerciales.
 * Sirve como plantilla para inicializar formularios o pruebas unitarias.
 */
export const MERCANCIA_PREFILL: Mercancia[] = [
  {
    fraccionArancelaria: '1234.56.78',
    numeroDeRegistrodeProductos: 'REG-001',
    fechaExpedicion: '2024-01-01',
    fechaVencimiento: '2025-01-01',
    nombreTecnico: 'Producto Técnico',
    nombreComercial: 'Producto Comercial',
    fraccionNaladi: 'NAL001',
    fraccionNaladiSa93: 'NAL93',
    fraccionNaladiSa96: 'NAL96',
    fraccionNaladiSa02: 'NAL02',
  }
];

/**
 * @interface SeleccionadasTabla
 * Interfaz que define las columnas de la tabla de mercancías seleccionadas
 */
export interface SeleccionadasTabla {
  /** Identificador único de la mercancía seleccionada */
  id?: number;
  /** Fracción arancelaria de la mercancía seleccionada */
  fraccionArancelaria: string;
  /** Cantidad de la mercancía */
  cantidad: string;
  /** Unidad de medida de la mercancía */
  unidadMedida: string;
  /** Valor monetario de la mercancía */
  valorMercancia: string;
  /** Tipo de factura utilizada */
  tipoFactura: string;
  /** Número de la factura */
  numFactura: string;
  /** Descripción complementaria de la mercancía */
  complementoDescripcion: string;
  /** Fecha de emisión de la factura */
  fechaFactura: string;
}

/**
 * Encabezados de la tabla de mercancías seleccionadas.
 * 
 * Define la configuración de las columnas que se mostrarán en la tabla de mercancías seleccionadas,
 * incluyendo el nombre del encabezado, la clave para obtener el valor de cada columna y el orden de aparición.
 */
export const HEADERS_DATA: ConfiguracionColumna<SeleccionadasTabla>[] = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: SeleccionadasTabla) => ele.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Cantidad',
      clave: (ele: SeleccionadasTabla) => ele.cantidad,
      orden: 2,
    },
    {
      encabezado: 'Unidad de medida',
      clave: (ele: SeleccionadasTabla) => ele.unidadMedida,
      orden: 3,
    },
    {
      encabezado: 'Valor mercancía',
      clave: (ele: SeleccionadasTabla) => ele.valorMercancia,
      orden: 4,
    },
    {
      encabezado: 'Tipo de factura',
      clave: (ele: SeleccionadasTabla) => ele.tipoFactura,
      orden: 5,
    },
    {
      encabezado: 'Número factura',
      clave: (ele: SeleccionadasTabla) => ele.numFactura,
      orden: 6,
    },
    {
      encabezado: 'Complemento descripción',
      clave: (ele: SeleccionadasTabla) => ele.complementoDescripcion,
      orden: 7,
    },
    {
      encabezado: 'Fecha factura',
      clave: (ele: SeleccionadasTabla) => ele.fechaFactura,
      orden: 8,
    },
];

/**
 * Mapeo de los encabezados de la tabla a las claves de los datos.
 * 
 * Permite relacionar el nombre del encabezado mostrado en la tabla con la propiedad correspondiente
 * en el modelo de datos SeleccionadasTabla.
 */
export const HEADER_MAP_DATOS: { [key: string]: string } = {
    'Fracción arancelaria': 'fraccionArancelaria',
    'Cantidad': 'cantidad',
    'Unidad de medida': 'unidadMedida',
    'Valor mercancía': 'valorMercancia',
    'Tipo de factura': 'tipoFactura',
    'Número factura': 'numFactura',
    'Complemento descripción': 'complementoDescripcion',
    'Fecha factura': 'fechaFactura',
};

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
      <strong>¡Error de registro!</strong>Faltan campos por capturar.
    </div>
  </div>
</div>
`
/**
 * @interface ColumnasTabla
 * Interfaz que define las columnas de la tabla de mercancías disponibles
 */
export interface ColumnasTabla {
  id?:string;
  /** Fracción arancelaria de la mercancía */
  fraccionArancelaria: string;
  /** Nombre técnico del producto */
  nombreTecnico: string;
  /** Nombre comercial del producto */
  nombreComercial: string;
  /** Fecha de expedición del certificado */
  fechaExpedicion: string;
  /** Fecha de vencimiento del certificado */
  fechaVencimiento: string;
  /** Criterio de origen del producto */
  criterioOrigen?: string;
  /** Número de registro de productos */
  numeroRegistroProducto?: string;
}

import { CatalogosSelect } from "@libs/shared/data-access-user/src";



/** Configuración para el campo de fecha inicial del periodo */
export const FECHAINICIAL = {
  labelNombre: 'Fecha inicio',
  required: false,
  habilitado: true,
};

/** Configuración para el campo de fecha final del periodo */
export const FECHAFINAL = {
  labelNombre: 'Fecha fin',
  required: false,
  habilitado: true,
};

/** Configuración para el campo de fecha de la factura */
export const FECHAFACTURA = {
  labelNombre: 'Fecha fin',
  required: true,
  habilitado: true,
};

/** Opciones del catálogo de tratados comerciales */
export const OPTIONS_TRATADO: CatalogosSelect = {
  labelNombre: 'Tratado/Acuerdo',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de países o bloques comerciales */
export const OPTIONS_PAIS: CatalogosSelect = {
  labelNombre: 'País / Bloque',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de unidades de medida comercial (UMC) */
export const OPTIONS_UMC: CatalogosSelect = {
  labelNombre: 'UMC',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de unidades de medida para masa bruta */
export const OPTIONS_UNIDAD_MEDIDA: CatalogosSelect = {
  labelNombre: 'Unidad de medida de la masa bruta',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de tipos de factura */
export const OPTIONS_TIPO_FACTURA: CatalogosSelect = {
  labelNombre: 'Tipo de factura',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de idiomas disponibles */
export const OPTIONS_IDIOMA: CatalogosSelect = {
  labelNombre: 'Idioma',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de entidades federativas */
export const OPTIONS_ENTIDAD_FEDERATIVA: CatalogosSelect = {
  labelNombre: 'Entidad federativa',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de representaciones federales */
export const OPTIONS_REPRESENTACION_FEDERAL: CatalogosSelect = {
  labelNombre: 'Representación federal',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de países de destino */
export const OPTIONS_NACION: CatalogosSelect = {
  labelNombre: 'País destino',
  required: true,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
}

/** Opciones del catálogo de medios de transporte */
export const OPTIONS_TRANSPORTE: CatalogosSelect = {
  labelNombre: 'Medio de transporte',
  required: false,
  primerOpcion: 'Selecciona un valor',
  catalogos: [],
};

/** Configuración para el campo de despacho LDA */
export const DESPACHO_LDA = {
  labelNombre: 'Sí',
  maxlength: 10,
  minlenght: 0,
  required: false,
  alfanumerico: true,
};
/** Interfaz que define la estructura de un ítem de mercancía en la respuesta de búsqueda.
 */
export interface MercanciaResponseItem {
  idMercancia: number;
  fraccionArancelaria?: string;
  numeroRegistroProducto?: string;
  fechaExpedicion?: string;
  fechaVencimiento?: string;
  nombreTecnico?: string;
  nombreComercial?: string;
  criterioOrigen?: string;
  valorContenidoRegional?: string;
  normaOrigen?: string;
  nombreIngles?: string;
}

/** Interfaz que define la estructura de la respuesta de búsqueda de mercancías.
 */
export interface BuscarMercanciasResponse {
  datos?: MercanciaResponseItem[];
}


/** Genera el mensaje HTML para registro exitoso
 * @param numeroSolicitud Número de solicitud a incluir en el mensaje
 * @returns Mensaje HTML formateado para registro exitoso
 */
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string): string =>
  `<pLa Solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Usted cuenta con 5 días naturales para firmar electrónicamente su solicitud y así poder obtener el certificado, de lo contrario ésta será cancelada.</p>`;