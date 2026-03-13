/**
 * Interfaz que representa la información detallada de una mercancía.
 */
export interface Mercancias {
  id?: number;                    
  fraccionArancelaria?: string;
  nombreComercial: string;
  nombreTecnico?: string;
  criterioTratoPreferencial?: string;
  valorContenidoRegional?: string;
  otrasInstancias?: string;
  cantidad: string;             
  umc: string;
  fechaExpedicion?: string;
  fechaVencimiento?: string;
  numeroRegistroProducto?: string;
  complementoDescripcion: string;
  valorMercancia: string;     
  fechaFactura: string;          
  numeroFactura: string;
  selectValour:string;
}

/**
 * Modelo de respuesta para guardar una solicitud de trámite.
 * Define la estructura de los datos devueltos al guardar una solicitud en el sistema.
 */
export interface GuadarSolicitudResponse {
    /**
     * Identificador único de la solicitud guardada.
     */
    id_solicitud: number;

    /**
     * Código de régimen asociado a la solicitud.
     */
    fecha_creacion: Date;
}
