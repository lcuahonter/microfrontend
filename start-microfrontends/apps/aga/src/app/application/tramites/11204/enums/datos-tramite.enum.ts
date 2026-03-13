export const FECHA_INGRESO = {
    labelNombre: 'Fecha Ingreso',
    required: false,
    habilitado: true,
};
export const VIGENCIA = {
    labelNombre: 'Vigencia',
    required: false,
    habilitado: true,
};
export const ANEXAR = {
    label: 'Anexar necesarios'
}
export const CARGAR = {
    label: 'Cargar pago'
}
export enum SearchType {
    Contenedor = 'Contenedor',
    ArchivoCsv = 'Archivo CSV',
    NoManifiesto = 'No. de Manifiesto'
  }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MSG_REGISTRO_EXITOSO = (numeroSolicitud: string) =>
  `<p style="text-align: center;">
    La solicitud ha quedado registrada con el número temporal ${numeroSolicitud ?? ''}. 
    Este no tiene válidez legal y sirve solamente para efectos de identificar tu solicitud. 
    Un folio oficial le será asignado al momento en que ésta sea firmada.
  </p>`;
