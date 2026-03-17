import { AvisoAgente } from "../../models/30505/aviso-modificacion.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";
import { FusionEscision } from "../../models/30505/aviso-modificacion.model";
import { TercerosRelacionados } from "../../models/30505/aviso-modificacion.model";


/**
 * @const
 * Contiene el mensaje HTML que indica que se debe seleccionar al menos un tipo de aviso.
 */
export const AVISO_MOD = `<p>Debe seleccionar por lo menos un tipo de aviso</p>`


/**
 * Constante que define las opciones disponibles para un control de radio.
 * Cada opción contiene una etiqueta (`label`) y un valor (`value`).
 * 
 * @const
 * @type {{ label: string; value: string }[]}
 * 
 * @property {string} label - Texto que se muestra al usuario ('Sí' o 'No').
 * @property {string} value - Valor asociado a la opción ('1' para 'Sí', '0' para 'No').
 */
export const OPCIONES_RADIO = [
    {
        label: 'Sí',
        value: '1',
    },
    {
        label: 'No',
        value: '0',
    }
];

/**
 * @const
 * Arreglo de objetos que representa las opciones de radio para seleccionar entre "Fusión" y "Escisión".
 * Cada objeto contiene:
 * - label: El texto que se muestra al usuario.
 * - value: El valor asociado a la opción ("1" para Fusión, "0" para Escisión).
 * - id: Identificador único para cada opción.
 */
export const FUSION_ESCISION_RADIO = [
    {
        label: 'Fusión',
        value: '1',
        id:'idFusion'
    },
    {
        label: 'Escisión',
        value: '0',
        id:'idEscision'
    }
];


/**
 * @const
 * Constante que representa las opciones de aviso relacionadas con la fusión o escisión de empresas.
 * Cada objeto contiene:
 * - label: Descripción del tipo de aviso.
 * - value: Valor asociado a la opción.
 * - id: Identificador único de la opción.
 */
export const AVISO_RADIO = [
    {
        label: 'Aviso de fusión o escisión de empresas que cuente con la autorización en el Registro del Despacho de las Mercancías y subsista una de ellas.',
        value: '1',
        id: 'fusion1'
    },
    {
        label: ' Aviso de fusión o escisión dos o más empresas que cuenten con la autorización en el registro del despacho de mercancías de las empresas y resulte una nueva',
        value: '0',
        id: 'fusion2'
    }
];


/**
 * @const
 * Constante que representa las opciones de selección para un radio button de tipo Sí/No.
 * Cada objeto contiene:
 * - label: Texto que se muestra al usuario ('Sí' o 'No').
 * - value: Valor asociado a la opción ('1' para Sí, '0' para No).
 * - id: Identificador único para cada opción.
 */
export const SI_NO_RADIO = [
    {
        label: 'Sí',
        value: '1',
        id:'idSiCertificacion'
    },
    {
        label: 'No',
        value: '0',
        id:'idNoCertificacion'
    }
];

/**
 * @const
 * Opciones disponibles para el aviso de cálculo.
 * Cada opción contiene una etiqueta descriptiva, un valor asociado y un identificador único.
 * - label: Texto que se muestra al usuario ("Sí" o "No").
 * - value: Valor correspondiente a la opción ("1" para sí, "0" para no).
 * - id: Identificador único para la opción.
 */
export const AVISO_CALCULO_OPCIONES = [
    {
        label: 'Sí',
        value: '1',
        id: 'idEjercicioSi'
    },
    {
        label: 'No',
        value: '0',
        id: 'idEjercicioNo'
    }
]

/**
 * @const
 * Opciones disponibles para el aviso de porcentaje.
 * Cada opción contiene una etiqueta descriptiva, un valor asociado y un identificador único.
 * - label: Texto que se muestra al usuario ("Sí" o "No").
 * - value: Valor correspondiente a la opción ("1" para sí, "0" para no).
 * - id: Identificador único para la opción.
 */
export const AVISO_PORCENTAJE_OPCIONES = [
    {
        label: 'Sí',
        value: '1',
        id: 'idPorcentajeSi'
    },
    {
        label: 'No',
        value: '0',
        id: 'idPorcentajeNo'
    }
]



/**
 * Constante que define la configuración de las columnas para la tabla de terceros relacionados.
 * Cada objeto en el arreglo representa una columna, especificando el encabezado, la clave de acceso a los datos
 * y el orden en el que debe aparecer la columna en la tabla.
 *
 * @const
 */
export const TERCEROS_ENCABEZADO_DE_TABLA: ConfiguracionColumna<TercerosRelacionados>[] =
  [
    {
      encabezado: 'RFC',
      clave: (fila) => fila.rfc,
      orden: 1,
    },
    { encabezado: 'CURP', clave: (fila) => fila.curp, orden: 2},
    { encabezado: 'Nombre', clave: (fila) => fila.nombre, orden: 3 },
    {
      encabezado: 'Apellido Paterno',
      clave: (fila) => fila.apellidoPaterno,
      orden: 4,
    },
    { encabezado: 'Apellido Materno',
       clave: (fila) => fila.apellidoMaterno,
        orden: 5 
      },
    {
      encabezado: 'Domicilio',
      clave: (fila) => fila.domicilio,
      orden: 6,
    }
  ]

  /**
 * @const
 * Configuración de columnas para la tabla de Fusión/Escisión.
 * 
 * Cada objeto en el arreglo representa una columna de la tabla, especificando:
 * - encabezado: El nombre que se mostrará en la cabecera de la columna.
 * - clave: Función que determina el valor a mostrar en la columna según la fila.
 * - orden: El orden en que aparecerá la columna en la tabla.
 * 
 * Esta configuración es utilizada para mostrar información relevante sobre la fusión o escisión,
 * incluyendo RFC, razón social, folio VUCEM y fechas de vigencia de la certificación/renovación.
 */
export const FUSION_CONFIGURACION_TABLA: ConfiguracionColumna<FusionEscision>[] =
  [
    {
      encabezado: 'Registro Federal de Contribuyentes',
      clave: (fila) => fila.certificacionModal === '1'? fila.rfcBusquedaModal: fila.rfcBusquedaModalSC,
      orden: 1,
    },
    { encabezado: 'Denominación o Razón Social', clave: (fila) => fila.certificacionModal === '1' ? fila.razonSocialFusionante : fila.razonSocialFusionanteSC, orden: 2},
    { encabezado: 'Folio VUCEM de la Última certificación/renovación', clave: (fila) => fila.folioVucemFusionante, orden: 3 },
    {
      encabezado: 'Fecha de fin de vigencia de la Última certificación/renovación',
      clave: (fila) => fila.fechaInicioVigenciaFusionante,
      orden: 4,
    },
    { encabezado: 'Fecha de inicio de vigencia de la Última certificación/renovación',
       clave: (fila) => fila.fechaFinVigenciaFusionante,
        orden: 5 
      },
  ];

 /**
 * @const
 * Arreglo de configuraciones de columnas para la tabla de Aviso de Modificación de Agentes.
 * Cada objeto define las propiedades de una columna, incluyendo el encabezado, la clave de acceso a los datos de la fila y el orden de aparición.
 *
 * - 'Tipo de Figura': Muestra el tipo de figura del agente.
 * - 'Nombre': Muestra el nombre del agente.
 * - 'Apellido Paterno': Muestra el apellido paterno del agente.
 * - 'Apellido Materno': Muestra el apellido materno del agente.
 * - 'Denominación o Razón Social': Muestra la razón social del agente.
 * - 'Patente o Autorización': Muestra el número de patente o autorización.
 * - 'Estatus': Indica si la patente ha sido modificada.
 *
 * @type {ConfiguracionColumna<AvisoAgente>[]}
 */
export const AVISO_AGENTE_DE_TABLA: ConfiguracionColumna<AvisoAgente>[] =
  [
    {
      encabezado: 'Tipo de Figura',
      clave: (fila) => fila.tipoFigura,
      orden: 1,
    },
    { encabezado: 'Nombre', clave: (fila) => fila.nombre, orden: 2 },
    {
      encabezado: 'Apellido Paterno',
      clave: (fila) => fila.apellidoPaterno,
      orden: 3,
    },
    { encabezado: 'Apellido Materno',
       clave: (fila) => fila.apellidoMaterno,
        orden: 4 
      },
    {
      encabezado: 'Denominación o Razón Social',
      clave: (fila) => fila.razonSocial,
      orden: 5,
    },
    {
      encabezado: 'Patente o Autorización',
      clave: (fila) => fila.numPatenteModal,
      orden: 6,
    },
  ];
  

