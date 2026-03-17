/**
 * Constante que define los pasos del reporte anual.
 */
export const REPORTE_ANUAL_PASOS = [
  {
    /**
     * Índice del paso.
     */
    indice: 1,
    /**
     * Título del paso.
     */
    titulo: 'Capturar solicitud',
    /**
     * Indica si el paso está activo.
     */
    activo: true,
    /**
     * Indica si el paso está completado.
     */
    completado: false,
  },
  {
    /**
     * Índice del paso.
     */
    indice: 2,
    /**
     * Título del paso.
     */
    titulo: 'Firmar solicitud',
    /**
     * Indica si el paso está activo.
     */
    activo: false,
    /**
     * Indica si el paso está completado.
     */
    completado: false,
  }
];


/**
 * Mensaje de alerta que se muestra cuando hay errores de validación en los formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">(Total exportaciones deben ser mayores o iguales a cero.) es un campo requerido</span>
    </div>

    <div class="d-flex justify-content-start">
      <span class="me-2">2.</span>
      <span class="flex-grow-1 text-center">(Ventas totales deben ser mayores o iguales a cero.) es un campo requerido</span>
    </div>
  </div>
</div>


`;
/**
 * Mensaje de alerta que se muestra cuando hay errores de validación en los formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT_DOS = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">(Ventas totales deben ser mayores o iguales a cero.) es un campo requerido</span>
    </div>

  </div>
</div>

`;
/**
 * Mensaje de alerta que se muestra cuando hay errores de validación en los formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT_TRES= `

<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">(Las Ventas Totales deben ser mayores o iguales al Total de Exportaciones.) es un campo requerido
    </span>
    </div>

  </div>
</div>

`;
/**
 * Mensaje de alerta que se muestra cuando hay errores de validación en los formularios.
 * 
 * Este mensaje se utiliza para informar al usuario que faltan campos por capturar
 * antes de poder continuar al siguiente paso del trámite.
 */
export const ERROR_FORMA_ALERT_QUAD= `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">(Total exportaciones deben ser mayores o iguales a cero.) es un campo requerido </span>
    </div>

  </div>
</div>

`;

/**
 * Mensaje de validación cuando las ventas totales son menores que cero.
 */
export const VENTAS_TOTALES_MENSAJES =
  "Ventas totales deben ser mayores o iguales a cero.";


  /**
 * Mensaje de alerta que indica que se debe agregar al menos una mercancía para continuar con el trámite.
 */
export const ALERTA_COM = {
  inst: `<h6 class="text-center">Aviso de privacidad simplificado</h6><p>El Servicio de Administración Tributaria (SAT), es el sujeto obligado y responsable del tratamiento de los datos personales que se recaban a través de la Ventanilla Digital Mexicana de Comercio Exterior (VUCEM), los datos personales podrán ser utilizados y transferidos a la autoridades competentes, con la finalidad de llevar a cabo cualquier trámite relacionado con importaciones, exportaciones y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias que, conforme a la legislación aplicable, sea exigido por las autoridades competentes en materia de comercio exterior y/o consultar información sobre los procedimientos para la importación, exportación y tránsito de mercancías de comercio exterior, incluyendo las regulaciones y restricciones no arancelarias, así como las notificaciones que se deriven de dichos trámites y serán protegidos, incorporados y tratados en el sistema de datos personales de la VUCEM, asimismo podrán ser transmitidos a las autoridades competentes establecidas en el Decreto por el que se establece la Ventanilla Digital Mexicana de Comercio Exterior, publicado en el Diario Oficial de la Federación el 14 de enero de 2011, así como al propio titular de la información. El titular, en su caso, podrá manifestar su negativa para el tratamiento de sus datos personales para finalidades y transferencias de los mismos que requieran el consentimiento del titular. Si desea conocer nuestro aviso de privacidad integral, lo podrá consultar en el portal.</p><div class="row"><div class="col-md-12 text-center"><a href="#" target="_blank">Aviso de privacidad integral</a></div></div>`,
};
