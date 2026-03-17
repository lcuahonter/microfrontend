import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { TramiteAsociados } from "../../../shared/models/tramite-asociados.model";

/**
 * PERMISO_A_CANCELAR es una constante que define la estructura de los campos
 * utilizados en el formulario para gestionar el Cancelacion de un permiso.
 * 
 * Cada objeto dentro del arreglo representa un campo del formulario, con las siguientes propiedades:
 * - `labelNombre`: Etiqueta que describe el campo.
 * - `campo`: Nombre del campo utilizado como identificador.
 * - `class`: Clase CSS aplicada al campo para definir su diseño.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, número, texto, área de texto).
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `validators`: Validaciones aplicadas al campo (por ejemplo, requerido).
 * - `placeholder`: Texto de marcador de posición para el campo.
 * - `tooltip`: Información adicional que se muestra como un tooltip (opcional).
 */
export const PERMISO_A_CANCELAR = [
  {
    id: 'folioTramite',
    labelNombre: 'Folio',
    campo: 'folioTramite',
    clase: 'col-md-12',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      {
        tipo: '', mensaje: ''
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'tipoTramite',
    labelNombre: 'Tipo de solicitud',
    campo: 'tipoTramite',
    clase: 'col-md-12',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores:[
      {
        tipo: '', mensaje: ''
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3
  },
  {
    id: 'motivo',
    labelNombre: 'Motivo de Cancelación',
    campo: 'motivoCancelacion',
    clase: 'col-md-12',
    tipoInput: 'textarea',
    desactivado: false,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  }
];

/**
 * REPRESENTANTE_LEGAL es una constante que define la estructura de los campos
 * utilizados en el formulario para gestionar el Cancelacion de un permiso.
 * 
 * Cada objeto dentro del arreglo representa un campo del formulario, con las siguientes propiedades:
 * - `labelNombre`: Etiqueta que describe el campo.
 * - `campo`: Nombre del campo utilizado como identificador.
 * - `class`: Clase CSS aplicada al campo para definir su diseño.
 * - `tipoInput`: Tipo de entrada del campo (por ejemplo, número, texto, área de texto).
 * - `disabled`: Indica si el campo está deshabilitado.
 * - `validators`: Validaciones aplicadas al campo (por ejemplo, requerido).
 * - `placeholder`: Texto de marcador de posición para el campo.
 * - `tooltip`: Información adicional que se muestra como un tooltip (opcional).
 */
export const REPRESENTANTE_LEGAL = [
  {
    id: 'representanteLegalRFC',
    labelNombre: 'RFC',
    campo: 'rfc',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: false,
    soloLectura: false,
    validadores: [
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0
  },
  {
    id: 'consultarIDC',
    labelNombre: 'Buscar',
    campo: 'buscar',
    clase: 'col-md-4',
    tipoInput: 'button',
    desactivado: false,
    soloLectura: false,
    marginTop: 5,
    divWidth:"none"
  },
  {
    id: 'representanteLegalNombre',
    labelNombre: 'Nombre o Razón Social',
    campo: 'nombre',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores:[
      {
        tipo: 'required'
      }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  },
  {
    id: 'representanteLegalApPaterno',
    labelNombre: 'Apellido paterno',
    campo: 'apellidoPaterno',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      { tipo: 'required' }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  },
  {
    id: 'representanteLegalApMaterno',
    labelNombre: 'Apellido materno',
    campo: 'apellidoMaterno',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [
      { tipo: '' }
    ],
    marcadorDePosicion: '',
    marginTop: 3
  }
];

/**
   * Configuración para las columnas de la tabla.
   * Define cómo se mostrarán los datos de los trámites asociados.
   */
export const CONFIGURACIONCOLUMNA: ConfiguracionColumna<TramiteAsociados>[] = [
  { encabezado: '', clave: (item: TramiteAsociados) => item.id, orden: 1 },
  {
    encabezado: 'Folio trámite',
    clave: (item: TramiteAsociados) => item.folioTramite,
    orden: 2,
  },
  {
    encabezado: 'Tipo trámite',
    clave: (item: TramiteAsociados) => item.tipoTramite,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (item: TramiteAsociados) => item.estatus,
    orden: 4,
  },
  {
    encabezado: 'Fecha alta de registro',
    clave: (item: TramiteAsociados) => item.fetchaAltaDeRegistro,
    orden: 5,
  },
];
