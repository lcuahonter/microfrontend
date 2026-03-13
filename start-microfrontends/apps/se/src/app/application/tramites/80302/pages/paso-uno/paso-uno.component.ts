/**
 * @fileoverview Componente para el paso uno del trámite 80302 (IMMEX).
 * 
 * Este archivo contiene el componente principal del primer paso del proceso de solicitud
 * para el trámite 80302 relacionado con modificaciones del programa IMMEX. 
 * Gestiona la interfaz de usuario para el registro y validación de datos del solicitante,
 * domicilio fiscal, y navegación entre diferentes secciones del formulario.
 * 
 * El componente implementa un patrón wizard con múltiples pasos y maneja el estado
 * de la consulta a través de Akita state management.
 * 
 * @version 1.0.0
 * @author Equipo de Desarrollo VUCEM
 * @since 2024
 */

import {AccionBoton,BtnContinuarComponent,ConsultaioQuery,ConsultaioState,DatosPasos,FormularioDinamico,ListaPasosWizard,LoginQuery,PASOS,SolicitanteComponent,WizardComponent,doDeepCopy,esValidObject} from '@ng-mf/data-access-user';
import { AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { AltaPlantaComponent } from '../../components/alta-planta/alta-planta.component';
import { BitacoraComponent } from '../../components/bitacora/bitacora.component';
import { CommonModule } from '@angular/common';
import { ComplementariaImmexComponent } from '../../components/complementaria-immex/complementaria-immex.component';
import { Component } from '@angular/core';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { Input } from '@angular/core';
import { ModificacionComponent } from '../../components/modificacion/modificacion.component';
import { PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { SolicitudService } from '../../service/solicitud.service';
import { Tramite80302Store } from '../../../../estados/tramites/tramite80302.store';
import { ViewChild } from '@angular/core';

/**
 * Componente principal para el primer paso del trámite 80302 (IMMEX).
 * 
 * @export
 * @class PasoUnoComponent
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    SolicitanteComponent,
    CommonModule,
    ModificacionComponent,
    BitacoraComponent,
    AltaPlantaComponent,
    ComplementariaImmexComponent,
    BtnContinuarComponent
  ],
})
export class PasoUnoComponent implements AfterViewInit {
  /**
   * Referencia al componente hijo `SolicitanteComponent`.
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una referencia
   * directa al componente `SolicitanteComponent` que maneja la captura de datos
   * del solicitante en el formulario del primer paso.
   * 
   * @type {SolicitanteComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Identificador numérico del tipo de persona jurídica.
   * Esta propiedad almacena el código que identifica si el solicitante es:
   * - Persona física nacional
   * - Persona moral nacional  
   * - Persona física extranjera
   * - Persona moral extranjera
   * 
   * @type {number}
   * @memberof PasoUnoComponent
   */
  tipoPersona!: number;

  /**
   * Configuración de campos dinámicos para el formulario de datos de la persona.
   * Esta propiedad contiene un array de objetos `FormularioDinamico` que definen
   * la estructura, validaciones y comportamiento de los campos del formulario
   * relacionados con los datos personales del solicitante.
   * 
   * @type {FormularioDinamico[]}
   * @memberof PasoUnoComponent
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración de campos dinámicos para el formulario de domicilio fiscal.
   * Esta propiedad contiene un array de objetos `FormularioDinamico` que definen
   * la estructura y validaciones de los campos relacionados con la dirección
   * fiscal del solicitante.
   * 
   * @type {FormularioDinamico[]}
   * @memberof PasoUnoComponent
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice del paso o pestaña actualmente seleccionada en el wizard.
   * Esta propiedad controla qué sección del formulario se muestra al usuario,
   * permitiendo la navegación entre diferentes pestañas.
   * 
   * @type {number}
   * @memberof PasoUnoComponent
   */
  indice: number = 1;

  /**
   * Emisor de eventos para notificar al componente padre sobre la acción de continuar.
   * Este evento se dispara cuando el usuario completa satisfactoriamente el primer paso
   * del trámite y está listo para proceder al siguiente paso del wizard.
   * 
   * @type {EventEmitter<string>}
   * @memberof PasoUnoComponent
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Indicador del estado de validación general del formulario del primer paso.
   * Esta propiedad determina si todos los datos requeridos han sido capturados
   * correctamente y cumplen con las validaciones establecidas.
   * 
   * @type {boolean}
   * @memberof PasoUnoComponent
   */
  validacion: boolean = false;

  /**
   * Datos relacionados con el número de pedimento asociado al trámite 80302.
   * Esta propiedad recibe información del componente padre relacionada con
   * el pedimento que se está procesando.
   * 
   * @type {unknown}
   * @memberof PasoUnoComponent
   */
  @Input() datosNroPedimento!: unknown;

  /**
   * Estado actual de la consulta gestionado por el patrón Akita.
   * Esta propiedad almacena la información del estado de la consulta que incluye:
   * - Indicador de actualización (update)
   * - Estado de carga de datos
   * - Información de errores
   * - Metadatos de la consulta actual
   * 
   * @type {ConsultaioState}
   * @memberof PasoUnoComponent
   */
  public consultaState!: ConsultaioState;

  /**
   * Indicador que determina si los datos del formulario provienen de una respuesta del servidor.
   * Esta bandera controla el comportamiento del componente según el origen de los datos.
   * 
   * @type {boolean}
   * @memberof PasoUnoComponent
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente y prevenir memory leaks.
   * Este Subject se utiliza como mecanismo de notificación para cancelar
   * automáticamente todas las suscripciones activas cuando el componente se destruye.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof PasoUnoComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista de configuración de pasos del wizard para el trámite 80302.
   * Esta propiedad contiene la definición de todos los pasos que conforman
   * el proceso completo del trámite.
   * 
   * @type {ListaPasosWizard[]}
   * @memberof PasoUnoComponent
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Configuración de datos para el comportamiento del wizard de pasos.
   * Esta propiedad define los parámetros de configuración del wizard incluyendo
   * número total de pasos, índice actual y textos de botones.
   * 
   * @type {DatosPasos}
   * @memberof PasoUnoComponent
   */
  datosPasos: DatosPasos = {
      nroPasos: this.pasos.length,
      indice: this.indice,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };

  /**
   * Referencia al componente hijo `WizardComponent` para control de navegación.
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener acceso directo
   * al componente `WizardComponent` que maneja la navegación entre pasos del trámite.
   * 
   * @type {WizardComponent}
   * @memberof PasoUnoComponent
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  
  /**
   * RFC del usuario actual.
   * @type {string}
   */
  private loginRfc: string = '';

  /**
   * Constructor del componente PasoUnoComponent.
   * Inicializa el componente configurando la suscripción al estado de la consulta
   * y determinando el comportamiento inicial basado en el estado actual.
   * 
   * @param {ConsultaioQuery} consultaQuery - Servicio Akita para consultar el estado reactivo de la consulta
   * @param {SolicitudService} solicitudService - Servicio para gestionar operaciones de solicitud y datos del trámite
   * @param {Tramite80302Store} store - Store Akita para gestión centralizada del estado del trámite 80302
   * @memberof PasoUnoComponent
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public solicitudService: SolicitudService,
    private store: Tramite80302Store,
    private loginQuery: LoginQuery,
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if(this.consultaState.update) {
            this.setStoreValues();
          }
        })
      )
      .subscribe();

    this.loginQuery.selectLoginState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((loginState) => {
        this.loginRfc = loginState.rfc;
      })
    )
    .subscribe();

    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde el archivo JSON local y actualiza el store con la información obtenida.
   * Este método se ejecuta cuando el estado de la consulta indica que se deben
   * actualizar los datos.
   * 
   * @returns {void}
   * @memberof PasoUnoComponent
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .obtenerTramiteDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.store.update(resp);
        }
      });
  }

  /**
   * Hook del ciclo de vida de Angular que se ejecuta después de la inicialización completa de la vista.
   * Este método se ejecuta una vez que Angular ha inicializado completamente
   * la vista del componente y todos sus componentes hijos.
   * 
   * @returns {void}
   * @memberof PasoUnoComponent
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }
  /**
   * Selecciona y activa una pestaña específica dentro del primer paso del trámite.
   * Este método permite la navegación entre diferentes secciones del paso uno.
   * 
   * @param {number} i - El índice de la pestaña a seleccionar (base 1)
   * @returns {void}
   * @memberof PasoUnoComponent
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Emite el evento de continuación para proceder al siguiente paso del trámite.
   * Este método se ejecuta cuando el usuario ha completado satisfactoriamente
   * todos los datos requeridos en el primer paso.
   * 
   * @returns {void}
   * @memberof PasoUnoComponent
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * Método que establece los valores seleccionados en el store y navega a la página del solicitante.
   * @return {void}
   */
  setStoreValues(): void {
    const PARAMS = { idSolicitud: this.consultaState.id_solicitud || '' };
    this.solicitudService.obtenerMostrar(PARAMS)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        if(esValidObject(response)) {
          const RESPONSE_GET = doDeepCopy(response);
          if(esValidObject(RESPONSE_GET.datos)) {
            this.store.setSelectedIdPrograma(RESPONSE_GET.datos.idProgramaAutorizado || '');
            this.store.setSelectedFolioPrograma(RESPONSE_GET.datos.descripcionModalidad || '');
            this.store.setSelectedTipoPrograma(RESPONSE_GET.datos.tipoPrograma || '');
            this.store.setLoginRfc(RESPONSE_GET.datos.rfc);
            this.store.setModificacionDatos(RESPONSE_GET.datos.planta);
          }
        }
      })
  }
  

  /**
   * Procesa las acciones de navegación del wizard basadas en los botones de control.
   * Este método maneja la navegación entre pasos del wizard cuando el usuario
   * interactúa con los botones "Anterior" y "Continuar".
   * 
   * @param {AccionBoton} e - Objeto que contiene la acción y valor del botón presionado
   * @returns {void}
   * @memberof PasoUnoComponent
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
}
