import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Cupos120201State, Tramite120201Store } from '../../../../estados/tramites/tramite120201.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CuposService } from '../../services/cupos/cupos.service';
import { ExpedicionCertificadosAsignacionDirectaComponent } from '../../../../shared/components/expedicion-certificados-asignacion-directa/expedicion-certificados-asignacion-directa.component';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { StoreValues } from '../../models/cupos.model';
import { Tramite120201Query } from '../../../../estados/queries/tramite120201.query';

/**
 * Componente para gestionar el paso uno del trámite.
 */
@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.scss'
})
export class DatosComponent implements OnInit, OnDestroy {
  /** 
   * Configuración del formulario para la persona moral 
   */
  persona: FormularioDinamico[] = [];

  /** 
   * Configuración del formulario para el domicilio fiscal 
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Referencia al componente de expedición de certificados para asignación directa.
   * @type {ExpedicionCertificadosAsignacionDirectaComponent}
   */
  @ViewChild(ExpedicionCertificadosAsignacionDirectaComponent) expedicionCertificadosAsignacionDirectaComponent!: ExpedicionCertificadosAsignacionDirectaComponent;


  /**   * Referencia al componente de solicitante.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Evento que se emite para indicar si se debe mostrar un error directo en el formulario.
   * @type {EventEmitter<boolean>}
   * @description Este evento se utiliza para notificar al componente padre si se debe mostrar un error directo en el formulario.
   */
  @Output() mostrarErrorDirecto: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Evento que se emite para indicar si se debe mostrar un error en el número de folio de asignación.
   * @type {EventEmitter<{mostrarError: boolean, valor: string}>}
   * @description Este evento se utiliza para notificar al componente padre si se debe mostrar un error en el número de folio de asignación.
   */
  @Output() mostrarNumFolioAsignacionErrorDirecto: EventEmitter<{ mostrarError: boolean, valor: string }> = new EventEmitter<{ mostrarError: boolean, valor: string }>();

  /**
   * Evento que se emite para indicar si se debe mostrar un error al agregar datos.
   * @type {EventEmitter<boolean>}
   * @description Este evento se utiliza para notificar al componente padre si se debe mostrar un error al agregar datos.
   */
  @Output() mostrarAgregarErrorDirecto: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Estado de la consulta, utilizado para manejar el estado del formulario.
   */
  public consultaState!: ConsultaioState;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de la sección de expedición de certificados para asignación.
  */
  expedicionCertificadoAsignacionState!: Cupos120201State
  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   * @param consultaQuery - Consulta para obtener el estado de la consulta.
   * @param tramite120201Store - Almacén para gestionar el estado del trámite 120201.
   * @param cuposService - Servicio para gestionar los cupos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite120201Store: Tramite120201Store,
    private tramite120201Query: Tramite120201Query,
    private cuposService: CuposService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario(this.consultaState.id_solicitud);
      this.tramite120201Store.setIdSolicitud(this.consultaState.id_solicitud);
    } else {
      this.esDatosRespuesta = true;
    }
    this.tramite120201Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.expedicionCertificadoAsignacionState = seccionState;
        })
      )
      .subscribe();

  }
  /**
   * Mapa de métodos para actualizar el estado del store.
   */
  public storeMethodMap: Record<string, (campo: string, value: unknown) => void> = {
    asignacionOficioNumeroForm: (campo, v) =>
      this.tramite120201Store.setAsignacionOficioNumeroForm(campo, v),

    representacionFederalForm: (campo, v) =>
      this.tramite120201Store.setRepresentacionFederalForm(campo, v),

    controlMontosAsignacionForm: (campo, v) =>
      this.tramite120201Store.setControlMontosAsignacionForm(campo, v),

    asignacionDatosForm: (campo, v) =>
      this.tramite120201Store.setAsignacionDatosForm(campo, v),

    cupoDescripcionForm: (campo, v) =>
      this.tramite120201Store.setCupoDescripcionForm(campo, v),

    distribucionSaldoForm: (campo, v) =>
      this.tramite120201Store.setDistribucionSaldoForm(campo, v)
  };

  /** Método para establecer valores en el store basado en el evento recibido.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del store.
   */
  setValoresStore(event: {
    formGroupName: string;
    campo: string;
    valor: unknown;
    storeStateName: string;
  }): void {

    const { formGroupName: FORM_GROUP_NAME, campo: CAMPO, valor: VALOR } = event;

    const SELECTED_STORE = this.storeMethodMap[FORM_GROUP_NAME];

    if (!SELECTED_STORE) {
      return;
    }
    SELECTED_STORE(CAMPO, VALOR);
  }

  /** Método para actualizar múltiples valores en el store.
   * @param data - Objeto que contiene los valores a actualizar en el store.
   */
  updateStoreValues(data: StoreValues): void {
    (Object.keys(data) as Array<keyof StoreValues>).forEach(key => {
      const SETTER_NAME = `set${key.charAt(0).toUpperCase() + key.slice(1)}`;
      if (
        SETTER_NAME in this.tramite120201Store &&
        typeof (this.tramite120201Store as unknown as Record<string, unknown>)[SETTER_NAME] === 'function'
      ) {
        (this.tramite120201Store as unknown as Record<string, (value: StoreValues[typeof key]) => void>)[SETTER_NAME](data[key]);
      }
    });
  }

  /**
   * Método para guardar los datos del formulario.
   * Realiza una llamada al servicio `solicitudService` para obtener los datos del registro de solicitud.
   * @returns {void}
   */
  guardarDatosFormulario(id_solicitud: string): void {
    this.cuposService
      .getMostrarSolicitud(id_solicitud).pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.cuposService.reversePayload(resp['datos'] as unknown as Record<string, unknown>);
          this.tramite120201Store.update(state => ({
            ...state,
            ...{ ...(this.cuposService.reversePayload(resp as unknown as Record<string, unknown>)) } as Record<string, unknown>
          }));
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
   * Muestra un error directo en el formulario.
   * @param event - Indica si se debe mostrar un error directo.
   */
  mostrarErrorEvent(event: boolean): void {
    this.mostrarErrorDirecto.emit(event);
  }

  /**
   * Muestra un error en el número de folio de asignación.
   * @param event - Indica si se debe mostrar un error en el número de folio de asignación.
   */
  mostrarNumFolioAsignacionErrorEvent(event: { mostrarError: boolean, valor: string }): void {
    this.mostrarNumFolioAsignacionErrorDirecto.emit(event);
  }

  /**
   * Valida los formularios del componente.
   * @returns {boolean} - Indica si todos los formularios son válidos.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }


    if (this.expedicionCertificadosAsignacionDirectaComponent) {
      if (!this.expedicionCertificadosAsignacionDirectaComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }
  /**
   * Muestra un error al agregar datos.
   * @param event - Indica si se debe mostrar un error al agregar.
   */
  mostrarAgregarErrorEvento(event: boolean): void {
    this.mostrarAgregarErrorDirecto.emit(event);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}