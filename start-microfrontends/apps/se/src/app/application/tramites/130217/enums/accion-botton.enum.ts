export interface AccionBoton {
    accion: string;
    valor: number;
  }

/**
 * Plantilla HTML utilizada para mostrar un mensaje de error en el formulario
 * cuando existen campos obligatorios sin capturar.
 */
export const FORM_ERROR_ALERT = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
     <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`;

/**
 * Opciones de opiniones para la solicitud.
 */
export const OPINIONES_SOLICITUD = [{
    /** Etiqueta para la opción "Inicial" */
    label: 'Inicial', value: 'TISOL.I'
}];

/**
 * Opciones de productos para la solicitud.
 * Cada opción incluye una etiqueta y un valor asociado.
 * 
 */ 
export const PRODUCTO_OPCION = [
    {
        /** Etiqueta para la opción "Nuevo" */
        label: 'Nuevo',
        /** Valor asociado a la opción "Nuevo" */
        value: 'CONDMER.N'
    },
    {
        /** Etiqueta para la opción "Usado" */
        label: 'Usado',
        /** Valor asociado a la opción "Usado" */
        value: 'CONDMER.U'
    }
];

/**
 * ID del procedimiento para la importación de vehículos usados por donación.
 * @constant {number}
 */
export const ID_PROCEDIMIENTO : number = 130217; 
