/**
 * Constante que representa la acción de continuar.
 * Se utiliza para indicar la continuación de un proceso o flujo.
 */
export const CONTINUAR: string = "t";

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
    <div class="col-md-12">
      <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`