import { CommonModule, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  ConsultaioStore,
  PersonaTerceros,
  SolicitanteComponent,
  SolicitanteQuery,
  formatearFechaSolicitudSinHora,
} from '@ng-mf/data-access-user';
import { DatosManifestacionComponent } from '../../components/datos-manifestacion/datos-manifestacion.component';
import {
  InformacionAcuseValorCoveComponent
} from '../../components/informacion-acuse-valor-cove/informacion-acuse-valor-cove.component';
import { SolicitanteManifestacionComponent } from '../../components/solicitante-manifestacion/solicitante-manifestacion.component';
import { ValorAduanaComponent } from "../../components/valor-aduana/valor-aduana.component";

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    
    CommonModule,
   
    SolicitanteManifestacionComponent,
   
    SolicitanteComponent,
   
    DatosManifestacionComponent,
    ValorAduanaComponent,
    InformacionAcuseValorCoveComponent
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * @description Índice de la pestaña/paso actual.
   * Este valor indica el paso actual en el proceso de formulario.
   * @type {number}
   * @default 1
   */
  indice: number = 1;

    ngOnInit(): void {
    // Lógica de inicialización del componente
  }

    /**
   * @method seleccionaTab
   * @description Selecciona una pestaña específica estableciendo el índice correspondiente.
   * @param {number} i - El índice de la pestaña a seleccionar.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  ngOnDestroy(): void {
    // Lógica de limpieza del componente
  }

}
