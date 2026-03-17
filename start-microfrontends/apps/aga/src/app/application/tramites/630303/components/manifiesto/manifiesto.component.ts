/**
 * manifiesto.component.ts
 * Componente que gestiona el manifiesto para el trámite 630303.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite630303State, Tramite630303Store } from '../../estados/tramite630303.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MANIFIESTO_DECLARACION_TEXTO } from '../../enum/retorno-importacion-temporal.enum';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite630303Query } from '../../estados/tramite630303.query';
/**
 * Componente que gestiona el manifiesto para el trámite 630303.
 * Permite inicializar formularios, obtener datos del estado y manejar el estado del formulario.
 */
@Component({
  selector: 'app-manifiesto',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule],
  templateUrl: './manifiesto.component.html',
  styleUrl: './manifiesto.component.scss',
})
export class ManifiestoComponent implements OnInit, OnDestroy {
    /**
     * Texto de declaración de manifiesto reutilizable.
     */
    manifiestoDeclaracionTexto = MANIFIESTO_DECLARACION_TEXTO;
  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Formulario reactivo para gestionar el manifiesto.
   */
  manifiestoFormulario!: FormGroup;

  /**
   * Estado seleccionado del trámite 630303.
   */
  estadoSeleccionado!: Tramite630303State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Tramite630303State;

  /**
   * Constructor del componente.
   * Inicializa las dependencias necesarias y establece la suscripción reactiva para 
   * monitorear el estado de consulta. Automáticamente configura el formulario según
   * el modo de solo lectura detectado desde el estado de consulta.
   * 
   * @param fb - Constructor de formularios reactivos de Angular para crear y manejar formularios.
   * @param tramite630303Store - Store para actualizar y mantener el estado del trámite 630303.
   * @param tramite630303Query - Query para observar y consultar el estado del trámite 630303.
   * @param consultaioQuery - Query para obtener el estado de consulta y determinar el modo de solo lectura.
   * 
   * @description El constructor establece inmediatamente una suscripción reactiva que:
   * - Observa cambios en el estado de consulta
   * - Actualiza la propiedad esFormularioSoloLectura según el valor readonly
   * - Inicializa automáticamente el estado del formulario según el modo detectado
   * 
   * @memberof ManifiestoComponent
   */
  constructor(
    private fb: FormBuilder,
    private tramite630303Store: Tramite630303Store,
    private tramite630303Query: Tramite630303Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
     this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if (this.manifiestoFormulario) {
            this.inicializarEstadoFormulario();
          }
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   * Si es solo lectura, desactiva los campos y carga los datos; si no, los activa.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inizializarFormulario();
    }
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos según corresponda.
   */
  guardarDatosFormulario(): void {
    this.inizializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.manifiestoFormulario.disable();
    } else {
       this.manifiestoFormulario.enable();
    }
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene el estado del trámite.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inizializarFormulario(): void {
    this.manifiestoFormulario = this.fb.group({
      declaracion: [this.estadoSeleccionado?.['declaracion'], Validators.required]
    });
  }

  /**
   * Actualiza un valor específico en el store del trámite.
   * 
   * @param FormGroup - Formulario reactivo.
   * @param control - Nombre del control cuyo valor se actualizará en el store.
   */
  setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite630303Store.setTramite630303State(control, VALOR);
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630303Query.selectTramite630303State$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data) => {
        this.estadoSeleccionado = data;
      }
    );
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}