/**
 * Interfaz que define los campos del acuse de valor.
 * @interface DatosAcuseDeValor
 */

export interface DatosAcuseDeValor {
  acuseDeValorCove: string;
  metodoValoracionAduanera: string;
  numeroFactura: string;
  fechaExpedicion: string;
  emisorOriginal: string;
  destinatario: string;
}

/**
 * Interfaz que define una opción para un control de selección tipo radio button.
 * @interface RadioOpcion
 * @property {string} label - Etiqueta visible para el usuario.
 * @property {string} value - Valor interno asignado a la opción seleccionada.
 */
export interface RadioOpcion {
    /**
     * Etiqueta visible para el usuario.
     */
    label: string;
    /**
     * Valor interno asignado a la opción seleccionada.
     */
    value: string;
}