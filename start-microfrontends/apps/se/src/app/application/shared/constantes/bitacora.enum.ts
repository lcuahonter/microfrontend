import { Bitacora } from "../models/bitacora.model";
import { ConfiguracionColumna } from "../models/modificacion.enum";

/**
 * Configuración de la tabla de bitácora.
 * @type {ConfiguracionColumna<Bitacora>[]}
 * @description Esta constante define la configuración de las columnas de la tabla de bitácora.
 */
export const TABLA_BITACORA: ConfiguracionColumna<Bitacora>[] = [
    {
        encabezado: 'Tipo Modificación',
        clave: (item: Bitacora) => item.tipoModificacion,
        orden: 1
    },
    {
        encabezado: 'Fecha Modificación',
        clave: (item: Bitacora) => item.fechaModificacion,
        orden: 2
    },
    {
        encabezado: 'Valores Anteriores',
        clave: (item: Bitacora) => item.valoresAnteriores,
        orden: 3
    },
    {
        encabezado: 'Valores Nuevos',
        clave: (item: Bitacora) => item.valoresNuevos,
        orden: 4
    }
];