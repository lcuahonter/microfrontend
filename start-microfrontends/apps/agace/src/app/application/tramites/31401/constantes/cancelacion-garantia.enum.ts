import {
  MiembroTabla,
  RequisitosTabla,
  TerecerosTabla,
  TipoInversionTabla,
} from '../models/cancelacion-garantia.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';

/**
  * @const TIPO_DE_GARANTIA_NOTA
  * @description
  * Nota informativa sobre los requisitos necesarios para la aceptación de la garantía (carta de crédito).
  * 
  * Detalles:
  * - Es obligatorio presentar el original de la carta de crédito en las oficinas de la AGACE.
  * - La carta debe estar emitida en hoja membretada de la institución de crédito emisora.
  * - La presentación debe realizarse mediante un escrito libre que cumpla con los requisitos establecidos en los artículos 18 y 18-A del Código Fiscal de la Federación.
  * - Es necesario acreditar la personalidad del representante legal conforme al artículo 19 del Código Fiscal de la Federación.
  * 
  * Ubicación:
  * - Av. Hidalgo 77, Col. Guerrero, C.P. 06300, Ciudad de México.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(TIPO_DE_GARANTIA_NOTA);
  */
export const TIPO_DE_GARANTIA_NOTA = `<p><strong>Nota: </strong></br>Es importante señalar que, para cumplir con todos los requisitos establecidos en la normatividad vigente para la aceptación de la garantía (carta de crédito), DEBERÁ presentar en las oficinas de la AGACE, ubicadas en: Av. Hidalgo 77, Col. Guerrero, C.P. 06300, Ciudad de México, el original de la carta de crédito en materia de IVA e IEPS emitida en hoja membretada de la institución de crédito emisora.</p>
    <p>Dicha carta de crédito deberá ser presentada mediante escrito libre que contenga los requisitos establecidos en los artículos 18 y 18-A del Código Fiscal de la Federación, y acreditando la personalidad del representante legal de conformidad con el artículo 19 del Código Fiscal de la Federación.</p>`;

    /**
  * @const TIPO_SECTOR
  * @description
  * Configuración de los campos relacionados con el tipo de sector en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos como fecha de inicio, tipo de sector y concepto.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `fecha_inicio`: Campo de tipo fecha para especificar la fecha de inicio.
  * - `tipoSector`: Campo de tipo radio para seleccionar el tipo de sector.
  * - `concepto`: Campo de tipo select-catalogos para elegir un concepto relacionado.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(TIPO_SECTOR);
  */
export const TIPO_SECTOR = [
  {
    id: 'tipoSector',
    labelNombre: '',
    campo: 'tipoSector',
    clase: 'col-md-8',
    tipoInput: 'radio',
    layout: 'horizontal',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
  },
  {
    id: 'conceptoLabel',
    labelNombre: 'Concepto',
    campo: 'concepto',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '1',
    marginTop: 0,
    opciones: [
      { id: 1, descripcion: 'Fabricación de meubles y productos relacionados' },
    ],
  },
];

/**
  * @const MANIFIESTO_BAJO_PROTESTA
  * @description
  * Configuración del campo relacionado con la declaración bajo protesta de decir la verdad en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye un campo de tipo checkbox para que el usuario manifieste que los datos proporcionados son ciertos.
  * - El campo está configurado como obligatorio mediante validadores.
  * - Está desactivado por defecto y tiene un valor predeterminado de `true`.
  * 
  * Campos:
  * - `id`: Identificador único del campo.
  * - `labelNombre`: Etiqueta que describe el propósito del campo.
  * - `campo`: Nombre del campo en el formulario.
  * - `tipoInput`: Tipo de entrada, en este caso, un checkbox.
  * - `validadores`: Validaciones aplicadas al campo, como `required`.
  * - `valorPredeterminado`: Valor inicial del campo.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(MANIFIESTO_BAJO_PROTESTA);
  */
export const MANIFIESTO_BAJO_PROTESTA = [
  {
    id: 'manifiesto4',
    labelNombre:
      'Bajo protesta de decir la verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades que me fueron otorgadas para representar al solicitante no han sido modificadas y/o revocadas',
    campo: 'bajoProtesta',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: true,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required',
      },
    ],
    marcadorDePosicion: '',
    valorPredeterminado: true,
    marginTop: 0,
  },
];

/**
  * @const REQUISITOS
  * @description
  * Configuración de los campos relacionados con los requisitos para el cumplimiento de obligaciones fiscales y aduaneras en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para verificar el cumplimiento de obligaciones fiscales, autorización para hacer pública la opinión positiva del SAT, y el registro del personal ante el IMSS.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `senale`: Campo de tipo radio para indicar si el solicitante está al corriente en sus obligaciones fiscales y aduaneras.
  * - `indiqueSiAutorizo`: Campo de tipo radio para autorizar al SAT a hacer pública la opinión positiva sobre el cumplimiento de obligaciones fiscales.
  * - `indiqueSiCuenta`: Campo de tipo radio para indicar si el solicitante cumple con el registro del personal ante el IMSS y el pago de cuotas obrero-patronales.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(REQUISITOS);
  */
export const REQUISITOS = [
  {
    id: 'senale',
    labelNombre:
      'Señale si, al momento de ingresar su solicitud, se encuentra al corriente en el cumplimiento de sus obligaciones fiscales y aduaneras.',
    campo: 'senale',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'indiqueSiAutorizo',
    labelNombre:
      'Indique si autorizo al SAT hacer pública su opinión positiva sobre el cumplimiento de obligaciones fiscales.',
    campo: 'indiqueSiAutorizo',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'indiqueSiCuenta',
    labelNombre:
      'Indique si cuenta con la totalidad del personal registrado ante el IMSS, en el SUA, y realiza el pago de las cuotas obrero-patronales, así como si cumple con la obligación de retener y enterar el ISR de los trabajadores.',
    campo: 'indiqueSiCuenta',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
];

/**
 * Configuración de las columnas para la tabla de extranjeros.
 */
export const ENCABEZADO_DE_TABLA: ConfiguracionColumna<RequisitosTabla>[] = [
  { encabezado: 'RFC', clave: (item) => item.rfc, orden: 1 },
  {
    encabezado: 'Nombre / Razón social',
    clave: (item) => item.nombre,
    orden: 2,
  },
];

/**
 * Configuración de las columnas para la tabla de extranjeros.
 */
export const ENCABEZADO_DE_TERECEROS_TABLA: ConfiguracionColumna<TerecerosTabla>[] = [
  { encabezado: 'RFC', clave: (item) => item.rfc, orden: 1 },
  { encabezado: 'CURP', clave: (item) => item.curp, orden: 2 },
  { encabezado: 'Nombre', clave: (item) => item.nombre, orden: 3},
  { encabezado: 'Primer apellido', clave: (item) => item.primerApellido, orden: 4},
  { encabezado: 'Segundo apellido', clave: (item) => item.segundoApellido, orden: 5},
];

/**
 * Configuración de las columnas para la tabla de extranjeros.
 */
export const ENCABEZADO_DE_TABLA_MIEMBRO: ConfiguracionColumna<MiembroTabla>[] =
  [
    {
      encabezado: 'Tipo de Persona',
      clave: (item) => item.tipoDePersona,
      orden: 1,
    },
    { encabezado: 'Nombre', clave: (item) => item.nombre, orden: 2 },
    { encabezado: 'RFC', clave: (item) => item.rfc, orden: 3 },
    {
      encabezado: 'En su carácter de ',
      clave: (item) => item.enSuCarater,
      orden: 4,
    },
  ];

/**
 * Configuración de las columnas para la tabla de extranjeros.
 */
export const ENCABEZADO_DE_TABLA_TIPO_INVERSION: ConfiguracionColumna<TipoInversionTabla>[] =
  [
    {
      encabezado: 'Tipo de inversión',
      clave: (item) => item.tipoDeInversion,
      orden: 1,
    },
    {
      encabezado: 'Descripción general',
      clave: (item) => item.descripcion,
      orden: 2,
    },
    { encabezado: 'Valor', clave: (item) => item.valor, orden: 3 },
  ];

  /**
  * @const CONTROL_DE_INVENTARIOS
  * @description
  * Configuración de los campos relacionados con el sistema de control de inventarios en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para verificar si el solicitante cuenta con un sistema de control de inventarios para operaciones de comercio exterior.
  * - También verifica si el sistema cumple con las disposiciones del Anexo 24.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `indiqueRegistro`: Campo de tipo radio para indicar si se cuenta con un sistema de control de inventarios conforme al artículo 59, fracción I de la Ley.
  * - `indiqueConformidad`: Campo de tipo radio para indicar si el sistema cumple con las disposiciones del Anexo 24.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(CONTROL_DE_INVENTARIOS);
  */
export const CONTROL_DE_INVENTARIOS = [
  {
    id: 'indiqueRegistro',
    labelNombre:
      'Indique si cuenta con un sistema de control de inventarios para el registro de sus operaciones de comercio exterior, de conformidad con el artículo 59, fracción I de la Ley.',
    campo: 'indiqueRegistro',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'indiqueConformidad',
    labelNombre:
      'Indique si cuenta con un sistema de control de inventarios de conformidad con las disposiciones previstas por el Anexo 24.',
    campo: 'indiqueConformidad',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
];

/**
  * @const CONTROL_DE_INVENTARIOS_ALERT
  * @description
  * Mensaje de alerta relacionado con el sistema de control de inventarios conforme al Anexo 24.
  * 
  * Detalles:
  * - Indica que, en caso de declarar que se cuenta con un sistema de control de inventarios conforme al Anexo 24, 
  *   se debe anexar un archivo con el reporte de saldos de mercancía de importación temporal.
  * - El reporte debe corresponder a un periodo de un mes dentro de los tres meses anteriores a la fecha de la solicitud.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(CONTROL_DE_INVENTARIOS_ALERT.mensaje);
  */
export const CONTROL_DE_INVENTARIOS_ALERT = {
  mensaje:
    'En caso de declarar que se cuenta con un sistema de control de inventarios conforme al Anexo 24, deberá anexar un archivo con el reporte de saldos de mercancía de importación temporal de un periodo de un mes, que se encuentre dentro de los tres meses anteriores a la fecha de la presente solicitud.',
};

/**
  * @const MIEMBRO_DE_LA_EMPRESA
  * @description
  * Configuración de los campos relacionados con los miembros de la empresa en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para verificar si los socios, accionistas o representantes legales están vinculados con empresas sancionadas.
  * - También incluye campos para declarar inversiones en territorio nacional y su legal posesión.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `manifieste`: Campo de tipo radio para indicar si los socios o representantes legales están vinculados con empresas sancionadas.
  * - `indiqueSi`: Campo de tipo radio para verificar si los proveedores están en el listado del SAT.
  * - `manifiesteSi`: Campo de tipo radio para declarar si se ha determinado algún crédito fiscal firme.
  * - `manifiesteSiCuenta`: Campo de tipo radio para declarar si se cuenta con inversión en territorio nacional.
  * - `tipoInversion`: Campo de tipo select-catalogos para especificar el tipo de inversión.
  * - `valorPesos`: Campo de tipo texto para declarar el valor de la inversión en pesos.
  * - `descripcion`: Campo de tipo texto para proporcionar una descripción general de la inversión.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(MIEMBRO_DE_LA_EMPRESA);
  */
export const MIEMBRO_DE_LA_EMPRESA = [
  {
    id: 'manifieste',
    labelNombre:
      'Manifieste si sus socios o accionistas, representante legal con facultad para actos de dominio e integrantes de la administración, de conformidad con la constitución de la empresa solicitante, no se encuentran vinculados con alguna empresa a la que se le hubiere cancelado su Registro en el Esquema de Certificación de Empresas, de conformidad con las fracciones V, VI y VII del Apartado A; II y III del Apartado B de la regla 7.2.4., y/o VI, VII y XI de la regla 7.2.5.',
    campo: 'manifieste',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'indiqueSi',
    labelNombre:
      'Indique si sus proveedores se encuentran en el listado de empresas publicadas por el SAT, en términos del artículo 69 del CFF, con excepción de la fracción VI, artículo 69-B, párrafo cuarto, y 69-B Bis, noveno párrafo del CFF.',
    campo: 'indiqueSi',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'manifiesteSi',
    labelNombre:
      'Manifieste si se le ha determinado algún crédito fiscal firme en los doce meses anteriores a la fecha de presentación de la solicitud.',
    campo: 'manifiesteSi',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'manifiesteSiCuenta',
    labelNombre:
      'Manifieste si cuenta con inversión en territorio nacional y acredita la legal posesión de la misma, sin que sea admisible aquella que se obtiene de manera gratuita.',
    campo: 'manifiesteSiCuenta',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    marginTop: 3,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'tipoInversion',
    labelNombre: 'Tipo de inversión',
    campo: 'tipoInversion',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: 'Selecciona un tipo',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'valorPesos',
    labelNombre: 'Valor en pesos',
    campo: 'valorPesos',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'descripcion',
    labelNombre: 'Descripción general',
    campo: 'descripcion',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
];

/**
  * @const REGIMEN_ADUANERO
  * @description
  * Configuración de los campos relacionados con el régimen aduanero en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para seleccionar el régimen aduanero y verificar si se cuenta con la autorización para operar el régimen de depósito fiscal.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `regimen`: Campo de tipo checkbox-multiple para seleccionar el régimen aduanero.
  * - `senaleMomento`: Campo de tipo radio para indicar si se cuenta con la autorización para operar el régimen de depósito fiscal.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(REGIMEN_ADUANERO);
  */
export const REGIMEN_ADUANERO = [
  {
    id: 'regimen',
    labelNombre: 'Régimen Aduanero',
    campo: 'regimen',
    clase: 'col-md-12',
    tipoInput: 'checkbox-multiple',
    desactivado: true,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    valorPredeterminado: '2',
    marginTop: 0,
  },
  {
    id: 'senaleMomento',
    labelNombre:
      'Señale si, al momento de la presentación de su solicitud, cuenta con la autorización para operar el régimen de depósito fiscal para someterse al proceso de ensamble y fabricación de vehículos a empresas de la industria automotriz terminal.',
    campo: 'senaleMomento',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
];

/**
  * @const INFRAESTRUCTURA
  * @description
  * Configuración de los campos relacionados con la infraestructura necesaria para realizar operaciones, procesos productivos o de servicios en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para verificar si el solicitante cuenta con la infraestructura necesaria para realizar las operaciones correspondientes al régimen aduanero solicitado.
  * - También incluye un campo para declarar si se ha emitido una resolución de improcedencia de devoluciones del IVA.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `senaleMomento`: Campo de tipo radio para indicar si se cuenta con la infraestructura necesaria.
  * - `manifieste`: Campo de tipo radio para declarar si se ha emitido una resolución de improcedencia de devoluciones del IVA.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(INFRAESTRUCTURA);
  */
export const INFRAESTRUCTURA = [
  {
    id: 'senaleMomento',
    labelNombre:
      'Señale si, al momento de su solicitud, cuenta con la infraestructura necesaria para realizar la operación, el proceso productivo o de servicios, según corresponda al régimen aduanero por el que se solicita el registro.',
    campo: 'senaleMomento',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
  {
    id: 'manifieste',
    labelNombre:
      'Manifieste si se le ha emitido resolución de improcedencia de las devoluciones del IVA cuyo monto represente más del 20% del total de las devoluciones autorizadas y/o que el monto negado resultante supere los $5,000,000.00 (cinco millones de pesos 00/100 M.N.) en lo individual o en su conjunto, durante los últimos seis meses contados a partir de la fecha de presentación de la solicitud.',
    campo: 'manifieste',
    clase: 'col-md-12',
    tipoInput: 'radio',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 1,
    gridLayout: true,
    opciones: [
      {
        label: 'Si',
        value: 1,
      },
      {
        label: 'No',
        value: 2,
      },
    ],
  },
];

/**
  * @const INFRAESTRUCTURA_ALERTA
  * @description
  * Mensaje de alerta relacionado con la declaración de Constancias de Transferencia de Mercancías (CTM).
  * 
  * Detalles:
  * - Indica que, en caso de haber declarado que realiza Constancias de Transferencia de Mercancías (CTM), 
  *   se debe anexar un archivo con los nombres y domicilios de las empresas a las que se transfirieron mercancías.
  * - También se deben incluir los montos en moneda nacional y, en su caso, dos Constancias de Transferencia de Mercancías (CTM).
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(INFRAESTRUCTURA_ALERTA.mensaje);
  */
export const INFRAESTRUCTURA_ALERTA = {
  mensaje:
    'En caso de haber declarado que realiza Constancias de Transferencia de Mercancías (CTM), anexe un archivo con los nombres y domicilios de las empresas a las que les transfirió mercancías mediante Constancias de Transferencia de Mercancías (CTM), así como los montos en moneda nacional y, en su caso, dos Constancias de Transferencia de Mercancías (CTM).',
};

/**
  * @const MANIFESTACIONES
  * @description
  * Configuración de los campos relacionados con las manifestaciones en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para informar sobre la inhabilitación de la garantía y para declarar bajo protesta de decir la verdad.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `esImportante`: Campo de tipo checkbox para informar sobre la inhabilitación de la garantía.
  * - `bajoProtesta`: Campo de tipo checkbox para declarar bajo protesta de decir la verdad.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(MANIFESTACIONES);
  */
export const MANIFESTACIONES = [
  {
    id: 'esImportante',
    labelNombre: 'Es importante señalar que la Garantía con número 6464564 emitida por CREDITO AFIANZADOR SA COMPAÑÍA MEXICANA DE GARANTÍAS de fecha 30 de septiembre del 2024, asociada al/los folio(s) 2500301100120249910000077 quedará inhabilitada para la introducción de bienes al régimen aduanero afecto a la garantía antes mencionada, a partir del envío de la solicitud del trámite de cancelación de la garantía, y solo en caso de una resolución negativa, podrá ser habilitada nuevamente.',
    campo: 'esImportante',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'bajoProtesta',
    labelNombre: 'Bajo protesta de decir la verdad, manifiesto que los datos asentados en el presente documento son ciertos y que las facultades que me fueron otorgadas para representar al solicitante no me han sido modificadas y/o revocadas.',
    campo: 'bajoProtesta',
    clase: 'col-md-12',
    tipoInput: 'checkbox',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
];

/**
  * @const FORMA_INVALIDO_ALERTA
  * @description
  * Mensaje de alerta que se muestra cuando el formulario contiene errores y no puede ser enviado.
  * 
  * Detalles:
  * - Informa al usuario que debe corregir los errores antes de continuar con la solicitud.
  * - Específicamente, indica que todas las manifestaciones deben ser seleccionadas para proceder.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(FORMA_INVALIDO_ALERTA.mensaje);
  */
export const FORMA_INVALIDO_ALERTA = {
  mensaje: `
  <p class="text-center">Corrija los siguientes errores:</p>
  <div class="row d-flex justify-content-between align-items-center">
  <div class="col-md-2">
  <p class="text-start" style="color: #d0021b">1.</p>
  </div>
  <div class="col-md-10">
  <p class="text-start" style="color: #d0021b">Debe seleccionar todas las manifestaciones para poder continuar con la solicitud.</p>
  </div>
  </div>
  `,
};

/**
  * @const FORMA_VALIDO_ALERTA
  * @description
  * Mensaje de confirmación que se muestra cuando el formulario ha sido enviado correctamente.
  * 
  * Detalles:
  * - Informa al usuario que la solicitud ha sido registrada con un número temporal.
  * - Aclara que este número no tiene validez legal y sirve únicamente para identificar la solicitud hasta que sea firmada.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(FORMA_VALIDO_ALERTA.mensaje);
  */
export const FORMA_VALIDO_ALERTA = {
  mensaje: 'La solicitud ha quedado registrada con el número temporal 202771879. Este no tiene validez legal y sirve solamente para efectos de identificar tu solicitud al momento que esta sea firmada.'
};

/**
  * @const DATOS_POR_GARANTIA
  * @description
  * Configuración de los campos relacionados con los datos de la garantía en un formulario dinámico.
  * 
  * Detalles:
  * - Incluye campos para capturar información sobre la institución de fianza, número de folio, RFC, fechas de vigencia y el importe total de la póliza.
  * - Cada campo tiene configuraciones específicas como tipo de entrada, validadores, y valores predeterminados.
  * 
  * Campos:
  * - `nombreInstitucion`: Campo de tipo select-catalogos para seleccionar la institución de fianza.
  * - `numeroFolio`: Campo de tipo texto para capturar el número de folio.
  * - `rfc`: Campo de tipo texto para mostrar el RFC de la institución de fianza.
  * - `fechaExpedicion`: Campo de tipo texto para mostrar la fecha de expedición de la póliza.
  * - `fechaInicio`: Campo de tipo texto para mostrar la fecha de inicio de vigencia.
  * - `fechaFin`: Campo de tipo texto para mostrar la fecha de fin de vigencia.
  * - `importeTotal`: Campo de tipo texto para mostrar el importe total en moneda nacional que ampara la póliza de fianza.
  * 
  * @example
  * // Uso de la constante en un componente:
  * console.log(DATOS_POR_GARANTIA);
  */
export const DATOS_POR_GARANTIA = [
  {
    id: 'nombreInstitucion',
    labelNombre: 'Nombre de la institución de fianza que emite el documento',
    campo: 'nombreInstitucion',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '1',
    marginTop: 0,
    opciones: [
      { id: 1, descripcion: 'CREDITO AFIANZADOR SA COMPAÑÍA MEXICANA DE GARANTÍAS' },
    ],
  },
  {
    id: 'numGenericoCarta',
    labelNombre: 'Número de folio',
    campo: 'numeroFolio',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '6464564',
    marginTop: 0,
  },
  {
    id: 'cveGenerica1Carta',
    labelNombre: 'RFC de la institución de fianza',
    campo: 'rfc',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: 'CAF910401EI9',
    marginTop: 0,
  },
  {
    id: 'fechaGenerica1Carta',
    labelNombre: 'Fecha de expedición',
    campo: 'fechaExpedicion',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '30/09/2024',
    marginTop: 0,
  },
  {
    id: 'fecInicioVigenciaCarta',
    labelNombre: 'Fecha de inicio de vigencia',
    campo: 'fechaInicio',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '30/09/2024',
    marginTop: 0,
  },
  {
    id: 'fecFinVigenciaCarta',
    labelNombre: 'Fecha de fin de vigencia',
    campo: 'fechaFin',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '30/09/2024',
    marginTop: 0,
  },
  {
    id: 'importeGenerico1Carta',
    labelNombre: 'Importe total en moneda nacional que ampara la póliza de fianza.',
    campo: 'importeTotal',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '55656456',
    marginTop: 0,
  },
]
