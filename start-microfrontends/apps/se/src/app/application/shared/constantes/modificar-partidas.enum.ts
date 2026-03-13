import { FraccionArancelariaProsec } from '../models/partidas-de-la-mercancia.model'
import { ModificarPartidasModelo } from '../models/modificar-partidas.model';
import { TablaCampoSeleccion } from '@libs/shared/data-access-user/src';
  
/**
 * @const PARTIDASDELAMERCANCIA_TABLA
 * @description Configuración de las columnas para la tabla de partidas de la mercancía.
 */
  export const PARTIDASDELAMERCANCIA_TABLA = [
    {
      encabezado: 'Modificar',
      clave: (ele: ModificarPartidasModelo):string => ele.idSolicitud ?? '',
      orden: 1,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.RADIOBUTTON
    },
    {
      encabezado: 'Cantidad solicitada',
      clave: (ele: ModificarPartidasModelo):number => ele.unidadesSolicitadas ?? 0,
      orden: 2,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.NONE
    },
    {
      encabezado: 'Cantidad autorizada',
      clave: (ele: ModificarPartidasModelo):number => ele.unidadesAutorizadas ?? 0,
      orden: 3,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.NONE
    },
    {
      encabezado: 'Descripción solicitada',
      clave: (ele: ModificarPartidasModelo):string => ele.descripcionSolicitada ?? '',
      orden: 4,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.NONE
    },
    {
      encabezado: 'Descripción autorizada',
      clave: (ele: ModificarPartidasModelo):string => ele.descripcionAutorizada ?? '',
      orden: 5,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.NONE
    },
    {
      encabezado: 'Importe Unitario',
      clave: (ele: ModificarPartidasModelo):number => ele.importeUnitarioUSDAutorizado ?? 0,
      orden: 6,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.NONE
    },
    {
      encabezado: 'Importe Total USD',
      clave: (ele: ModificarPartidasModelo):number => ele.importeTotalUSDAutorizado ?? 0,
      orden: 7,
      llave:'',
      opcionDeEntrada: TablaCampoSeleccion.NONE
    }
  ]
  
  /**
   * @const TEXTOS
   * @description Textos utilizados en la validación de archivos para la modificación de partidas.
   */
  export const TEXTOS = {
  INSTRUCCIONES: `<h5 style="text-align: center;">El formato del archivo a cargar no es válido. Favor de verificar</h5>
 `
  }

  /**
   * @const ALERTARCHIVOMSG
   * @description Mensajes de alerta relacionados con la carga de archivos.
   */
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