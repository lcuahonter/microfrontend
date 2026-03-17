import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Modal } from 'bootstrap';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionColumna,
  ConsultaioQuery,
  ConsultaioState,
  REGEX_ALFANUMERICO_CON_ESPACIOS,
  REGEX_SOLO_DIGITOS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService
} from '@ng-mf/data-access-user';

import {
  CONFIGURATION_TABLA_DESTINATARIO,
  MENSAJEDEALERTA
} from '../../constantes/certificado-zoosanitario.enum';

import { Destinatario, DestinatarioRespuesta } from '../../models/pantallas-captura.model';

import { CapturaSolicitudeService } from '../../services/captura-solicitud.service';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';

import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';

import { Solicitud220402State, Solicitud220402Store } from '../../estados/tramites/tramites220402.store';



@Component({
  selector: 'app-agregar-destinatario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './agregar-destinatario.component.html',
  styleUrl: './agregar-destinatario.component.scss',
})
export class AgregarDestinatarioComponent implements OnDestroy, OnInit {
  /**
   * @property {ReplaySubject<boolean>} destroyed$
   * @description ReplaySubject utilizado para notificar la destrucción del componente y evitar fugas de memoria.
   * 
   * Este ReplaySubject emite un valor cuando el componente es destruido y se completa para liberar recursos.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * @property {Solicitud220402State} destinatarioState
   * @description Estado actual del destinatario, que contiene información relacionada con el trámite y el destinatario.
   */
  public destinatarioState!: Solicitud220402State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Subscription} statusSubscription
   * @description Suscripción a los cambios de estado del formulario para actualizar el store.
   * @private
   */
  private statusSubscription!: Subscription;

  /**
   * @property {CatalogosSelect} pais
   * @description Catálogo que contiene información sobre los países disponibles para el destinatario.
   */
  public pais!: CatalogosSelect;

  /**
   * @property {Catalogo[]} options
   * @description Lista de opciones disponibles en el catálogo.
   */
  Opciones!: Catalogo[];

  //paaise lista
  paisLista!: Catalogo[];

  /**
   * @property {FormGroup} destinatarioForm
   * @description Formulario principal que contiene los datos del destinatario.
   */
  destinatarioForm!: FormGroup;

  /**
   * @property {CatalogosSelect} tiposDocumentos
   * @description Catálogo que contiene los tipos de documentos disponibles para el destinatario.
   * 
   * @property {string} labelNombre - Nombre del catálogo.
   * @property {boolean} required - Indica si el catálogo es obligatorio.
   * @property {string} primerOpcion - Texto de la primera opción del catálogo.
   * @property {Catalogo[]} catalogos - Lista de opciones disponibles en el catálogo.
   */
  public tiposDocumentos: CatalogosSelect = {
    labelNombre: 'Medio de transporte',
    required: true,
    primerOpcion: 'Selecciona un medio de transporte',
    catalogos: [],
  };
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;
  /** Mensaje de alerta utilizado en el componente. */
  public TEXTOS = MENSAJEDEALERTA;

  /** Configuración de las columnas de la tabla de destinatarios. */
  configuracionTablaDatos: ConfiguracionColumna<Destinatario>[] = CONFIGURATION_TABLA_DESTINATARIO;

  /** Lista de destinatarios cargados en el componente. */
  destinatario: Destinatario[] = [];

  /** Lista de destinatarios seleccionados en la tabla. */
  seleccionarDestinatario: Destinatario[] = [];

  /** Referencia al botón para cerrar el modal de domicilio. */
  @ViewChild('closeDomicilio') public closeDomicilio!: ElementRef;

  /** Configuración del tipo de selección en la tabla (checkbox). */
  public checkbox = TablaSeleccion.CHECKBOX;

  /** Referencia al modal de domicilio. */
  @ViewChild('modalDomicilio') modalDomicilio!: ElementRef;
  /**
   * Constructor del componente.
   * 
   * Inicializa los servicios y dependencias necesarias para el funcionamiento del componente.
   * También invoca el método `fetchTiposDocumentos` para cargar los tipos de documentos disponibles.
   * 
   * @param {MediodetransporteService} mediodetransporteService - Servicio para obtener los medios de transporte.
   * @param {Solicitud220402Store} solicitud220402Store - Store para gestionar el estado del trámite 220402.
   * @param {Solicitud220402Query} solicitud220402Query - Query para consultar el estado del trámite 220402.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {ValidacionesFormularioService} validacionesService - Servicio para realizar validaciones en los formularios.
   * @param {ConsultaioQuery} consultaioQuery - Query para consultar el estado de la consulta inicial.
   * @param {CapturaSolicitudeService} capturaSolicitudeService - Servicio para gestionar la captura de solicitudes.
   * @param {ChangeDetectorRef} cdr - Servicio para la detección de cambios en el componente.
   */
  constructor(private mediodetransporteService: MediodetransporteService,
    private solicitud220402Store: Solicitud220402Store,
    private solicitud220402Query: Solicitud220402Query,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
    private capturaSolicitudeService: CapturaSolicitudeService,
    private cdr: ChangeDetectorRef
  ) {
    this.fetchTiposDocumentos()
  }

  ngOnInit(): void {
    this.inicializaCatalogos();
    this.solicitud220402Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.destinatarioState = seccionState;
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.crearFormTransporte();
    this.destinatario = this.destinatarioState.destinatario || [];

    // Suscripción a los cambios de estado del formulario para actualizar el store de Akita.
    this.statusSubscription = this.destinatarioForm.statusChanges.subscribe(() => {
        this.solicitud220402Store.updateFormStatus('destinatario', this.destinatarioForm.valid);
    });

    // Comprueba si se debe marcar el formulario como 'touched' al iniciar.
    if (this.solicitud220402Query.getValue().markAllAsTouched) {
        this.mostrarErrores();
    }
  }

  /**
* Obtiene el grupo de formulario 'agregarDestinatario' del formulario principal 'destinatarioForm'.
*
* @returns {FormGroup} El grupo de formulario 'agregarDestinatario'.
*/
  get agregarDestinatario(): FormGroup {
    return this.destinatarioForm.get('agregarDestinatario') as FormGroup;
  }

  /**
 * Obtiene el grupo de formulario 'datosPersonales' del formulario principal 'destinatarioForm'.
 *
 * @returns {FormGroup} El grupo de formulario 'datosPersonales'.
 */
  get datosPersonales(): FormGroup {
    return this.destinatarioForm.get('datosPersonales') as FormGroup;
  }

  /**
 * Obtiene el grupo de formulario 'selectedTipoPersona' del formulario principal 'destinatarioForm'.
 *
 * @returns {FormGroup} El grupo de formulario 'selectedTipoPersona'.
 */
  get selectedTipoPersona(): string {
    return this.agregarDestinatario.get('tipoPersona')?.value;
  }
  /**
     * Este método se utiliza para crear la forma del Destinatario. - 220402
     */
  crearFormTransporte(): void {
    this.destinatarioForm = this.fb.group({
      agregarDestinatario: this.fb.group({
        tipoPersona: [this.destinatarioState?.tipoPersona, [Validators.required]]
      }),
      datosPersonales: this.fb.group({
        nombre: [this.destinatarioState?.nombre, [Validators.required, Validators.maxLength(50), Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS)]],
        primerApellido: [this.destinatarioState?.primerApellido, [Validators.required, Validators.maxLength(50), Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS)]],
        segundoApellido: [this.destinatarioState?.segundoApellido, [Validators.maxLength(50), Validators.pattern(REGEX_ALFANUMERICO_CON_ESPACIOS)]],
        denominacion: [this.destinatarioState?.denominacion, [Validators.required, Validators.maxLength(100)]],
        pais: [this.destinatarioState?.pais, [Validators.required]],
        domicilio: [this.destinatarioState?.domicilio, [Validators.required, Validators.maxLength(200)]],
        lada: [this.destinatarioState?.lada, [Validators.minLength(1), Validators.maxLength(4), Validators.pattern(REGEX_SOLO_DIGITOS)]],
        telefono: [this.destinatarioState?.telefono, [Validators.minLength(7), Validators.maxLength(10), Validators.pattern(REGEX_SOLO_DIGITOS)]],
        correoElectronico: [this.destinatarioState?.correoElectronico, [Validators.email]]
      })
    });
    this.inicializarEstadoFormulario();
  }
  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según el modo de solo lectura.
   * 
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario `destinatarioForm`.
   * En caso contrario, habilita los controles del formulario.
   * 
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.destinatarioForm?.disable();
    } else {
      this.destinatarioForm?.enable();
    }
  }

  /**
   * Este método se utiliza para obtener los datos de los medios de transporte.
   */
  fetchTiposDocumentos(): void {
    this.mediodetransporteService
      .getMedioDeTransporte()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.tiposDocumentos.catalogos = data.datos as Catalogo[];
      });
  }

  /**
   * Inicializa los catálogos necesarios para el formulario.
   */
  private inicializaCatalogos(): void {
    this.mediodetransporteService
      .getPais()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.paisLista = data.datos as Catalogo[];
      });
  }

  /**
   * Este método se utiliza para marcar los controles del formulario como tocados. - 220402
   */
  validarDestinatarioFormulario(): void {
    this.destinatarioForm.markAllAsTouched();
    if (this.destinatarioForm.valid) {
      const VALOR = this.destinatarioForm.getRawValue();
      const PAIS: string = this.paisLista.find(opt => opt?.clave?.toString() === VALOR.datosPersonales.pais)?.clave || '';
      const PAISLABEL: string = this.paisLista.find(opt => opt?.clave?.toString() === VALOR.datosPersonales.pais)?.descripcion || '';

      const TIPOPERSONA = VALOR.agregarDestinatario.tipoPersona;
      let nombreDenominacion: string;
      let nuevoDestinatario: Destinatario;

      if (TIPOPERSONA === 'fisica') {
        nombreDenominacion = `${VALOR.datosPersonales.nombre} ${VALOR.datosPersonales.primerApellido} ${VALOR.datosPersonales.segundoApellido || ''}`.trim();
        nuevoDestinatario = {
          id: this.destinatario.length + 1,
          nombreDenominacionORazonSocial: nombreDenominacion,
          telefono: VALOR.datosPersonales.telefono,
          correoElectronico: VALOR.datosPersonales.correoElectronico,
          domicilio: VALOR.datosPersonales.domicilio,
          paisLabel: PAISLABEL,
          pais: PAIS,
          lada: VALOR.datosPersonales.lada,
          nombre: VALOR.datosPersonales.nombre,
          primerApellido: VALOR.datosPersonales.primerApellido,
          segundoApellido: VALOR.datosPersonales.segundoApellido
        };
      } else { // moral
        nombreDenominacion = VALOR.datosPersonales.denominacion;
        nuevoDestinatario = {
          id: this.destinatario.length + 1,
          nombreDenominacionORazonSocial: nombreDenominacion,
          telefono: VALOR.datosPersonales.telefono,
          correoElectronico: VALOR.datosPersonales.correoElectronico,
          domicilio: VALOR.datosPersonales.domicilio,
          paisLabel: PAISLABEL,
          pais: PAIS,
          lada: VALOR.datosPersonales.lada
        };
      }

      this.destinatario = [...this.destinatario, nuevoDestinatario];
      this.solicitud220402Store.setDestinatario(this.destinatario);
      this.closeDomicilio.nativeElement.click();
    }
  }

  /**
   * Verifica si un campo específico en un formulario es válido.
   *
   * @param {FormGroup} form - El formulario que contiene el campo a validar.
   * @param {string} field - El nombre del campo a validar.
   * @returns {boolean} - Retorna `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
     * Establece los valores en el store de tramite5701.
     *
     * @param {FormGroup} form - El formulario del cual se obtiene el valor.
     * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
     * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
     * @returns {void}
     */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud220402Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud220402Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
  /** Muestra el modal de domicilio. */
  tercerosAgregar(): void {
    if (this.modalDomicilio) {
      const MODAL_INSTANCE = new Modal(this.modalDomicilio.nativeElement);
      this.destinatarioForm.reset();

      if (this.seleccionarDestinatario.length > 0) {
        // Modo Edición
        const ITEM = this.seleccionarDestinatario[0];
        const TIPOPERSONA= ITEM.nombre ? 'fisica' : 'moral';
        this.destinatarioForm.patchValue({
          agregarDestinatario: {
            tipoPersona: TIPOPERSONA
          },
          datosPersonales: {
            nombre: ITEM.nombre,
            primerApellido: ITEM.primerApellido,
            segundoApellido: ITEM.segundoApellido,
            denominacion: TIPOPERSONA === 'moral' ? ITEM.nombreDenominacionORazonSocial : '',
            pais: ITEM.pais,
            domicilio: ITEM.domicilio,
            telefono: ITEM.telefono,
            correoElectronico: ITEM.correoElectronico
          }
        });
        this.tipoPersonaCambiar(); // Asegura que las validaciones se apliquen correctamente
      } else {
        // Modo Agregar
        if (this.destinatarioState.paisDeDestino) {
          this.destinatarioForm.patchValue({
            datosPersonales: {
              pais: this.destinatarioState.paisDeDestino
            }
          });
        }
      }
      MODAL_INSTANCE.show();
    }
  }
  /** Selecciona los datos de destinatarios desde el evento. */
  seleccionarDatos(evento: Destinatario[]): void {
    this.seleccionarDestinatario = evento;
  }
  /** Limpia y reinicia el formulario de destinatarios. */
  limpiar(): void {
    this.destinatarioForm.reset();
    this.destinatarioForm.get('datosPersonales.nombre')?.setValidators([Validators.required]);
    this.destinatarioForm.get('datosPersonales.primerApellido')?.setValidators([Validators.required]);
    this.destinatarioForm.get('datosPersonales.denominacion')?.setValidators([Validators.required]);
    const GRUPO = this.destinatarioForm.get('datosPersonales') as FormGroup;
    if (GRUPO) {
      Object.values(GRUPO.controls).forEach(control => {
        control.updateValueAndValidity();
      });
    }
  }
  /** Cambia las validaciones del formulario según el tipo de persona seleccionado. */
  tipoPersonaCambiar(): void {
    this.destinatarioForm.patchValue({
      datosPersonales: {
        nombre: '',
        primerApellido: '',
        denominacion: '',
        segundoApellido: '',
      }
    });
    const TIPOPERSONA = this.agregarDestinatario.get('tipoPersona')?.value;
    if (TIPOPERSONA === 'fisica') {
      this.destinatarioForm.get('datosPersonales.nombre')?.setValidators([Validators.required]);
      this.destinatarioForm.get('datosPersonales.primerApellido')?.setValidators([Validators.required]);
      this.destinatarioForm.get('datosPersonales.denominacion')?.setValidators([]);
    } else {
      this.destinatarioForm.get('datosPersonales.denominacion')?.setValidators([Validators.required]);
      this.destinatarioForm.get('datosPersonales.nombre')?.setValidators([]);
      this.destinatarioForm.get('datosPersonales.primerApellido')?.setValidators([]);
    }
    const GRUPO = this.destinatarioForm.get('datosPersonales') as FormGroup;
    if (GRUPO) {
      Object.values(GRUPO.controls).forEach(control => {
        control.updateValueAndValidity();
      });
    }
  }
  /** Carga la lista de destinatarios desde el servicio. */
  public cargarDestinatario(): void {
    this.capturaSolicitudeService
      .obtenerDestinatario()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (datos: DestinatarioRespuesta) => {
          datos.datos[0].id = this.destinatario.length;
          this.destinatario = [...datos.datos, ...this.destinatario];
        }
      );
  }
  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida que se ejecuta al destruir el componente.
   * 
   * Este método emite un valor en el `ReplaySubject` `destroyed$` para notificar la destrucción del componente y completa el `ReplaySubject` para liberar recursos y evitar fugas de memoria.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    // Asegura que el último estado de validez se guarde en el store antes de destruir el componente.
    this.solicitud220402Store.updateFormStatus('destinatario', this.destinatarioForm.valid);

    // Cancela la suscripción a los cambios de estado para evitar fugas de memoria.
    if (this.statusSubscription) {
        this.statusSubscription.unsubscribe();
    }

    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Este método se utiliza para mostrar los errores en el formulario.
   * 
   * Marca todos los controles del formulario como tocados y dispara la detección de cambios.
   * 
   * @returns {void}
   */
  public mostrarErrores = ():void => {
    if (this.destinatarioForm) {
      this.destinatarioForm.markAllAsTouched();
    }
    this.cdr.detectChanges();
  }
}