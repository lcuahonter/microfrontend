export const PANTA_PASOS = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: false,
  },
  {
      indice: 2,
      titulo: 'Anexar requisitos',
      activo: false,
      completado: false,
  },
  {
      indice: 3,
      titulo: 'Firmar solicitud',
      activo: false,
      completado: false,
  },
];

export const INPUT_FECHA_CONFIG = {
  labelNombre: 'Fecha de pago',
  required: true,
  habilitado: true,
};

export const MENSAJE_DE_ALERTA: string =
  "Cumplo con los requisitos y normatividad aplicable, sin que me eximan de que la autoridad sanitaria verifique su cumplimiento, esto sin perjuicio de las sanciones en que puedo incurrir por falsedad de declaraciones dadas a una autoridad. Así mismo acepto que la notificación de este trámite, sea a través de la Ventanilla Única de Comercio Exterior por los mecanismos de la misma.";

export const LOCALIDAD_COLONIA = {
  mensaje: `<p>¡Precaución! Debes capturar localidad y colonia</p>`,
}

export const FECHA_DE_PAGO = {
  labelNombre: 'Fecha de caducidad',
  required: false,
  habilitado: true,
};

export const TITULO_PASO_UNO = 'Solicitud de modificación y/o prórroga del permiso previo de importación de productos';
export const TITULO_PASO_DOS = 'Cargar archivos';
export const TITULO_PASO_TRES = 'Firmar';