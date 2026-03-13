import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadoKimberleyComponent } from '../../components/certificado-kimberley/certificado-kimberley.component';
import { ExportacionDeDiamantesEnBrutoService } from '../../services/exportacion-de-diamantes-en-bruto.service';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';


/**
 * @component PasoUnoComponent
 * @description Componente que representa el primer paso de un formulario multipaso.
 * Este componente gestiona la navegación entre diferentes pestañas del formulario.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta cargado desde el store.
   * Contiene datos como modo de solo lectura y valores del formulario.
   */
  public consultaState!: ConsultaioState;
  /**
   * @descripcion
   * Índice de la pestaña seleccionada actualmente.
   * @type {number}
   */
  indice: number = 1;

  /**
    * @description
    * Evento para emitir la acción de guardar.
    */
  @Output() emitGuardarBtn: EventEmitter<boolean> = new EventEmitter<boolean>();


  @ViewChild(SolicitudComponent, { static: false }) solicitudComponent!: SolicitudComponent;
  @ViewChild(CertificadoKimberleyComponent, { static: false }) certificadoKimberleyComponent!: CertificadoKimberleyComponent;



  /**
 * Constructor que inyecta los servicios necesarios para manejar el estado y la consulta.
 * La lógica de inicialización se delega a métodos específicos.
 */
  constructor(
    private exportacionDeDiamantesEnBrutoService: ExportacionDeDiamantesEnBrutoService,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Inicializa el componente suscribiéndose al estado de consulta.
   * Según el estado, carga datos del formulario o marca como respuesta disponible.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
  * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
  * Si la respuesta es válida, activa el indicador de datos cargados.
  */
  guardarDatosFormulario(): void {
    this.exportacionDeDiamantesEnBrutoService
      .getDatosDeLaSolicitud().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.exportacionDeDiamantesEnBrutoService.actualizarEstadoFormulario(resp);
        } else {
          this.esDatosRespuesta = false;
        }
      });
  }

  /**
   * Método para seleccionar una pestaña.
   * Actualiza el índice de la pestaña activa.
   *
   * Número que representa el índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Maneja el evento de guardar emitido por el componente hijo.
   * @param event Evento booleano que indica si se debe guardar.
   */
  handleGuardar(event: boolean): void {
    if (event) {
      this.emitGuardarBtn.emit(true);
    }
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
