import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  RegistroSolicitudService,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';

import { DatosDelSolicitudModificacionComponent } from '../../../../shared/components/datos-del-solicitud-modificacion/datos-del-solicitud-modificacion.component';
import { DatosSolicitudFormState } from '../../../../shared/components/shared26010/models/datos-solicitud.model';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component'
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { TramitesAsociadosSeccionComponent } from '../../../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { ModificacionDelPermisoSanitarioService } from '../../services/modificacion-del-permiso-sanitario.service';

import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { Tramite260904Store } from '../../estados/tramite260904.store';
import { GuardarAdapter_260904 } from '../../adapters/guardar-payload.adapter';
import { DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';

/**
 * Componente del primer paso del wizard para el trámite de modificación del permiso sanitario 260904.
 * 
 * Este componente gestiona la navegación entre las diferentes pestañas del primer paso,
 * coordina la validación de campos requeridos en todos los subcomponentes, y maneja
 * la carga inicial de datos desde el servicio de modificación del permiso sanitario.
 * 
 * Incluye funcionalidades para:
 * - Navegación entre pestañas (datos de solicitud, domicilio, terceros, trámites asociados, pago)
 * - Validación integral de campos requeridos
 * - Carga y guardado de datos del formulario
 * - Gestión del estado de consulta
 * 
 * @author SuNombre
 * @version 1.0
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnChanges, OnDestroy {
  /** 
   * Evento que se emite cuando cambia la pestaña activa.
   * Comunica al componente padre el índice de la nueva pestaña seleccionada.
   */
  @Output() tabChanged = new EventEmitter<number>();

  @ViewChild('DatosDelSolicitudModificacionComponent') DatosDelSolicitudModificacionComponent!: DatosDelSolicitudModificacionComponent;

  @ViewChild('manifiestosComponent') manifiestosComponent!: ManifiestosComponent;

  @ViewChild('representanteLegalComponent') representanteLegalComponent!: RepresentanteLegalComponent;

  /** Referencia al componente de vista de terceros relacionados */
  @ViewChild('tercerosRelacionadosVistaComponent')
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  /** Referencia al componente de pago de derechos */
  @ViewChild('PagoDeDerechosComponent')
  pagoDeDerechosComponent!: PagoDeDerechosContenedoraComponent;

  /** Referencia al componente de trámites asociados */
  @ViewChild('TramitesAsociadoComponent')
  tramitesAsociadoComponent!: TramitesAsociadosSeccionComponent;

  /** Tipo de trámite seleccionado por el usuario */
  selectedTipoTramite: string = '';

  /** Bandera que indica si hay un radio button seleccionado globalmente */
  isRadioButtonSelectedGlobal: boolean = false;

  /** Índice privado de la pestaña actual */
  indice: number = 1;

  /**
    * showPreFillingOptions
    * Indica si se deben mostrar las opciones de prellenado.
    */
  showPreFillingOptions: boolean = true;

  /**
   * Setter para el índice de la subpestaña activa.
   * Emite un evento cuando el valor cambia.
   * @param value - Nuevo índice de la subpestaña
   */
  @Input()
  set subTabIndex(value: number) {
    if (value && value !== this.indice) {
      this.indice = value;
      this.tabChanged.emit(this.indice);
    }
  }

  /**
   * Getter para obtener el índice actual de la subpestaña.
   * @returns El índice de la pestaña activa
   */
  get subTabIndex(): number {
    return this.indice;
  }


  /** Bandera que indica si los datos de respuesta están disponibles */
  esDatosRespuesta: boolean = false;

  /** Subject para manejar la destrucción de suscripciones */
  destroyNotifier$: Subject<void> = new Subject<void>();

  /** Estado actual de la consulta */
  consultaioState!: ConsultaioState;

  idProcedimiento: number = 260904;

  public tipoTramite: string = '';

  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * Constructor del componente.
   * @param consultaQuery - Servicio de consulta para obtener el estado
   * @param modificacionDelPermisoSanitarioService - Servicio para gestionar la modificación del permiso sanitario
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private modificacionDelPermisoSanitarioService: ModificacionDelPermisoSanitarioService,
    private tramiteStore: Tramite260904Store,
    public registroSolicitudService: RegistroSolicitudService,
    private datosDelSolicitudStore: DatosDelSolicituteSeccionStateStore,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioStore: DomicilioStore,
  ) { }

  /**
   * Hook de inicialización del componente.
   * Configura la suscripción al estado de consulta y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaioState = seccionState;
        })
      )
      .subscribe();

    if (this.consultaioState.update) {
      this.guardarDatosFormulario(this.consultaioState.id_solicitud, this.consultaioState.procedureId);
    } else {
      this.esDatosRespuesta = true;
      this.guardarDatosFormulario("203062265", "260204");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  datasolicituActualizar(event: DatosSolicitudFormState): void {
    this.tramiteStore.updateDatosSolicitudFormState(event);
  }

  /**
   * Maneja el cambio de tipo de trámite seleccionado.
   * @param tipo - Nuevo tipo de trámite seleccionado
   */
  onTipoTramiteChange(tipo: string): void {
    this.selectedTipoTramite = tipo;
  }

  /**
   * Maneja el cambio en la selección global de radio buttons.
   * @param selected - Estado de selección del radio button
   */
  onRadioButtonSelectedChange(selected: boolean): void {
    this.isRadioButtonSelectedGlobal = selected;
  }

  /**
   * Guarda los datos del formulario utilizando el servicio de modificación.
   * Se suscribe al servicio para obtener los datos y actualizar el estado del formulario.
   */
  guardarDatosFormulario(ID_SOLICITUD: string, PROCEDURE_ID: string): void {
    this.registroSolicitudService.parcheOpcionesPrellenadas(
      Number(PROCEDURE_ID),
      Number(ID_SOLICITUD)
    ).subscribe((res: any) => {
      if (res && res.datos) {
        GuardarAdapter_260904.patchToStore(res.datos, this.tramiteStore);
        GuardarAdapter_260904.patchToStoreDatosSolicitud(res.datos, this.datosDelSolicitudStore);
        GuardarAdapter_260904.patchToStoreManifestos(res.datos, this.manifestoStore);
        GuardarAdapter_260904.patchToStoreDomicilio(res.datos, this.domicilioStore);
      }
    });

  }

  /**
   * Selecciona una pestaña específica y emite el evento de cambio.
   * @param i - Índice de la pestaña a seleccionar
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.tabChanged.emit(i);
  }

  /**
   * Valida los campos requeridos de todos los subcomponentes en paso-uno.
   * Retorna false si algún campo requerido está faltando.
   * @returns true si todos los campos requeridos son válidos, false en caso contrario
   */
  /*public validateRequiredFields(): boolean {
    let isValid = true;

    if (this.datosDeLaSolicitudComponent?.validateRequiredFields) {
      isValid = this.datosDeLaSolicitudComponent.validateRequiredFields() && isValid;
    }

    if (this.domicilioDelEstablecimientoComponent?.validateRequiredFields) {
      isValid = this.domicilioDelEstablecimientoComponent.validateRequiredFields() && isValid;
    }

    if (this.tercerosRelacionadosVistaComponent?.validateRequiredFields) {
      isValid = this.tercerosRelacionadosVistaComponent.validateRequiredFields() && isValid;
    }

    if (this.tramitesAsociadoComponent?.validateRequiredFields) {
      isValid = this.tramitesAsociadoComponent.validateRequiredFields() && isValid;
    }

    return isValid;
  }
    
  */

  /**
   * Marca todos los campos como tocados en todos los subcomponentes de paso-uno.
   * Esto ayuda a mostrar errores de validación en la interfaz de usuario.
   */
  /*
  public markAllFieldsTouched(): void {
    if (this.datosDeLaSolicitudComponent?.markAllFieldsTouched) {
      this.datosDeLaSolicitudComponent.markAllFieldsTouched();
    }
    if (this.domicilioDelEstablecimientoComponent?.markAllFieldsTouched) {
      this.domicilioDelEstablecimientoComponent.markAllFieldsTouched();
    }
    if (this.tercerosRelacionadosVistaComponent?.markAllFieldsTouched) {
      this.tercerosRelacionadosVistaComponent.markAllFieldsTouched();
    }
    if (this.tramitesAsociadoComponent?.markAllFieldsTouched) {
      this.tramitesAsociadoComponent.markAllFieldsTouched();
    }
  }
  */

  validarPasoUno(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.DatosDelSolicitudModificacionComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO && ESTERCEROS_VALIDO) ? true : false;
  }

  validarContenedor(): boolean {
    const DATOS_SOLICITUD_VALIDO = this.DatosDelSolicitudModificacionComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    return (
      DATOS_SOLICITUD_VALIDO &&
      MANIFIESTOS_VALIDO &&
      REPRESENTANTE_LEGAL_VALIDO
    ) ? true : false;
  }

  /**
   * Hook de destrucción del componente.
   * Completa el subject para cancelar todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}