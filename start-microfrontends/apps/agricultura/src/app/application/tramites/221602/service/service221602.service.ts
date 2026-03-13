import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Solicitud221602State, Tramite221602Store } from '../../../estados/tramites/tramite221602.store';

@Injectable({
  providedIn: 'root',
})
/** Servicio responsable de la lógica del trámite 221602.  
 *  Maneja la comunicación con APIs y gestión de estado relacionada. */
export class Solocitud221602Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
// URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

/** Constructor que inyecta servicios HTTP y el store del trámite 221602.  
 *  Utilizado para inicializar dependencias necesarias en el componente. */
  constructor(private http: HttpClient, private tramite221602Store: Tramite221602Store,) {
    // Lógica de inicialización si es necesario
  }
/** Actualiza el estado del formulario en el store con los datos proporcionados.  
 *  Establece el régimen seleccionado desde el objeto de estado.
 *  */
actualizarEstadoFormulario(DATOS: Solicitud221602State): void {
this.tramite221602Store.setRegimen(DATOS.regimen);
this.tramite221602Store.setJustificacion(DATOS.justificacion);
this.tramite221602Store.setAduana(DATOS.aduana);
this.tramite221602Store.setOficina(DATOS.oficina);
this.tramite221602Store.setPunto(DATOS.punto);
this.tramite221602Store.setGuia(DATOS.guia);
this.tramite221602Store.setCarro(DATOS.carro);
this.tramite221602Store.setMedio(DATOS.medio);
this.tramite221602Store.setVerificacion(DATOS.verificacion);
this.tramite221602Store.setTransporte(DATOS.transporte);
this.tramite221602Store.setEmpresa(DATOS.empresa);
this.tramite221602Store.setClave(DATOS.clave);
this.tramite221602Store.setDependencia(DATOS.dependencia);
this.tramite221602Store.setBanco(DATOS.banco);
this.tramite221602Store.setLlave(DATOS.llave);
this.tramite221602Store.setFecha(DATOS.fecha);
this.tramite221602Store.setImporte(DATOS.importe);

  }
/** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 221602. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud221602State> {
    return this.http.get<Solicitud221602State>('assets/json/221602/serviciosExtraordinarios.json');
  }

}