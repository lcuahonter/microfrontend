import { DatosDelInmueble104State, DatosDelInmueble104Store } from '../../../core/estados/tramites/tramite104.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Servicio para lógica de Depósito Fiscal Manufactura de Vehículos.
 * Actualiza el estado del formulario y obtiene datos iniciales.
 */
@Injectable({
  providedIn: 'root'
})
export class DepositoFiscalManufacturaVehiculosApiService {

  /**
   * Constructor del servicio.
   * 
   * @param http Servicio HttpClient para realizar peticiones HTTP.
   * @param datosDelInmueble104Store Store para manejar el estado de los datos del inmueble.
   * 
   * La inicialización específica se realizará en los métodos correspondientes
   * según sea necesario para mantener el principio de responsabilidad única.
   */
  constructor(private http: HttpClient, private datosDelInmueble104Store: DatosDelInmueble104Store) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

 
  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * 
   * @param DATOS Objeto que contiene el estado actualizado del formulario.
   * 
   * Este método actualiza los campos de fomento a la exportación y dirección
   * en el store correspondiente.
   */
  actualizarEstadoFormulario(DATOS: DatosDelInmueble104State): void {
    this.datosDelInmueble104Store.setFomentoExportacion(DATOS.fomentoExportacion); // Actualiza el campo de fomento a la exportación
    this.datosDelInmueble104Store.setDireccion(DATOS.direccion); // Actualiza el campo de dirección
  }

  
  /**
   * Obtiene los datos iniciales para el formulario desde un archivo JSON local.
   * 
   * @returns Observable con el estado inicial del formulario (DatosDelInmueble104State).
   * 
   * Este método realiza una petición HTTP GET para obtener los datos iniciales
   * necesarios para inicializar el formulario de trámite 104.
   */
  obtenerDatosInicialesFormulario(): Observable<DatosDelInmueble104State> {
    return this.http.get<DatosDelInmueble104State>('assets/json/104/inicializar_formulario.json');
  }
}
