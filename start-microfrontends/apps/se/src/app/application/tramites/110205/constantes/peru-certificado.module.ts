/**
 * @descripcion
 * Constante que define los pasos del proceso de solicitud en el módulo CAM.
 */
export const PASOS = [
  {
    /**
     * @descripcion
     * Índice del paso en el proceso.
     */
    indice: 1,

    /**
     * @descripcion
     * Título descriptivo del paso.
     */
    titulo: 'Capturar solicitud',

    /**
     * @descripcion
     * Indica si el paso está activo.
     */
    activo: true,

    /**
     * @descripcion
     * Indica si el paso ha sido completado.
     */
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
 * @descripcion
 * Constante que define las propiedades de la fecha de pago en el formulario.
 */
export const FECHA = {
  /**
   * @descripcion
   * Etiqueta asociada al campo de fecha.
   */
  labelNombre: 'Fecha de factura',

  /**
   * @descripcion
   * Indica si el campo de fecha es obligatorio.
   */
  required: true,

  /**
   * @descripcion
   * Indica si el campo de fecha está habilitado.
   */
  habilitado: true,
};

export const IS_FORM_VALID =`<div class="d-flex justify-content-center text-center">
<div>
  <div class="col-md-12"><strong>¡Error de registro! </strong> Faltan campos por capturar
  </div>
</div>
</div>
`;

export const FORM_ERROR_ALERT_CANT_VAL = `<div class="d-flex justify-content-center text-center">
<div>
  <div class="col-md-12">
    La cantidad a exportar debe ser mayor a cero.El valor de la mercancía debe ser mayor a cero

  </div>
</div>
</div>
`;
export const FORM_ERROR_ALERT_VALORES =`<div class="d-flex justify-content-center text-center">
<div>
  <div class="col-md-12">
   El valor de la mercancía debe ser mayor a cero
  </div>
</div>
</div>
`
export const FORM_ERROR_ALERT_CANTIDAD=`<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      El campo cantidad no puede ser cero.
    </div>
  </div>
</div>`