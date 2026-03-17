/**
 * Modelo para el representante legal
 */
export interface RepresentanteLegal {
    // RFC del representante legal
    rfc: string;
    // Nombre del representante legal
    nombre: string;
    // Primer apellido del representante legal
    primerApellido: string;
    // Segundo apellido del representante legal
    segundoApellido?: string;
    // Teléfono del representante legal
    telefono: string;
    // Correo del representante legal
    correo: string;
}
