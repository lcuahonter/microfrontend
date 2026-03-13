/**
 * component Mercancias90305Component
 * @description
 * Este componente muestra una tabla dinámica con información sobre mercancías 
 * relacionadas con Prosec. Los datos se obtienen del servicio `ProsecModificacionServiceTsService`.
 */

import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TituloComponent } from '@ng-mf/data-access-user';

import { TablaSeleccion } from '@ng-mf/data-access-user';


import { ConfiguracionColumna } from '@ng-mf/data-access-user';

import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

import { MercanciasModel } from '../../models/prosec-modificacion.model';

/**
 * selector app-mercancias-90305
 * @standalone true
 */
@Component({
  selector: 'app-mercancias-90305',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
  ],
  templateUrl: './mercancias-90305.component.html',
  styleUrl: './mercancias-90305.component.scss',
})
export class Mercancias90305Component implements OnInit ,OnDestroy {
   /** Subject para destruir el componente */
    private destroy$ = new Subject<void>();
  mercanciasForm!:FormGroup;
  /**
   * compo doc
   * @constructor
   * @param {ProsecModificacionServiceTsService} mercancias - Servicio para obtener la lista de mercancías
   */
  constructor(private mercancias: ProsecModificacionServiceTsService) {
    //constructor
  }

  /** Enum de selección de tabla */
  TablaSeleccion = TablaSeleccion;
  
  /** Lista de mercancías obtenidas del servicio */
  mercanciasProd: MercanciasModel [] = [];

  /**
   * Configuración de las columnas de la tabla dinámica
   * @type {ConfiguracionColumna<MercanciasModel >[]}
   */
  configuracionTabla: ConfiguracionColumna<MercanciasModel >[] = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: MercanciasModel ) => item.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Clave del sector',
      clave: (item: MercanciasModel ) => item.claveDelSector,
      orden: 2,
    },
    {
      encabezado: 'Estatus',
      clave: (item: MercanciasModel ) => item.eStatus,
      orden: 3,
    },
  ];

  /**
   * Método del ciclo de vida de Angular - inicializa el componente y carga las mercancías
   */
  ngOnInit():void {
    this.loadMercancias();
  }

  /**
   * Obtiene la lista de mercancías del servicio y las almacena en `mercanciasProd`
   */
  loadMercancias(): void {
    this.mercancias.getMercancias()
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp) => {
      this.mercanciasProd = resp;
    });
  }
  /*
   * Método del ciclo de vida de Angular - destruye el componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}