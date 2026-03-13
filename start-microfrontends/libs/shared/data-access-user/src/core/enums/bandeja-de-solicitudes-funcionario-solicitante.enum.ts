import { BandejaDeTareasPendientes } from "../models/shared/bandeja-de-tareas-pendientes.model";
import { ConfiguracionColumna } from "../models/shared/configuracion-columna.model";

/* Configuración de columnas para la bandeja de solicitudes del funcionario.
 * Define los encabezados y claves de acceso para mostrar los datos de tareas pendientes en la tabla.
 */
export const TABLADECONFIGUACIONFUNCIONARIO: ConfiguracionColumna<BandejaDeTareasPendientes>[] = [
    {
        encabezado: 'Folio trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.folioTramite,
        orden: 1,
    },
    {
        encabezado: 'Tipo de trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.tipoDeTramite,
        orden: 2,
    },
    {
        encabezado: 'Nombre tarea',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.nombreDeLaTarea,
        orden: 3,
    },
    {
        encabezado: 'Fecha de asignación de tarea',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.fechaDeAsignacion,
        orden: 4,
    },
    {
        encabezado: 'Información adicional',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.informacion_adicional,
        orden: 5,
    },
    {
        encabezado: 'Fecha inicio trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.fechaInicioTramite,
        orden: 6,
    },
    {
        encabezado: 'Días hábiles transcurridos',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.diasHabilesTranscurridos,
        orden: 7,
    },
    {
        encabezado: 'Requerimiento',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.requerimiento,
        orden: 8,
    },
    {
        encabezado: 'Observacion',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.observacion,
        orden: 9,
    },
    {
        encabezado: 'Opinión',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.opinion,
        orden: 10,
    }
];
/* Configuración de columnas para la bandeja de solicitudes del solicitante.
 * Define los encabezados y claves de acceso para mostrar los datos de tareas pendientes en la tabla.
 */
    export const TABLADECONFIGUACIONSOLICITANTE: ConfiguracionColumna<BandejaDeTareasPendientes>[] = [
    {
        encabezado: 'Folio trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.folioTramite,
        orden: 1,
    },
    {
        encabezado: 'Tipo de trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.tipoDeTramite,
        orden: 2,
    },
    {
        encabezado: 'Nombre tarea',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.nombreDeLaTarea,
        orden: 3,
    },
    {
        encabezado: 'Fecha de asignación',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.fechaDeAsignacion,
        orden: 4,
    },
    {
        encabezado: 'Estado de trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.estadoDeTramite,
        orden: 5,
    },
    {
        encabezado: 'Departamento',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.departamento,
        orden: 6,
    },
    {
        encabezado: 'Número de procedimiento',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.numeroDeProcedimiento,
        orden: 7,
    },
    {
        encabezado: 'Origin',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.origin,
        orden: 8,
    },
    {
        encabezado: 'Fecha inicio trámite',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.fechaInicioTramite,
        orden: 9,
    },
    {
        encabezado: 'Días hábiles transcurridos',
        clave: (artículo:BandejaDeTareasPendientes) => artículo.diasHabilesTranscurridos,
        orden: 10,
    }
];