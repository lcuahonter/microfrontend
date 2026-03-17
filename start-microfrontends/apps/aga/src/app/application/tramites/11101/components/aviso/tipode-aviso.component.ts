import { Catalogo, CatalogoSelectComponent, InputRadioComponent, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { Tramite11101Store, Tramitenacionales11101State } from '../../estados/tramite11101.store';
import { CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA } from '../../constants/mercancia.enum';
import { CategoriaMensaje } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DiscripccionDeLaMercanciaForm } from '../../models/transportacion-maritima.model';
import { Notificacion } from '@ng-mf/data-access-user';
import {TipoNotificacionEnum} from '@ng-mf/data-access-user';
import { Tramite11101Query } from '../../estados/tramite11101.query';
import { TramiteFolioService } from '../../service/servicios-extraordinarios.service';

/**
 * Componente Angular para gestionar el formulario de aviso en el trámite 11101.
 *
 * Este componente permite capturar y mostrar los datos del aviso, alternar entre los modos de carga masiva y manual,
 * y controlar el estado de solo lectura del formulario según el estado de la consulta.
 * Utiliza formularios reactivos para la validación y captura de datos, y se integra con servicios y stores para
 * manejar el estado global del trámite.
 *
 * @remarks
 * - El formulario puede estar en modo solo lectura, deshabilitando todos los controles para evitar modificaciones.
 * - Permite alternar entre los modos de carga masiva y manual, afectando la interfaz y la lógica del formulario.
 * - Se suscribe a los estados de consulta y trámite para mantener los datos sincronizados y evitar fugas de memoria.
 *
 * @example
 * ```html
 * <app-tipode-aviso></app-tipode-aviso>
 * ```
 *
 * @see Tramite11101Query
 * @see TramiteFolioService
 * @see Tramite11101Store
 * @see ConsultaioQuery
 */
@Component({
  selector: 'app-tipode-aviso',
  templateUrl: './tipode-aviso.component.html',
  styleUrls: ['./tipode-aviso.component.scss'],
  standalone: true,
  imports: [TituloComponent, FormsModule, ReactiveFormsModule, CommonModule, CatalogoSelectComponent, InputRadioComponent, TablaDinamicaComponent, NotificacionesComponent]
})
export class TipodeAvisoComponent implements OnInit, OnDestroy {

  /** 
   * Indica si la carga masiva está habilitada.
   * @type {boolean}
   */
  cargaMasiva: boolean = false;

  /**
   * Formulario reactivo para capturar los datos del aviso.
   * @type {FormGroup}
   */
  avisoForm!: FormGroup;

  /**
  * Subject para destruir notificador.
  */
  consultaDatos!: ConsultaioState;

  /**
  * Indica si el formulario se encuentra en modo solo lectura.
  * Si es `true`, los controles del formulario estarán deshabilitados para evitar modificaciones.
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si la opción manual está actualmente seleccionada.
   * Se utiliza para alternar elementos de la interfaz o lógica basada en el estado de selección manual.
   */
  isManualSelected: boolean = false;

  /**
   * Indica si la opción de carga masiva está actualmente seleccionada.
   */
  isCargamasivaSelected: boolean = false;

  /**
   * Archivo seleccionado para carga masiva
   */
  selectedFile: File | null = null;

  /**
   * Lista de catálogos disponibles para aduanas.
   */
  entidadadfederativa!: Catalogo[];

  /**
   * Lista de catálogos disponibles para alcadilamunicipio.
   */
  alcadilamunicipio!: Catalogo[];

  /**
   * Lista de catálogos disponibles para colonia.
   */
  colonia!: Catalogo[];

  /**
   * Lista de catálogos disponibles para formaParteDePatrimonio.
   */
  formaParteDePatrimonio!: Catalogo[];

  /**
   * Lista de catálogos disponibles para unidadmedida.
   */
  unidadmedida!: Catalogo[];

  /**
   * Lista de catálogos disponibles para moneda.
   */
  moneda!: Catalogo[];

  /**
   * Lista de catálogos disponibles para fin.
   */
  fin!: Catalogo[];

  /**
   * Lista de catálogos disponibles para estado.
   */
  estado!: Catalogo[];

  /**
   * Opciones de radio.
   */
  radioOpcions = [
    { label: 'Manual', value: 'manual' },
    { label: 'Carga masiva', value: 'cargamasiva' }
  ];

  /**
   * Formulario reactivo para capturar los datos de la mercancía.
   * @type {FormGroup}
   */
  mercanciaForm!: FormGroup;

  /**
   * Lista de descripciones de la mercancía.
   * @type {discripccionDeLaMercanciaForm[]}
   */
  discripccionDeLaMercanciaForm: DiscripccionDeLaMercanciaForm[] = [];
  
  /**
   * Configuración para el persona moral nacional encabezado de la tabla.
   */
  configuracionParaPFEEncabezadoDeTabla = CONFIGURACION_PARA_PFE_ENCABEZADO_DE_TABLA;
  
  /**
   * Enumeración para la selección de tablas.
   * @type {typeof TablaSeleccion}
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * Notificación utilizada para mostrar mensajes o alertas en la interfaz.
   */
  public nuevaNotificacion: Notificacion | undefined;

  /**
   * Array para simular los accesos seleccionados (debe integrarse con la tabla real si existe).
   */
  public accesosTablaDatosSeleccionados: DiscripccionDeLaMercanciaForm[] = [];
  
  /**
   * Constructor de la clase. Inicializa el FormBuilder.
   * @param {FormBuilder} formBuilder - Servicio para construir formularios reactivos.
   * @param {Tramite11101Query} query - Servicio para consultar el estado del trámite.
   * @param {TramiteFolioService} service - Servicio para manejar la lógica del trámite.
   * @param {Tramite11101Store} store - Almacén para manejar el estado del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Servicio para consultar el estado de la consulta. 
   * @constructor
   * @description
   * Este constructor inyecta los servicios necesarios para manejar el estado del formulario y la consulta.
   * Utiliza `ConsultaioQuery` para obtener el estado de la consulta y configurar el formulario reactivo.
   * También inicializa el estado del formulario según si es de solo lectura o no.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private formBuilder: FormBuilder,
    private query: Tramite11101Query,
    private tramiteService: TramiteFolioService,
    private store: Tramite11101Store,
    private validacionesService: ValidacionesFormularioService,
  ) {}

  /** 
   * Estado de la solicitud que contiene los datos del formulario.
   * @type {Tramitenacionales11101State}
   */
  public solicitudState!: Tramitenacionales11101State;

  /**
   * Notificador para cancelar suscripciones activas al destruir el componente.
   * Se emite un valor y se completa en el método `ngOnDestroy` para evitar fugas de memoria.
   */
  public destroyNotifier$: Subject<void> = new Subject<void>();

  /**
   * Método de inicialización del componente.
   * Configura el formulario reactivo con los campos necesarios.
   */
  ngOnInit(): void {
     this.consultaioQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        }))
      .subscribe();
    this.query.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        }))
        .subscribe()
    this.donanteDomicilio();
    this.inicializaCatalogos();
  }

  /**
* Inicializa el estado del formulario según si es de solo lectura o no.
* Si es de solo lectura, guarda los datos del formulario; de lo contrario, inicializa el formulario con los datos del donante y domicilio.
*/
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.avisoForm.disable();
      this.mercanciaForm.disable();
    } else {
      this.avisoForm.enable();
      this.mercanciaForm.enable();
    }
  }

  /**
 * Inicializa el formulario reactivo para capturar los datos del aviso.
 * 
 * Asigna los valores iniciales desde `this.solicitudState` y aplica las validaciones requeridas
 * para cada campo del formulario. Al finalizar, llama a `inicializarEstadoFormulario()` para
 * ajustar el estado del formulario según el modo de solo lectura.
 */
  donanteDomicilio(): void {
    this.avisoForm = this.formBuilder.group({
      numeroderegistro: [
        this.solicitudState?.numeroderegistro,
        [Validators.required]
      ],
      NobmreDenominationRazonSocial: [
        this.solicitudState?.NobmreDenominationRazonSocial,
        [Validators.required]
      ],
      rfctaxid: [
        this.solicitudState?.rfctaxid,
        [Validators.required]
      ],
      Telefono: [
        this.solicitudState?.Telefono,
        [Validators.required]
      ],
      correoelectronico: [
        this.solicitudState?.correoelectronico,
        [Validators.required, Validators.email]
      ],
      entidadadfederativa: [
        this.solicitudState?.entidadadfederativa,
        [Validators.required]
      ],
      alcadilamunicipio: [
        this.solicitudState?.alcadilamunicipio,
        [Validators.required]
      ],
      colonia: [
        this.solicitudState?.colonia,
        [Validators.required]
      ],
      codigopostal: [
        this.solicitudState?.codigopostal,
        [Validators.required]
      ],
      calle: [
        this.solicitudState?.calle,
        [Validators.required]
      ],
      numeroletraexterior: [
        this.solicitudState?.numeroletraexterior,
        [Validators.required]
      ],
      numeroletrainterior: [
        this.solicitudState?.numeroletrainterior,
      ],
      entrecalle: [
        this.solicitudState?.entrecalle,
        [Validators.required]
      ],
      ycalle: [
        this.solicitudState?.ycalle
      ],
      radioDomicilio: [
        this.solicitudState?.radioDomicilio
      ]
    });

    this.mercanciaForm = this.formBuilder.group({
      estado: [
        this.solicitudState?.estado,
        [Validators.required, Validators.maxLength(20)]
      ],
      cantidad: [
        this.solicitudState?.cantidad,
        [Validators.required, Validators.min(1)]
      ],      
      formaParteDePatrimonio: [
        this.solicitudState?.formaParteDePatrimonio,
        [Validators.required]
      ],
      descripcion: [
        this.solicitudState?.descripcion,
        [Validators.required, Validators.maxLength(200)]
      ],
      valor: [
        this.solicitudState?.valor,
        [Validators.required, Validators.min(1)]
      ],
      unidadmedida: [
        this.solicitudState?.unidadmedida,
        [Validators.required, Validators.maxLength(50)]
      ],
      fraccionarancelaria: [
        this.solicitudState?.fraccionarancelaria,
        [Validators.required, Validators.min(1), Validators.max(99999999)]
      ],
      nico: [
        this.solicitudState?.nico,
        [Validators.required, Validators.min(0)]
      ],
      marca: [
        this.solicitudState?.marca,
        [Validators.required, Validators.maxLength(50)]
      ],
      modelo: [
        this.solicitudState?.modelo,
        [Validators.required, Validators.maxLength(50)]
      ],
      numerodeserie: [
        this.solicitudState?.numerodeserie,
        [Validators.required, Validators.min(1)]
      ],
      fin: [
        this.solicitudState?.fin,
        [Validators.required, Validators.maxLength(100)]
      ],
      moneda: [
        this.solicitudState?.moneda,
        [Validators.required, Validators.maxLength(50)]
      ],
      especifique: [
        this.solicitudState?.especifique,
         [Validators.required]
      ],
      consecutivo: [
        this.solicitudState?.consecutivo
      ]
    });

    this.setManual();
    this.inicializarEstadoFormulario();
  }

  /**
   * Maneja la selección de la aduana.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  entidadadFederativaSeleccion(): void {
    const ENTIDADFEDERATIVA = this.avisoForm.get('entidadadfederativa')?.value;
    this.store.setEntidadadfederativa(ENTIDADFEDERATIVA);
  }

  /**
   * Maneja la selección del alcadilamunicipio.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  alcadilamunicipioSeleccion(): void {
    const ALCADILAMUNICIPIO = this.avisoForm.get('alcadilamunicipio')?.value;
    this.store.setAlcadilamunicipio(ALCADILAMUNICIPIO);
  }

  /**
   * Maneja la selección de la colonia.
   * Obtiene el valor del formulario y lo establece en el store.
   */
  coloniaSeleccion(): void {
    const COLONIA = this.avisoForm.get('colonia')?.value;
    this.store.setColonia(COLONIA);
  }

  /**
   * Maneja la selección de la formapartadepatrimonio.
   */
  formaParteDePatrimonioSeleccion(): void {
    const FORMAPARTADEPATRIMONIA = this.mercanciaForm.get('formapartadepatrimonio')?.value;
    this.store.setFormaParteDePatrimonio(FORMAPARTADEPATRIMONIA);
  }

  /**
   * Maneja la selección de la unidadmedida.
   */
  unidadmedidaSeleccion(): void {
    const UNIDADMEDIDA = this.mercanciaForm.get('unidadmedida')?.value;
    this.store.setUnidadmedida(UNIDADMEDIDA);
  }

  /**
   * Maneja la selección de la moneda.
   */
  monedaSeleccion(): void {
    const MONEDA = this.mercanciaForm.get('moneda')?.value;
    this.store.setMoneda(MONEDA);
  }

  /**
   * Maneja la selección del fin.
   */
  finSeleccion(): void {
    const FIN = this.mercanciaForm.get('fin')?.value;
    this.store.setFin(FIN);
  }

  /**
   * Maneja la selección del estado.
   */
  estadoSeleccion(): void {
    const ESTADO = this.mercanciaForm.get('estado')?.value;
    this.store.setEstado(ESTADO);
  }

  /**
   * Inicializa los catálogos necesarios para el componente.
   */
  inicializaCatalogos(): void {
    const ENTIDADFEDERATIVA$ = this.tramiteService
      .getEntidadfederativa()
      .pipe(
        map((resp) => {
          this.entidadadfederativa = resp.data;
        })
      );

    const ALCADILAMUNICIPIO$ = this.tramiteService
      .getAlcadilamunicipio()
      .pipe(
        map((resp) => {
          this.alcadilamunicipio = resp.data;
        })
      );

    const COLONIA$ = this.tramiteService
      .getColonia()
      .pipe(
        map((resp) => {
          this.colonia = resp.data;
        })
      );

    const FORMAPARTADEPATRIMONIA$ = this.tramiteService
      .getFormaParteDePatrimonio()
      .pipe(
        map((resp) => {
          this.formaParteDePatrimonio = resp.data;
        })
      );
    
    const UNIDADMEDIDA$ = this.tramiteService
      .getUnidadmedida()
      .pipe(
        map((resp) => {
          this.unidadmedida = resp.data;
        })
      );

    const MONEDA$ = this.tramiteService
      .getMoneda()
      .pipe(
        map((resp) => {
          this.moneda = resp.data;
        })
      );

    const FIN$ = this.tramiteService
      .getFin()
      .pipe(
        map((resp) => {
          this.fin = resp.data;
        })
      );

    const ESTADO$ = this.tramiteService
      .getEstado()
      .pipe(
        map((resp) => {
          this.estado = resp.data;
        })
      );

      merge(
        ENTIDADFEDERATIVA$,
        ALCADILAMUNICIPIO$,
        COLONIA$,
        FORMAPARTADEPATRIMONIA$,
        UNIDADMEDIDA$,
        MONEDA$,
        FIN$,
        ESTADO$
      )
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe();
    }

  /**
   * Cambia el modo entre manual y carga masiva.
   * Si el formulario es de solo lectura, actualiza los estados correspondientes.
   */
  setManual(): void {
    const RADIO_DOMICILIO = this.avisoForm?.get('radioDomicilio')?.value;
    this.isManualSelected = RADIO_DOMICILIO === 'manual';
    this.isCargamasivaSelected = RADIO_DOMICILIO === 'cargamasiva';
  }
  
  /**
   * Agrega una nueva mercancía a la lista si el formulario es válido.
   */
  agregar(): void {
    if (this.mercanciaForm.valid) {
      const NUEVO_DATO = { ...this.mercanciaForm.value };
      NUEVO_DATO.consecutivo = this.discripccionDeLaMercanciaForm.length + 1;
      this.discripccionDeLaMercanciaForm = [...this.discripccionDeLaMercanciaForm, NUEVO_DATO];
      this.store.setPersonaFisicaExtranjeraTabla(this.discripccionDeLaMercanciaForm);
      this.mercanciaForm.reset();
      this.mercanciaForm.markAsUntouched();
      this.mercanciaForm.markAsPristine();
    } else {
      this.mercanciaForm.markAllAsTouched();
    }
  }

  /**
   * Obtiene los registros seleccionados de la tabla de mercancía.
   * Asigna los registros seleccionados al arreglo accesosTablaDatosSeleccionados.
   */
  obtenerRegistroSeleccionado(event: DiscripccionDeLaMercanciaForm[]): void {
    this.accesosTablaDatosSeleccionados = event;
  }

  /**
   * Elimina el último elemento de la lista de mercancía.
   */
  eliminarUltimaMercancia(): void {
    if (!this.accesosTablaDatosSeleccionados || this.accesosTablaDatosSeleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'Selecciona por lo menos un registro',
        cerrar: false,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.discripccionDeLaMercanciaForm.length > 0) {
      const SELECTED_CONSECUTIVOS = this.accesosTablaDatosSeleccionados.map(item => item.consecutivo);
      this.discripccionDeLaMercanciaForm = this.discripccionDeLaMercanciaForm.filter(item => !SELECTED_CONSECUTIVOS.includes(item.consecutivo));
      this.store.setPersonaFisicaExtranjeraTabla(this.discripccionDeLaMercanciaForm);
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'El registro seleccionado fue eliminado correctamente',
        cerrar: false,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.accesosTablaDatosSeleccionados = [];
    }
  }
  

  /**
   * Limpiar formulario.
   */
  limpiar(): void {
    this.mercanciaForm.reset();
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param {string} id El nombre del control del formulario.
   * @returns {boolean} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(id: string): boolean {
    const CONTROL = this.mercanciaForm.get(id);
    return CONTROL ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) : false;
  }

  /**
   * Establece los valores en el store.
   * @param form El formulario del cual se obtienen los valores.
   * @param campo El campo del formulario.
   * @param metodoNombre El nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite11101Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: string) => void)(VALOR);
    
    if (campo === 'radioDomicilio') {
      this.setManual();
    }
  }

  /**
   * Indica si el campo es válido.
   * @returns boolean | null
   */
  isValid(form: FormGroup, field: string): boolean | null {
    return this.validacionesService.isValid(form, field);
  }

  /**
   * Evento al seleccionar archivo para carga masiva
   */
  enArchivoSeleccionado(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    if (INPUT.files && INPUT.files.length > 0) {
      this.selectedFile = INPUT.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Evento al hacer click en cargar archivo
   */
  enCargar(): void {
    if (!this.selectedFile) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: 'Error, no se ha seleccionado un archivo',
        cerrar: false,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Se utiliza para limpiar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}