import { RespuestaConsulta, SolicitudForm } from '../../models/solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud6101Store } from '../../estados/solicitud6101.store';
import { SolicitudCatologo } from '../../models/solicitud.model';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';
/**
 * Servicio `SolicitudService` encargado de manejar las solicitudes relacionadas con los catálogos de trámites.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Servicio `SolicitudService` encargado de manejar las solicitudes relacionadas con los catálogos de trámites.
 */
export class SolicitudService {
  /**
   * @description Constructor del servicio donde se inyecta el cliente HTTP para realizar peticiones.
   * @param http Cliente HTTP proporcionado por Angular para realizar solicitudes a recursos externos.
   */
  constructor(
    public http: HttpClient,
    private solicitud6101Store: Solicitud6101Store
  ) {
    // Inicialización si se requiere.
  }

  /**
   * @description Método que obtiene el catálogo de solicitudes desde un archivo JSON local.
   * Utiliza el cliente HTTP para realizar la petición y gestiona errores en caso de que ocurran.
   * @returns {Observable<SolicitudCatologo>} Un observable con la respuesta del archivo JSON.
   */
  public conseguirSolicitudCatologo(): Observable<SolicitudCatologo> {
    return this.http
      .get<SolicitudCatologo>('assets/json/6101/solicitud-catalogo.json')
      .pipe(
        catchError((error) => {
          // En caso de error, se lanza la excepción utilizando `throwError`.
          return throwError(() => error);
        })
      );
  }

  /**
 * Obtiene los datos del formulario desde un archivo JSON local.
 * Un `Observable` que emite los datos del formulario en el formato `GuardarDatosFormulario`.
 */
  guardarDatosFormulario(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(
      'assets/json/6101/solicitud-datos.json'
    );
  }

  /**
 * Actualiza el estado del formulario en el store con los valores recibidos.
 * Objeto de tipo `GuardarDatosFormulario` que contiene la información a actualizar.
 */
  actualizarEstadoFormulario(respuesta: SolicitudForm): void {
    this.solicitud6101Store.actualizarAduanaAux(respuesta.aduanaAux);
    this.solicitud6101Store.actualizarCapitulo(respuesta.capitulo);
    this.solicitud6101Store.actualizarCapituloII(respuesta.capituloII);
    this.solicitud6101Store.actualizarCapituloIII(respuesta.capituloIII);
    this.solicitud6101Store.actualizarDescDetalladaMercancia(
      respuesta.descDetalladaMercancia
    );
    this.solicitud6101Store.actualizarFraccionI(respuesta.fraccionI);
    this.solicitud6101Store.actualizarFraccionII(respuesta.fraccionII);
    this.solicitud6101Store.actualizarFraccionIII(respuesta.fraccionIII);
    this.solicitud6101Store.actualizarJuntaTecnicaDerivada(
      respuesta.juntaTecnicaDerivada
    );
    this.solicitud6101Store.actualizarManifiestosSeleccionados(
      respuesta.manifiestosSeleccionados
    );
    this.solicitud6101Store.actualizarNombreComercialMercancia(
      respuesta.nombreComercialMercancia
    );
    this.solicitud6101Store.actualizarNumeroPedimento(
      respuesta.numeroPedimento
    );
    this.solicitud6101Store.actualizarPartida(respuesta.partida);
    this.solicitud6101Store.actualizarPartidaII(respuesta.partidaII);
    this.solicitud6101Store.actualizarPartidaIII(respuesta.partidaIII);
    this.solicitud6101Store.actualizarSubdivision(respuesta.subdivision);
    this.solicitud6101Store.actualizarSubdivisionII(respuesta.subdivisionII);
    this.solicitud6101Store.actualizarSubdivisionIII(respuesta.subdivisionIII);
    this.solicitud6101Store.actualizarSubpartida(respuesta.subpartida);
    this.solicitud6101Store.actualizarSubpartidaII(respuesta.subpartidaII);
    this.solicitud6101Store.actualizarSubpartidaIII(respuesta.subpartidaIII);
  }
}
