
export interface CertificadoDisponibles {
    numeroCertificado: string;
    idSolicitud: number;
    fechaExpedicion: string;
    fechaVencimiento: string;
    paises?: string;   
    idTratadoAcuerdo?: string;
    dropdownSeleccionado?: boolean;
    rfc?: string;
}

export const CERTIFICADO_DISPONIBLES_COLUMNAS = [
    {
        encabezado: 'Numero de certificado',
        clave: (ele: CertificadoDisponibles ): string => ele.numeroCertificado,
        orden: 1
    },
    {
        encabezado: 'Fecha expedicion',
        clave: (ele: CertificadoDisponibles ): string => ele.fechaExpedicion,
        orden: 2
    },
    {
        encabezado: 'Fecha vencimiento',
        clave: (ele: CertificadoDisponibles ): string => ele.fechaVencimiento,
        orden: 3
    }
]
    
