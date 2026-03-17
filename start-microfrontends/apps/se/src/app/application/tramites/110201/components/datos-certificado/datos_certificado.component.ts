import {
  Catalogo,
  ConsultaioQuery,
  ConsultaioState,
  TituloComponent,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { CatalogoSelectComponent, CatalogoServices, CatalogosSelect } from '@libs/shared/data-access-user/src';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OPTIONS_ENTIDAD_FEDERATIVA, OPTIONS_IDIOMA, OPTIONS_REPRESENTACION_FEDERAL } from '../../models/registro.model';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud110201State,
  Tramite110201Store,
} from '../../state/Tramite110201.store';
import { CommonModule } from '@angular/common';
import { RegistroService } from '../../services/registro.service';
import { Tramite110201Query } from '../../state/Tramite110201.query';

/**
 * @component DatosCertificadoComponent
 * @description Componente Angular standalone que gestiona el formulario de datos del certificado
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 * 
 * Este componente es responsable de:
 * - Gestionar el formulario reactivo para datos del certificado
 * - Validar campos obligatorios como idioma, entidad federativa y representación federal
 * - Manejar la lógica de solo lectura según el estado de consulta
 * - Integrar con el store de estado global del trámite 110201
 * - Realizar validaciones dinámicas según la entidad federativa seleccionada
 */
@Component({
  selector: 'app-datos-certificado',
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
  ],
  templateUrl: './datos_certificado.component.html',
  styleUrl: './datos_certificado.component.css',
})
export class DatosCertificadoComponent implements OnInit, OnDestroy, OnChanges {

  /** Estado de consulta obtenido desde el query de consulta global */
  consultaDatos!: ConsultaioState;

  /** Bandera que indica si el formulario está en modo solo lectura */
  soloLectura: boolean = false;

  /** Bandera que indica si se ha intentado validar el formulario para mostrar errores */
  validationAttempted: boolean = false;

  /** Instancia del formulario reactivo principal que contiene todos los controles */
  registroForm!: FormGroup;

  /** Configuración del catálogo de idiomas para el componente select */
  idioma!: CatalogosSelect;

  /** Configuración del catálogo de entidades federativas para el componente select */
  entidad!: CatalogosSelect;

  /** Configuración del catálogo de representaciones federales para el componente select */
  representacion!: CatalogosSelect;

  /** Estado actual de la solicitud obtenido desde el store global */
  public solicitudState!: Solicitud110201State;

  /** Datos de la entidad federativa recibidos como parámetro de entrada del componente padre */
  @Input() entidadFederativaData: unknown;

  /** Bandera que controla la visibilidad de la sección de justificación */
  isJustificacion: boolean = false;

  /** Array que contiene las descripciones de las entidades federativas */
  entidadDescripcion: unknown[] = [];

  /** Subject utilizado para cancelar suscripciones al destruir el componente */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Opciones del catálogo de idiomas obtenidas desde el modelo de registro */
  public optionsIdioma = OPTIONS_IDIOMA;

  /** Opciones del catálogo de entidades federativas obtenidas desde el modelo de registro */
  public optionsEntidad = OPTIONS_ENTIDAD_FEDERATIVA;

  /** Opciones del catálogo de representaciones federales obtenidas desde el modelo de registro */
  public optionsRepresentacion = OPTIONS_REPRESENTACION_FEDERAL;
  /**
   * Indica si el componente está actualmente activo.
   * Este input puede usarse para controlar el estado o la visibilidad del componente.
   * @default false
   */
  @Input() active = false;

  /** ID del trámite actual */
  TramitesID: string = '110201';
  /**
   * Constructor del componente que inyecta las dependencias necesarias
   * @param registroService - Servicio para obtener datos de catálogos desde la API
   * @param fb - Constructor de formularios reactivos de Angular
   * @param store - Store para gestionar el estado global del trámite 110201
   * @param query - Query para obtener datos del estado del trámite
   * @param validacionesService - Servicio para validaciones de formularios
   * @param consultaioQuery - Query para obtener el estado de consulta global
   */
  constructor(
    private registroService: RegistroService,
    public fb: FormBuilder,
    public store: Tramite110201Store,
    private query: Tramite110201Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery,
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
      .subscribe();
  }

  /**
   * Valida el formulario del destinatario marcando todos los campos como tocados si es inválido
   */
  validarDestinatarioFormulario(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
    }
  }

  /**
   * Método del ciclo de vida OnInit que inicializa el componente y obtiene datos necesarios
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
   this.getIdiomaDatos();
      this.getEntidadDatos();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.donanteDomicilio();

    if (
      // this.entidadDescripcion.includes('8') &&
      this.entidadFederativaData === 'DURANGO'
    ) {
      this.isJustificacion = true;
    } else {
      this.isJustificacion = false;
    }
  }

  /** Maneja el evento de cambio cuando se selecciona un nuevo idioma.
   * Actualiza la descripción del idioma en el store global.
   * @param event - Objeto Catalogo que representa el idioma seleccionado.
   */
  onIdiomaChange(event: Catalogo): void {
    this.store.setIdiomaDescripcion(event.descripcion);
  }

  /** Maneja el evento de cambio cuando se selecciona una nueva entidad federativa.
   * Actualiza la descripción de la entidad en el store global y obtiene las representaciones federales correspondientes.
   * @param event - Objeto Catalogo que representa la entidad seleccionada.
   */
  onRepresentacionChange(event: Catalogo): void {
    this.store.setRepresentacionDescripcion(event.descripcion);
  }
  /**
   * Hook de ciclo de vida que se llama cuando alguna propiedad enlazada a datos del componente cambia.
   * Verifica si la propiedad de entrada 'active' ha cambiado y su valor actual es verdadero.
   * Si es así, dispara la obtención de datos de idioma y entidad llamando a `getIdiomaDatos()` y `getEntidadDatos()`.
   *
   * @param changes - Objeto con pares clave/valor para el conjunto de propiedades cambiadas.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      // this.getIdiomaDatos();
      // this.getEntidadDatos();
    }
  }
  /**
   * Valida el formulario de datos del certificado y maneja el estado de validación
   * @returns true si el formulario es válido, false en caso contrario
   */
  validarFormulariosDatos(): boolean {
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
   * Marca recursivamente todos los controles de formulario como tocados, incluyendo FormGroups anidados
   * @param formGroup - Grupo de formulario a procesar
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
   * Evalúa si se debe inicializar o cargar datos en el formulario según el modo de lectura
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /**
   * Guarda los datos del formulario y configura el estado de habilitado/deshabilitado
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
   * Obtiene los datos del catálogo de idiomas para el trámite actual usando el TramitesID proporcionado.
   * Los datos recuperados se asignan a la propiedad `optionsIdioma.catalogos`.
   * La suscripción al observable se cancela automáticamente cuando el componente se destruye.
   */
  getIdiomaDatos(): void {
    this.catalogoServices.catalogoIdioma(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.optionsIdioma.catalogos = res.datos ?? [];
    });
  }
  /** Obtiene los datos del catálogo de entidades federativas para el trámite actual usando el TramitesID proporcionado.
   * Los datos recuperados se asignan a la propiedad `optionsEntidad.catalogos`.
   * Además, se suscribe a los cambios en el campo 'entidad' del formulario para actualizar dinámicamente
   * la lista de representaciones federales cuando la entidad seleccionada cambia.
   * La suscripción al observable se cancela automáticamente cuando el componente se destruye.
   */
  getEntidadDatos(): void {
    this.catalogoServices.entidadesFederativasCatalogo(this.TramitesID).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      this.optionsEntidad.catalogos = res.datos ?? [];
    });
  }
  /** Maneja el evento de cambio cuando se selecciona una nueva entidad federativa.
   * Actualiza la lista de representaciones federales basándose en la entidad seleccionada.
   * @param event - Objeto Catalogo que representa la entidad seleccionada.
   */
  onChangeEntidad(event: Catalogo): void {
    const SELECTED_ENTIDAD = event;
    this.getRepresentacionDatos({
      clave: SELECTED_ENTIDAD.clave ?? '',
      descripcion: SELECTED_ENTIDAD.descripcion ?? ''
    });
    this.store.setEntidadDescripcion(SELECTED_ENTIDAD.descripcion ?? '');
  }
  
  /** Obtiene los datos del catálogo de representaciones federales basado en la clave de entidad proporcionada.
   * Los datos recuperados se asignan a la propiedad `optionsRepresentacion.catalogos`.
   * La suscripción al observable se cancela automáticamente cuando el componente se destruye.
   * @param cveEntidad - Clave de la entidad para filtrar las representaciones federales.
   */
  getRepresentacionDatos(cveEntidad: { clave: string; descripcion: string }): void {
    this.catalogoServices
      .representacionFederalCatalogo(this.TramitesID, cveEntidad.clave)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        const DESCRIPCION_ENTIDAD: string = (cveEntidad.descripcion ?? '')
          .toString()
          .trim()
          .toLowerCase();

        const CATALOGOS = res.datos ?? [];

        const MATCHED = CATALOGOS.find(
          (item) =>
          ((item.descripcion ?? '').toString().trim().toLowerCase() ===
            DESCRIPCION_ENTIDAD)
        );

        const OTHERS = CATALOGOS.filter(
          (items) =>
          ((items.descripcion ?? '').toString().trim().toLowerCase() !==
            DESCRIPCION_ENTIDAD)
        );


        this.registroForm
          .get('validacionForm.representacion')
          ?.setValue(MATCHED ? MATCHED.clave : null);

        this.setValoresStore(this.registroForm, 'validacionForm.representacion', 'setRepresentacion');

        this.optionsRepresentacion.catalogos = MATCHED
          ? [MATCHED, ...OTHERS]
          : OTHERS;
      });
  }

  /**
   * Verifica si un campo específico del formulario es válido
   * @param form - Formulario reactivo a validar
   * @param field - Nombre del campo a verificar
   * @returns true si el campo es válido, false en caso contrario
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece valores en el store global y maneja lógica específica para entidades federativas
   * @param form - Formulario reactivo del cual obtener el valor
   * @param campo - Nombre del campo del formulario
   * @param metodoNombre - Método del store a ejecutar para actualizar el estado
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110201Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);

    if (VALOR === 8 && metodoNombre === 'setEntidad' && this.entidadFederativaData === 'DURANGO'
    ) {
      this.isJustificacion = true;
    } else {
      this.isJustificacion = false;
    }
  }

  /**
   * Valida todos los formularios de datos del certificado
   * @returns true si todos los formularios son válidos, false en caso contrario
   */
  validarFormularioDatos(): boolean {
    let isValid = true;
    if (!this.validarFormulariosDatos()) {
      isValid = false;
    }
    return isValid;
  }

  /**
   * Getter que retorna el FormGroup de validación anidado dentro del formulario principal
   * @returns FormGroup de validación
   */
  get validacionForm(): FormGroup {
    return this.registroForm.get('validacionForm') as FormGroup;
  }

  /**
   * Configura e inicializa el formulario reactivo con todos los controles y validaciones necesarias
   */
  donanteDomicilio(): void {
    this.registroForm = this.fb.group({
      validacionForm: this.fb.group({
        observaciones: [{ value: this.solicitudState?.observaciones, disabled: this.soloLectura }],
        presica: [{ value: this.solicitudState?.presica, disabled: this.soloLectura }, [Validators.required]],
        presenta: [{ value: this.solicitudState?.presenta, disabled: this.soloLectura }],
        idioma: [{ value: this.solicitudState?.idioma, disabled: this.soloLectura }, [Validators.required]],
        entidad: [{ value: this.solicitudState?.entidad, disabled: this.soloLectura }, [Validators.required]],
        representacion: [{ value: this.solicitudState?.representacion, disabled: this.soloLectura }, [Validators.required]],
        casillaVerificacion: [{ value: this.solicitudState?.casillaVerificacion, disabled: this.soloLectura }],
        justificacion: [{ value: this.solicitudState?.justificacion, disabled: this.soloLectura }, [Validators.required]],
      }),
    });
  }

  /**
   * Método del ciclo de vida OnDestroy que limpia suscripciones para evitar memory leaks
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
