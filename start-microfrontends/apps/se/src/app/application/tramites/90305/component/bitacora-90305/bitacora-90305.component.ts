/**
 * compo doc
 * @component Bitacora90305Component
 * @description
 * Este componente muestra un registro (bitácora) de modificaciones relacionadas con Prosec.
 * Obtiene datos de `ProsecModificacionServiceTsService` y los muestra en una tabla dinámica.
 * Además, incluye un componente de alerta para notificaciones.
 */
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertComponent } from '@ng-mf/data-access-user';

import { TituloComponent } from '@ng-mf/data-access-user';

import { ConfiguracionColumna } from '@ng-mf/data-access-user';

import { TablaSeleccion } from '@ng-mf/data-access-user';


import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BitacoraModel } from '../../models/prosec-modificacion.model';

import { TEXTO_ALERT } from '../../constantes/prosec-modificacion.enum';

import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
/**
 * compo doc
 * @component Bitacora90305Component
 * @description Muestra un registro de modificaciones de Prosec utilizando una tabla dinámica y alertas.
 * @selector app-bitacora-90305
 * @standalone true
 */
@Component({
  selector: 'app-bitacora-90305',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent, AlertComponent],
  templateUrl: './bitacora-90305.component.html',
  styleUrl: './bitacora-90305.component.scss',
})
export class Bitacora90305Component implements OnInit, OnDestroy {
  /** Subject para destruir el componente */
  private destroy$ = new Subject<void>();
  /** Enum para la selección de tabla */
  TablaSeleccion = TablaSeleccion;

  /** Almacena los datos obtenidos de la bitácora */
  bitacoraData: BitacoraModel [] = [];

  /** Enum para los mensajes de alerta */
  TEXTO_ALERT = TEXTO_ALERT;

  /** Tipo de alerta predeterminado */
  infoAlert = 'alert-info';

  /**
   * constructor
   * @param {ProsecModificacionServiceTsService} listaDomicilios - Servicio para obtener los datos de la bitácora
   */
  constructor(private listaDomicilios: ProsecModificacionServiceTsService) {
    //constructor
  }

  /**
   * Método del ciclo de vida de Angular - inicializa el componente
   */
  ngOnInit(): void {
    this.loadBitacora();
  }

  /**
   * Configuración de columnas de la tabla
   * @type {ConfiguracionColumna<any>[]}
   */
  configuracionTabla: ConfiguracionColumna<BitacoraModel >[] = [
    { encabezado: 'Tipo de modificación', clave: (item: BitacoraModel ) => item.tipoModificacion, orden: 1 },
    { encabezado: 'Fecha de modificación', clave: (item: BitacoraModel ) => item.fechaModificacion, orden: 2 },
    { encabezado: 'Valores anteriores', clave: (item: BitacoraModel ) => item.valoresAnteriores, orden: 3 },
    { encabezado: 'Valores nuevos', clave: (item: BitacoraModel ) => item.valoresNuevos, orden: 4 }
  ];

  /**
   * Obtiene los datos de la bitácora del servicio y actualiza `bitacoraData`
   */
  loadBitacora(): void {
    this.listaDomicilios.getBitacora()
      .pipe(takeUntil(this.destroy$))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((resp:any) => {
        this.bitacoraData = resp;
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
