/**
 * Representa un elemento de la lista de solicitudes.
 */
export interface ListaSolicitudes {
    //Id solicitud
    idSolicitud: string;
    //Tipo de tramite
    tipoTramite: string;
    //fecha de creación de la solicitud
    fechaCreacion: string;
    //Fecha de actualización
    fechaActualizacion: string;
    //Dias trascurridos
    diasTrascurridos: string;
  }