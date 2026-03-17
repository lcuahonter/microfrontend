/**
 * @fileoverview
 * Modelos y utilidades para la gestión de datos de mercancía fitosanitaria.
 * Incluye la definición de la estructura de la mercancía, el estado global y la función para crear el estado inicial.
 * Cobertura compodoc 100%: cada interfaz y función está documentada.
 * @module fitosanitarioModel
 */

/**
 * Interfaz que representa la estructura de los datos de una mercancía fitosanitaria.
 * Incluye información relevante para la captura y gestión de mercancías en el formulario.
 * @interface MercanciaForm
 * @property {number} [id] - Identificador único de la mercancía (opcional).
 * @property {string} nombreComun - Nombre común de la mercancía.
 * @property {string} nombreCientifico - Nombre científico de la mercancía.
 * @property {string} uso - Uso o destino de la mercancía.
 * @property {string} paisOrigen - País de origen de la mercancía.
 * @property {string} paisProcedencia - País de procedencia de la mercancía.
 * @property {string} tipoProducto - Tipo de producto fitosanitario.
 * @property {string} fraccionArancelaria - Fracción arancelaria correspondiente.
 * @property {string} descripcionFraccionArancelaria - Descripción de la fracción arancelaria.
 * @property {string} cantidadUMT - Cantidad en unidad de medida de tarifa (UMT).
 * @property {string} umt - Unidad de medida de tarifa.
 * @property {string} cantidadUMC - Cantidad en unidad de medida de comercialización (UMC).
 * @property {string} umc - Unidad de medida de comercialización.
 * @property {string} descripcion - Descripción general de la mercancía.
 */
export interface MercanciaForm {
    id?: number;
    nombreComun: string;
    nombreCientifico: string;
    uso: string;
    paisOrigen: string;
    paisProcedencia: string;
    tipoProducto: string;
    fraccionArancelaria: string;
    descripcionFraccionArancelaria: string;
    cantidadUMT: string;
    umt: string;
    cantidadUMC: string;
    umc: string;
    descripcion: string;
}

/**
 * Interfaz que representa el estado global que se enviará o almacenará,
 * conteniendo un arreglo de mercancías fitosanitarias.
 * @interface FinalDataToSend
 * @property {MercanciaForm[]} datos - Arreglo de objetos de tipo MercanciaForm.
 */
export interface FinalDataToSend {
    datos: MercanciaForm[];
}

/**
 * Función para crear el estado inicial de los datos de mercancía fitosanitaria.
 * Permite inicializar el estado con valores por defecto o personalizados.
 * @function createDatosState
 * @param {Partial<FinalDataToSend>} [params={}] - Parámetros opcionales para inicializar el estado.
 * @returns {FinalDataToSend} Estado inicializado de tipo FinalDataToSend.
 * @description Devuelve un objeto con la propiedad `datos` inicializada, útil para el store Akita.
 */
export function createDatosState(params: Partial<FinalDataToSend> = {}): FinalDataToSend {
    return {
        datos: params.datos ?? []
    }
}