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
  
  /**
   * Datos de los campos de entrada para la mercancía.
   * @type {Array<{label: string, placeholder: string, required: boolean, controlName: string}>} 
   * Arreglo que contiene los datos de los campos que serán utilizados en el formulario de mercancía.
   */
  export const MERCANCIA_INPUT_VALUES = [
    {
      label: 'Fracción arancelaria',
      placeholder: 'Selecciona un valor',
      required: true,
      controlName: 'fraccion',
    },
    {
      label: 'Unidad de medida de la tarifa (UMT)',
      placeholder: 'Selecciona un valor',
      required: true,
      controlName: 'umt',
    },
    {
      label: 'NICO',
      placeholder: 'Selecciona un valor',
      required: true,
      controlName: 'nico',
    },
  ];
  