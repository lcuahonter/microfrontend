export const OCTA_TEMPO = [
    {
        indice: 1,
        titulo: 'Capturar solicitud',
        activo: true,
        completado: false,
      },
      {
        indice: 2,
        titulo: 'Firmar solicitud',
        activo: false,
        completado: false,
      }

]
export interface ProductoOption {
  label: string;
  value: string;
}
export interface ProductoResponse {
  options: ProductoOption[];
  defaultSelect: string;
}