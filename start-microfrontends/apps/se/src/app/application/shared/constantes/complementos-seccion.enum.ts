
/**
 * Constantes para la sección de complementos
 * @constant
 */
import { Catalogo } from "@libs/shared/data-access-user/src";

import { AnexoFraccionAnarelaria, AnexoUnoProducto, ProveedorCliente, ProyectoImmex, SociaoAccionistas } from "../models/complimentos-seccion.model";
/**
 * Constantes para la sección de complementos
 *  @constant
 *  @type {string}
 */
export const FORMA_COMPLIMENTOS_SOLICITUDE = [
  {
    id: 'modalidad',
    labelNombre: 'Modalidad',
    campo: 'modalidad',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: 'Selecciona un valor',
    marginTop: 0,
  },

];
/**
 * Constantes para la sección de complementos
 */
export const FORMA_COMPLIMENTOS_PROGRAMA = [
  {
    id: 'preOperativo',
    labelNombre: ' Trámite IMMEX Pre operativo',
    campo: 'preOperativo',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    marcador_de_posicion: '',
    marginTop: 0,
  },
]
/**
 * Constantes para la sección de complementos
 * @constant
 */
export const FORMA_DATOS_GENERALES = [
  {
    id: 'paginaWWeb',
    labelNombre: 'Página web',
    campo: 'paginaWWeb',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,

    marcadorDePosicion: 'Selecciona un valor',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,

    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'localizacion',
    labelNombre: 'localización',
    campo: 'localizacion',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,

    marcadorDePosicion: 'Selecciona un valor',
    marginTop: 0,
  }
]

/**
 * Constantes para la sección de complementos
 * @constant
 */
export const OBLIGACIONES_FISCALES = [
  {
    id: 'OpinionPositiva',
    labelNombre: 'Opinión positiva del SAT',
    campo: 'OpinionPositiva',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    marcadorDePosicion: 'Selecciona un valor',
    marginTop: 0,
  },
  {
    id: 'fecha_inicio',
    labelNombre: 'Fecha inicio',
    campo: 'fecha_inicio',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    habilitado: true
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
]
/*
  * Constantes para la sección de complementos
  * @constant
  */
export const MANIFIESTOS_DECLARACION = {
  MANIFIESTOS:
    'Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.',
};
/**
 * Constantes para la sección de complementos
 * @constant
 */
export const FORMA_MODIFICACIONES_SOLICITUDE = [
  {
    id: 'nombreDelFederatario',
    labelNombre: 'Nombre del federatario que expide el documento',
    campo: 'nombreDelFederatario',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 3,
  },
  {
    id: 'nombreDeNotaria',
    labelNombre: 'Número de Notario',
    campo: 'nombreDeNotaria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'estados',
    labelNombre: 'Estado',
    campo: 'estados',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: 'Selecciona un valor',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'nombreDeActa',
    labelNombre: 'Número de acta',
    campo: 'nombreDeActa',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'fechaDeActa',
    labelNombre: 'fecha de emision del acta',
    campo: 'fechaDeActa',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'rfc',
    labelNombre: 'RFC del representante legal',
    campo: 'rfc',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'nombreDeRepresentante',
    labelNombre: 'Nombre del representante legal',
    campo: 'nombreDeRepresentante',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },

]
/**
 * Constantes para la sección de complementos
 * @constant
 */

export const FORMA_NACIONALIDAA_MAXICANA = [
  {
    id: 'taxId',
    labelNombre: 'Tax ID',
    campo: 'taxId',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: '',
    labelNombre: '',
    campo: '',
    clase: 'col-md-4',
    tipoInput: '',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'razonSocial',
    labelNombre: 'Denominación o razón social',
    campo: 'razonSocial',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'pais',
    labelNombre: 'País',
    campo: 'pais',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'codigoPostal',
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'estado',
    labelNombre: 'Estado',
    campo: 'estado',
    clase: 'col-md-6',
    tipoInput: 'select-catalogos',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'correoElectronico',
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    clase: 'col-md-6',
    tipoInput: 'text',
    validadores: [
      { tipo: 'required' }
    ],
    desactivado: false,
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
]
/*
  * Constantes para la sección de complementos
  * @constant
  */

export const FORMA_SI_NACIONALIDAA_MAXICANA = [
  {
    id: 'rfc_de_contri',
    labelNombre: 'Registro Federal de Contribuyentes ',
    campo: 'rfc_de_contri',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
]
/**
 * Constantes para la sección de complementos
 * @constant
 */
export const FORMA_PERSONA_FISICA_FORM_DATA = [
  {
    id: 'Nombre',
    labelNombre: 'Nombre',
    campo: 'Nombre',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'Apellido paterno',
    labelNombre: 'Apellido paterno',
    campo: 'Apellido paterno',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'pais_fisica',
    labelNombre: 'País',
    campo: 'pais_fisica',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'codigoPostal',
    labelNombre: 'Código postal',
    campo: 'codigoPostal',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'estado',
    labelNombre: 'Estado',
    campo: 'estado',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'correoElectronico',
    labelNombre: 'Correo electrónico',
    campo: 'correoElectronico',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'taxId',
    labelNombre: 'Tax ID',
    campo: 'taxId',
    clase: 'col-md-6',
    tipoInput: 'text',
    desactivado: false,
    validadores: [
      { tipo: 'required' }
    ],
    soloLectura: false,
    marcadorDePosicion: '',
    marginTop: 0,
  },

]
/**
 * Constantes para la sección de complementos
 * @constant
 * @type {Array}
 */

export const TABLA_SOCIO_ACCIONISTAS = [
  {
    encabezado: 'RFC',
    clave: (ele: SociaoAccionistas): string | undefined => ele.rfc,
    orden: 1,
  },
  {
    encabezado: 'razón social',
    clave: (ele: SociaoAccionistas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: SociaoAccionistas): string | undefined => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoPaterno,
    orden: 4,
  },

  {
    encabezado: 'Apellido materno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoMaterno,
    orden: 5,
  },
  {
    encabezado: 'Correo',
    clave: (ele: SociaoAccionistas): string | undefined =>
      ele.correoElectronico,
    orden: 6,
  },
];
/**
 * Constantes para la sección de complementos
 * @constant
 * @type {Array}
 */
export const TABLA_SOCIO_ACCIONISTAS_EXTRANJEROS = [
  {
    encabezado: 'TAX ID',
    clave: (ele: SociaoAccionistas): string | undefined => ele.taxId,
    orden: 1,
  },
  {
    encabezado: 'razón social',
    clave: (ele: SociaoAccionistas): string | undefined => ele.razonSocial,
    orden: 2,
  },
  {
    encabezado: 'Nombre',
    clave: (ele: SociaoAccionistas): string | undefined => ele.nombre,
    orden: 3,
  },
  {
    encabezado: 'Apellido paterno',
    clave: (ele: SociaoAccionistas): string | undefined => ele.apellidoPaterno,
    orden: 4,
  },

  {
    encabezado: 'País',
    clave: (ele: SociaoAccionistas): string | undefined => ele.pais,
    orden: 5,
  },
  {
    encabezado: 'CP',
    clave: (ele: SociaoAccionistas): string | undefined => ele.cp,
    orden: 6,
  },
  {
    encabezado: 'Estado',
    clave: (ele: SociaoAccionistas): string | undefined => ele.estado,
    orden: 6,
  },
  {
    encabezado: 'Correo',
    clave: (ele: SociaoAccionistas): string | undefined =>
      ele.correoElectronico,
    orden: 7,
  },
];
/**
 * Constantes para la sección de complementos
 * @constant
 * @type {Array}
 */

export const TABLA_ANEXO_PRODUCTO_FRACCION = [
  {
    encabezado: '#Fracción',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.fraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.fraccionArancelaria,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.descripcion,
    orden: 3,
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.anexoII,
    orden: 4,
  },

  {
    encabezado: 'Tipo',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.tipo,
    orden: 5,
  },
  {
    encabezado: 'UMT',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.umt,
    orden: 6,
  },
  {
    encabezado: 'Categoria',
    clave: (ele: AnexoUnoProducto): string | undefined => ele.categoria,
    orden: 6,
  },
  {
    encabezado: 'Valor en moneda mensual',
    clave: (ele: AnexoUnoProducto): string | undefined =>
      ele.valorModedaMensual,
    orden: 7,
  },
  {
    encabezado: 'Valor en moneda anual',
    clave: (ele: AnexoUnoProducto): string | undefined =>
      ele.valorModedaAnual,
    orden: 8,
  },
  {
    encabezado: 'Volumen mensual',
    clave: (ele: AnexoUnoProducto): string | undefined =>
      ele.valorMensual,
    orden: 9,
  },
  {
    encabezado: 'Volumen anual',
    clave: (ele: AnexoUnoProducto): string | undefined =>
      ele.valorAnual,
    orden: 10,
  }
]
/**
 * Constantes para la sección de complementos
 * @constant
 * @type {Array}
 */
export const TABLE_PROVEEDOR_CLIENTE = [
  {
    encabezado: 'Fracción',
    clave: (ele: ProveedorCliente): string | undefined => ele.fraccion,
    orden: 1,
  },
  {
    encabezado: 'País de origen',
    clave: (ele: ProveedorCliente): string | undefined => ele.paisDeOrigen,
    orden: 2,
  },
  {
    encabezado: 'Rfc/Tax Id Proveedor',
    clave: (ele: ProveedorCliente): string | undefined => ele.rfcTaxIdProveedor,
    orden: 3,
  },
  {
    encabezado: 'Razón Social Proveedor',
    clave: (ele: ProveedorCliente): string | undefined => ele.razonSocialProveedor,
    orden: 4,
  },

  {
    encabezado: 'País destino',
    clave: (ele: ProveedorCliente): string | undefined => ele.paisDestino,
    orden: 5,
  },
  {
    encabezado: 'Rfc/Tax Id Cliente',
    clave: (ele: ProveedorCliente): string | undefined => ele.rfcTaxClient,
    orden: 6,
  },
  {
    encabezado: 'Razón Social Cliente',
    clave: (ele: ProveedorCliente): string | undefined => ele.razonsocialCliente,
    orden: 6,
  }
]
/*
  * Constantes para la sección de complementos
  * @constant
  * @type {Array}
  */

export const ANEXO_I_SERVICIO_CATALOGO: Catalogo[] = [
  {
    id: 1,
    descripcion: 'Materia Prima',
  },
  {
    id: 2,
    descripcion: 'Producto terminado',
  },
]
/**
 * Constantes para la sección de complementos
 * @constant
 * @type {Array}
 */
export const PAIS_DESTINO_CATALOG: Catalogo[] = [
  {
    id: 1,
    descripcion: 'Mexico',
  },
  {
    id: 2,
    descripcion: 'USA',
  },
];
/**
 * Constantes para la sección de complementos
 * @constant
 */

export const TABLA_PROYECTO_IMMEX = [
  {
    encabezado: 'Fracción',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Tipo document',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoTipoDocument,
    orden: 2,
  },
  {
    encabezado: 'Descripción otro',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoDescripcionOtro,
    orden: 3,
  },
  {
    encabezado: 'Fecha firma',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoFechaFirma,
    orden: 4,
  },

  {
    encabezado: 'Fecha fin vigencia',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoFechaVigencia,
    orden: 5,
  },
  {
    encabezado: 'RFC de la parte firmante',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoRfc,
    orden: 6,
  },
  {
    encabezado: 'Nómbre/Razón social de la parte firmante',
    clave: (ele: ProyectoImmex): string | undefined => ele.encabezadoRazonFirmante,
    orden: 7,
  }
]
/*
* Constantes para la sección de complementos
*/
export const ANEXO_FRACION_ANARELARIA = [
  {
    encabezado: '#Fracción',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.anexoFraccion,
    orden: 1,
  },
  {
    encabezado: 'Fracción arancelaria del producto de exportación',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.anexoFraccionExportacion,
    orden: 2,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.anexoDescripcionComercialExportacion,
    orden: 3,
  },
  {
    encabezado: 'Fracción arancelaria de la mercancía de importación',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.anexoFraccionImportacion,
    orden: 4,
  },
  {
    encabezado: 'Descripción comercial',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.anexoDescripcionComercialImportacion,
    orden: 5,
  },
  {
    encabezado: 'Anexo II',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.anexoDos,
    orden: 6,
  },
  {
    encabezado: 'Tipo',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.tipo,
    orden: 7,
  },
  {
    encabezado: 'UMT',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.umt,
    orden: 8,
  },
  {
    encabezado: 'Categoria',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.catagoria,
    orden: 9,
  },
  {
    encabezado: 'Valor en moneda mensual',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.valorEnMonedaMensual,
    orden: 10,
  },
  {
    encabezado: 'Valor en moneda anual',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.valorEnMonedaAnual,
    orden: 11,
  },
  {
    encabezado: 'Volumen mensual',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.volumenMensual,
    orden: 12,
  },
  {
    encabezado: 'Volumen anual',
    clave: (ele: AnexoFraccionAnarelaria): string | undefined => ele.volumenAnual,
    orden: 13,
  },
]
/*
  * Constantes para la sección de complementos
  * @constant
  * @type {Array}
  */


export const COMPLEMENTAR_FRACCION_CATALOGO_DATOS = [{
  id: 1,
  descripcion: 'option1',
},
{
  id: 2,
  descripcion: 'option2',
},];
