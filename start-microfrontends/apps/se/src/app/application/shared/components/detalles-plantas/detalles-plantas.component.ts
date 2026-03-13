import { CATALOGO_SI_NO, CATALOGO_SI_NOID, CATALOGO_SI_NOVALUE } from '../../constantes/detalles-plantas.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  Notificacion,
  NotificacionesComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { PlantasSubfabricante } from '../../models/empresas-subfabricanta.model';
import { ComplementarState, ComplementarStore } from '../../../estados/tramites/complementar.store';
import { ComplementarQuery } from '../../../estados/queries/complementar.query';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-detalles-plantas',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,NotificacionesComponent
  ],
  templateUrl: './detalles-plantas.component.html',
  styleUrl: './detalles-plantas.component.scss',
})
/**
 * Componente para gestionar los detalles de las plantas.
 */
export class DetallesPlantasComponent implements OnDestroy {
   /**
   * @description
   * Objeto que representa una notificación de confirmación para agregar servicios.
   * Se utiliza para mostrar modal de confirmación al usuario.
   */
  public notificacionAgregarServicios!: Notificacion;
  /**
   * Lista de plantas seleccionadas.
   * @property {PlantasSubfabricante[]} plantasSeleccionadas
   */
  @Input() plantasSeleccionadas: PlantasSubfabricante[] = [];

  /**
   * Evento emitido al regresar de la vista de plantas.
   * @property {EventEmitter<void>} alRegresarPlantas
   */
  @Output() alRegresarPlantas = new EventEmitter();

  /**
   * Evento emitido al regresar de la vista de plantas.
   * @property {EventEmitter<void>} graduar
   */
  @Output() guadarEvent = new EventEmitter();
  /**
   * Evento para cerrar el popup/modal.
   */
  @Output() cerrarPopup = new EventEmitter<void>();

  /**
   * Notificación para mostrar mensajes al usuario.
   * @property {Notificacion} nuevaNotificacion
   */
  public nuevaNotificacion!: Notificacion;
  /**
   * Formulario para los datos del subcontratista.
   * @property {FormGroup} formularioDatosPlantas
   */
  formularioDatosPlantas!: FormGroup;
  /**
   * Catálogo de opciones de sí/no.
   * @property {any} catalogoSiNo
   */
  catalogoSiNo = CATALOGO_SI_NO;
  /**
   * Catálogo de opciones de sí/no (ID).
   * @property {any} catalogoSiNoId
   */
  catalogoSiNoId = CATALOGO_SI_NOID;

  /**
   * Catálogo de opciones de sí/no (valor).
   * @property {any} catalogoSiNoValue
   */
  catalogoSiNoValue = CATALOGO_SI_NOVALUE;

  /**
   * Obtiene el estado de deshabilitación del formulario desde el store
   */
  get formDisabled(): boolean {
    return this.complementarQuery.getValue().formDisabled || false;
  }

  /**
     * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
     */
    private destroyNotifier$: Subject<void> = new Subject();

  /**
 * Estado actual de la solicitud, utilizado para inicializar y gestionar los datos del formulario de empleados.
 * @property {ComplementarState} solicitudState
 */
  public solicitudState!: ComplementarState;

  /**
   * Constructor para inicializar el formulario de datos del subcontratista.
   * @param fb - FormBuilder para la creación del formulario reactivo.
   */

  /**
   * Constructor de la clase ComplementarPlantaComponent.
   * @param {Location} ubicaccion - Servicio de Angular para manejar la ubicación del navegador.
   */
  constructor(private fb: FormBuilder, private ubicaccion: Location,private complementarStore: ComplementarStore, private complementarQuery: ComplementarQuery) {
    this.inicializarFormularioDatosPlantas();
  }

  /**
   * Inicializa el formulario de datos de las plantas.
   * @returns {void}
   */
  inicializarFormularioDatosPlantas(): void {
    this.complementarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as ComplementarState;
        })
      )
    .subscribe();
    const NOW = new Date();
    const DAY = String(NOW.getDate()).padStart(2, '0');
    const MONTH = String(NOW.getMonth() + 1).padStart(2, '0');
    const YEAR = NOW.getFullYear();
    const CURRENT_DATE = `${DAY}/${MONTH}/${YEAR}`;

    this.formularioDatosPlantas = this.fb.group({
      permaneceMercancia: [this.solicitudState.permaneceMercancia, Validators.required],
      tipoContribuyente: [this.solicitudState.tipoContribuyente, Validators.required],
      opinionSAT: [{ value: 1, disabled: true }, Validators.required],
      fechaOpinion: [CURRENT_DATE, Validators.required],
    });
    this.formularioDatosPlantas.get('fechaOpinion')?.disable();
  }

  /**
   * Emite el evento para regresar de la vista de plantas.
   * @returns {void}
   */
  regresarPlantas(): void {
    this.alRegresarPlantas.emit();
  }

  /**
   * Cambia el valor de 'permaneceMercancia' en el formulario.
   * @param {Catalogo} catalogoSeleccionado - El catálogo seleccionado.
   * @returns {void}
   */
  cambiarPermaneceMerCancia(catalogoSeleccionado: Catalogo): void {
    if (catalogoSeleccionado) {
      this.formularioDatosPlantas.patchValue({
        permaneceMercancia: catalogoSeleccionado.id,
      });
    }
  }

  /**
   * Cambia el valor de 'tipoContribuyente' en el formulario.
   * @param {Catalogo} catalogoSeleccionado - El catálogo seleccionado.
   * @returns {void}
   */
  cambiartipoContribuyente(catalogoSeleccionado: Catalogo): void {
    if (catalogoSeleccionado) {
      this.formularioDatosPlantas.patchValue({
        tipoContribuyente: catalogoSeleccionado.id,
      });
    }
  }

  /**
  * Vuelve a la ubicación anterior en el historial del navegador.
  * @returns {void}
  */
  regrasar(): void {
    this.ubicaccion.back();
  }

  /**
   * Emits the `guardarEvent` to notify listeners that a save action has been triggered.
   *
   * Typically used to signal that the user has requested to save the current state or data.
   */
  guardar(): void {
    if (!this.formularioDatosPlantas.valid) {
      this.notificacionAgregarServicios = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe capturar todos los datos marcados como obligatorios(*)',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.formularioDatosPlantas.markAllAsTouched();
      return;
    }
    
    // Disable the form fields by updating store
    this.complementarStore.setFormDisabled(true);
    
    this.notificacionAgregarServicios = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: 'La operación se realizó exitosamente.',
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Confirma la acción y emite los datos del formulario si es válido, luego cierra el modal.
   */
  confirmacionModal(): void {
    if (this.formularioDatosPlantas.valid && this.notificacionAgregarServicios?.categoria === 'success') {
      this.guadarEvent.emit(this.formularioDatosPlantas.value);
      console.log('DetallesPlantasComponent: Emitting cerrarPopup');
      this.cerrarPopup.emit();
    }
    this.notificacionAgregarServicios = undefined!;
  }

    /**
  * Método que actualiza el store con los valores del formulario.
  * 
  * @param form - Formulario reactivo con los datos actuales.
  * @param campo - El campo que debe actualizarse en el store.
  * @param metodoNombre - El nombre del método en el store que se debe invocar.
  */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof ComplementarStore): void {
    const VALOR = form.get(campo)?.value;
    (this.complementarStore[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
