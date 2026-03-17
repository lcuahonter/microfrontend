/**
 * Interfaz que representa la estructura de datos del formulario de dictamen.
 */
export interface DictamenForm {
  /**
   * Cumplimiento del dictamen (1 = cumple, 0 = no cumple, etc.).
   */
  cumplimiento: string;

  /**
   * Mensaje asociado al dictamen, obligatorio, máximo 2000 caracteres.
   */
  mensajeDictamen: string;

  /**
   * Texto editable de antecedentes del dictamen, obligatorio, máximo 2000 caracteres.
   */
  antecedentesEditables: string;

  /**
   * Texto solo lectura de antecedentes del dictamen.
   */
  antecedentesReadonly: string;

  /**
   * Fecha de inicio de vigencia autorizada (opcional).
   */
  fechaInicioVigenciaAutorizada: string;

  /**
   * Fecha de fin de vigencia autorizada (opcional).
   */
  fechaFinVigenciaAutorizada: string;

   /**
   * Cumplimiento de clasificacion UE(1 = cumple, 0 = no cumple, etc.).
   */
  clasificacionUE?: boolean | null;

  /**
   * Cumplimiento de clasificacion  Japon(1 = cumple, 0 = no cumple, etc.).
   */
  clasificacionJpn?: boolean | null;

  /**
   * Cumplimiento de clasificacion Aladi(1 = cumple, 0 = no cumple, etc.).
   */
  clasificacionAladi?: boolean | null;

  usoAutorizadoDictamen:string | null;
  descripcionUsoAutorizado:string | null;
  idRestriccionTipoTramite:string | null;
  opinion:string | null;
  justificacion:string | null;
  plazoVigencia:number | null;
  fechaFinVigencia:string | null;
  justificacionNegativa:string | null;
  observacion:string | null;
  idMotivoTipoTramite:string | null;
  siglasDictaminador:string | null;
  numeroGenerico1:string | null;
  aceptada: boolean | null;
}
