/**
 * manifiesto.component.ts
 * Componente que gestiona el manifiesto para el trámite 630307.
 */
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TituloComponent } from '@ng-mf/data-access-user';

import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MANIFIESTO_DECLARACION_TEXTO } from '../../enum/retorno-importacion-temporal.enum';
import { Tramite630307Query } from '../../estados/tramite630307.query';

import { Tramite630307State, Tramite630307Store } from '../../estados/tramite630307.store';
/**
 * Componente que gestiona el manifiesto para el trámite 630307.
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
   * Estado seleccionado del trámite 630307.
   */
  estadoSeleccionado!: Tramite630307State;

  /**
   * Suscripción a los cambios en el formulario reactivo.
   */
  private subscription: Subscription = new Subscription();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param fb - Constructor de formularios reactivos.
   * @param tramite630307Store - Store para manejar el estado del trámite.
   * @param tramite630307Query - Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite630307Store: Tramite630307Store,
    private tramite630307Query: Tramite630307Query,
   private consultaioQuery: ConsultaioQuery
  ) {
  this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
    this.inizializarFormulario();
      })
    )
    .subscribe();
  }
  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene el estado del trámite.
   */
  ngOnInit(): void {
    this.getValorStore();
    this.inizializarFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
    this.inizializarFormulario();
    }
  }

   /**
   * @method
   * @name guardarDatosFormulario
   * @description
   * Inicializa los formularios y obtiene los datos de la tabla.
   * Dependiendo del modo de solo lectura (`esFormularioSoloLectura`),
   * deshabilita o habilita todos los formularios del componente.
   * Si el formulario está en modo solo lectura, todos los formularios se deshabilitan para evitar modificaciones.
   * Si no está en modo solo lectura, todos los formularios se habilitan para permitir la edición.
   *
   * @returns {void}
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
    this.tramite630307Store.setTramite630307State(control, VALOR);
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   */
  getValorStore(): void {
    this.tramite630307Query.selectTramite630307State$.pipe(
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
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}