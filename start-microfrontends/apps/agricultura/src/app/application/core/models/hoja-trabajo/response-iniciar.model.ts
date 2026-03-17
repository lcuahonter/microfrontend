import { HojaTrabajoModel } from './hoja-trabajo.model';

export interface ResponseIniciarModel {
  codigo: string;
  mensaje: string;
  datos: HojaTrabajoModel;
}
