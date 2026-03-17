import { Solicitud32201State, Tramite32201Store } from '../estados/tramite32201.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  /**
   * @constructor
   * @param http HttpClient para realizar solicitudes HTTP.
   * @param tramite32201Store Store para manejar el estado del trámite 32201.
   */
  constructor(private http: HttpClient, private tramite32201Store: Tramite32201Store) { }

  /**
       * Actualiza el estado global del formulario con los datos proporcionados.
       * @param DATOS Objeto con los datos del formulario de tipo Solicitud32201State.
       */
  actualizarEstadoFormulario(DATOS: Solicitud32201State): void {
    this.tramite32201Store.setRegimen_0(DATOS.regimen_0);
    this.tramite32201Store.setRegimen_1(DATOS.regimen_1);
    this.tramite32201Store.setRegimen_2(DATOS.regimen_2);
    this.tramite32201Store.setRegimen_3(DATOS.regimen_3);
    this.tramite32201Store.setManifiesto(DATOS.manifiesto);
    this.tramite32201Store.setRadio_1(DATOS.radio_1);
    this.tramite32201Store.setRadio_2(DATOS.radio_2);
    this.tramite32201Store.setRadio_3(DATOS.radio_3);
    this.tramite32201Store.setValorAduana(DATOS.valorAduana);
    this.tramite32201Store.setTextoGenerico10(DATOS.textoGenerico10);
    this.tramite32201Store.setTextoGenerico11(DATOS.textoGenerico11);
    this.tramite32201Store.setTextoGenerico12(DATOS.textoGenerico12);
    this.tramite32201Store.setTextoGenerico13(DATOS.textoGenerico13);
    this.tramite32201Store.setTextoGenerico14(DATOS.textoGenerico14);
    this.tramite32201Store.setTextoGenerico15(DATOS.textoGenerico15);
    this.tramite32201Store.setTextoGenerico16(DATOS.textoGenerico16);
    this.tramite32201Store.setTextoGenerico17(DATOS.textoGenerico17);
    this.tramite32201Store.setTextoGenerico18(DATOS.textoGenerico18);
    this.tramite32201Store.setTextoGenerico19(DATOS.textoGenerico19);
    this.tramite32201Store.setTextoGenerico20(DATOS.textoGenerico20);
    this.tramite32201Store.setTextoGenerico21(DATOS.textoGenerico21);
    this.tramite32201Store.setTextoGenerico22(DATOS.textoGenerico22);
    this.tramite32201Store.setTextoGenerico23(DATOS.textoGenerico23);
    this.tramite32201Store.setTextoGenerico24(DATOS.textoGenerico24);

  }
  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consultaDatos.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<Solicitud32201State> {
    return this.http.get<Solicitud32201State>('assets/json/32201/consultaDatos.json');
  }

}
