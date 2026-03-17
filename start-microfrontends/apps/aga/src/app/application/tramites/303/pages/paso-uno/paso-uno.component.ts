import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite303Store, Tramite303StoreService } from '../../../../core/estados/tramites/tramite303.store';
import { DespachoMercanciasSolicitudComponent } from '../../components/despacho-mercancias-solicitud/despacho-mercancias-solicitud.component';
import { Tramite303Query } from '../../../../core/queries/tramite303.query';

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ''
})
export class PasoUnoComponent implements OnInit {
  /** Índice de la pestaña seleccionada */
  indice: number = 1;
  /** Notificador de destrucción del componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Datos del trámite consultado */
  public tramiteConsultado?: Tramite303Store;
  /** Referencia al componente hijo DespachoMercanciasSolicitudComponent */
  @ViewChild(DespachoMercanciasSolicitudComponent) ComponentDespacho!: DespachoMercanciasSolicitudComponent;
  /**
   * Constructor del componente.
   * @param tramite303State Estado del trámite.
   * @param tramite303Query Consulta del trámite.
   */
  constructor(
    private tramite303State: Tramite303StoreService,
    private tramite303Query: Tramite303Query,
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.tramite303Query.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.indice = seccionState.indice;
          this.tramiteConsultado = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Método para seleccionar una pestaña.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tramite303State.setIndice(this.indice);
  }

  validarFormularioPadre(): boolean {
    return this.ComponentDespacho.validarFormulario();
  }

}
