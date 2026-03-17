import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Solicitud221601State, Tramite221601Store } from '../../../estados/tramites/tramite221601.store';

@Injectable({
  providedIn: 'root',
})
/** Servicio responsable de la lógica del trámite 221601.  
 *  Maneja la comunicación con APIs y gestión de estado relacionada. */
export class Solocitud221601Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
// URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

/** Constructor que inyecta servicios HTTP y el store del trámite 221601.  
 *  Utilizado para inicializar dependencias necesarias en el componente. */
  constructor(private http: HttpClient, private tramite221601Store: Tramite221601Store,) {
    // Lógica de inicialización si es necesario
  }
/** Actualiza el estado del formulario en el store con los datos proporcionados.  
 *  Establece el régimen seleccionado desde el objeto de estado.
 *  */
actualizarEstadoFormulario(DATOS: Solicitud221601State): void {
this.tramite221601Store.setRegimen(DATOS.regimen);
this.tramite221601Store.setJustificacion(DATOS.justificacion);
this.tramite221601Store.setAduana(DATOS.aduana);
this.tramite221601Store.setOficina(DATOS.oficina);
this.tramite221601Store.setPunto(DATOS.punto);
this.tramite221601Store.setGuia(DATOS.guia);
this.tramite221601Store.setCarro(DATOS.carro);
this.tramite221601Store.setClave(DATOS.clave);
this.tramite221601Store.setClaves(DATOS.claves);
this.tramite221601Store.setVeterinario(DATOS.veterinario);
this.tramite221601Store.setEstablecimiento(DATOS.establecimiento);
this.tramite221601Store.setCapturaMercancia(DATOS.capturaMercancia);
this.tramite221601Store.setMedio(DATOS.medio);
this.tramite221601Store.setVerificacion(DATOS.verificacion);
this.tramite221601Store.setTransporte(DATOS.transporte);
this.tramite221601Store.setEmpresa(DATOS.empresa);
this.tramite221601Store.setDependencia(DATOS.dependencia);
this.tramite221601Store.setBanco(DATOS.banco);
this.tramite221601Store.setLlave(DATOS.llave);
this.tramite221601Store.setFecha(DATOS.fecha);
this.tramite221601Store.setImporte(DATOS.importe);
this.tramite221601Store.setCoordenadas(DATOS.coordenadas);
this.tramite221601Store.setTipoPersona(DATOS.tipoPersona);
this.tramite221601Store.setNombre(DATOS.nombre);
this.tramite221601Store.setPrimerApellido(DATOS.primerApellido);
this.tramite221601Store.setSegundoApellido(DATOS.segundoApellido);
this.tramite221601Store.setSocial(DATOS.social);
this.tramite221601Store.setPais(DATOS.pais);
this.tramite221601Store.setCodigo(DATOS.codigo);
this.tramite221601Store.setEstado(DATOS.estado);
this.tramite221601Store.setMunicipio(DATOS.municipio);
this.tramite221601Store.setColonia(DATOS.colonia);
this.tramite221601Store.setCalle(DATOS.calle);
this.tramite221601Store.setExterior(DATOS.exterior);
this.tramite221601Store.setInterior(DATOS.interior);
this.tramite221601Store.setLada(DATOS.lada);
this.tramite221601Store.setTelefono(DATOS.telefono);
this.tramite221601Store.setCorreoElectronico(DATOS.correoElectronico);
this.tramite221601Store.setTif(DATOS.tif);
  }
/** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 221601. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud221601State> {
    return this.http.get<Solicitud221601State>('assets/json/221601/serviciosExtraordinarios.json');
  }

}