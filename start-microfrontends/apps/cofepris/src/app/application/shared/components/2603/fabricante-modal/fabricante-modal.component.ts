import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Catalogo, CatalogoSelectComponent, Fabricante, InputRadioComponent, REGEX_CURP, REGEX_PATRON_ALFANUMERICO, REGEX_POSTAL, REGEX_RFC, REGEX_SOLO_NUMEROS, REGEX_TELEFONO_OPCIONAL, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CatalogoServices, ConsultaioQuery } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Solicitud2603State, Tramite2603Store } from '../../../estados/stores/2603/tramite2603.store';
import { Subject, map, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CertificadosLicenciasPermisosService } from '../../../services/shared2603/certificados-licencias-permisos.service';
import { CommonModule } from '@angular/common';

import { Otros2603, RadioOpcion } from '@libs/shared/data-access-user/src/core/models/shared2603/certificados-licencias-permisos.model';

import { ID_PROCEDIMIENTO, PERMISO_DEFINITIVO_TITULO } from '../../../constantes/shared2603/medicos-sin-registrar.enum';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Tramite260301Store } from '../../../../tramites/260301/estados/stores/tramites260301.store';
import { Tramite2603Query } from '../../../estados/queries/2603/tramite2603.query';
import terecerosNacionalidos from '@libs/shared/theme/assets/json/2603/terceros-nacionalidad.json';
import tipoPersona from '@libs/shared/theme/assets/json/2603/tipo-persona.json';

/**
 * FabricanteModalComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-fabricante-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputRadioComponent, TituloComponent, TooltipModule, CatalogoSelectComponent],
  templateUrl: './fabricante-modal.component.html',
  styleUrl: './fabricante-modal.component.scss',
})
export class FabricanteModalComponent implements OnInit, OnDestroy, OnChanges {
  @Output() guardarFabricante = new EventEmitter<Record<string, unknown>>();

  /**
   * Título del componente modal.
   */
  titulo: string;

      /**
     * @property
     * @name permisoDefinitivoTitulo
     * @type {number[]}
     * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
     */
  @Input() permisoDefinitivoTitulo: number[] = PERMISO_DEFINITIVO_TITULO;

  /**
   * @property
   * @name permisoSeccion
   * @type {number[]}
   * @description Identificador de la sección de permisos específica para este procedimiento.
   */
  @Input() permisoSeccion: number[] = [];

  /**
   * Identificador numérico del procedimiento actual.
   *
   * @type {string}
   * @default ID_PROCEDIMIENTO
   *
   * ### Descripción:
   * - Almacena el valor del procedimiento que se está ejecutando.
   * - Se inicializa con la constante `ID_PROCEDIMIENTO`.
   */
  idProcedimiento: number[] = ID_PROCEDIMIENTO;

  @Input() public procedureID: number = 260301;

  /**
   * Datos existentes para prellenar el formulario en modo modificación.
   */
  datosExistentes?: Fabricante | Otros2603;

  /**
   * Indica si el modal está en modo modificación.
   */
  esModificacion?: boolean;

  /**
   * Catálogo de países disponibles para selección.
   * Se espera que esta propiedad sea un arreglo de objetos `Catalogo`.
   */
  public paisCatalogo: Catalogo[] = [];
  private estadoAnterior = ''
  /**
   * Formulario reactivo para gestionar y validar los datos de terceros relacionados.
   */
  public tercerosRelacionadosForm!: FormGroup;
  /**
   * Estado de la Solicitud 2603.
   * Contiene los datos y la gestión del estado para la solicitud actual.
   */
  public solicitudState!: Solicitud2603State;
  /**
   * Notificador para destruir los observables al finalizar.
   */
  private notificadorDestruir$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esSoloLecturaFormulario: boolean = false;

  /** Opciones de nacionalidad para terceros, obtenidas del catálogo correspondiente. */
  public opcionesNacionalidadTerceros: RadioOpcion[] = Array.isArray(terecerosNacionalidos) ? terecerosNacionalidos as RadioOpcion[] : [];

  /** Opciones de tipo de persona, obtenidas del catálogo correspondiente. */
  public opcionesTipoPersona: RadioOpcion[] = Array.isArray(tipoPersona) ? tipoPersona as RadioOpcion[] : [];

  /** Procedimientos que requieren habilitación completa de campos para destinatario final */
  private static readonly PROCEDIMIENTOS_DESTINATARIO_FINAL = [260304, 260302];

  /** Procedimientos con comportamiento especial para campos */
  private static readonly PROCEDIMIENTOS_ESPECIALES = [260304, 260302];

  /**
   * Getter que verifica si el procedimiento es especial para uso en template
   */
  get esProcedimientoEspecial(): boolean {
    return this.permisoDefinitivoTitulo && 
           this.permisoDefinitivoTitulo.some(id => FabricanteModalComponent.PROCEDIMIENTOS_ESPECIALES.includes(id));
  }

  /**
   * Getter que verifica si es un procedimiento 260303 con formularios simplificados
   */
  get esProcedimiento260303(): boolean {
    return this.permisoDefinitivoTitulo && 
           this.permisoDefinitivoTitulo.some(id => [260303].includes(id)) &&
           ['Agregar fabricante', 'Agregar facturador', 'Agregar proveedor/distribuidor', 'Agregar certificado analítico'].includes(this.titulo);
  }

  /**
   * Obtiene las opciones de tipo de persona filtradas según la nacionalidad seleccionada.
   * Si la nacionalidad es 'extranjero' o si es trámite 260304, se excluye la opción 'noContribuyente'.
   *
   * @returns {RadioOpcion[]} Un arreglo de opciones de tipo de persona filtradas.
   */
  get opcionesTipoPersonaFiltradas(): RadioOpcion[] {
    const NACIONALIDAD = this.tercerosRelacionadosForm?.get('tercerosNacionalidad')?.value;
    const ES_AGREGAR_OTROS = this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros';

    // Procedimientos que ocultan 'noContribuyente' EXCEPTO para 'Agregar otros' y 'Modificar otros'
    const PROCEDIMIENTOS_SIN_NO_CONTRIBUYENTE = [260304];
    const IS_PROCEDIMIENTO_SIN_NO_CONTRIBUYENTE = this.permisoDefinitivoTitulo && 
      this.permisoDefinitivoTitulo.some(id => PROCEDIMIENTOS_SIN_NO_CONTRIBUYENTE.includes(id));

    // Para procedimientos que ocultan 'noContribuyente' (EXCEPTO para 'Agregar otros' y 'Modificar otros')
    if (IS_PROCEDIMIENTO_SIN_NO_CONTRIBUYENTE && !ES_AGREGAR_OTROS) {
      return (this.opcionesTipoPersona ?? []).filter((option: RadioOpcion) => option.value !== 'noContribuyente');
    }

    // Para 'Agregar otros' y 'Modificar otros' en 260304: mostrar 'noContribuyente' solo para nacional
    if (IS_PROCEDIMIENTO_SIN_NO_CONTRIBUYENTE && ES_AGREGAR_OTROS) {
      if (NACIONALIDAD === 'extranjero') {
        return (this.opcionesTipoPersona ?? []).filter((option: RadioOpcion) => option.value !== 'noContribuyente');
      }
      return (this.opcionesTipoPersona ?? []).filter((option: RadioOpcion) => ['fisica', 'moral', 'noContribuyente'].includes(option.value));
    }

    // Procedimientos que muestran 'noContribuyente' solo para nacional (agregar 260302, 260303 si se requiere)
    const PROCEDIMIENTOS_CON_NO_CONTRIBUYENTE_NACIONAL = [260302];
    const IS_PROCEDIMIENTO_CON_NO_CONTRIBUYENTE_NACIONAL = this.permisoDefinitivoTitulo && 
      this.permisoDefinitivoTitulo.some(id => PROCEDIMIENTOS_CON_NO_CONTRIBUYENTE_NACIONAL.includes(id));

    // Para procedimientos que muestran 'noContribuyente' solo para nacional
    if (IS_PROCEDIMIENTO_CON_NO_CONTRIBUYENTE_NACIONAL) {
      if (NACIONALIDAD === 'extranjero') {
        return (this.opcionesTipoPersona ?? []).filter((option: RadioOpcion) => option.value !== 'noContribuyente');
      }
      return (this.opcionesTipoPersona ?? []).filter((option: RadioOpcion) => ['fisica', 'moral', 'noContribuyente'].includes(option.value));
    }

    // Comportamiento por defecto para otros procedimientos
    return (NACIONALIDAD === 'extranjero')
      ? (this.opcionesTipoPersona ?? []).filter((option: RadioOpcion) => option.value !== 'noContribuyente')
      : (this.opcionesTipoPersona ?? []);
  }
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private tramite2603Store: Tramite2603Store,
    private tramite2603Query: Tramite2603Query,
    private consultaioQuery: ConsultaioQuery,
    private tramite260301Store: Tramite260301Store,
    private validacionesService: ValidacionesFormularioService,
    private certificadosLicenciasSvc: CertificadosLicenciasPermisosService,
    private catalogoService: CatalogoServices,
  ) {
    this.titulo = '';
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruir$),
        map((seccionState) => {
          this.esSoloLecturaFormulario = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }
  /**
   * Gancho del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * Este método se utiliza para realizar la lógica de inicialización del componente.
   * En esta implementación, invoca el método `cerrarTercerosRelacionadosForm` para reiniciar o cerrar
   * el formulario relacionado con las asociaciones de terceros.
   */
ngOnInit(): void {
  this.tramite2603Query.selectSolicitud$
    .pipe(
      takeUntil(this.notificadorDestruir$),
      map(estado => this.solicitudState = estado)
    )
    .subscribe();

  // 1️⃣ Create form
  if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
    this.cerrarFormularioTercerosRelacionados();
  } else {
    this.inicializarFormularioTercerosRelacionados();
  }

  // Disable fields for special procedures (EXCEPT 260301)
  if (
    this.esProcedimientoEspecial &&
    this.titulo !== 'Agregar destinatario (destino final)' &&
    !(this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes(260301))
  ) {
    [
      'datosPersonalesNombre','datosPersonalesPrimerApellido',
      'datosPersonalesSegundoApellido','curp','razonSocial',
      'pais','estado','codigoPostal','calle',
      'numeroExterior','numeroInterior','lada',
      'telefono','correoElectronico'
    ].forEach(campo => {
      this.tercerosRelacionadosForm.get(campo)?.disable({ emitEvent: false });
    });
  }

  // 3️⃣ APPLY RADIO VALIDATION LAST
  if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
    this.aplicarValidacionesOtros();
  } else {
    this.limpiarValidacionesOtros();
  }

  if (this.idProcedimiento) {
    this.obtenerDatosPaisCatalogo();
  }
}


ngOnChanges(changes: SimpleChanges): void {
  if (changes['procedureID']) {
    if (changes['procedureID'].currentValue) {
      this.obtenerDatosPaisCatalogo();
    }
  }
}

  /**
     * Recupera los datos para la tabla de fabricantes realizando una llamada al servicio.
     * Se suscribe a la respuesta del método `getPaisDatos` del servicio,
     * crea una copia profunda de la respuesta y la asigna a la propiedad `paisDatos`.
     *
     * @returns {void}
     */
    public obtenerDatosPaisCatalogo(): void {
      if (this.procedureID) {
        this.catalogoService.paisesCatalogo(this.procedureID.toString())
          .pipe(takeUntil(this.notificadorDestruir$))
          .subscribe({
            next: (respuesta) => {
              const DATOS = respuesta.datos as Catalogo[];
              this.paisCatalogo = DATOS;
              if (this.datosExistentes) {
  this.estadoAnterior = 'PATCH'; 
  this.tercerosRelacionadosForm.patchValue(
    {
      codigoPostal: this.datosExistentes?.cp || null,
      razonSocial: this.datosExistentes?.nombre || null,
      ...this.datosExistentes
    },
    { emitEvent: false }
  );
}

            },
          });
      }
    }

  /**
   * Inicializa el formulario obteniendo el estado actual de la solicitud desde el store.
   * Se suscribe al observable selectSolicitud$ para actualizar la propiedad solicitudState
   * con los datos más recientes de la solicitud.
   */
  inicializarFormulario(): void {
    this.tramite2603Query.selectSolicitud$.pipe(
      takeUntil(this.notificadorDestruir$),
      map((estadoSeccion) => {
        this.solicitudState = estadoSeccion;
      })
    )
      .subscribe();
  }

  /**
   * Restablece el grupo de formulario `tercerosRelacionadosForm` con valores predeterminados vacíos.
   * Este método inicializa el formulario con controles para varios campos como
   * denominación social, RFC, CURP, detalles de dirección e información de contacto.
   * Cada control se establece con una cadena vacía como su valor predeterminado.
   *
   * @returns {void}
   */
  /**
   * Obtiene los valores iniciales para el formulario basándose en si es modificación o no.
   */
  private obtenerValoresIniciales(): Record<string, unknown> {
    const ES_AGREGAR_OTROS = this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros';

    if (this.esModificacion && this.datosExistentes) {
      return this.obtenerValoresParaModificacion(ES_AGREGAR_OTROS);
    }

    return this.obtenerValoresParaCreacion(ES_AGREGAR_OTROS);
  }

  /**
   * Obtiene valores para modo modificación.
   */
  private obtenerValoresParaModificacion(esAgregarOtros: boolean): Record<string, unknown> {
    const DATOS = this.datosExistentes as Fabricante;
    const DATOS_OTROS = this.datosExistentes as Otros2603;
    const IS_FORM_SIN_DENOMINACION_TERCERO = this.esFormularioSinDenominacionTercero();
    const VALORES = this.crearValoresModificacion(DATOS, esAgregarOtros);
    FabricanteModalComponent.agregarCamposCondicionales(VALORES, DATOS_OTROS, IS_FORM_SIN_DENOMINACION_TERCERO);
    return VALORES;
  }

  /**
   * Determina si es un formulario sin denominación social y tercero nombre.
   */
  private esFormularioSinDenominacionTercero(): boolean {
    const TITULOS_SIN_DENOMINACION = [
      'Agregar fabricante', 
      'Agregar facturador', 
      'Agregar proveedor/distribuidor',
      'Agregar certificado analítico'
    ];

    return TITULOS_SIN_DENOMINACION.includes(this.titulo) &&
      this.permisoDefinitivoTitulo && 
      this.permisoDefinitivoTitulo.some(id => [260303].includes(id));
  }

  /**
   * Crea los valores base para modificación.
   * Refactorizado para reducir complejidad ciclomática.
   */
  private crearValoresModificacion(datos: Fabricante, esAgregarOtros: boolean): Record<string, unknown> {
    if (this.esFormularioSinDenominacionTercero()) {
      return FabricanteModalComponent.crearValoresModificacionEspecial(datos);
    }
    return this.crearValoresModificacionDefault(datos, esAgregarOtros);
  }

  /**
   * Crea valores para formularios especiales (260303 sin denominación y tercero)
   */
  private static crearValoresModificacionEspecial(datos: Fabricante): Record<string, unknown> {
    return {
      tercerosNacionalidad: [''],
      tipoPersona: [''],
      rfc: [datos.rfc || ''],
      curp: [datos.curp || '', []],
      razonSocial: [datos.nombre || '', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      datosPersonalesNombre: [datos.nombre || ''],
      datosPersonalesPrimerApellido: [''],
      datosPersonalesSegundoApellido: [''],
      pais: [datos.pais || null, [Validators.required]],
      estado: [datos.estado || '', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]],
      municipio: [datos.municipio || ''],
      localidad: [datos.localidad || ''],
      codigoPostal: [datos.cp || '', [Validators.required, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]],
      colonia: [datos.colonia || ''],
      calle: [datos.calle || '', [Validators.required]],
      numeroExterior: [datos.numeroExterior || ''],
      numeroInterior: [datos.numeroInterior || ''],
      lada: ['', [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]],
      telefono: [datos.telefono || '', [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.maxLength(30)]],
      correoElectronico: [datos.correoElectronico || '', [Validators.email, Validators.maxLength(254)]]
    };
  }

  /**
   * Crea valores para formularios por defecto (otros casos)
   */
  private crearValoresModificacionDefault(datos: Fabricante, esAgregarOtros: boolean): Record<string, unknown> {
    const IS_260304 = this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes(260304);
    return {
      tercerosNacionalidad: [''],
      tipoPersona: [''],
      rfc: [datos.rfc || ''],
      curp: [datos.curp || '', []],
      razonSocial: [{ value: datos.nombre || '', disabled: true }, []],
      datosPersonalesNombre: [{ value: datos.nombre || '', disabled: true }, []],
      datosPersonalesPrimerApellido: [{ value: '', disabled: true }, []],
      datosPersonalesSegundoApellido: [{ value: '', disabled: true }, []],
      pais: [datos.pais, [Validators.required]],
      estado: [{ value: datos.estado || '', disabled: true }, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]],
      municipio: [{ value: datos.municipio || '', disabled: true }, []],
      localidad: [{ value: datos.localidad || '', disabled: true }],
      codigoPostal: [{ value: datos.cp || '', disabled: true }, [Validators.required, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]],
      colonia: [{ value: datos.colonia || '', disabled: true }, []],
      calle: [{ value: datos.calle || '', disabled: true }, []],
      numeroExterior: [{ value: datos.numeroExterior || '', disabled: true }, []],
      numeroInterior: [{ value: datos.numeroInterior || '', disabled: true }],
      lada: [{ value: '', disabled: true }, []],
      telefono: [{ value: datos.telefono || '', disabled: true }, []],
      correoElectronico: [{ value: datos.correoElectronico || '', disabled: true }, []]
    };
  }

  /**
   * Agrega campos condicionales según el tipo de formulario.
   */
  private static agregarCamposCondicionales(valores: Record<string, unknown>, datosOtros: Otros2603, esSinDenominacionTercero: boolean): void {
    if (!esSinDenominacionTercero) {
      valores['terceroNombre'] = [datosOtros.tercero || ''];
    }
  }

  /**
   * Obtiene valores para modo creación.
   */
  private obtenerValoresParaCreacion(esAgregarOtros: boolean): Record<string, unknown> {
    const IS_260304 = this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes(260304);
    const IS_FORM_SIN_DENOMINACION_TERCERO = (
      this.titulo === 'Agregar fabricante' || 
      this.titulo === 'Agregar facturador' || 
      this.titulo === 'Agregar proveedor/distribuidor' ||
      this.titulo === 'Agregar certificado analítico'
    ) && this.permisoDefinitivoTitulo && 
      this.permisoDefinitivoTitulo.some(id => [260303].includes(id));
    
    const VALORES: Record<string, unknown> = {
      tercerosNacionalidad: [this.solicitudState.tercerosNacionalidad],
      tipoPersona: [this.solicitudState.tipoPersona],
      rfc: [this.solicitudState.tercerosRelacionadosRfc],
      curp: [this.solicitudState.tercerosRelacionadosCurp, []],
      razonSocial: [{ value: this.solicitudState.tercerosRelacionadosRazonSocial, disabled: true }, []],
      datosPersonalesNombre: [{ value: this.solicitudState.datosPersonalesNombre, disabled: true }, []],
      datosPersonalesPrimerApellido: [{ value: this.solicitudState.datosPersonalesPrimerApellido, disabled: true }, []],
      datosPersonalesSegundoApellido: [{ value: this.solicitudState.datosPersonalesSegundoApellido, disabled: true }, []],
      pais: [this.solicitudState.tercerosRelacionadosPais ? this.solicitudState.tercerosRelacionadosPais : null, [Validators.required]],
      estado: [{ value: this.solicitudState.tercerosRelacionadosEstado, disabled: true }],
      municipio: [{ value: this.solicitudState.tercerosRelacionadosMunicipio, disabled: true }, []],
      localidad: [{ value: this.solicitudState.tercerosRelacionadosLocalidad, disabled: true }],
      codigoPostal: [{ value: this.solicitudState.tercerosRelacionadosCodigoPostal, disabled: true }],
      colonia: [{ value: this.solicitudState.tercerosRelacionadosColonia, disabled: true }, []],
      calle: [{ value: this.solicitudState.tercerosRelacionadosCalle, disabled: true }, []],
      numeroExterior: [{ value: this.solicitudState.tercerosRelacionadosNumeroExterior, disabled: true }, []],
      numeroInterior: [{ value: this.solicitudState.tercerosRelacionadosNumeroInterior, disabled: true }],
      lada: [{ value: this.solicitudState.tercerosRelacionadosLada, disabled: true }, []],
      telefono: [{ value: this.solicitudState.tercerosRelacionadosTelefono, disabled: true }, []],
      correoElectronico: [{ value: this.solicitudState.tercerosRelacionadosCorreoElectronico, disabled: true }, []]
    };

    // Solo agregar terceroNombre y denominacionSocial si NO es un formulario sin denominación y tercero
    if (!IS_FORM_SIN_DENOMINACION_TERCERO) {
      VALORES['terceroNombre'] = [this.solicitudState.tercerosRelacionadosTerceroNombre];
    }

    return VALORES;
  }

  public cerrarFormularioTercerosRelacionados(): void {
    // Manejo especial para 260303 - formularios sin denominacionSocial y terceroNombre
    const PROCEDIMIENTOS_ESPECIALES_2603 = [260303];
    const TITULOS_SIN_DENOMINACION_TERCERO = ['Agregar fabricante', 'Agregar facturador', 'Agregar proveedor/distribuidor', 'Agregar certificado analítico'];

    if (
      TITULOS_SIN_DENOMINACION_TERCERO.includes(this.titulo) &&
      this.permisoDefinitivoTitulo &&
      this.permisoDefinitivoTitulo.some(id => PROCEDIMIENTOS_ESPECIALES_2603.includes(id))
    ) {
      // Para la tarea 260303 (Agregar fabricante), cree un formulario con solo los campos obligatorios.
      const VALORES_INICIALES = this.obtenerValoresIniciales();

      this.tercerosRelacionadosForm = this.fb.group(VALORES_INICIALES);

      // Habilitar todos los campos
      Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
        const CONTROL = this.tercerosRelacionadosForm.get(key);
        if (CONTROL) {
          CONTROL.enable({ emitEvent: false });
        }
      });

      // Actualizar la validez de todos los controles.
      Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
        const CONTROL = this.tercerosRelacionadosForm.get(key);
        if (CONTROL) {
          CONTROL.updateValueAndValidity({ emitEvent: false });
        }
      });

      return; // Omita la lógica predeterminada para 260303 Agregar fabricante
    }
    // Opción predeterminada para todos los demás casos.
    const VALORES_INICIALES = this.obtenerValoresIniciales();
    this.tercerosRelacionadosForm = this.fb.group(VALORES_INICIALES);

    // Comportamiento predeterminado para otros procedimientos
    // Desactiva tipoPersona hasta seleccionar nacionalidad   
this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.valueChanges
      .pipe(takeUntil(this.notificadorDestruir$))
      .subscribe(() => {
        if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
          this.aplicarRequeridosAgregarOtros();
        }
      });
    this.tercerosRelacionadosForm.get('tipoPersona')?.valueChanges
      .pipe(takeUntil(this.notificadorDestruir$))
      .subscribe(() => {
        if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
          this.aplicarRequeridosAgregarOtros();
        }
      });

    // Activación/desactivación inicial
    this.actualizarCamposExtranjeroFisica();
    // Habilitar tipoPersona cuando se selecciona nacionalidad
    this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.valueChanges
      .pipe(takeUntil(this.notificadorDestruir$))
      .subscribe(valor => {
        if (valor) {
         this.tercerosRelacionadosForm.get('tipoPersona')?.enable({ emitEvent: false });
         this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.enable({ emitEvent: false });
        } 
      });

    // Actualizar campos cuando cambie tipoPersona
    this.tercerosRelacionadosForm.get('tipoPersona')?.valueChanges
      .pipe(takeUntil(this.notificadorDestruir$))
      .subscribe(valor => {
        if (valor) {
          this.actualizarCamposExtranjeroFisica();
        }
      });
  }


  /**
   * Habilita o deshabilita los campos según la selección de nacionalidad y tipo de persona
   */
private actualizarCamposExtranjeroFisica(): void {
  const nacionalidad = this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.value;
  const tipoPersona = this.tercerosRelacionadosForm.get('tipoPersona')?.value;

  if (!nacionalidad || !tipoPersona) return;

  const estadoActual = `${nacionalidad}-${tipoPersona}`;

  if (this.estadoAnterior && this.estadoAnterior !== estadoActual) {
    this.limpiarCamposDependientes();
  }

  this.estadoAnterior = estadoActual;

  const ES_AGREGAR_OTROS =
    this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros';

  if (nacionalidad === 'nacional') {
    this.procesarNacionalidad(tipoPersona, ES_AGREGAR_OTROS);
  } else {
    this.procesarExtranjero(tipoPersona, ES_AGREGAR_OTROS);
  }
  if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
  this.aplicarRequeridosAgregarOtros();
}
}



  /**
   * Procesa la lógica para nacionalidad 'nacional'
   */
  private procesarNacionalidad(tipoPersona: string, isAgregarOtros: boolean): void {
    const ES_DESTINATARIO_FINAL = this.esProcedimientoEspecial && this.titulo !== 'Agregar otros' && this.titulo !== 'Modificar otros';
    const ES_260301 = this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes(260301);

    // Logic específica para 260301
    if (ES_260301) {
      this.procesarNacional260301(tipoPersona);
      return;
    }

    if (ES_DESTINATARIO_FINAL && (tipoPersona === 'fisica' || tipoPersona === 'moral')) {
      // Para "Agregar destinatario (destino final)", habilitar TODOS los campos
      this.habilitarTodosCamposDestinatarioFinal();
      this.configurarRfcCurpParaNacional(tipoPersona);
    } else {
      this.configurarRfcCurpParaNacional(tipoPersona);
      this.deshabilitarCamposParaNacional(isAgregarOtros);
    }
  }

  /**
   * Procesa nacional específicamente para 260301 con campos requeridos
   */
  private procesarNacional260301(tipoPersona: string): void {
    // Primero configurar RFC/CURP normal para nacional
    this.configurarRfcCurpParaNacional(tipoPersona);

    // Campos que siempre se habilitan para 260301 nacional
    const CAMPOS_260301 = [
      'datosPersonalesNombre',     
      'datosPersonalesPrimerApellido', 
      'datosPersonalesSegundoApellido',
      'correoElectronico',           
      'numeroInterior',              
      'lada',                        
      'telefono'                     
    ];

    // Si es noContribuyente, deshabilitar los campos de nombre
    if (tipoPersona === 'noContribuyente') {
      ['datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido'].forEach(campo => {
        this.deshabilitarCampo(campo, true);
      });
      // Los demás campos siguen la lógica normal
      CAMPOS_260301.filter(campo => !['datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido'].includes(campo))
        .forEach(campo => {
          if (campo === 'correoElectronico') {
            this.habilitarCampoConValidadores(campo, [Validators.email, Validators.maxLength(320)]);
          } else if (campo === 'lada') {
            this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]);
          } else if (campo === 'telefono') {
            this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.maxLength(30)]);
          } else {
            this.habilitarCampoConValidadores(campo, []);
          }
        });
    } else {
      // Habilitar campos específicos de 260301
      CAMPOS_260301.forEach(campo => {
        if (campo === 'datosPersonalesNombre' || campo === 'datosPersonalesPrimerApellido') {
          this.habilitarCampoConValidadores(campo, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
        } else if (campo === 'datosPersonalesSegundoApellido') {
          this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
        } else if (campo === 'correoElectronico') {
          this.habilitarCampoConValidadores(campo, [Validators.email, Validators.maxLength(320)]);
        } else if (campo === 'lada') {
          this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]);
        } else if (campo === 'telefono') {
          this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.maxLength(30)]);
        } else {
          this.habilitarCampoConValidadores(campo, []);
        }
      });
    }

    // Configurar razón social según tipo de persona
    if (tipoPersona === 'fisica') {
      this.deshabilitarCampo('razonSocial', true, true);
    } else if (tipoPersona === 'moral') {
      this.habilitarCampoConValidadores('razonSocial', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    }

    // Deshabilitar otros campos de dirección no especificados
    const CAMPOS_DESHABILITAR = [
      'pais', 'estado', 'municipio', 'localidad', 'codigoPostal', 
      'colonia', 'calle', 'numeroExterior'
    ];
    
    CAMPOS_DESHABILITAR.forEach(campo => {
      this.deshabilitarCampo(campo, true);
    });
  }

  /**
   * Configura los campos RFC y CURP para nacionalidad 'nacional'
   */
  private configurarRfcCurpParaNacional(tipoPersona: string): void {
    if (tipoPersona === 'fisica' || tipoPersona === 'moral') {
      this.habilitarRfc();
      this.deshabilitarCurp();
    } else if (tipoPersona === 'noContribuyente') {
   this.procesarNacionalNoContribuyente();
  this.deshabilitarRfc();
  this.habilitarCurp();
    } else {
      this.deshabilitarRfc();
      this.deshabilitarCurp();
    }
  }

  /**
   * Deshabilita campos de dirección y contacto para nacionalidad 'nacional'
   */
  private deshabilitarCamposParaNacional(isAgregarOtros: boolean): void {
    const CAMPOS_DESHABILITAR = [
      'razonSocial', 'datosPersonalesNombre', 'datosPersonalesPrimerApellido',
      'datosPersonalesSegundoApellido', 'estado', 'municipio', 'localidad', 'codigoPostal',
      'colonia', 'calle', 'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
    ];

    CAMPOS_DESHABILITAR.forEach(campo => {
      this.deshabilitarCampo(campo, true);
    });

    this.configurarCampoPais(isAgregarOtros);
  }

  /**
   * Procesa la lógica para nacionalidad 'extranjero'
   */
  private procesarExtranjero(tipoPersona: string, isAgregarOtros: boolean): void {
    const IS_SPECIAL_PROCEDURE = this.esProcesoEspecial();

    // RFC y CURP nunca requeridos para extranjeros
    this.deshabilitarRfc();
    this.deshabilitarCurp();

    if (IS_SPECIAL_PROCEDURE) {
      this.procesarExtranjeroEspecial(tipoPersona);
    } else {
      this.procesarExtranjeroPorDefecto(tipoPersona, isAgregarOtros);
    }
  }

  /**
   * Verifica si es un procedimiento especial que requiere habilitación extendida de campos para extranjeros
   * (agregar más procedimientos al array PROCEDIMIENTOS_ESPECIALES si se requiere en el futuro)
   */
  private esProcesoEspecial(): boolean {
    return this.permisoDefinitivoTitulo && 
           this.permisoDefinitivoTitulo.some(id => FabricanteModalComponent.PROCEDIMIENTOS_ESPECIALES.includes(id));
  }

  /**
   * Procesa extranjero para procedimientos especiales con habilitación extendida de campos (260304/260302/260301)
   */
  private procesarExtranjeroEspecial(tipoPersona: string): void {
    const ES_DESTINATARIO_FINAL = this.esProcedimientoEspecial && this.titulo !== 'Agregar otros' && this.titulo !== 'Modificar otros';
    const ES_260301 = this.permisoDefinitivoTitulo && this.permisoDefinitivoTitulo.includes(260301);

    // Logic específica para 260301
    if (ES_260301) {
      this.procesarExtranjero260301(tipoPersona);
      return;
    }

    if (tipoPersona === 'fisica') {
      if (ES_DESTINATARIO_FINAL) {
        // Para "Agregar destinatario (destino final)", habilitar TODOS los campos
        this.habilitarTodosCamposDestinatarioFinal();
      } else {
        this.habilitarCamposExtranjeroProcedimientoEspecialFisica();
        this.deshabilitarCampo('razonSocial', true, true);
      }
    } else if (tipoPersona === 'moral') {
      if (ES_DESTINATARIO_FINAL) {
        // Para "Agregar destinatario (destino final)", habilitar TODOS los campos
        this.habilitarTodosCamposDestinatarioFinal();
      } else {
        this.habilitarCamposExtranjeroProcedimientoEspecialMoral();
        // Para Extranjero+Moral en procedimientos especiales, NO deshabilitar datos personales
        // Los datos personales deben permanecer habilitados para captura opcional
      }
    } else {
      this.deshabilitarTodosMenosBasicos();
    }
  }

  /**
   * Procesa extranjero específicamente para 260301 con campos requeridos
   */
  private procesarExtranjero260301(tipoPersona: string): void {
        // Si es moral, habilitar razonSocial con validadores
        if (tipoPersona === 'moral') {
          this.habilitarCampoConValidadores('razonSocial', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
        } else if (tipoPersona === 'fisica') {
          this.deshabilitarCampo('razonSocial', true, true);
        }
    // Campos que siempre se habilitan para 260301
    const CAMPOS_260301 = [
      'datosPersonalesNombre',       
      'datosPersonalesPrimerApellido', 
      'datosPersonalesSegundoApellido', 
      'correoElectronico',           
      'numeroInterior',              
      'lada',                       
      'telefono',                     
      'pais',
      'estado',
      'codigoPostal',
      'calle',
      'numeroExterior',
      'municipio',
      'localidad',
    ];

    // Habilitar campos específicos de 260301
    CAMPOS_260301.forEach(campo => {
      if (campo === 'datosPersonalesNombre' || campo === 'datosPersonalesPrimerApellido') {
        this.habilitarCampoConValidadores(campo, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
      } else if (campo === 'datosPersonalesSegundoApellido') {
        this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
      } else if (campo === 'correoElectronico') {
        this.habilitarCampoConValidadores(campo, [Validators.email, Validators.maxLength(320)]);
      } else if (campo === 'lada') {
        this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]);
      } else if (campo === 'telefono') {
        this.habilitarCampoConValidadores(campo, [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.maxLength(30)]);
      } else {
        this.habilitarCampoConValidadores(campo, []);
      }
    });
  }

  /**
   * Habilita campos para Extranjero+Física en procedimientos con habilitación extendida (260304/260302)
   */
  private habilitarCamposExtranjeroProcedimientoEspecialFisica(): void {
    const CAMPOS_HABILITAR = [
      'datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido',
      'pais', 'estado', 'municipio', 'localidad', 'codigoPostal', 'colonia', 'calle',
      'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
    ];

    CAMPOS_HABILITAR.forEach(campo => {
      this.habilitarCampoConValidadores(campo, FabricanteModalComponent.obtenerValidadoresPorCampo(campo));
    });
  }

  /**
   * Habilita campos para Extranjero+Moral en procedimientos con habilitación extendida (260304/260302)
   */
  private habilitarCamposExtranjeroProcedimientoEspecialMoral(): void {
    const CAMPOS_HABILITAR = [
      'razonSocial', 'datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido',
      'pais', 'estado', 'municipio', 'localidad', 'codigoPostal', 'colonia', 'calle',
      'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
    ];

    CAMPOS_HABILITAR.forEach(campo => {
      this.habilitarCampoConValidadores(campo, FabricanteModalComponent.obtenerValidadoresPorCampo(campo));
    });
  }

  /**
   * Procesa extranjero para otros procedimientos (no 260304/260302)
   */
  private procesarExtranjeroPorDefecto(tipoPersona: string, isAgregarOtros: boolean): void {
    if (tipoPersona === 'fisica') {
      this.habilitarCamposDatosPersonales();
      this.deshabilitarCampo('razonSocial', true, true);
    } else if (tipoPersona === 'moral') {
      this.habilitarCampoConValidadores('razonSocial', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
      this.deshabilitarDatosPersonales();
    } else {
      this.deshabilitarDatosPersonales();
      this.deshabilitarCampo('razonSocial', true, true);
    }

    this.habilitarCamposExtranjeroBase();
    this.configurarCampoPais(isAgregarOtros);
  }

  /**
   * Habilita campos de datos personales
   */
  private habilitarCamposDatosPersonales(): void {
    const CAMPOS_DATOS_PERSONALES = ['datosPersonalesNombre', 'datosPersonalesPrimerApellido'];
    CAMPOS_DATOS_PERSONALES.forEach(campo => {
      this.habilitarCampoConValidadores(campo, [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    });

    // Segundo apellido es opcional
    this.habilitarCampoConValidadores('datosPersonalesSegundoApellido', [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
  }

  /**
   * Deshabilita campos de datos personales
   */
  private deshabilitarDatosPersonales(): void {
    const CAMPOS_DATOS_PERSONALES = ['datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido'];
    CAMPOS_DATOS_PERSONALES.forEach(campo => {
      this.deshabilitarCampo(campo, true, true);
    });
  }

  /**
   * Deshabilita campos de dirección y contacto
   */
  private deshabilitarCamposDireccionContacto(): void {
    const CAMPOS_DIRECCION_CONTACTO = [
      'estado', 'municipio', 'localidad', 'codigoPostal', 'colonia', 'calle',
      'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
    ];

    CAMPOS_DIRECCION_CONTACTO.forEach(campo => {
      this.deshabilitarCampo(campo, true);
    });
  }

  /**
   * Deshabilita todos los campos menos los básicos
   */
  private deshabilitarTodosMenosBasicos(): void {
    const CAMPOS_DESHABILITAR = [
      'datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido', 'razonSocial',
      'estado', 'municipio', 'localidad', 'codigoPostal', 'colonia', 'calle', 'numeroExterior', 'numeroInterior',
      'lada', 'telefono', 'correoElectronico', 'pais'
    ];

    CAMPOS_DESHABILITAR.forEach(campo => {
      this.deshabilitarCampo(campo, true, true);
    });
  }

  /**
   * Deshabilita todos los campos menos los principales
   */
  private deshabilitarTodosMenosPrincipales(isAgregarOtros: boolean): void {
    const CAMPOS_DESHABILITAR = [
      'rfc', 'curp', 'razonSocial', 'datosPersonalesNombre', 'datosPersonalesPrimerApellido',
      'datosPersonalesSegundoApellido', 'estado', 'municipio', 'localidad', 'codigoPostal',
      'colonia', 'calle', 'numeroExterior', 'numeroInterior', 'lada', 'telefono', 'correoElectronico'
    ];

    CAMPOS_DESHABILITAR.forEach(campo => {
      this.deshabilitarCampo(campo, true);
    });

    this.configurarCampoPais(isAgregarOtros);
  }

  /**
   * Habilita todos los campos para "Agregar destinatario (destino final)"
   */
  private habilitarTodosCamposDestinatarioFinal(): void {
    // Habilitar todos los controles del formulario, no solo los campos listados
    Object.keys(this.tercerosRelacionadosForm.controls).forEach(campo => {
      const CONTROL = this.tercerosRelacionadosForm.get(campo);
      if (CONTROL) {
        CONTROL.enable({ emitEvent: false });
        CONTROL.setValidators(FabricanteModalComponent.obtenerValidadoresPorCampo(campo));
        CONTROL.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  /**
   * Habilita el campo RFC con validadores
   */
  private habilitarRfc(): void {
    const RFC_CONTROL = this.tercerosRelacionadosForm.get('rfc');
    if (RFC_CONTROL) {
      RFC_CONTROL.enable();
      RFC_CONTROL.setValidators([Validators.required, Validators.maxLength(13), FabricanteModalComponent.validadorRFC]);
      RFC_CONTROL.updateValueAndValidity();
    }
  }

  /**
   * Deshabilita el campo RFC
   */
  private deshabilitarRfc(): void {
    this.deshabilitarCampo('rfc', true);
  }

  /**
   * Habilita el campo CURP con validadores
   */
private habilitarCurp(): void {
  const CURP_CONTROL = this.tercerosRelacionadosForm.get('curp');
  if (CURP_CONTROL) {
    CURP_CONTROL.enable();
    CURP_CONTROL.setValidators([Validators.required, Validators.pattern(REGEX_CURP)]);
    CURP_CONTROL.markAsTouched(); 
    CURP_CONTROL.updateValueAndValidity();
  }
}

  /**
   * Deshabilita el campo CURP
   */
  private deshabilitarCurp(): void {
    this.deshabilitarCampo('curp', true);
  }

  /**
   * Configura el campo país según el contexto
   */
private configurarCampoPais(isAgregarOtros: boolean): void {
  const pais = this.tercerosRelacionadosForm.get('pais');
  const nacionalidad = this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.value;
  const tipoPersona = this.tercerosRelacionadosForm.get('tipoPersona')?.value;

  if (!pais) return;

  // 🌍 EXTRANJERO → required + enabled
  if (nacionalidad === 'extranjero') {
    pais.enable({ emitEvent: false });
    pais.updateValueAndValidity({ emitEvent: false });
    return;
  }

  // 🇲🇽 NACIONAL + NO CONTRIBUYENTE → required + enabled
  if (nacionalidad === 'nacional' && tipoPersona === 'noContribuyente') {
    pais.enable({ emitEvent: false });
    pais.updateValueAndValidity({ emitEvent: false });
    return;
  }

  // 🇲🇽 NACIONAL + FÍSICA / MORAL → disable (Angular ignores required)
  pais.disable({ emitEvent: false });
}




  /**
   * Habilita un campo con validadores específicos
   */
 private habilitarCampoConValidadores(
  nombreCampo: string,
  validadores: ValidatorFn[]
): void {
  const CONTROL = this.tercerosRelacionadosForm.get(nombreCampo);
  if (CONTROL) {
    CONTROL.enable({ emitEvent: false });
    CONTROL.setValidators(validadores);

    // 🔥 REQUIRED for error message
    CONTROL.markAsTouched();
    CONTROL.markAsDirty();

    CONTROL.updateValueAndValidity({ emitEvent: false });
  }
}

  /**
   * Deshabilita un campo con opción de limpiar validadores y valor
   */
  private deshabilitarCampo(nombreCampo: string, limpiarValidadores: boolean = false, limpiarValor: boolean = false): void {
    const CONTROL = this.tercerosRelacionadosForm.get(nombreCampo);
    if (CONTROL) {
      CONTROL.disable();
      if (limpiarValidadores) {
        CONTROL.clearValidators();
      }
      if (limpiarValor) {
        CONTROL.setValue('');
      }
      CONTROL.updateValueAndValidity();
    }
  }

  /**
   * Obtiene los validadores apropiados para un campo específico
   */
  private static obtenerValidadoresPorCampo(nombreCampo: string): ValidatorFn[] {
    const VALIDADORES_MAP: Record<string, ValidatorFn[]> = {
      'datosPersonalesNombre': [ Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'datosPersonalesPrimerApellido': [ Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'datosPersonalesSegundoApellido': [Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'razonSocial': [ Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'pais': [ Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'calle': [ Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'numeroExterior': [ Validators.pattern(REGEX_PATRON_ALFANUMERICO)],
      'codigoPostal': [ Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)],
      'correoElectronico': [Validators.email, Validators.maxLength(254)],
      'lada': [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)],
      'telefono': [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.maxLength(30)]
    };

    return VALIDADORES_MAP[nombreCampo] || [];
  }

  /**
   * Establece los validadores apropiados para un campo basado en su nombre y contexto
   */
  private establecerValidadoresCampo(nombreCampo: string, control: AbstractControl): void {
    const NACIONALIDAD = this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.value;
    const TIPO_PERSONA = this.tercerosRelacionadosForm.get('tipoPersona')?.value;
    const IS_EXTRANJERO = NACIONALIDAD === 'extranjero';

    // Limpiar validadores existentes
    control.clearValidators();

    // Aplicar validadores según el campo
    FabricanteModalComponent.aplicarValidadoresPorCampo(nombreCampo, control, IS_EXTRANJERO, TIPO_PERSONA);

    control.updateValueAndValidity();
  }

  /**
   * Aplica validadores específicos por campo
   */
  private static aplicarValidadoresPorCampo(nombreCampo: string, control: AbstractControl, isExtranjero: boolean, tipoPersona: string): void {
    switch (nombreCampo) {
      case 'rfc':
        control.setValidators([Validators.maxLength(13), FabricanteModalComponent.validadorRFC]);
        break;
      case 'curp':
        control.setValidators([Validators.pattern(REGEX_CURP)]);
        break;
      case 'datosPersonalesNombre':
      case 'datosPersonalesPrimerApellido':
        FabricanteModalComponent.establecerValidadoresNombreApellido(control, isExtranjero, tipoPersona);
        break;
      case 'razonSocial':
        FabricanteModalComponent.establecerValidadoresRazonSocial(control, isExtranjero, tipoPersona);
        break;
      case 'municipio':
        control.setValidators([ Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]);
        break;
      case 'localidad':
      case 'colonia':
        control.setValidators([ Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
        break;
      case 'calle':
      case 'numeroExterior':
      case 'pais':
      case 'terceroNombre':
      case 'tipoPersona':
        control.setValidators([]);
        break;
      case 'estado':
        control.setValidators([Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]);
        break;
      case 'codigoPostal':
        control.setValidators([Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]);
        break;
      case 'datosPersonalesSegundoApellido':
        control.setValidators([Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
        break;
      case 'lada':
        control.setValidators([Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]);
        break;
      case 'telefono':
        control.setValidators([Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(30)]);
        break;
      case 'correoElectronico':
        control.setValidators([Validators.email, Validators.maxLength(254)]);
        break;
      default:
        break;
    }
  }

  /**
   * Establece validadores para campos de nombre y apellido
   */
  private static establecerValidadoresNombreApellido(control: AbstractControl, isExtranjero: boolean, tipoPersona: string): void {
    if (isExtranjero && tipoPersona === 'fisica') {
      control.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    } else if (isExtranjero && tipoPersona === 'moral') {
      control.setValidators([Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    } else {
      control.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    }
  }

  /**
   * Establece validadores para razonSocial
   */
  private static establecerValidadoresRazonSocial(control: AbstractControl, isExtranjero: boolean, tipoPersona: string): void {
    if (isExtranjero && tipoPersona === 'moral') {
      control.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    } else if (isExtranjero && tipoPersona === 'fisica') {
      control.setValidators([Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    } else {
      control.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    }
  }

  /**
   * Restablece el grupo de formulario `tercerosRelacionadosForm` con valores predeterminados vacíos.
   * Este método inicializa el formulario con controles para varios campos como
   * denominación social, RFC, CURP, detalles de dirección e información de contacto.
   * Cada control se establece con una cadena vacía como su valor predeterminado.
   *
   * @returns {void}
   */
  inicializarFormularioTercerosRelacionados(): void {
    const IS_FORM_SIN_DENOMINACION_TERCERO = (
      this.titulo === 'Agregar fabricante' || 
      this.titulo === 'Agregar facturador' || 
      this.titulo === 'Agregar proveedor/distribuidor' ||
      this.titulo === 'Agregar certificado analítico'
    ) && this.permisoDefinitivoTitulo && 
      this.permisoDefinitivoTitulo.some(id => [260303].includes(id));

    const FORM_CONFIG: Record<string, unknown> = {
      rfc: [''],
      curp: [''],
      razonSocial:  [
        this.solicitudState.tercerosRelacionadosDenominacionSocial || '',
        [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]
      ],
      datosPersonalesNombre: ['', [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      datosPersonalesPrimerApellido: ['', [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      datosPersonalesSegundoApellido: ['', [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      pais: [ this.solicitudState.tercerosRelacionadosPais|| null, [Validators.required]],
      estado: [this.solicitudState.tercerosRelacionadosEstado || '', [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]],
      municipio: [this.solicitudState.tercerosRelacionadosMunicipio || '', [Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]],
      localidad: [this.solicitudState.tercerosRelacionadosLocalidad || ''],
      codigoPostal: [this.solicitudState.tercerosRelacionadosCodigoPostal || '', [Validators.required, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]],
      colonia: [this.solicitudState.tercerosRelacionadosColonia || '', [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]],
      calle: [this.solicitudState.tercerosRelacionadosCalle, Validators.required],
      numeroExterior: [this.solicitudState.tercerosRelacionadosNumeroExterior],
      numeroInterior: [this.solicitudState.tercerosRelacionadosNumeroInterior],
      lada: [this.solicitudState.tercerosRelacionadosLada, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]],
      telefono: [this.solicitudState.tercerosRelacionadosTelefono, [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(30)]],
      correoElectronico: [this.solicitudState.tercerosRelacionadosCorreoElectronico || '', [Validators.email, Validators.maxLength(254)]],
    };
    if (!IS_FORM_SIN_DENOMINACION_TERCERO) {
      FORM_CONFIG['tercerosNacionalidad'] = [''];
      FORM_CONFIG['tipoPersona'] = [''];
      FORM_CONFIG['denominacionSocial'] = [
        // this.solicitudState.tercerosRelacionadosDenominacionSocial || '',
        [Validators.pattern(REGEX_PATRON_ALFANUMERICO)]
      ];
      FORM_CONFIG['terceroNombre'] = [this.solicitudState.tercerosRelacionadosTerceroNombre || ''];
    }
    this.tercerosRelacionadosForm = this.fb.group(FORM_CONFIG);

    // Extraer la lógica de configuración para "Agregar destinatario (destino final)" a un método auxiliar
    if (this.esProcedimientoEspecial && this.titulo !== 'Agregar otros' && this.titulo !== 'Modificar otros') {
      this.configurarFormularioDestinatarioFinal();
    }
  }

  /**
   * Configura el formulario para el caso de "Agregar destinatario (destino final)"
   */
  private configurarFormularioDestinatarioFinal(): void {
    // Para destinatario final, habilitar tipoPersona inmediatamente (no esperar nacionalidad)
    this.tercerosRelacionadosForm.get('tipoPersona')?.enable();

    // Subscripción directa a cambios de tipo persona para destinatario final
    this.tercerosRelacionadosForm.get('tipoPersona')?.valueChanges
      .pipe(takeUntil(this.notificadorDestruir$))
      .subscribe(tipoPersona => {
        if (tipoPersona === 'fisica' || tipoPersona === 'moral') {

          // Para destinatario final, solo validar campos visibles según el template HTML
          const FIELD_VALIDATOR_MAP = {
            'terceroNombre': [], // No visible para destinatario final, sólo para "Agregar otros" y "Modificar otros"
            'tipoPersona': [],
            'datosPersonalesNombre': tipoPersona === 'fisica' ? [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)] : [],
            'datosPersonalesPrimerApellido': tipoPersona === 'fisica' ? [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)] : [],
            'datosPersonalesSegundoApellido': tipoPersona === 'fisica' ? [Validators.pattern(REGEX_PATRON_ALFANUMERICO)] : [],
            'razonSocial': tipoPersona === 'moral' ? [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)] : [],
            'pais': [Validators.required],
            'estado': [Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)],
            'municipio': [], // No visible para destinatario final, solo para "Agregar otros" y "Modificar otros"
            'localidad': [], // No visible para destinatario final, solo para "Agregar otros" y "Modificar otros"
            'codigoPostal': [Validators.required, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)],
            'colonia': [], // No visible para destinatario final, solo para "Agregar otros" y "Modificar otros"
            'calle': [Validators.required],
            'numeroExterior': [],
            'numeroInterior': [],
            'lada': [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)],
            'telefono': [Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(30)],
            'correoElectronico': [Validators.email, Validators.maxLength(254)],
            'rfc': [],
            'curp': [],
            'tercerosNacionalidad': []
          };

          Object.keys(FIELD_VALIDATOR_MAP).forEach(campo => {
            const CONTROL = this.tercerosRelacionadosForm.get(campo);
            if (CONTROL) {
              const VALIDATORS = FIELD_VALIDATOR_MAP[campo as keyof typeof FIELD_VALIDATOR_MAP];

              // Campos que deben estar habilitados aunque no tengan validadores (campos opcionales)
              const OPTIONAL_ENABLED_FIELDS = ['numeroInterior', 'lada', 'telefono', 'correoElectronico', 'tercerosNacionalidad'];

              if (VALIDATORS.length > 0 || OPTIONAL_ENABLED_FIELDS.includes(campo)) {
                // Campo visible - habilitar y configurar validadores
                CONTROL.enable({ emitEvent: false });
                CONTROL.setValidators(VALIDATORS);
              } else {
                // Campo oculto - deshabilitar, limpiar validadores y valor
                CONTROL.disable({ emitEvent: false });
                CONTROL.clearValidators();
                CONTROL.setValue('', { emitEvent: false });
              }
              CONTROL.updateValueAndValidity({ emitEvent: false });
            }
          });

          // Establezca la nacionalidad en "nacional" ya que está oculta.
          this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.setValue('nacional', { emitEvent: false });
        }
      });

    // Verificación inicial en caso de que el tipo de persona ya esté configurado.
    const CURRENT_TIPO_PERSONA = this.tercerosRelacionadosForm.get('tipoPersona')?.value;
    if (CURRENT_TIPO_PERSONA === 'fisica' || CURRENT_TIPO_PERSONA === 'moral') {
      this.tercerosRelacionadosForm.get('tipoPersona')?.setValue(CURRENT_TIPO_PERSONA, { emitEvent: true });
    }
  }

  /**
     * Valida el RFC ingresado en el formulario.
     * Utiliza expresiones regulares para verificar si es un RFC válido.
     * 
     * @returns Un objeto de error si el RFC es inválido, o null si es válido.
     */
  static validadorRFC(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }
    const ES_VALIDO = REGEX_RFC.test(VALUE);
    return ES_VALIDO ? null : { rfcInvalido: true };
  }


  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public establecerValorStore(formulario: FormGroup, campo: string, nombreMetodo: keyof Tramite2603Store): void {
    const VALOR = formulario.get(campo)?.value;
    const METODO = this.tramite2603Store[nombreMetodo];
    if (typeof METODO === 'function') {
      (METODO as (this: Tramite2603Store, value: unknown) => void).call(this.tramite2603Store, VALOR);
    }
  }

  /**
 * Determina si se debe cargar un formulario nuevo o uno existente.  
 * Ejecuta la lógica correspondiente según el estado del componente.
 */
  inicializarEstadoFormulario(): void {
    if (this.esSoloLecturaFormulario) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }


  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Si el formulario está en modo solo lectura, deshabilita todos los controles del formulario.
   * Si no, habilita los controles para permitir la edición.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esSoloLecturaFormulario) {
      // Deshabilita el formulario si está en modo solo lectura
      this.tercerosRelacionadosForm.disable();
    } else {
      // Habilita el formulario para edición
      this.tercerosRelacionadosForm.enable();
    }
  }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  eventoCambioValor(evento: string | number | Event, formulario: FormGroup, campo: string, nombreMetodo: keyof Tramite2603Store): void {
    let VALOR;
    if (evento instanceof Event && (evento.target instanceof HTMLInputElement || evento.target instanceof HTMLSelectElement || evento.target instanceof HTMLTextAreaElement)) {
      const INPUT = evento.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      VALOR = INPUT.value;
    } else {
      VALOR = evento;
    }
    formulario.get(campo)?.setValue(VALOR);
    
    // Si es cambio en radio buttons de nacionalidad o tipo persona, limpiar formulario
    if (campo === 'tercerosNacionalidad' || campo === 'tipoPersona') {
      // Pequeño delay para asegurar que el valor se establezca primero
      setTimeout(() => {
        this.limpiar();
      }, 50);
    }
    
    // Activar la lógica de actualización del campo cuando cambia la nacionalidad o el tipo de persona
    this.establecerValorStore(formulario, campo, nombreMetodo);
  }

  /**
   * Busca y asigna datos simulados al formulario de terceros relacionados si el RFC o CURP es válido.
   * @param tipo - 'rfc' para búsqueda por RFC, 'curp' para búsqueda por CURP
   */
  buscar(tipo: 'rfc' | 'curp'): void {
    if (tipo === 'rfc') {
      const RFC_CONTROL = this.tercerosRelacionadosForm.get('rfc');
      if (RFC_CONTROL) {
        RFC_CONTROL.markAsTouched();
        RFC_CONTROL.updateValueAndValidity();
        if (RFC_CONTROL.valid) {
          this.tercerosRelacionadosForm.patchValue({
            curp: 'LEQI810131HDGSXG05',
            datosPersonalesNombre: '12345',
            datosPersonalesPrimerApellido: 'GONZALEZ',
            datosPersonalesSegundoApellido: 'PINAL',
            pais: 'ABW',
            estado: 'CDMX',
            municipio: 'CDMX',
            localidad: 'VICTORIA DE DURANGO',
            codigoPostal: '12345',
            colonia: 'CENTRO',
            calle: 'LIBERTAD',
            numeroExterior: '12345',
            numeroInterior: 'A',
            lada: '618',
            telefono: '1234567890',
            correoElectronico: 'info@eurofoods.com.mx',
            razonSocial: '12345',
            denominacionSocial: '12345'
          });
        }
      }
    } else if (tipo === 'curp') {
      const CURP_CONTROL = this.tercerosRelacionadosForm.get('curp');
      if (CURP_CONTROL) {
        CURP_CONTROL.markAsTouched();
        CURP_CONTROL.updateValueAndValidity();
        if (CURP_CONTROL.valid) {
          this.tercerosRelacionadosForm.patchValue({
            curp: 'LEQI810131HDGSXG05',
            datosPersonalesNombre: '12345',
            datosPersonalesPrimerApellido: 'GONZALEZ',
            datosPersonalesSegundoApellido: 'PINAL',
            pais: 'ABW',
            estado: 'CDMX',
            municipio: 'CDMX',
            localidad: 'VICTORIA DE DURANGO',
            codigoPostal: '12345',
            colonia: 'CENTRO',
            calle: 'LIBERTAD',
            numeroExterior: '12345',
            numeroInterior: 'A',
            lada: '618',
            telefono: '1234567890',
            correoElectronico: 'info@eurofoods.com.mx',
            razonSocial: '12345',
            denominacionSocial: '12345'
          });
        }
      }
    }
  }


  /**
   * Limpia todos los campos del formulario de terceros relacionados, restableciéndolos a su estado inicial.
   *
   * @returns {void}
   */
  limpiar(): void {
    // Para 260303 - formularios sin denominacionSocial y terceroNombre, no deshabilitar campos después de limpiar
    const PROCEDIMIENTOS_ESPECIALES_2603 = [260303];
    const TITULOS_SIN_DENOMINACION_TERCERO = ['Agregar fabricante', 'Agregar facturador', 'Agregar proveedor/distribuidor', 'Agregar certificado analítico'];
    const TITULOS_MODIFICACION = ['Modificar fabricante', 'Modificar facturador', 'Modificar proveedor/distribuidor', 'Modificar certificado analítico', 'Modificar otros'];

    if (
      TITULOS_SIN_DENOMINACION_TERCERO.includes(this.titulo) &&
      this.permisoDefinitivoTitulo &&
      this.permisoDefinitivoTitulo.some(id => PROCEDIMIENTOS_ESPECIALES_2603.includes(id))
    ) {
      // Para estos formularios, simplemente reiniciar valores y habilitar todos los campos
      // Limpiar todos los valores del formulario
      Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
        const CONTROL = this.tercerosRelacionadosForm.get(key);
        if (CONTROL) {
          CONTROL.setValue('', { emitEvent: false });
          CONTROL.enable({ emitEvent: false });
          CONTROL.markAsUntouched();
          CONTROL.markAsPristine();
        }
      });

      // Para estos formularios, establecer validadores solo para campos específicos
      this.tercerosRelacionadosForm.get('razonSocial')?.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
      this.tercerosRelacionadosForm.get('pais')?.setValidators([Validators.required]);
      this.tercerosRelacionadosForm.get('estado')?.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]);
      this.tercerosRelacionadosForm.get('codigoPostal')?.setValidators([Validators.required, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]);
      this.tercerosRelacionadosForm.get('calle')?.setValidators([Validators.required]);
      this.tercerosRelacionadosForm.get('numeroExterior')?.setValidators([]);
      this.tercerosRelacionadosForm.get('numeroInterior')?.setValidators([]);
      this.tercerosRelacionadosForm.get('lada')?.setValidators([Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]);
      this.tercerosRelacionadosForm.get('telefono')?.setValidators([Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(30)]);
      this.tercerosRelacionadosForm.get('correoElectronico')?.setValidators([Validators.email, Validators.maxLength(254)]);

      // Limpiar validadores para todos los otros campos
      this.tercerosRelacionadosForm.get('rfc')?.setValidators([]);
      this.tercerosRelacionadosForm.get('curp')?.setValidators([]);
      this.tercerosRelacionadosForm.get('terceroNombre')?.setValidators([]);
      this.tercerosRelacionadosForm.get('datosPersonalesNombre')?.setValidators([]);
      this.tercerosRelacionadosForm.get('datosPersonalesPrimerApellido')?.setValidators([]);
      this.tercerosRelacionadosForm.get('datosPersonalesSegundoApellido')?.setValidators([]);
      this.tercerosRelacionadosForm.get('municipio')?.setValidators([]);
      this.tercerosRelacionadosForm.get('localidad')?.setValidators([]);
      this.tercerosRelacionadosForm.get('colonia')?.setValidators([]);

      // Actualizar la validez de todos los controles.
      Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
        const CONTROL = this.tercerosRelacionadosForm.get(key);
        if (CONTROL) {
          CONTROL.updateValueAndValidity({ emitEvent: false });
        }
      });

      // NO llamar a actualizarCamposExtranjeroFisica() para estos formularios
      // ya que deshabilitaría campos cuando no hay nacionalidad/tipo seleccionado

    } else if (TITULOS_MODIFICACION.includes(this.titulo) || this.esModificacion) {
      // Para formularios de modificación, limpiar valores pero mantener campos habilitados
      Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
        const CONTROL = this.tercerosRelacionadosForm.get(key);
        if (CONTROL) {
          CONTROL.setValue('', { emitEvent: false });
          CONTROL.enable({ emitEvent: false }); // Mantener habilitados para modificación
          CONTROL.markAsUntouched();
          CONTROL.markAsPristine();
          CONTROL.updateValueAndValidity({ emitEvent: false });
        }
      });

      // Para "Modificar otros", deshabilitar tipoPersona como en "Agregar otros"
      if (this.titulo === 'Modificar otros') {
        // Habilitar tipoPersona cuando se selecciona nacionalidad
        this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.valueChanges
          .pipe(takeUntil(this.notificadorDestruir$))
          .subscribe(valor => {
            if (valor) {
              this.tercerosRelacionadosForm.get('tipoPersona')?.enable();
            } 
          });
      }

      // Para formularios de modificación, configurar validadores apropiados
      this.configurarValidadoresModificacion();

    } else {
      this.resetearFormularioCompleto();
    }
    if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
  this.aplicarValidacionesOtros();
}
  }

  /**
   * Configura los validadores apropiados para formularios de modificación
   */
  private configurarValidadoresModificacion(): void {
    // Configurar validadores básicos para campos requeridos
    this.tercerosRelacionadosForm.get('razonSocial')?.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO)]);
    this.tercerosRelacionadosForm.get('pais')?.setValidators([Validators.required]);
    this.tercerosRelacionadosForm.get('estado')?.setValidators([Validators.required, Validators.pattern(REGEX_PATRON_ALFANUMERICO), Validators.maxLength(255)]);
    this.tercerosRelacionadosForm.get('codigoPostal')?.setValidators([Validators.required, Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]);
    this.tercerosRelacionadosForm.get('calle')?.setValidators([Validators.required]);

    // Campos opcionales con validadores de formato
    this.tercerosRelacionadosForm.get('lada')?.setValidators([Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(5)]);
    this.tercerosRelacionadosForm.get('telefono')?.setValidators([Validators.pattern(REGEX_TELEFONO_OPCIONAL), Validators.maxLength(30)]);
    this.tercerosRelacionadosForm.get('correoElectronico')?.setValidators([Validators.email, Validators.maxLength(254)]);

  }

  /**
   * Guarda los datos del formulario de terceros relacionados si el formulario es válido.
   * Si es válido, emite los datos y cierra el modal; si no, marca todos los campos como tocados.
   *
   * @returns {void}
   */
 guardar(): void {
  this.marcarRadiosComoTocados();
  if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
    this.aplicarRequeridosAgregarOtros();
  }
  if (!this.tercerosRelacionadosForm.valid) {
    this.tercerosRelacionadosForm.markAllAsTouched();
     this.logInvalidControls();
    return;
  }
console.log(this.tercerosRelacionadosForm.getRawValue(),'Vijay');
  this.guardarFabricante.emit(this.tercerosRelacionadosForm.getRawValue());
  this.resetearFormularioCompleto();
  this.bsModalRef.hide();
}


  /**
   * Resetea completamente el formulario después del envío exitoso
   */
 private resetearFormularioCompleto(): void {
  this.estadoAnterior = '';

  this.tercerosRelacionadosForm.reset();

  if (this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros') {
    this.cerrarFormularioTercerosRelacionados();
    this.aplicarValidacionesOtros();
  } else {
    this.inicializarFormularioTercerosRelacionados();
  }
}


  /**
  * compo doc
  * @method isValid
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(formulario: FormGroup, campo: string): boolean | null {
  return this.validacionesService.isValid(formulario, campo);
  }
    /**
   * Título dinámico del modal, calculado según el idProcedimiento y el modo.
   */
  get tituloModal(): string {
    // Si el título está explícitamente establecido como 'Agregar otros', respetarlo
    if (this.titulo === 'Agregar otros') {
      return this.esModificacion ? 'Modificar otros' : 'Agregar otros';
    }

    // Si el título está explícitamente establecido como 'Modificar destinatario (destino final)', respetarlo
    if (this.titulo === 'Modificar destinatario (destino final)') {
      return 'Modificar destinatario (destino final)';
    }

    // Si el título está explícitamente establecido como 'Agregar destinatario (destino final)', respetarlo
    if (this.titulo === 'Agregar destinatario (destino final)') {
      return 'Agregar destinatario (destino final)';
    }

    // Para otros casos, usar la lógica estándar
    return FabricanteModalComponent.obtenerNombreDelTitulo(this.idProcedimiento, this.esModificacion);
  }

  /**
   * Obtiene el título adecuado según el idProcedimiento y si es modificación.
   * @param idProcedimiento - El identificador del procedimiento
   * @param esModificacion - Si el modal está en modo modificación
   */
  static obtenerNombreDelTitulo(idProcedimiento: number[] | number, esModificacion?: boolean): string {
    const ID = Array.isArray(idProcedimiento) ? idProcedimiento[0] : idProcedimiento;
    // El título se determina por el contexto de uso, no automáticamente por el procedimiento
    // 'Agregar otros' se maneja por separado cuando this.titulo === 'Agregar otros'
    if (ID === 260302 || ID === 260304) {
      return esModificacion ? 'Modificar destinatario (destino final)' : 'Agregar destinatario (destino final)';
    }
    return esModificacion ? 'Modificar fabricante' : 'Agregar fabricante';
  }
get ocultarTituloDatosPersonales(): boolean {
  const nacionalidad = this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.value;
  const tipoPersona = this.tercerosRelacionadosForm.get('tipoPersona')?.value;

  return (
    (nacionalidad === 'nacional' && tipoPersona === 'noContribuyente') ||
    nacionalidad === 'extranjero'
  );
}

/**
 * Nacional + Tipo persona = No contribuyente
 */
private procesarNacionalNoContribuyente(): void {

  // Disable personal name fields for Nacional + No contribuyente
  ['datosPersonalesNombre', 'datosPersonalesPrimerApellido', 'datosPersonalesSegundoApellido'].forEach(campo => {
    const control = this.tercerosRelacionadosForm.get(campo);
    if (control) {
      control.disable({ emitEvent: false });
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    }
  });

  const REQUIRED_DROPDOWNS = [
    'pais',
    'estado',
    'municipio',
    'localidad',
    'codigoPostal',
    'colonia',
    'calle'
  ];

  REQUIRED_DROPDOWNS.forEach(campo => {
    const control = this.tercerosRelacionadosForm.get(campo);
    if (control) {
      control.enable({ emitEvent: false });
      control.setValidators([Validators.required]);
      control.markAsTouched(); // 🔥 ensures error shows
      control.updateValueAndValidity({ emitEvent: false });
    }
  });

  [
    'numeroExterior',
    'numeroInterior',
    'lada',
    'telefono',
    'correoElectronico'
  ].forEach(campo => {
    const control = this.tercerosRelacionadosForm.get(campo);
    if (control) {
      control.enable({ emitEvent: false });
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    }
  });
}

private static obtenerValidadoresNoContribuyente(campo: string): ValidatorFn[] {
  const MAP: Record<string, ValidatorFn[]> = {
    estado: [ Validators.maxLength(255)],
    municipio: [ Validators.maxLength(255)],
    localidad: [ Validators.maxLength(255)],
    codigoPostal: [
      Validators.maxLength(12),
      Validators.pattern(/^[a-zA-Z0-9]+$/)
    ],
    colonia: [ Validators.maxLength(255)],
    calle: [Validators.maxLength(300)],
    numeroExterior: [Validators.maxLength(55)],
    numeroInterior: [Validators.maxLength(55)],
    lada: [
      Validators.maxLength(5),
      Validators.pattern(/^[a-zA-Z0-9]+$/)
    ],
    telefono: [
      Validators.maxLength(24),
      Validators.pattern(/^[a-zA-Z0-9]+$/)
    ],
    correoElectronico: [
      Validators.email,
      Validators.maxLength(320)
    ],
    pais: []
  };

  return MAP[campo] || [];
}
/**
 * Limpia todos los campos dependientes cuando cambia
 * nacionalidad o tipo de persona
 */
private limpiarCamposDependientes(): void {
  const CAMPOS = [
    'rfc',
    'curp',
    'razonSocial',
    'datosPersonalesNombre',
    'datosPersonalesPrimerApellido',
    'datosPersonalesSegundoApellido',
    'pais',
    'estado',
    'municipio',
    'localidad',
    'codigoPostal',
    'colonia',
    'calle',
    'numeroExterior',
    'numeroInterior',
    'lada',
    'telefono',
    'correoElectronico',
    'terceroNombre'
  ];

  CAMPOS.forEach(campo => {
    const control = this.tercerosRelacionadosForm.get(campo);
    if (control) {
      control.reset('', { emitEvent: false });
      control.markAsPristine();
      control.markAsUntouched();
    }
  });
}

private habilitarCamposExtranjeroBase(): void {
  const CAMPOS = [
    'pais','estado','municipio','localidad','codigoPostal','colonia',
    'calle','numeroExterior','numeroInterior','lada','telefono','correoElectronico'
  ];

  CAMPOS.forEach(campo => {
    this.habilitarCampoConValidadores(
      campo,
      FabricanteModalComponent.obtenerValidadoresExtranjero(campo)
    );
  });
}
private static obtenerValidadoresExtranjero(campo: string): ValidatorFn[] {
  const MAP: Record<string, ValidatorFn[]> = {
    estado: [Validators.maxLength(255)],
    codigoPostal: [Validators.maxLength(12), Validators.pattern(/^[a-zA-Z0-9]+$/)],
    calle: [Validators.maxLength(300)],
    numeroExterior: [Validators.maxLength(55)],
    numeroInterior: [Validators.maxLength(55)],
    lada: [Validators.maxLength(5)],
    telefono: [Validators.maxLength(24), Validators.pattern(/^[a-zA-Z0-9]+$/)],
    correoElectronico: [Validators.email, Validators.maxLength(320)],
    pais: []
  };

  return MAP[campo] || [];
}
private aplicarValidacionesOtros(): void {
  const nacionalidad = this.tercerosRelacionadosForm.get('tercerosNacionalidad');
  const tipoPersona = this.tercerosRelacionadosForm.get('tipoPersona');

  if (!nacionalidad || !tipoPersona) return;

  nacionalidad.enable({ emitEvent: false });
  tipoPersona.enable({ emitEvent: false });

  nacionalidad.setValidators([Validators.required]);
  tipoPersona.setValidators([Validators.required]);

  nacionalidad.updateValueAndValidity({ emitEvent: false });
  tipoPersona.updateValueAndValidity({ emitEvent: false });
}




private marcarRadiosComoTocados(): void {
  ['tercerosNacionalidad', 'tipoPersona'].forEach(campo => {
    const control = this.tercerosRelacionadosForm.get(campo);
    if (control) {
      control.markAsTouched();
      control.markAsDirty();
    }
  });
}



private limpiarValidacionesOtros(): void {
  ['tercerosNacionalidad', 'tipoPersona'].forEach(campo => {
    const control = this.tercerosRelacionadosForm.get(campo);
    if (control) {
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    }
  });
}
private logInvalidControls(): void {
  Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
    const control = this.tercerosRelacionadosForm.get(key);
    if (control && control.invalid) {
      console.log('❌ Invalid:', key, control.errors, 'Enabled:', control.enabled);
    }
  });
}

private aplicarRequeridosAgregarOtros(): void {
  const nacionalidad = this.tercerosRelacionadosForm.get('tercerosNacionalidad')?.value;
  const tipoPersona = this.tercerosRelacionadosForm.get('tipoPersona')?.value;

  // 1️⃣ Clear all required validators first
  Object.keys(this.tercerosRelacionadosForm.controls).forEach(key => {
    const c = this.tercerosRelacionadosForm.get(key);
    if (c) {
      c.clearValidators();
      c.updateValueAndValidity({ emitEvent: false });
    }
  });
  // 2️⃣ Always required (radios)
  ['tercerosNacionalidad', 'tipoPersona'].forEach(f => {
    const c = this.tercerosRelacionadosForm.get(f);
    c?.setValidators([Validators.required]);
    c?.updateValueAndValidity({ emitEvent: false });
  });

  
  const ES_FORMULARIO_OTROS = this.titulo === 'Agregar otros' || this.titulo === 'Modificar otros';
  if (ES_FORMULARIO_OTROS) {
    const terceroNombreControl = this.tercerosRelacionadosForm.get('terceroNombre');
    if (terceroNombreControl) {
      terceroNombreControl.setValidators([Validators.required]);
      terceroNombreControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  if (!nacionalidad || !tipoPersona) return;

  // 3️⃣ Nacional + No contribuyente
  if (nacionalidad === 'nacional' && tipoPersona === 'noContribuyente') {
    [
      'pais',
      'estado',
      'municipio',
      'localidad',
      'codigoPostal',
      'colonia',
      'calle',
      'numeroExterior',
      'numeroInterior'
    ].forEach(f => {
      const c = this.tercerosRelacionadosForm.get(f);
      c?.enable({ emitEvent: false });
      c?.setValidators([Validators.required]);
      c?.markAsTouched();
      c?.updateValueAndValidity({ emitEvent: false });
    });
  }

  // 4️⃣ Extranjero
  if (nacionalidad === 'extranjero') {
    this.tercerosRelacionadosForm.get('pais')
      ?.setValidators([Validators.required]);

    if (tipoPersona === 'fisica') {
      ['datosPersonalesNombre', 'datosPersonalesPrimerApellido']
        .forEach(f => {
          this.tercerosRelacionadosForm.get(f)
            ?.setValidators([Validators.required]);
        });
    }

    if (tipoPersona === 'moral') {
      this.tercerosRelacionadosForm.get('razonSocial')
        ?.setValidators([Validators.required]);
    }
  }

  // 5️⃣ Refresh validity
  Object.values(this.tercerosRelacionadosForm.controls)
    .forEach(c => c.updateValueAndValidity({ emitEvent: false }));
}


  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.notificadorDestruir$.next();
    this.notificadorDestruir$.complete();
  }
}