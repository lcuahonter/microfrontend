import { NormaResolucion, Pais, Tratado } from './model/normas-resoluciones.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NormasResolucionesService {
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los tratados
   */
  getTratados(): Observable<Tratado[]> {
    const TRATADOS: Tratado[] = [
      { clave: 'TLCUE', descripcion: 'TLCUE' },
      { clave: 'TLCAELC', descripcion: 'TLCAELC' },
      { clave: 'ACE 6', descripcion: 'Acuerdo de Complementación Económica No. 6 México-Argentina' },
      { clave: 'ACE 51', descripcion: 'ACE 51' },
      { clave: 'ACE 53', descripcion: 'ACE 53' },
      { clave: 'ACE 55', descripcion: 'ACE 55' },
      { clave: 'PAR 4', descripcion: 'PAR 4' },
      { clave: 'SGP', descripcion: 'SGP' },
      { clave: 'TLC JAPON', descripcion: 'TLC JAPON' },
      { clave: 'TLC PERÚ', descripcion: 'TLC PERÚ' },
      { clave: 'TLC URUGUAY', descripcion: 'TLC URUGUAY' },
      { clave: 'CAM', descripcion: 'CAM' },
      { clave: 'T-MEC', descripcion: 'T-MEC' },
      { clave: 'ALADI', descripcion: 'ALADI' },
      { clave: 'TLC MEX-CR', descripcion: 'TLC MEX-CR' },
      { clave: 'TLC MEX-NIC', descripcion: 'TLC MEX-NIC' },
      { clave: 'OMC', descripcion: 'OMC' },
      { clave: 'UNILATERAL', descripcion: 'UNILATERAL' },
      { clave: 'TLC MEX-CHILE', descripcion: 'TLC MEX-CHILE' }
    ];
    return of(TRATADOS);
  }

  /**
   * Obtiene los países
   */
  getPaises(): Observable<Pais[]> {
    const PAISES: Pais[] = [
      { clave: 'MEX', descripcion: 'MÉXICO' },
      { clave: 'USA', descripcion: 'ESTADOS UNIDOS' },
      { clave: 'CAN', descripcion: 'CANADÁ' },
      { clave: 'ARG', descripcion: 'ARGENTINA (REPUBLICA)' },
      { clave: 'CHL', descripcion: 'CHILE' },
      { clave: 'PER', descripcion: 'PERÚ' }
    ];
    return of(PAISES);
  }

  /**
   * Obtiene los criterios
   */
  getCriterios(): Observable<string[]> {
    const CRITERIOS: string[] = [
      'A', 'B', 'C', 'D', 'E', 'No Aplica', 'A5A', 'A5B', 'AVI', 'E1', 'E2'
    ];
    return of(CRITERIOS);
  }

  /**
   * Busca las normas y resoluciones
   * @param _tratado El tratado
   * @param _bloquePais El bloque de país
   * @returns Un Observable de NormaResolucion[]
   */
  buscarNormasResoluciones(_tratado: string, _bloquePais: string): Observable<NormaResolucion[]> {
    const MOCK_DATA: NormaResolucion[] = [
      { 
        id: 1, 
        criterio: 'B', 
        norma: 'N/A', 
        calificacion: 'Negado',
        primerParrafo: 'registro de productos elegibles para preferencias y concesiones arancelarias',
        segundoParrafo: 'el Anexo VI del Acuerdo de Complementación Económica No.6 celebrado entre la República Argentina y los Estados Unidos Mexicanos, para la obtención de certificados de origen ALADI, señala que el producto que la empresa comercializa no cumple con la norma de origen.',
        tercerParrafo: 'resuelve: la solicitud de registro de productos elegibles para preferencias y concesiones arancelarias procederá una vez que cumpla con los supuestos que señala el Anexo VI del Acuerdo de Complementación Económica No.6 celebrado entre la República Argentina y los Estados Unidos Mexicanos.',
        cuartoParrafo: '1 y 2 del Anexo VI del Acuerdo de Complementación Económica No. 6 celebrado entre la República Argentina y los Estados Unidos Mexicanos. Se emite la presente resolución en auxilio del ejercicio de facultades de la Licenciada Lorena Urrea García, Titular de la Dirección General de Facilitación Comercial y de Comercio Exterior, adscrita a la Unidad de Normatividad, Competitividad y Competencia de la Secretaría de Economía, con fundamento en los artículos 8, 16, primer párrafo y 90 de la',
        exportadorAutorizado: false,
        parrafoExportadorAutorizado: 'N/A',
        asunto: 'No procede solicitud de registro de productos elegibles para preferencias y concesiones arancelarias',
        activo: true
      },
      { id: 2, criterio: 'B', norma: 'Protocolo Adicional No. 15, Anexo VI, Artículo 4, inciso b)', calificacion: 'Aprobado' },
      { id: 3, criterio: 'D', norma: 'Protocolo Adicional No. 15, Anexo VI, Artículo 5, inciso )', calificacion: 'Aprobado' },
      { id: 4, criterio: 'No Aplica', norma: 'N/A', calificacion: 'Negado' },
      { id: 5, criterio: 'B', norma: 'N/A', calificacion: 'Negado' },
      { id: 6, criterio: 'D', norma: 'N/A', calificacion: 'Negado' },
      { id: 7, criterio: 'C', norma: 'N/A', calificacion: 'Negado' },
      { id: 8, criterio: 'E', norma: 'N/A', calificacion: 'Negado' },
      { id: 9, criterio: 'A', norma: 'Protocolo Adicional No. 15, Anexo VI, Artículo 4, inciso a)', calificacion: 'Aprobado' },
      { id: 10, criterio: 'C', norma: 'Protocolo Adicional No. 15, Anexo VI, Artículo 4, inciso c)', calificacion: 'Aprobado' }
    ];
    return of(MOCK_DATA);
  }
}
