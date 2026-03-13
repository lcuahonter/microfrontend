export const PASOS = [
    {
      indice: 1,
      titulo: 'Capturar solicitud',
      activo: true,
      completado: true,
    },
    {
      indice: 2,
      titulo: 'Requisitos neccesarios',
      activo: false,
      completado: false,
    },
    {
      indice: 3,
      titulo: 'Firmar solicitud',
      activo: false,
      completado: false,
    }
];

export const OPCIONES_SOLICITUD_DE_RADIO = [
    {
        label: 'Prorroga',
        value: 'TISOL.P',
    }
];

export const OPCIONES_PRODUCTO_RADIO = [
    {
        label: 'Nuevo',
        value: 'CONDMER.N',
    },
    {
        label: 'Usado',
        value: 'CONDMER.U',
    }
];
