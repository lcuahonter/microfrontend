import { AgenteAduanal } from "../../models/303/agente-aduanal.model";
import { ControlInventario } from "../../models/303/control-inventario.model";

/**
 * Configuración del encabezado de la tabla de figuras aduanales.
 */
export const CONFIGURACION_ENCABEZADO_FIGURAS = [
    { encabezado: 'Nombre', clave: (item: AgenteAduanal): string => item.nombreAgente, orden: 1 },
    { encabezado: 'Primer apellido', clave: (item: AgenteAduanal): string => item.apellidoPaternoAgente, orden: 2 },
    { encabezado: 'Segundo apellido', clave: (item: AgenteAduanal): string => item.apellidoMaternoAgente, orden: 3 },
    { encabezado: 'Patente/Autorización', clave: (item: AgenteAduanal): string => item.patente, orden: 4 },
    { encabezado: 'Razon Social', clave: (item: AgenteAduanal): string => item.razonSocial ?? '', orden: 5 },
]

/**
 * Enum para las figuras aduanales seleccionadas.
 */
export enum TipoFiguraSeleccionada {
    AgenteAduanal = '1',
    ApoderadoAduanal = '2',
    AgenciaAduanal = '3'
}

/**
 * Configuración del encabezado de la tabla de control de inventarios.
 */
export const CONTROL_INVENTARIOS = [
    { encabezado: 'Nombre del sistema o datos para su identificación', clave: (item: ControlInventario): string => item.nombreSistema, orden: 1 },
    { encabezado: 'Lugar de radicación', clave: (item: ControlInventario): string => item.lugarRadicacion, orden: 2 },
    { encabezado: 'Indique si se trata de un sistema de control de inventarios conforme el anexo 24', clave: (item: ControlInventario): boolean => item.esSistemaControl, orden: 3 },
]