/**
 * Interfaz que define la estructura de datos para elementos de una lista de bancos.
 * Esta interfaz se utiliza para tipificar objetos que representan entidades bancarias
 * en listas, selectores o componentes de interfaz de usuario.
 * 
 * @interface BancoList
 * @version 1.0.0
 * @since 2024
 * @author Sistema Bancario
 * 
 * @example
 * ```typescript
 * const banco: BancoList = {
 *   id: 1,
 *   name: "Banco Nacional"
 * };
 * 
 * const bancoConIdString: BancoList = {
 *   id: "BCO001",
 *   name: "Banco Internacional"
 * };
 * ```
 */
export interface BancoList {
    /**
     * Identificador único del banco.
     * Puede ser un número entero para identificadores numéricos secuenciales
     * o una cadena de texto para códigos alfanuméricos personalizados.
     * 
     * @type {number | string}
     * @memberof BancoList
     * @required
     * 
     * @example
     * ```typescript
     * // Como número
     * id: 123
     * 
     * // Como string
     * id: "BCO-001"
     * id: "BANK_SANTANDER"
     * ```
     */
    id: number | string;

    /**
     * Nombre descriptivo del banco.
     * Contiene la denominación oficial o comercial de la entidad bancaria
     * que se mostrará en la interfaz de usuario.
     * 
     * @type {string}
     * @memberof BancoList
     * @required
     * 
     * @example
     * ```typescript
     * name: "Banco Santander"
     * name: "BBVA Continental"
     * name: "Banco de Crédito del Perú"
     * ```
     */
    name: string;
}