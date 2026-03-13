/**
 * Representa la información de ubicación asociada a una autorización.
 *
 * @interface UbicacionDeAutorizacion
 * 
 * @property {string} rfc - Registro Federal de Contribuyentes asociado a la autorización.
 * @property {string} aduana - Aduana relacionada con la autorización.
 * @property {string} ubicacion - Ubicación específica donde aplica la autorización.
 */
export interface UbicacionDeAutorizacion{
    rfc: string,
    aduana: string,
    ubicacion: string
}