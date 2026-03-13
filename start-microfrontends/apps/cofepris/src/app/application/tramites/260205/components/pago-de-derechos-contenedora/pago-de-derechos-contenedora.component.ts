import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import {ID_PROCEDIMIENTO} from '../../constantes/materias-primas.enum';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260205Query } from '../../estados/queries/tramite260205.query';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';
import { ViewChild } from '@angular/core';
/**
 * @component PagoDeDerechosContenedoraComponent
 * 
 * @selector app-pago-de-derechos-contenedora
 * 
 * @description Componente contenedor para la gestión del formulario de pago de derechos. 
 * Este componente utiliza el estado del store `Tramite260205Store` para inicializar y 
 * actualizar el estado del formulario de pago de derechos. Además, se suscribe al estado 
 * de consulta (`ConsultaioQuery`) para determinar si el formulario debe estar en modo 
 * solo lectura.
 * 
 * @standalone true
 * 
 * @imports 
 * - CommonModule: Módulo común de Angular que proporciona directivas y servicios básicos.
 * - PagoDeDerechosComponent: Componente hijo que representa el formulario de pago de derechos.
 * 
 * @templateUrl ./pago-de-derechos-contenedora.component.html
 * 
 * @styleUrl ./pago-de-derechos-contenedora.component.scss
 * 
 * @implements OnDestroy
 * 
 * @remarks Este componente utiliza un `Subject` llamado `destroyNotifier$` para gestionar 
 * la destrucción de observables y evitar fugas de memoria. También define propiedades 
 * públicas como `pagoDerechos` y `esFormularioSoloLectura` para interactuar con el estado 
 * del formulario y su configuración de solo lectura.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnDestroy, OnInit {

  /**
   * Notificador para destruir observables y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos!: PagoDerechosFormState;

  @ViewChild(PagoDeDerechosComponent)
    pagoDeDerechosComponent!: PagoDeDerechosComponent;
  

  /**
   * que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {boolean}
   */
  esFormularioSoloLectura!: boolean;

   /**
       * Identificador único del procedimiento.
       * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
       */
      public readonly idProcedimiento = ID_PROCEDIMIENTO;
    

  /**
   * @constructor
   * @description Constructor que inyecta el store `Tramite260205Store` para gestionar el estado del trámite.
   * Inicializa la propiedad `pagoDerechos` con el valor actual del store.
   *
   * @param tramiteStore - Store que administra el estado del trámite 260214.
   */
  constructor(public tramiteStore: Tramite260205Store, private consultaQuery: ConsultaioQuery, private tramiteQuery:Tramite260205Query
  ) {
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
    this.consultaQuery.selectConsultaioState$
        .pipe(
          takeUntil(this.destroyNotifier$),
        )
        .subscribe((seccionState) => {
          if(!seccionState.create && seccionState.procedureId === '260205') {
            this.esFormularioSoloLectura = seccionState.readonly;
          } 
        });
  }

   ngOnInit():void
  {
    this.tramiteQuery.selectTramiteState$
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((data) => {
            this.pagoDerechos = data.pagoDerechos;
          });
  }

  /**
   * @method updatePagoDerechos
   * @description Actualiza los datos del formulario de pago de derechos en el store del trámite.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   * @returns {void} Este método no retorna ningún valor.
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }
 
  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

  isAnyFieldFilledButNotAll(): boolean {
    return this.pagoDeDerechosComponent.isAnyFieldFilledButNotAll();
  }

  get continuarButtonClicked(): boolean {
  return this.pagoDeDerechosComponent?.continuarButtonClicked ?? false;
}
   /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
