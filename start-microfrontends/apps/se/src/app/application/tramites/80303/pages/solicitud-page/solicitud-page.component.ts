import {
  PASOS,
  TITULOMENSAJE
} from '../../constants/modificacion-programa-immex-baja-submanufacturera.enum';

import { AccionBoton, ConsultaioQuery } from '@ng-mf/data-access-user';

import { Component, EventEmitter, OnDestroy, OnInit, inject } from '@angular/core';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { ViewChild } from '@angular/core';
import { WizardComponent } from '@libs/shared/data-access-user/src';

import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { buildGuardarPayload } from '../../mappers/guardar.mapper';

import{ Notificacion,
  NotificacionesComponent,} from '@libs/shared/data-access-user/src';

import { JSONResponse } from '@ng-mf/data-access-user';

import { Tramite80303State, Tramite80303Store } from '../../estados/tramite80303Store.store';

import{doDeepCopy} from '@libs/shared/data-access-user/src';
import { esValidObject } from '@libs/shared/data-access-user/src';
import { getValidDatos } from '@libs/shared/data-access-user/src';

import { Subject, takeUntil } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import{PasoFirmaComponent} from '@libs/shared/data-access-user/src';

import{PasoCargaDocumentoComponent} from '@libs/shared/data-access-user/src';

import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import{BtnContinuarComponent} from '@libs/shared/data-access-user/src';

import { CommonModule } from '@angular/common';

import { WizardService } from '@libs/shared/data-access-user/src';

import{PASOS_EXPORTACION} from '../../constants/modificacion-programa-immex-baja-submanufacturera.enum';

import { MSG_REGISTRO_EXITOSO } from '../../constants/modificacion-programa-immex-baja-submanufacturera.enum';

import { ConsultaioState } from '@ng-mf/data-access-user';
import { REGEX_COMAS_FINALES } from '../../../80316/constantes/modificacion.enum';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';


/**
 * @decorador @Component
 * @description Decorador que define los metadatos del componente Angular.
 * Este componente representa la página de solicitud dentro de la aplicación.
 * 
 * @property selector
 * Define el nombre del selector que se utiliza para instanciar este componente
 * en las plantillas HTML. En este caso, el selector es `app-solicitud-page`.
 * 
 * @property templateUrl
 * Especifica la ruta del archivo HTML que contiene la plantilla asociada
 * al componente. En este caso, la plantilla se encuentra en 
 * `./solicitud-page.component.html`.
 * 
 * @property styleUrl
 * Define la ruta del archivo SCSS que contiene los estilos específicos
 * para este componente. En este caso, los estilos se encuentran en 
 * `./solicitud-page.component.scss`.
 */
@Component({
  selector: 'app-solicitud-page',
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
   standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    BtnContinuarComponent,
    PasoFirmaComponent,
    PasoCargaDocumentoComponent,
    NotificacionesComponent,
   PasoUnoComponent

  ],
 
})
export class SolicitudPageComponent implements OnInit, OnDestroy {
  /**
   * @property tituloMensaje
   * @description Título que se muestra en la parte superior del wizard.
   * Se actualiza dependiendo del paso seleccionado.
   * @type {string | null}
   */
  public tituloMensaje: string | null = TITULOMENSAJE;
  /**
   * @property wizardComponent
   * @description Referencia al componente `WizardComponent`, utilizada para invocar métodos de navegación interna como `siguiente()` y `atras()`.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)
  public wizardComponent!: WizardComponent;

  /**
   * @property pasos
   * @description Listado de pasos definidos para el wizard, incluyendo
   * información y componentes asociados.
   * @type {ListaPasosWizard[]}
   */
  public pasos: ListaPasosWizard[] = PASOS;
   /**
   * Evento que se emite cuando se deben cargar archivos.
   * Este evento notifica a los componentes hijos que deben iniciar el proceso de carga de archivos.
   * @type {EventEmitter<void>}
   */
  cargarArchivosEvento = new EventEmitter<void>();
 /**
   * ID de la solicitud actual.
   * Se utiliza para identificar de manera única la solicitud en el sistema.
   * @type {number}
   */
  idSolicitud: number = 0;
  /**
   * @property indice
   * @description Índice del paso actual en el wizard.
   * @type {number}
   */
  public indice: number = 1;

  /**
   * @property wizardComponent
   * @description Referencia al componente `WizardComponent`, utilizada
   * para invocar métodos de navegación interna como `siguiente()` y `atras()`.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent)

 /**
   * Estado de progreso de carga de archivos
   * @type {boolean}
   * @description Indica si hay una operación de carga de archivos en progreso
   * @default true
   */
  cargaEnProgreso: boolean = true;
  /**
   * Estado de la sección de carga de documentos
   * @type {boolean}
   * @description Controla si la sección de carga de documentos está activa y visible
   * @default true
   */
  seccionCargarDocumentos: boolean = true;
  /**
   * Estado de habilitación del botón de carga de archivos
   * @type {boolean}
   * @description Controla si el botón para cargar archivos está disponible para el usuario
   * @default false
   */
  activarBotonCargaArchivos: boolean = false;
   /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto evita fugas de memoria al completar las suscripciones cuando el componente es destruido.
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @method seleccionaTab
   * @description Permite cambiar el paso actual de forma manual
   * al hacer clic en las pestañas (tabs) del wizard.
   * @param {number} i - Índice del paso seleccionado.
   * @returns {void}
   */
  public seleccionaTab(i: number): void {
    this.indice = i;
  }
   /**
   * Lista de pasos que se deben completar en el asistente.
   * Se obtiene de una constante predefinida.
   */
  pasosSolicitar: ListaPasosWizard[] = PASOS_EXPORTACION;
  /**
   * Estado actual de la consulta para el componente.
   * @type {ConsultaioState}
   */
 
  /**
   * @property datosPasos
   * @description Configuración de la barra de navegación del wizard:
   * número de pasos, índice actual y textos de los botones.
   * @type {DatosPasos}
   */
 datosPasos: DatosPasos = {
    nroPasos: this.pasosSolicitar.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };
 /**
   * Estado actual de la consulta para el componente.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;
  /**
   * Estado de la solicitud del trámite 80301.
   * @property {Solicitud80301State} solicitudState
   */
  solicitudState!: Tramite80303State;
  /**
    * Constructor de la clase SolicitudPageComponent.
   * @param modificacionService 
   * @param tramite80303Store 
   * @param consultaQuery 
   */
   constructor(
    public modificacionService: ModificacionProgramaImmexBajaSubmanufactureraService,
        public tramite80303Store: Tramite80303Store,
         public tramite80303Query: Tramite80303Query,
            private consultaQuery: ConsultaioQuery,

  ) {
    this.tramite80303Query.selectTramiteState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
     
      });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga el ID de la solicitud.
   * @returns {void}
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
this.buscarIdSolicitud();
   
  }
  /**
   * Método para buscar el ID de la solicitud.
   * Utiliza los valores seleccionados de idPrograma y tipoPrograma,
   * o valores por defecto si no están disponibles.
   */
  buscarIdSolicitud(): void {
      const PAYLOAD = {
        idPrograma: this.solicitudState.selectedIdPrograma || '121878',
        tipoPrograma: this.solicitudState.selectedTipoPrograma || 'TICPSE.IMMEX'
      };
  
      this.modificacionService
        .buscarIdSolicitud(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((respuesta) => {
          this.tramite80303Store.setBuscarIdSolicitud(
            respuesta.datos?.buscaIdSolicitud.replace(REGEX_COMAS_FINALES, '').split(',') || []
          );
        });
    }
  
  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;
  /**
   * Servicio para gestión del wizard
   * @type {WizardService}
   * @description Servicio inyectado para manejar la lógica y el estado del componente wizard
   * @readonly
   */
  wizardService = inject(WizardService);
  /**
   * Método que determina si se debe navegar al siguiente paso.
   * Realiza la operación de guardado y retorna un observable que indica si se debe navegar.
   * @returns {Observable<boolean>} Observable que indica si se debe navegar al siguiente paso.
   */
  private shouldNavigate$(): Observable<boolean> {
    return this.modificacionService.getAllState().pipe(
      take(1),
      switchMap((data) => this.guardar(data)),
      map(() => {
        return true;
      })
    );
  }
  
  /**
   * Muestra una plantilla de notificación de éxito.
   * {void} No retorna ningún valor.
   */
  mostrarPlantilla(): void {
    this.alertaNotificacion = {
      tipoNotificacion: 'banner',
      categoria: 'success',
      modo: 'action',
      titulo: '',
      mensaje: MSG_REGISTRO_EXITOSO(String(this.idSolicitud)),
      cerrar: true,
      txtBtnAceptar: '',
      txtBtnCancelar: '',
    };
  }
  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   * {void} No retorna ningún valor.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.valor > 0 && e.valor <= this.pasosSolicitar.length) {
      const NEXT_INDEX =
        e.accion === 'cont'
          ? e.valor + 1
          : e.accion === 'ant'
          ? e.valor - 1
          : e.valor;
      if (!this.consultaState.readonly && e.accion === 'cont') {
        this.shouldNavigate$().subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = NEXT_INDEX;
            this.datosPasos.indice = NEXT_INDEX;
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
            this.mostrarPlantilla();
          } else {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
          }
        });
      } else if (e.accion === 'cont') {
        this.shouldNavigate$().subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = NEXT_INDEX;
            this.datosPasos.indice = NEXT_INDEX;
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
            this.mostrarPlantilla();
          } else {
            this.indice = e.valor;
            this.datosPasos.indice = e.valor;
          }
        });
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }
  /**
   * Maneja el estado de progreso de carga
   * @method onCargaEnProgreso
   * @description Actualiza el estado interno que indica si hay una carga de archivos en progreso
   * @param {boolean} carga - True si la carga está en progreso, false si ha terminado
   * @returns {void}
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
 

  /**
   * Navega al paso anterior del wizard
   * @method anterior
   * @description Retrocede un paso en el wizard y actualiza los índices correspondientes
   * @returns {void}
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
  /**
   * Navega al siguiente paso con validación de documentos
   * @method siguiente
   * @description Ejecuta la navegación al siguiente paso del wizard después de validar
   * que todos los documentos requeridos hayan sido cargados correctamente
   * @returns {void}
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
  /**
   * Emite evento para iniciar carga de archivos
   * @method onClickCargaArchivos
   * @description Dispara el evento cargarArchivosEvento para notificar a componentes
   * hijo que deben iniciar el proceso de carga de archivos
   * @returns {void}
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }
  /**
   * Actualiza el estado de carga de documentos
   * @method cargaRealizada
   * @description Controla la visibilidad de la sección de carga de documentos
   * basado en si la carga se completó exitosamente
   * @param {boolean} cargaRealizada - True si la carga se completó, false en caso contrario
   * @returns {void}
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }
  /**
   * Maneja eventos de carga de documentos
   * @method manejaEventoCargaDocumentos
   * @description Actualiza el estado del botón de carga de archivos basado en
   * el estado actual de la carga de documentos
   * @param {boolean} carga - True si la carga está activa, false en caso contrario
   * @returns {void}
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Método estático que determina el título
   * a mostrar de acuerdo al índice del paso actual.
   * @param {number} valor - Índice del paso.
   * @returns {string} Título correspondiente al paso.
   */
  public static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULOMENSAJE;
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar';
      default:
        return TITULOMENSAJE;
    }
  }

  /**
   * Guarda los datos del trámite.
   * @param item - Estado actual del trámite.
   * @returns {Promise<JSONResponse>} Promesa que resuelve con la respuesta JSON.
   */
  guardar(item: Tramite80303State): Promise<JSONResponse> {
    const PAYLOAD = buildGuardarPayload(item);

    return new Promise((resolve, reject) => {
      this.modificacionService
        .postGuardarDatos(PAYLOAD)
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe(
          (response) => {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.idSolicitud = API_RESPONSE.datos.id_solicitud ?? 0;
                this.tramite80303Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud ?? 0
                );
              }
            }
            resolve(response);
          },
          (error) => {
                      console.error("Error in guardar:", error); 

            reject(error);
          }
        );
    });
  }

/**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y cancela las suscripciones activas.
   * Esto asegura que no haya fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
