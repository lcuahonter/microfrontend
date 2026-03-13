export interface PagoDerechosFormState {
    claveReferencia: string;
    cadenaDependencia: string;
    estado: string;
    llavePago: string;
    fechaPago: string;
    importePago: string;
  }

export const FECHA_DE_PAGO = {
    labelNombre: 'Fecha de pago:',
    required: false,
    habilitado: true,
  };