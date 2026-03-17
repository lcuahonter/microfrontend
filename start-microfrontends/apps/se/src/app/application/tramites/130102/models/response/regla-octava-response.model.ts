export interface ReglaOctacaResponse {
    codigo: string;
    mensaje: string;
    datos: {
        id_solicitud: number;
        fecha_creacion: string;
    };
}