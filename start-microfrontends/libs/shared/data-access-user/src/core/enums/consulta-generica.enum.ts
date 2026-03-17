import { BodyTablaAcuses, BodyTablaDictamenObservaciones, BodyTablaDictamenes, BodyTablaDocumentos, BodyTablaEnvioDigital, BodyTablaOpinion, BodyTablaOpiniones, BodyTablaRequerimiento, BodyTablaResolucion, BodyTablaTareasTramite, BodyTablaTareasTramiteByAtenderReq } from "../models/shared/consulta-generica.model";

/*
  * ============================
  * Constantes para la bandeja de acuses.
  * Se utiliza para mostrar la tabla de acuses en el componente acuses.
  * 
  */
export const TITULO_ACUSES = 'Acuse(s)';
export const CONSULTA_ACUSES = {
    txtAlerta:
      'Tu solicitud ha sido registrada con el siguiente número de folio:',
    tituloSeccionAcuse: 'Acuse(s)',
    encabezadoTablaAcuse: [
      {
        key: 'id' as keyof BodyTablaAcuses,
        valor: 'No.',
      },
      {
        key: 'documento' as keyof BodyTablaAcuses,
        valor: 'Documento',
      },
      {
        key: 'descargar' as keyof BodyTablaAcuses,
        valor: 'Descargar',
      }
    ],
     encabezadoTablaAcuseSinDescarga: [
      {
        key: 'id' as keyof BodyTablaAcuses,
        valor: 'No.',
      },
      {
        key: 'documento' as keyof BodyTablaAcuses,
        valor: 'Documento',
      },
    ],
    accionesTablaAcuses: [
      {
        tipo: 'descargar',
        label: 'Descargar',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

  /**
   * Constantes para la bandeja de resoluciones.
   * Se utiliza para mostrar la tabla de resoluciones en el componente resoluciones.
   */
  export const CONSULTA_RESOLUCIONES = {
    txtAlerta:
      'Tu solicitud ha sido registrada con el siguiente número de folio:',
    tituloSeccionResolucion: 'Resolucion(es)',
    encabezadoTablaResolucion: [
      {
        key: 'id' as keyof BodyTablaResolucion,
        valor: 'No.',
      },
      {
        key: 'documento' as keyof BodyTablaResolucion,
        valor: 'Documento',
      },
    ],
    accionesTablaResolucion: [
      {
        tipo: 'descargar',
        label: 'Descargar',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

  /**
   * Constantes para la bandeja de requerimientos.
   * Se utiliza para mostrar la tabla de requerimientos en el componente requerimientos.
   */
  export const CONSULTA_REQUERIMIENTOS = {
    encabezadoTablaRequerimiento: [
      {
        key: 'fechaCreacion' as keyof BodyTablaRequerimiento,
        valor: 'Fecha de creación',
      },
      {
        key: 'fechaGeneracion' as keyof BodyTablaRequerimiento,
        valor: 'Fecha de generación',
      },
      {
        key: 'fechaAtencion' as keyof BodyTablaRequerimiento,
        valor: 'Fecha de atención',
      },
      {
        key: 'estatus' as keyof BodyTablaRequerimiento,
        valor: 'Estatus',
      },
    ],
    accionesTablaRequerimiento: [
      {
        tipo: 'descargar',
        label: 'Detalle',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

  /**
   * Constantes para la bandeja de tareas de trámite.
   * Se utiliza para mostrar la tabla de tareas de trámite en el componente tareas de trámite.
   */
  export const CONSULTA_TAREASTRAMITE = {
    encabezadoTablaTareasTramite: [
      {
        key: 'nombreTarea' as keyof BodyTablaTareasTramite,
        valor: 'Nombre de la tarea',
      },
      {
        key: 'nombreUsuarioAsignado' as keyof BodyTablaTareasTramite,
        valor: 'Nombre del usuario al que se le asignó la tarea',
      },
      {
        key: 'claveUsuarioAsignado' as keyof BodyTablaTareasTramite,
        valor: 'Clave de usuario al que se le asignó la tarea',
      },
      {
        key: 'fechaAsignacion' as keyof BodyTablaTareasTramite,
        valor: 'Fecha de asignación',
      },
      {
        key: 'fechaAtencion' as keyof BodyTablaTareasTramite,
        valor: 'Fecha de atención',
      },
    ],
    encabezadoTablaTareasTramiteByAtenderReq: [
      {
        key: 'nombreTarea' as keyof BodyTablaTareasTramiteByAtenderReq,
        valor: 'Nombre de la tarea',
      },
      {
        key: 'fechaAsignacion' as keyof BodyTablaTareasTramiteByAtenderReq,
        valor: 'Fecha de asignación',
      },
      {
        key: 'fechaAtencion' as keyof BodyTablaTareasTramiteByAtenderReq,
        valor: 'Fecha de atención',
      },
    ],
    accionesTablaTareasTramite: [
      {
        tipo: 'descargar',
        label: 'Detalle',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

  /**
   * Constantes para la bandeja de dictámenes.
   * Se utiliza para mostrar la tabla de dictámenes en el componente dictámenes.
   */
  export const CONSULTA_DICTAMENES = {
    encabezadoTablaDictamen: [
      {
        key: 'id' as keyof BodyTablaDictamenes,
        valor: 'No.',
      },
      {
        key: 'fechaCreacion' as keyof BodyTablaDictamenes,
        valor: 'Fecha de creación',
      },
      {
        key: 'fechaGeneracion' as keyof BodyTablaDictamenes,
        valor: 'Fecha de generación',
      },
      {
        key: 'fechaAutorizacion' as keyof BodyTablaDictamenes,
        valor: 'Fecha de autorización',
      },
      {
        key: 'tipo' as keyof BodyTablaDictamenes,
        valor: 'Tipo',
      },
      {
        key: 'estatus' as keyof BodyTablaDictamenes,
        valor: 'Estatus',
      },
      {
        key: 'sentido' as keyof BodyTablaDictamenes,
        valor: 'Sentido',
      },
    ],
    accionesTablaDictamen: [
      {
        tipo: 'descargar',
        label: 'Detalle',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };
 
  /**
   * Constantes para la bandeja de documentos.
   * Se utiliza para mostrar la tabla de documentos en el componente documentos.
   */
  export const CONSULTA_DOCUMENTOS = {
    encabezadoTablaDocumento: [
      {
        key: 'tipoDocumento' as keyof BodyTablaDocumentos,
        valor: 'Tipo de Documento',
      },
      {
        key: 'estatus' as keyof BodyTablaDocumentos,
        valor: 'Estatus',
      },
      {
        key: 'fechaAdjunto' as keyof BodyTablaDocumentos,
        valor: 'Fecha en que adjunto',
      },
      {
        key: 'nombreArchivo' as keyof BodyTablaDocumentos,
        valor: 'Nombre del archivo',
      },
    ],
    accionesTablaDocumento: [
      {
        tipo: 'Acciones',
        label: 'Acciones',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

  /**
   * Constantes para la bandeja de envío digital.
   * Se utiliza para mostrar la tabla de envío digital en el componente envío digital.
   */
  export const CONSULTA_ENVIODIGITAL = {
    encabezadoTablaEnvioDigital: [
      {
        key: 'id' as keyof BodyTablaEnvioDigital,
        valor: 'No.',
      },
      {
        key: 'fecha' as keyof BodyTablaEnvioDigital,
        valor: 'Fecha',
      },
      {
        key: 'transaccion' as keyof BodyTablaEnvioDigital,
        valor: 'Transacción',
      },
      {
        key: 'estado' as keyof BodyTablaEnvioDigital,
        valor: 'Estado',
      },
      {
        key: 'observaciones' as keyof BodyTablaEnvioDigital,
        valor: 'Observaciones',
      },
    ],
    datosTablaEnvioDigitalRevision: [      
    ]
  };

  /**
   * Constantes para la tabla de documentos en el detalle de la opinion.
   * Se utiliza para mostrar la tabla de documentos de la opinion en el componente detalle-opinion.
   * 
   */
  export const CONSULTA_DETALLEOPINIONES = {
    encabezadoTablaOpinion: [
      {
        key: 'id' as keyof BodyTablaOpinion,
        valor: 'No.',
      },
      {
        key: 'descripcion_solicitante' as keyof BodyTablaOpinion,
        valor: 'Documento',
      },
      {
        key: 'nombre_archivo' as keyof BodyTablaOpinion,
        valor: '',
      },
    ],
    accionesTablaOpinion: [
      {
        tipo: 'descargar',
        label: 'Descargar',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

  /**
   * Constantes para la bandeja de opiniones.
   * Se utiliza para mostrar la tabla de opiniones en el componente opiniones.
   * 
   */

  export const CONSULTA_OPINIONES = {
    encabezadoTablaOpinion: [
      {
        key: 'fechaSolicitud' as keyof BodyTablaOpiniones,
        valor: 'Fecha de solicitud',
      },
      {
        key: 'areaSolicitante' as keyof BodyTablaOpiniones,
        valor: 'Área solicitante',
      },
      {
        key: 'areaResponsable' as keyof BodyTablaOpiniones,
        valor: 'Área responsable',
      },
      {
        key: 'estatus' as keyof BodyTablaOpiniones,
        valor: 'Estatus',
      },
    ],
    accionesTablaOpinion: [
      {
        tipo: 'detalle',
        label: 'Detalle',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };

   /**
   * Constantes para la bandeja de observaciones dictamen.
   * Se utiliza para mostrar la tabla de observaciones en el componente detalle dictamen.
   * 
   */
  export const CONSULTA_DICTAMEN_OBSERVACIONES = {
    encabezadoDictamenObservaciones: [
      {
        key: 'fechaObservacion' as keyof BodyTablaDictamenObservaciones,
        valor: 'Fecha de observación',
      },
      {
        key: 'fechaAtencion' as keyof BodyTablaDictamenObservaciones,
        valor: 'Fecha de atención',
      },
      {
        key: 'generadaPor' as keyof BodyTablaDictamenObservaciones,
        valor: 'Generada por',
      },
      {
        key: 'estatusObservacion' as keyof BodyTablaDictamenObservaciones,
        valor: 'Estatus de la observación',
      },
    ],
    accionesTablaOpinion: [
      {
        tipo: 'detalle',
        label: 'Detalle',
        icono: 'bi-arrow-bar-down',
      },
    ],
  };