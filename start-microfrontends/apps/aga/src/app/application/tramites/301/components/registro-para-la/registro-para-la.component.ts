/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, IMPORTANTE} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Solicitud301State, Tramite301Store } from '../../../../core/estados/tramites/tramite301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AlertComponent } from 'libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { BtnContinuarComponent } from 'libs/shared/data-access-user/src/tramites/components/btn-continuar/btn-continuar.component';
import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from 'libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { DatosPasos } from 'libs/shared/data-access-user/src/core/models/shared/components.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Pantallas301Service } from '../../services/pantallas301.service';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Tramite301Query } from '../../../../core/queries/tramite301.query';

/**
 * Componente para el registro de productos relacionados con importaciones y exportaciones.
 * Presenta un formulario interactivo que permite registrar si un producto ha sido importado o exportado previamente.
 * Utiliza varios componentes reutilizables como alertas, botones y selectores.
 *
 * @export
 * @class RegistroParaLaComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-registro-para-la',
  templateUrl: './registro-para-la.component.html',
  styleUrls: ['./registro-para-la.component.scss'], // Corregido de styleUrl a styleUrls
  imports: [
    CommonModule,
    AlertComponent,
    TituloComponent,
    CatalogoSelectComponent,
    BtnContinuarComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class RegistroParaLaComponent implements OnInit, OnDestroy {

  /** Emite el valor de la sección seleccionada al componente padre. */
  @Output() emitirElValorSeleccionado: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Formulario principal del componente.
   * Este formulario contiene el campo de registro de importaciones/exportaciones.
   *
   * @type {FormGroup}
   * @memberof RegistroParaLaComponent
   */
  registroParaLaForm!: FormGroup;

  /**
   * Constantes importadas desde el archivo de enumeración que contienen textos importantes y de advertencia.
   *
   * @type {IMPORTANTE}
   * @memberof RegistroParaLaComponent
   */
  public TEXTOS = IMPORTANTE;

  /** Controla la visibilidad de un campo específico en la interfaz. */
  public mostrarCampo: boolean = false;

  /**
   * Índice del paso actual en el formulario.
   * Inicialmente, se establece en 1. Este índice es utilizado para navegar entre los pasos del formulario.
   *
   * @type {number}
   * @memberof RegistroParaLaComponent
   */
  indice: number = 1;

  /**
   * Objeto de tipo `CatalogosSelect` que representa las opciones del formulario de importaciones/exportaciones.
   * Este objeto es inicializado en el método `getRegistro()`.
   *
   * @type {CatalogosSelect}
   * @memberof RegistroParaLaComponent
   */
  public registroOptions!: Catalogo[];

  /**
   * Lista de pasos en el flujo del formulario.
   * Inicialmente está vacía, pero se llenará dependiendo de los datos de la aplicación.
   *
   * @type {ListaPasosWizard[]}
   * @memberof RegistroParaLaComponent
   */
  pasos: ListaPasosWizard[] = [];

  /**
   * Objeto que contiene los datos del flujo de pasos del formulario.
   * Este objeto es utilizado para mostrar información relevante al usuario como el número de pasos,
   * el paso actual y los textos de los botones de navegación (anterior y siguiente).
   *
   * @type {DatosPasos}
   * @memberof RegistroParaLaComponent
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length, // El número de pasos se obtiene dinámicamente de la lista `pasos`
    indice: this.indice, // Índice del paso actual en el formulario
    txtBtnAnt: 'Anterior', // Texto para el botón de retroceso
    txtBtnSig: 'Continuar', // Texto para el botón de siguiente
  };

  /**
   * Estado de la solicitud de la sección 301.
   */
  public solicitudState!: Solicitud301State;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

/**
   * @property consultaState
   * @type {ConsultaioState}
   * @public
   * @description
   * Almacena el estado actual de la consulta obtenido desde el store.
   * Se utiliza para controlar el flujo y la visualización de datos en el componente.
   */
  public consultaState!: ConsultaioState; 

  /**
   * Constructor del componente `RegistroParaLaComponent`.
   *
   * Inicializa la instancia de `Tramite301Store` y `Tramite301Query` para manejar el estado de la aplicación.
   *
   * @param {Tramite301Store} tramite301Store
   */
  constructor(
    private fb: FormBuilder,
    private tramite301Store: Tramite301Store,
    private tramite301Query: Tramite301Query,
    private consultaioQuery: ConsultaioQuery,
    private pantallas301Service: Pantallas301Service
  ) {
    //
  }

  /**
   * Método que se ejecuta cuando el componente es inicializado.
   * Este método se encarga de obtener los datos necesarios para inicializar el formulario de registro,
   * incluyendo las opciones para el campo de importaciones/exportaciones.
   *
   * @memberof RegistroParaLaComponent
   */
  ngOnInit(): void {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
       this.consultaState = seccionState;
       this.inicializarFormulario();
      })
    )
    .subscribe()
    this.getRegistro();
    if (this.consultaState.update) {
      this.mostrarCampo = true;
    } else {
      this.mostrarCampo = this.pantallas301Service.obtenerRegistroCampoVisibilidad();
    }
  }

 /**
  * Inicializa el formulario reactivo para capturar el valor de 'registro'.
  * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
  * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
  * con el valor inicial obtenido del store.
  */
  inicializarFormulario(): void {
    this.tramite301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    /**
     * Crea un formulario reactivo (`FormGroup`) con el campo `registro`,
     * inicializado con el valor obtenido desde `solicitudState`.
     * El campo es requerido.
     */
    this.registroParaLaForm = this.fb.group({
      registro: [this.solicitudState?.registro, Validators.required],
    });

    /**
     * Si el procedimiento está en modo solo lectura (`readonly`),
     * se desactiva el campo `registro` para evitar modificaciones por parte del usuario.
     */
    if(this.consultaState.readonly) {
        this.registroParaLaForm.get('registro')?.disable();
    }
    if (this.consultaState.update) {
      this.emitirElValorSeleccionado.emit(this.solicitudState?.registro);
    }
  }

  /**
   * Inicializa el objeto `registro` con los datos predeterminados para el formulario.
   * Este método establece los valores iniciales para la etiqueta, las opciones de respuesta y si el campo es obligatorio.
   *
   * @memberof RegistroParaLaComponent
   */
  public getRegistro(): void {
    this.registroOptions = [
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ];

    // Aquí deberías cargar los pasos reales del flujo de trabajo de tu aplicación
    this.pasos = []; // Llenar la lista `pasos` con los pasos correspondientes

    // Actualiza el número de pasos en el objeto `datosPasos` después de cargar la lista de pasos
    this.datosPasos.nroPasos = this.pasos.length;
  }

  /**
   * Método que maneja la navegación entre los pasos del formulario.
   * Este método se encarga de actualizar el índice del paso actual y los textos de los botones de navegación.
   *
   * @param {string} accion - Acción a realizar (anterior o siguiente).
   * @returns {void}
   * @memberof RegistroParaLaComponent
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite301Store[metodoNombre] as (value: unknown) => void)(VALOR);
    this.emitirElValorSeleccionado.emit(VALOR);
  }

  /**
 * Activa la visualización del campo si aún no está visible.
 * @returns {void}
 * @memberof RegistroParaLaComponent
 */
  iniciar(): void {
    this.pantallas301Service.actualizarRegistroCampo();
    this.mostrarCampo = this.pantallas301Service.obtenerRegistroCampoVisibilidad();
  }
  /**
   * Valida el formulario y marca todos los controles como "touched" para
   * activar la validación visual. Devuelve true si el formulario existe y es válido.
   *
   * @returns {boolean} Estado de validez del formulario
   */
  validarFormulario(): boolean {
    if (!this.registroParaLaForm) {
      return false;
    }
    this.registroParaLaForm.markAllAsTouched();
    return this.registroParaLaForm.valid;
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Este método se encarga de limpiar las suscripciones a eventos y notificar la destrucción del componente.
   *
   * @memberof RegistroParaLaComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}