import {
  Catalogo,
  ConsultaioQuery,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import {
  Tramite250103State,
  Tramite250103Store,
} from '../../estados/tramite250103.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/embalaje-de-madera.enum';
import { TipoMovimientoService } from '../../services/tipo-movimiento.service';
import { Tramite250103Query } from '../../estados/tramite250103.query';

/**
 * Componente encargado de gestionar el tipo de movimiento dentro del trámite 250103.
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
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  public destroy$ = new Subject<void>();

  /**
   * Datos relacionados con las opciones de aduana obtenidas desde el servicio.
   */
  aduanaData: Catalogo[] = [];

  /**
   * Datos relacionados con las opciones de inspectoría obtenidas desde el servicio.
   */
  inspectoriaData: Catalogo[] = [];

   /**
   * Datos relacionados con las opciones de municipio obtenidas desde el servicio.
   */
  municipioData: Catalogo[] = [];

  /**
   * Opciones predefinidas para el tipo de movimiento.
   */
  movimientoOpcionDeBotonDeRadio = MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Formulario reactivo para gestionar los datos del tipo de movimiento.
   */
  public tipoMovimientoForm!: FormGroup;

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
   * Estado interno de la sección actual del trámite 130110.
   * Utilizado para gestionar y almacenar la información relacionada con esta sección.
   * Propiedad privada.
   */
  private seccionState!: Tramite250103State;


 /**
   * Inicializa los servicios necesarios para el componente.
   * @param fb FormBuilder para la construcción del formulario reactivo.
   * @param tramite250103Store Almacén de estado para gestionar los datos del trámite.
   * @param tramite250103Query Consulta para obtener el estado del trámite.
   * @param tipoMovimientoService Servicio para obtener los datos del tipo de movimiento.
   * @param consultaioQuery Consulta para obtener el estado de la consulta.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250103Store: Tramite250103Store,
    private tramite250103Query: Tramite250103Query,
    private tipoMovimientoService: TipoMovimientoService,
    private consultaioQuery: ConsultaioQuery
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
   * Inicializa el componente, obtiene los datos del servicio y configura el formulario.
   */
  ngOnInit(): void {
    this.obtenerAduanaData();
    this.obtenerInspectoriaData();
    this.obtenerAlcaldíaData();
    this.getValoresStore();

    this.tramite250103Query.selectTipoMovimiento$
      .pipe(takeUntil(this.destroy$))
      .subscribe((tipoMovimiento) => {
        if (tipoMovimiento) {
          this.tipoMovimientoForm.patchValue({ tipoMovimiento });
        }
      });
  }

  
  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.establecerTipoMovimientoFormGroup();
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
    this.establecerTipoMovimientoFormGroup();
    if (this.esFormularioSoloLectura) {
      this.tipoMovimientoForm.disable();
    } else {
      this.tipoMovimientoForm.enable();
    }
  }

 /**
   * Configura el formulario reactivo con los controles necesarios y sus validaciones.
   */
  establecerTipoMovimientoFormGroup(): void {
     this.subscription.add(
      this.tramite250103Query.selectTramiteState$
        .pipe(
          takeUntil(this.destroy$),
          map((seccionState: Tramite250103State) => {
            this.seccionState = seccionState;
          })
        )
        .subscribe()
    );
    this.tipoMovimientoForm = this.fb.group({
      tipoMovimiento: new FormControl(
        this.seccionState?.tipoMovimiento || this.movimientoOpcionDeBotonDeRadio[0]?.value,
        [Validators.required]
      ),
      tipoAduana: new FormControl(this.seccionState?.tipoAduana, [Validators.required]),
      tipoInspectoria: new FormControl(this.seccionState?.tipoInspectoria, [Validators.required]),
      tipoMunicipio: new FormControl(this.seccionState?.tipoMunicipio, [Validators.required]),
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
    this.tramite250103Query.selectTramiteState$
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
    this.tramite250103Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
