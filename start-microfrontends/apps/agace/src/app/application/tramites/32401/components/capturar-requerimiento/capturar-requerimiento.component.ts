import {
  CatalogoSelectComponent,
  CatalogosSelect,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud32401State,
  Tramite32401Store,
} from '../../estados/tramite32401.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AutoridadService } from '../../services/autoridad.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite32401Query } from '../../estados/tramite32401.query';

/**
 * Componente que captura los detalles del requerimiento.
 * Incluye inicialización de formularios y gestión de estados.
 */
@Component({
  /**
   * Selector del componente en el HTML.
   */
  selector: 'app-capturar-requerimiento',
  /**
   * Indica que el componente es autónomo (standalone).
   */
  standalone: true,
  /**
   * Lista de módulos y componentes necesarios para el funcionamiento del componente.
   */
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
  ],
  /**
   * Ruta del archivo HTML que define la estructura del componente.
   */
  templateUrl: './capturar-requerimiento.component.html',
  /**
   * Ruta del archivo CSS que contiene los estilos del componente.
   */
  styleUrl: './capturar-requerimiento.component.css',
})
/**
 * Componente que captura los detalles del requerimiento.
 * Incluye inicialización de formularios y gestión de estados.
 */
export class CapturarRequerimientoComponent implements OnInit, OnDestroy {
  /** Lista de aduanas disponible. */
  aduanaLista: CatalogosSelect = {} as CatalogosSelect;

  /** Formulario reactivo utilizado para capturar los requerimientos. */
  capturarRequirementoForm!: FormGroup;

  /** Estado de la solicitud 32401, gestionado en el store. */
  public solicitud32401State!: Solicitud32401State;

  /** Notificador utilizado para destruir observables al deshacerse del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado público de la solicitud, sincronizado con el store. */
  public solicitudState!: Solicitud32401State;

  /** Índice utilizado para gestionar la navegación por pestañas. */
  indice: number = 1;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Observable utilizado para la destrucción de suscripciones */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor que inicializa los servicios y estados necesarios para el componente.
   *
   * @param {AutoridadService} autoridadService - Servicio para interactuar con los catálogos y la API relacionada con autoridad.
   * @param {FormBuilder} fb - Utilidad para construir formularios reactivos.
   * @param {Tramite32401Store} tramite32401Store - Store que gestiona el estado interno del trámite 32401.
   * @param {Tramite32401Query} tramite32401Query - Query que permite consultar el estado actual del trámite desde el store.
   * @param {ConsultaioQuery} consultaioQuery - Query para acceder a los datos globales del usuario o solicitud actual.
   */
  constructor(
    private autoridadService: AutoridadService,
    private fb: FormBuilder,
    public tramite32401Store: Tramite32401Store,
    private tramite32401Query: Tramite32401Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    // Constructor vacío, se puede agregar lógica adicional si es necesario.
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @description Método que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo y sincroniza datos con el estado actual.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
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
      this.capturarRequirementoForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.capturarRequirementoForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario reactivo con los campos requeridos.
   */
  inicializarFormulario(): void {
    this.capturarRequirementoForm = this.fb.group({
      motivoCancelacion: [
        {
          value: this.solicitud32401State?.motivoCancelacion,
          disabled: this.esFormularioSoloLectura,
        },
        Validators.required,
      ],
      tipoDeRequerimiento: [
        this.solicitud32401State?.tipoDeRequerimiento,
        Validators.required,
      ],
    });
    this.buscarAduanaLista();
    this.tramite32401Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.capturarRequirementoForm.patchValue({
            motivoCancelacion: this.solicitudState.motivoCancelacion,
            tipoDeRequerimiento: this.solicitudState.tipoDeRequerimiento,
          });
        })
      )
      .subscribe();
  }

  /**
   * Busca la lista de aduanas utilizando el servicio de autoridad.
   */
  public buscarAduanaLista(): void {
    this.autoridadService
      .obtenerAduanaLista()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta: CatalogosSelect) => {
        this.aduanaLista = respuesta;
      });
  }

  /**
   * Establece los valores en el store según los campos del formulario.
   * @param form Formulario del que se obtendrán los valores.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32401Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32401Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Selecciona la pestaña correspondiente según el índice proporcionado.
   * @param i Índice de la pestaña que se seleccionará.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y finaliza observables.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
