/**
 * Estructura de datos para el formulario de inicio de trámite CAAT.
 * Se utiliza para capturar la información tanto de Personas Físicas como Morales.
 * @export
 * @interface FormularioSolicitud
 */
export interface FormularioSolicitud {

  /** Folio único asignado por el sistema para el seguimiento del trámite. */
  cveFolioCaat: string;
  
  /** Rol del usuario que realiza la captura (ej. agente, mandatario). */
  rol: string;

  /** Identificador del tipo de agente seleccionado del catálogo AGENT_CATALOG. */
  tipoAgente: string;

  /** * Nombre(s) del Director General. 
   * @optional Solo aplica cuando el rol es 'personaMoral'.
   */
  directorGeneralNombre?: string;

  /** Primer apellido del Director General. 
   * @optional Solo aplica cuando el rol es 'personaMoral'.
  */
  primerApellido?: string;

  /** Segundo apellido del Director General (opcional). 
   * @optional Solo aplica cuando el rol es 'personaMoral'.
  */
  segundoApellido?: string;
}