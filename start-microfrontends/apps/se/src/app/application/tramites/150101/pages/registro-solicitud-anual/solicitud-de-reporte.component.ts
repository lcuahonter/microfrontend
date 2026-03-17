import { ALERTA_COM, ERROR_FORMA_ALERT,ERROR_FORMA_ALERT_DOS,ERROR_FORMA_ALERT_QUAD,ERROR_FORMA_ALERT_TRES,REPORTE_ANUAL_PASOS } from '../../enums/registro-solicitud-anual.enum';
import { Component, inject } from '@angular/core';
import { DatosPasos, WizardService, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Observable, Subject, map, switchMap, take, takeUntil } from 'rxjs';
import { OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Solicitud150101State, Solicitud150101Store } from '../../estados/solicitud150101.store';
import { DatosComponent} from '../datos/datos.component';
import { ListaPasosWizard } from '@libs/shared/data-access-user/src';
import { PAGO_DE_DERECHOS } from '../../../150102/constantes/solicitud150102.enum';
import { Solicitud150101Query } from '../../estados/solicitud150101.query';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';
import { ToastrService } from 'ngx-toastr';
import { WizardComponent } from '@libs/shared/data-access-user/src';

/**
 * Interfaz que representa la acción de un botón dentro del asistente.
 * 
 * @interface AccionBoton
 * @property {string} accion - Acción a realizar ('cont' para continuar, 'atras' para retroceder).
 * @property {number} valor - Valor del índice del paso al que se desea mover.
 */
interface AccionBoton {
  /**
   * Fecha de accion
   */
  accion: string;
  /**
   * Fecha de valor
   */
  valor: number;
}

/**
 * Componente que representa la solicitud de reporte dentro del asistente de trámites.
 * Este componente utiliza un asistente (wizard) para guiar al usuario a través de los pasos necesarios.
 *
 * @selector app-solicitud-de-reporte
 * @templateUrl ./solicitud-de-reporte.component.html
 * @styleUrl ./solicitud-de-reporte.component.scss
 */
@Component({
  selector: 'app-solicitud-de-reporte',
  templateUrl: './solicitud-de-reporte.component.html',
  styleUrl: './solicitud-de-reporte.component.scss',
})

/**
 * Clase que maneja la lógica del componente de solicitud de reporte.
 * 
 * @class SolicitudDeReporteComponent
 * @description Este componente gestiona el flujo de pasos para la solicitud de un reporte anual,
 * utilizando un asistente (wizard) para navegar entre los diferentes pasos.
 */
export class SolicitudDeReporteComponent implements OnInit, OnDestroy {
  /**
   * Constante que asigna el texto de alerta definido en `ALERTA_COM`.
   */
  TEXTOSR = ALERTA_COM;
  /**
   * Referencia al componente del asistente (wizard) utilizado en este componente.
   * 
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Lista de pasos que conforman el asistente para la solicitud de reporte anual.
   * 
   * @type {ListaPasosWizard[]}
   */
  pantallasPasos: ListaPasosWizard[] = REPORTE_ANUAL_PASOS;
 /**
   * Representa el estado actual del pago de derechos.
   *
   * Inicialmente se establece con el valor `ADJUNTAR` de la enumeración `PAGO_DE_DERECHOS`.
   *
   * @type {string}
   */
  PAGO_DE_DERECHOS: string = PAGO_DE_DERECHOS.ADJUNTAR;
  /**
   * Índice del paso actual dentro del asistente.
   *
   * @type {number}
   * @default 1
   */
  indice: number = 1;
  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValido: boolean = false;
  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValidoDos: boolean = false;

    /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  esFormaValidoTres: boolean = false;
      /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
      esFormaValidoCuatro: boolean = false;
  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
    public formErrorAlert = ERROR_FORMA_ALERT;

  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlertDos = ERROR_FORMA_ALERT_DOS;
  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlertTres = ERROR_FORMA_ALERT_TRES;
  /**
     * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
     */
  public formErrorAlertQuad = ERROR_FORMA_ALERT_QUAD;
  /**
  /**
     * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
     */
    @ViewChild('pasoUnoRef') pasoUnoComponent!: DatosComponent;

  /**
   * @property {number} nroPasos - Número total de pasos en el flujo, calculado a partir de la longitud de `pantallasPasos`.
   * @property {number} indice - Índice actual del paso en el flujo.
   * @property {string} txtBtnAnt - Texto que se muestra en el botón para retroceder al paso anterior.
   * @property {string} txtBtnSig - Texto que se muestra en el botón para avanzar al siguiente paso.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
    wizardService = inject(WizardService);

  /**
   * @property SolicitudService
   * @description
   * Inyección del servicio `SolicitudService` para gestionar la lógica y el estado del componente de solicitud.
   * @type {SolicitudService}
   */
    solicitudService = inject(SolicitudService);

  /**
   * @property toastrService
   * @description
   * Inyección del servicio `ToastrService` para mostrar notificaciones al usuario.
   * @type {ToastrService}
   */
    toastrService = inject(ToastrService);

    /**
   * @property store
   * @description
   * Inyección del servicio `Solicitud150101Store` para gestionar el estado de la solicitud.
   * @type {Solicitud150101Store}
   */
    store = inject(Solicitud150101Store);

    /**
   * @property query
   * @description
   * Inyección del servicio `Solicitud150101Query` para gestionar el estado de la solicitud.
   * @type {Solicitud150101Query}
   */
    query = inject(Solicitud150101Query);

  /**
   * Estado actual del trámite 110216.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Tramite110216State}
   * @public
   */
  public solicitudState!: Solicitud150101State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
 * Inicializa el componente y suscribe al estado de la solicitud anual desde el store.
 * Actualiza la propiedad local `solicitudState` cada vez que cambia el estado.
 */
  ngOnInit(): void {
    this.query.seleccionarSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Método que actualiza el índice del paso actual basado en la acción del botón.
   * 
   * @param {AccionBoton} e - Objeto que contiene la acción ('cont' para continuar, 'atras' para retroceder) y el valor del índice del paso.
   * @returns {void}
   */
  getValorIndice(e: AccionBoton): void {
    const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
    let noError=0;
    if (this.indice === 1 ) {
      noError = this.pasoUnoComponent.validarTodosLosFormularios();
    }
    if (noError===1) {
      this.esFormaValido = true;
      this.esFormaValidoDos = false;
      this.esFormaValidoTres = false;
      this.esFormaValidoCuatro = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if (noError===2) {
      this.esFormaValidoDos = true;
      this.esFormaValido = false;
      this.esFormaValidoTres = false;
      this.esFormaValidoCuatro = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if (noError===3) {
      this.esFormaValidoTres = true;
      this.esFormaValidoDos = false;
      this.esFormaValido = false;
      this.esFormaValidoCuatro = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if (noError===4) {
      this.esFormaValidoCuatro = true;
      this.esFormaValidoTres = false;
      this.esFormaValidoDos = false;
      this.esFormaValido = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if(noError===5) {
      this.esFormaValido = false;
      this.esFormaValidoDos = false;
      this.esFormaValidoTres = false;
      this.esFormaValidoCuatro = false;
      this.datosPasos.indice = this.indice;
      return;
    } 
    this.esFormaValido = false;
    this.esFormaValidoDos = false;
    this.esFormaValidoTres = false;
    this.esFormaValidoCuatro = false;
    if (e.accion === 'cont') {
      this.shouldNavigate$()
        .subscribe((shouldNavigate) => {
          if (shouldNavigate) {
            this.indice = NEXT_INDEX;
            this.datosPasos.indice = NEXT_INDEX;
            this.wizardService.cambio_indice(NEXT_INDEX);
            this.wizardComponent.siguiente();
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

/**
   * Maneja la lógica para actualizar el índice del paso del wizard según el evento del botón de acción proporcionado.
   *
   * Este método obtiene el estado actual desde `nuevoProgramaIndustrialService`, lo guarda,
   * y muestra un mensaje de éxito o error dependiendo del código de respuesta. Si la respuesta es exitosa
   * y el valor del evento está dentro del rango válido (1 a 4), actualiza el índice del wizard y navega
   * hacia adelante o atrás según el tipo de acción.
   *
   * @param e - El evento del botón de acción que contiene el valor y el tipo de acción.
   */
    private shouldNavigate$(): Observable<boolean> {
      return this.solicitudService.getAllState().pipe(
        take(1),
        switchMap(data => this.guardar(data)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((response: any) => {
          const OK = response.codigo === '00';
          if (OK) {
            this.toastrService.success(response.mensaje);
          } else {
            this.toastrService.error(response.mensaje);
          }
          return OK;
        })
      );
    }

    /**
     * Guarda los datos proporcionados enviándolos al servidor mediante el servicio `nuevoProgramaIndustrialService`.
     *
     * @param data - Los datos que se desean guardar y enviar al servidor.
     * @returns void
     */
    guardar(data: Solicitud150101State): Promise<unknown> {
      const REPORTE_ANUAL = this.solicitudService.buildReporteAnual(data);
      const ID_PROGRAMA_COMPUESTO = data.idProgramaCompuesto ?? '';
      const [OBSERVACIONES, DESCRIPCION] = ID_PROGRAMA_COMPUESTO.split(',').map(v => v.trim());
      const PAYLOAD = {
        "id_solcitud": 0,
        "tipoDeSolicitud": "guardar",
        "solicitante": {
          "rfc": "AAL0409235E6",
          "nombre": "Juan Pérez",
          "es_persona_moral": true,
          "certificado_serial_number": "1234"
        },
        "representacion_federal": {
          "cve_entidad_federativa": "DGO",
          "cve_unidad_administrativa": "1016"
        },
        "fracciones": [
        {
          "cveFraccion": "",
          "bienesProducidos": {
            "descripcionBienProducido": "",
            "totalBienesProducidos": 0,
            "volumenMercadoNacional": 0,
            "olumenExportaciones": 0
          }
        }
        ],
        "sectores": [
          {
            "idConfProgramaSE": 0
          }
        ],
        "observaciones": OBSERVACIONES,
        "descripcion": DESCRIPCION,
        "ide_generica_1": data.reporteAnualFechaInicio,
        "ide_generica_2": data.reporteAnualFechaFin,
        "descripcion_clob_generica_1": data.modalidad,
        "descripcion_clob_generica_2": data.idProgramaCompuesto?.toString(),
        "reporte_anual": REPORTE_ANUAL
      }
      return new Promise((resolve, reject) => {
        this.solicitudService.guardarDatosPost(PAYLOAD).subscribe({
          next: (response) => {
            if (esValidObject(response) && esValidObject(response['datos'])) {
              const DATOS = response['datos'] as { id_solicitud?: number };
              if (getValidDatos(DATOS.id_solicitud)) {
                this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              } else {
                this.store.setIdSolicitud(0);
              }
            }
            resolve(response);
          },
          error: (error) => {
            reject(error);
          }
        });
        });
    }
    
 /**
   * Método que se ejecuta cuando cambia de tab en paso-uno.
   * Oculta el mensaje de error de validación.
   */
  alCambiarPestana(): void {
    this.esFormaValido = false;
    this.esFormaValidoDos = false;
    this.esFormaValidoTres = false;
    this.esFormaValidoCuatro = false;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   *
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
