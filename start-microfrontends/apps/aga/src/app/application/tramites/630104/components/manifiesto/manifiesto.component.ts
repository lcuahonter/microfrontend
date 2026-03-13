/**
 * manifiesto.component.ts
 * Componente que gestiona el manifiesto para el trámite 630303.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, InputCheckComponent, TituloComponent } from "@ng-mf/data-access-user";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite630104State, Tramite630104Store } from '../../estados/tramites/tramite630104.store';
import { CommonModule } from '@angular/common';
import { Tramite630104Query } from '../../estados/queries/tramite630104.query';

/**
 * Componente que gestiona el manifiesto para el trámite 630303.
 * Permite inicializar formularios, obtener datos del estado y manejar el estado del formulario.
 */
@Component({
  selector: 'app-manifiesto',
  standalone: true,
  imports: [CommonModule, InputCheckComponent, TituloComponent, ReactiveFormsModule],
  templateUrl: './manifiesto.component.html',
  styleUrl: './manifiesto.component.scss',
})
export class ManifiestoComponent implements OnInit, OnDestroy {

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
  estadoSeleccionado!: Tramite630104State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * 
   * @param fb - Constructor de formularios reactivos.
   * @param tramite630104Store - Store para manejar el estado del trámite.
   * @param tramite630104Query - Query para consultar el estado del trámite.
   * @param consultaioQuery - Servicio para consultar el estado de la consulta de entrada/salida
   */
  constructor(
    private fb: FormBuilder,
    private tramite630104Store: Tramite630104Store,
    private tramite630104Query: Tramite630104Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario y obtiene el estado del trámite.
   */
  ngOnInit(): void {
     this.tramite630104Query.selectSeccionState$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((estado: Tramite630104State) => {
      this.estadoSeleccionado = estado;
      this.inicializarFormulario();
      this.inicializarEstadoFormulario();
    });
    this.getValorStore();
    this.inicializarFormulario();
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
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.manifiestoFormulario.disable();
    } else {
      this.manifiestoFormulario.enable();
    }
  }


  /**
   * Inicializa el formulario reactivo con valores predeterminados y validaciones.
   */
  inicializarFormulario(): void {
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
    this.tramite630104Store.setTramite630104State(control, VALOR);
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   * Suscribe al observable del estado y actualiza la propiedad `estadoSeleccionado`.
   */
  getValorStore(): void {
    this.tramite630104Query.selectTramite630104State$.pipe(
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