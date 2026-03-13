import {
  AvisoCatalogo,
  AvisoOpcionesDeRadio,
  OperacionDeImportacion,
  Solicitante
} from '../../models/aviso-catalogo.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  COLONIA, DELEGACION_MUNICIPIO,
  ENTIDAD_FEDERATIVA, FECHA_INGRESO,
  FRACCION_ARANCELARIA, ADUANAS_ACTIVAS
} from '../../enums/solicitud32501.enum';
import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionColumna,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  REGEX_SOLO_NUMEROS,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32501State, Solicitud32501Store } from '../../estados/solicitud32501.store';
import { Subject, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs';
import { CategoriaMensaje } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery, SolicitanteState, SolicitanteQuery} from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';
import { Modal } from 'bootstrap';
import { ModalOperacionComponent } from '../modal-operacion/modal-operacion.component';
import { Notificacion } from '@ng-mf/data-access-user';
import { NotificacionesComponent } from '@ng-mf/data-access-user';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/solicitud32501.enum';
import { Solicitud32501Query } from '../../estados/solicitud32501.query';
import { TipoNotificacionEnum } from '@ng-mf/data-access-user';



/**
 * Componente `DatosSolicitudComponent` que gestiona la lógica y la interfaz de usuario
 * para la sección de datos de solicitud en el trámite 32501.
 *
 */
@Component({
  selector: 'app-datos-solicitud',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CatalogoSelectComponent,
    CommonModule,
    FormsModule,
    HttpClientModule,
    InputFechaComponent,
    TituloComponent,
    TablaDinamicaComponent,
    ModalOperacionComponent,
    InputRadioComponent,
    NotificacionesComponent
  ],
  providers: [MercanciasDesmontadasOSinMontarService, BsModalService],
  templateUrl: './datos-solicitud.component.html',
  styleUrl: './datos-solicitud.component.scss',
})
/**
 * Componente `DatosSolicitudComponent` que gestiona la lógica y la interfaz de usuario
 * para la sección de datos de solicitud en el trámite 32501.
 *
 */
export class DatosSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esSoloLectura!: boolean;
  /**
   * Formulario para la gestión de avisos.
   */
  formAviso!: FormGroup;



  /**
    * Opciones de botón de radio.
    */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  showSuccessModal: boolean = false;



  /**
   * Opciones de radio para el tipo de aviso.
   */
  avisoOpcionesDeRadio: AvisoOpcionesDeRadio = {} as AvisoOpcionesDeRadio;

  /**
   * Tipo de aviso seleccionado.
   */
  tipoAviso: string | number = 'por defecto';

  /**
   * Opción seleccionada para Fracción Arancelaria.
   */
  opcionFraccionArancelaria: CatalogosSelect = FRACCION_ARANCELARIA;

  /**
   * Opción seleccionada para Entidad Federativa.
   */
  opcionEntidadFederativa: CatalogosSelect = ENTIDAD_FEDERATIVA;

  /**
   * Opción seleccionada para Delegación o Municipio.
   */
  opcionDelegacionMunicipio: CatalogosSelect = DELEGACION_MUNICIPIO;

  /**
   * Opción seleccionada para Colonia.
   */
  opcionColonia: CatalogosSelect = COLONIA;

  /**
   * Observable para manejar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Referencia al modal para agregar mercancías.
   */
  @ViewChild('modalAgregarMercancias') modalElement!: ElementRef;

  /**
   * Fecha de inicio predefinida.
   */
  public fechaInicioInput: InputFecha = FECHA_INGRESO;

  /**
   * Tipo de selección de la tabla.
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Mensaje que se muestra en los modales de selección.
   * Contiene texto dinámico para diferentes estados de validación.
   */
  mensajeSeleccion: string = '';

  /**
   * Transportista actualmente seleccionado en la tabla.
   * Se utiliza para operaciones de edición y eliminación.
   */
  selectedOperacionDeImportacion: OperacionDeImportacion | null = null;

  /**
   * Referencia al modal principal para abrir/cerrar transportistas.
   * Se utiliza para gestionar el estado del modal de Bootstrap.
   */
  modalRefabir?: BsModalRef;

  /**
   * Instancia del modal para gestionar archivos.
   *
   * Se utiliza para abrir o cerrar el modal de archivos.
   */
  modalInstances: Modal | null = null;

  /**
   * Referencia al template del modal de selección requerida.
   * Se muestra cuando se requiere seleccionar un elemento de la tabla.
   */
  @ViewChild('templateSeleccionRequerida') templateSeleccionRequerida!: TemplateRef<void>;

  /**
   * Referencia al template del modal de confirmación de eliminación.
   * Template para confirmar la eliminación de transportistas.
   */
  @ViewChild('templateConfirmacionEliminacion') templateConfirmacionEliminacion!: TemplateRef<void>;

  /**
   * Configuración de las columnas para la tabla de operaciones de importación.
   */
  configuracionColumnas: ConfiguracionColumna<OperacionDeImportacion>[] = [
    {
      encabezado: 'Patente o autorización del agente aduanal',
      clave: (item: OperacionDeImportacion) => item.patente_autorizacion,
      orden: 1,
    },
    {
      encabezado: 'RFC del agente aduanal',
      clave: (item: OperacionDeImportacion) => item.rfc,
      orden: 2,
    },
    {
      encabezado: 'Número de pedimento',
      clave: (item: OperacionDeImportacion) => item.pedimento,
      orden: 3,
    },
    {
      encabezado: 'Aduana de importación',
      clave: (item: OperacionDeImportacion) => item.aduana_desc,
      orden: 4,
    },
  ];

  /**
   * Lista de operaciones de importación.
   */
  operacionDeImportacionLista: OperacionDeImportacion[] =
    [] as OperacionDeImportacion[];

  /**
   * Estado de la solicitud 32501.
   */
  solicitud32501State: Solicitud32501State = {} as Solicitud32501State;
  /**
  * Formulario para los datos de la operación de importación.
  */
  frmDatosOperacionImp!: FormGroup;

  /**
   * Opción seleccionada de aduana.
   */
  opcionAduana: CatalogosSelect = ADUANAS_ACTIVAS;

  desc_aduana?: string;
  /**
  * Referencia al botón para cerrar el modal.
  *
  * Se utiliza para cerrar el modal de manera programada.
  */
  @ViewChild('closeModal') closeModal!: ElementRef;

  modalOperacionModo: 'agregar' | 'modificar' = 'agregar';


  /**
     * Indica si el formulario es válido.
     */
  esValidoForma: boolean = false;
  /**
   * Indica si se debe eliminar un registro.
   */
  esEliminar: boolean = false;
  /**
   * Indica si el formulario ha sido enviado.
   * Se utiliza para controlar la validación y el estado del formulario.
   */

  noRowSelected: boolean = false;

  /**
    * @public
    * @property {Notificacion} nuevaNotificacion
    * @description Representa una nueva notificación que se utilizará en el componente.
    * @command Este campo debe ser inicializado antes de su uso.
    */
  public nuevaNotificacion!: Notificacion;

  /** validacion inexistente */
  idVucemInvalido: boolean = false;

  /** validacion ocupado */
  idVucemOcupado: boolean = false;

  solicitanteState!:SolicitanteState;

  /**
   * Constructor de la clase `DatosSolicitudComponent`.
   *
   * @param fb - Servicio de `FormBuilder` para la creación y gestión de formularios reactivos.
   * @param MercanciasDesmontadasOSinMontarService - Servicio para manejar operaciones relacionadas con mercancías desmanteladas sin monitoreo.
   * @param solicitud32501Query - Servicio para realizar consultas relacionadas con la solicitud 32501.
   * @param solicitud32501Store - Almacén para gestionar el estado de la solicitud 32501.
   * @param consultaQuery - Servicio para realizar consultas relacionadas con la consulta de IO.
   *
   * Este constructor inicializa el componente obteniendo el aviso del catálogo
   * y la operación de importación mediante las funciones `obtenerAvisoDelCatalogo`
   * y `obtenerOperacionDeImportacion`.
   */
  constructor(
    public fb: FormBuilder,
    public mercanciasDesmontadasOSinMontarService: MercanciasDesmontadasOSinMontarService,
    public solicitud32501Query: Solicitud32501Query,
    public solicitud32501Store: Solicitud32501Store,
    private consultaQuery: ConsultaioQuery,
    private modalService: BsModalService,
    private solicitanteQuery: SolicitanteQuery
  ) {
    this.obtenerAvisoDelCatalogoModal();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Configura el formulario `formAviso` con los valores iniciales y validaciones necesarias
   *   basadas en el estado `solicitud32501State`.
   * - Suscribe al observable `seleccionarSolicitud$` para actualizar el estado del formulario
   *   cuando se reciben nuevos datos de la solicitud.
   * - Utiliza `takeUntil` para gestionar la desuscripción automática cuando el componente
   *   se destruye, evitando fugas de memoria.
   */
  ngOnInit(): void {
    this.solicitud32501Store.reset();
    this.obtenerValoresDelStore();
    this.inicializarFormulario();
    this.obtenerFraccionesArancelariasCatalogo();
    this.obtenerEntidadFederativaCatalogo();
    this.obtenerAvisoOpcionesDeRadio();
       
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((estadoSeccion) => {
        this.esSoloLectura = estadoSeccion.readonly;
        
        this.habilitarDeshabilitarFormulario();
      });

    this.frmDatosOperacionImp = this.fb.group({
      patente: [this.solicitud32501State.patente, [Validators.required, Validators.maxLength(4)]],
      rfc: [this.solicitud32501State.rfc, [Validators.required, Validators.maxLength(13)]],
      pedimento: [this.solicitud32501State.pedimento, [Validators.required, Validators.maxLength(7)]],
      aduana: [this.solicitud32501State.aduana, [Validators.required]],
    });

    this.solicitud32501Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud32501State) => {
          this.solicitud32501State = respuesta;

        })
      )
      .subscribe();

      this.formAviso.get('idTransaccionVU')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap((valorTransaccionVU: string) => {
          if(this.formAviso.get('idTransaccionVU')?.valid) {
            this.idVucemInvalido = false;
            this.idVucemOcupado = false;
            return this.mercanciasDesmontadasOSinMontarService.estatusTramiteMontaje(valorTransaccionVU);
          }
          return 'Error';
        })
      ).subscribe(
        (response) => {
          
          if(response === 'inexistente'){
            this.idVucemInvalido = true;
          }
          if(response === 'ocupado'){
            this.idVucemOcupado = true;
          } 
        }
      );

    this.onChangesOperacion();
  }

  /**
   * Método para obtener las fracciones arancelarias requeridas para el trámite.
   */
  obtenerFraccionesArancelariasCatalogo(): void {

    this.mercanciasDesmontadasOSinMontarService.obtenerFraccionesArancelarias()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catFA => catFA.datos)
      ).subscribe(
        datoFA => {
          this.opcionFraccionArancelaria.catalogos = datoFA;
        }
      );
  }

  /**
   * Método para obtener las entidades federativas.
   */
  obtenerEntidadFederativaCatalogo(): void {

    this.mercanciasDesmontadasOSinMontarService.obtenerEntidadesFederativas()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catEF => catEF.datos)
      ).subscribe(
        datoEF => {
          this.opcionEntidadFederativa.catalogos = datoEF;
        }
      );
  }

  /**
   * Método para solicitar los municipios.
   * @param clave Clave de la entidad federativa.
   */
  obtenerMunicipiosCatalogo(clave: string): void {

    this.mercanciasDesmontadasOSinMontarService.obtenerMunicipios(clave)
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catDM => catDM.datos)
      ).subscribe(
        datoDM => {
          this.opcionDelegacionMunicipio.catalogos = datoDM;
        }
      );
  }

  /**
   * Método para solicitar las colonias.
   * @param clave Clave del municipio.
   */
  obtenerColoniasCatalogo(clave: string): void {

    this.mercanciasDesmontadasOSinMontarService.obtenerColonias(clave)
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catColonias => catColonias.datos)
      ).subscribe(
        datoCol => {
          this.opcionColonia.catalogos = datoCol;
        }
      );
  }

  obtenerAduanasActivas(): void {

    this.mercanciasDesmontadasOSinMontarService.obtenerAduanas()
      .pipe(takeUntil(this.destroyed$))
      .pipe(
        map(catAduanas => catAduanas.datos)
      ).subscribe(
        datoAduana => {
          this.opcionAduana.catalogos = datoAduana;
        }
      );
  }

  /**
   * Inicializa el formulario `formAviso` con los controles y validaciones necesarios.
   * Utiliza el `FormBuilder` para crear un grupo de controles con valores iniciales
   * basados en el estado actual de la solicitud (`solicitud32501State`).
   * Cada control tiene sus respectivas validaciones, como requerimientos y patrones.
   */

  inicializarFormulario(): void {
    this.formAviso = this.fb.group({
      adace: [{ value: this.solicitud32501State?.adace, disabled: true }],
      fechaIniExposicion: [
        { value: this.solicitud32501State?.fechaIniExposicion, disabled: true },
        Validators.required,
      ],
      ideGenerica1: [
        this.solicitud32501State?.ideGenerica1,
        [Validators.required],
      ],
      idTransaccionVU: [
        this.solicitud32501State?.idTransaccionVU,
        [Validators.maxLength(25), Validators.minLength(25), Validators.pattern(REGEX_SOLO_NUMEROS),],
      ],
      cveFraccionArancelaria: [
        this.solicitud32501State?.cveFraccionArancelaria,
        Validators.required,
      ],
      nico: [
        this.solicitud32501State?.nico,
        [
          Validators.required,
          Validators.pattern(REGEX_SOLO_NUMEROS),
          Validators.maxLength(2),
          Validators.minLength(2),
        ],
      ],
      peso: [
        this.solicitud32501State?.peso,
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
          Validators.maxLength(16),
          Validators.max(9999999999999.99),
          Validators.min(0.01),
        ],
      ],
      valorUSD: [
        this.solicitud32501State?.valorUSD,
        [
          Validators.required,
          Validators.pattern(/^(?:\d+(\.\d{1,2})?)$/),
          Validators.maxLength(15),
          Validators.max(9999999999999.99),
          Validators.min(0.01),
        ],
      ],
      descripcionMercancia: [
        this.solicitud32501State?.descripcionMercancia,
        [Validators.required, Validators.maxLength(250)],
      ],
      nombreComercial: [
        this.solicitud32501State?.nombreComercial,
        [Validators.maxLength(250)],
      ],
      entidadFederativa: [
        this.solicitud32501State?.entidadFederativa,
        Validators.required,
      ],
      delegacionMunicipio: [
        this.solicitud32501State?.delegacionMunicipio,
        Validators.required,
      ],
      colonia: [this.solicitud32501State?.colonia, [Validators.required]],
      calle: [
        this.solicitud32501State?.calle,
        [Validators.required, Validators.maxLength(250)],
      ],
      numeroExterior: [
        this.solicitud32501State?.numeroExterior,
        [Validators.required, Validators.maxLength(15)],
      ],
      numeroInterior: [
        this.solicitud32501State?.numeroInterior,
        [Validators.maxLength(15)],
      ],
      codigoPostal: [
        this.solicitud32501State?.codigoPostal,
        [
          Validators.required,
          Validators.pattern(REGEX_SOLO_NUMEROS),
          Validators.maxLength(5),
        ],
      ],
      serviciosTerceros: [this.solicitud32501State?.serviciosTerceros],

    });
  }


  soloNumeros(event: Event): void {
    const INPUT = event.target as HTMLInputElement | null;
    if (INPUT) {
      INPUT.value = INPUT.value.replace(/[^0-9]/g, '');
      const VAL = this.formAviso.get('nico')?.value;
    }
  }

  soloNumerosDecimal(event: Event): void {
    const INPUT = event.target as HTMLInputElement | null;
    if (INPUT) {
      const VALOR = INPUT.value.replace(/[^0-9.]/g, '');
      const VALOR_ENTERO = VALOR.replace(/(\..*)\./g, '$1');

      const endsWithDecimal = VALOR_ENTERO.endsWith('.');

      var VALUE = VALOR_ENTERO.replace(/^(\d*)(\.?\d{0,2}).*$/, '$1$2');
      if (endsWithDecimal && !VALUE.includes('.')) {
        VALUE = VALUE + '.';
      } else if (endsWithDecimal && !VALUE.endsWith('.')) {
        VALUE = VALUE.replace(/\.$/, '');
        VALUE = VALUE + '.';
      }

      this.formAviso.get('valorUSD')?.setValue(VALUE, { emitEvent: false });
    }
  }

  /**
   * Habilita o deshabilita los campos del formulario según el modo de solo lectura.
   * Si `esSoloLectura` es verdadero, deshabilita los controles especificados.
   * Si es falso, los habilita para permitir la edición.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.formAviso.get('ideGenerica1')?.disable();
      this.formAviso.get('idTransaccionVU')?.disable();
      this.formAviso.get('nico')?.disable();
      this.formAviso.get('peso')?.disable();
      this.formAviso.get('valorUSD')?.disable();
      this.formAviso.get('descripcionMercancia')?.disable();
      this.formAviso.get('nombreComercial')?.disable();
      this.formAviso.get('calle')?.disable();
      this.formAviso.get('numeroExterior')?.disable();
      this.formAviso.get('numeroInterior')?.disable();
      this.formAviso.get('codigoPostal')?.disable();
    } else {
      this.formAviso.get('ideGenerica1')?.enable();
      this.formAviso.get('idTransaccionVU')?.enable();
      this.formAviso.get('nico')?.enable();
      this.formAviso.get('peso')?.enable();
      this.formAviso.get('valorUSD')?.enable();
      this.formAviso.get('descripcionMercancia')?.enable();
      this.formAviso.get('nombreComercial')?.enable();
      this.formAviso.get('calle')?.enable();
      this.formAviso.get('numeroExterior')?.enable();
      this.formAviso.get('numeroInterior')?.enable();
      this.formAviso.get('codigoPostal')?.enable();
    }
  }
  /**
   * Obtiene los valores del store `solicitud32501Query` y actualiza el estado
   * `solicitud32501State` con la respuesta obtenida.
   *
   * Utiliza el operador `takeUntil` para asegurarse de que la suscripción se cancele
   * cuando el componente sea destruido, evitando fugas de memoria.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  obtenerValoresDelStore(): void {
    this.solicitud32501Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud32501State) => {
          this.tipoAviso = respuesta.ideGenerica1;
          this.solicitud32501State = respuesta;
        })
      )
      .subscribe();

    this.solicitanteQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: SolicitanteState) => {
          this.solicitanteState = respuesta;
          this.solicitud32501Store.update(
            {
              solicitante: this.getSolicitante()
            }
          );
        })
      )
      .subscribe();
  }

  /**
   * Setea los valores de solicitante al storage
   * @returns {Solicitante} Este método no retorna ningún valor.
   */
  getSolicitante(): Solicitante {

    return {
      rfc: this.solicitanteState.rfc_original,
      denominacion: this.solicitanteState.nombre,
      actividadEconomica: '',
      correoElectronico: '',
      pais: '',
      codigoPostal: '',
      entidadFederativa: '',
      cveEntidadFederativa: '',
      municipio: '',
      localidad: '',
      colonia: '',
      calle: '',
      nExt: '',
      nInt: '',
      lada: '',
      telefono: '', 
      adace: '',
      tipoPersona: ''
    }

  }

  /**
   * Obtiene un aviso del catálogo utilizando el servicio `mercanciasDesmontadasOSinMontarService`.
   * Se suscribe al observable y actualiza las opciones relacionadas con la fracción arancelaria,
   * entidad federativa, delegación/municipio y colonia con los valores obtenidos de la respuesta.
   *
   * @returns {void} Este método no retorna ningún valor.
   */


  /**
   * Obtiene un aviso del catálogo utilizando el servicio `mercanciasDesmontadasOSinMontarService`.
   * Se suscribe al observable y actualiza las opciones relacionadas con la fracción arancelaria,
   * entidad federativa, delegación/municipio y colonia con los valores obtenidos de la respuesta.
   *
   * @returns {void} Este método no retorna ningún valor.
   */

  /**
   * Obtiene las opciones de radio para el aviso desde el servicio `MercanciasDesmontadasOSinMontarService`.
   * Se suscribe al observable y actualiza la propiedad `avisoOpcionesDeRadio` con la respuesta obtenida.
   *
   * @returns {void} Este método no retorna ningún valor.
   */
  obtenerAvisoOpcionesDeRadio(): void {
    this.mercanciasDesmontadasOSinMontarService
      .obtenerAvisoOpcionesDeRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta: AvisoOpcionesDeRadio) => {
          this.avisoOpcionesDeRadio = respuesta;
        },
      });
  }

  /**
   * Establece el tipo de aviso basado en el evento proporcionado.
   *
   * @param evento - El evento que representa el tipo de aviso, puede ser una cadena o un número.
   * @returns void
   */
  setTipoDeAviso(evento: string | number): void {
    this.tipoAviso = evento;
    this.solicitud32501Store.establecerDatos({ ideGenerica1: evento });
  }
  /*
   * Establece el ID de transacción basado en el evento proporcionado.
   *
   * @param evento - El evento que representa el ID de transacción, puede ser una cadena o un número.
   */
  setTransactionId(evento: string | number): void {
    this.solicitud32501Store.establecerDatos({ serviciosTerceros: evento });
  }


  /*
   * Establece los valores del formulario en el estado de la solicitud.
   *
   * @param formulario - El formulario del cual se obtienen los valores.
   * @param campo - El nombre del campo cuyo valor se desea establecer en el estado.
   *
   * Este método obtiene el valor del campo especificado en el formulario y lo establece
   * en el estado de la solicitud utilizando el store `solicitud32501Store`.
   */
  establecerValoresEnEstado(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    if (campo === 'entidadFederativa') {
      this.obtenerMunicipiosCatalogo(VALOR)
      this.opcionColonia.catalogos = [];
    } else if (campo === 'delegacionMunicipio') {
      this.obtenerColoniasCatalogo(VALOR);
    }

    this.solicitud32501Store.establecerDatos({ [campo]: VALOR });
  }
  /**
   * Cambia el valor del campo `fechaIniExposicion` en el formulario y actualiza el estado de la solicitud.
   * @param evento - El nuevo valor de la fecha de inicio de exposición.
   */
  cambiarInputFecha(evento: string): void {
    this.formAviso.patchValue({
      fechaIniExposicion: evento,
    });
    this.establecerValoresEnEstado(this.formAviso, 'fechaIniExposicion');
  }

  /**
  * Actualiza el número de valor en el estado de la solicitud basado en el evento del input.
  * Preserves exact input format and shows error messages for invalid formats.
  * @param controlName - El nombre del control cuyo valor se actualizará.
  * @param event - El evento que contiene el nuevo valor del input.
  */
  actualizarNumeroValor(controlName: string, event: Event): void {
    const RAW_VALUE = (event.target as HTMLInputElement).value;

    const CLEANED = RAW_VALUE?.toString().trim();

    this.formAviso.get(controlName)?.setValue(CLEANED);

    this.establecerValoresEnEstado(this.formAviso, controlName);

    this.formAviso.get(controlName)?.markAsTouched();
    this.formAviso.get(controlName)?.updateValueAndValidity();
  }

  /**
   * Muestra el modal para modificar una nueva operación de importación.
   */
  modificarOperacionImp(): void {
    if (!this.selectedOperacionDeImportacion) {
      this.mensajeSeleccion = 'Debe seleccionar una fila para modificar.';
      this.mostrarModalSeleccionRequerida();
      return;
    }
    this.modalOperacionModo = 'modificar';
    this.frmDatosOperacionImp.patchValue({
      patente: this.selectedOperacionDeImportacion.patente_autorizacion,
      rfc: this.selectedOperacionDeImportacion.rfc,
      pedimento: this.selectedOperacionDeImportacion.pedimento,
      aduana: this.selectedOperacionDeImportacion.cve_aduana,
    });

    if (this.modalElement) {
      if (!this.modalInstances) {
        this.modalInstances = new Modal(this.modalElement.nativeElement);
      }
      this.modalInstances.show();
    }
  }

  /**
   * Muestra el modal para agregar una nueva operación de importación.
   */
  agregarOperacionImp(): void {
    this.modalOperacionModo = 'agregar';

    this.frmDatosOperacionImp.reset();

    this.selectedOperacionDeImportacion = null;

    if (this.modalElement) {
      if (!this.modalInstances) {
        this.modalInstances = new Modal(this.modalElement.nativeElement);
      }
      this.modalInstances.show();
    }
  }

  /**
   * Verifica si un campo del formulario no es válido.
   * @param id Identificador del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario undefined.
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.formAviso.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param field Nombre del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario false.
   */
  esValido(field: string): boolean {
    const CONTROL = this.formAviso.get(field);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }

  /**
    * Maneja la selección de una fila en la tabla de transportistas.
   */
  onFilaSeleccionada(datos: OperacionDeImportacion): void {
    this.selectedOperacionDeImportacion = datos;
  }

  /**
   * Elimina una operación de importación.
   */
  eliminarOperacionImp(): void {
    if (this.operacionDeImportacionLista.length === 0 || !this.selectedOperacionDeImportacion) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona el(los) registro(s) a eliminar',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.noRowSelected = true;

    }
    else {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: '¿Esta seguro de eliminar el(los) servicio(s) seleccionado(s)?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.esEliminar = true;
    }


  }


  /**
 * Método para cerrar el modal de eliminación.
 * @param {boolean} evento - Indica si se debe proceder con la eliminación.
 * @return {void}
 */
  cerrarModalEliminar(evento: boolean): void {
    if (evento === true) {

      this.confirmarEliminacionOperacionImportacion();
    }
    this.esEliminar = false;
  }

  /**
  * Elimina las empresas nacionales seleccionadas del grid.
  * @method eliminarEmpresasNacionales
  * @return {void}
  */
  cerrarNoRow(): void {
    this.noRowSelected = false;
  }



  /**
   * Muestra el modal cuando se requiere seleccionar un elemento.
   * Se usa cuando el usuario intenta realizar una acción sin seleccionar un transportista.
   */
  mostrarModalSeleccionRequerida(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRefabir = this.modalService.show(this.templateSeleccionRequerida, MODAL_CONFIG);
  }

  /**
   * Muestra el modal de confirmación para eliminar un transportista.
   * Requiere confirmación del usuario antes de proceder con la eliminación.
   */
  mostrarModalConfirmacionEliminacion(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-m'
    };

    this.modalRefabir = this.modalService.show(this.templateConfirmacionEliminacion, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de selección requerida.
   * Se ejecuta después de mostrar el mensaje de selección obligatoria.
   */
  cerrarModalSeleccionRequerida(): void {
    this.modalRefabir?.hide();
  }

  /**
   * Confirma y ejecuta la eliminación del transportista seleccionado.
   * Actualiza la lista y el store, resetea la selección y muestra confirmación.
   */
  confirmarEliminacionOperacionImportacion(): void {
    if (!this.selectedOperacionDeImportacion) {
      return;
    }

    this.operacionDeImportacionLista = this.operacionDeImportacionLista.filter(operacion =>
      operacion.patente_autorizacion !== this.selectedOperacionDeImportacion?.patente_autorizacion
    );

    this.selectedOperacionDeImportacion = null;

    this.modalRefabir?.hide();
    this.mensajeSeleccion = 'Datos eliminados correctamente';
    this.mostrarModalSeleccionRequerida();
  }

  /**
   * Cierra el modal de confirmación de eliminación sin realizar cambios.
   * Cancela el proceso de eliminación y mantiene el estado actual.
   */
  cerrarModalConfirmacionEliminacion(): void {
    this.modalRefabir?.hide();
  }
  /*
  * Cierra el modal de datos de operación de importación.
  */
  cerrarModal(): void {
    this.esValidoForma = false;
  }



  /**
   * Obtiene la información del aviso desde el catálogo.
   */
  obtenerAvisoDelCatalogoModal(): void {
    this.obtenerAduanasActivas();
  }
  /**
     * Establece los valores del formulario en el estado de la solicitud.
     * @param formulario Formulario reactivo que contiene los datos de la operación.
     * @param campo Campo específico del formulario que se va a establecer en el estado.
     */
  establecerValoresEnEstadoModal(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    const DESCRIPCION = this.opcionAduana.catalogos.find(opt =>
      opt.clave === VALOR.toString()
    );

    this.desc_aduana = DESCRIPCION?.descripcion;
    this.solicitud32501Store.establecerDatos({ [campo]: VALOR, aduana_desc: DESCRIPCION?.descripcion });

  }




  /**
   * Verifica si un campo del formulario no es válido.
   * @param id Identificador del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario undefined.
   */
  noEsValidoModal(id: string): boolean | undefined {
    const CONTROL = this.frmDatosOperacionImp.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param field Nombre del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario false.
   */
  esValidoModal(field: string): boolean {
    const CONTROL = this.frmDatosOperacionImp.get(field);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }

  /*
  * Guarda los datos de la operación de importación desde el formulario.
  */
  guardarDatosOperacionImp(): void {
    this.frmDatosOperacionImp.markAllAsTouched();

    if (this.frmDatosOperacionImp.invalid) {
      this.esValidoForma = true;
      return;
    }

    this.esValidoForma = false;

    const VAL = this.frmDatosOperacionImp.value;
    const NUEVA_OPERACION: OperacionDeImportacion = {
      patente_autorizacion: VAL.patente,
      rfc: VAL.rfc,
      pedimento: VAL.pedimento,
      cve_aduana: VAL.aduana,
      aduana_desc: this.desc_aduana ? this.desc_aduana : ''   
    };

    if (this.selectedOperacionDeImportacion) {

      const IDX = this.operacionDeImportacionLista.findIndex(
        OP => OP === this.selectedOperacionDeImportacion
      );
      if (IDX > -1) {
        const UPDATED_LIST = [...this.operacionDeImportacionLista];
        UPDATED_LIST[IDX] = NUEVA_OPERACION;
        this.operacionDeImportacionLista = UPDATED_LIST;
      }
      this.selectedOperacionDeImportacion = null;
    } else {

      this.operacionDeImportacionLista = [
        ...this.operacionDeImportacionLista,
        NUEVA_OPERACION
      ];
    }

    this.solicitud32501Store.establecerDatos({
      operacionDeImportacionLista: this.operacionDeImportacionLista
    });

    this.frmDatosOperacionImp.reset();
    this.cerrarModalForma();
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Se ha guardado correctamente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.showSuccessModal = true;
  }
  /**
   * Cierra el modal de éxito.
   * @return {void}
   */
  closeSuccessModal(): void {
    this.showSuccessModal = false;

  }


  /*
   * Cierra el modal de datos de operación de importación y resetea el formulario.
   */
  cerrarModalForma(): void {
    if (this.modalInstances) {
      this.modalInstances.hide();
    }

    this.frmDatosOperacionImp.reset();
  }

  /** Validacion parcial dependiendo de opcion seleccionada */
  onChangesOperacion(): void {
    this.formAviso.get('ideGenerica1')?.valueChanges.subscribe(
      opcion => {
        const cveF = this.formAviso.get('cveFraccionArancelaria');
        const nco = this.formAviso.get('nico');
        const pso = this.formAviso.get('peso');
        const usd = this.formAviso.get('valorUSD');
        const des = this.formAviso.get('descripcionMercancia');

        if (opcion === 'TAV.MON') {
          cveF?.clearValidators();
          nco?.clearValidators();
          pso?.clearValidators();
          usd?.clearValidators();
          des?.clearValidators();
        } else {
          cveF?.setValidators([Validators.required]);
          nco?.setValidators([Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS), Validators.maxLength(2), Validators.minLength(2)]);
          pso?.setValidators([Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.maxLength(16), Validators.max(9999999999999.99), Validators.min(0.01)]);
          usd?.setValidators([Validators.required, Validators.pattern(/^(?:\d+(\.\d{1,2})?)$/), Validators.maxLength(15),Validators.max(9999999999999.99),Validators.min(0.01)]);
          des?.setValidators([Validators.required, Validators.maxLength(250)]);
        }

        cveF?.updateValueAndValidity();
        nco?.updateValueAndValidity();
        pso?.updateValueAndValidity();
        usd?.updateValueAndValidity();
        des?.updateValueAndValidity();
      }
    );
  }


  /**
   * Método de limpieza al destruir el componente.
   * Cancela suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
