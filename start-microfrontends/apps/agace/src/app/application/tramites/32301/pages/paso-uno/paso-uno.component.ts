import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { AdicionFraccionComponent } from '../../components/adicion-fraccion/adicion-fraccion.component';
import { AdicionProcesosComponent } from '../../components/adicion-procesos/adicion-procesos.component';
import { CommonModule } from '@angular/common';
import { FusionOescisionComponent } from '../../components/fusion-oescision/fusion-oescision.component';
import { ModificacionGoceInmuebleComponent } from '../../components/modificacion-goce-inmueble/modificacion-goce-inmueble.component';
import { ModificacionSociosComponent } from '../../components/modificacion-socios/modificacion-socios.component';
import { ProveedorExtranjeroComponent } from '../../components/proveedor-extranjero/proveedor-extranjero.component';
import { Solicitud32301Service } from '../../services/solicitud32301.service';
import { TipoDeAvisoComponent } from '../../components/tipo-de-aviso/tipo-de-aviso.component';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { TRAMITE_DECLARACIONES} from '../../enums/tramite-declaraciones.enum';


/**
 * Interfaz que define las propiedades relacionadas con los tipos de aviso que se seleccionan en el formulario
 * */
export interface TipoDevAviso {
  foreignClientsSuppliers: boolean; // Indica si se selecciona el tipo 'Clientes/proveedores extranjeros'
  nationalSuppliers: boolean; // Indica si se selecciona el tipo 'Proveedores nacionales'
  modificationsMembers: boolean; // Indica si se selecciona 'Modificaciones de miembros'
  changesToLegalDocuments: boolean; // Indica si se seleccionan 'Cambios a documentos legales'
  mergerOrSplitNotice: boolean; // Indica si se selecciona 'Aviso de fusión o escisión'
  additionFractions: boolean; // Indica si se selecciona 'Adición de fracciones'
  acepto253?: boolean; // Indica si se acepta la cláusula 253 (opcional)
  [key: string]: any; 
}

@Component({
  selector: 'app-paso-uno', // Selector del componente para el paso 1
  standalone: true, // El componente es autónomo y no depende de otros módulos
  styleUrls: ['./paso-uno.component.scss'], // Ruta al archivo de estilos
  imports: [
    CommonModule,
    SolicitanteComponent,
    TipoDeAvisoComponent,
    ProveedorExtranjeroComponent,
    ModificacionSociosComponent,
    ModificacionGoceInmuebleComponent,
    FusionOescisionComponent,
    AdicionFraccionComponent,
    AdicionProcesosComponent,
  ], // Importación de los componentes utilizados
  templateUrl: './paso-uno.component.html', // Ruta al archivo HTML
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  indice: number = 1; // Índice que determina qué sección está activa en el paso
    isActive: boolean = false; // Indica si el componente está activo

  // Objeto que almacena los valores seleccionados para los tipos de aviso
  datosInputCheck: TipoDevAviso = {
    foreignClientsSuppliers: false,
    nationalSuppliers: false,
    modificationsMembers: false,
    changesToLegalDocuments: false,
    mergerOrSplitNotice: false,
    additionFractions: false,
    acepto253: false
  };
  /**
   * Estado actual de la consulta para el componente.
   *
   * @type {ConsultaioState}
   * @public
   */
  public consultaState!: ConsultaioState;

  /**
   * Notificador utilizado para gestionar la destrucción de suscripciones en el componente.
   *
   * Este Subject emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones a observables y evitar fugas de memoria.
   *
   * @private
   */
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  mensajeCamposObligatorios: string = '* Campos obligatorios';
  tipoTramiteDeclaraciones = [];
  tramiteDeclaraciones = TRAMITE_DECLARACIONES;
  proveedoresExtranjeros = [];


  /**
   * Sujeto utilizado para notificar la destrucción del componente.
   *
   * Se emplea en combinación con `takeUntil` para cancelar suscripciones activas
   * y evitar fugas de memoria cuando el componente se destruye.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  @Output() tabSelected = new EventEmitter<number>();
  @Output() continuarEvento = new EventEmitter<any>();
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitudService: Solicitud32301Service,
    private Tramite32301Query: Tramite32301Query,
    private Tramite32301Store: Tramite32301Store,
    private AvisoModifyService: AvisoModifyService,

  ) {
    // Inicializa el estado de la consulta
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Se suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta.
   *
   * - Asigna el estado recibido a `consultaState`.
   * - Si el estado indica que se debe actualizar (`update` es verdadero), se llama a `guardarDatosFormulario()`.
   * - En caso contrario, se activa la bandera `esDatosRespuesta`.
   */
  ngOnInit(): void {
   
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }

     // Suscripción a los cambios del estado del proveedor extranjero
        this.Tramite32301Query.select()
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((state) => {
              this.datosInputCheck = state.tipoDevAviso;
          });
  }

  /**
   * Guarda los datos del formulario obteniendo la información de los productores.
   *
   * Este método realiza una solicitud al servicio `productoresService` para obtener
   * los datos de expansión de productores. Si la respuesta es válida, actualiza
   * el estado interno del componente y almacena los datos relevantes en el store
   * de trámites.
   *
   * @remarks
   * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente
   * se destruye, evitando fugas de memoria.
   *
   * @returns {void} No retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          if (this.consultaState.update) {
            this.solicitudService.actualizarEstadoFormulario(resp);
          }
        }
      });
  }

  /**
   * Método que selecciona la pestaña activa basada en el índice proporcionado.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i; // Actualiza el índice para cambiar la pestaña activa
    this.tabSelected.emit(this.indice); 
    if (this.indice === 2 || this.indice === 3 || this.indice === 4 || this.indice === 5 || this.indice === 6 || this.indice === 7 || this.indice === 8) {
      this.isActive = true; 
      this.Tramite32301Store.setIsActive(true);
    }
  }

  /**
   * Método que actualiza los valores de 'datosInputCheck' cuando se seleccionan diferentes opciones en el formulario.
   * @param event Los valores seleccionados por el usuario para los tipos de aviso.
   */
  getValoreEnable(event: TipoDevAviso): void {
    this.datosInputCheck = event; // Actualiza los valores con la selección actual
  }

  getVisibleTabs(): number[] {
    const tabs: number[] = [1, 2];

    if (this.datosInputCheck.foreignClientsSuppliers) tabs.push(3);
    if (this.datosInputCheck.nationalSuppliers) tabs.push(4);
    if (this.datosInputCheck.modificationsMembers) tabs.push(5);
    if (this.datosInputCheck.changesToLegalDocuments) tabs.push(6);
    if (this.datosInputCheck.mergerOrSplitNotice) tabs.push(7);
    if (this.datosInputCheck.additionFractions) tabs.push(8, 9);

    return tabs;
  }

  isLastTab(): boolean {
    const visibleTabs = this.getVisibleTabs();
    return this.indice === visibleTabs[visibleTabs.length - 1];
  }


  continuar(): void {
    
    if (this.isLastTab()) {
      this.guardarSolicitud()
      return; // Si es la última pestaña visible, no hacer nada
    }else {
      const visibleTabs = this.getVisibleTabs();
      const currentIndex = visibleTabs.indexOf(this.indice);
      if (currentIndex !== -1 && currentIndex < visibleTabs.length - 1) {
        this.seleccionaTab(visibleTabs[currentIndex + 1]);
      }
    }
  }


  guardarSolicitud(): void {
    let declaraciones: any[] = [];
    const trueKeys = Object.keys( this.datosInputCheck).filter(key => this.datosInputCheck[key] === true);
    
    
    trueKeys.forEach(key => {
      const tramite = this.tramiteDeclaraciones.find(item => item.descripcion === key);
      if (tramite) {  
        declaraciones.push({
          "cve_declaracion": tramite.clave,
          "acepto": true
        });
      }
    });

    declaraciones.push({
      "cve_declaracion": '253',
      "acepto": this.Tramite32301Store.getAcceptacion253() || false
    });

   const payload = {
        "id_solcitud": this.Tramite32301Store.getIdSolicitud() || null,
        "cve_regimen": "01",
        "cve_clasificacion_regimen": "01",
        "solicitante": {
            "rfc": "AAL0409235E6",
            "nombre": "Juan Pérez",
            "es_persona_moral": true,
            "certificado_serial_number": "string"
        },
        "declaraciones": [
            ...declaraciones
        ],
        "proveedores_extranjeros": this.Tramite32301Store.getProveedoresExtranjeros(),
        "proveedores_nacionales": this.Tramite32301Store.getProveedoresNacionalesRes(),
        "miembros_empresa": this.Tramite32301Store.getModificacionSociosHeader(),
        "inmuebles": this.Tramite32301Store.getMostrarGridNuevoHeaderData(),
        "fusionante":this.Tramite32301Store.getFusion()[0],
        "fusionadas_o_escisionadas": this.Tramite32301Store.getFusionEscisionHeader(),
        "fracciones": this.Tramite32301Store.getCargaManual(),
        "procesos": [],
        "datos_generales": this.Tramite32301Store.getFusionEscisionHeader().length > 0 ? { 
            "datos_fusion_o_escision": {
              "capacidad_almacenamiento": this.Tramite32301Store.getCapacidadAlmacenamiento(),
              "numero_total_carros": this.Tramite32301Store.getNumeroTotalCarros(),
              "cantidad_bienes": this.Tramite32301Store.getCantidadBienes(),
              "fecha_inspeccion": this.Tramite32301Store.getFechaInspeccion(),
              "descripcion_clob_generica_2": this.Tramite32301Store.getDescripcionClobGenerica2()
            }
          } : {
                  "datos_fusion_o_escision": null
              }
    }
    this.AvisoModifyService.guardarSolicitud(payload).subscribe((resp) => {
      
      if(resp.codigo = '00'){
        this.Tramite32301Store.setIdSolicitud(resp.datos.id_solicitud);
        this.continuarEvento.emit();
      }
    });

  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
