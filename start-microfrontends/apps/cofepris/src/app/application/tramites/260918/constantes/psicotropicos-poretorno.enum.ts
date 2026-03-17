export const MENSAJE_DE_VALIDACION_PAGO_DERECHOS = '<div>¿Está seguro que su solicitud no requiere los datos del Pago de derechos?</div>';

export const MENSAJE_DE_VALIDACION = '<div><b>¡Error de registro!</b> Faltan campos por capturar.</div>';

 export const TITULOMENSAJE =
  'Modificación al permiso sanitario de importación de dispositivos médicos destinados a pruebas de laboratorio';
  

   export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
    `<p style="text-align: center;">
      La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
      Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
      Un folio oficial le será asignado al momento en que ésta sea firmada.
    </p>`;