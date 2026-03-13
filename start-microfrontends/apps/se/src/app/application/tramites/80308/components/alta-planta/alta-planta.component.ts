import {
  Catalogo,
  CatalogoSelectComponent,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  doDeepCopy,
  esValidArray,
  esValidObject,
} from '@ng-mf/data-access-user';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomicilioInfo, RecintoSolicitud } from '../../models/plantas-consulta.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { CONFIGURACION_DOMICILIOS } from '../../constantes/modificacion.enum';
import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from '../complementaria-immex/complementaria-immex.component';
import { ConfiguracionColumna } from '../../models/configuracio-columna.model';
import { ModificacionSolicitudeService } from '../../services/modificacion-solicitude.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite80308Query } from '../../estados/tramite80308.query';
import { Tramite80308Store } from '../../estados/tramite80308.store';

/**
 * @component
 * @name AltaPlantaComponent
 * @description Componente para la gestión de alta de planta
 */
@Component({
  selector: 'app-alta-planta',
  templateUrl: './alta-planta.component.html',
  styleUrls: ['./alta-planta.component.scss'],
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    TituloComponent,
    TablaDinamicaComponent,
    ComplementariaImmexComponent,
    ReactiveFormsModule,
    CommonModule,
    NotificacionesComponent
  ],
  providers: [ModificacionSolicitudeService, ToastrService],
})
/**
 * @class AltaPlantaComponent
 * @implements OnInit
 * @implements OnDestroy
 */
export class AltaPlantaComponent implements OnInit, OnDestroy {

  /**
   * @property {Notificacion | null} nuevaNotificacion
   */
  nuevaNotificacion!: Notificacion | null;
  /**
   * Formulario que contiene el grupo de controles para la entidad federativa.
   */
  /**
   * @property {FormGroup} formulario
   */
  formulario: FormGroup;

  /**
   * Lista de catálogos que representan los estados.
   * @type {Observable<JsonResponseCatalogo[]>}
   */
  /**
   * @property {Catalogo[]} estados
   */
  public estados: Catalogo[] = [];

  /**
   * Estado seleccionado.
   * @type {Catalogo}
   */
  /**
   * @property {Catalogo} estado
   */
  estado!: Catalogo;

  /**
   * Lista de domicilios disponibles.
   * @type {Observable<DomicilioInfo[]>}
   */
  /**
   * @property {Observable<DomicilioInfo[]>} domicilios$
   */
  domicilios$!: Observable<DomicilioInfo[]>;

  /**
   * Lista de domicilios seleccionados.
   * @type {DomicilioInfo[]}
   */
  /**
   * @property {DomicilioInfo[]} domiciliosSeleccionados
   */
  domiciliosSeleccionados: DomicilioInfo[] = [];

  /**
   * Variable para definir el tipo de selección en la tabla (por defecto es RADIO).
   * @type {TablaSeleccion}
   */
  /**
   * @property {TablaSeleccion} tablaSeleccion
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * Configuración de las columnas de la tabla, utilizando el tipo DomicilioInfo.
   * @type {ConfiguracionColumna<DomicilioInfo>[]}
   */
  /**
   * @property {ConfiguracionColumna<DomicilioInfo>[]} configuracionTabla
   */
  configuracionTabla: ConfiguracionColumna<DomicilioInfo>[] =
    CONFIGURACION_DOMICILIOS;

  /**
   * Datos de ejemplo basados en la interfaz DomicilioInfo.
   * @type {Observable<DomicilioInfo[]>}
   */
  /**
   * @property {Observable<DomicilioInfo[]>} datos$
   */
  datos$: Observable<DomicilioInfo[]>;

  /**   * Lista de domicilios a agregar.
   * @type {DomicilioInfo[]}
   */
  /**
   * @property {DomicilioInfo[]} agregarDomiciliosSeleccionados
   */
  agregarDomiciliosSeleccionados: DomicilioInfo[] = [];

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  /**
   * @property {Subject<void>} destroyNotifier$
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  /**
   * @property {boolean} esFormularioSoloLectura
   */
  public esFormularioSoloLectura: boolean = false; 

  /**
   * Constructor de la clase.
   * @param {FormBuilder} fb - El servicio para construir formularios reactivos.
   * @param {ModificacionSolicitudeService} modificionService - Servicio para la modificación de solicitudes.
   */
  /**
   * @constructor
   */
  constructor(
    private fb: FormBuilder,
    public modificionService: ModificacionSolicitudeService,
    private toastr: ToastrService,
    private store: Tramite80308Store,
    private tramiteQuery: Tramite80308Query,
    private consultaioQuery: ConsultaioQuery,
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
       takeUntil(this.destroyNotifier$),
       map((seccionState)=>{
         this.esFormularioSoloLectura = seccionState.readonly; 
         this.inicializarEstadoFormulario();
       })
     )
     .subscribe()

    // Inicialización del formulario para la entidad federativa.
    this.formulario = this.fb.group({
      entidadFederativa: ['', [Validators.required, Validators.min(0)]],
    });
   
    this.tramiteQuery.selectEstado$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(estado => {
      if(estado) {
        this.formulario.patchValue({
          entidadFederativa: estado
        }); 
      }
      this.store.setFormValida({entidadFederativa: this.formulario.valid})
    });
    this.datos$ = this.tramiteQuery.selectBuscarDomicilios$;
    this.domicilios$ = this.tramiteQuery.selectDomicilios$;
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  /**
   * @method guardarDatosFormulario
   */
  guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.formulario.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formulario.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  /**
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

  /**
   * Getter para obtener el control del formulario de la entidad federativa.
   * @returns {FormControl} El control para la entidad federativa.
   */
  /**
   * @method formularioControl
   */
  get formularioControl(): FormControl {
    return this.formulario.get('entidadFederativa') as FormControl;
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga la lista de estados.
   */
  /**
   * @method ngOnInit
   */
  ngOnInit(): void {
    this.cargarEstados();
  }

  /**
   * Método para cargar los estados mediante el servicio.
   * Realiza una llamada al servicio para obtener la lista de estados.
   */
  /**
   * @method cargarEstados
   */
  cargarEstados(): void {
    this.modificionService
      .obtenerListaEstado()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(
        (data) => {
          if(esValidObject(data)) {
            const RESPONSE = doDeepCopy(data);
          if(esValidArray(RESPONSE.datos)) {
            this.estados = RESPONSE.datos;
          }
          }
        },
        (error) => {
          console.error('Error al cargar los estados:', error);
        }
      );
  }

  /**
   * Método para buscar domicilios según la entidad seleccionada en el formulario.
   * Realiza una llamada al servicio para obtener los domicilios de la entidad seleccionada.
   */
  /**
   * @method buscarDomicilios
   */
  buscarDomicilios(): void {
    const ENTIDAD = this.formularioControl?.value;

    const PAYLOAD = {
      "rfcSolicitante": "AAL0409235E6",
      "entidadFederativa": ENTIDAD,
      "idPrograma": 121880,
      "tipoPrograma":"TICPSE.IMMEX",
      "plantaIdc":"1"
    }
    if (ENTIDAD && ENTIDAD !== '-1') {
      this.modificionService
        .obtenerDomicilios80308(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (data) => {
            if(esValidObject(data)) {
              const RESPONSE = doDeepCopy(data);  
              if(esValidArray(RESPONSE.datos.planta)) {
                const DATOS:DomicilioInfo[] = [];
                  RESPONSE.datos.planta.forEach((element: RecintoSolicitud) => {
                    const DATA: DomicilioInfo = {
                      id: element?.domicilioDto?.idDomicilio,
                      calle: element?.domicilioDto?.calle ?? undefined,
                      numeroExterior: element?.domicilioDto?.numExterior ?? undefined,
                      numeroInterior: element?.domicilioDto?.numInterior ?? undefined,
                      codigoPostal: element?.domicilioDto?.codigoPostal ?? undefined,
                      localidad: element?.domicilioDto?.cveLocalidad ?? undefined,
                      colonia: element?.domicilioDto?.colonia ?? undefined,
                      delegacionMunicipio: element?.domicilioDto?.delegacionMunicipio ?? undefined,
                      entidadFederativa: element?.domicilioDto?.entidadFederativa?.cveEntidad ?? undefined,
                      pais: element?.domicilioDto?.entidadFederativa?.pais ?? undefined,
                      telefono: element?.domicilioDto?.telefono ?? undefined,
                      idSolicitud: element?.recintoSolicitudPK?.idSolicitud !== undefined ? String(element.recintoSolicitudPK.idSolicitud) : undefined,
                      razonSocial: element?.empresaDto?.razonSocial ?? undefined,
                      rfc: element?.empresaDto?.rfc ?? undefined
                    };
                    DATOS.push(DATA);
                  })
                this.agregarDomiciliosSeleccionados = DATOS;
                this.store.setbuscarDomicilios(DATOS);
              }
            }
          },
          () => {
            this.toastr.error('Error al buscar domicilios')
          }
        );
    } else {
      // Maneja el caso donde la selección de la entidad no es válida.
      this.toastr.error('Seleccione una entidad federativa válida.')
    }
  }

  /**
   * Método para seleccionar un domicilio de la lista.
   * @param {DomicilioInfo} domicilios - El domicilio que se selecciona.
   */
  /**
   * @method seleccionarDomicilios
   */
  seleccionarDomicilios(domicilios: DomicilioInfo): void {
    this.domiciliosSeleccionados = [{ ...domicilios }];
  }

  /**
   * Método para aplicar la acción seleccionada, asignando los domicilios seleccionados.
   */
  /**
   * @method aplicarAccion
   */
  aplicarAccion(): void {
    if(this.domiciliosSeleccionados.length) {
      
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert', 
        categoria: 'info', 
        modo: 'confirmacion', 
        titulo: 'Confirmar Acción',
        mensaje: 'Selecciona al menos una planta donde se realizarán las operaciones IMMEX.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
        tamanioModal: 'md', 
        alineacionTexto: 'center' 
      };
    } else {
      
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'confirmacion',
        titulo: '',
        mensaje: 'Selecciona al menos una planta donde se realizarán las operaciones IMMEX..',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'md',
        alineacionTexto: 'center'
      };
    }
  }


  /**
   * Método para eliminar una planta de los domicilios seleccionados.
   * @param {DomicilioInfo} plantas - El domicilio que se quiere eliminar.
   */
  /**
   * @method eliminarPlantas
   */
  eliminarPlantas(): void {
    if(this.domiciliosSeleccionados.length) {
     
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'confirmacion',
        titulo: 'Confirmar Eliminación',
        mensaje: '¿Está seguro que desea eliminar la planta seleccionada?',
        cerrar: true,
        txtBtnAceptar: 'Eliminar',
        txtBtnCancelar: 'Cancelar',
        tamanioModal: 'md',
        alineacionTexto: 'center'
      };
    } else {
      
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'confirmacion',
        titulo: '',
        mensaje: 'Selecciona la planta que desea eliminar.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
        tamanioModal: 'md',
        alineacionTexto: 'center'
      };
    }
  }

  /**
   * Handles the confirmation modal response
   * @param confirmacion - Boolean indicating user's choice
   */
  /**
   * @method confirmacionModal
   */
  confirmacionModal(confirmacion: boolean): void {
    if (confirmacion) {
      
      if (this.nuevaNotificacion?.txtBtnAceptar === 'Eliminar') {
       
        if(this.domiciliosSeleccionados.length) {
          this.store.eliminarDomicilios(this.domiciliosSeleccionados[0]);
          this.toastr.success('Planta eliminada exitosamente');
        }
      } else if (this.nuevaNotificacion?.txtBtnAceptar === 'Aceptar' && this.domiciliosSeleccionados.length) {
        
        this.store.aggregarDomicilios(this.domiciliosSeleccionados[0]);
        this.toastr.success('Planta agregada exitosamente');
      }
    }
    
    this.nuevaNotificacion = null;
  }

  /**
   * Establece el estado en el almacén (store) con el valor proporcionado.
   * 
   * @param {Catalogo} estado - El estado que se desea establecer en el almacén. Este parámetro debe ser de tipo `Catalogo`.
   * 
   * @returns {void} - No devuelve ningún valor.
   */
  /**
   * @method tipoEstadoSeleccion
   */
  tipoEstadoSeleccion(): void {
    this.store.setEstado(this.formularioControl.value);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Utiliza un Subject para notificar a todos los observables suscritos que deben completarse.
   * Esto ayuda a evitar posibles fugas de memoria al completar el Subject y finalizar las suscripciones.
   */
  /**
   * @method ngOnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
