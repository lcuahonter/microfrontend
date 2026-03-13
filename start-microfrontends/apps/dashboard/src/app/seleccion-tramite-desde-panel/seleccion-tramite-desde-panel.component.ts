import { AMBIENTES, OrigenPeticion, TramiteDetails, TramiteStore } from '@ng-mf/data-access-user';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfcSolicitanteComponent } from '@libs/shared/data-access-user/src';
import { RouterModule } from '@angular/router';
import { TituloComponent } from "@ng-mf/data-access-user";
import tramiteDetailsData from '@libs/shared/theme/assets/json/tramiteList.json'
import { DatosServiceService } from '../../../../cofepris/src/app/application/shared/services/datos-service.service';

@Component({
  selector: 'seleccion-tramite-desde-panel',
  templateUrl: './seleccion-tramite-desde-panel.component.html',
  styleUrl: './seleccion-tramite-desde-panel.component.scss',
  imports: [TituloComponent, RouterModule, CommonModule, RfcSolicitanteComponent],
  standalone: true
})
export class SeleccionTramiteDesdePanelComponent implements OnInit {

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

  constructor(
    private tramiteStore: TramiteStore,
    private datosService: DatosServiceService
  ) { }

  ngOnInit(): void {
    if (window.location.host.indexOf('localhost') !== -1) {
      this.ruta = AMBIENTES.LOCALHOST;
    } else {
      this.ruta = AMBIENTES.DESARROLLO
    }

    this.tramiteData = (tramiteDetailsData as TramiteDetails[]).sort((a, b) => {
      if (a.tramite < b.tramite) {
        return -1;
      }
      if (a.tramite > b.tramite) {
        return 1;
      }
      return 0;
    });
  }

  /**
   * Configura el origen de la petición y actualiza el número de procedimiento en los servicios y el store.
   *
   * @param tramite El valor del trámite seleccionado para establecer como número de procedimiento.
   */
  public configuraOrigenPeticion(tramite: any): void {
    this.datosService.procedureNo = tramite;
    this.tramiteStore.procedureNo(tramite);
    this.tramiteStore.establecerOrigenPeticion(OrigenPeticion.NUEVA);
  }
}
