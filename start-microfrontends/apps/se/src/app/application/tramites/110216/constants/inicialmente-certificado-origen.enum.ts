import { DisponiblesTabla, HistoricoColumnas, SeleccionadasTabla } from "../models/certificado-origen.model";

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
  INSTRUCCIONES: `<h5 class="text-center">Aviso de privacidad simplificado</h5>
      <p class="text-center">El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p>
      <p class="mt-5 mb-3 text-muted text-center">Aviso de privacidad integral</p>
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
  labelNombre: 'Fecha inicio',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha final.
 * 
 * Define las propiedades de la fecha final, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAFINAL = {
  labelNombre: 'Fecha fin',
  required: false,
  habilitado: true,
};

/**
 * Configuración para la fecha de factura.
 * 
 * Define las propiedades de la fecha de factura, como el nombre de la etiqueta, si es requerida y si está habilitada.
 */
export const FECHAFACTURA = {
  labelNombre: 'Fecha de factura',
  required: true,
  habilitado: true,
};
/**
 * Configuración de encabezados para la tabla de mercancías disponibles.
 * 
 * Define los encabezados y claves utilizados para mostrar la información de las mercancías disponibles en la tabla.
 */
export const DISPONIBLES_ENCABEZADOS = [
  {
    /**
     * Encabezado para la fracción arancelaria.
     */
    encabezado: 'Fracción arancelaria',
    clave: (ele: DisponiblesTabla): string => ele.fraccionArancelaria,
    orden: 1,
  },
  {
    /**
     * Encabezado para el nombre técnico.
     */
    encabezado: 'Nombre técnico',
    clave: (ele: DisponiblesTabla): string => ele.nombreTecnico,
    orden: 2,
  },
  {
    /**
     * Encabezado para el nombre comercial.
     */
    encabezado: 'Nombre comercial',
    clave: (ele: DisponiblesTabla): string => ele.nombreComercial,
    orden: 3,
  },
  {
    /**
     * Encabezado para el número de registro de productos.
     */
    encabezado: 'Número de registro de productos',
    clave: (ele: DisponiblesTabla): string => ele.numeroRegistroProductos,
    orden: 4,
  },
  {
    /**
     * Encabezado para la fecha de expedición.
     */
    encabezado: 'Fecha expedición',
    clave: (ele: DisponiblesTabla): string => ele.fechaExpedicion,
    orden: 5,
  },
  {
    /**
     * Encabezado para la fecha de vencimiento.
     */
    encabezado: 'Fecha vencimiento',
    clave: (ele: DisponiblesTabla): string => ele.fechaVencimiento,
    orden: 6,
  },
];

/**
 * Configuración de encabezados para la tabla de mercancías seleccionadas.
 * 
 * Define los encabezados y claves utilizados para mostrar la información de las mercancías seleccionadas en la tabla.
 */
export const SELECCIONADAS_ENCABEZADOS = [
  {
    /**
     * Encabezado para la fracción arancelaria.
     */
    encabezado: 'Fracción arancelaria',
    clave: (ele: SeleccionadasTabla): string => ele.fraccionArancelaria,
    orden: 1,
  },
  {
    /**
     * Encabezado para la cantidad.
     */
    encabezado: 'Cantidad',
    clave: (ele: SeleccionadasTabla): string => ele.cantidad,
    orden: 2,
  },
  {
    /**
     * Encabezado para la unidad de medida.
     */
    encabezado: 'Unidad de medida',
    clave: (ele: SeleccionadasTabla): string => ele.unidadMedida,
    orden: 3,
  },
  {
    /**
     * Encabezado para el valor de la mercancía.
     */
    encabezado: 'Valor mercancía',
    clave: (ele: SeleccionadasTabla): string => ele.valorMercancia,
    orden: 4,
  },
  {
    /**
     * Encabezado para el tipo de factura.
     */
    encabezado: 'Tipo de factura',
    clave: (ele: SeleccionadasTabla): string => ele.tipoFactura,
    orden: 5,
  },
  {
    /**
     * Encabezado para el número de factura.
     */
    encabezado: 'Número factura',
    clave: (ele: SeleccionadasTabla): string => ele.numFactura,
    orden: 6,
  },
  {
    /**
     * Encabezado para el complemento de descripción.
     */
    encabezado: 'Complemento descripción',
    clave: (ele: SeleccionadasTabla): string => ele.complementoDescripcion,
    orden: 7,
  },
  {
    /**
     * Encabezado para la fecha de factura.
     */
    encabezado: 'Fecha factura',
    clave: (ele: SeleccionadasTabla): string => ele.fechaFactura,
    orden: 8,
  },
];

/**
 * Configuración de columnas para la tabla de productores históricos.
 * 
 * Define los encabezados y claves utilizados para mostrar la información de los productores históricos en la tabla.
 */
export const TABLE_COLUMNS = [
  {
    /**
     * Encabezado para el nombre del productor.
     */
    encabezado: 'Nombre del productor',
    clave: (elementos: HistoricoColumnas): string => elementos.nombreProductor,
    orden: 1,
  },
  {
    /**
     * Encabezado para el número de registro fiscal.
     */
    encabezado: 'Número de registro fiscal',
    clave: (elementos: HistoricoColumnas): string => elementos.numeroRegistroFiscal,
    orden: 2,
  },
  {
    /**
     * Encabezado para la dirección.
     */
    encabezado: 'Dirección',
    clave: (elementos: HistoricoColumnas): string => elementos.direccion,
    orden: 3,
  },
  {
    /**
     * Encabezado para el correo electrónico.
     */
    encabezado: 'Correo Electrónico',
    clave: (elementos: HistoricoColumnas): string => elementos.correoElectronico,
    orden: 4,
  },
  {
    /**
     * Encabezado para el teléfono.
     */
    encabezado: 'Teléfono',
    clave: (elementos: HistoricoColumnas): string => elementos.telefono,
    orden: 5,
  },
  {
    /**
     * Encabezado para el fax.
     */
    encabezado: 'Fax',
    clave: (elementos: HistoricoColumnas): string => elementos.fax,
    orden: 6,
  },
];

/**
 * @constant IDPROCEDIMIENTO
 * @description
 * Identificador numérico del procedimiento actual para el trámite 110204.
 * Se utiliza para configurar y asociar el proceso en los componentes y servicios relacionados.
 */
export const IDPROCEDIMIENTO = 110216;
