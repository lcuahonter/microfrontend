/**
 * Constante que contiene los mensajes de advertencia y manifestación utilizados en el domicilio del establecimiento.
 * @property ADVERTENCIA Mensaje de advertencia sobre la captura de localidad y colonia.
 * @property MANIFESTS Mensaje de manifestación de cumplimiento de requisitos y normatividad.
 */
export const ALERT = {
  ADVERTENCIA: `<b>¡Precaución!</b> Debes capturar localidad y colonia`,
  MANIFESTS: `Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Asimismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.`,
};


/**
 * Identificador único del procedimiento correspondiente a la solicitud actual.
 * 
 * @remarks
 * Este valor se utiliza para asociar el trámite con el procedimiento específico en el sistema.
 */
 export const ID_PROCEDIMIENTO = 260911;
/**
 * Arreglo de opciones para los botones de radio en el domicilio del establecimiento.
 * Cada objeto representa una opción con su etiqueta y valor correspondiente.
 * @property label Etiqueta que se muestra al usuario.
 * @property value Valor asociado a la opción.
 */
export const OPCIONES_DE_BOTON_DE_RADIO = [
  {
      label: 'No',
      value: '0',
  },
  {
      label: 'Si',
      value: '1',
  }
];