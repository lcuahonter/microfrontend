export interface TablaEmpresaTransportista {
  id: number; // Identificador único de la empresa.
  rfc: string; // Registro Federal de Contribuyentes de la empresa. 
  denominacion: string; // Denominación o razón social de la empresa.
  domicilio: string; // Domicilio fiscal o comercial de la empresa.
  registroCaat: string; // Registro CAAT vigente.
  estatus: string; // Estatus actual de la empresa.
}