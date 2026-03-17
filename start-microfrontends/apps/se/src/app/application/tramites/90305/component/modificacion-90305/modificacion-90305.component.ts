/**
 * component Modification90305Component
 * @description
 * Este componente gestiona la modificación de datos en el trámite 90305.
 * Contiene múltiples subcomponentes que representan diferentes secciones del proceso de modificación.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosPasos, ListaPasosWizard, PASOS } from '@ng-mf/data-access-user';

import { ConsultadDomicilios90305Component } from '../consultad-domicilios-90305/consultad-domicilios-90305.component';
import { ListaDomicilios90305Component } from '../lista-domicilios-90305/lista-domicilios-90305.component';
import { Mercancias90305Component } from '../mercancias-90305/mercancias-90305.component';
import { ModificacionInfo90305Component } from '../modificacion-info-90305/modificacion-info-90305.component';
import { Plantas90305Component } from '../plantas-90305/plantas-90305.component';
import { ProductorIndirecto90305Component } from '../productorIndirecto-90305/productorIndirecto-90305.component';
import { ProsecModificacionModel } from '../../models/prosec-modificacion.model';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { Sector90305Component } from '../sector-90305/sector-90305.component';

/**
 * selector app-modification-90305
 * @standalone true
 */
@Component({
  selector: 'app-modificacion-90305',
  standalone: true,
  imports: [
    CommonModule,
    ConsultadDomicilios90305Component,
    ListaDomicilios90305Component,
    Plantas90305Component,
    Sector90305Component,
    Mercancias90305Component,
    ProductorIndirecto90305Component,
    ModificacionInfo90305Component,
  ],
  templateUrl: './modificacion-90305.component.html',
  styleUrl: './modificacion-90305.component.scss',
})
export class Modificacion90305Component implements OnInit {
  /**
   * Lista de todos los domicilios
   * @type {ProsecModificacionModel[]}
   */
   allDomicilios: ProsecModificacionModel[] = [];
   /**
    * Lista de domicilios agregados por el usuario
    * @type {ProsecModificacionModel[]}
    */
  personaparas: ProsecModificacionModel[] = [];
/**
 * Constructor del componente Modificacion90305Component
 * @param {ProsecModificacionServiceTsService} listaDomicilios - Servicio para
 */
  constructor(private listaDomicilios: ProsecModificacionServiceTsService) {}
/**
 * Inicializa el componente Modificacion90305Component
 * @description
 * Este método se ejecuta al inicializar el componente y se encarga de obtener la lista
 */

 ngOnInit(): void {
    this.listaDomicilios.getListaDomicilios().subscribe((resp) => {
      this.allDomicilios = resp;
    });
  }
/**
 * 
 * @param _ - Un objeto que representa el domicilio a agregar
 * @description Agrega un domicilio a la lista de domicilios agregados por el usuario.
 */
agregarDomicilio(_: unknown) {
  if (this.allDomicilios.length > 0) {
    this.personaparas = [...this.personaparas, { ...this.allDomicilios[0] }];
  }
}

  /** Lista de pasos del asistente de modificación */
  pasos: ListaPasosWizard[] = PASOS;
  /** Índice actual del asistente */
  indice: number = 1;
  /** Datos relacionados con los pasos del asistente */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
}
