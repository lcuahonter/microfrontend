/**
 * @description Mensaje de error cuando no se ha encontrado el rfc.
 */
export const MSG_ERROR_RFC_NO_ENCONTRADO =
  'No se encontró el RFC, favor de verificar los datos ingresados.';
/**
 * @description RFC sin certificaciones
 */
export const RFC_SIN_CERTIFICACIONES =
  'No se encontró información de las certificaciones y/o permisos, si aplica, favor de capturar.';

// #Sección Fechas
/**
 *@descrption Mensaje de erros cuando la fecha excede el peiodo mensual.
 */
export const MSJ_ERROR_FECHA_MES = 'La fecha excede el periodo mensual.';

/**
 * @description Mensaje de error cuando la fecha excede el periodo semanal.
 */
export const MSJ_ERROR_FECHA_SEMANA =
  'La fecha no es válida para el periodo semanal.';

/**
 * @description Mensaje de error cuando la fecha excede el periodo diario.
 */
export const MSJ_ERROR_FECHA_DIA =
  'La fecha no es válida para la solicitud seleccionada.';

/**
 * @description Mensaje de error cuando la fecha final es menor que la fecha inicial.
 */
export const MSJ_ERROR_HORA_FINAL_MENOR_INICIAL =
  'Hora inválida. La hora final no puede ser menor o igual a la de incio.';

export const MSJ_FECHA_DENTRO_DE_HORARIO_ADUANA =
  'El horario que seleccionaste para llevar a cabo tu servicio extraordinario, se encuentra dentro del horario de operación de la aduana. Por favor verifica.';

/**
 * #Mensajes del modal para el componente Persona Responsable del Despacho
 */

/**
 * @description Mensaje de error cuando se hace una busqueda con un gafete que no existe.
 */
export const ERR_BUSQUEDA_GAFETE_SIN_RESULTADOS =
  'No se encontraron datos con el número de gafete, intenta de nuevo o agrega los datos restantes.';

/**
 * @description Mensaje de error cuando ya existe un responsable del despacho con el mismo gafete que se quiere registrar.
 */
export const MSJ_ERROR_GAFETE_EXISTE =
  'El número de gafete ya se encuentra registrado, intenta de nuevo';

/**
 * @description Mensaje de error cuando se intenta agregar mas de 5 personas respsonsables de despacho.
 */
export const ADV_MAXIMO_PERSONAS =
  'Solo puedes agregar a máximo 5 personas responsables del despacho.';

/**
 * @description Mensaje de error cuando se hace una busqueda sin datos.
 */
export const ERR_INPUT_BUSQUEDA_VACIO =
  'No has proporcionado información que es requerida.';

// # Sección pedimento
/**
 * @description Mensaje de error cuando se intenta agregar un pedimento sin haberlo ingresado al input.
 */
export const MSG_NRO_PEDIMENTO_LLENAR_DATOS =
  'Debes de llenar los datos para agregar otro pedimento. En el caso de que ya hayas capturado todos los datos requeridos, por favor actualiza los datos y al final de capturarlos oprime "Enter".';

/**
 * @description Mensaje de error cuando se intenta agregar un numero de pedimento sin haberlo ingresado al input.
 */
export const MSG_NRO_PEDIMENTO = 'Necesita agregar un número de pedimento';

/**
 * @description Mensaje de error cuando se intenta agregar un numero de pedimento sin haber seleccionado una aduana de despacho.
 */
export const MSG_ADUANA_PEDIMENTO =
  'Necesitas seleccionar una aduana de despacho';

/**
 * @description Mensaje pedimento válido
 */
export const MSG_PEDIMENTO_VALIDO =
  'El pedimento es válido, favor de capturar los datos de pedimento faltantes.';

/**
 * @description Mensaje pedimento no válido
 */
export const MSG_PEDIMENTO_NO_VALIDO =
  'No fue posible realizar la consulta, favor de adjuntar el documento digitalizado.';

/**
 * @description Pedimento ya capturado
 */
export const MSG_PEDIMENTO_YA_CAPTURADO =
  'El Número de pedimento ya se encuentra registrado, intente de nuevo.';

/**
 * @descrption Valida si el pedimento existe y esta pagado
 *
 */
export const MSG_PEDIMENTO_EXISTE_YA_PAGADO =
  'Error, verificar que exista y este pagado ';

/**
 * @descrption Valida si el pedimento exista como previo
 *
 */
export const MSG_PEDIMENTO_EXISTE_PREVIO =
  'Error, verificar que exista como previo';

/**
 * @description Mensaje de error cuando no hay pedimentos en la tabla.
 */
export const MSG_ERROR_NO_PEDIMENTOS = 'No se encontró información.';

// #Secion Linea de captura
/**
 * @description Mensaje de error cuando no se han llenado los campos obligatorios.
 */
export const ERR_CAMPOS_OBLIGATORIOS =
  'Debes capturar todos los datos marcados como obligatorios.';
/**
 * @description Mensaje monto pagado cubierto
 */
export const MSG_MONTO_PAGADO_CUBIERTO =
  'El monto a pagar ya ha sido cubierto, no es necesario agregar otra línea de captura.';

/**
 * @description Mensaje de error cuando los campos obligatorios no están capturados en la consulta de línea de captura..
 */
export const MSJ_ERROR_LINEA_CAPTURA =
  'Debe capturar todos los datos marcados como obligatorios.';

/**
 * @description Mensaje de error cuando la línea de captura no es válida.
 */
export const MSJ_ERROR_LINEA_CAPTURA_NO_VALIDA =
  'Línea de captura no es válida, favor de verificar.';

/**
 * @decription Mensaje de advertencia cuando la línea de captura ya ha sido usada
 */
export const MSJ_LINEA_CAPTURA_USADA =
  'La línea de captura ya ha sido utilizada, favor de verificar.';

/**
 * @description Mensaje de error cuando la línea de captura no ha sido pagada.
 */
export const MSJ_LINEA_CAPTURA_NO_PAGADA =
  'La línea de captura no ha sido pagada, favor de verificar.';

/**
 * @description Mensaje de error cuando la línea de captura ya ha sido agregada a la tabla.
 */
export const MSJ_LINEA_CAPTURA_DUPLICADA =
  'La línea de captura ingresada ya se registró en esta solicitud, favor de verificar.';
/**
 * @description Mensaje de avertencia cuando se va a cambiar de tipo de solicitud y el formulario tiene datos capturados.
 */
export const MSG_CAMBIO_TIPO_SOLICITUD =
  'Los datos capturados serán borrados, ¿estás de acuerdo (SI/NO)?';

/**
 * @description Mensaje error, no se encontró información
 */
export const MSG_ERROR_NO_INFORMACION = 'No se encontró información';

/**
 * @description Mensaje de error cuando no se ha seleccionado un registro para eliminar
 */
export const MSG_ERROR_SELECCIONE_REGISTRO = 'Seleccione un registro.';

/**
 * @description Mensaje de rror cuando no se encuentra el ID del Socio Comercial
 */
export const MSJ_ERROR_ID_SOCIO_COMERCIAL =
  'No se ha encontrado ningún registro de socio comercial con el identificador proporcionado, por favor verifica.';

// # Sección despacho
/**
 * @description Mensaje borrar campos "recintos" y "especifique"
 */
export const MSG_BORRAR_CAMPOS_RECINTOS =
  'Los datos capturados en "nombre del recinto" y "especifique" serán borrados, está de acuerdo (SI/NO)';

/**
 * @description Mensaje de error cuando no se han seleccionado las fechas inicial y final.
 */
export const MSJ_ERROR_FECHAS_NO_SELECCIONADAS =
  'Debe registrar la fecha inicial y la fecha final';

/**
 * @description Mensaje de error cuando no se ha seleccionado la fecha final.
 */
export const MSJ_ERROR_FECHA_FINAL_NO_SELECCIONADA =
  'Debe registrar la fecha final';

/**
 * @description Mensaje de error cuando no se ha seleccionado la fecha inicial.
 */
export const MSJ_ERROR_FECHA_INICIAL_NO_SELECCIONADA =
  'Debe registrar la fecha inicial';

/**
 * @description Mensaje error del RFC no autorizado para operar en LDA.
 */
export const MSJ_ERROR_RFC_AUTORIZACION_LDA =
  'No está autorizado para operar en LDA, favor de verificar.';

/**
 * @description Mensaje error del RFC no autorizado para operar en DDEX.
 */
export const MSJ_ERROR_FOLIO_DDEX =
  'EL RFC no está autorizado para realizr DD, favor de verificar.';

/**
 * Mensaje que indica que no tiene relación de encargo conferido
 */
export const MSJ_NO_RELACION_ENCARGO_CONFERIDO =
  'No cuenta con relación de encargo conferido.';

/**
 * Confirmacion de eliminación de solicitud
 */
export const CONFIRMAR_ELIMINAR_SOLICITUD =
  '¿Estás seguro de que desea eliminar la solicitud?';

