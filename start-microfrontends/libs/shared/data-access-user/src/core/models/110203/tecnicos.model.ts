/**
 * Representa la estructura de una mercancía con información detallada.
 * Contiene datos obligatorios como orden, arancelaria, técnico, comercial, inglés y registro,
 * además de campos opcionales como nombre comercial, marca, valor y factura.
 */
export interface Mercancia {
    orden: string;
    arancelaria: string;
    tecnico: string;
    comercial: string;
    ingles: string;
    registro: string;
   nombreComercial?: string;
  nombreIngles?: string;
  complementoClasificacion?: string;
  marca?: string;
  valorMercancia?: number;
  cantidad?: number;
  umc?: string;
  masaBruta?: number;
  unidadMedidaMasaBruta?: string;
  numeroFactura?: string;
  tipoFactura?: string;
  fechaExpedicion?: string;
  }
  /* Interface que define los campos de texto (placeholders)  
   Usada para nombres, direcciones y contactos  
   Facilita la gestión de formularios en español */ 
export interface Placeholders {
  nombre: string;
  primer: string;
  segundo: string;
  fiscal: string;
  razon: string;
  calle: string;
  letra: string;
  ciudad: string;
  correo: string;
  fax: string;
  telefono: string;
}
