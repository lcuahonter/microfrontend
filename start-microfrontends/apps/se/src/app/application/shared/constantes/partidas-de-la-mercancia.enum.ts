import { FraccionArancelariaProsec, PartidasDeLaMercanciaModelo } from '../models/partidas-de-la-mercancia.model'
  
  export const PARTIDASDELAMERCANCIA_TABLA = [
    {
      encabezado: 'Cantidad',
      clave: (ele: PartidasDeLaMercanciaModelo):string => ele.cantidad,
      orden: 1
    },
    {
      encabezado: 'Unidad de medida',
      clave: (ele: PartidasDeLaMercanciaModelo):string => ele.unidadDeMedida,
      orden: 2
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: PartidasDeLaMercanciaModelo):string => ele.fraccionFrancelaria,
      orden: 3
    },
    {
      encabezado: 'Descripción',
      clave: (ele: PartidasDeLaMercanciaModelo):string => ele.descripcion,
      orden: 4
    },
    {
      encabezado: 'Precio unitario USD',
      clave: (ele: PartidasDeLaMercanciaModelo):string => ele.precioUnitarioUSD,
      orden: 5
    },
    {
      encabezado: 'Total USD',
      clave: (ele: PartidasDeLaMercanciaModelo):string => ele.totalUSD,
      orden: 6
    }
  ]
  
  export const TEXTOS = {
  INSTRUCCIONES: `<h5 style="text-align: center;">El formato del archivo a cargar no es válido. Favor de verificar</h5>
 `
  }

  export const ALERTARCHIVOMSG = {
    INSTRUCCIONES: `<h5 style="text-align: center;">No se ha seleccionado ningún archivo</h5>
 `
  }

  /**
   * Lista de IDs de trámites que requieren la selección de partidas.
   * 
   */
  export const PARTIDAS_SELECCIONADAS_REQUIRED = [130105];

  /**
 * @const MENSAJES
 * @description Contiene los mensajes utilizados en el trámite de importación de material de investigación científica.
 * @property {string} MENSAJES_MERCANCIA_REQUERIDA - Mensaje mostrado cuando no se ha agregado ninguna mercancía.
 * @property {string} MENSAJES_FRACCION_ARANCELARIA_REQUERIDA - Mensaje mostrado cuando no se ha capturado una fracción arancelaria.
 */
export const MENSAJES = {
  MENSAJES_MERCANCIA_REQUERIDA:
    'Para continuar con el trámite, debes agregar por lo menos una mercancía.',
  MENSAJES_FRACCION_ARANCELARIA_REQUERIDA:
    'Debes capturar una fracción arancelaria en el campo de texto para que se realice la búsqueda y se carguen los datos del catálogo del componente de la lista desplegable.',
};

/*
  * Mensaje de alerta que se muestra cuando hay un error en el registro 
  * debido a que la mercancía ya ha sido registrada.
  */
export const FRACCIONES_ANARCIA_TABLA = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: FraccionArancelariaProsec): number | string => ele.fraccionArancelariaProsec,
    orden: 1,
  },
  {
    encabezado: "Descripción",
    clave: (ele: FraccionArancelariaProsec): string => ele.descripcionFraccionProsec,
    orden: 2,
  },
 
]