export interface RegistroDeSolicitudesTabla {
    movimiento: string;
    cuenta: string;
    rfc: string;
    persona: string;
    numeroDeCuenta: string;
    sucursal: string;
    institucionDeCredito: string;
    numero: string;
    radicaCuenta: string;
    estado: string;
    domicilio: string;
}

export interface DatosGenerales {
    data: DATOS[];
}

export interface DATOS {
    aduanaAdicional: string;
    nombre: string;
    federalDeContribuyentes: string;
    tipoDePersona: string;
}

export interface Sociedad {
    id: string;
    descripcion: string;
}