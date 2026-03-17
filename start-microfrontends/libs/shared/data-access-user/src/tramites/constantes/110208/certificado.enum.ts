/**
 * Configuración para el campo "Fecha INICIO" en el trámite 110208.
 */
export const FECHA_INICIO_110208 = {
  labelNombre: 'Fecha inicio:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para el campo "Fecha final" en el trámite 110208.
 */
export const FECHA_FINAL_110208 = {
  labelNombre: 'Fecha final:',
  required: false,
  habilitado: true,
};

/**
 * Mensaje de alerta que indica que se debe agregar al menos una mercancía para continuar con el trámite.
 */
export const ALERTA_PARA = {
  inst: `
    <div class="text-center">
        Para continuar con el trámite, debes agregar por lo menos una mercancía.
    </div>
  `,
};

/**
 * Mensaje de alerta que indica que se debe agregar al menos una mercancía para continuar con el trámite.
 */
export const ALERTA_COM = {
  inst: `<h6 class="text-center">Aviso de privacidad simplificado</h6><p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><div class="row"><div class="col-md-12 text-center"><a href="#" target="_blank">Aviso de privacidad integral</a></div></div>`,
};

/**
 * Configuración para el campo "Fecha de factura" en el trámite 110208.
 */
export const FECHA_DE_FACTURA = {
  labelNombre: 'Fecha de factura',
  required: true,
  habilitado: true,
};

/**
 * Configuración de los campos y validaciones para el formulario modal de mercancía en el trámite 110208.
 */
export const MERCANCIA_MODAL_FORMA = [
  {
    id: 'fraccionArancelaria',
    labelNombre: 'Fracción arancelaria',
    campo: 'fraccionArancelaria',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 1
  },
  {
    id: 'nombreComercial',
    labelNombre: 'Nombre comercial de la mercancía(igual que en la factura)',
    campo: 'nombreComercial',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 1
  },
  {
    id: 'nombreTecnio',
    labelNombre: 'Nombre técnico',
    campo: 'nombreTecnio',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 2
  },
  {
    id: 'nombreEnIngles',
    labelNombre: 'Nombre en inglés',
    campo: 'nombreEnIngles',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 3
  },
  {
    id: 'criterioPara',
    labelNombre: 'Criterio para conferir origen',
    campo: 'criterioPara',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 3
  },
  {
    id: 'marca',
    labelNombre: 'Marca',
    campo: 'marca',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
     validadores: [
       { 
      tipo: 'pattern', 
      valor: /^[a-zA-Z0-9 ]{0,50}$/, 
      mensaje: 'La marca no puede ser mayor a 50 caracteres' 
    }
  ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 4
  },
  {
    id: 'cantidad',
    labelNombre: 'Cantidad',
    campo: 'cantidad',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 4
  },
  {
    id: 'umc',
    labelNombre: 'UMC',
    campo: 'umc',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    opciones: [],
    tooltipQuestionCircle: true,
    row: 5
  },
  {
    id: 'valorDeLaMercancia',
    labelNombre: 'Valor de la mercancía(dólares)',
    campo: 'valorDeLaMercancia',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 6
  },
  {
    id: 'complementoDescripcion',
    labelNombre: 'Complemento de la descripción',
    campo: 'complementoDescripcion',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
     validadores: [
       { 
      tipo: 'pattern', 
      valor: /^[a-zA-Z0-9 ]{0,200}$/, 
      mensaje: 'Por favor, no escribas más de 200 caracteres' 
    }
      ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 6
  },
  {
    id: 'nFactura',
    labelNombre: 'N° factura',
    campo: 'nFactura',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
      validadores: [
       { 
      tipo: 'pattern', 
      valor: /^[a-zA-Z0-9 ]{0,20}$/, 
      mensaje: 'Por favor, no escribas más de 20 caracteres' 
    }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 7
  },
  {
    id: 'tipoDeFactura',
    labelNombre: 'Tipo de factura',
    campo: 'tipoDeFactura',
    clase: 'col-md-4',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 7
  },
  {
    id: 'fechaDeFactura',
    labelNombre: 'Fecha de factura',
    campo: 'fechaDeFactura',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: false,
    soloLectura: false,
    validadores: [{tipo: 'required'}],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
    row: 8,
    habilitado:true
  },
];
