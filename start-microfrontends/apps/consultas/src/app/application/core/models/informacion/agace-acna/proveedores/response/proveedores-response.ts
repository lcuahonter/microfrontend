/**
 * Representa la información de un proveedor obtenida desde el servicio.
 *
 * @interface Proveedores
 * 
 * @property {string} rfc - Registro Federal de Contribuyentes del proveedor.
 * @property {string} razon_social - Nombre completo, Denominación o Razón Social del Proveedor.
 * @property {string} rfc_industria - RFC de la Industria Automotriz asociada al proveedor.
 * @property {string} razon_social_industria - Denominación o Razón Social de la Industria Automotriz asociada.
 * @property {string} domicilio_fiscal - Domicilio Fizcal Automotriz.
 * @property {string} norma - Norma .
 * @property {string} programa_inmex - Número de programa INMEX.
 * @property {string} programa_prosec - Número de programa PROSEC.
 * @property {string} aduanas - Aduanas en las que opera.
 * @property {string} fecha_inicio Fecha Inicio Relación
 * @property {string} fecha_fin - Fecha de finalización o vigencia de la relación con el proveedor.
 */
export interface Proveedores {
    rfc: string;
    razon_social: string;
    rfc_industria: string;
    razon_social_industria: string;
    domicilio_fiscal: string;
    norma: string;
    programa_inmex: string;
    programa_prosec: string;
    aduanas: string;
    fecha_inicio: string;
    fecha_fin: string;
}