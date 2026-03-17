import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ProgramasReporte } from '../models/programas-reporte.model';

/**
 * Configuración de columnas para la tabla de programas de reporte.
 */
export const SOLICITUD_CONFIGURACION_TABLA: ConfiguracionColumna<ProgramasReporte>[] = [
  {
    encabezado: 'Número/Registro de programa',
    clave: (item: ProgramasReporte) => item.folioPrograma,
    orden: 1,
  },
  {
    encabezado: 'Tipo programa',
    clave: (item: ProgramasReporte) => item.tipoPrograma,
    orden: 2,
  },
  {
    encabezado: 'Modalidad',
    clave: (item: ProgramasReporte) => item.modalidad,
    orden: 3,
  },
  {
    encabezado: 'Estatus',
    clave: (item: ProgramasReporte) => item.estatus,
    orden: 4,
  },
];