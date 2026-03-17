import { PartidasDeLaMercanciaModelo } from '../models/partidas-de-la-mercancia.model'
  
  export const PARTIDASDELAMERCANCIA_TABLA = [
    {
      encabezado: 'Cantidad',
      clave: (ele: PartidasDeLaMercanciaModelo): number => Number(ele.cantidad),
      orden: 1
    },
    {
      encabezado: 'Unidad de medida',
      clave: (ele: PartidasDeLaMercanciaModelo): string => ele.unidadDeMedida,
      orden: 2
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: PartidasDeLaMercanciaModelo): string => ele.fraccionFrancelaria,
      orden: 3
    },
    {
      encabezado: 'Descripción',
      clave: (ele: PartidasDeLaMercanciaModelo): string => ele.descripcion,
      orden: 4
    },
    {
      encabezado: 'Precio unitario USD',
      clave: (ele: PartidasDeLaMercanciaModelo): number => Number(ele.precioUnitarioUSD),
      orden: 5
    },
    {
      encabezado: 'Total USD',
      clave: (ele: PartidasDeLaMercanciaModelo): number => Number(ele.totalUSD),
      orden: 6
    }
  ]
  
  export const VALORES_SELECCIONADOS = [130201]