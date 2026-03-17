import { Catalogo, CatalogoSelectComponent, CatalogosSelect, TituloComponent } from '@libs/shared/data-access-user/src'; 
import { Component,EventEmitter, OnDestroy, OnInit, Output } from '@angular/core'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { NumeroDeEmpleados, SeccionSubcontratados, SolicitudCatologoSelectLista } from '../../models/solicitud.model'; 
import { Solicitud32607State, Solicitud32607Store } from '../../estados/solicitud32607.store'; 
import { Subject, map, takeUntil } from 'rxjs'; 
import { CommonModule } from '@angular/common'; 
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud32607Query } from '../../estados/solicitud32607.query'; 
import { SolicitudService } from '../../services/solicitud.service';


/** Selector del componente, utilizado para integrarlo en el HTML
 *  Indica que este componente es independiente (standalone) y no depende de un módulo Angular específico
 *  Importación de módulos necesarios para el componente
 *  Servicios que estarán disponibles para este componente
 */
@Component({
  selector: 'app-seccion-subcontratados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
  ],
  providers: [SolicitudService],
  templateUrl: './seccion-subcontratados.component.html',
  styleUrl: './seccion-subcontratados.component.scss',
})
/** Selector del componente, utilizado para integrarlo en el HTML
 *  Indica que este componente es independiente (standalone) y no depende de un módulo Angular específico
 *  Importación de módulos necesarios para el componente
 *  Servicios que estarán disponibles para este componente
 */
export class SeccionSubcontratadosComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para manejar los datos de los subcontratados */
  subcontratadosForm!: FormGroup;

  /** Sujeto para manejar la destrucción de observables y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Objeto que contiene la información del bimestre */
  bimestre: CatalogosSelect = {} as CatalogosSelect;

  /** Estado que contiene los datos de la solicitud */
  solicitud32607State: Solicitud32607State = {} as Solicitud32607State;

  /** Emisor de eventos con los datos de subcontratados */
  @Output() seccionSubcontratados = new EventEmitter<NumeroDeEmpleados>();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * 
   * Inyecta los servicios necesarios para manejar formularios, acceder y modificar el estado 
   * de la solicitud, así como realizar consultas auxiliares.
   * 
   * @param fb - Servicio para crear y gestionar formularios reactivos.
   * @param solicitudService - Servicio encargado de las operaciones relacionadas con la solicitud.
   * @param solicitud32607Store - Store para actualizar el estado de la solicitud 32607.
   * @param solicitud32607Query - Consulta del estado de la solicitud 32607.
   * @param consultaioQuery - Consulta de catálogos u otros datos auxiliares.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32607Store: Solicitud32607Store,
    public solicitud32607Query: Solicitud32607Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    /** Obtiene la lista de catálogos cuando se inicializa el componente */
    this.conseguirSolicitudCatologoSelectLista();
  }

  /** Inicializa el formulario para gestionar datos del miembro de la empresa */
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
      this.subcontratadosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.subcontratadosForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `miembroEmpresaForm` con los datos del estado actual `solicitud32607State`.
   *
   * Este formulario recopila información detallada sobre un miembro de la empresa, como su nombre,
   * nacionalidad, RFC, tipo de persona y relación con la empresa.
   */
  inicializarFormulario(): void {
    /** Inicializa el formulario reactivo con validadores */
    this.subcontratadosForm = this.fb.group({
      subcontrataRFCBusqueda: [
        '',
        [Validators.required, Validators.maxLength(13)],
      ],
      subcontrataRFC: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(13)],
      ],
      subcontrataRazonSocial: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(254)],
      ],
      subcontrataEmpleados: [
        '',
        [Validators.required, Validators.maxLength(5)],
      ],
      subcontrataBimestre: ['', [Validators.required]],
    });

    /** Suscripción al estado de la solicitud para actualizar el formulario con los datos */
    this.solicitud32607Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$), // Asegura que la suscripción se cancele al destruir el componente
        map((respuesta: Solicitud32607State) => {
          this.solicitud32607State = respuesta; // Asigna el estado a la variable
          this.subcontratadosForm.patchValue({
            subcontrataRFCBusqueda:
              this.solicitud32607State.subcontrataRFCBusqueda,
            subcontrataRFC: this.solicitud32607State.subcontrataRFC,
            subcontrataRazonSocial:
              this.solicitud32607State.subcontrataRazonSocial,
            subcontrataEmpleados: this.solicitud32607State.subcontrataEmpleados,
            subcontrataBimestre: this.solicitud32607State.subcontrataBimestre,
          });
        })
      )
      .subscribe();
  }

  /** Método para obtener la lista de catálogos de solicitud */
  conseguirSolicitudCatologoSelectLista(): void {
    this.solicitudService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.bimestre = respuesta.bimestre;
        },
      });
  }

  /** Método para buscar la información de subcontratados por RFC */
  buscarRFC(): void {
    this.solicitudService
      .conseguirSeccionSubcontratados()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SeccionSubcontratados) => {
          /** Actualiza el estado del RFC y la razón social con los datos obtenidos */
          this.solicitud32607Store.actualizarSubcontrataRFC(
            respuesta.subcontrataRFC
          );
          this.solicitud32607Store.actualizarSubcontrataRazonSocial(
            respuesta.subcontrataRazonSocial
          );
        },
      });
  }

  /** Método para actualizar el RFC de búsqueda en el store */
  actualizarSubcontrataRFCBusqueda(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarSubcontrataRFCBusqueda(VALOR);
  }

  /** Método para actualizar el RFC de la subcontratista en el store */
  actualizarSubcontrataRFC(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarSubcontrataRFC(VALOR);
  }

  /** Método para actualizar la razón social de la subcontratista en el store */
  actualizarSubcontrataRazonSocial(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarSubcontrataRazonSocial(VALOR);
  }

  /** Método para actualizar el número de empleados en el store */
  actualizarSubcontrataEmpleados(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarSubcontrataEmpleados(VALOR);
  }

  /** Método para actualizar el bimestre en el store */
  actualizarSubcontrataBimestre(evento: Catalogo): void {
    this.solicitud32607Store.actualizarSubcontrataBimestre(evento.id);
  }

  /** Método para emitir los datos del formulario al componente padre */
  cerrarModal(): void {
    const OBJETO_JSON = {
      denominacion: this.subcontratadosForm.get('subcontrataRazonSocial')
        ?.value,
      RFC: this.subcontratadosForm.get('subcontrataRFC')?.value,
      numeroDeEmpleados: this.subcontratadosForm.get('subcontrataEmpleados')
        ?.value,
      bimestre: this.subcontratadosForm.get('subcontrataBimestre')?.value,
    };

    this.seccionSubcontratados.emit(OBJETO_JSON); // Emite los datos al componente padre
  }

  /** Método que se ejecuta cuando el componente se destruye, cancelando la suscripción */
  ngOnDestroy(): void {
    this.destroy$.next(); // Desactiva la suscripción
    this.destroy$.complete(); // Completa el sujeto de destrucción
  }
}
