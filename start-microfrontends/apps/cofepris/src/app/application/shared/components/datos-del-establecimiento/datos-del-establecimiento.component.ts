import { CommonModule } from '@angular/common';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notificacion, NotificacionesComponent, REGEX_CORREO_ELECTRONICO, TituloComponent } from '@libs/shared/data-access-user/src';

import { DomicilioState } from '../../estados/stores/domicilio.store';

import { DomicilioStore } from '../../estados/stores/domicilio.store';

import { DomicilioQuery } from '../../../shared/estados/queries/domicilio.query';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/**
 * @description
 * Componente que gestiona los datos del establecimiento.
 * Permite inicializar un formulario reactivo con los datos de la solicitud
 * y realizar operaciones relacionadas con el estado del trámite.
 */
@Component({
  selector: 'app-datos-del-establecimiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, TooltipModule, NotificacionesComponent],
  templateUrl: './datos-del-establecimiento.component.html',
  styleUrl: './datos-del-establecimiento.component.scss',
})
export class DatosDelEstablecimientoComponent implements OnInit, OnDestroy {

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @description
   * Indica si se debe mostrar la notificación.
   */
  mostrarNotificacion: boolean = false;

  /**
   * @description
   * Variable que almacena el índice del elemento que se desea eliminar de la lista de pedimentos.
   * Utilizada para realizar operaciones de eliminación en el arreglo `pedimentos`.
   */
  elementoParaEliminar!: number;

  /**
     * @description
     * Formulario reactivo para capturar los datos del establecimiento.
     */
  datosDelForm!: FormGroup;

  /**
   * @description
   * Objeto que representa una nueva notificación.
   * Se utiliza para mostrar mensajes de alerta o información al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Indica si se ha seleccionado un establecimiento.
   * @property {boolean} establecimientoSeleccionado
   */
  public establecimientoSeleccionado: boolean = false;

  /**
   * @description
   * Variable que controla la visibilidad del modal.
   */
  public modal: string = 'modal';

  /**
   * @description
   * Referencia al elemento de cierre del modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * @description
   * Estado actual de la solicitud.
   */
  public solicitudState!: DomicilioState;

  /**
   * @description
   * Notificador para destruir observables y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @description
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite260603Store Store para gestionar el estado del trámite.
   * @param tramite260603Query Query para obtener datos del estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private domicilioStore: DomicilioStore,
    private domicilioquery: DomicilioQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // Llama al constructor de la clase base Query con el almacén inyectado.
  }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo y sus valores iniciales basados en el estado de la solicitud.
   */
  ngOnInit(): void {
    // Restablecer la selección de establecimiento cuando se inicializa el componente (cambio de pestaña)
    this.domicilioStore.resetEstablecimientoSeleccionado();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    // Suscríbase al estado de selección de establecimientos
    this.domicilioquery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          const PREV_ESTABLECIMIENTO = this.establecimientoSeleccionado;
          this.establecimientoSeleccionado = state.establecimientoSeleccionado;
          this.solicitudState = state;
          
          // Actualizar el estado del formulario cuando cambie la selección del establecimiento.
          if (PREV_ESTABLECIMIENTO !== this.establecimientoSeleccionado && this.datosDelForm) {
            // No interfiera con el modo de solo lectura
            if (!this.esFormularioSoloLectura) {
              if (!this.establecimientoSeleccionado) {
                this.datosDelForm.disable();
              } else {
                this.datosDelForm.enable();
              }
            }
          }
        })
      )
      .subscribe();

    this.inicializarEstadoFormulario();
  }

  /**
     * Evalúa si se debe inicializar o cargar datos en el formulario.  
     * Además, obtiene la información del catálogo de mercancía.
     */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }

  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.datosDelForm.disable();
    } else {
      this.datosDelForm.enable(); 
    } 
    
    if (!this.establecimientoSeleccionado) {
      this.datosDelForm.disable();
    } 
  }

  /**
    * Inicializa el formulario reactivo para capturar el valor de 'registro'.
    * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
    * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
    * con el valor inicial obtenido del store.
    */
  inicializarFormulario(): void {

    this.domicilioquery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.datosDelForm = this.fb.group({
      denominacion: [this.solicitudState?.denominacion, [Validators.required]],
      correoElectronico: [this.solicitudState?.correoElectronico, [Validators.pattern(REGEX_CORREO_ELECTRONICO),]],
    });

    if (!this.establecimientoSeleccionado) {
      this.datosDelForm.disable();
    }
  }

  /**
     * @description
     * Método que actualiza el estado del store con los valores del formulario.
     * @param form Formulario reactivo.
     * @param campo Campo del formulario que se desea actualizar.
     * @param metodoNombre Nombre del método del store que se invocará.
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof DomicilioStore): void {
    const VALOR = form.get(campo)?.value;
    (this.domicilioStore[metodoNombre] as (value: string | number) => void)(VALOR);
  }

  /**
   * @description
   * Método que abre el modal y carga el formulario con los datos predefinidos del representante.
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje:
        'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.mostrarNotificacion = true;
    this.elementoParaEliminar = i;
  }

  /**
   * @description
   * Método que se ejecuta cuando el usuario acepta el modal.
   * Habilita todos los campos del formulario.
   */
  onModalAcceptAction(): void {
    this.domicilioStore.setEstablecimientoSeleccionado(true);
    this.mostrarNotificacion = false;
  }

  /**
   * @description
   * Permite reseleccionar el establecimiento (para casos donde se quiera cambiar).
   */
  reseleccionarEstablecimiento(): void {
    this.domicilioStore.resetEstablecimientoSeleccionado();
  }

  /**
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}