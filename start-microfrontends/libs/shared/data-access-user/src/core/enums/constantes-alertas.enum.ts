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

/**
 * Pasos para trámites que solo requieren dos pasos.
 */
export const PASOS2 = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: false,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

export const CONSTANTES = {
  EXP_CORREO: /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/,
};

/**
 * Contiene constantes de texto utilizadas para mostrar mensajes e instrucciones en la interfaz de usuario.
 * Estas constantes están diseñadas para ser reutilizadas en diferentes partes de la aplicación.
 * @property {string} INSTRUCCIONES - Instrucciones generales para el usuario para la carga de documentos.
 * @property {string} ADJUNTAR - Mensaje que indica cómo adjuntar un nuevo documento.
 * @property {string} ADJUNTAR_DOCUMENTOS - Mensaje que indica las características que debe cumplir el documento a adjuntar.
 * @property {string} ADJUNTAR_WARNING - Mensaje que advierte sobre el tiempo de carga del documento.
 * @property {string} DECLARACION_DE_RESPONSABILIDAD_SOLIDARIA - Mensaje relacionado con la responsabilidad solidaria del residente en territorio nacional.
 * @property {string} SELECCION_UN_CRITERIO_DE_BUSQUEDA - Mensaje que indica que se debe seleccionar un criterio de búsqueda.
 * @property {string} REQUISITOS_GUARDADOS_CORRECTAMENTE - Mensaje que indica que los requisitos se han guardado correctamente.
 * @property {string} INSTRUCCIONES_AGREGAR_NUEVO - Instrucciones para agregar un nuevo documento.
 */
export const TEXTOS = {
  INSTRUCCIONES: `<h5 style="text-align: center;">Instrucciones: </h5>
  <ul style="text-align: center; list-style-position: inside; padding: 0;">
    <li>De acuerdo al caso particular, algunos documentos podrían ser obligatorios</li>
    <li>En caso de que no requieras algún documento, selecciónalo y elimínalo</li>
    <li>Si necesitas anexar más de un documento del mismo tipo, da clic en el botón <i class="bi bi-plus-circle-fill"></i> para agregar cuantos necesites.</li>
  </ul>`,
  ADJUNTAR: `<p style="text-align: left;">Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos"</p>`,
  ADJUNTAR_DOCUMENTOS: `<p style="text-align: center;">Para poder adjuntar tu documento, deberá cumplir las siguientes características:</p>
  <p style="text-align: center;"><b>•</b> Debe ser formato PDF que no contenga formularios, objetos OLE incrustrados, código java script, etc.</p>
  <p style="text-align: center;"><b>•</b> No debe contener páginas en blanco.</p>`,
  ADJUNTAR_WARNING: `<p style="text-align: left;">La carga del documento puede tardar varios segundos, este tiempo dependerá del tamaño de tu archivo y de la velocidad de tu conexión.</p>`,
  DECLARACION_DE_RESPONSABILIDAD_SOLIDARIA: `<span style="text-align: left;">*? En mi calidad de Residente en Territorio Nacional, manifiesto mi voluntad y disposición de asumir la responsabilidad solidaria a que se refiere la fracción VIII del artículo 26 del Código Fiscal de la Federación, por los créditos fiscales que lleguen a derivarse por no retornar las Mercancías a que el presente aviso se refiere, al extranjero dentro del plazo establecido en la Ley"</span>`,
  SELECCION_UN_CRITERIO_DE_BUSQUEDA: `<span style="text-align: left;">Selecciona un criterio de búsqueda</span>`,
  REQUISITOS_GUARDADOS_CORRECTAMENTE: `<span style="text-align: left;">Requisitos guardados correctamente</span>`,
  INSTRUCCIONES_AGREGAR_NUEVO: `<h6 style="text-align: left;">Instrucciones</h6>
  <p style="text-align: left;">- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
  <p style="text-align: left;">- En caso de que no requieras algún documento, selecciónalo y elimínalo</p>
  <p style="text-align: left;">- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo"</p>`,
  /**
   * Mensaje de advertencia para el usuario.
   */
  ADVERTENCIA: `<p style="text-align: center;">No cuenta con una autorizaciï¿12n vigente en el Registro del Esquema de Certificacii¿12n de Empresas bajo la modalidad IVA e IEPS,
rubros AA o AAA, no es posible continuar</p>`,
};

export const MESES = [
  { id: '1', mes: 'Enero' },
  { id: '2', mes: 'Febrero' },
  { id: '3', mes: 'Marzo' },
  { id: '4', mes: 'Abril' },
  { id: '5', mes: 'Mayo' },
  { id: '6', mes: 'Junio' },
  { id: '7', mes: 'Julio' },
  { id: '8', mes: 'Agosto' },
  { id: '9', mes: 'Septiembre' },
  { id: '10', mes: 'Octubre' },
  { id: '11', mes: 'Noviembre' },
  { id: '12', mes: 'Diciembre' },
];

export const SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export const SEMANA_D = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const MENSAJEDEALERTA = {
  ADJUNTAR: `<p style="text-align: center;">Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.</p>`,
};

export const MENSAJE_ALERTA_TRATADOS = {
  MENSAJE_ALERTA: `
<ul>
  Para seleccionar un tratado y criterio, siga los siguientes pasos:
  <li>Primero seleccione un país o bloque.</li>
  <li>Después seleccione un tratado o acuerdo.</li>
  <li>Seleccione el criterio para conferir origen.</li>
  <li>Finalmente, agregue su selección a la lista de tratados.</li>
</ul>
`,
};

export const FIRMAR_SOLICITUD = {
  MENSAJE: `<p>La solicitud ha quedado registrada con el numero temporal {NUMERO}. Éste no tiene validez legal y sirve solamente para efectos de
  identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`,
};

export const INSTANCIA = {
  MENSAJE: `<p>Seleccione al menos 1 de las opciones por lo cual cumple el criterio de otras instancias.</p>`,
};

export const INSTANCIA_ALIANZA = {
  MENSAJE: `<p>Seleccione la(s) opcion(es) por las cual(es) cumple el criterio de otras instacias.</p>`,
};

export const ELVALORALERTA = {
  ADJUNTAR: `<p>El valor de la transacción debe ser mayor al valor de dólares para insumos/envases.</p>`,
};

export const COSTO_NETO_VALOR_FOB = {
  ALIANZA_DEL_PACIFICO: `<p>Para el Acuerdo Alianza del Pacifico corresponden los valores: Costo neto y Valor FOB</p>`,
};

export const TIPO_METODO = {
  TIPO_METODO: `<p>Para el tratado de uruguay corresponden los valores: Método de valor de transacción y Método de costo neto </p>`,
};

export const TIPO_METODO_PANAMA = {
  TIPO_METODO_PANAMA: `<p>Para el tratado de Panamá corresponden los valores: Valor de transacción y Costo Neto </p>`,
};

export const ALIANZA_JUEGOS_SURTIDOS ={
  TIPO_JUEGOS_ALIANZA: `<p>Para el Acuerdo Alianza del Pacifico  con juegos o Surtidos corresponde el Valor FOB</p>`,
}

export const PROTESTA = {
  ADJUNTAR: `
  El/la que suscribe manifiesto(a) bajo protesta de decir verdad, que la información declarada en el presente trámite de REGISTRO ÚNICO DE PRODUCTOS ELEGIBLES PARA PREFERENCIAS Y CONCESIONES ARANCELARIAS es copia fiel, íntegra e inalterada de la información y documentación soporte que obra en poder del (de la) solicitante.`,
};
export const FECHA_SALIDA = {
  labelNombre: 'Fecha de expedición de certificado de molino o de calidad',
  required: true,
  habilitado: true,
};

export const TXT_ALERTA_ACUSE = (folio: string): string => {
  return `
    <div style="text-align: center;">
      Tu solicitud ha sido registrada con el siguiente número de folio: &lt; ${folio} &gt;
    </div>
  `;
};

export const TXT_ALERTA_ACUSE_RECIBO = (folio: string): string => {
  return `El requerimiento se registró exitosamente con el folio de requerimiento  < ${folio} >`;
};

export const TITULO_ACUSE = 'Acuse(s)';
export const ENCABEZADO_TABLA_ACUSE = [
  {
    key: 'id',
    valor: 'No.',
  },
  {
    key: 'documento',
    valor: 'Documento',
  },
];
export const ACUSE_SERVICIOS_EXTRAORDINARIOS = {
  txtAlerta:
    'Tu solicitud ha sido registrada con el siguiente número de folio:',
  tituloSeccionAcuse: 'Acuse(s)',
  encabezadoTablaAcuse: [
    {
      key: 'id',
      valor: 'No.',
    },
    {
      key: 'documento',
      valor: 'Documento',
    },
  ],
  datosTablaAcuse: [
    {
      id: 1,
      idDocumento: 'doc12',
      documento: 'Acuse de recepción de trámite',
      urlPdf: 'assets/pdf/Test03.pdf',
    },
  ],
  accionesTablaAcuse: [
    {
      tipo: 'descargar',
      label: 'Descargar',
      icono: 'bi-arrow-bar-down',
    },
  ],
};
export const IMPORTANTE = {
  Importante: `<p><strong>Importante: </strong>Si existe duda respecto del producto a registrar o al pago correspondiente, favor de comunicarse a los teléfonos 55 5128 2544, 55 5128 2595 y 55 5128 2553</p>`,
};

export const MERCHANDISE_IMPORTANTE = {
  Importante: `<p><strong>Importante: </strong>Si existe duda respecto del producto a registrar o al pago correspondiente, por favor comunicate a los teléfonos 0155 5128 2544 y 0155 5128 2595</p>`,
};

export const ALERTA_DE_MATERIAL = {
  ADJUNTAR: `<p>de no existir el material en el sistema, debes de realizer la gestión de la solicitud en físico y de manera presencial.</p>`,
};

export const PAGO_DE_DERECHOS = {
  ADJUNTAR: `<h5 style="text-align: center;">Aviso de privacidad simplificado</h5>
  <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior. Para mayor información acerca del tratamiento y derechos que puede hacer valer, usted puede acceder al aviso integral en el portal www.sat.gob.mx.</p>`,
};

export const PASOS4 = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar necesarios',
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

export const AVISO = {
  Aviso: `<p style="text-align: center; font-weight: bold;">Aviso de privacidad simplificado:</p>
  <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio </p>`,
  Alerta: `<p style="text-align: center; font-weight: bold;">Aviso de privacidad simplificado</p>
  <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se
recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y
transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones,
exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme
a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre
los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y
restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados
en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el
Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14
de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de
sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer
nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><p style="text-align: center;"><a href="">Aviso de privacidad integral</a></p>`,
};

export const AL_DAR = {
  AlDar: `<p>Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.</p>`,
};

export const SECTORESY = {
  alerta: `<p>Para continuar con el trámite, debes agregar por lo menos una mercancía.</p>`,
};

export const FIRMAR = {
  alerta: `<p>La solicitud ha sido guardada exitosamente. Tiene 15 días naturales para firmarla, después de ese tiempo desaparecerá del listado de solicitudes pendientes por firmar. Número de solicitud [202758747]</p>`,
};

export const SOLICITUD = {
  alerta: `<p>Tu solicitud ha sido registrada con el siguiente número de folio <0200900200120242540000002>.</p>`,
};

export const TODOS_PASOS = {
  Importante: `<p>La Solicitud ha quedado registrada con el número temporal 202767557. Éste no tiene validez legal y sirve solamente para
  efectos de identificar tu Solicitud. Un folio oficial le será asignado a la Solicitud al momento en que ésta sea firmada.</p>`,
};

export const REQUISITOS = {
  Importante: `<p>La solicitud ha quedado registrada con el número temporal 202767918. Éste no tiene validez legal y sirve solamente para
efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.</p>`,
};

export const REQUISITOS_OPCIONALES = {
  INSTRUCCIONES: `<h6>Instrucciones</h6>
  <p>- De acuerdo al caso particular, algunos documentos podrían ser obligatorios</p>
  <p>- En caso de que no requieras algún documento, seleccionalo y elíminalo</p>
  <p>- Si necesitas anexar más de un documento del mismo tipo selecciónalo de la lista y presiona "Agregar nuevo"</p>`,
};

export const ANEXAR = {
  Importante: `<p>
Si deseas adjuntar un nuevo documento, selecciona la opción --Adjuntar nuevo documento-- y presiona el botón "Adjuntar documentos".</p>`,
};

export const LASTABLA = {
  Importante: `
    <div class="text-center">
      <p class="m-0">Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.</p>
    </div>
  `,
};

export const TERCEROS = {
  alerta: `<p class="text-align-center">Las tablas con asterisco son obligatorias y debes agregar por lo menos un registro.</p>`,
};

export const URL_PRUEBA = 'assets/pdf/Test03.pdf';

export const TRAMITES_CUATRO_PASOS = ['5701'];

export const PASOS_REQUERIMIENTOS = [
  {
    indice: 1,
    titulo: 'Requerimiento de información',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar documentos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar promoción',
    activo: false,
    completado: false,
  },
];

export const PASOS_REQUERIMIENTOS_DATOS = [
  {
    indice: 1,
    titulo: 'Requerimiento de información',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Requerimiento de datos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar promoción',
    activo: false,
    completado: false,
  },
];

export const PASOS_REQUERIMIENTOS_DATOS_DOCUMENTOS = [
  {
    indice: 1,
    titulo: 'Requerimiento de información',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Requerimiento de datos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Anexar documentos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar promoción',
    activo: false,
    completado: false,
  },
];

export const PASOS_REQUERIMIENTOS_DOCUMENTOS = [
  {
    indice: 1,
    titulo: 'Requerimiento de información',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Anexar documentos',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Firmar promoción',
    activo: false,
    completado: false,
  },
];

export const FECHA_INICIO = {
  labelNombre: 'Fecha inicio',
  required: true,
  habilitado: true,
};

export const FECHA_FINAL = {
  labelNombre: 'Fecha final',
  required: true,
  habilitado: true,
};

export const PRECAUCION =
  '<strong>¡Precaución!</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

/**
 * @const REGEX_FECHA_MES_ANO
 * @description Expresión regular para validar fechas en el formato "MM/AAAA", donde:
 * - "MM" representa el mes en dos dígitos (01 a 12).
 * - "AAAA" representa el año en cuatro dígitos.
 *
 * @example
 * ```typescript
 * const fechaValida = REGEX_FECHA_MES_ANO.test("03/2023"); // true
 * const fechaInvalida = REGEX_FECHA_MES_ANO.test("13/2023"); // false
 * ```
 *
 */
export const REGEX_FECHA_MES_ANO = /^(0[1-9]|1[0-2])\/\d{4}$/;

/**
 * @const FECHA_INICIO_VIGENCIA
 * @description Objeto que define la configuración de la fecha de inicio de vigencia.
 */
export const FECHA_INICIO_VIGENCIA = {
  labelNombre: 'Fecha inicio:',
  required: false,
  habilitado: false,
};

/**
 * @const FECHA_FINAL_VIGENCIA
 * @description Objeto que define la configuración de la fecha final de vigencia.
 */
export const FECHA_FINAL_VIGENCIA = {
  labelNombre: 'Fecha fin:',
  required: false,
  habilitado: false,
};

/**
 * @const FECHA_INICIO_VIGENCIA_DEL_CUPO
 * @description Objeto que define la configuración de la fecha de inicio de vigencia del cupo.
 */
export const FECHA_INICIO_VIGENCIA_DEL_CUPO = {
  labelNombre: 'Fecha inicio vigencia del cupo:',
  required: false,
  habilitado: false,
};

/**
 * @const FECHA_FINAL_VIGENCIA_DEL_CUPO
 * @description Objeto que define la configuración de la fecha final de vigencia del cupo.
 */
export const FECHA_FINAL_VIGENCIA_DEL_CUPO = {
  labelNombre: 'Fecha fin vigencia del cupo:',
  required: false,
  habilitado: false,
};

/**
 * Constante que contiene los textos de instrucciones para la sección de selección de documentos.
 *
 * @constant
 * @type {{ INSTRUCCIONES: string }}
 *
 * @property {string} INSTRUCCIONES - Texto HTML que contiene las instrucciones para solicitar o eliminar documentos adicionales.
 *
 * Ejemplo de uso:
 * ```
 * const instrucciones = SELECCIONAR_DOCUMENTOS.INSTRUCCIONES;
 * ```
 */
export const SELECCIONAR_DOCUMENTOS = {
  INSTRUCCIONES: `<h6>Instrucciones:</h6>
  <p>-Para solicitar documentos adicionales, selecciona el documento y presiona "Agregar nuevo".</p>
  <p>-En caso de que no requieras algún documento, selecciónalo y elimínalo.</p>`,
};

/**
 * Constante que contiene las condiciones para que los juegos o surtidos de mercancías califiquen como originarios.
 *
 * @constant
 * @type {{ CONDICION: string }}
 */
export const CONDICIONES_JUEGOS_SURTIDOS = {
  CONDICION:
    `<li><p> Los juegos o surtidos que se clasifiquen según lo dispuesto en la Regla 3 de las Reglas Generales 
  para la Interpretación del Sistema Armonizado, así como las mercancías cuya descripción, conforme a la 
  nomenclatura del Sistema Armonizado, sea específicamente la de un juego o surtido, calificarán como originarias, 
  siempre que cada una de las mercancías contenidas en el juego o surtido cumpla con la regla de origen que se haya 
  establecido para cada una de esas mercancías y las demás disposiciones aplicables de este Capítulo.<br></p></li>` +
    `<li><p> No obstante lo dispuesto en el párrafo 1, un juego o surtido de mercancías se considerará originario, 
  si el valor de transacción de todas las mercancías no originarias utilizadas en la formación del juego o surtido, 
  ajustado sobre la base CIF, no excede del 10 por ciento del valor de transacción del juego o surtido, 
  ajustado sobre la base FOB.</p></li>`,
};

/**
 * Constante que contiene las condiciones para que los juegos o sutidos de mercancías califiquen como originarios bajo el Acuerdo de la Alicanza del Pacífico.
 * 
 * @constant
 * @type {{ CONDICION_ALIZANZA: string}}
 */
export const CONDICIONES_JUEGOS_SURTIDOS_ALIANZA = {
  CONDICION_ALIANZA:
  `<li><p> Un juego o surtido, se clasificará como tal cuando se cumpla con las reglas 1 o 3 de las Reglas Generales 
  para la Interpretación del Sistema Armonizado (SA) y con las Reglas 3 a) y 3 b) del ACUERDO por el que se dan a 
  conocer las Notas Explicativas de la Tarifa Arancelaria.<br></p></li>` +
  `<li><p> Cuando cada uno de los componentes del juego o surtido sean originarios, dicho juego o surtido será considerado 
  originario.</p></li>`
};

/**
 * Constante que contiene el mensaje para seleccionar el proceso de transformación utilizado en la mercancía.
 * @constant
 * @type {{ MENSAJE: string }}
 * @property {string} MENSAJE - Mensaje en formato HTML que indica al usuario que debe seleccionar el proceso de transformación utilizado en la mercancía.
 */
export const MENSAJE_DE_SELECCION = {
  MENSAJE: `<p>Favor de seleccionar el proceso de transformación utilizado en la mercancía.</p>`,
};

/**
 * @constant ERROR_FORMA_ALERT
 * @type {string}
 * @description
 * Este mensaje de alerta informa al usuario sobre el proceso para agregar datos del traslado y la sede,
 * indicando que a cada traslado le corresponde una sede con un máximo de dos itinerarios.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro!</strong> Faltan campos por capturar.
    </div>
  </div>
</div>
`;

/**
 * @constant ERROR_FORMA_ALERT_CAMPOS
 * @type {string}
 * @description
 * Este mensaje de alerta informa al usuario sobre falta de campos por capturar en un formulario.
 */
export const ERROR_FORMA_ALERT_CAMPOS = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`;

/**
 * Pasos para trámites que requieren cuatro pasos.
 */
export const PASOS_CARGAR_ARCHIVOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Requisitos necesarios',
    activo: false,
    completado: false,
  },
  {
    indice: 3,
    titulo: 'Anexar requisitos',
    activo: false,
    completado: false,
  },
  {
    indice: 4,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * @constant FORM_ERROR_ALERT
 * @type {string}
 * @description
 * Mensaje de alerta que indica al usuario que debe verificar los campos que presentan errores en un formulario.
 */
export const FORM_ERROR_ALERT = 'Favor de verificar los campos que marcan error.';


/**
 * @constant
 * @description
 * HTML que representa los requisitos obligatorios para la documentación de vehículos y equipos.
 * 
 * @compo
 * Este string HTML contiene una lista ordenada con los elementos requeridos, incluyendo:
 * - Certificado legible del título o factura proforma con detalles técnicos del vehículo y equipos integrados.
 * - Fotografías o catálogo donde se aprecie el equipo, aditamento o dispositivo integrado en la unidad.
 */
export const REQUISITOS_OBLIGATORIOS_HTML = `
  <ol style="text-align: left;">
    <li>Certificado legible del título o de factura proforma, que contenga como mínimo marca, año modelo, modelo, número de serie y especificaciones técnicas del vehículo, así como las características técnicas y/o descripción del(los) equipo(s), aditamento(s) o dispositivo(s) integrado(s) al vehículo.</li>
    <li>Fotografías o catálogo en donde se deberá apreciar el equipo, aditamento o dispositivo integrado con que cuenta la unidad.</li>
  </ol>
`;