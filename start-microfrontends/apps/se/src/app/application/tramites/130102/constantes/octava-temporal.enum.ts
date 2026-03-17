import { FraccionesProsecRequest, PartidaMercancia } from "../models/request/regla-octava-request.model";
import { FraccionArancelariaProsec } from "../models/octava-temporal.model";

/**
 * Mensaje de alerta que se muestra cuando hay un error en el registro 
 * debido a que faltan campos obligatorios por capturar.
 */
export const ERROR_DE_REGISTRO_ALERT =
`<div class="d-flex justify-content-center">
    <strong>¡Error de registro!</strong> Faltan campos por capturar.
</div>`;

/*
  * Mensaje de alerta que se muestra cuando hay un error en el registro 
  * debido a que la mercancía ya ha sido registrada.
  * export interface PartidaMercancia {
    cantidad: number;
    descripcion: string;
    valor_autorizado: number;
    cve_fraccion: string;
    importe_Unitario: number
    importe_partida_total_usd: number;
}
  */
export const MERCANCIA_TABLA = [
  {
    encabezado: 'Cantidad',
    clave: (ele: PartidaMercancia): number => ele.cantidadPartidas,
    orden: 1,
  },
  {
    encabezado:  "Fracción arancelaria",
    clave: (ele: PartidaMercancia): string => ele.cve_fraccion,
    orden: 2,
  },
  {
    encabezado: "Descripción",
    clave: (ele: PartidaMercancia): string => ele.descripcion,
    orden: 3,
  },
  {
    encabezado: "Precio unitario USD",
    clave: (ele: PartidaMercancia): number => ele.importe_Unitario,
    orden: 4,
  },
  {
    encabezado:   "Total USD",
    clave: (ele: PartidaMercancia): number => ele.importe_partida_total_usd,
    orden: 5,
  }
];
/*
  * Mensaje de alerta que se muestra cuando hay un error en el registro 
  * debido a que la mercancía ya ha sido registrada.
  */
export const FRACCIONES_ANARCIA_TABLA = [
  {
    encabezado: 'Fracción arancelaria',
    clave: (ele: FraccionesProsecRequest): number | string => ele.clave,
    orden: 1,
  },
  {
    encabezado: "Descripción",
    clave: (ele: FraccionesProsecRequest): string => ele.fraccion,
    orden: 2,
  },
 
]

/*
* @constant MODIFICAR_PARTIDAS_FORM
*/
export const MODIFICAR_PARTIDAS_FORM = [
  {
    id: 'cantidad_partidas',
    labelNombre: 'Cantidad',
    campo: 'modificar_cantidad',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    marginTop: 0,
  },
   {
    id: 'descripcion_partidas',
    labelNombre: 'Descripción',
    campo: 'modificar_descripcion',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required',
        mensaje: '',
      },
    ],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'valor_partidas_usd',
    labelNombre: 'Valor partida USD',
    campo: 'valor_partidas_usd',
    clase: 'col-md-4',
    tipoInput: 'number',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: 'required' }],
    marcadorDePosicion: '',
    marginTop: 0,
  },
  {
    id: 'fraccion_partidas',
    labelNombre: 'Fracción arancelaria TIGIE',
    campo: 'fraccion_partidas',
    clase: 'col-md-8',
    tipoInput: 'select-catalogos',
    desactivado: false,
    soloLectura: false,
    validadores: [{ tipo: '' }],
    marcadorDePosicion: 'Selecciona una fracción',
    opciones: [
      {
        id: 1,
        descripcion: '87033302 Usados.',
      },
    ],
    marginTop: 0,
  },
 
 
];
/** Datos predefinidos de fracciones PROSEC para inicializar o probar formularios.  
 * Incluye el número de fracción y su descripción.  
 */
export const ESPECIFICO_PREFILL: FraccionArancelariaProsec[] = [
  { fraccionArancelariaProsec: 12345678, descripción: 'Ejemplo de fracción PROSEC' },
  { fraccionArancelariaProsec: 87654321, descripción: 'Otro ejemplo' }
];
