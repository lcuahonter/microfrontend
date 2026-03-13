import { Observable, throwError } from 'rxjs';
import { AvisoOpcionesDeRadio } from '../models/aviso-catalogo.model';
import { DatoSolicitudStore } from '../estados/tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../models/datos-solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

/**
 * Servicio para gestionar operaciones relacionadas con mercancías desmontadas o sin montar.
 * 
 * Proporciona métodos para:
 * - Obtener opciones de radio para avisos
 * - Actualizar el estado del formulario
 * - Recuperar datos iniciales y completos del formulario
 * 
 * Se comunica con el store para mantener la consistencia del estado de la aplicación.
 */
@Injectable({
  providedIn: 'root',
})
export class MercanciasDesmontadasOSinMontarService {
  /**
   * Constructor para inyección de dependencias
   * @param http Cliente HTTP para realizar peticiones
   * @param datoSolicitudStore Store para gestión del estado de datos de solicitud
   */
  constructor(
    private http: HttpClient,
    private datoSolicitudStore: DatoSolicitudStore
  ) {}

  /**
   * Obtiene las opciones de radio para avisos desde un archivo JSON local
   * 
   * @returns Observable que emite las opciones de radio configuradas
   */
  obtenerAvisoOpcionesDeRadio(): Observable<AvisoOpcionesDeRadio> {
    const RUTA_JSON = 'assets/json/231002/aviso-opciones-de-radio.json';
    
    return this.http.get<AvisoOpcionesDeRadio>(RUTA_JSON).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  /**
   * Actualiza el estado completo del formulario en el store
   * 
   * @param DATOS Objeto con todos los datos del formulario a actualizar
   */
  actualizarEstadoFormulario(DATOS: EstadoDatoSolicitud): void {
    this.datoSolicitudStore.actualizarSolicitudForm(DATOS.solicitudForm);
    this.datoSolicitudStore.actualizarEmpresaReciclaje(DATOS.empresaReciclaje);
    this.datoSolicitudStore.actualizarLugarReciclaje(DATOS.lugarReciclaje);
    this.datoSolicitudStore.actualizarEmpresaTransportista(DATOS.empresaTransportista);
    this.datoSolicitudStore.actualizarPrecaucionesManejo(DATOS.precaucionesManejo);
  }

  /**
   * Obtiene los datos iniciales para el formulario desde un archivo JSON local
   * 
   * @returns Observable que emite los datos iniciales del formulario
   */
  obtenerDatosSolicitudInicial(): Observable<EstadoDatoSolicitud> {
    const RUTA_JSON = 'assets/json/231002/inicializar-formulario-datos.json';
    return this.http.get<EstadoDatoSolicitud>(RUTA_JSON);
  }

  /**
   * Obtiene los datos completos del formulario (incluyendo residuos) desde un archivo JSON local
   * 
   * @returns Observable que emite los datos completos del formulario
   */
  obtenerDatosCompletosFormulario(): Observable<EstadoDatoSolicitud> {
    const RUTA_JSON = 'assets/json/231002/inicializar-formulario-datos-residuos.json';
    return this.http.get<EstadoDatoSolicitud>(RUTA_JSON);
  }
}
