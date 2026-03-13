import { Injectable } from '@angular/core';
import { SEMANA_D } from '../../../enums/constantes-alertas.enum';

@Injectable({
  providedIn: 'root',
})
export class FechasService {

  /**
   * Obtiene el nombre del día de la semana en español.
   * @param {Date} fecha
   * @returns {string} Nombre del día de la semana en español.
   */
  static obtenerNombreDiaSemana(fecha: Date): string {
    const DIA_SEMANA = SEMANA_D;
    return DIA_SEMANA[fecha.getDay()];
  }

  /**
   * Obtener los días entre fechas.
   * @param {string} fechaInicio, fecha final en formato string.
   * @param {string} fechaFinal, fecha final en formato string.
   * @returns {Array<string>} Array con las fechas comprendidas entre la fecha de inicio y la fecha final
   */
  static obtenerDiasEntreFechas(fechaInicio: string, fechaFinal: string, horaInicial: string, horaFinal: string): string[] {
    const INICIO = `${fechaInicio}T${horaInicial}`;
    const FIN = `${fechaFinal}T${horaFinal}`;
    const FECHA_PRINCIPIO = new Date(INICIO);
    const FECHA_FIN = new Date(FIN);    
    
    const DIAS = [];

    while (FECHA_PRINCIPIO <= new Date(FECHA_FIN)) {
      // Formatear la fecha actual en formato Día de la semana, DD/MM/YYYY, HH:MM
      const DIA_SEMANA = FechasService.obtenerNombreDiaSemana(FECHA_PRINCIPIO);
      const DIA = String(FECHA_PRINCIPIO.getDate()).padStart(2, '0');
      const MES = String(FECHA_PRINCIPIO.getMonth() + 1).padStart(2, '0');
      const ANIO = FECHA_PRINCIPIO.getFullYear();
      DIAS.push(`${DIA_SEMANA}, ${DIA}/${MES}/${ANIO}`); // Incrementar la fecha en un día
      FECHA_PRINCIPIO.setDate(FECHA_PRINCIPIO.getDate() + 1);
    }    
    return DIAS;
  }
}
