/**
 * Interface para los datos de materia prima basada exactamente en el JSON
 * administrar-residuos-mesa.json
 */
export interface MateriaPrima {
  id?: number;
  /**
   * Nombre materia prima
   */
  nombreMateriaPrima: string;

  /**
   * Cantidad
   */
  cantidad: number | string;

  /**
   * Cantidad letra
   */
  cantidadLetra: string;

  /**
   * Unidad de medida
   */
  unidadMedida: string;

  /**
   * Fraccion
   */
  fraccionArancelaria: string;

  /**
   * unidadMedidaDescripcion
   */
  unidadMedidaDescripcion: string;
}

export interface MateriaPrima231001 {
  id?: number;
  descripcionMercancia: string;
  generica2: string; //cantidad
  cantidadEnLetra: string;
  unidadMedidaComercialClave: string;
  descUnidadMedida: string;
  generica1: string; //clave fraccion
  descFraccion: string;
  capituloFraccion: string;
  clavePartida: string;
  claveSubPartida: string;
}

export interface DetalleSolicitudT231001 {
  rfc_solicitante: string;
  descripcion_generica_1: string;
  id_solicitud: number;
  aduana_solicitud: {
    cve_aduana: string;
  };
  mercancias: MercanciaDetalle231001[];
  numero_registro_ambiental: string;
  numero_programa_immex: string;
}

export interface MercanciaDetalle231001 {
  descripcion_mercancia: string;
  cantidad: number;
  cantidad_en_letra: string;
  cve_unidad_medida_comercial: number;
  desc_unidad_medida_comercial: string;
  cve_fraccion: string;
  desc_fraccion: string;
  cve_partida: string;
  generica2: string;
}

/**
 * Columnas configuradas para la tabla que muestra información de materia prima.
 */
export const MATERIA_PRIMA_TABLA = [
  {
    encabezado: 'Nombre materia prima',
    clave: (ele: MateriaPrima231001): string => ele.descripcionMercancia,
    orden: 1,
  },
  {
    encabezado: 'Cantidad',
    clave: (ele: MateriaPrima231001): string => ele.generica2.toString(),
    orden: 2,
  },
  {
    encabezado: 'Cantidad letra',
    clave: (ele: MateriaPrima231001): string => ele.cantidadEnLetra,
    orden: 3,
  },
  {
    encabezado: 'Unidad de medida',
    clave: (ele: MateriaPrima231001): string => ele.descUnidadMedida,
    orden: 4,
  },
  {
    encabezado: 'Fracción',
    clave: (ele: MateriaPrima231001): string => ele.descFraccion,
    orden: 5,
  },
];

/**
 * Constante que contiene el aviso de privacidad simplificado utilizado en la Ventanilla Digital Mexicana de Comercio Exterior (VUCE).
 *
 * @constant
 * @property {string} Aviso - Texto en formato HTML que describe el aviso de privacidad simplificado.
 * Este aviso informa sobre el tratamiento de los datos personales recabados por el Servicio de Administración Tributaria (SAT),
 * su uso, transferencia a autoridades competentes y su protección conforme a la legislación aplicable.
 */
export const AVISO = {
  Aviso: `<p style="text-align: center; font-weight: bold;">Aviso de privacidad simplificado</p>
      <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal. </p>
      <br>
      <div class="row"><div class="col-md-12 text-center"><a href="">Aviso de privacidad integral</a></div>`,
};
