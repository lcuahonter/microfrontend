import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Domicilios, EntidadFederativa } from '../../models/solicitud.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Solicitud31101State,
  Solicitud31101Store,
} from '../../estados/solicitud31101.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AGREGAR_IMMEX_CONFIGURACION } from '../../constants/solicitud.enum';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import { SolicitudService } from '../../services/solicitud.service';

/** Configuración del componente AgregarImmexProgram
 * Archivo de plantilla que define la vista del componente
 * Archivo de estilos específico del componente
 * Módulos importados necesarios para el funcionamiento del componente
 */
@Component({
  selector: 'app-agregar-immex-program',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './agregar-immex-program.component.html',
  styleUrl: './agregar-immex-program.component.scss',
})
/** Configuración del componente AgregarImmexProgram
 * Archivo de plantilla que define la vista del componente
 * Archivo de estilos específico del componente
 * Módulos importados necesarios para el funcionamiento del componente
 */
export class AgregarImmexProgramComponent implements OnInit, OnDestroy {
  /** Formulario para agregar un programa IMMEX */
  agregarImmexProgramForm!: FormGroup;

  /** Sujeto para manejar la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /** Tipo de selección en la tabla */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /** Configuración de columnas para la tabla de domicilios */
  agregarImmexProgramConfiguracionColumnas: ConfiguracionColumna<EntidadFederativa>[] =
    AGREGAR_IMMEX_CONFIGURACION;

  /** Evento de salida para emitir el valor agregado */
  @Output() agregarImmexValor = new EventEmitter<Domicilios>();

  /** Datos de domicilios */
  domiciliosDatos: EntidadFederativa[] = [] as EntidadFederativa[];

  /** Entidad federativa seleccionada */
  entidadFederativa: CatalogosSelect = {} as CatalogosSelect;

  /** Lista de domicilios seleccionados */
  domicilioslista: EntidadFederativa[] = [] as EntidadFederativa[];

  /**
   * Lista de programas IMMEX seleccionados.
   *
   * Representa un arreglo de entidades federativas asociadas
   * al programa IMMEX que el usuario ha seleccionado.
   */
  seleccionarImmexProgram: EntidadFederativa[] = [] as EntidadFederativa[];

  /** Estado de la solicitud */
  solicitud31101State: Solicitud31101State = {} as Solicitud31101State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   *
   * Inicializa las dependencias principales necesarias para el manejo del formulario
   * y la gestión del estado de la solicitud.
   *
   * @param fb               Servicio de FormBuilder para crear y administrar formularios reactivos.
   * @param solicitudService Servicio encargado de la lógica de negocio relacionada con las solicitudes.
   * @param solicitud31101Store Almacén (store) para gestionar el estado de la solicitud 31101.
   * @param solicitud31101Query Consultas (query) para obtener el estado actual de la solicitud 31101.
   * @param consultaioQuery  Consultas (query) para obtener información relacionada con el contexto de consulta.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud31101Store: Solicitud31101Store,
    public solicitud31101Query: Solicitud31101Query,
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

    /** Obtiene los datos generales del catálogo */
    this.entidadFederativaCatalogo();
  }

  /** Inicializa el formulario */
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
      this.agregarImmexProgramForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.agregarImmexProgramForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `agregarImmexProgramForm` y configura sus controles.
   *
   * - Crea un formulario reactivo con el campo `entidadFederativa`, inicializado
   *   a partir del estado actual (`solicitud31101State`).
   * - Se suscribe al observable `selectSolicitud$` de `solicitud31101Query` para:
   *   - Obtener los cambios en la solicitud.
   *   - Actualizar el estado local `solicitud31101State`.
   *   - Reflejar dichos cambios en el formulario mediante `patchValue`.
   *
   * La suscripción se mantiene activa hasta que se emite `destroy$`,
   * lo que asegura la limpieza de recursos y evita fugas de memoria.
   */
  inicializarFormulario(): void {
    this.agregarImmexProgramForm = this.fb.group({
      entidadFederativa: [this.solicitud31101State.entidadFederativa],
    });

    /**Suscripción para obtener la solicitud y actualizar el formulario */
    this.solicitud31101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud31101State) => {
          this.solicitud31101State = respuesta;
          this.agregarImmexProgramForm.patchValue({
            entidadFederativa: this.solicitud31101State.entidadFederativa,
          });
        })
      )
      .subscribe();
  }

  /** Obtiene los datos generales del catálogo desde el servicio */
  entidadFederativaCatalogo(): void {
    this.solicitudService
      .entidadFederativaCatalogo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: CatalogosSelect) => {
          this.entidadFederativa = respuesta;
        },
      });
  }

  /** Maneja la selección de entidad federativa */
  seleccionArentidadFederativa(evento: Catalogo): void {
    this.conseguirEntidadFederativaDatos();
    this.solicitud31101Store.actualizarEntidadFederativa(evento.id);
  }

  /**
   * Asigna la lista de programas IMMEX seleccionados.
   *
   * Actualiza la propiedad `seleccionarImmexProgram` con el arreglo de
   * entidades federativas recibido como parámetro.
   *
   * @param evento Arreglo de entidades federativas seleccionadas.
   */
  seleccionarImmexProgramLista(evento: EntidadFederativa[]): void {
    this.seleccionarImmexProgram = evento;
  }

  /** Agrega un programa IMMEX y emite los datos */
  agregarImmexProgram(): void {
    if (this.seleccionarImmexProgram.length > 0) {
      const VALOR: Domicilios = {
        instalacionPrincipal: this.seleccionarImmexProgram?.[0]
          ?.instalacionPrincipal
          ? this.seleccionarImmexProgram?.[0]?.instalacionPrincipal
          : '',
        cveTipoInstalacion: '',
        tipoInstalacion: this.seleccionarImmexProgram?.[0]?.tipoInstalacion
          ? this.seleccionarImmexProgram?.[0]?.tipoInstalacion
          : '',
        cveEntidadFederativa: '',
        entidadFederativa: this.seleccionarImmexProgram[0].entidadFederativa,
        cveDelegacionMunicipio: '',
        municipioDelegacion:
          this.seleccionarImmexProgram[0].municipioDelegacion,
        direccion: this.seleccionarImmexProgram[0].direccion,
        codigoPostal: this.seleccionarImmexProgram[0].codigoPostal,
        registroSESAT: this.seleccionarImmexProgram[0].registroSESAT,
        procesoProductivo: '',
        fechaModificacion: '',
        cveEstatus: '',
        estatus: '',
        noExterior: '',
        noInterior: '',
        cveColonia: '',
        calle: '',
        descCol: '',
        idRecinto: '',
        numFolioAcuse: '',
        observaciones: '',
      };
      /** Emite el valor agregado */
      this.agregarImmexValor.emit(VALOR);
      this.seleccionarImmexProgram = [];
      this.domicilioslista = [];
      this.agregarImmexProgramForm.reset();
    }
  }

  /**
   * Cancela la captura del programa IMMEX.
   *
   * - Reinicia el formulario `agregarImmexProgramForm`.
   * - Limpia la lista de domicilios (`domicilioslista`).
   * - Vacía la lista de programas seleccionados (`seleccionarImmexProgram`).
   * - Emite el evento `agregarImmexValor` con `undefined` para notificar
   *   la cancelación a componentes padres o suscriptores.
   */
  cancelarImmexProgram(): void {
    this.agregarImmexProgramForm.reset();
    this.domicilioslista = [];
    this.seleccionarImmexProgram = [];
    this.agregarImmexValor.emit(undefined);
  }

  /** Obtiene los datos de la entidad federativa desde el servicio */
  conseguirEntidadFederativaDatos(): void {
    this.solicitudService
      .conseguirEntidadFederativaDatos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: EntidadFederativa[]) => {
          this.domicilioslista = respuesta;
        },
      });
  }

  /** Maneja la destrucción de suscripciones */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
