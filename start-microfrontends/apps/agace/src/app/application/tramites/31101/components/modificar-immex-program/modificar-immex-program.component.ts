import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  DatosGeneralesDeLaSolicitudCatologo,
  DatosGeneralesDeLaSolicitudRadioLista,
  Domicilios,
  InputRadio,
} from '../../models/solicitud.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Solicitud31101State,
  Solicitud31101Store,
} from '../../estados/solicitud31101.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente para modificar el programa IMMEX.
 */
@Component({
  selector: 'app-modificar-immex-program',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
  ],
  providers: [SolicitudService],
  templateUrl: './modificar-immex-program.component.html',
  styleUrl: './modificar-immex-program.component.scss',
})
/**
 *  Componente para modificar el programa IMMEX.
 */
export class ModificarImmexProgramComponent
  implements OnInit, OnDestroy, OnChanges
{
  /**
   *  Formulario reactivo para modificar el programa IMMEX.
   */
  modificarImmexProgramForm!: FormGroup;

  /**
   * Lista de domicilios seleccionados.
   *
   * @type {Domicilios[]}
   * @memberof Componente
   *
   * Esta propiedad se marca como `@Input()` para recibir desde un componente padre
   * la lista de domicilios actualmente seleccionados en la interfaz.
   */
  @Input() seleccionarDomiciliosDatos!: Domicilios[];

  /**
   *  Opciones de radio para selección de sí o no.
   */
  sinoOpcion: InputRadio = {} as InputRadio;

  /**
   *  Observable para gestionar la destrucción del componente.
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   *  Catálogo de tipos de instalación.
   */
  tipoDeInstalacion: CatalogosSelect = {} as CatalogosSelect;

  /**
   *  Evento de salida para modificar el valor del programa IMMEX.
   */
  @Output() modificarImmexValor = new EventEmitter<Domicilios>();

  /**
   * Lista de domicilios.
   *
   * @type {Domicilios[]}
   * @memberof Componente
   *
   * Contiene todos los domicilios asociados a la solicitud o entidad correspondiente.
   */
  DOMICILIOS!: Domicilios[];

  /**
   * Estado de la solicitud 31101.
   *
   * @type {Solicitud31101State}
   * @memberof Componente
   *
   * Almacena la información completa de la solicitud actual desde el store.
   * Se inicializa como un objeto vacío y se actualiza mediante suscripciones
   * al store `Solicitud31101Store`.
   */
  solicitud31101State: Solicitud31101State = {} as Solicitud31101State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   *  Constructor del componente.
   * @param {FormBuilder} fb - Servicio de construcción de formularios reactivos.
   * @param {SolicitudService} solicitudService - Servicio de solicitud de datos.
   * @param {Solicitud31101Store} solicitud31101Store - Store para manejar el estado de la solicitud 31101.
   * @param {Solicitud31101Query} solicitud31101Query - Query para consultar el estado de la solicitud 31101.
   * @param {ConsultaioQuery} consultaioQuery - Query para consultar el estado de la sección de consulta.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud31101Store: Solicitud31101Store, // /** Estado de la solicitud */
    public solicitud31101Query: Solicitud31101Query, // /** Consultas sobre la solicitud */
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
    this.conseguirDatosGeneralesOpcionDeRadio();
    this.conseguirDatosGeneralesCatologo();
  }

  /**
   *  Inicializa el formulario al montar el componente.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Detecta cambios en las propiedades de entrada (`@Input`) del componente.
   *
   * @param {SimpleChanges} changes - Objeto que contiene los cambios de las propiedades de entrada.
   *
   * Este método escucha cambios en `seleccionarDomiciliosDatos`. Cuando hay un cambio,
   * actualiza la lista interna `DOMICILIOS` y sincroniza los valores correspondientes
   * en el store `solicitud31101Store`, como:
   * - instalaciones principales
   * - municipio
   * - tipo de instalación
   * - entidad federativa
   * - registro SESAT
   * - dirección
   * - código postal
   * - proceso productivo
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['seleccionarDomiciliosDatos'] &&
      changes['seleccionarDomiciliosDatos'].currentValue
    ) {
      this.DOMICILIOS = changes['seleccionarDomiciliosDatos'].currentValue;
      this.solicitud31101Store.actualizarInstalacionesPrincipales(
        this.DOMICILIOS?.[0]?.instalacionPrincipal
      );
      this.solicitud31101Store.actualizarMunicipio(
        this.DOMICILIOS?.[0]?.municipioDelegacion
      );
      this.solicitud31101Store.actualizarTipoDeInstalacion(
        this.DOMICILIOS?.[0]?.tipoInstalacion
      );
      this.solicitud31101Store.actualizarFederativa(
        this.DOMICILIOS?.[0]?.entidadFederativa
      );
      this.solicitud31101Store.actualizarRegistroSE(
        this.DOMICILIOS?.[0]?.registroSESAT
      );
      this.solicitud31101Store.actualizarDesceripe(
        this.DOMICILIOS?.[0]?.direccion
      );
      this.solicitud31101Store.actualizarCodigoPostal(
        this.DOMICILIOS?.[0]?.codigoPostal
      );
      this.solicitud31101Store.actualizarProcesoProductivo(
        this.DOMICILIOS?.[0]?.procesoProductivo
      );
    }
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
      this.modificarImmexProgramForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.modificarImmexProgramForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario de modificación del programa IMMEX.
   *
   * Este método:
   * 1. Crea el formulario `modificarImmexProgramForm` con los campos:
   *    - instalacionesPrincipales
   *    - municipio
   *    - tipoDeInstalacion
   *    - federativa
   *    - registroSE
   *    - desceripe
   *    - codigoPostal
   *    - procesoProductivo
   *    Cada campo se inicializa con los valores actuales del estado `solicitud31101State`
   *    y se aplican validaciones necesarias como `Validators.required` y `Validators.maxLength`.
   *
   * 2. Se suscribe al observable `selectSolicitud$` de `solicitud31101Query` para:
   *    - Actualizar automáticamente los valores del formulario cuando cambia el estado global.
   *    - Mantener el formulario sincronizado con la última información del store.
   */
  inicializarFormulario(): void {
    this.modificarImmexProgramForm = this.fb.group({
      instalacionesPrincipales: [
        this.solicitud31101State.instalacionesPrincipales,
        [Validators.required],
      ],
      municipio: [this.solicitud31101State.municipio, [Validators.required]],
      tipoDeInstalacion: [
        this.solicitud31101State.tipoDeInstalacion,
        [Validators.required],
      ],
      federativa: [this.solicitud31101State.federativa, [Validators.required]],
      registroSE: [this.solicitud31101State.registroSE, [Validators.required]],
      desceripe: [this.solicitud31101State.desceripe, [Validators.required]],
      codigoPostal: [
        this.solicitud31101State.codigoPostal,
        [Validators.required, Validators.maxLength(5)],
      ],
      procesoProductivo: [
        this.solicitud31101State.procesoProductivo,
        [Validators.required],
      ],
    });

    this.solicitud31101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud31101State) => {
          this.solicitud31101State = respuesta;
          this.modificarImmexProgramForm.patchValue({
            instalacionesPrincipales:
              this.solicitud31101State.instalacionesPrincipales,
            municipio: this.solicitud31101State.municipio,
            tipoDeInstalacion: this.solicitud31101State.tipoDeInstalacion,
            federativa: this.solicitud31101State.federativa,
            registroSE: this.solicitud31101State.registroSE,
            desceripe: this.solicitud31101State.desceripe,
            codigoPostal: this.solicitud31101State.codigoPostal,
            procesoProductivo: this.solicitud31101State.procesoProductivo,
          });
        })
      )
      .subscribe();
  }

  /**
   *  Obtiene los datos generales de las opciones de radio.
   */
  conseguirDatosGeneralesOpcionDeRadio(): void {
    this.solicitudService
      .conseguirDatosGeneralesOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: DatosGeneralesDeLaSolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   *  Obtiene los datos generales del catálogo.
   */
  conseguirDatosGeneralesCatologo(): void {
    this.solicitudService
      .conseguirDatosGeneralesCatologo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: DatosGeneralesDeLaSolicitudCatologo) => {
          this.tipoDeInstalacion = respuesta.tipoDeInstalacion;
        },
      });
  }

  /**
   *  Acepta y emite el evento para modificar el programa IMMEX.
   */
  aceptarImmexProgram(): void {
    if (this.modificarImmexProgramForm.invalid) {
      this.modificarImmexProgramForm.markAllAsTouched();
      return;
    }
    const FORMVALOR = this.modificarImmexProgramForm.getRawValue();
    const VALOR: Domicilios = {
      instalacionPrincipal: FORMVALOR.instalacionesPrincipales,
      cveTipoInstalacion: '',
      tipoInstalacion: FORMVALOR.tipoDeInstalacion,
      cveEntidadFederativa: '',
      entidadFederativa: FORMVALOR.federativa,
      cveDelegacionMunicipio: '',
      municipioDelegacion: FORMVALOR.municipio,
      direccion: FORMVALOR.desceripe,
      codigoPostal: FORMVALOR.codigoPostal,
      registroSESAT: FORMVALOR.registroSE,
      procesoProductivo: FORMVALOR.procesoProductivo,
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
    if (this.DOMICILIOS[0].id) {
      VALOR['id'] = this.DOMICILIOS[0].id;
    }
    this.modificarImmexValor.emit(VALOR);
    this.modificarImmexProgramForm.reset();
  }

  /**
   * Cancela la edición del programa IMMEX.
   *
   * Este método:
   * 1. Emite un valor `undefined` a través del `EventEmitter` `modificarImmexValor` para notificar
   *    al componente padre que la edición ha sido cancelada.
   * 2. Resetea el formulario `modificarImmexProgramForm`, limpiando todos los campos y dejando
   *    el formulario en su estado inicial.
   */
  cancelarImmexProgram(): void {
    this.modificarImmexValor.emit(undefined);
    this.modificarImmexProgramForm.reset();
  }
  /**
   * Verifica si un campo del formulario no es válido.
   * @param id Identificador del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario undefined.
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.modificarImmexProgramForm.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /** Actualiza el valor de las instalaciones principales */
  actualizarInstalacionesPrincipales(valor: string | number): void {
    this.solicitud31101Store.actualizarInstalacionesPrincipales(valor);
  }

  /** Obtiene el valor del evento y actualiza el municipio */
  actualizarMunicipio(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarMunicipio(VALOR);
  }

  /** Usa el ID del catálogo para actualizar el tipo de instalación */
  actualizarTipoDeInstalacion(valor: Catalogo): void {
    this.solicitud31101Store.actualizarTipoDeInstalacion(valor.id);
  }

  /** Extrae el valor del evento y actualiza la entidad federativa */
  actualizarFederativa(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarFederativa(VALOR);
  }

  /** Obtiene el valor del evento y actualiza el número de registro SE */
  actualizarRegistroSE(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarRegistroSE(VALOR);
  }

  /** Extrae el valor del evento y actualiza la descripción */
  actualizarDesceripe(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarDesceripe(VALOR);
  }

  /** Obtiene el valor del evento y actualiza el código postal */
  actualizarCodigoPostal(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.solicitud31101Store.actualizarCodigoPostal(VALOR);
  }

  /** Modifica el proceso productivo con el nuevo valor proporcionado */
  actualizarProcesoProductivo(valor: string | number): void {
    this.solicitud31101Store.actualizarProcesoProductivo(valor);
  }

  /**
   *  Se ejecuta al destruir el componente, limpiando los observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
