import {
  Catalogo,
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import {
  Tramite250102State,
  Tramite250102Store,
} from '../../estados/tramite250102.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/flora-fauna.enum';
import { TipoMovimientoService } from '../../services/tipo-movimiento.service';
import { Tramite250102Query } from '../../estados/tramite250102.query';


/**
 * Componente para la gestión del tipo de movimiento en el trámite 250102.
 * Permite seleccionar el tipo de movimiento, aduana, inspectoría y municipio,
 * así como almacenar y recuperar estos valores del estado global del trámite.
 * 
 * @component
 * @example
 * <app-tipo-movimiento></app-tipo-movimiento>
 */
@Component({
  selector: 'app-tipo-movimiento',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './tipo-movimiento.component.html',
  styleUrl: './tipo-movimiento.component.scss',
})
export class TipoMovimientoComponent implements OnInit, OnDestroy {
  /**
   * Estado actual de la solicitud proveniente del store.
   * @type {Tramite250102State}
   */
  public solicitudState!: Tramite250102State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   */
  public destroy$ = new Subject<void>();

  /**
   * Datos relacionados con las opciones de aduana obtenidas desde el servicio.
   * @type {Catalogo[]}
   */
  aduanaData: Catalogo[] = [];

  /**
   * Datos relacionados con las opciones de inspectoría obtenidas desde el servicio.
   * @type {Catalogo[]}
   */
  inspectoriaData: Catalogo[] = [];

  /**
   * Datos relacionados con las opciones de municipio obtenidas desde el servicio.
   * @type {Catalogo[]}
   */
  municipioData: Catalogo[] = [];

  /**
   * Opciones predefinidas para el tipo de movimiento.
   * @type {any[]}
   */
  movimientoOpcionDeBotonDeRadio = MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Formulario reactivo para gestionar los datos del tipo de movimiento.
   * @type {FormGroup}
   */
  public tipoMovimientoForm!: FormGroup;

  /**
   * Inicializa los servicios necesarios para el componente.
   * @param fb FormBuilder para la construcción del formulario reactivo.
   * @param tramite250102Store Almacén de estado para gestionar los datos del trámite.
   * @param tramite250102Query Consulta para obtener el estado del trámite.
   * @param tipoMovimientoService Servicio para obtener los datos del tipo de movimiento.
   * @param consultaioQuery Consulta de estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250102Store: Tramite250102Store,
    private tramite250102Query: Tramite250102Query,
    private tipoMovimientoService: TipoMovimientoService,
    public consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el formulario dependiendo del modo (solo lectura o editable).
   * Si está en solo lectura, carga y bloquea el formulario.
   * Si no, crea un formulario editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.establecerTipoMovimientoFormGroup();
    }
  }

  /**
   * Crea el formulario y, si está en modo solo lectura, lo deshabilita.
   * De lo contrario, lo habilita para edición.
   */
  guardarDatosFormulario(): void {
    this.establecerTipoMovimientoFormGroup();
    if (this.esFormularioSoloLectura) {
      this.tipoMovimientoForm.disable();
    } else {
      this.tipoMovimientoForm.enable();
    }
  }

  /**
   * Inicializa el componente, obtiene los datos del servicio y configura el formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.obtenerAduanaData();
    this.obtenerInspectoriaData();
    this.obtenerAlcaldíaData();

    this.tramite250102Query.selectTipoMovimiento$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tipoMovimiento) => {
        if (tipoMovimiento) {
          this.tipoMovimientoForm.patchValue({ tipoMovimiento });
        }
      });
  }

  /**
   * Configura el formulario reactivo con los controles necesarios y sus validaciones.
   */
  establecerTipoMovimientoFormGroup(): void {
    this.tramite250102Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.tipoMovimientoForm = this.fb.group({
      tipoMovimiento: new FormControl(
        this.movimientoOpcionDeBotonDeRadio[0]?.value || '',
        [Validators.required]
      ),
      tipoAduana: new FormControl(this.solicitudState?.tipoAduana, [Validators.required]),
      tipoInspectoria: new FormControl(this.solicitudState?.tipoInspectoria, [Validators.required]),
      tipoMunicipio: new FormControl(this.solicitudState?.tipoMunicipio, [Validators.required]),
    });
  }

  /**
   * Obtiene datos de aduana desde el servicio.
   */
  obtenerAduanaData(): void {
    this.tipoMovimientoService
      .obtenerAduanaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.aduanaData = data;
      });
  }

  /**
   * Obtiene datos de inspectoría desde el servicio.
   */
  obtenerInspectoriaData(): void {
    this.tipoMovimientoService
      .obtenerInspectoriaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.inspectoriaData = data;
      });
  }

  /**
   * Obtiene datos de municipio desde el servicio.
   */
  obtenerAlcaldíaData(): void {
    this.tipoMovimientoService
      .obtenerAlcaldíaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.municipioData = data;
      });
  }

  /**
   * Obtiene el estado del trámite desde el almacén de datos y actualiza el formulario reactivo.
   */
  getValoresStore(): void {
    this.tramite250102Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.tipoMovimientoForm.patchValue({
            tipoMovimiento:
              seccionState.tipoMovimiento ||
              this.movimientoOpcionDeBotonDeRadio[0]?.value,
            tipoAduana: seccionState.tipoAduana,
            tipoInspectoria: seccionState.tipoInspectoria,
            tipoMunicipio: seccionState.tipoMunicipio,
          });
        })
      )
      .subscribe();
  }

  /**
   * Actualiza el estado del trámite con los valores del formulario.
   * @param form Formulario reactivo con los datos del trámite.
   * @param campo Nombre del campo que se actualizará en el estado.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite250102Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}