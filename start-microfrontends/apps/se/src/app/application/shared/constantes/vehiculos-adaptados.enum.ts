export interface AccionBoton {
  accion: string;
  valor: number;
}
export interface ProductoOpción {
  label: string;
  value: string;
}

export interface ProductoResponse {
  options: ProductoOpción[];
  defaultSelect: string;
}
export interface Pais {
  id: number;
  descripcion: string;
}

/**
 * Datos de los campos de entrada del formulario.
 * @type {Array<{label: string, placeholder: string, required: boolean, controlName: string}>} 
 * Arreglo que contiene los datos de los campos del formulario de mercancía.
 */
export const DATOS_INPUT_FIELDS = [
    {
      label: 'Régimen al que se destinará la mercancía',
      placeholder: 'Selecciona un valor',
      required: true,
      controlName: 'regimen',
    },
    {
      label: 'Clasificación del régimen',
      placeholder: 'Selecciona un valor',
      required: true,
      controlName: 'clasificacion',
    },
  ];
  
