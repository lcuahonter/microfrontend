import { ConsultaObservacionesTabla } from "../models/dictamen.model";

export const CONFIGURACION_OBSERVACIONES = [
  {
    encabezado: 'Fecha de generación',
    clave: (ele: ConsultaObservacionesTabla): string | undefined => ele.fechaGeneracion,
    orden: 1,
  },
  {
    encabezado: 'Fecha de atención',
    clave: (ele: ConsultaObservacionesTabla): string | undefined => ele.fechaAtencion,
    orden: 2,
  },
  {
    encabezado: 'Generada por',
    clave: (ele: ConsultaObservacionesTabla): string | undefined => ele.generadaPor,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (ele: ConsultaObservacionesTabla): string | undefined => ele.estatus,
    orden: 4,
  },
  {
    encabezado: 'Detalle',
    clave: (ele: ConsultaObservacionesTabla): string | undefined => ele.detalle,
    orden: 5,
  },
];
