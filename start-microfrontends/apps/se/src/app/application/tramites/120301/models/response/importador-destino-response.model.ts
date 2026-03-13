/**
 * Model for Importador/Destino response
 */
export interface ImportadorDestinoResponse {
    // Tipo de IOR (Importador o Destinatario)
    tipo_ior: string;
    // valor del IOR (RFC o Nombre)
    valor: string;
    // Razón social del IOR
    razon_social: string;
    // Domicilio del IOR
    domicilio: string;
    // Ciudad del IOR
    ciudad: string;
    // Código Postal del IOR
    cp: string;
    // País del IOR
    pais: string;
}