import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent, SubsecuenteIoQuery, TituloComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GuardarServiceT31910 } from '../../services/guardar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TIPO_CONSULTRA_TRAMITE } from '../../constants/solicitud-modificacion-permiso-salida-territorio.enum';
import { TabDesistirSolicitudInfoHistoricaComponent } from '../../components/tab-desistir-solicitud-info-historica/tab-desistir-solicitud-info-historica.component';
import { Tramite31910Store } from '../../estados/stores/tramite31910.store';

/**
 * Este componente representa el paso uno de un trámite.
 * Permite la selección de pestañas mediante el método `seleccionaTab`.
 */
@Component({
  standalone: true,
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  imports: [
    SolicitanteComponent,
    TabDesistirSolicitudInfoHistoricaComponent,
    CommonModule,
    ReactiveFormsModule,
    TituloComponent
  ],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /* Estado actual de la consulta cargado desde el store.
   * Contiene datos como modo de solo lectura y valores del formulario.
   */
  public consultaState!: ConsultaioState;



  /**
   * Índice de la pestaña seleccionada actualmente.
   */
  indice: number = 2;

  @ViewChild('solicitud', { static: false })
  datosSolicitudComponent: TabDesistirSolicitudInfoHistoricaComponent | undefined;

  /**
   * Folio del trámite padre asociado a la solicitud.
   */
  folioTramitePadre: string = '';

  /**
   * Folio del trámite actual.
   */
  folioTramite: string = '';

  /**
    * Folio del trámite padre.
    */
  @Output() folioPadre: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Constructor que inyecta los servicios necesarios para manejar el estado y la consulta.
   * La lógica de inicialización se delega a métodos específicos.
   */
  constructor(
    private service: GuardarServiceT31910,
    private consultaQuery: ConsultaioQuery,
    private subsecuenteQuery: SubsecuenteIoQuery,
    private tramite31910Store: Tramite31910Store
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Inicializa el componente suscribiéndose al estado de consulta.
   * Según el estado, carga datos del formulario o marca como respuesta disponible.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
      })
    if (this.consultaState.parameter === TIPO_CONSULTRA_TRAMITE && this.consultaState.readonly) {
      this.cargaDatosDetalle(this.consultaState.folioTramite);
    } else {
      this.folioTramitePadre = this.subsecuenteQuery.getValue().folioTramite;
      this.folioPadre.emit(this.folioTramitePadre);
      this.tramite31910Store.update({
        folioTramite: this.folioTramitePadre,
        esLecutra: false
      });
    }
  }

  /**
   * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.
   * Si la respuesta es válida, activa el indicador de datos cargados.
   * una vez implementada la funcion del back se debera cambiar la logica para cargar los datos reales.
   */
  cargaDatosDetalle(folioTramite: string): void {
    this.service
      .obtenerDetalleSolicitud(folioTramite)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.folioTramitePadre = resp.datos?.num_folio_original || '';
        this.esDatosRespuesta = true;
        this.tramite31910Store.update({
          justificacion: resp.datos?.justificacion,
          esLecutra: true,
          folioTramitePadre: resp.datos?.num_folio_original || '',
        });
      });
  }

  /**
   * Cambia el índice de la pestaña seleccionada.
   * El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Valida todos los formularios en el componente.
   * @returns si todos los formularios son válidos
   */
  validarTodosLosFormularios(): boolean {
    if (this.indice >= 2 && this.datosSolicitudComponent) {
      this.datosSolicitudComponent.marcarCamposComoTocados();
      return this.datosSolicitudComponent.validarFormulario();
    }
    this.indice = 2;
    return false;
  }

  /**
   * Método de limpieza que se ejecuta al destruir el componente.
   * Finaliza las suscripciones observables utilizando `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
