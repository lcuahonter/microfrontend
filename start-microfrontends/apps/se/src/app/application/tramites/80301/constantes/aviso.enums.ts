/** Arreglo que contiene los datos necesarios de la empresa para el formulario */
export const DATOS_EMPRESA = [
  /** Número del programa IMMEX, campo de solo lectura y obligatorio */
  {
    labelNombre: 'Número de programa IMMEX:',
    campo: 'numeroPrograma',
    class: 'col-md-12',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Año del programa IMMEX, solo lectura y obligatorio */
  {
    labelNombre: 'Año de programa IMMEX:',
    campo: 'anoPrograma',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Mes al que corresponde el aviso, obligatorio y con opciones de catálogo */
  {
    labelNombre: 'Mes al que corresponde el aviso:',
    campo: 'mesCorrespondeAviso',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
  /** Año al que corresponde el aviso, obligatorio y con opciones de catálogo */
  {
    labelNombre: 'Año al que corresponde el aviso:',
    campo: 'anoCorrespondeAviso',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
];

/** Arreglo con la configuración del campo para seleccionar tipo de carga */
export const CARGO_TIPO = [
  /** Campo para tipo de carga, con opciones tipo radio y datos externos */
  {
    labelNombre: 'Tipo de carga',
    campo: 'cargaTipo',
    required: true,
    radioOptions: [],
    radioSelectedValue: '',
    jsonDataFileName: 'tipo-cargo.json',
  },
];

/** Información de quien recibe la mercancía, solo lectura y obligatoria */
export const DATOS_QUIEN_RECIBE = [
  /** RFC del receptor */
  {
    labelNombre: 'RFC:',
    campo: 'rfc',
    class: 'col-md-12',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Número de programa IMMEX del receptor */
  {
    labelNombre: 'Número de programa IMMEX:',
    campo: 'numero_programa_qr',
    class: 'col-md-12',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Año del programa IMMEX del receptor */
  {
    labelNombre: 'Año de programa IMMEX:',
    campo: 'anoProgramaQr',
    class: 'col-md-12',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
];

/** Información del domicilio donde se recibe la mercancía */
export const DATOS_DOMICILIO_LUGAR = [
  /** Nombre comercial del lugar */
  {
    labelNombre: 'Nombre comercial:',
    campo: 'nombreComercial',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Entidad federativa */
  {
    labelNombre: 'Entidad federativa:',
    campo: 'entidadFederativa',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
  /** Alcaldía o municipio */
  {
    labelNombre: 'Alcaldía o Municipio:',
    campo: 'alcalida_municipio',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
  /** Colonia */
  {
    labelNombre: 'Colonia:',
    campo: 'colonias',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
  /** Calle del domicilio */
  {
    labelNombre: 'Calle:',
    campo: 'calles',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Número exterior del domicilio */
  {
    labelNombre: 'Número exterior:',
    campo: 'numeroExterior',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Número interior del domicilio */
  {
    labelNombre: 'Número interior:',
    campo: 'numeroInterior',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Código postal del domicilio */
  {
    labelNombre: 'Código postal:',
    campo: 'codigoPostal',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
];

/** Datos relacionados a la mercancía de submanufactura */
export const DATOS_MERCANCIA_SUBMANUFACTURA = [
  /** Fracción arancelaria */
  {
    labelNombre: 'Fracción arancelaria:',
    campo: 'fracArancelaria',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
  /** Número de identificación comercial (NICO) */
  {
    labelNombre: 'NICO:',
    campo: 'nico',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Unidad de medida */
  {
    labelNombre: 'Unidad de medida:',
    campo: 'unidadMedida',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  },
  /** Cantidad de mercancía */
  {
    labelNombre: 'Cantidad:',
    campo: 'cantidad',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Valor en dólares (USD) */
  {
    labelNombre: 'Valor USD:',
    campo: 'valorUsd',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
  /** Descripción de la mercancía */
  {
    labelNombre: 'Descripción de la mercancía:',
    campo: 'descripcionMercancia',
    class: 'col-md-4',
    tipo_input: 'text',
    disabled: true,
    validators: ['required'],
    placeholder: '',
  },
];

/** Textos informativos y mensajes para carga de archivos */
export const TEXTOS = {
  /** Instrucciones generales de carga de archivo */
  INSTRUCCIONES: `<p>- El archivo no debe exceder los 1000 registros. Para descargar plantilla del archivo de excel da click</p>`,

  /** Texto para botón de carga */
  CARGA_DE_ARCHIVOS: `Seleccionar archivo`,

  /** Texto cuando no hay archivos seleccionados */
  CARGA_DE_ARCHIVO_DE_TEXTO: `Sin archivos seleccionados`,

  /** Mensaje de confirmación de carga exitosa */
  CARGA_DE_ARCHIVO_DE_TEXTO_EXITOSO: `El formato del archivo es correcto. Se enviará un correo de notificación con el resultado.`,
};

/** Requisitos de documentos para el trámite */
export const TEXTO_REQUISITOS = {
  /** Título de requisitos obligatorios */
  REQUISITOS_OBLIGATORIOS: 'Requisitos obligatorios',

  /** Título de requisitos opcionales */
  REQUISITOS_OPCIONALES: 'Requisitos opcionales',

  /** Instrucciones sobre cómo manejar los requisitos opcionales */
  REQUISITOS_OPCIONALES_INSTRUCCIONES: `<h6>Instrucciones</h6>
  <p>- Algunos documentos podrían ser obligatorios según el caso</p>
  <p>- Si no necesitas algún documento, selecciónalo y elimínalo</p>
  <p>- Si necesitas anexar más de un documento del mismo tipo, selecciónalo y presiona "Agregar nuevo".</p>`,
};

/** Texto e instrucciones para adjuntar documentos */
export const TEXTO_ANEXAR_REQUISITOS = {
  /** Mensaje inicial para adjuntar nuevo documento */
  INIT_DOCUMENTO: `<p>- Para adjuntar un nuevo documento, selecciona la opción "--Adjuntar nuevo documento--" y presiona el botón "Adjuntar documentos"</p>`,

  /** Texto del botón para adjuntar documento */
  ADJUNTAR_DOCUMENTO: 'Adjuntar documentos',

  /** Instrucciones técnicas para los documentos a subir */
  ADJUNTAR_DOCUMENTO_INSTRUCCIONES: `
  <p>Para poder adjuntar el documento, debe cumplir las siguientes características:</p>
  <ul>Debe ser un archivo PDF sin formularios, objetos OLE incrustados, ni JavaScript.</ul>
  <ul>No debe contener páginas en blanco.</ul>
  `,
};
