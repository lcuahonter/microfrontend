import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Tramite240411State, Tramite240411Store } from '../estados/tramite240411Store.store';

@Injectable({
  providedIn: 'root',
})
export class PermisoOrdinarioProrrogaImportacionMaterialExplosivoService {
  constructor(private http: HttpClient, private tramite240411Store:Tramite240411Store){
    //
  }
/**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * {Solicitud230902State} DATOS - Datos para actualizar el estado.
   */
  actualizarEstadoFormulario(DATOS: Tramite240411State):void{
    this.tramite240411Store.updateDatosDelTramiteFormState(DATOS.datosDelTramite);
    this.tramite240411Store.updateJustificacionFormulario(DATOS.justificacionTramiteFormState);
    this.tramite240411Store.updatePagoDerechosFormState(DATOS.pagoDerechos);
    this.tramite240411Store.updateDestinatarioFinalTablaDatos(DATOS.destinatarioFinalTablaDatos);
    this.tramite240411Store.updateProveedorTablaDatos(DATOS.proveedorTablaDatos);
    this.tramite240411Store.updateMercanciaTablaDatos(DATOS.merccancialTablaDatos);

  }
  
  /**
   * Obtiene los datos de registro de toma de muestras y mercancías desde un archivo JSON.
   * {Observable<Solicitud230902State>} Observable con los datos de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite240411State>{
    return this.http.get<Tramite240411State>('assets/json/240411/registro_toma_muestras_mercancias.json');
  }
 
}