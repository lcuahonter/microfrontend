/**
 * Configuración para el campo de fecha.
 */
export const FECHA = {
    /**
     * Etiqueta para el nombre del campo de fecha.
     */
    labelNombre: 'Fecha de pago',
  
    /**
     * Indica si el campo de fecha es obligatorio.
     */
    required: false,
  
    /**
     * Indica si el campo de fecha está habilitado.
     */
    habilitado: true,
  };

/**
 * Configuración para el campo de clave de referencia.
 */
  export const DEBES_CAPTURAR =
  {
    /**
     * Contenido del mensaje de alerta que se mostrará al usuario.
     */
    CONTENIDO: `
      <div class="text-center">
        <p><strong>¡Precaución!</strong> Debes capturar todos los campos de pago de derechos</p>
      </div>
    `,
  } 

/**
 * Mensaje de validación que solicita confirmación al usuario
 * sobre la ausencia de datos relacionados con el pago de derechos. 
 */
export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';
