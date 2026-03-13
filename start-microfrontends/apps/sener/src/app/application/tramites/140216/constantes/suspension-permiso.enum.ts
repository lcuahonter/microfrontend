import { PermisosVigentes, PersonasNotificar } from "../models/suspension-permiso.model";
import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Configuración de la tabla de permisos vigentes.
 * @type {ConfiguracionColumna<PermisosVigentes>[]}
 */
export const PERMISOS_VIGENTES_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PermisosVigentes>[] = [
    { encabezado: 'Número resolución', clave: (fila) => fila.numeroResolucion, orden: 1 },
    { encabezado: 'Tipo solicitud', clave: (fila) => fila.tipoSolicitud, orden: 2 },
    { encabezado: 'Régimen', clave: (fila) => fila.regimen, orden: 3 },
    { encabezado: 'Clasificación régimen', clave: (fila) => fila.clasificacionRegimen, orden: 4 },
    { encabezado: 'Periodo de vigencia', clave: (fila) => fila.periodoDeVigencia, orden: 5 },
    { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionArancelaria, orden: 6 },
    { encabezado: 'Unidad de medida', clave: (fila) => fila.unidad, orden: 7 },
    { encabezado: 'NICO', clave: (fila) => fila.nico, orden: 8 },
    { encabezado: 'Descripción NICO', clave: (fila) => fila.nicoDescripcion, orden: 9 },
    { encabezado: 'Acotación', clave: (fila) => fila.acotacion, orden: 10 },
    { encabezado: 'Cantidad autorizada', clave: (fila) => fila.cantidadAutorizada, orden: 11 },
    { encabezado: 'Valor autorizado', clave: (fila) => fila.valorAutorizado, orden: 12 },
    { encabezado: 'Fecha inicio de vigencia de la resolución', clave: (fila) => fila.fechaInicioVigencia, orden: 13 },
    { encabezado: 'Fecha fin de vigencia de la resolución', clave: (fila) => fila.fechaFinVigencia, orden: 14 }
]

/**
 * Formato de la fecha de salida.
 * @type {InputFecha}
 */
export const FECHA_SALIDA = {
    labelNombre: 'Fecha de suspensión',
    required: true,
    habilitado: true,
};

/**
 * Configuración de la tabla de personas a notificar.
 * @type {ConfiguracionColumna<PersonasNotificar>[]}
 */
export const PERSONAS_NOTIFICAR_ENCABEZADO_DE_TABLA: ConfiguracionColumna<PersonasNotificar>[] = [
    { encabezado: 'Nombre', clave: (fila) => fila.nombre, orden: 1 },
    { encabezado: 'Apellido paterno', clave: (fila) => fila.apellidoPaterno, orden: 2 },
    { encabezado: 'Apellido materno', clave: (fila) => fila.apellidoMaterno, orden: 3 },
    { encabezado: 'Correo electrónico', clave: (fila) => fila.correoElectronico, orden: 4 },
    { encabezado: 'País', clave: (fila) => fila.pais, orden: 5 },
    { encabezado: 'Entidad federativa', clave: (fila) => fila.entidadFederative, orden: 6 },
    { encabezado: 'Municipio o Delegación', clave: (fila) => fila.municipioDelegacion, orden: 7 }
]