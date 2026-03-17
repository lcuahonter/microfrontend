import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { map } from 'rxjs';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Tramite40403Query } from '../../estados/tramite40403.query';
import { Tramite40403Service } from '../../estados/tramite40403.service';
import { Tramite40403Store } from '../../estados/tramite40403.store';

/**
 * Componente para gestionar el paso uno del asistente de solicitud.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para inicializar el formulario reactivo.
   * @param tramite40403Service - Servicio para interactuar con la API relacionada con el trámite.
   * @param tramite40403Store - Almacén para gestionar el estado del trámite.
   * @param tramite40403Query - Consulta para obtener datos del estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite40403Service: Tramite40403Service,
    private tramite40403Store: Tramite40403Store,
    private tramite40403Query: Tramite40403Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de la consulta y, si hay datos actualizados, llama al método para obtener los datos de la consulta.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();
  
    if (this.consultaDatos.update) {
      this.fetchGetDatosConsulta();
    }
  }

  /**
   * Método para obtener los datos de la consulta del servicio y actualizar el estado del store.
   * Se suscribe al observable del servicio y actualiza el store con los datos obtenidos.
   */
  public fetchGetDatosConsulta(): void {
    this.tramite40403Service
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.tramite40403Store.establecerClaveFolioCAAT(
            respuesta.datos.claveFolioCAAT
          );
          this.tramite40403Store.establecerCveFolioCaat(
            respuesta.datos.cveFolioCaat
          );
          this.tramite40403Store.establecerDescripcionTipoCaat(
            respuesta.datos.descripcionTipoCaat
          );
          this.tramite40403Store.establecerTipoDeCaatAerea(
            respuesta.datos.tipoDeCaatAerea
          );
          this.tramite40403Store.establecerIdeCodTransportacionAerea(
            respuesta.datos.ideCodTransportacionAerea
          );
          this.tramite40403Store.establecerCodIataIcao(
            respuesta.datos.codIataIcao
          );
        }
      });
     
  }

  /**
   * Selecciona la pestaña especificada.
   *
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Establece el valor de un campo en el store del trámite.
   *
   * @param form - El formulario del cual se obtiene el valor.
   * @param campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
