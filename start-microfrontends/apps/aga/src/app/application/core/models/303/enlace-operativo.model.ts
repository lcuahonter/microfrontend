/**
 * Modelo que representa un enlace operativo.
 */
export interface EnlaceOperativo {
    /**
     * RFC del enlace operativo.
     */
    rfc: string
    /**
     * Nombre del enlace operativo.
     */
    nombre: string
    /**
     * Apellido Paterno del enlace operativo.
     */
    apellidoMaterno: string
    /**
     * Apellido Materno del enlace operativo.
     */
    apellidoPaterno: string
    /**
     * Cargo del enlace operativo.
     */
    cargoPuesto: string
    /**
     * Ciudad del enlace operativo.
     */
    ciudad: string
    /**
     * Teléfono del enlace operativo.
     */
    telefono: string
    /**
     * Correo Electrónico del enlace operativo.
     */
    correoElectronico: string
    /**
     * Indica si el enlace operativo es suplente.
     */
    suplente: boolean
}