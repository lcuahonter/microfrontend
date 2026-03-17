import {
  AVISO,
  DatosPasos,
  RegistroSolicitudService,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter } from '@angular/core';
import { Inject, ViewChild } from '@angular/core';
import {
  ListaPasosWizard,
  PASOS,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { Observable, Subject, throwError } from 'rxjs';
import {
  Tramite80211Store,
  Tramites80211State,
} from '../../estados/tramites80211.store';
import { catchError, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite80211Query } from '../../estados/tramites80211.query';

/**
 * Interfaz que representa el botón de acción.
 */
interface AccionBoton {
  /**
   * La acción a realizar.
   */
  accion: string;
  /**
   * El valor asociado con la acción.
   */
  valor: number;
}

/**
 * Componente de registro-solicitud-immex.
 *
 * Este componente maneja el flujo de pasos para el proceso de registro-solicitud-immex.
 *
 * @selector 'app-registro-solicitud-immex'
 * @templateUrl './registro-solicitud-immex.component.html'
 * @styleUrl './registro-solicitud-immex.component.scss'
 */
@Component({
  selector: 'app-registro-solicitud-immex',
  templateUrl: './registro-solicitud-immex.component.html',
  styleUrl: './registro-solicitud-immex.component.scss',
})
export class registroSolicitudImmexComponent {
  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Notificador para destruir las suscripciones.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pasos: ListaPasosWizard[] = PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente `WizardComponent` dentro de la plantilla.
   *
   * @viewChild wizardComponent - Utiliza el decorador `@ViewChild` para acceder al componente `WizardComponent`.
   * Permite interactuar con sus propiedades y métodos en el código del componente principal.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Constante que almacena el valor de la nota de privacidad.
   *
   * @constant AVISO_PRIVACIDAD_ADJUNTAR - Almacena el valor definido en `NOTA.AVISO_PRIVACIDAD_ADJUNTAR`.
   * Se utiliza para adjuntar o gestionar el aviso de privacidad dentro del sistema.
   */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
   * Datos relacionados con los pasos.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * URL de la página actual.
   */
  public solicitudState!: Tramites80211State;
  /**
   * Estado de la solicitud actual.
   *
   * @type {Tramites80211State}
   * @memberof registroSolicitudImmexComponent
   */
  idTipoTRamite: string = '80211';

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * @ignore
   * Este método es ignorado por Compodoc.
   */
  cargaEnProgreso: boolean = true;

  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValido: boolean = true;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert!: string;

  constructor(
    private registroSolicitudService: RegistroSolicitudService,
    private store: Tramite80211Store,
    @Inject(Tramite80211Query) private query: Tramite80211Query
  ) {
    this.query.selectTramite80211$.pipe().subscribe((data) => {
      this.solicitudState = data;
    });
  }

  /**
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   *  carga - Indica si la carga de documentos está activa o no.
   * {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Maneja el estado de progreso de la carga de documentos.
   * Actualiza la variable `cargaEnProgreso` según el estado recibido.
   * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método para navegar a la siguiente sección del wizard.
   * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Método para navegar a la sección anterior del wizard.
   * Actualiza el índice y el estado de los pasos.
   * {void} No retorna ningún valor.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Guarda la solicitud de ampliación de servicios utilizando el adaptador para convertir el estado
   * y enviar los datos al servidor.
   * @returns {Observable<{ exito: boolean; [key: string]: any }>}
   */
  onGuardar(): Observable<any> {
    return this.query.selectTramite80211$.pipe(
      take(1), // Tomar solo el primer valor para evitar loops
      map((ESTADO_ACTUAL) =>
        AmpliacionServiciosAdapter.toFormPayload(ESTADO_ACTUAL)
      ),
      switchMap((FORM_PAYLOAD) => {
        return this.registroSolicitudService.postGuardarDatos(
          this.idTipoTRamite,
          FORM_PAYLOAD
        );
      }),
      catchError((error) => {
        console.error('Error al guardar:', error);
        return throwError(() => error);
      })
    );
  }

  getValorIndice(e: AccionBoton): void {
    if (this.indice === 1) {
      const FORM_VALIDO =
        this.pasoUnoComponent?.validarTodosLosFormularios() ?? false;
      this.esFormaValido = FORM_VALIDO;

      // if (!this.esFormaValido) {
      //   this.datosPasos.indice = 1;
      //   this.formErrorAlert =
      //     registroSolicitudImmexComponent.generarAlertaDeError(
      //       ERROR_SERVICIO_ALERT
      //     );
      //   setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      //   return;
      // }

      this.onGuardar()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe({
          next: (respuesta: BaseResponse<{ id_solicitud: number }>) => {
            // if (respuesta.codigo !== '00') {
            //   const ERROR_MESSAGE =
            //     respuesta.error || 'Error desconocido en la solicitud';
            //   this.formErrorAlert =
            //     registroSolicitudImmexComponent.generarAlertaDeError(
            //       ERROR_MESSAGE
            //     );
            //   this.esFormaValido = false;
            //   this.indice = 1;
            //   this.wizardComponent.indiceActual = 1;
            //   setTimeout(
            //     () => window.scrollTo({ top: 0, behavior: 'smooth' }),
            //     0
            //   );
            //   return;
            // }
            this.esFormaValido = true;
            this.indice = e.valor;
            this.datosPasos.indice = this.indice;
            this.wizardComponent.siguiente();
            if (respuesta.datos?.id_solicitud) {
              this.idSolicitudState = respuesta.datos.id_solicitud;
              this.store.setIdSolicitud(respuesta.datos.id_solicitud);
            }
          },
          error: (error) => {
            console.error('Error en onGuardar:', error);
            this.formErrorAlert =
              registroSolicitudImmexComponent.generarAlertaDeError(
                'Error al procesar la solicitud'
              );
            this.esFormaValido = false;
            this.indice = 1;
            this.wizardComponent.indiceActual = 1;
            setTimeout(
              () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              0
            );
          },
        });
    } else {
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

  public static generarAlertaDeError(mensajes: string): string {
    const ALERTA = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:
(Ingrese al menos una planta en la solicitud) es un campo requerido</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="me-2">1.</span>
      <span class="flex-grow-1 text-center">${mensajes}</span>
    </div>  
  </div>
</div>
`;
    return ALERTA;
  }
}
