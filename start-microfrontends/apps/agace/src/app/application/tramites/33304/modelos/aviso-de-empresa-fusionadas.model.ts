export interface TablaEmpresaFusionada {
  id: number; // Identificador único de la empresa fusionada
  rfc: string; // Registro Federal de Contribuyentes
  denominacion: string; // Denominación o Razón Social
  folioVucem: string; // Folio VUCEM de la última certificación/renovación
  fechaInicioVigencia: string; // Fecha de inicio de vigencia de la última certificación/renovación
  fechaFinVigencia: string; // Fecha de fin de vigencia de la última certificación/renovación
  estatus: string; // Estatus de la empresa fusionada
}
