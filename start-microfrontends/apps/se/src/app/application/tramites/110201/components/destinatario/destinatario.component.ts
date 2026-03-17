import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, CatalogoServices, CatalogosSelect, REGEX_NUMEROS, REG_X, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { OPTIONS_NACION, OPTIONS_TRANSPORTE } from '../../models/registro.model';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud110201State,
  Tramite110201Store,
} from '../../state/Tramite110201.store';
import { CommonModule } from '@angular/common';
import { RegistroService } from '../../services/registro.service';
import { Tooltip } from 'bootstrap';
import { Tramite110201Query } from '../../state/Tramite110201.query';

/**
 * @component DestinatarioComponent (Enhanced)
 * @description Componente responsable de gestionar la información del destinatario en el formulario 110201.
 * Proporciona funcionalidades para captura y validación de datos personales, domicilio y contacto.
 * Incluye validaciones reactivas, manejo de estado y integración con el store de NgRx.
 * @implements OnInit, OnDestroy, AfterViewInit
 * @features
 * - Formulario reactivo con validaciones
 * - Integración con NgRx Store
 * - Validación de campos obligatorios
 * - Comparación de países destino
 * - Filtrado de caracteres numéricos
 * - Bootstrap tooltips para ayuda
 * @dependencies FormBuilder, Store, ValidacionesService, Tramite110201Store
 */
@Component({
  selector: 'app-destinatario',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './destinatario.component.html',
  styleUrl: './destinatario.component.css',
})
export class DestinatarioComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  /**
   * @property consultaDatos - Estado de consulta de datos para el componente
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property soloLectura - Indica si el formulario está en modo solo lectura
   * Cuando es `true`, los campos del formulario no se pueden editar
   */
  soloLectura: boolean = false;

  /**
   * @property registroForm - Formulario reactivo para el destinatario con validaciones
   */
  registroForm!: FormGroup;

  /**
   * @property nacion - Catálogo de países de destino para selección
   */
  nacion!: CatalogosSelect;

  /**
   * @property transporte - Catálogo de medios de transporte disponibles
   */
  transporte!: CatalogosSelect;

  /**
   * @property solicitudState - Estado actual de la solicitud del trámite 110201
   */
  public solicitudState!: Solicitud110201State;

  /**
   * @property paisCertificadoOrigen - Valor de país/bloque del certificado de origen para validación cruzada
   */
  paisCertificadoOrigen: string | null = null;

  /**
   * @property paisNoCoincide - Controla si hay error de país destino distinto al certificado
   */
  paisNoCoincide: boolean = false;

  /**
   * @property isDisabled - Indica si el formulario está deshabilitado
   */
  isDisabled: boolean = false;

  /**
   * @property estaVacio - Indica si el formulario está vacío
   */
  estaVacio: boolean = false;

  /**
   * @property nacionOptions - Opciones del catálogo de países de destino
   * Contiene la configuración y lista de países disponibles para seleccionar como destino
   */
  public nacionOptions = OPTIONS_NACION;

  /**
   * @property transporteOptions - Opciones del catálogo de medios de transporte
   * Contiene la configuración y lista de medios de transporte disponibles para la mercancía
   */
  public transporteOptions = OPTIONS_TRANSPORTE;

  /**
   * @property option - Opciones del catálogo de transporte desde el servicio
   * Contiene una lista de objetos del catálogo obtenidos desde el servicio para los selectores
   */
  option!: Catalogo[];

  /**
   * @property destroyed$ - Notificador para destruir observables al destruir el componente
   * Se utiliza para gestionar la cancelación de suscripciones activas y evitar fugas de memoria
   */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * @property validationAttempted - Indica si se ha intentado validar el formulario
   * Se usa para mostrar errores de validación aunque el campo no haya sido tocado
   */
  validationAttempted: boolean = false;
  /** ID del trámite actual */
  TramitesID: string = '110201';
  /**
   * Indica si el componente destinatario está actualmente activo.
   * Este input se puede usar para alternar el estado activo del componente.
   * @default false
   */
  @Input() active = false;
  /**
   * @constructor Constructor del componente DestinatarioComponent
   * @param registroService - Servicio para obtener datos de catálogos
   * @param fb - Constructor de formularios reactivos de Angular
   * @param store - Tienda para gestionar el estado del trámite 110201
   * @param query - Query para consultas del estado del trámite
   * @param validacionesService - Servicio para validaciones de formularios
   * @param consultaioQuery - Query para consultas de estado de consulta
   * @param elRef - Referencia al elemento del DOM del componente
   */
  constructor(
    public registroService: RegistroService,
    public fb: FormBuilder,
    public store: Tramite110201Store,
    private query: Tramite110201Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
    private elRef: ElementRef,
    private catalogoServices: CatalogoServices
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Valida el formulario del destinatario.
   * Marca todos los campos como tocados si el formulario es inválido.
  /**
   * @method validarDestinatarioFormulario - Valida el formulario del destinatario
   * Marca todos los campos como tocados si el formulario es inválido
   */
  validarDestinatarioFormulario(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
    }
  }

  /**
   * Método del ciclo de vida que se llama cuando cambia cualquier propiedad enlazada por datos.
   * 
   * @param changes - Objeto de pares clave/valor, donde la clave es el nombre de la propiedad y el valor es un objeto {@link SimpleChanges} que contiene los valores actual y anterior.
   * 
   * Si la propiedad 'active' cambia y su valor actual es verdadero, este método dispara
   * la obtención de información de país de destino y transporte para el destinatario.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      // this.getPaisDestinoDestinatario();
      // this.getTransporteDestinatario();
    }
  }

  /**
   * @method onClick - Maneja el evento de clic para deshabilitar el formulario
   */
  onClick(): void {
    this.isDisabled = true;
  }
  
  /**
   * Maneja el evento de cambio para la selección de "Nación".
   * Actualiza el store con la descripción de la nación seleccionada.
   *
   * @param event - Objeto del evento que contiene los detalles de la nación seleccionada, incluyendo su descripción.
   */
  onNacionChange(event: Catalogo): void {
    this.store.setNacionDescripcion(event.descripcion);
  }

  /**
   * Maneja el evento de cambio para la selección de "Transporte".
   * Actualiza el store con la descripción del transporte seleccionado.
   *
   * @param event - Objeto del evento que contiene los detalles del transporte seleccionado, incluyendo su descripción.
   */
  onTransporteChange(event: Catalogo): void {
    this.store.setTransporteDescripcion(event.descripcion);
  }

  /**
   * @method ngOnInit - Método del ciclo de vida que se ejecuta al inicializar el componente
   * Obtiene los catálogos de países de destino y medios de transporte
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
      this.getPaisDestinoDestinatario();
      this.getTransporteDestinatario();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.paisCertificadoOrigen = seccionState?.pais || null;
        })
      )
      .subscribe();
    this.donanteDomicilio();
  }

  /**
   * @method validarFormularios - Valida todos los formularios del componente
   * @returns boolean - Indica si el formulario es válido
   * Si la referencia al componente no existe, retorna `true` (no hay formularios que validar)
   * @returns boolean
   */

  validarFormularios(): boolean {

    this.validationAttempted = true;

    if (this.registroForm.valid) {
      return true;
    }
    this.registroForm.markAllAsTouched();
    this.markAllControlsAsTouched(this.registroForm);

    this.validarDestinatarioFormulario();
    return false;
  }

  /**
   * Recursively marks all form controls as touched, including those in nested FormGroups
   * This is needed for custom components that implement ControlValueAccessor
   */
  private markAllControlsAsTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const CONTROL = formGroup.get(key);
      if (CONTROL instanceof FormGroup) {
        this.markAllControlsAsTouched(CONTROL);
      } else {
        CONTROL?.markAsTouched();
        CONTROL?.updateValueAndValidity();
      }
    });
  }

  /**
   * @method ngAfterViewInit - Inicializa los tooltips después de que la vista se haya inicializado
   * Utiliza Bootstrap para crear tooltips en los elementos con el atributo `data-bs-toggle="tooltip"`
   * Este método se ejecuta una vez que la vista del componente ha sido completamente renderizada
   */
  ngAfterViewInit(): void {
    const TOOLTIP_TRIGGER_LIST = this.elRef.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]');
    TOOLTIP_TRIGGER_LIST.forEach((tooltipTriggerEl: unknown) => {
      return new Tooltip(tooltipTriggerEl as Element);
    });
  }

  /**
   * @method inicializarEstadoFormulario - Evalúa si se debe inicializar o cargar datos en el formulario
   * Además, obtiene la información del catálogo de mercancía
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /**
   * @method guardarDatosFormulario - Carga datos desde un archivo JSON y actualiza el store
   * Luego reinicializa el formulario con los valores actualizados desde el store
   */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.registroForm.disable();
    } else {
      this.registroForm.enable();
    }
  }


  /**
   * Obtiene la lista de países de destino para el destinatario según el `TramitesID` actual.
   * Este método llama al servicio `paisesCatalogo`, se suscribe al resultado y actualiza la
   * propiedad `nacionOptions.catalogos` con los datos recibidos. La suscripción se cancela
   * automáticamente cuando el componente se destruye.
   */
  getPaisDestinoDestinatario(): void {
    this.catalogoServices.paisesCatalogo(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.nacionOptions.catalogos = res.datos ?? [];
    });
  }
  /**
   * Obtiene la lista de medios de transporte para el destinatario según el `TramitesID` actual.
   * Este método llama al servicio `catalogoMedioTransporte`, se suscribe al resultado y actualiza la
   * propiedad `transporteOptions.catalogos` con los datos recibidos. La suscripción se cancela
   * automáticamente cuando el componente se destruye.
   **/
  getTransporteDestinatario(): void {
    this.catalogoServices.catalogoMedioTransporte(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.transporteOptions.catalogos = res.datos ?? [];
    });
  }

  /**
   * @method onSubmit - Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.registroForm.valid) {
      // Aquí se implementará la lógica para manejar el envío del formulario.
    }
  }

  /**
   * @method isValid - Verifica si un campo del formulario es válido
   * @param form - Formulario reactivo
   * @param field - Nombre del campo a validar
   * @returns boolean - `true` si el campo es válido, de lo contrario `false`
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * @method setValoresStore - Establece valores en el estado de la tienda
   * @param form - Formulario reactivo
   * @param campo - Nombre del campo del formulario
   * @param metodoNombre - Método de la tienda para actualizar el estado
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110201Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
    if (campo === 'nacion') {
      this.compararPaisDestino(VALOR);
    }
  }

  /**
   * @method validarFormulario - Valida el formulario de certificado de origen
   * Retorna `true` si el formulario es válido, de lo contrario retorna `false`
   * Si el componente hijo no está disponible, retorna `false`
   * @returns boolean - Indica si el formulario es válido
   */
  validarFormulario(): boolean {
    let isValid = true;
    if (!this.validarFormularios()) {
      isValid = false;
    }
    return isValid;
  }

  /**
   * @method compararPaisDestino - Compara el país destino con el país/bloque del certificado de origen
   * Si no coinciden, activa el error
   * @param valorNacion - Valor del país seleccionado
   */
  compararPaisDestino(valorNacion: string): void {
    if (!this.paisCertificadoOrigen) {
      this.paisNoCoincide = false;
      return;
    }
    this.paisNoCoincide = valorNacion !== this.paisCertificadoOrigen;
  }

  /**
   * @getter validacionForm - Obtiene el formulario de validación
   * @returns FormGroup - Formulario de validación anidado
   */
  get validacionForm(): FormGroup {
    return this.registroForm.get('validacionForm') as FormGroup;
  }

  /**
   * @method donanteDomicilio - Configura el formulario reactivo con los valores iniciales del estado
   */
  donanteDomicilio(): void {
    this.registroForm = this.fb.group({
      validacionForm: this.fb.group({
        nacion: [{ value: this.solicitudState?.nacion, disabled: this.soloLectura }, [Validators.required]],
        transporte: [{ value: this.solicitudState?.transporte, disabled: this.soloLectura }, [Validators.required]],
        nombre: [{ value: this.solicitudState?.nombre, disabled: this.soloLectura }],
        apellidoPrimer: [{ value: this.solicitudState?.apellidoPrimer, disabled: this.soloLectura }],
        apellidoSegundo: [{ value: this.solicitudState?.apellidoSegundo, disabled: this.soloLectura }],
        numeroFiscal: [{ value: this.solicitudState?.numeroFiscal, disabled: this.soloLectura }, [Validators.required]],
        razonSocial: [{ value: this.solicitudState?.razonSocial, disabled: this.soloLectura }],
        ciudad: [{ value: this.solicitudState?.ciudad, disabled: this.soloLectura }, [Validators.required]],
        calle: [{ value: this.solicitudState?.calle, disabled: this.soloLectura }, [Validators.required]],
        numeroLetra: [{ value: this.solicitudState?.numeroLetra, disabled: this.soloLectura }, [Validators.required]],
        lada: [{ value: this.solicitudState?.lada, disabled: this.soloLectura }],
        telefono: [{ value: this.solicitudState?.telefono, disabled: this.soloLectura }, [Validators.pattern(REG_X.REGEX_FRACCION_ARANCELARIA)]],
        fax: [{ value: this.solicitudState?.fax, disabled: this.soloLectura }, [Validators.pattern(REG_X.REGEX_FRACCION_ARANCELARIA)]],
        correoElectronico: [{ value: this.solicitudState?.correoElectronico, disabled: this.soloLectura }, [Validators.required, Validators.email]],
      }),
    });
  }

  /**
   * @method soloDigitos - Permite solo números en un campo de entrada
   * Filtra caracteres no numéricos y limita la longitud según el campo
   * @param event - El evento de entrada del campo
   */
  soloDigitos(event: Event): void {
    const INPUT = (event.target as HTMLInputElement);
    const VALUE = INPUT.value;
    const FIELD_NAME = INPUT.getAttribute('formControlName');

    const NUMERIC_VALUE = VALUE.replace(REGEX_NUMEROS, '');

    let maxLength = 10;
    if (FIELD_NAME === 'fax') {
      maxLength = 20;
    }

    const LIMITED_VALUE = NUMERIC_VALUE.slice(0, maxLength);

    if (VALUE !== LIMITED_VALUE) {
      INPUT.value = LIMITED_VALUE;
      this.registroForm.get('validacionForm.' + FIELD_NAME)?.setValue(LIMITED_VALUE);
    }
  }

  /**
   * @method ngOnDestroy - Método del ciclo de vida que se ejecuta al destruir el componente
   * Cancela todas las suscripciones activas para evitar fugas de memoria
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


}
