import { DisponiblesTabla, SeleccionadasTabla } from "../models/validacion-posteriori.model";

/**
 * Constante que define los pasos del wizard en el trámite.
 * 
 * Esta constante contiene un array de objetos que representan los pasos del wizard,
 * incluyendo su índice, título, y estado (activo o completado).
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
  },
];

/**
 * Constante que define los textos utilizados en el trámite.
 * 
 * Esta constante contiene textos como instrucciones o mensajes que se muestran
 * en la interfaz del usuario.
 */
export const TEXTOS = {
  INSTRUCCIONES: `<h5>Aviso de privacidad simplificado</h5>
      <p class="text-left">El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p>
      <p class="mt-5 mb-3 text-muted">Aviso de privacidad integral</p>
      `,
};

/**
 * Texto de alerta para terceros.
 * 
 * Este texto se muestra como un mensaje de advertencia cuando no se han agregado mercancías al trámite.
 */
export const TERCEROS_TEXTO_DE_ALERTA = 'Para continuar con el trámite, debes agregar por lo menos una mercancía.';

/**
 * Configuración para la fecha inicial.
 * 
 * Define las propiedades de la fecha inicial, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAINICIAL = {
  labelNombre: 'Fecha inicio:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha final.
 * 
 * Define las propiedades de la fecha final, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAFINAL = {
  labelNombre: 'Fecha fin:',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha de factura.
 * 
 * Define las propiedades de la fecha de factura, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAFACTURA = {
  labelNombre: 'Fecha de factura*:',
  required: false,
  habilitado: true,
};

/** Constante que define las columnas seleccionadas en la tabla de mercancías.
 * 
 * Cada columna está representada por un objeto que contiene el encabezado,
 * una función para obtener el valor de la columna y el orden de la columna.
 */
export const COLUMNAS_SELECCIONADAS =[
     {
       encabezado: 'Fracción arancelaria',
       clave: (ele: SeleccionadasTabla):string => ele.fraccionArancelaria,
       orden: 1,
     },
     {
       encabezado: 'Cantidad',
       clave: (ele: SeleccionadasTabla):string => ele.cantidad,
       orden: 2,
     },
     {
       encabezado: 'Unidad de medida',
       clave: (ele: SeleccionadasTabla):string => ele.unidadMedida,
       orden: 3,
     },
     {
       encabezado: 'Valor mercancía',
       clave: (ele: SeleccionadasTabla):string => ele.valorMercancia,
       orden: 4,
     },
     {
       encabezado: 'Tipo de factura',
       clave: (ele: SeleccionadasTabla):string => ele.tipoFactura,
       orden: 5,
     },
     {
       encabezado: 'Número factura',
       clave: (ele: SeleccionadasTabla):string => ele.numFactura,
       orden: 6,
     },
     {
       encabezado: 'Complemento descripción',
       clave: (ele: SeleccionadasTabla):string => ele.complementoDescripcion,
       orden: 7,
     },
     {
       encabezado: 'Fecha factura',
       clave: (ele: SeleccionadasTabla):string => ele.fechaFactura,
       orden: 8,
     },
   ];

  
/** Constante que define las columnas disponibles en la tabla de mercancías.
 * 
 * Cada columna está representada por un objeto que contiene el encabezado,
 * una función para obtener el valor de la columna y el orden de la columna.
 */
  export const COLUMNAS_DISPONIBLES =[
       {
         encabezado: 'Fracción arancelaria',
         clave: (ele: DisponiblesTabla):string => ele.fraccionArancelaria,
         orden: 1,
       },
       {
         encabezado: 'Nombre técnico',
         clave: (ele: DisponiblesTabla):string => ele.nombreTecnico,
         orden: 2,
       },
       {
         encabezado: 'Nombre comercial',
         clave: (ele: DisponiblesTabla):string => ele.nombreComercial,
         orden: 3,
       },
       {
         encabezado: 'Número de registro de productos',
         clave: (ele: DisponiblesTabla):string => ele.numeroRegistroProductos,
         orden: 4,
       },
       {
         encabezado: 'Fecha expedición',
         clave: (ele: DisponiblesTabla):string => ele.fechaExpedicion,
         orden: 5,
       },
       {
         encabezado: 'Fecha vencimiento',
         clave: (ele: DisponiblesTabla):string => ele.fechaVencimiento,
         orden: 6,
       },
     ];

/**
 * Mensaje de alerta que se muestra cuando hay errores de validación en los formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <strong>¡Error de registro! </strong> Faltan campos por capturar
    </div>
  </div>
</div>
`;

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
  `<p>La Solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. Usted cuenta con 5 días naturales para firmar electrónicamente su solicitud y así poder obtener el certificado, de lo contrario ésta será cancelada.</p>`;
