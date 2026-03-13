/**
 * Constante que contiene los mensajes de alerta y advertencia utilizados en la solicitud.
 * @property ALERTA Mensaje que indica que al dar doble clic en una solicitud se copiarán sus datos.
 * @property ADVERTENCIA Mensaje de advertencia sobre la captura de localidad y colonia.
 */
export const ALERT = {
    ALERTA: `Al dar doble-clic en una Solicitud, se copiarán sus datos en esta Solicitud.`,
    ADVERTENCIA: `<b>¡Precaución!</b> Debes capturar localidad y colonia`
}

/**
 * Arreglo de opciones para los botones de radio en la solicitud.
 * Cada objeto representa una opción con su etiqueta y valor correspondiente.
 * @property label Etiqueta que se muestra al usuario.
 * @property value Valor asociado a la opción.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
    {
      label: "Prórroga",
      value: '0',
    },
    {
      label: "Modificación",
      value: '1',
    },
    {
      label: "Modificación y prórroga",
      value: '2'
    }
];