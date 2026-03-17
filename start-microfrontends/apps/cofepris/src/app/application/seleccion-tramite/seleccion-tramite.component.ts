import { AMBIENTES, TramiteDetails, TramiteStore } from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import pkg from '@package-json';
import tramiteDetailsData from '@libs/shared/theme/assets/json/tramiteList.json';
import { DatosServiceService } from '../shared/services/datos-service.service';


/**
 * Componente para la selección del trámite.
 * 
 * @export
 * @class SeleccionTramiteComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-seleccion-tramite',
  templateUrl: './seleccion-tramite.component.html',
})
export class SeleccionTramiteComponent implements OnInit {

  /**
   * Variable para asignar el endpoint de la ruta.
   * 
   * @type {string}
   * @memberof SeleccionTramiteComponent
   */
  public ruta = '';
  /**
   * Constructor del componente.
   * Inyecta el servicio DatosServiceService para compartir información del trámite seleccionado entre componentes.
   * @param datosService Servicio para gestionar y almacenar el número de trámite seleccionado.
   */
  constructor(private datosService: DatosServiceService, private tramiteStore: TramiteStore) {}
  
    /**
     * Un arreglo que contiene los detalles de varios "Trámites" (procedimientos o procesos).
     * Cada elemento en el arreglo es de tipo `TramiteDetails`.
     * Estos datos se utilizan para gestionar y mostrar información relacionada con diferentes trámites.
     */
    public tramiteData: TramiteDetails[] = [];
  
  /**
   * Método que se ejecuta al iniciar el componente.
   * 
   * @memberof SeleccionTramiteComponent
   */
  /**
   * Versión actual de la aplicación desde package.json
   */
  version = pkg.version;
  ngOnInit(): void {
    if (window.location.host.indexOf('localhost') !== -1) {
      this.ruta = AMBIENTES.LOCALHOST;
    } else {
      this.ruta = AMBIENTES.DESARROLLO;
    }
    
    this.tramiteData = tramiteDetailsData.filter((v) => v.department === "cofepris") ;
  }
  /**
   * Maneja el evento de clic en el enlace de trámite.
   * Asigna el valor del trámite seleccionado a la propiedad 'procedureNo' del servicio DatosServiceService,
   * permitiendo que otros componentes accedan a este valor.
   * @param tramite Valor del trámite seleccionado.
   */
  onTramiteClick(tramite: any) {
    this.datosService.procedureNo = tramite;
    this.tramiteStore.procedureNo(tramite);
  }
}