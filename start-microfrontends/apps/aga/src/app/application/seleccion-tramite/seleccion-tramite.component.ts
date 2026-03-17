import { AMBIENTES, TramiteDetails } from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { APPINJECT } from '../../app.inject';
import pkg from '@package-json';
import tramiteDetailsData from '@libs/shared/theme/assets/json/tramiteList.json'

@Component({
  selector: 'seleccion-tramite',
  templateUrl: './seleccion-tramite.component.html',
})
export class SeleccionTramiteComponent implements OnInit, OnDestroy {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  private readonly appConfig = inject(APPINJECT);
  /**
   * Variable para asingar el endpoint de la ruta
   */
  public ruta: string = '';

  /**
   * Un arreglo que contiene los detalles de varios "Trámites" (procedimientos o procesos).
   * Cada elemento en el arreglo es de tipo `TramiteDetails`.
   * Estos datos se utilizan para gestionar y mostrar información relacionada con diferentes trámites.
   */
  public tramiteData: TramiteDetails[] = [];
  /**
   * Versión actual de la aplicación desde package.json
   */
  version = pkg.version;
    
  ngOnInit(): void {
    if (window.location.host.indexOf('localhost') !== -1) {
      this.ruta = AMBIENTES.LOCALHOST;
    } else {
      this.ruta = AMBIENTES.DESARROLLO
    }

    this.tramiteData = tramiteDetailsData.filter((v) => v.department === "aga") ;
  }

  ngOnDestroy(): void {
    this.tramiteData = [];
  }
  
}
