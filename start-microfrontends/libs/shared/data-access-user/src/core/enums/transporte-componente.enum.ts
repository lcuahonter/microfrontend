import {
  ItemTransporteDespacho,
  TransporteDespacho,
} from '../models/shared/agregar-transporte.model';
import { ConfiguracionColumna } from '../models/shared/configuracion-columna.model';

/**
 * @description Enum para definir el header de la tabla del tipo transporte carretero.
 */
/**
 * @deprecated
 * Se recomienda utilizar `CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_CARRETERO` en lugar de `HEADER_TABLA_CARRETERO` para definir los encabezados de la tabla de transporte peatonal.
 */
export const HEADER_TABLA_CARRETERO: ItemTransporteDespacho[] = [
  {
    llave: 'emp_transportista',
    valor: 'Empresa transportista',
  },
  {
    llave: 'numero_porte',
    valor: 'Número carta porte',
  },
  {
    llave: 'fecha_porte',
    valor: 'Fecha carta porte',
  },
  {
    llave: 'marca_transporte',
    valor: 'Marca',
  },
  {
    llave: 'modelo_transporte',
    valor: 'Modelo',
  },
  {
    llave: 'placas_transporte',
    valor: 'Placas',
  },
  {
    llave: 'contenedor_transporte',
    valor: 'Contenedor(es)',
  },
  {
    llave: 'observaciones',
    valor: 'Observaciones',
  },
];

/**
 * @description Enum para definir el header de la tabla del tipo transporte ferroviario.
 */
/**
 * @deprecated
 * Se recomienda utilizar `CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_FERROVIARIO` en lugar de `HEADER_TABLA_FERROVIARIO` para definir los encabezados de la tabla de transporte ferroviario.
 */
export const HEADER_TABLA_FERROVIARIO: ItemTransporteDespacho[] = [
  {
    llave: 'numero_bl',
    valor: 'Número BL',
  },
  {
    llave: 'tipo_equipo',
    valor: 'Tipo de Equipo',
  },
  {
    llave: 'iniciales_equipo',
    valor: 'Iniciales Equipo',
  },
  {
    llave: 'numero_equipo',
    valor: 'Número de Equipo',
  },
  {
    llave: 'observaciones',
    valor: 'Observaciones',
  },
];

/**
 * @description Enum para definir el header de la tabla del tipo transporte peatonal.
 */
/**
 * @deprecated
 * Se recomienda utilizar `CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_PEATONAL` en lugar de `HEADER_TABLA_PEATONAL` para definir los encabezados de la tabla de transporte peatonal.
 */
export const HEADER_TABLA_PEATONAL: ItemTransporteDespacho[] = [
  {
    llave: 'emp_transportista',
    valor: 'Empresa transportista',
  },
  {
    llave: 'rfc_empresa',
    valor: 'RFC empresa responsable',
  },
  {
    llave: 'nombre_transportista',
    valor: 'Nombre transportista',
  },
  {
    llave: 'num_gafete',
    valor: 'ID de gafete',
  },
  {
    llave: 'observaciones',
    valor: 'Observaciones',
  },
];

/**
 * @description Enum para definir el header de la tabla del tipo transporte otro.
 */
/**
 * @deprecated
 * Se recomienda utilizar `CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_OTRO` en lugar de `HEADER_TABLA_OTRO` para definir los encabezados de la tabla de transporte otro.
 */
export const HEADER_TABLA_OTRO: ItemTransporteDespacho[] = [
  {
    llave: 'emp_transportista',
    valor: 'Empresa transportista',
  },
  {
    llave: 'tipo_transporte_des',
    valor: 'Tipo de transporte',
  },
  {
    llave: 'datos_transporte',
    valor: 'Datos de transporte',
  },
  {
    llave: 'observaciones',
    valor: 'Observaciones',
  },
];

/**
 * @description Enum para definir el header de la tabla del tipo transporte marítimo.
 */
/**
 * @deprecated
 * Se recomienda utilizar `CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_MARITIMO` en lugar de `HEADER_TABLA_MARITIMO` para definir los encabezados de la tabla de transporte marítimo.
 */
export const HEADER_TABLA_MARITIMO: ItemTransporteDespacho[] = [
  {
    llave: 'guia_bl_Maritimo',
    valor: 'Guía BL',
  },
  {
    llave: 'guia_house_valida',
    valor: 'Guía house',
  },
  {
    llave: 'nombre_buque_maritimo',
    valor: 'Nombre del buque',
  },
  {
    llave: 'contenedor_maritimo',
    valor: 'Contenedor(es)',
  },
  {
    llave: 'observaciones',
    valor: 'Observaciones',
  },
];

/**
 * @description Enum para definir el header de la tabla del tipo transporte aéreo.
 */
/**
 * @deprecated
 * Se recomienda utilizar `CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_AEREO` en lugar de `HEADER_TABLA_AEREO` para definir los encabezados de la tabla de transporte aéreo.
 */
export const HEADER_TABLA_AEREO: ItemTransporteDespacho[] = [
  {
    llave: 'arribo_pendiente_aereo_des',
    valor: 'Arribo pendiente',
  },
  {
    llave: 'guia_master_aereo',
    valor: 'Guía master',
  },
  {
    llave: 'guia_house_aereo',
    valor: 'Guía house',
  },
  {
    llave: 'fecha_arribo_aereo',
    valor: 'Fecha de arribo',
  },
  {
    llave: 'hora_arribo_aereo',
    valor: 'Hora de arribo',
  },
  {
    llave: 'guia_valida_des',
    valor: 'Guía válida',
  },
  {
    llave: 'observaciones',
    valor: 'Observaciones',
  },
];

/**
 * @description Constante para el manejo de la etiqueta de la hora de arribo en el componente de transporte.
 */
export const LABEL_HORA_ARRIBO = 'Hora llegada (aprox)';

/**
 * @description Constante para el manejo de la descripcion del tipo de transporte en el componente de transporte.
 */
export const DESCRIPCION_TIPO_TRANSPORTE = '{tipoTransporte}';

/**
 * @description Constante para el manejo del mensaje de error al cambiar el tipo de transporte.
 */
export const MSG_CAMBIO_TIPO_TRANSPORTE =
  'Los datos capturados serán borrados, estás de acuerdo (SI/NO)';

/**
 * @description Constante para el manejo del mensaje de éxito al agregar un tipo de transporte a la tabla.
 */
export const MSG_AGREGA_TRANSPORTE_EXITOSAMENTE = `El ${DESCRIPCION_TIPO_TRANSPORTE} fue agregado correctamente.`;

/**
 * @description Constante para el manejo del mensaje de éxito al agregar un tipo de transporte a la tabla.
 */
export const MSG_ELIMNA_TRANSPORTE_EXITOSAMENTE = `Se eliminó exitosamente el ${DESCRIPCION_TIPO_TRANSPORTE}.`;

/**
 * @description Constante de aviso  para el mensaje cuando se intenta hacer una búsqueda de un número BL y no se ha iingresado el valor.
 */
export const MSG_NUMERO_BL_VACIO = 'Debes agregar un número BL.';

/**
 * @description Mensaje de error cuando se seleeciona más de una guía para hacer la validación.
 */
export const MSG_INGRESA_UNA_GUIA = 'Debes registar una sola guía.';

/**
 * @description Mensaje de error cuando no se ha registrado la guía master o la guía house.
 */
export const MSG_REGISTRA_UNA_GUIA =
  'Debes registrar la guía master o la guía house.';

/**
 * @description Mensaje de error cuando el número BL es inválido.
 */
export const MSG_NUMERO_BL_INVALIDO = 'Número BL es inválido.';

/**
 *@description Constante para el manjejo del mensaje de aviso cuando quiere modificar un trasnporte y no hay fila seleccionada.
 */
export const MSG_SELECCIONA_ITEM = 'Selecciona un registro';

/**
 * @description Mensaje de error cuando se intenta modificar un registro y se ha seleccionado más de uno.
 */
export const MSG_SELECCIONA_SOLO_UN_REGISTRO = 'Selecciona solo un registro.';

/**
 * @description Lista de tipos de transporte disponibles en el sistema.
 * @param id: Identificador único del tipo de transporte.
 * @param nombre: Nombre del tipo de transporte.
 */
export const LISTA_TIPO_TRANSPORTE = [
  {
    id: 1,
    nombre: 'Carretero',
  },
  {
    id: 2,
    nombre: 'Ferroviario',
  },
  {
    id: 3,
    nombre: 'Aéreo',
  },
  {
    id: 4,
    nombre: 'Marítimo',
  },
  {
    id: 5,
    nombre: 'Peatonal',
  },
  {
    id: 6,
    nombre: 'Otro',
  },
];

/**
 * @description
 * Configuración de las columnas para la tabla de transporte carretero.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_CARRETERO: ConfiguracionColumna<TransporteDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra el nombre de la empresa transportista.
     * - Encabezado: "Empresa transportista".
     * - Clave: Obtiene el valor de `emp_transportista` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Empresa transportista',
      clave: (fila) => fila.emp_transportista,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra el numero_porte electrónico de la persona.
     * - Encabezado: "Correo".
     * - Clave: Obtiene el valor de `numero_porte` de la fila.
     * - Orden: 2.
     */
    {
      encabezado: 'Número carta porte',
      clave: (fila) => fila.numero_porte,
      orden: 2,
    },

    /**
     * Encabezado de la columna que muestra la fecha de la carta porte.
     * - Encabezado: "Fecha carta porte".
     * - Clave: Obtiene el valor de `fecha_porte` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Fecha carta porte',
      clave: (fila) => fila.fecha_porte,
      orden: 3,
    },

    /**
     * Encabezado de la columna que muestra la marca del transporte.
     * - Encabezado: "Marca".
     * - Clave: Obtiene el valor de `marca_transporte` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'Marca',
      clave: (fila) => fila.marca_transporte,
      orden: 4,
    },

    /**
     * Encabezado de la columna que muestra el modelo del transporte.
     * - Encabezado: "Modelo".
     * - Clave: Obtiene el valor de `modelo_transporte` de la fila.
     * - Orden: 5.
     */
    {
      encabezado: 'Modelo',
      clave: (fila) => fila.modelo_transporte,
      orden: 5,
    },

    /**
     * Encabezado de la columna que muestra las placas del transporte.
     * - Encabezado: "Placas".
     * - Clave: Obtiene el valor de `placas_transporte` de la fila.
     * - Orden: 6.
     */
    {
      encabezado: 'Placas',
      clave: (fila) => fila.placas_transporte,
      orden: 6,
    },

    /**
     * Encabezado de la columna que muestra los contenedores de transporte.
     * - Encabezado: "Contenedor(es)".
     * - Clave: Obtiene el valor de `contenedor_transporte` de la fila.
     * - Orden: 7.
     */
    {
      encabezado: 'Contenedor(es)',
      clave: (fila) => fila.contenedor_transporte,
      orden: 7,
    },

    /**
     * Encabezado de la columna que muestra las observaciones del transporte.
     * - Encabezado: "Observaciones".
     * - Clave: Obtiene el valor de `observaciones` de la fila.
     * - Orden: 8.
     */
    {
      encabezado: 'Observaciones',
      clave: (fila) => fila.observaciones,
      orden: 8,
    },
  ];

/**
 * @description
 * Configuración de las columnas para la tabla de transporte ferroviario.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_FERROVIARIO: ConfiguracionColumna<TransporteDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra el número BL del transporte ferroviario.
     * - Encabezado: "Número BL".
     * - Clave: Obtiene el valor de `numero_bl` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Número BL',
      clave: (fila) => fila.numero_bl,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra el tipo de equipo del transporte ferroviario.
     * - Encabezado: "Tipo de Equipo".
     * - Clave: Obtiene el valor de `tipo_equipo` de la fila.
     * - Orden: 2.
     */
    {
      encabezado: 'Tipo de Equipo',
      clave: (fila) => fila.tipo_equipo,
      orden: 2,
    },

    /**
     * Encabezado de la columna que muestra las iniciales del equipo del transporte ferroviario.
     * - Encabezado: "Iniciales Equipo".
     * - Clave: Obtiene el valor de `iniciales_equipo` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Iniciales Equipo',
      clave: (fila) => fila.iniciales_equipo,
      orden: 3,
    },

    /**
     * Encabezado de la columna que muestra el número del equipo del transporte ferroviario.
     * - Encabezado: "Número de Equipo".
     * - Clave: Obtiene el valor de `numero_equipo` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'Número de Equipo',
      clave: (fila) => fila.numero_equipo,
      orden: 4,
    },

    /**
     * Encabezado de la columna que muestra las observaciones del transporte ferroviario.
     * - Encabezado: "Observaciones".
     * - Clave: Obtiene el valor de `observaciones` de la fila.
     * - Orden: 5.
     */
    {
      encabezado: 'Observaciones',
      clave: (fila) => fila.observaciones,
      orden: 5,
    },
  ];

/**
 * @description
 * Configuración de las columnas para la tabla de transporte peatonal.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_PEATONAL: ConfiguracionColumna<TransporteDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra la empresa transportista del transporte peatonal.
     * - Encabezado: "Empresa transportista".
     * - Clave: Obtiene el valor de `emp_transportista` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Empresa transportista',
      clave: (fila) => fila.emp_transportista,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra el RFC de la empresa responsable del transporte peatonal.
     * - Encabezado: "RFC empresa responsable".
     * - Clave: Obtiene el valor de `rfc_empresa` de la fila.
     * - Orden: 2.
     */
    {
      encabezado: 'RFC empresa responsable',
      clave: (fila) => fila.rfc_empresa,
      orden: 2,
    },

    /**
     * Encabezado de la columna que muestra el nombre del transportista del transporte peatonal.
     * - Encabezado: "Nombre transportista".
     * - Clave: Obtiene el valor de `nombre_transportista` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Nombre transportista',
      clave: (fila) => fila.nombre_transportista,
      orden: 3,
    },

    /**
     * Encabezado de la columna que muestra el ID de gafete del transporte peatonal.
     * - Encabezado: "ID de gafete".
     * - Clave: Obtiene el valor de `num_gafete` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'ID de gafete',
      clave: (fila) => fila.num_gafete,
      orden: 4,
    },

    /**
     * Encabezado de la columna que muestra las observaciones del transporte peatonal.
     * - Encabezado: "Observaciones".
     * - Clave: Obtiene el valor de `observaciones` de la fila.
     * - Orden: 5.
     */
    {
      encabezado: 'Observaciones',
      clave: (fila) => fila.observaciones,
      orden: 5,
    },
  ];

/**
 * @description
 * Configuración de las columnas para la tabla de transporte marítimo.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_MARITIMO: ConfiguracionColumna<TransporteDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra la guía BL del transporte marítimo.
     * - Encabezado: "Guía BL".
     * - Clave: Obtiene el valor de `guia_bl_Maritimo` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Guía BL',
      clave: (fila) => fila.guia_bl_Maritimo,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra la guía house válida del transporte marítimo.
     * - Encabezado: "Guía house".
     * - Clave: Obtiene el valor de `guia_house_maritimo` de la fila.
     * - Orden: 2.
     */
    {
      encabezado: 'Guía house',
      clave: (fila) => fila.guia_house_maritimo,
      orden: 2,
    },

    /**
     * Encabezado de la columna que muestra el nombre del buque del transporte marítimo.
     * - Encabezado: "Nombre del buque".
     * - Clave: Obtiene el valor de `nombre_buque_maritimo` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Nombre del buque',
      clave: (fila) => fila.nombre_buque_maritimo,
      orden: 3,
    },

    /**
     * Encabezado de la columna que muestra los contenedores del transporte marítimo.
     * - Encabezado: "Contenedor(es)".
     * - Clave: Obtiene el valor de `contenedor_maritimo` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'Contenedor(es)',
      clave: (fila) => fila.contenedor_maritimo,
      orden: 4,
    },

    /**
     * Encabezado de la columna que muestra las observaciones del transporte marítimo.
     * - Encabezado: "Observaciones".
     * - Clave: Obtiene el valor de `observaciones` de la fila.
     * - Orden: 5.
     */
    {
      encabezado: 'Observaciones',
      clave: (fila) => fila.observaciones,
      orden: 5,
    },
  ];

/**
 * @description
 * Configuración de las columnas para la tabla de transporte aéreo.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_AEREO: ConfiguracionColumna<TransporteDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra si el arribo aéreo está pendiente.
     * - Encabezado: "Arribo pendiente".
     * - Clave: Obtiene el valor de `arribo_pendiente_aereo` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Arribo pendiente',
      clave: (fila) => fila.arribo_pendiente_aereo_des,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra la guía master del transporte aéreo.
     * - Encabezado: "Guía master".
     * - Clave: Obtiene el valor de `guia_master_aereo` de la fila.
     * - Orden: 2.
     */
    {
      encabezado: 'Guía master',
      clave: (fila) => fila.guia_master_aereo,
      orden: 2,
    },

    /**
     * Encabezado de la columna que muestra la guía house del transporte aéreo.
     * - Encabezado: "Guía house".
     * - Clave: Obtiene el valor de `guia_house_aereo` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Guía house',
      clave: (fila) => fila.guia_house_aereo,
      orden: 3,
    },

    /**
     * Encabezado de la columna que muestra la fecha de arribo del transporte aéreo.
     * - Encabezado: "Fecha de arribo".
     * - Clave: Obtiene el valor de `fecha_arribo_aereo` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'Fecha de arribo',
      clave: (fila) => fila.fecha_arribo_aereo,
      orden: 4,
    },

    /**
     * Encabezado de la columna que muestra la hora de arribo del transporte aéreo.
     * - Encabezado: "Hora de arribo".
     * - Clave: Obtiene el valor de `hora_arribo_aereo` de la fila.
     * - Orden: 5.
     */
    {
      encabezado: 'Hora de arribo',
      clave: (fila) => fila.hora_arribo_aereo,
      orden: 5,
    },

    /**
     * Encabezado de la columna que muestra si la guía es válida.
     * - Encabezado: "Guía válida".
     * - Clave: Obtiene el valor de `guia_valida` de la fila.
     * - Orden: 6.
     */
    {
      encabezado: 'Guía válida',
      clave: (fila) => fila.guia_valida_des,
      orden: 6,
    },

    /**
     * Encabezado de la columna que muestra las observaciones del transporte aéreo.
     * - Encabezado: "Observaciones".
     * - Clave: Obtiene el valor de `observaciones` de la fila.
     * - Orden: 7.
     */
    {
      encabezado: 'Observaciones',
      clave: (fila) => fila.observaciones,
      orden: 7,
    },
  ];

/**
 * @description
 * Configuración de las columnas para la tabla de transporte aéreo.
 */
export const CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_OTRO: ConfiguracionColumna<TransporteDespacho>[] =
  [
    /**
     * Encabezado de la columna que muestra la empresa transportista del transporte otro.
     * - Encabezado: "Empresa transportista".
     * - Clave: Obtiene el valor de `emp_transportista` de la fila.
     * - Orden: 1.
     */
    {
      encabezado: 'Empresa transportista',
      clave: (fila) => fila.emp_transportista,
      orden: 1,
    },

    /**
     * Encabezado de la columna que muestra el tipo de transporte del transporte otro.
     * - Encabezado: "Tipo de transporte".
     * - Clave: Obtiene el valor de `tipo_transporte_des` de la fila.
     * - Orden: 2.
     */
    {
      encabezado: 'Tipo de transporte',
      clave: (fila) => fila.tipo_transporte_des,
      orden: 2,
    },

    /**
     * Encabezado de la columna que muestra los datos del transporte otro.
     * - Encabezado: "Datos de transporte".
     * - Clave: Obtiene el valor de `datos_transporte` de la fila.
     * - Orden: 3.
     */
    {
      encabezado: 'Datos del transporte',
      clave: (fila) => fila.datos_transporte,
      orden: 3,
    },
    /**
     * Encabezado de la columna que muestra las observaciones del transporte otro.
     * - Encabezado: "Observaciones".
     * - Clave: Obtiene el valor de `observaciones` de la fila.
     * - Orden: 4.
     */
    {
      encabezado: 'Observaciones',
      clave: (fila) => fila.observaciones,
      orden: 4,
    },
  ];

/**
 * @description Constante para cuando se va a modificar un elemento de la tabla transporte.
 */
export const MODIFICAR_ITEM_TRANSPORTE = 'modificar';

/**
 * @description Sin valor para el tipo de transporte.
 */ 
export const SIN_VALOR_SELECT = '-1';
