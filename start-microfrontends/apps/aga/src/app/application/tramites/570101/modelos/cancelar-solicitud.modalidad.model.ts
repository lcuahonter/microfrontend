
export interface CancelarSolicitudForm {
    folioSVEX: string;
    folioVUCEM: string;
    tipoDeCancelacion: string;
    horaInicio: string;
    horaFin: string;
    descripcion: string;
    fechasSeleccionadas: { selectedFechas: string[] }
}

export interface CancelarModalidad {
    id: number;
    descripcion: string;
}