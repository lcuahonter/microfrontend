/**
 * Mensaje de validación que indica que las ventas totales no pueden ser menores a cero
 * y que el campo es obligatorio.
 */
export const MENSAJES_VENTAS_TOTALES = '(Ventas totales deben ser mayores o iguales a cero.) es un campo requerido';

/**
 * Mensaje de validación que indica que el total de exportaciones no puede ser menor a cero
 * y que el campo es obligatorio.
 */
export const MENSAJES_EXPORTACIONES_TOTALS = '(Total exportaciones deben ser mayores o iguales a cero.) es un campo requerido';

/**
 * Contenido HTML para el aviso de privacidad simplificado.
 */
export const PAGO_DE_DERECHOS = {
  ADJUNTAR: `<h5 class="text-center">Aviso de privacidad simplificado</h5>
  <p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><div class="row"><div class="col-md-12 text-center mt-5 mb-3"><a href="https://www.ventanillaunica.gob.mx/vucem/estadisticas/Aviso_Privacidad_Integral.pdf" target="_blank">Aviso de privacidad integral</a></div></div>`
};

/**
 * Mensaje de validación cuando las ventas totales son menores que el total de exportaciones.
 */
export const VALIDATORS_MENSAJES =
  "Las Ventas Totales deben ser mayores o iguales al Total de Exportaciones.";

/**
 * Mensaje de validación cuando las ventas totales son menores que cero.
 */
export const VENTAS_TOTALES_MENSAJES =
  "Ventas totales deben ser mayores o iguales a cero.";

/**
 * Mensaje de validación cuando el total de exportaciones es menor que cero.
 */
export const TOTAL_EXPORTACIONES_MENSAJES =
  "Total exportaciones deben ser mayores o iguales a cero.";
