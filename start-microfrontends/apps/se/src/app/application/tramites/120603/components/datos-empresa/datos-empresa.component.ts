import { Catalogo, CatalogoSelectComponent, CatalogoServices, CatalogosSelect, DATOS_EMPRESA, InputRadioComponent, ListaPasosWizard, LoginQuery, Notificacion, NotificacionesComponent, Pedimento, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { ESTADO_DATA, PAIS_DATA, REPRESENTACION_FEDERAL_DATA, SELECCION_DE_SUCURSAL_DATA, SOCIOS_Y_ACCIONISTAS_DATA, SOCIOS_Y_ACCIONISTAS_EXTRANJEROS_DATA, TIPO_EMPRESA_DATA } from '../../constants/column-config.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NacionalidadMexicana, TipoPersona } from '../../constants/tipoPersona.enum';
import { ReplaySubject, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { SeleccionDeSucursalData, SociosYAccionistasData, SociosYAccionistasExtranjerosData } from '../../models/filaData.modal';
import { Solicitud120603State, Solicitud120603Store } from '../../estados/tramite120603.store';
import { CommonModule } from '@angular/common';
import { RegistroComoEmpresaService } from '../../services/registro-como-empresa.service';
import { Solicitud120603Query } from '../../estados/tramite120603.query';

import {
  REGEX_DESCRIPCION,
  REGEX_LOCALIDAD,
  REGEX_POSTAL,
  REGEX_RFC,
  REGEX_SOLO_NUMEROS,
  REGEX_TELEFONO,
} from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';

/** Componente que gestiona los datos de la empresa en el formulario */
@Component({
  selector: 'app-datos-empresa',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent, InputRadioComponent, NotificacionesComponent],
  templateUrl: './datos-empresa.component.html',
  styleUrl: './datos-empresa.component.scss',
})
export class DatosEmpresaComponent implements OnInit, OnDestroy {
        /**
         * Construye el objeto de domicilio a partir de los datos RAW proporcionados.
         * @param RAW Objeto con los datos de domicilio.
         * @returns Objeto de domicilio listo para el payload.
         */
        private buildDomicilioPayload(RAW: Record<string, string | null | undefined>): Record<string, unknown> {
          return {
            pais: RAW['pais'] || RAW['datosPais'] || '',
            codigoPostal: RAW['codigoPostal'] || RAW['datosCodigoPostal'] || '',
            estado: RAW['estado'] || RAW['datosEstado'] || '',
            municipioAlcaldia: RAW['municipioAlcaldia'] || '',
            localidad: RAW['localidad'] || '',
            colonia: RAW['colonia'] || '',
            calle: RAW['calle'] || '',
            numeroExterior: RAW['numeroExterior'] || '',
            numeroInterior: RAW['numeroInterior'] || '',
            lada: RAW['lada'] || '',
            telefono: RAW['telefono'] || ''
          };
        }
      /**
       * Construye el objeto payload para un accionista extranjero.
       * @param RAW Objeto con los datos del formulario.
       * @returns Objeto payload para accionista extranjero.
       */
      private buildAccionistaExtraPayloadObject(RAW: Record<string, string | null | undefined>): Record<string, unknown> {
        return {
          tipoExtranjero: true,
          tipoNacionalidad: true,
          rfcPersonaMoral: this.loginRfc,
          nombre: RAW['nombre'] || '',
          apellidoPaterno: RAW['apellidoPaterno'] || '',
          rfc: RAW['taxId'] || '',
          correoElectronico: RAW['correoElectronico'] || '',
          razonSocial: RAW['razonSocial'] || null,
          nombrePuesto: RAW['taxId'] || '',
          cvePais: RAW['datosPais'] || '',
          codigoPostal: RAW['datosCodigoPostal'] || RAW['codigoPostal'] || '',
          informacionExtra: RAW['datosEstado'] || '',
          domicilio: this.buildDomicilioPayload(RAW)
        };
      }
    /**
     * Valida los campos requeridos para accionista extranjero, considerando solo los visibles según la selección actual.
     * @param RAW Objeto con los datos del formulario.
     * @param CAMPOS Lista de campos requeridos.
     * @returns true si todos los campos requeridos visibles están completos, false en caso contrario.
     */
    private validateRequiredFields(RAW: Record<string, string | number | boolean | null | undefined>, CAMPOS: string[]): boolean {
      const MISSING_FIELDS: string[] = [];
      // Solo valide los campos que son visibles para la selección actual
      const NACIONALIDAD = this.formularioEmpresa.get('nacionalidad')?.value;
      const TIPO_PERSONA = this.formularioEmpresa.get('tipoDePersona')?.value;

      // Si es nacionalidad mexicana y persona física, omita la validación de accionista extranjero
      if (NACIONALIDAD === this.nacionalidadMexicanaSi && TIPO_PERSONA === this.tipoPersonaFisica) {
        return true;
      }

      for (const FIELD of CAMPOS) {
        // Determinar la visibilidad de cada campo.
        let isVisible = true;
        if (NACIONALIDAD === this.nacionalidadMexicanaSi) {
          // Todos los campos de accionista extranjero están ocultos para la nacionalidad mexicana.
          isVisible = false;
        } else if (NACIONALIDAD === this.nacionalidadMexicanaNo && TIPO_PERSONA === this.tipoPersonaFisica) {
          // Solo valide los campos relevantes para persona física
          isVisible = ['nombre', 'apellidoPaterno', 'taxId', 'datosPais', 'datosCodigoPostal', 'datosEstado', 'correoElectronico'].includes(FIELD);
        } else if (NACIONALIDAD === this.nacionalidadMexicanaNo && TIPO_PERSONA === this.tipoPersonaMoral) {
          // Solo valide los campos relevantes para persona moral
          isVisible = ['taxId', 'razonSocial', 'datosPais', 'datosCodigoPostal', 'datosEstado', 'correoElectronico'].includes(FIELD);
        }
        if (!isVisible) {
          continue;
        }
        const VALUE = RAW[FIELD];
        if (!VALUE || (typeof VALUE === 'string' && VALUE.trim() === '')) {
          MISSING_FIELDS.push(FIELD);
          this.formularioEmpresa.get(FIELD)?.markAsTouched();
        }
      }
      if (MISSING_FIELDS.length > 0) {
        // Muestra qué campos faltan para facilitar la depuración
        this.abrirModal(0, `Los siguientes campos son requeridos: ${MISSING_FIELDS.join(', ')}`);
        return false;
      }
      return true;
    }

    /**
     * Verifica si existe un accionista extranjero duplicado en la tabla.
     * @param RAW Objeto con los datos del formulario.
     * @param TIPO_PERSONA Tipo de persona ('MORAL' o 'FISICA').
     * @returns true si existe duplicado, false en caso contrario.
     */
    private isDuplicateAccionistaExtranjeros(RAW: Record<string, string | number | null | undefined>, TIPO_PERSONA: 'MORAL' | 'FISICA'): boolean {
      return this.datosTablaExtranjeros?.some(socio => {
        const TAXID_OK = String(socio.taxId ?? '') === String(RAW['taxId'] ?? '');
        const PAIS_OK = String(socio.datosPais ?? '') === String(RAW['datosPais'] ?? '');
        if (TIPO_PERSONA === 'MORAL') {
          return (
            TAXID_OK &&
            PAIS_OK &&
            String(socio.razonSocial ?? '') === String(RAW['razonSocial'] ?? '')
          );
        }
        // FISICA
        return (
          TAXID_OK &&
          PAIS_OK &&
          String(socio.nombre ?? '') === String(RAW['nombre'] ?? '') &&
          String(socio.apellidoPaterno ?? '') === String(RAW['apellidoPaterno'] ?? '')
        );
      });
    }
  private requiredFieldsConfig = {
    MORAL: ['taxId', 'razonSocial', 'datosPais', 'datosCodigoPostal', 'datosEstado', 'correoElectronico'],
    FISICA: ['nombre', 'apellidoPaterno', 'taxId', 'datosPais', 'datosCodigoPostal', 'datosEstado', 'correoElectronico']
  };
  /** Constante que representa el tipo de persona física */
  tipoPersonaFisica = TipoPersona.FISICA;

  /** Constante que representa el tipo de persona moral */
  tipoPersonaMoral = TipoPersona.MORAL;

  /** Constante que representa la nacionalidad mexicana como "Sí" */
  nacionalidadMexicanaSi = NacionalidadMexicana.SI;

  /** Constante que representa la nacionalidad mexicana como "No" */
  nacionalidadMexicanaNo = NacionalidadMexicana.NO;

  /** Formulario reactivo para gestionar los datos de la empresa */
  public formularioEmpresa!: FormGroup;

  /** Observable para gestionar la destrucción de suscripciones */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /** Constante que almacena los datos de la empresa */
  DATOS_EMPRESA: string = DATOS_EMPRESA;

  /** Descripción de la actividad económica */
  descripcionData = "Otros servicios como maquinas fotograficas que funcionan con monedas, de casilleros que functionan con monedas, de guardapaquetes";

  /** Lista de pasos del wizard */
  pasos: ListaPasosWizard[] = [];

  /** Datos federales y estatales */
  public federalEstatal!: Catalogo[];

  /** Estado de la solicitud */
  solicitud120603State: Solicitud120603State = {} as Solicitud120603State;

  /** Estado del formulario de la empresa */
  formularioEmpresaState!: Solicitud120603State;

  /** Datos de selección de sucursal */
  sucursalData = SELECCION_DE_SUCURSAL_DATA;

  /** Datos generales de socios y accionistas */
  datosGenerales: SociosYAccionistasData[] = [];

  /** Datos de la tabla de socios y accionistas extranjeros */
  datosTablaExtranjeros: SociosYAccionistasExtranjerosData[] = [];

  sucursalDeData: SeleccionDeSucursalData[] = [];

  /** Socios o accionistas seleccionados */
  public seletedccionadaSociaoAccionistas: SociosYAccionistasData[] = [];

  /** Socios o accionistas extranjeros seleccionados */
  public seletedccionadaSociaoAccionistasExtranjeros: SociosYAccionistasExtranjerosData[] = [];

  /** Tipo de selección de la tabla */
  tipoSeleccionTabla = TablaSeleccion;

  /** Datos de socios y accionistas */
  sociosYAccionistasData = SOCIOS_Y_ACCIONISTAS_DATA;

  /** Datos de socios y accionistas extranjeros */
  socioYAccionistasExtranjerosData = SOCIOS_Y_ACCIONISTAS_EXTRANJEROS_DATA;

  /** Opciones de selección mexicana */
  opcionSeleccionPersona = [
    { label: 'Persona física', value: TipoPersona.FISICA },
    { label: 'Persona moral', value: TipoPersona.MORAL },
  ];

  /** Opciones de selección mexicana */
  opcionSeleccionMexicana = [
    { label: 'Sí', value: NacionalidadMexicana.SI },
    { label: 'No', value: NacionalidadMexicana.NO },
  ];

  /** Valor seleccionado para la nacionalidad */
  public valorSeleccionadoNacionalidad: string = '';

  /** Valor seleccionado para el tipo de persona */
  public valorSeleccionadoPersona: string = '';

  /** Índice del elemento para eliminar */
  elementoParaEliminar!: number;

  /** Lista de pedimentos */
  pedimentos: Array<Pedimento> = [];

  /** Datos del estado */
  public estadoData: CatalogosSelect = ESTADO_DATA;

  /** Datos de representación federal */
  public representacionFederalData: CatalogosSelect = REPRESENTACION_FEDERAL_DATA;

  /** Datos del tipo de empresa */
  public tipoEmpresaData: CatalogosSelect = TIPO_EMPRESA_DATA;

  /** Datos del país */
  public paisData: CatalogosSelect = PAIS_DATA;

  /** Filas seleccionadas en la tabla */
  selectedRows: Set<number> = new Set<number>();

  /** Indica si el formulario es visible */
  esFormularioVisible = false;

  /** Notificación nueva */
  public nuevaNotificacion!: Notificacion;

  /** Indica si el formulario es de solo lectura */
  esFormularioSoloLectura: boolean = false;

  /** Estado de la consulta que se obtiene del store */
  consultaDatos!: ConsultaioState;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  // Valor de RFC de ejemplo
  private loginRfc: string = '';
  /** Notificación para eliminar socio o accionista */
  confirmarEliminar: boolean = false;
  /** Notificación para eliminar socio o accionista */
  nuevaNotificacionEliminar!: Notificacion;
  /** Constructor del componente */
  /** Tipo de eliminación (extranjero o accionista) */
  tipoEliminacion: 'EXTRANJERO' | 'ACCIONISTA' | null = null;

    /**
   *  jest.spyOnIndica si las partidas seleccionadas son inválidas.
   */
  isInvalidaPartidas: boolean = false;

  /**
 * Constructor del componente DatosEmpresaComponent.
 * 
 * @param fb Servicio para la creación y gestión de formularios reactivos.
 * @param registroComoEmpresa Servicio para operaciones relacionadas con el registro de empresa.
 * @param solicitud120603Store Store para el manejo del estado de la solicitud 120603.
 * @param solicitud120603Query Query para consultar el estado de la solicitud 120603.
 * @param consultaioQuery Query para consultar el estado de la consulta de datos.
 * @param catalogoService Servicio para la obtención de catálogos y datos auxiliares.
 * @param loginQuery Query para consultar el estado de autenticación/login.
 */
  constructor(
    private fb: FormBuilder,
    private registroComoEmpresa: RegistroComoEmpresaService,
    public solicitud120603Store: Solicitud120603Store,
    public solicitud120603Query: Solicitud120603Query,
    private consultaioQuery: ConsultaioQuery,
    public catalogoService: CatalogoServices,
    private loginQuery: LoginQuery,

  ) { }

  /** Método del ciclo de vida que se ejecuta al inicializar el componente */
  ngOnInit(): void {
    this.solicitud120603Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.formularioEmpresaState = seccionState;
          this.sucursalDeData = this.formularioEmpresaState.sucursalDeData || [];

        })
      )
      .subscribe();
    this.createForm();
    
    // Establecer valores predeterminados para los botones de opción
    this.formularioEmpresa.patchValue({
      nacionalidad: this.nacionalidadMexicanaSi,
      tipoDePersona: this.tipoPersonaFisica
    });
    
    this.obtenerEstado();
    this.getTipoDeEmpresaData();
    this.subscribeToTipoEmpresaChanges();
    this.getPaisData();
    this.subscribeToEstadoDataChanges();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
    this.getSociosYAaccionistasData();
    this.getSociosYAccionistasExtranjerosData();

    this.inicializarEstadoFormulario();
  }
/**
   * Valida todos los formularios y la selección de filas.
   * @returns {boolean} Indica si todos los formularios y la selección son válidos.
   */
  /**
   * Valida el formulario considerando solo los campos visibles/activos según la UI (radio buttons).
   * Agrega logs detallados para cada campo relevante.
   * @returns {boolean} Indica si el formulario es válido según la visibilidad de campos.
   */
  validarFormulario(formGroup: FormGroup = this.formularioEmpresa): boolean {
    let isValid = true;
    const ERRORS: string[] = [];

    // Determinar visibilidad de campos según selección
    const NACIONALIDAD = formGroup.get('nacionalidad')?.value;
    const TIPO_PERSONA = formGroup.get('tipoDePersona')?.value;

    // Ayudante para validar e iniciar sesión solo si el campo está visible en la interfaz de usuario para la selección actual
    const VALIDATE_IF_VISIBLE = (field: string, label: string, visible: boolean): void => {
      if (!visible) {
        return;
      }
      const CONTROL = formGroup.get(field);
      if (CONTROL) {
        CONTROL.markAsTouched();
        if (!CONTROL.value || (typeof CONTROL.value === 'string' && CONTROL.value.trim() === '')) {
          isValid = false;
          ERRORS.push(`${label} es obligatorio.`);
        } else if (CONTROL.invalid) {
          isValid = false;
          ERRORS.push(`${label} no es válido.`);
        }
      }
    };

    // Siempre requeridos (solo si visibles)
    VALIDATE_IF_VISIBLE('representacionFederal', 'Representación federal', true);
    VALIDATE_IF_VISIBLE('tipoEmpresa', 'Tipo de empresa', true);
    VALIDATE_IF_VISIBLE('actividadEconomicaPreponderante', 'Actividad económica preponderante', true);
    VALIDATE_IF_VISIBLE('nacionalidad', 'Nacionalidad', true);
    VALIDATE_IF_VISIBLE('tipoDePersona', 'Tipo de persona', true);

    // Según selección de radio buttons, solo si el campo es visible en el UI
    if (NACIONALIDAD === this.nacionalidadMexicanaSi) {
      // RFC en solitario visible
      VALIDATE_IF_VISIBLE('registroFederal', 'Registro federal de contribuyentes', true);
    } else if (NACIONALIDAD === this.nacionalidadMexicanaNo && TIPO_PERSONA === this.tipoPersonaMoral) {
      VALIDATE_IF_VISIBLE('taxId', 'TAX ID', true);
      VALIDATE_IF_VISIBLE('razonSocial', 'Denominación o razón social', true);
      VALIDATE_IF_VISIBLE('datosPais', 'País', true);
      VALIDATE_IF_VISIBLE('datosCodigoPostal', 'Código postal', true);
      VALIDATE_IF_VISIBLE('datosEstado', 'Estado', true);
      VALIDATE_IF_VISIBLE('correoElectronico', 'Correo electrónico', true);
    } else if (NACIONALIDAD === this.nacionalidadMexicanaNo && TIPO_PERSONA === this.tipoPersonaFisica) {
      VALIDATE_IF_VISIBLE('nombre', 'Nombre', true);
      VALIDATE_IF_VISIBLE('apellidoPaterno', 'Apellido paterno', true);
      VALIDATE_IF_VISIBLE('taxId', 'TAX ID', true);
      VALIDATE_IF_VISIBLE('datosPais', 'País', true);
      VALIDATE_IF_VISIBLE('datosCodigoPostal', 'Código postal', true);
      VALIDATE_IF_VISIBLE('datosEstado', 'Estado', true);
      VALIDATE_IF_VISIBLE('correoElectronico', 'Correo electrónico', true);
    } else {
      // Caso inicial o sin selección: solo los campos base
      VALIDATE_IF_VISIBLE('taxId', 'TAX ID', true);
      VALIDATE_IF_VISIBLE('razonSocial', 'Denominación o razón social', true);
      VALIDATE_IF_VISIBLE('datosPais', 'País', true);
      VALIDATE_IF_VISIBLE('datosCodigoPostal', 'Código postal', true);
      VALIDATE_IF_VISIBLE('datosEstado', 'Estado', true);
      VALIDATE_IF_VISIBLE('correoElectronico', 'Correo electrónico', true);
    }

    // Guarde los datos del formulario para almacenarlos usando getRawValue para incluir controles deshabilitados
    if (isValid) {
      this.saveFormDataToStore();
    }

    return isValid;
  }
  /** Método para suscribirse a los cambios en el tipo de empresa */
  private subscribeToTipoEmpresaChanges(): void {
    const TIPO_EMPRESA_CONTROL = this.formularioEmpresa.get('tipoEmpresa');
    const ACTIVIDAD_ECONOMICA_CONTROL = this.formularioEmpresa.get('actividadEconomicaPreponderante');
    const DESCRIPCION_CONTROL = this.formularioEmpresa.get('descripcion');
    const ESPECIFIQUE_CONTROL = this.formularioEmpresa.get('especifique');

    TIPO_EMPRESA_CONTROL?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
      if (value) {
        ACTIVIDAD_ECONOMICA_CONTROL?.enable();
        ESPECIFIQUE_CONTROL?.enable();
        // Solo se borra si el valor aún no está establecido
        if (!ACTIVIDAD_ECONOMICA_CONTROL?.value) {
          ACTIVIDAD_ECONOMICA_CONTROL?.setValue('');
        }
        DESCRIPCION_CONTROL?.setValue('');
        ACTIVIDAD_ECONOMICA_CONTROL?.setValidators([Validators.required]);
      } else {
        ACTIVIDAD_ECONOMICA_CONTROL?.disable();
        ESPECIFIQUE_CONTROL?.disable();
        ACTIVIDAD_ECONOMICA_CONTROL?.clearValidators();
      }
      ACTIVIDAD_ECONOMICA_CONTROL?.updateValueAndValidity();
    });
  }

  /** Método para crear el formulario reactivo */
  createForm(): void {
    this.formularioEmpresa = this.fb.group({
      estado: [this.formularioEmpresaState?.estado],
      representacionFederal: [this.formularioEmpresaState?.representacionFederal, Validators.required],
      tipoEmpresa: [this.formularioEmpresaState?.tipoEmpresa || '', Validators.required],
      especifique: [{ value: this.formularioEmpresaState?.especifique || '', disabled: true }, Validators.maxLength(20)],
      actividadEconomicaPreponderante: [{ value: this.formularioEmpresaState?.actividadEconomicaPreponderante || '', disabled: true }],
      descripcion: [{ value: this.formularioEmpresaState?.descripcion || '', disabled: true }, Validators.maxLength(4)],

      pais: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['pais'] || '', disabled: true }],
      codigoPostal: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['codigoPostal'] || '', disabled: true }, [Validators.pattern(REGEX_POSTAL)]],
      estadoDomicilio: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['estadoDomicilio'] || '', disabled: true }],
      municipioAlcaldia: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['municipioAlcaldia'] || '', disabled: true }, [Validators.pattern(REGEX_DESCRIPCION)]],
      localidad: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['localidad'] || '', disabled: true }, [Validators.pattern(REGEX_LOCALIDAD)]],
      colonia: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['colonia'] || '', disabled: true }, [Validators.pattern(REGEX_DESCRIPCION)]],
      calle: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['calle'] || '', disabled: true }, [Validators.pattern(REGEX_DESCRIPCION)]],
      numeroExterior: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['numeroExterior'] || '', disabled: true }, [Validators.pattern(REGEX_SOLO_NUMEROS)]],
      numeroInterior: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['numeroInterior'] || '', disabled: true }, Validators.pattern(REGEX_SOLO_NUMEROS)],
      lada: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['lada'] || '', disabled: true }, Validators.pattern(REGEX_SOLO_NUMEROS)],
      telefono: [{ value: this.formularioEmpresaState.domicilioDisabledForm?.['telefono'] || '', disabled: true }, [Validators.pattern(REGEX_TELEFONO)]],

      nacionalidad: [this.formularioEmpresaState?.nacionalidad || ''],
      registroFederal: [this.formularioEmpresaState?.registroFederal || '', [Validators.pattern(REGEX_RFC)]],
      tipoDePersona: [this.formularioEmpresaState?.tipoDePersona || ''],
      nombre: [this.formularioEmpresaState.nombre, Validators.maxLength(200)],
      apellidoPaterno: [this.formularioEmpresaState.apellidoPaterno, Validators.maxLength(200)],

      taxId: [this.formularioEmpresaState.taxId, Validators.maxLength(12)],
      razonSocial: [this.formularioEmpresaState.razonSocial, Validators.maxLength(254)],
      datosPais: [this.formularioEmpresaState.datosPais],
      datosCodigoPostal: [this.formularioEmpresaState.datosCodigoPostal, [Validators.pattern(REGEX_POSTAL), Validators.maxLength(12)]],
      datosEstado: [this.formularioEmpresaState.datosEstado, [Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(255)]],
      correoElectronico: [this.formularioEmpresaState.correoElectronico, [Validators.email, Validators.maxLength(200)]],
    });
  }

  /** Getter para verificar si el botón de agregar debe estar deshabilitado */
  get isFormInvalidForSubmit(): boolean {
    const NACIONALIDAD = this.formularioEmpresa.get('nacionalidad')?.value;
    const TIPO_PERSONA = this.formularioEmpresa.get('tipoDePersona')?.value;
    

    // Si no se ha seleccionado nacionalidad o tipo de persona, deshabilitar
    if (!NACIONALIDAD || !TIPO_PERSONA) {
      return true;
    }
    
    // Verificar campos básicos siempre requeridos
    if (!this.formularioEmpresa.get('representacionFederal')?.value ||
        !this.formularioEmpresa.get('tipoEmpresa')?.value ||
        !this.formularioEmpresa.get('actividadEconomicaPreponderante')?.value) {
      return true;
    }
    
    // Validación condicional basada en selecciones
    if (NACIONALIDAD === this.nacionalidadMexicanaSi) {
      // Solo se requiere RFC para nacionales
      return !this.formularioEmpresa.get('registroFederal')?.value;
    }

    // Para extranjeros, validar campos específicos según tipo de persona
    if (NACIONALIDAD === this.nacionalidadMexicanaNo) {
      const CAMPO_REQUIREDS = ['taxId', 'datosPais', 'datosCodigoPostal', 'datosEstado', 'correoElectronico'];
      if (TIPO_PERSONA === this.tipoPersonaMoral) {
        CAMPO_REQUIREDS.push('razonSocial');
      } else if (TIPO_PERSONA === this.tipoPersonaFisica) {
        CAMPO_REQUIREDS.push('nombre', 'apellidoPaterno');
      }
      for (const FIELD of CAMPO_REQUIREDS) {
        if (!this.formularioEmpresa.get(FIELD)?.value) {
          return true;
        }
      }
    }

    return false;
  }

  /** Método para abrir un modal */
  abrirModal(i: number, mensaje?: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje || 'La entidad federativa seleccionada no cuenta con sucursales asociadas a su RFC para tramitar el Registro como Empresa de la Frontera',
      cerrar: false,
      tiempoDeEspera: 100,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  abrirModalEliminar(): void {
    this.nuevaNotificacionEliminar = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: '¿Estás seguro de que deseas eliminar este socio o accionista?',
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnCancelar: 'Cancelar',
      txtBtnAceptar: 'Aceptar',
    };
  }

  /** Método para eliminar un pedimento de la lista */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /** Método para validar el RFC ingresado en el formulario */
  checkRFCValidation(): void {
    const RFC_CONTROL = this.formularioEmpresa.get('registroFederal')
    if (RFC_CONTROL?.invalid && RFC_CONTROL?.errors?.['minlength'] && !this.nuevaNotificacion) {
      this.abrirModal(0, 'El RFC debe tener al menos 13 caracteres de longitud.');
    }
  }

  /** Getter para obtener la nacionalidad seleccionada */
  get selectedNacionalidad(): string | null {
    const VALUE = this.formularioEmpresa.get('nacionalidad')?.value;
    return VALUE;
  }

  /** Setter para establecer la nacionalidad seleccionada */
  setSelectedNacionalidad(value: string): void {
    this.formularioEmpresa.get('nacionalidad')?.setValue(value);
  }

  /** Getter para obtener el tipo de persona seleccionado */
  get selectedTipoPersona(): string | null {
    const VALUE = this.formularioEmpresa.get('tipoDePersona')?.value;
    return VALUE;
  }

  /** Setter para establecer el tipo de persona seleccionado */
  setSelectedTipoDePersona(value: string): void {
    this.formularioEmpresa.get('tipoDePersona')?.setValue(value);
  }


  /**
 * @description Obtiene el estado desde el servicio y asigna los datos a la variable `estado`.
 * @returns {void} No devuelve ningún valor, solo actualiza el estado del componente.
 */
  obtenerEstado(): void {
    this.catalogoService.estadosCatalogo('120603')
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.estadoData.catalogos = (response?.datos ?? []) as Catalogo[];
          this.estadoData.primerOpcion = 'Seleccione una opción';
        }
      });
  }

  /** Método para obtener los datos de representación federal */
  getRepresentacionFederalData(): void {
    this.registroComoEmpresa
      .getRepresentacionFederalData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: Catalogo[]) => {
        this.representacionFederalData.catalogos = data as Catalogo[];
        this.representacionFederalData.primerOpcion = 'Seleccione una opción';
      });
  }

  /** Método para obtener los datos del tipo de empresa */
  getTipoDeEmpresaData(): void {
    this.catalogoService
      .obtenerTipoEmpresaCatalogo('120603')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.tipoEmpresaData.catalogos = (response?.datos ?? []) as Catalogo[];
        this.tipoEmpresaData.primerOpcion = 'Seleccione una opción';
      });
  }

  /** Método para obtener los datos del país */
  getPaisData(): void {
    this.catalogoService
      .paisesCatalogo('120603')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.paisData.catalogos = (response?.datos ?? []) as Catalogo[];
        this.paisData.primerOpcion = 'Seleccione una opción';
      });
  }

  /** Método para obtener los datos de socios y accionistas */
  getSociosYAaccionistasData(): void {
    this.registroComoEmpresa
      .obtenerAccionistas(this.loginRfc)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const RAW = (data as { datos: Array<{ personaRelacionada: SociosYAccionistasData, idRolePersona?: number }> }).datos || [];
        this.datosGenerales = RAW.map((item, index) => ({
          ...item.personaRelacionada,
          id: index,
          idRolePersona: String(item.idRolePersona ?? ''),
        }));
        this.solicitud120603Store.setSociosYAaccionistasData(this.datosGenerales || []);
      });
  }

  /** Método para obtener los datos de socios y accionistas extranjeros */
  getSociosYAccionistasExtranjerosData(): void {
    this.registroComoEmpresa
      .obtenerAccionistasExtranjeros(this.loginRfc)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const RAW = (data as { datos: Array<{ personaRelacionada: SociosYAccionistasExtranjerosData, idPersona?: number }> }).datos || [];
        this.datosTablaExtranjeros = RAW.map((item, index) => ({
          ...item.personaRelacionada,
          id: index
        }));
        this.solicitud120603Store.setSociosYAaccionistasExtranjerosData(this.datosTablaExtranjeros || []);
      });
  }
  /**
  * Recupera y establece la información de las plantas según el estado seleccionado.
  * @param estadoId El ID del estado seleccionado.
  * @returns {void}
  */
  obtenerPlantasPorEstado(estadoId: string): void {
    const PAYLOAD = {
      rfc_solicitante: this.loginRfc,
      entidad_federativa: estadoId
    };

    this.registroComoEmpresa
      .obtenerPlantas(PAYLOAD)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {

          const DATOS_RESPONSE = response.datos as {
            lista_ubicacion_mercancia?: unknown[] | null;
          };

          const LISTA_UBICACION = Array.isArray(
            DATOS_RESPONSE.lista_ubicacion_mercancia
          )
            ? DATOS_RESPONSE.lista_ubicacion_mercancia
            : [];

          if (LISTA_UBICACION.length === 0) {
            this.sucursalDeData = [];
            this.abrirModal(
              0,
              'La entidad federativa seleccionada no cuenta con sucursales asociadas a su RFC'
            );
            return;
          }

          const MAPPED = LISTA_UBICACION.map(planta => {
            const DOMICILIO =
              (planta as { domicilioDto?: Record<string, unknown> })?.domicilioDto ?? {};

            return {
              calle: (DOMICILIO['calle'] as string) ?? '',
              numeroInterior: Number(DOMICILIO['numInterior'] ?? 0),
              numeroExterior: Number(DOMICILIO['numExterior'] ?? 0),
              codigoPostal: Number(DOMICILIO['codigoPostal'] ?? 0),
              colonia:
                (DOMICILIO['coloniaEntity'] as { nombre?: string })?.nombre ?? '',
              localidad:
                (DOMICILIO['localidad'] as { nombre?: string })?.nombre ?? '',
              municipioAlcaldia:
                (DOMICILIO['delegacionMunicipio'] as { nombre?: string })?.nombre ?? '',
              telefono: Number(DOMICILIO['telefono'] ?? 0),
              estado:
                (DOMICILIO['entidadFederativa'] as { nombre?: string })?.nombre ?? '',
              pais:
                (DOMICILIO['pais'] as { nombre?: string })?.nombre ?? '',
              cvepais:
                (DOMICILIO['pais'] as { cvePais?: string })?.cvePais ?? '',
              cveEntidad:
                (DOMICILIO['entidadFederativa'] as { cveEntidad?: string })?.cveEntidad ?? '',
              cveColonia:
                (DOMICILIO['coloniaEntity'] as { clave?: string })?.clave ?? ''
            } as SeleccionDeSucursalData;
          });

          this.sucursalDeData = MAPPED;
          this.solicitud120603Store.setSeleccionDeSucursalData(MAPPED);
        }
      });
  }


  /** Método para agregar una nueva entrada a la tabla de socios y accionistas extranjeros */
  onAgregar(): void {
    const PAIS_ID = this.formularioEmpresa.get('datosPais')?.value;
    const PAIS_DESCRIPTION = this.paisData.catalogos.find((pais) => pais.id === Number(PAIS_ID))?.descripcion || '';
    const NUEVA_ENTRADA: SociosYAccionistasExtranjerosData = {
      taxId: this.formularioEmpresa.get('taxId')?.value,
      razonSocial: this.formularioEmpresa.get('razonSocial')?.value,
      datosPais: PAIS_DESCRIPTION,
      datosCodigoPostal: this.formularioEmpresa.get('datosCodigoPostal')?.value,
      datosEstado: this.formularioEmpresa.get('datosEstado')?.value,
      correoElectronico: this.formularioEmpresa.get('correoElectronico')?.value,
      nombre: this.formularioEmpresa.get('nombre')?.value,
      apellidoPaterno: this.formularioEmpresa.get('apellidoPaterno')?.value,
      id: 0
    };
    if (this.formularioEmpresa.get('registroFederal')?.value) {
      const SOC: SociosYAccionistasData = {
        id: this.datosGenerales.length,
        nombre: this.formularioEmpresa.get('nombre')?.value || "",
        apellidoPaterno: this.formularioEmpresa.get('apellidoPaterno')?.value || "",
        apellidoMaterno: this.formularioEmpresa.get('apellidoMaterno')?.value || "",
        correo: this.formularioEmpresa.get('correoElectronico')?.value || "",
        razonSocial: this.formularioEmpresa.get('razonSocial')?.value || "",
        calle: "",
      };
      this.datosGenerales = [...this.datosGenerales, SOC];
    } else {
      this.datosTablaExtranjeros = [...this.datosTablaExtranjeros, NUEVA_ENTRADA];
      this.formularioEmpresa.patchValue({
        taxId: '',
        razonSocial: '',
        datosPais: '',
        datosCodigoPostal: '',
        datosEstado: '',
        correoElectronico: '',
      });
    }

  }

  /**
   * Construye el payload para un accionista nacional a partir de los datos del formulario.
   * @returns Objeto payload para accionista nacional.
   */
  buildAccionistaPayload(): Record<string, unknown> {
    const RAW = this.formularioEmpresa.getRawValue();
    return {
      tipoExtranjero: false,
      tipoNacionalidad: false,
      rfcPersonaMoral: this.loginRfc,
      rfc: RAW.registroFederal || this.loginRfc,
      nombre: RAW.nombre || '',
      razonSocial: RAW.razonSocial || '',
      correoElectronico: RAW.correoElectronico || '',
      domicilio: {
        pais: RAW.pais || RAW.datosPais || '',
        codigoPostal: RAW.codigoPostal || RAW.datosCodigoPostal || '',
        estado: RAW.estadoDomicilio || RAW.datosEstado || '',
        municipioAlcaldia: RAW.municipioAlcaldia || '',
        localidad: RAW.localidad || '',
        colonia: RAW.colonia || '',
        calle: RAW.calle || '',
        numeroExterior: RAW.numeroExterior || '',
        numeroInterior: RAW.numeroInterior || '',
        lada: RAW.lada || '',
        telefono: RAW.telefono || ''
      }
    };
  }

    /**
     * Construye el payload para un accionista extranjero a partir de los datos del formulario.
     * Valida los campos requeridos y verifica duplicados antes de construir el objeto.
     * @returns Objeto payload para accionista extranjero o null si no es válido.
     */
    buildAccionistaExtraPayload(): Record<string, unknown> | null {
      const RAW = this.formularioEmpresa.getRawValue();
      const NACIONALIDAD = this.formularioEmpresa.get('nacionalidad')?.value;
      const TIPO_PERSONA = RAW.tipoDePersona as 'MORAL' | 'FISICA';
      // Si es nacionalidad mexicana y persona física, omita la lógica de accionista extranjero.
      if (NACIONALIDAD === this.nacionalidadMexicanaSi && TIPO_PERSONA === this.tipoPersonaFisica) {
        return null;
      }
      const CAMPOS = this.requiredFieldsConfig[TIPO_PERSONA];
      if (!CAMPOS) { 
        return null; 
      }
      if (!this.validateRequiredFields(RAW, CAMPOS)) {
        return null;
      }
      if (this.isDuplicateAccionistaExtranjeros(RAW, TIPO_PERSONA)) {
        this.abrirModal(
          0,
          'El socio que intenta agregar se encuentra previamente registrado.'
        );
        return null;
      }
      const PAYLOAD = this.buildAccionistaExtraPayloadObject(RAW);
      return PAYLOAD;
    }



  /**
   * Maneja la acción de confirmación en la notificación de eliminación de socio o accionista.
   * Si el usuario confirma, procede a eliminar el elemento correspondiente (extranjero o accionista).
   * Si no confirma, cancela la operación y restablece los estados relacionados.
   *
   * @param confirmado Indica si el usuario confirmó la acción (true) o la canceló (false).
   */
  onNotificacionAccion(confirmado: boolean): void {
    if (!confirmado) {
      this.confirmarEliminar = false;
      this.tipoEliminacion = null;
      return;
    }

    this.confirmarEliminar = true;

    if (this.tipoEliminacion === 'EXTRANJERO') {
      this.onEliminar();
    }

    if (this.tipoEliminacion === 'ACCIONISTA') {
      this.onDelete();
    }

    this.tipoEliminacion = null;
  }


  /** Método para guardar todos los datos del formulario */
  guardarTodo(): boolean {
    // Validar siempre el formulario primero
    const IS_FORM_VALID = this.validarFormulario();
    
    if (!IS_FORM_VALID) {
      return false;
    }
    
    // Primero, guarde todos los datos del formulario para almacenarlos, incluidos los controles deshabilitados.
    this.saveFormDataToStore();
    const NACIONALIDAD = this.formularioEmpresa.get('nacionalidad')?.value;
    const RFC = this.formularioEmpresa.get('registroFederal')?.value;
    if (RFC && NACIONALIDAD === this.nacionalidadMexicanaSi) {
      this.addDatosAccionista();
    } else {
      this.addDatosAccionistaExtranjeros();
    }
    
    return true;
  }

  /** Método para agregar datos de accionista extranjero */
  addDatosAccionistaExtranjeros(): void {
    const PAYLOAD = this.buildAccionistaExtraPayload();
    if (!PAYLOAD) {
      return;
    }
    this.registroComoEmpresa
      .obtenerDatosAccionistaExtranjero(PAYLOAD)
      .subscribe({
        next: (resp) => {
          if (resp?.codigo === '00') {
            this.getSociosYAccionistasExtranjerosData();
          }
        },
        error: () => {
          this.abrirModal(0, 'Ocurrió un error al agregar el accionista extranjero. Intente nuevamente.');
        }
      });
  }

  /** Método para agregar datos de accionista nacional */
  addDatosAccionista(): void {
    const RFC = this.formularioEmpresa.get('registroFederal')?.value;
    if (this.existeSocioNacional(RFC)) {
      this.abrirModal(
        0,
        'El RFC que intenta agregar se encuentra previamente registrado.'
      );
      return;
    }
    const PAYLOAD = this.buildAccionistaPayload();
    this.registroComoEmpresa.obtenerDatosAccionista(PAYLOAD).subscribe({
      next: (resp) => {
        if (resp?.codigo === '00') {
          this.getSociosYAaccionistasData();
        }
      }
    });
  }
  /** Método para verificar si un socio nacional ya existe */
  private existeSocioNacional(rfc: string): boolean {
    if (!rfc || !Array.isArray(this.datosGenerales)) {
      return false;
    }

    return this.datosGenerales.some(
      socio => {
        const SOCIO_RFC = socio?.rfc || '';
        return SOCIO_RFC === rfc;
      }
    );
  }


  /** Método para establecer la clave de la actividad económica */
  public setActividadEconomicaClave(): void {
    const PAYLOAD = {
      id_actividad_economica: this.formularioEmpresa.get('actividadEconomicaPreponderante')?.value,
      id_tipo_empresa: this.formularioEmpresa.get('tipoEmpresa')?.value,
    }
    const DESCRIPCION_CONTROL = this.formularioEmpresa.get('descripcion');
    if (PAYLOAD.id_actividad_economica?.length === 4) {
      this.registroComoEmpresa.buscarActividadesEconomicas(PAYLOAD)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((response) => {
          const ACTIVIDAD_ECONOMICA = response?.datos || [];
          let descripcion = "";
          if (
            ACTIVIDAD_ECONOMICA && typeof ACTIVIDAD_ECONOMICA === "object" && "descripcion" in ACTIVIDAD_ECONOMICA) {
            descripcion = (ACTIVIDAD_ECONOMICA as { descripcion?: string }).descripcion ?? "";
          }
          DESCRIPCION_CONTROL?.setValue(descripcion);

        });
    }
  }

  /** Método para obtener los datos de domicilio desde un evento */
  getDomicilioData(event: SeleccionDeSucursalData): void {
    this.formularioEmpresa.patchValue({
      pais: event.pais,
      codigoPostal: event.codigoPostal,
      estadoDomicilio: event.estado,
      municipioAlcaldia: event.municipioAlcaldia,
      localidad: event.localidad,
      colonia: event.colonia,
      calle: event.calle,
      numeroExterior: event.numeroExterior,
      numeroInterior: event.numeroInterior,
      lada: event.lada,
      telefono: event.telefono,
    });

    const DOMICILIO_DATA = {
      pais: event.pais || '',
      codigoPostal: event.codigoPostal || '',
      estadoDomicilio: event.estado || '',
      municipioAlcaldia: event.municipioAlcaldia || '',
      localidad: event.localidad || '',
      colonia: event.colonia || '',
      calle: event.calle || '',
      numeroExterior: event.numeroExterior || '',
      numeroInterior: event.numeroInterior || '',
      lada: event.lada || '',
      telefono: event.telefono || '',
      cvepais: typeof event.cvepais === 'string' ? event.cvepais : 'MEX',
      cveColonia: typeof event.cveColonia === 'string' ? event.cveColonia : '',
      cveEntidad: typeof event.cveEntidad === 'string' ? event.cveEntidad : ''
    };
    this.solicitud120603Store.setDomicilioDataToStore(DOMICILIO_DATA);
  }

  /** Método para suscribirse a los cambios en los datos del estado */
  subscribeToEstadoDataChanges(): void {
    const ESTADO_CONTROL = this.formularioEmpresa.get('estado');
    ESTADO_CONTROL?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroyed$))
      .subscribe((cveEntidad) => {
        if (cveEntidad) {
          const ESTADO_SELECCIONADO = this.estadoData.catalogos.find((item) => item.clave === cveEntidad);
          const CLAVE_ESTADO = ESTADO_SELECCIONADO?.clave;
          if (CLAVE_ESTADO) {
            this.obtenerRepresentacionFederal(CLAVE_ESTADO);
          }
        }
      });
  }

  /**
 * @description Obtiene el representación federal desde el servicio y asigna los datos a la variable `representacion`.
 * @returns {void} No devuelve ningún valor, solo actualiza el estado del componente.
 */
  obtenerRepresentacionFederal(claveEstado: string): void {
    this.catalogoService.representacionFederalCatalogo('120603', claveEstado)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response) => {
          this.representacionFederalData.catalogos = response?.datos ?? [];
          if (this.representacionFederalData.catalogos.length > 0) {
            const OPCION_PRESELECCIONADA = this.representacionFederalData.catalogos;
            this.representacionFederalData.catalogos = OPCION_PRESELECCIONADA;
            this.formularioEmpresa.patchValue({
              representacionFederal: OPCION_PRESELECCIONADA[0].clave
            });
            this.obtenerPlantasPorEstado(claveEstado);
          }
        }
      });
  }

  /** Método para manejar el cambio de filas seleccionadas en la tabla */
  onSelectedRowsChange(evento: SociosYAccionistasData): void {
    const INDEX = this.seletedccionadaSociaoAccionistas.findIndex(
      item => item.id === evento.id
    );
    if (INDEX > -1) {
      this.seletedccionadaSociaoAccionistas.splice(INDEX, 1);
    } else {
      this.seletedccionadaSociaoAccionistas.push(evento);
    }
  }

  /** Método para manejar el cambio de filas seleccionadas en la tabla de extranjeros */
  onSelectedRowsChangeExtranjeros(
    evento: SociosYAccionistasExtranjerosData[]
  ): void {
    if (!evento || evento.length === 0) {
      this.seletedccionadaSociaoAccionistasExtranjeros = [];
      return;
    }
    const UNIQUE = evento.filter(
      (item, index, self) =>
        index === self.findIndex(
          t => (t.id ?? t.idRolePersona) === (item.id ?? item.idRolePersona)
        )
    );
    this.seletedccionadaSociaoAccionistasExtranjeros = UNIQUE;
  }

  /** Método para eliminar filas seleccionadas de la tabla de datos generales */
  onDelete(): void {
    if (
      !this.seletedccionadaSociaoAccionistas ||
      this.seletedccionadaSociaoAccionistas.length === 0
    ) {
      return;
    }
    this.tipoEliminacion = 'ACCIONISTA';
    const IDS = this.seletedccionadaSociaoAccionistas
      .map(item => item.idRolePersona ?? item.id)
      .filter((id): id is string | number => id !== null && id !== undefined);
    if (!IDS.length) {
      return;
    }
    if (!this.confirmarEliminar) {
      this.abrirModalEliminar();
      return;
    }
    IDS.forEach(id => {
      this.eliminarTableRow(id.toString(), false);
    });

  }

  /** Método para eliminar filas seleccionadas de la tabla de datos extranjeros */
  onEliminar(): void {
    if (!this.seletedccionadaSociaoAccionistasExtranjeros?.length) {
      return;
    }
    this.tipoEliminacion = 'EXTRANJERO';

    const IDS = this.seletedccionadaSociaoAccionistasExtranjeros
      .map(item => item.idRolePersona ?? item.id)
      .filter((id): id is string | number => id !== null && id !== undefined);
    if (!IDS.length) {
      return;
    }
    if (!this.confirmarEliminar) {
      this.abrirModalEliminar();
      return;
    }
    IDS.forEach(id => {
      this.eliminarTableRow(id.toString(), true);
    });
  }

  /**
   * Método para inicializar el estado del formulario.
   * Si el formulario es de solo lectura, se deshabilita.
   * De lo contrario, se habilita.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formularioEmpresa?.disable();
    }
  }

  eliminarTableRow(index: string, flag: boolean): void {
    this.registroComoEmpresa.elminarAccionista(index).subscribe({
      next: (response) => {
        if (response?.codigo === '00') {
          if (flag === true) {
            this.getSociosYAccionistasExtranjerosData()
            this.seletedccionadaSociaoAccionistasExtranjeros = [];
            this.esFormularioVisible = false;
            this.confirmarEliminar = false;

          }
          else if (flag === false) {
            this.getSociosYAaccionistasData();
             this.seletedccionadaSociaoAccionistas = [];
            this.esFormularioVisible = false;
            this.confirmarEliminar = false;
          }
        }
      }
    });
  }

  /** Método para establecer valores en el store de la solicitud */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud120603Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud120603Store[metodoNombre] as (value: string | number | null) => void)(VALOR);
  }

  /** Ayudante para guardar campos de formulario básicos para almacenar */
  private saveBasicFormFields(RAW: Record<string, string | null | undefined>): void {
    this.solicitud120603Store.setEstado(RAW['estado'] || '');
    this.solicitud120603Store.setRepresentacionFederal(RAW['representacionFederal'] || '');
    this.solicitud120603Store.setTipoEmpresa(RAW['tipoEmpresa'] || '');
    this.solicitud120603Store.setEspecifique(RAW['especifique'] || '');
    this.solicitud120603Store.setActividadEconomicaPreponderante(RAW['actividadEconomicaPreponderante'] || '');
    this.solicitud120603Store.setDescripcion(RAW['descripcion'] || '');
  }

  /** Helper to save persona fields to store */
  private savePersonaFields(RAW: Record<string, string | null | undefined>): void {
    this.solicitud120603Store.setNacionalidad(RAW['nacionalidad'] || '');
    this.solicitud120603Store.setRegistroFederal(RAW['registroFederal'] || '');
    this.solicitud120603Store.setTipoDePersona(RAW['tipoDePersona'] || '');
    this.solicitud120603Store.setNombre(RAW['nombre'] || '');
    this.solicitud120603Store.setApellidoPaterno(RAW['apellidoPaterno'] || '');
    this.solicitud120603Store.setTaxId(RAW['taxId'] || '');
    this.solicitud120603Store.setRazonSocial(RAW['razonSocial'] || '');
    this.solicitud120603Store.setDatosPais(RAW['datosPais'] || '');
    this.solicitud120603Store.setDatosCodigoPostal(RAW['datosCodigoPostal'] || '');
    this.solicitud120603Store.setDatosEstado(RAW['datosEstado'] || '');
    this.solicitud120603Store.setCorreoElectronico(RAW['correoElectronico'] || '');
  }

  /** Método para guardar todos los datos del formulario al store usando getRawValue */
  saveFormDataToStore(): void {
    const RAW = this.formularioEmpresa.getRawValue();
    
    // Guarde todos los valores del formulario para almacenar, incluidos los controles deshabilitados
    this.saveBasicFormFields(RAW);
    this.savePersonaFields(RAW);

    // Guardar datos de domicilio de controles deshabilitados
    const DOMICILIO_DATA = {
      pais: RAW['pais'] || '',
      codigoPostal: RAW['codigoPostal'] || '',
      estadoDomicilio: RAW['estadoDomicilio'] || '',
      municipioAlcaldia: RAW['municipioAlcaldia'] || '',
      localidad: RAW['localidad'] || '',
      colonia: RAW['colonia'] || '',
      calle: RAW['calle'] || '',
      numeroExterior: RAW['numeroExterior'] || '',
      numeroInterior: RAW['numeroInterior'] || '',
      lada: RAW['lada'] || '',
      telefono: RAW['telefono'] || '',
      cvepais: this.solicitud120603State?.domicilioDisabledForm?.['cvepais'] || 'MEX',
      cveColonia: this.solicitud120603State?.domicilioDisabledForm?.['cveColonia'] || '',
      cveEntidad: this.solicitud120603State?.domicilioDisabledForm?.['cveEntidad'] || ''
    };
    
    this.solicitud120603Store.setDomicilioDataToStore(DOMICILIO_DATA);
  }

  /** Método del ciclo de vida que limpia las suscripciones para evitar fugas de memoria */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}