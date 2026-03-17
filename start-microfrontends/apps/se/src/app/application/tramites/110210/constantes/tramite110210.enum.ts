/**
 * @constant ERROR_FORMA_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">Corrija los siguientes errores:</div>
    <div class="col-md-12 text-danger">
      <b>Debe agregar (Al menos un certificado para duplicarse)</b>
    </div>
  </div>
</div>
`
/**
 * @constant ERROR_CATALOGO_ALERT
 * @description
 * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el catálogo.
 * Se utiliza para informar al usuario que debe completar todos los campos requeridos antes de continuar.
 */
export const ERROR_CATALOGO_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">Corrija los siguientes errores:</div>
    <div class="col-md-12 text-danger">
      <b>No se encontraron certificados de origen</b>
    </div>
  </div>
</div>
`