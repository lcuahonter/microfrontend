import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { CambioDeModalidadComponent } from '../../component/cambio-de-modalidad/cambio-de-modalidad.component';
import { CambioModalidadService } from '../../service/cambio-modalidad.service';
import { SECCIONES_TRAMITE_80208 } from '../../constantes/solicitud-modalidad.enums';
import { SeccionLibStore } from '@ng-mf/data-access-user';

/**
 * @component PasoUnoComponent
 * @description
 * Componente para el asistente de solicitud.
 * Este componente gestiona la navegación entre los pasos del formulario de solicitud.
 * @component PasoUnoComponent
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrls ./paso-uno.component.scss
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
   * @property {number} indice
   * @description Índice de la pestaña actualmente seleccionada.
   * @default 1
   */
  indice: number = 1;

  /**
   * Indica si existen datos de respuesta para mostrar en el formulario.
   * @type {boolean}
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado de la consulta actual, contiene la información relevante del solicitante.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Referencia al componente SolicitanteComponent.
   * Permite interactuar con el formulario del solicitante y acceder a sus métodos y propiedades.
   * @type {SolicitanteComponent}
   */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

    /**
     * Referencia al componente CambioDeModalidadComponent.
     * Permite interactuar con el formulario de cambio de modalidad.
     */
    @ViewChild('cambioDeModalidadRef') cambioDeModalidadComponent!: CambioDeModalidadComponent;

  /**
   * @constructor
   * @description Constructor que inicializa el store de la sección.
   * @param {SeccionLibStore} seccionStore - Servicio para manejar el estado de las secciones.
   */
  constructor(
    public seccionStore: SeccionLibStore,
    public consultaQuery: ConsultaioQuery,
    public modalidadService: CambioModalidadService,
  ) {

  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de consulta y, dependiendo de si hay actualización, obtiene los datos del formulario o marca que existen datos de respuesta.
   * También asigna las secciones del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState.update || this.consultaState.readonly) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    });

    this.asignarSecciones();
  }

  /**
   * @method guardarDatosFormulario
   * @description
   * Obtiene los datos de la solicitud desde el servicio y actualiza el estado del formulario.
   * Si la respuesta es válida, marca que existen datos de respuesta y actualiza el estado del formulario.
   * Utiliza takeUntil para evitar fugas de memoria al destruir el componente.
   */
  guardarDatosFormulario(): void {
    this.modalidadService
      .getDatosDeLaSolicitudData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.modalidadService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @property {Array<{ index: number; title: string; component: string; }>} seccionesDeLaSolicitud
   * @description Lista de pasos dentro del formulario con sus respectivos componentes.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Cambio de modalidad', component: 'cambio-de-modalidad' },
  ];

  /**
   * @event tabChanged
   * @description Evento emitido al cambiar de pestaña.
   * @type {EventEmitter<number>}
   */
  @Output() tabChanged = new EventEmitter<number>();

  /**
   * @method seleccionaTab
   * @description Cambia el índice de la pestaña seleccionada y emite el evento `tabChanged`.
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }

  /**
   * @method asignarSecciones
   * @description Método privado que asigna las secciones del formulario y establece su estado inicial.
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_80208
    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (Object.prototype.hasOwnProperty.call(PREDETERMINADO.PASO_1, LLAVE_SECCION)) {
        // @ts-expect-error - fix this
        SECCIONES.push(PREDETERMINADO.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(true);
      }
    }
    this.seccionStore.establecerSeccion([true]);
    this.seccionStore.establecerFormaValida([true]);
  }

  /**
   * Valida todos los formularios del paso uno.
   * 
   * @method validarFormularios
   * @description
   * Este método valida tanto el formulario del solicitante como el formulario de cambio de modalidad.
   * Para el formulario del solicitante, verifica que existe y que es válido. Si es inválido, marca todos los campos como tocados.
   * Para el componente de cambio de modalidad, ejecuta su método de validación interno.
   * Si cualquiera de los formularios es inválido o no existe, retorna false.
   * 
   * @returns {boolean} True si todos los formularios son válidos, false en caso contrario.
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

    if (this.cambioDeModalidadComponent) {
      if (!this.cambioDeModalidadComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Libera recursos y evita fugas de memoria completando el notificador de destrucción.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}