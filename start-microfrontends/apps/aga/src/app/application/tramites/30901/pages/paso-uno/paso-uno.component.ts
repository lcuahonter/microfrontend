import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosProrrogaMuestrasMercanciasComponent } from '../../components/datos-prorroga-muestras-mercancias/datos-prorroga-muestras-mercancias.component';
import { PagoLineaDeCapturaComponent } from '../../components/pago-linea-de-captura/pago-linea-de-captura.component';
import { RegistroRenovacionesMuestrasMercanciasComponent } from '../../components/registro-renovaciones-muestras-mercancias/registro-renovaciones-muestras-mercancias.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Solicitud30901State } from '../../estados/tramites30901.store';
import { Solocitud30901Service } from '../../services/service30901.service'
import { ViewChild } from '@angular/core';

/**
 * Componente que representa el primer paso de un trámite.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    SolicitanteComponent,
    PagoLineaDeCapturaComponent,
    RegistroRenovacionesMuestrasMercanciasComponent,
    DatosProrrogaMuestrasMercanciasComponent,
    CommonModule,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
})
/**
 * Componente que representa el primer paso de un trámite.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice utilizado para identificar la posición actual en un proceso o lista.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Referencia al componente PagoLineaDeCapturaComponent
   */
  @ViewChild(PagoLineaDeCapturaComponent)
  pagoLineaDeCapturaComponent!: PagoLineaDeCapturaComponent;

  /**
   * Referencia al componente RegistroRenovacionesMuestrasMercanciasComponent
   */
  @ViewChild(RegistroRenovacionesMuestrasMercanciasComponent)
  registroRenovacionesMuestrasMercanciasComponent!: RegistroRenovacionesMuestrasMercanciasComponent;
/** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado de la consulta que se obtiene del store. */
  public consultaState!:ConsultaioState;

  
  /**
 * Constructor del componente `PasoUnoComponent`.
 *
 * Este constructor inyecta los servicios necesarios para obtener el estado de consulta
 * y manejar las operaciones relacionadas con la solicitud 30901.
 *
 * @param {ConsultaioQuery} consultaQuery - Query que expone el estado de la consulta, como el modo solo lectura.
 * @param {Solocitud30901Service} solocitud30901Service - Servicio que gestiona la lógica y operaciones de la solicitud 30901.
 */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud30901Service: Solocitud30901Service
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }
/**
 * Método que se ejecuta al inicializar el componente.
 */
   ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
            this.consultaState = seccionState;
        })).subscribe();
      if(this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    }
  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solocitud30901Service
      .getRegistroRenovacionesMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp: Solicitud30901State) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solocitud30901Service.actualizarEstadoFormulario(resp);
        }
      });
  }
/**
 * Método que se ejecuta cuando el componente se destruye.
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
