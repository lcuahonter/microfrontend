import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  CAMPO_OBLIGATORIO_DESTINATARIO,
  PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE,
  STR_NACIONAL,
  TERCEROS_NACIONALIDAD_OPCIONES,
  TIPO_PERSONA_OPCIONES,
  TIPO_PERSONA_OPCIONES_NO_CONTRIBUYENTE
} from '../../constants/datos-solicitud.enum';
import { Catalogo, CategoriaMensaje, InputRadioComponent, Notificacion, NotificacionesComponent, REGEX_RFC_FISICA, REGEX_RFC_MORAL, TipoPersona, TituloComponent } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor
} from '../../models/terceros-relacionados.model';
import { Subject, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { GuardarDestinatarioPayloadFinal } from '../../models/guardar-payload.model';

/**
 * Componente para agregar un destinatario final (Destinatario) al formulario y almacenarlo.
 *
 * @example
 * <app-agregar-destinatario-final></app-agregar-destinatario-final>
 */
@Component({
  selector: 'app-agregar-destinatario-final',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    InputRadioComponent,
    TooltipModule,
    NotificacionesComponent
  ],
  templateUrl: './agregar-destinatario-final.component.html',
  styleUrl: './agregar-destinatario-final.component.scss',
})
export class AgregarDestinatarioFinalComponent
  implements OnDestroy, OnInit, OnChanges {

  /**
   * Referencia al enum TipoPersona expuesto al template.
   * Permite utilizar TipoPersona.MORAL o TipoPersona.FISICA directamente en el HTML
   * para realizar comparaciones o mostrar contenido condicional.
   */
  TipoPersona = TipoPersona;

  /**
   * Notificación actual del sistema.
   * Puede contener información de éxito, advertencia o error que se mostrará al usuario.
   * Si no hay notificación, será null.
   */
  nuevaNotificacion: Notificacion | null = null;

  /**
   * Subject utilizado para gestionar la desuscripción de observables.
   * Se completa en `ngOnDestroy()` para prevenir fugas de memoria.
   * @private
   */
  private destroyNotifier$ = new Subject<void>();

  /**
   * Grupo de formulario reactivo para recopilar los datos del destinatario final.
   */
  agregarDestinatarioFinal!: FormGroup;

  /**
   * Datos de catálogo de países para selectores del formulario.
   */
  public paisesDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de estados para selectores del formulario.
   */
  public estadosDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de municipios según el estado seleccionado.
   */
  public municipiosDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de localidades según el municipio seleccionado.
   */
  public localidadesDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de colonias según la localidad seleccionada.
   */
  public coloniasDatos: Catalogo[] = [];

  /**
   * Datos de catálogo de códigos postales según la localidad seleccionada.
   */
  public codigosPostalesDatos: Catalogo[] = [];

  /**
   * Arreglo que almacena la lista de destinatarios.
   */
  @Input() destinatarios: DestinoFinal[] = [];

  /**
   * Identificador del procedimiento asociado a este componente.
   */
  @Input() idProcedimiento!: number;

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados.
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Controla la visibilidad de los campos específicos para no contribuyentes.
   */
  public mostrarCamposNoContribuyente: boolean = false;

  /**
   * Controla la visibilidad de los campos específicos de CURP.
   */
  public esCURP = false;

  /**
   * Emite la lista de destinatarios actualizada para ser consumida por otros componentes.
   */
  @Output() updateDestinatarioFinalTablaDatos = new EventEmitter<DestinoFinal[]>();

  /**
   * Evento que se emite cuando el usuario desea cancelar una acción.
   */
  @Output() cancelarEventListener = new EventEmitter<boolean>();

  /**
   * Evento que se emite cuando el usuario desea cancelar una acción desde cancelación explícita.
   */
  @Output() cancelarEventListenerCancel = new EventEmitter<void>();

  /**
   * Constante que almacena el valor de "Nacional" para su uso en el formulario.
   */
  public nacionalStr = STR_NACIONAL;

  /**
   * Opciones de radio para seleccionar el tipo de persona.
   */
  tipoPersonaRadioOpciones = TIPO_PERSONA_OPCIONES;

  /**
   * Opciones de nacionalidad para el formulario.
   */
  tercerosNacionalidadOpciones = TERCEROS_NACIONALIDAD_OPCIONES;

  /**
   * Opciones de tipo de persona para radio buttons, específicas para no contribuyentes.
   */
  tipoPersonaRadioOpcionesNoContribuyente = TIPO_PERSONA_OPCIONES_NO_CONTRIBUYENTE;

  /**
   * Datos del formulario que pueden ser de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
   * Este input se utiliza para recibir la información necesaria desde el componente padre.
   */
  @Input() formaDatos!: DestinoFinal | Proveedor | null | undefined;

  /**
   * Indica si ciertos campos del formulario son obligatorios según el procedimiento.
   */
  public campoObligatorio = false;

  /**
   * Indica si el desplegable del país está deshabilitado.
   */
  estaDeshabilitadoDesplegable: boolean = true;

  /**
   * Constructor del componente.
   * Inicializa el formulario y suscriptores a cambios de estado del procedimiento.
   *
   * @param fb - FormBuilder para crear formularios reactivos
   * @param datosSolicitudService - Servicio para obtener catálogos y validar datos
   * @param consultaioQuery - Servicio para consultar el estado del trámite
   */
  constructor(
    private fb: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Determinar si se deben mostrar campos para no contribuyentes según el procedimiento
    this.mostrarCamposNoContribuyente =
      PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);

    // Suscribirse al estado de solo lectura del formulario
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$), // Evita fugas de memoria
        map((seccionState: { readonly: boolean }) => {
          // Actualizar flag de solo lectura y re-inicializar estado del formulario
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormaulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.crearFormaulario();
    if (this.esFormularioSoloLectura) {
      this.agregarDestinatarioFinal.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.agregarDestinatarioFinal.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }
  
  /**
   * Hook de ciclo de vida de Angular que se llama cuando se detectan cambios en las propiedades de entrada.
   * Llama al método `mostrarCamposNoContribuyente()`.
   */
  ngOnChanges(): void {
    this.mostrarCamposNoContribuyente =
      PROCEDIMIENTOS_PARA_NO_CONTRIBUYENTE.includes(this.idProcedimiento);
  }

  /**
   * Guarda un nuevo destinatario en el arreglo local `destinatarios`
   * y actualiza la información en el store. Finalmente, resetea el formulario
   * y navega hacia atrás en el historial.
   */
  guardarDestinatario(): Promise<boolean> {
    return new Promise((resolve) => {
      const FORM_VALUE = this.agregarDestinatarioFinal.getRawValue();
      if (this.agregarDestinatarioFinal.invalid) {
        this.agregarDestinatarioFinal.markAllAsTouched();
        return;
      }
      const pais = this.paisesDatos.find((pais: Catalogo) => pais.id === FORM_VALUE.pais);
      const estado = this.estadosDatos.find((estado: Catalogo) => estado.id === FORM_VALUE.estado);
      const municipio = this.municipiosDatos.find((municipio: Catalogo) => municipio.id === FORM_VALUE.municipio);
      const colonia = this.coloniasDatos.find((colonia: Catalogo) => colonia.id === FORM_VALUE.colonia);
      const localidad = this.localidadesDatos.find((localidad: Catalogo) => localidad.id === FORM_VALUE.localidad);
      
      const validationBody: GuardarDestinatarioPayloadFinal  = {
        nacionalidad: FORM_VALUE.nacionalidad?.toUpperCase() || '',
        tipo_persona: FORM_VALUE.tipoPersona?.toUpperCase() || '',
        rfc: null,
        curp: null,
        nombre: null,
        primer_apellido: null,
        segundo_apellido: null,
        razon_social: null,
        cve_pais: FORM_VALUE.pais,
        pais: pais?.descripcion,
        estado: estado?.descripcion,
        cve_estado: FORM_VALUE.estado || '09',
        cve_entidad_federativa: FORM_VALUE.cve_entidad_federativa || null,
        municipio: municipio?.descripcion,
        cve_municipio: FORM_VALUE.municipio || null,
        localidad: localidad?.descripcion,
        cve_localidad: FORM_VALUE.localidad || null,
        codigo_postal: FORM_VALUE.codigoPostal,
        colonia: colonia?.descripcion,
        cve_colonia: FORM_VALUE.colonia ? FORM_VALUE.colonia : null,
        calle: FORM_VALUE.calle,
        numero_exterior: FORM_VALUE.numeroExterior,
        numero_interior: FORM_VALUE.numeroInterior || null,
        lada: FORM_VALUE.lada,
        telefono: FORM_VALUE.telefono,
        correo_electronico: FORM_VALUE.correoElectronico
      };
      if (FORM_VALUE.nacionalidad === 'Mexicana' && FORM_VALUE.tipoPersona === TipoPersona.FISICA) {
        validationBody.rfc = FORM_VALUE.rfc;
        validationBody.curp = FORM_VALUE.curp;
        validationBody.nombre = FORM_VALUE.nombres;
        validationBody.primer_apellido = FORM_VALUE.primerApellido;
        validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
      }
      else if (FORM_VALUE.nacionalidad === 'Mexicana' && FORM_VALUE.tipoPersona === TipoPersona.MORAL) {
        validationBody.rfc = FORM_VALUE.rfc;
        validationBody.razon_social = FORM_VALUE.denominacionRazon || FORM_VALUE.razonSocial;
      }
      else if (FORM_VALUE.nacionalidad === 'Extranjero' && FORM_VALUE.tipoPersona === TipoPersona.FISICA) {
        validationBody.nombre = FORM_VALUE.nombres;
        validationBody.primer_apellido = FORM_VALUE.primerApellido;
        validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
        validationBody.estado = FORM_VALUE.estado;
        validationBody.cve_estado = FORM_VALUE.estado || '09';
      }
      else if (FORM_VALUE.nacionalidad === 'Extranjero' && FORM_VALUE.tipoPersona === TipoPersona.MORAL) {
        validationBody.nombre = FORM_VALUE.nombres;
        validationBody.primer_apellido = FORM_VALUE.primerApellido;
        validationBody.segundo_apellido = FORM_VALUE.segundoApellido;
        validationBody.razon_social = FORM_VALUE.denominacionRazon || FORM_VALUE.razonSocial;
        validationBody.estado = FORM_VALUE.estado;
        validationBody.cve_estado = FORM_VALUE.estado || '09';
      }
      this.datosSolicitudService.validarDestinatario(validationBody, this.idProcedimiento)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (res) => {
            if (res.codigo !== '00') {
              this.nuevaNotificacion = {
                tipoNotificacion: 'toastr',
                categoria: CategoriaMensaje.ERROR,
                modo: 'action',
                titulo: '',
                mensaje: res.error || 'Error al generar la cadena original.',
                cerrar: false,
                txtBtnAceptar: '',
                txtBtnCancelar: '',
              };
              return;
            } else {
              if (!FORM_VALUE.id) {
                FORM_VALUE.id = this.destinatarios.length > 0
                  ? Math.max(...this.destinatarios.map(d => Number(d.id))) + 1
                  : 1;
              }
              const EXISTING_INDEX = this.destinatarios.findIndex(
                d => d.id === FORM_VALUE.id
              );
              const NUEVO_DESTINATARIO: DestinoFinal = {
                id: FORM_VALUE.id,
                nombreRazonSocial: this.obtenerNombreRazonSocial(FORM_VALUE),
                rfc: FORM_VALUE.rfc,
                curp: FORM_VALUE.curp,
                telefono: `${FORM_VALUE.lada} ${FORM_VALUE.telefono}`.trim(),
                lada: FORM_VALUE.lada,
                correoElectronico: FORM_VALUE.correoElectronico,
                calle: FORM_VALUE.calle,
                numeroExterior: FORM_VALUE.numeroExterior,
                numeroInterior: FORM_VALUE.numeroInterior || '',
                cve_pais: FORM_VALUE.pais,
                pais: pais?.descripcion ?? '',
                cve_colonia: FORM_VALUE.colonia,
                colonia: colonia?.descripcion ?? '',
                municipioAlcaldia: municipio?.descripcion ?? '',
                cve_municipio: FORM_VALUE.municipio,
                localidad: localidad?.descripcion ?? '',
                cve_localidad: FORM_VALUE.localidad,
                entidadFederativa: '',
                estadoLocalidad: estado?.descripcion ?? FORM_VALUE.estado,
                codigoPostal: FORM_VALUE.codigoPostal,
                tipoPersona: FORM_VALUE.tipoPersona?.toUpperCase(),
                estado: estado?.descripcion ?? '',
                cve_estado: FORM_VALUE.estado,
                nacionalidad: FORM_VALUE.nacionalidad?.toUpperCase(),
                nombres: FORM_VALUE.nombres,
                primerApellido: FORM_VALUE.primerApellido,
                segundoApellido: FORM_VALUE.segundoApellido,
                denominacionRazon: FORM_VALUE.denominacionRazon || FORM_VALUE.razonSocial
              };

              if (EXISTING_INDEX !== -1) {
                this.destinatarios[EXISTING_INDEX] = NUEVO_DESTINATARIO;
              } else {
                this.destinatarios = [...this.destinatarios, NUEVO_DESTINATARIO];
              }
              this.updateDestinatarioFinalTablaDatos.emit(this.destinatarios);
              this.formaDatos = null;
              this.agregarDestinatarioFinal.reset();

            }
          },
          error: (err) => {
            const MENSAJE = err?.error?.error || 'Error inesperado al iniciar trámite.';
            this.nuevaNotificacion = {
              tipoNotificacion: 'toastr',
              categoria: CategoriaMensaje.ERROR,
              modo: 'action',
              titulo: '',
              mensaje: MENSAJE,
              cerrar: false,
              txtBtnAceptar: '',
              txtBtnCancelar: '',
            }
          },
        });
    })
  }

   /**
   * Construye el nombre o razón social
   */
  private obtenerNombreRazonSocial(formValue: Proveedor): string {
    if (formValue.tipoPersona === TipoPersona.FISICA) {
      return `${formValue.nombres || ''} ${formValue.primerApellido || ''} ${formValue.segundoApellido || ''}`.trim();
    }

    if (formValue.tipoPersona === TipoPersona.MORAL) {
      return this.agregarDestinatarioFinal.get('denominacionRazon')?.value || '';
    }

    return '';
  }

  /**
 * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
 * Configura el formulario y carga los catálogos iniciales necesarios.
 */
  ngOnInit(): void {
    this.crearFormaulario();
    this.campoObligatorio = CAMPO_OBLIGATORIO_DESTINATARIO.includes(
      this.idProcedimiento
    );
    this.getCatalogoPaises();
    

  this.agregarDestinatarioFinal
    .get('municipio')
    ?.valueChanges.pipe(
      takeUntil(this.destroyNotifier$),
      distinctUntilChanged()
    )
    .subscribe((municipioId) => {
      if (municipioId) {
        this.cargarDatos(municipioId);
      }
    });
  }

  /**
   * Crea el formulario reactivo `agregarDestinatarioFinal` utilizando `FormBuilder`.
   * Define los campos y sus validaciones.
   *
   */
  crearFormaulario(): void {
    this.agregarDestinatarioFinal = this.fb.group({
      tipoPersona: ['', Validators.required],
      rfc: [
        null,
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
        ],
      ],
      curp: [null],
      nombres: ['', [Validators.required, Validators.maxLength(200)]],
      denominacionRazon: ['', [Validators.required, Validators.maxLength(254)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(200)]],
      segundoApellido: ['', Validators.maxLength(200)],
      pais: [{ value: '', disabled: true }, Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(255)]],
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      colonia: ['', [Validators.required, Validators.maxLength(120)]],
      calle: ['', [Validators.required, Validators.maxLength(300)]],
      numeroExterior: ['', [Validators.required, Validators.maxLength(55)]],
      numeroInterior: ['', [Validators.required, Validators.maxLength(55)]],
      lada: ['', [Validators.required, Validators.maxLength(30)]],
      telefono: ['', [Validators.required, Validators.maxLength(30)]],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
      nacionalidad: ['', Validators.required],
    });
    this.agregarDestinatarioFinal.disable();
    this.agregarDestinatarioFinal.get('nacionalidad')?.enable();
    this.agregarDestinatarioFinal.get('tipoPersona')?.disable();
    if (this.formaDatos) {
      this.agregarDestinatarioFinal.enable();
      this.agregarDestinatarioFinal.patchValue(this.formaDatos);
    }
  }

  /**
   * @method campoObligatorioChange
   * @description Cambia las validaciones de los campos del formulario según el valor de `campoObligatorio`.
   * Si `campoObligatorio` es verdadero, se eliminan las validaciones de la colonia y se agregan
   * validaciones requeridas para la calle y el número exterior. Si es falso, se realiza lo contrario.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  campoObligatorioChange(): void {
    const COLONIA = this.agregarDestinatarioFinal.get('colonia');
    const CALLE = this.agregarDestinatarioFinal.get('calle');
    const NUMEROEXTERIOR = this.agregarDestinatarioFinal.get('numeroExterior');
    if (this.campoObligatorio) {
      COLONIA?.clearValidators();
      CALLE?.setValidators([Validators.required]);
      NUMEROEXTERIOR?.setValidators([Validators.required]);
    } else {
      COLONIA?.setValidators([Validators.required]);
      CALLE?.clearValidators();
      NUMEROEXTERIOR?.clearValidators();
    }
    COLONIA?.updateValueAndValidity();
    CALLE?.updateValueAndValidity();
    NUMEROEXTERIOR?.updateValueAndValidity();
  }

  /**
 * Obtiene el catálogo de países desde el servicio correspondiente.
 * La información recibida se transforma al formato { id, descripcion }
 * y se almacena en `paisesDatos` para su uso en los selectores del formulario.
 */
  getCatalogoPaises(): void {
    this.datosSolicitudService
      .obtenerListaPaises(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.paisesDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Obtiene la lista de estados asociados al procedimiento actual.
   * Los datos se transforman al formato { id, descripcion }
   * y se asignan a `estadosDatos` para poblar el selector de estados.
   */
  getLocalidad(): void {
    this.datosSolicitudService
      .obtenerListaEstados(this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.estadosDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Obtiene la lista de municipios según el estado seleccionado.
   * Los datos recibidos se convierten al formato { id, descripcion }
   * y se almacenan en `municipiosDatos` para su despliegue en el formulario.
   */
  getListaMunicipios(): void {
    this.datosSolicitudService
      .obtenerListaMunicipios(
        this.agregarDestinatarioFinal.get('estado')?.value,
        this.idProcedimiento
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.municipiosDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
   * Carga los datos dependientes del municipio seleccionado.
   * Obtiene las localidades, códigos postales y colonias asociados al valor recibido.
   * Cada lista es transformada al formato { id, descripcion } y asignada a su
   * correspondiente propiedad del componente.
   *
   * @param value - Identificador del municipio seleccionado.
   */
  cargarDatos(value: number): void {
    this.datosSolicitudService
      .obtenerListaLocalidades(value, this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.localidadesDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });

    this.datosSolicitudService
      .obtenerListaColonias(value, this.idProcedimiento)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.coloniasDatos = data.datos.map((item: Catalogo) => ({
          id: item.clave,
          descripcion: item.descripcion
        }));
      });
  }

  /**
 * Maneja el cambio de localidad seleccionada.
 * Actualiza el formulario con el ID de la localidad y extrae el
 * código postal desde la descripción (formato esperado: "xxxx CP yyyy").
 * El código postal obtenido se asigna automáticamente al campo correspondiente.
 *
 * @param event - Objeto de tipo `Catalogo` que representa la localidad seleccionada.
 */
  onLocalidadChange(event: Catalogo): void {
    if (!event) return;
    this.agregarDestinatarioFinal.get('localidad')?.setValue(event.id);
    const postalCode = event.descripcion.split("CP ")[1];
    this.agregarDestinatarioFinal.get('codigoPostal')?.setValue(postalCode);
  }

  /**
   * @method limpiarFormulario
   * @description Resetea el formulario reactivo `agregarProveedorForm` para limpiar todos los campos.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  limpiarFormulario(): void {
    this.agregarDestinatarioFinal.reset();
    this.agregarDestinatarioFinal.disable();
    this.agregarDestinatarioFinal.get('tipoPersona')?.enable();
    this.agregarDestinatarioFinal.get('nacionalidad')?.enable();
  }

  /**
   * @method cancelar
   * @description Navega hacia la vista anterior utilizando el servicio de ubicación (`Location`).
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  cancelar(): void {
    this.formaDatos = null;
    this.cancelarEventListenerCancel.emit();
    this.cancelarEventListener.emit(true);
  }

  /**
   * * Método que se ejecuta cuando se selecciona un país en el formulario.
   * * @param {string} event - El país seleccionado.
   * * @returns {void} No retorna ningún valor.
   */
  tipoPersonaCambioDeValor(event: string | number): void {
    this.agregarDestinatarioFinal.patchValue({
      tipoPersona: event
    });
    this.changeTipoPersona();
  }

  /**
   * * Método que se ejecuta cuando se selecciona un país en el formulario.
   * * @param {string} event - El país seleccionado.
   * * @returns {void} No retorna ningún valor.
   */
  terecerosNacionalidadCambioDeValor(event: string | number): void {
    this.agregarDestinatarioFinal.patchValue({
      nacionalidad: event,
      tipoPersona: null,
      pais: null
    });
    if (event !== 'Mexicana') {
      this.municipiosDatos = [];
    }
    this.changeNacionalidad();
  }

  /**
   * Validador personalizado para RFC según el tipo de persona (Física o Moral).
   *
   * @param TIPO_PERSONA El tipo de persona para el cual se debe validar el RFC.
   * @returns Una función validadora que verifica si el valor cumple con el formato RFC correspondiente.
   *          Si el valor es inválido, retorna un objeto con la clave de error específica.
   *          Si el tipo de persona es desconocido o el valor está vacío, retorna null.
   */
  static rfcFisicaValidator(
    TIPO_PERSONA: TipoPersona
  ): (CONTROL: AbstractControl) => ValidationErrors | null {
    return (CONTROL: AbstractControl): ValidationErrors | null => {
      const VALUE = CONTROL?.value;

      if (!VALUE) {
        return null;
      }

      let REGEX;
      let ERROR_KEY;

      if (TIPO_PERSONA === TipoPersona.FISICA) {
        REGEX = REGEX_RFC_FISICA;
        ERROR_KEY = { INVALID_RFC_FISICA: true };
      } else if (TIPO_PERSONA === TipoPersona.MORAL) {
        REGEX = REGEX_RFC_MORAL;
        ERROR_KEY = { INVALID_RFC_MORAL: true };
      } else {
        return null;
      }

      return REGEX.test(VALUE) ? null : ERROR_KEY;
    };
  }

  /**
 * Habilita o deshabilita los controles del formulario según el estado de los campos
 * 'nacionalidad' y 'tipoPersona'. Si ambos están vacíos o indefinidos, deshabilita
 * todos los controles excepto estos dos. Si alguno tiene valor, habilita todos los controles.
 *
 * @returns {void} Este método no retorna ningún valor.
 */
  changeNacionalidad(): void {
    const NACIONALIDAD = this.agregarDestinatarioFinal.get('nacionalidad')?.value;
    const PAIS_CTRL = this.agregarDestinatarioFinal.get('pais');
    this.agregarDestinatarioFinal.enable({ emitEvent: false });
    this.agregarDestinatarioFinal.get('tipoPersona')?.enable({ emitEvent: false });
    if (NACIONALIDAD === 'Mexicana') {
      PAIS_CTRL?.setValue('MEX', { emitEvent: false });
      PAIS_CTRL?.clearValidators();
      PAIS_CTRL?.disable({ emitEvent: false });
      this.estaDeshabilitadoDesplegable = true;
    } else {
      PAIS_CTRL?.setValue(null, { emitEvent: false });
      PAIS_CTRL?.setValidators([Validators.required]);
      PAIS_CTRL?.enable({ emitEvent: false });
      this.estaDeshabilitadoDesplegable = false;
    }

    PAIS_CTRL?.updateValueAndValidity({ emitEvent: false });
    this.mostrarCamposNoContribuyente = NACIONALIDAD === 'Extranjero';
  }

  /**
 * Cambia el tipo de persona y actualiza los controles del formulario en consecuencia.
 * Ajusta las validaciones y habilitaciones de los campos según:
 * - La nacionalidad seleccionada (Mexicana o Extranjero)
 * - El tipo de persona (Física, Moral o No Contribuyente)
 *
 * @returns {void} Este método no retorna ningún valor.
 */
  changeTipoPersona(): void {
    const NACIONALIDAD = this.agregarDestinatarioFinal.get('nacionalidad')?.value;
    const TIPO_PERSONA = this.agregarDestinatarioFinal.get('tipoPersona')?.value;

    const RFC_CTRL = this.agregarDestinatarioFinal.get('rfc');
    const CURP_CTRL = this.agregarDestinatarioFinal.get('curp');
    const PAIS_CTRL = this.agregarDestinatarioFinal.get('pais');
    const DENOMINACION_CTRL = this.agregarDestinatarioFinal.get('denominacionRazon');
    const NUMBERS_CTRL = this.agregarDestinatarioFinal.get('nombres');
    const PRIMERAPELLIDO_CTRL = this.agregarDestinatarioFinal.get('primerApellido');
    const SEGUNDOAPELLIDO_CTRL = this.agregarDestinatarioFinal.get('segundoApellido');
    const MUNICIPIO_CTRL = this.agregarDestinatarioFinal.get('municipio');
    const LOCALIDAD_CTRL = this.agregarDestinatarioFinal.get('localidad');
    const COLONIA_CTRL = this.agregarDestinatarioFinal.get('colonia');

    const IS_EXTRANJERO = NACIONALIDAD === 'Extranjero';
    const IS_MEXICAN_FISICA_MORAL =
      NACIONALIDAD === 'Mexicana' &&
      (TIPO_PERSONA === TipoPersona.FISICA || TIPO_PERSONA === TipoPersona.MORAL);

    if (TIPO_PERSONA === TipoPersona.MORAL) {
      CURP_CTRL?.clearValidators();
      NUMBERS_CTRL?.clearValidators();
      PRIMERAPELLIDO_CTRL?.clearValidators();
      SEGUNDOAPELLIDO_CTRL?.clearValidators();
      CURP_CTRL?.updateValueAndValidity({ emitEvent: false });
      NUMBERS_CTRL?.updateValueAndValidity({ emitEvent: false });
      PRIMERAPELLIDO_CTRL?.updateValueAndValidity({ emitEvent: false });
      SEGUNDOAPELLIDO_CTRL?.updateValueAndValidity({ emitEvent: false });
    }

    if (RFC_CTRL) {
      if (IS_EXTRANJERO) {
        RFC_CTRL.clearValidators();
      } else {
        RFC_CTRL.setValidators([
          Validators.required,
          AgregarDestinatarioFinalComponent.rfcFisicaValidator(TIPO_PERSONA),
        ]);
      }
      RFC_CTRL.updateValueAndValidity({ emitEvent: false });
    }

    if (DENOMINACION_CTRL) {
      if (TIPO_PERSONA === TipoPersona.MORAL) {
        DENOMINACION_CTRL.setValidators([Validators.required]);
      } else {
        DENOMINACION_CTRL.clearValidators();
      }
      DENOMINACION_CTRL.updateValueAndValidity({ emitEvent: false });
    }

    if (IS_EXTRANJERO) {
      MUNICIPIO_CTRL?.clearValidators();
      LOCALIDAD_CTRL?.clearValidators();
      COLONIA_CTRL?.clearValidators();
    } else {
      COLONIA_CTRL?.setValidators([Validators.required]);
      MUNICIPIO_CTRL?.setValidators([Validators.required]);
      LOCALIDAD_CTRL?.setValidators([Validators.required]);
    }
    MUNICIPIO_CTRL?.updateValueAndValidity({ emitEvent: false });
    LOCALIDAD_CTRL?.updateValueAndValidity({ emitEvent: false });
    COLONIA_CTRL?.updateValueAndValidity({ emitEvent: false });

    if (IS_MEXICAN_FISICA_MORAL) {
      this.getLocalidad();
      this.municipiosDatos = [];
      this.agregarDestinatarioFinal
        .get('estado')
        ?.valueChanges.pipe(
          takeUntil(this.destroyNotifier$),
          distinctUntilChanged()
        )
        .subscribe((estado) => {

          if (estado) {
            this.getListaMunicipios();
          } else {
            this.municipiosDatos = [];
          }
        });
      PAIS_CTRL?.setValue('MEX', { emitEvent: false });
      PAIS_CTRL?.clearValidators();
      PAIS_CTRL?.disable({ emitEvent: false });
      this.estaDeshabilitadoDesplegable = true;
    } else {
      PAIS_CTRL?.setValidators([Validators.required]);
      PAIS_CTRL?.enable({ emitEvent: false });
      this.estaDeshabilitadoDesplegable = false;
    }
    PAIS_CTRL?.updateValueAndValidity({ emitEvent: false });

    if (TIPO_PERSONA === TipoPersona.NO_CONTRIBUYENTE) {
      RFC_CTRL?.disable({ emitEvent: false });
    } else {
      CURP_CTRL?.disable({ emitEvent: false });
    }
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
