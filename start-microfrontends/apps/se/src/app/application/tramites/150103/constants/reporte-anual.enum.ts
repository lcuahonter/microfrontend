/**
 * Array que define los pasos del proceso para el reporte anual.
 * Cada objeto en el array representa un paso con su índice, título, y estado actual.
 * Los pasos pueden estar activos o completados.
 */
export const REPORTE_ANUAL_PASOS = [
  {
    /**
     * Identificador numérico único del paso en el proceso.
     */
    indice: 1,

    /**
     * Título descriptivo que representa la acción o etapa del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * Indica si el paso está activo actualmente (true) o no (false).
     */
    activo: true,

    /**
     * Indica si el paso ha sido completado (true) o está pendiente (false).
     */
    completado: false,
  },
  {
    /**
     * Identificador numérico único del paso en el proceso.
     */
    indice: 2,

    /**
     * Título descriptivo que representa la acción o etapa del paso.
     */
    titulo: 'Firmar solicitud',

    /**
     * Indica si el paso está activo actualmente (true) o no (false).
     */
    activo: false,

    /**
     * Indica si el paso ha sido completado (true) o está pendiente (false).
     */      
    completado: false,
  },
];

/**
 * Mensaje de validación cuando las ventas totales son menores que cero.
 */
export const VENTAS_TOTALES_MENSAJES =
  "Ventas totales deben ser mayores o iguales a cero.";

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
