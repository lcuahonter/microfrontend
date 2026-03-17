/**
 * Representa el modelo de respuesta para una operación de "Hoja de Trabajo".
 *
 * @property codigo - El código de respuesta que indica el resultado de la operación.
 * @property error - Un mensaje de error general, si existe.
 * @property causa - La causa o motivo del error, si aplica.
 * @property errores - Un arreglo de mensajes de error relacionados con la operación.
 * @property errores_modelo - Un arreglo de errores específicos del modelo.
 * @property mensaje - Un mensaje descriptivo sobre la respuesta.
 * @property datos - Un objeto que contiene información adicional relacionada con la "Hoja de Trabajo".
 * @property datos.id_hoja_trabajo - (Opcional) El identificador único de la hoja de trabajo.
 * @property datos.llave_archivo - (Opcional) La llave del archivo asociada a la hoja de trabajo.
 * @property datos.nombre_archivo - (Opcional) El nombre del archivo.
 * @property datos.contenido - (Opcional) El contenido del archivo.
 * @property datos.orden_tratamiento - (Opcional) Un objeto que contiene el número de orden de tratamiento.
 * @property datos.orden_tratamiento.orden_tratamiento - El número de orden de tratamiento.
 * @property datos.remision_muestra - (Opcional) Un objeto que contiene el número de remisión de muestra.
 * @property datos.remision_muestra.remision_muestra - El número de remisión de muestra.
 */
export interface ResponseHojaTrabajoModel {
  codigo: string;
  error: string;
  causa: string;
  errores: string[];
  errores_modelo: ErroresModelo[];
  mensaje: string;
  datos: {
    id_hoja_trabajo?: number;
    llave_archivo?: string;
    nombre_archivo?: string;
    contenido?: string;
    orden_tratamiento?: {
      orden_tratamiento: number;
    };
    remision_muestra?: {
      remision_muestra: number;
      id_remision_muestra:number
    };
  };
}

/**
 * Representa un modelo para capturar errores de validación asociados a un campo específico.
 *
 * @property campo - El nombre del campo donde ocurrió el error.
 * @property errores - Un arreglo de mensajes de error relacionados con el campo especificado.
 */
export interface ErroresModelo {
  campo: string;
  errores: string[];
}
