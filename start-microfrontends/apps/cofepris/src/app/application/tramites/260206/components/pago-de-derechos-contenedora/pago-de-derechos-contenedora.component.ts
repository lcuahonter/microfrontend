import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';
import { Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { ViewChild } from '@angular/core';

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
   * Estado del formulario de pago de derechos.
   * 
   * Contiene la información y configuración relacionada con el formulario de pago.
   * 
   * @type {PagoDerechosFormState}
   */
  public pagoDerechos!: PagoDerechosFormState;

  idProcedimiento: number = 260206;


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
   * Constructor de la clase que inicializa el estado de pago de derechos y suscribe el estado general del formulario.
   * 
   * @param {Tramite260206Store} tramiteStore - Almacén del estado del trámite 260206, del cual se obtiene el estado inicial del formulario de pago.
   * @param {ConsultaioQuery} consultaQuery - Consulta que proporciona el estado general del formulario.
   */
  constructor(public tramiteStore: Tramite260206Store, private consultaQuery: ConsultaioQuery, private tramiteQuery:Tramite260206Query){
   this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
   this.consultaQuery.selectConsultaioState$
           .pipe(
             takeUntil(this.destroyNotifier$),
           )
           .subscribe((seccionState) => {
             if(!seccionState.create && seccionState.procedureId === '260206') {
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
   * Actualiza la información de pago de derechos en el store del trámite.
   *
   * Este método toma un objeto `PagoDerechosFormState` que contiene los datos actualizados
   * del formulario de pago de derechos y llama al método `updatePagoDerechos` del `tramiteStore`
   * para persistir los cambios.
   *
   * @param event Un objeto `PagoDerechosFormState` con los datos actualizados del formulario de pago.
   * @returns void
   */
  updatePagoDerechos(event: PagoDerechosFormState): void{
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
