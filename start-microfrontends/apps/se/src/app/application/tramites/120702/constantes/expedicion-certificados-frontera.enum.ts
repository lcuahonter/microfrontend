import { DetalleCertificado, DetalleCertificadoCertificado, Monto } from "../models/expedicion-certificados-frontera.models";

/**
 * Lista de pasos del proceso de expedición de certificados en frontera.
 * Cada paso incluye un índice, título, y su estado (activo y completado).
 */
export const EXPEDICION_CERTIFICADOS_FRONTERA = [
  {
    indice: 1,
    titulo: 'Capturar solicitud',
    activo: true,
    completado: true,
  },
  {
    indice: 2,
    titulo: 'Firmar solicitud',
    activo: false,
    completado: false,
  },
];

/**
 * Configuración del input de fecha de inicio.
 */
export const INPUT_FECHA_INICIO = {
  /**
   * Etiqueta mostrada para el campo.
   */
  labelNombre: 'Fecha inicio:',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Indica si el campo está habilitado.
   */
  habilitado: false,
};

/**
 * Configuración del input de fecha de fin.
 */
export const INPUT_FECHA_FIN = {
  /**
   * Etiqueta mostrada para el campo.
   */
  labelNombre: 'Fecha fin:',

  /**
   * Indica si el campo es obligatorio.
   */
  required: false,

  /**
   * Indica si el campo está habilitado.
   */
  habilitado: false,
};

/**
 * Arreglo que describe los campos del formulario para la información del cupo.
 * Cada objeto define un campo específico, sus atributos y comportamiento.
 */
export const INFORMACION_DESCRIPCION_CUPO = [
  {
    id: 'regimenAduanero',
    labelNombre: 'Régimen aduanero',
    campo: 'regimenAduanero',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'descripcionProducto',
    labelNombre: 'Descripción del producto',
    campo: 'descripcionProducto',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 0,
  },
  {
    id: 'clasificacionSubProducto',
    labelNombre: 'Clasificación del subproducto',
    campo: 'clasificacionSubProducto',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'unidadMedida',
    labelNombre: 'Unidad de medida',
    campo: 'unidadMedida',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'fechaInicioCupo',
    labelNombre: 'Fecha inicio vigencia del cupo:',
    campo: 'fechaInicioCupo',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
    habilitado: false,
  },
  {
    id: 'fechaFinCupo',
    labelNombre: 'Fecha fin vigencia del cupo:',
    campo: 'fechaFinCupo',
    clase: 'col-md-4',
    tipoInput: 'date',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
    habilitado: false,
  },
  {
    id: 'mecanismoAsignacion',
    labelNombre: 'Mecanismo de asignación',
    campo: 'mecanismoAsignacion',
    clase: 'col-md-8',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'tratadoAcuerdo',
    labelNombre: 'Tratado / Acuerdo',
    campo: 'tratadoAcuerdo',
    clase: 'col-md-4',
    tipoInput: 'text',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'fraccionesArancelarias',
    labelNombre: 'Fracciones arancelarias',
    campo: 'fraccionesArancelarias',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado:
      '',
    marginTop: 4,
  },
  {
    id: 'paises',
    labelNombre: 'Países',
    campo: 'paises',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'observaciones',
    labelNombre: 'Observaciones',
    campo: 'observaciones',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
  {
    id: 'fundamento',
    labelNombre: 'Fundamento',
    campo: 'fundamento',
    clase: 'col-md-8',
    tipoInput: 'textarea',
    desactivado: true,
    soloLectura: false,
    validadores: [],
    marcadorDePosicion: '',
    valorPredeterminado: '',
    marginTop: 3,
  },
];

/**
 * Configuración para la tabla que muestra los montos a expedir en el trámite de expedición de certificados de frontera.
 *
 * Cada objeto en el arreglo representa una columna de la tabla.
 * - `encabezado`: Título que se mostrará en la cabecera de la columna.
 * - `clave`: Función que recibe un objeto de tipo `Monto` y retorna el valor correspondiente a mostrar en la columna.
 * - `orden`: Indica el orden en el que se mostrará la columna en la tabla.
 */
export const CONFIGURATION_TABLA_MONTO = [
  {
    encabezado: 'Monto a expedir',
    clave: (item: Monto): string => item.Montoaexpedir,
    orden: 1
  }
];

/**
 * Arreglo de objetos que define la estructura y los encabezados de los detalles de un certificado de frontera.
 * 
 * Cada objeto representa una columna en la visualización de los detalles del certificado, incluyendo:
 * - `encabezado`: El nombre que se mostrará como encabezado de la columna.
 * - `clave`: Función que recibe un objeto `DetalleCertificado` y retorna el valor correspondiente para esa columna.
 * - `orden`: El orden en el que se mostrará la columna.
 * 
 * @remarks
 * Este arreglo es utilizado para mapear y mostrar los datos de certificados de frontera en una tabla o listado.
 */
export const DETALLE_CERTIFICADO =[

  {
    encabezado: 'Número',
    clave: (item: DetalleCertificado): string => item.numerio,
    orden: 1
  },
  {
    encabezado: 'Monto a expedir',
    clave: (item: DetalleCertificado): string => item.montoAExpidor,
    orden: 2
  },
  {
    encabezado: 'Número de Certifido',
    clave: (item: DetalleCertificado): string => item.numberoDeCertificado,
    orden: 3
  },
  {
    encabezado: 'Estado',
    clave: (item: DetalleCertificado): string => item.estado,
    orden: 4
  }
]



/**
 * Arreglo de objetos que define los detalles a mostrar para un certificado de frontera.
 * Cada objeto representa una columna con su encabezado, una función para obtener el valor
 * correspondiente de un objeto `DetalleCertificadoCertificado`, y el orden en el que debe aparecer.
 *
 * @remarks
 * - `encabezado`: Título de la columna que se mostrará en la interfaz.
 * - `clave`: Función que recibe un objeto `DetalleCertificadoCertificado` y retorna el valor a mostrar en la columna.
 * - `orden`: Número que indica la posición de la columna en la tabla.
 */
export const DETALLE_CERTIFICADO_CERTIFICADO =[

  {
    encabezado: 'Folio del oficio de certificado',
    clave: (item: DetalleCertificadoCertificado): string => item.follioDeloficioCertificato,
    orden: 1
  },
  {
    encabezado: 'RFC',
    clave: (item: DetalleCertificadoCertificado): string => item.rfc,
    orden: 2
  },
  {
    encabezado: 'Nombre, Denominación o Razón Social',
    clave: (item: DetalleCertificadoCertificado): string => item.numberoDenaminacion,
    orden: 3
  },
  {
    encabezado: 'Representación Federal',
    clave: (item: DetalleCertificadoCertificado): string => item.representationFedral,
    orden: 4
  }
]

/**
 * Datos iniciales de la tabla de montos a expedir.
 * Cada elemento es un objeto `Monto` que representa una fila de la tabla.
 */
export const MONTO_DATOS: Monto[] = [
  {
    Montoaexpedir: '10',
  },]

  /**
 * @description
 * Mensaje de alerta en formato HTML que se muestra cuando faltan campos por capturar en un formulario.
 * Utiliza clases de Bootstrap para centrar y alinear el contenido visualmente.
 *
 * @example
 * // Uso típico:
 * mostrarAlerta(ERROR_FORMA_ALERT);
 */
export const ERROR_FORMA_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <b>¡Error de registro!</b> Faltan campos por capturar.
    </div>
  </div>
</div>
`

export const ERROR_MONTO_ALERT =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      <b>Verifique su información.
    </div>
  </div>
</div>
`

export const ERROR_NO_DATOS =
  `
<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
    <div>Corrija los siguientes errores:</div>
      No se encontró el número de oficio capturado. Favor de verificar.
    </div>
  </div>
</div>`