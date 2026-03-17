/**
 * @module TipoMovimientoComponent
 * @description
 * Componente que gestiona el formulario y la lógica relacionada con el tipo de movimiento.
 * Permite seleccionar opciones de movimiento, aduana, inspectoría y municipio.
 */
import {
  Catalogo,
  CatalogoSelectComponent,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src'; // Importa componentes compartidos para la interfaz de usuario.
import { Component, OnDestroy, OnInit } from '@angular/core'; //Importaciones necesarias de Angular.
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // Módulos para la creación y validación de formularios reactivos.
import { Subject, map, takeUntil } from 'rxjs'; // Utilidades de RxJS para manejar observables y suscripciones.
import { Tramite250101State,Tramite250101Store } from '../../estados/tramite250101.store'; // Almacén para gestionar el estado del trámite.
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO } from '../../constantes/flora-fauna.enum'; // Opciones predefinidas para el tipo de movimiento.
import { TipoMovimientoService } from '../../services/tipo-movimiento.service'; // Servicio para obtener datos relacionados con el tipo de movimiento.
import { Tramite250101Query } from '../../estados/tramite250101.query';
/**
 * @component TipoMovimientoComponent
 * @description
 * Componente que permite al usuario seleccionar y gestionar datos relacionados con el tipo de movimiento.
 */
@Component({
  selector: 'app-tipo-movimiento', // Selector del componente.
  standalone: true, // Indica que este componente es independiente.
  imports: [
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
  ], // Importa módulos y componentes necesarios.
  templateUrl: './tipo-movimiento.component.html', // Ruta al archivo de plantilla HTML.
  styleUrl: './tipo-movimiento.component.scss', // Ruta al archivo de estilos SCSS.
})
export class TipoMovimientoComponent implements OnInit, OnDestroy {
  /**
   * @property destroy$
   * @description
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * @property aduanaData
   * @description
   * Datos relacionados con las opciones de aduana.
   */
  public aduanaData: Catalogo[] = [];

  /**
   * @property inspectoriaData
   * @description
   * Datos relacionados con las opciones de inspectoría.
   */
  public inspectoriaData: Catalogo[] = [];

  /**
   * @property municipioData
   * @description
   * Datos relacionados con las opciones de municipio.
   */
  public municipioData: Catalogo[] = [];

  /**
   * @property movimientoOpcionDeBotonDeRadio
   * @description
   * Opciones predefinidas para el tipo de movimiento.
   */
  public movimientoOpcionDeBotonDeRadio = MOVIMIENTO_OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property tipoMovimientoForm
   * @description
   * Formulario reactivo para gestionar los datos del tipo de movimiento.
   */
  public tipoMovimientoForm!: FormGroup;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

   /** Estado actual del trámite 270201 asociado a la solicitud. 
   * Contiene datos del flujo y validaciones del proceso. */
   public solicitudState!: Tramite250101State;
  /**
   * @constructor
   * @description
   * Constructor del componente. Inicializa los servicios necesarios.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite250101Store - Almacén para gestionar el estado del trámite.
   * @param tipoMovimientoService - Servicio para obtener datos relacionados con el tipo de movimiento.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250101Store: Tramite250101Store,
    private tipoMovimientoService: TipoMovimientoService,
    private tramite250101Query: Tramite250101Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // La lógica del constructor se puede añadir aquí si es necesario.
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene datos de los servicios y configura el formulario.
   */
  ngOnInit(): void {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.tipoMovimientoService.getAduanaData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.aduanaData = data; // Asigna los datos de aduana.
    });

    this.tipoMovimientoService.getInspectoriaData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.inspectoriaData = data; // Asigna los datos de inspectoría.
    });

    this.tipoMovimientoService.getAlcaldiaData().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.municipioData = data; // Asigna los datos de municipio.
    });

    this.establecerTipoMovimientoFormGroup(); // Configura el formulario reactivo.

  if (this.esFormularioSoloLectura) {
  this.tipoMovimientoForm.get('tipoMovimiento')?.disable();
} else {
  this.tipoMovimientoForm.get('tipoMovimiento')?.enable();
}
  }
  
   /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
     if (!this.tipoMovimientoForm){return}
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
       this.tipoMovimientoForm.enable();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
private guardarDatosFormulario(): void {
    this.establecerTipoMovimientoFormGroup();
    if (this.esFormularioSoloLectura) {
      this.tipoMovimientoForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.tipoMovimientoForm.enable();
    } 
  }

  /**
   * @method establecerTipoMovimientoFormGroup
   * @description
   * Configura el formulario reactivo con los controles necesarios y sus validaciones.
   */
  private establecerTipoMovimientoFormGroup(): void {
   /** Suscribe al estado de solicitud 40302 y lo asigna a `solicitudState`.  
    * Usa `takeUntil` para limpiar la suscripción al destruir el componente. */
    this.tramite250101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250101State;
        })
      )
      .subscribe();

    this.tipoMovimientoForm = this.fb.group({
      tipoMovimiento: new FormControl(this.movimientoOpcionDeBotonDeRadio[0]?.value || '', [Validators.required]),
      tipoAduana: new FormControl('', [Validators.required]),
      tipoInspectoria: new FormControl('', [Validators.required]),
      tipoMunicipio: new FormControl('', [Validators.required]),
    });


    this.tipoMovimientoForm.patchValue({
      tipoAduana: this.solicitudState.tipoAduana,
      tipoInspectoria: this.solicitudState.tipoInspectoria,
      tipoMunicipio: this.solicitudState.tipoMunicipio,
    });
  }

  /**
   * @method actualizarAduana
   * @description
   * Actualiza el estado del almacén con el valor seleccionado en el campo `tipoAduana`.
   */
  actualizarAduana(): void {
    const ADUANA = this.tipoMovimientoForm.get('tipoAduana')?.value;
    this.tramite250101Store.establecerTipoAduana(ADUANA);
  }

  /**
   * @method actualizarInspectoria
   * @description
   * Actualiza el estado del almacén con el valor seleccionado en el campo `tipoInspectoria`.
   */
  actualizarInspectoria(): void {
    const INSPECTORIA = this.tipoMovimientoForm.get('tipoInspectoria')?.value;
    this.tramite250101Store.establecerTipoInspectoria(INSPECTORIA);
  }

  /**
   * @method actualizarMunicipio
   * @description
   * Actualiza el estado del almacén con el valor seleccionado en el campo `tipoMunicipio`.
   */
  actualizarMunicipio(): void {
    const MUNICIPIO = this.tipoMovimientoForm.get('tipoMunicipio')?.value;
    this.tramite250101Store.establecerTipoMunicipio(MUNICIPIO);
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
