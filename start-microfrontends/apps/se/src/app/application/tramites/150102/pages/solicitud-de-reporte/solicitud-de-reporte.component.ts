import {
  AlertComponent,
  BtnContinuarComponent,
  ConsultaioQuery,
  ConsultaioState,
  DatosPasos,
  ERROR_FORMA_ALERT,
  JSONResponse,
  ListaPasosWizard,
  PasoFirmaComponent,
  WizardComponent,
  WizardService,
  doDeepCopy,
  esValidObject
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild,inject } from '@angular/core';
import { ERROR_FORMA_ALERT_DOS, ERROR_FORMA_ALERT_QUAD, ERROR_FORMA_ALERT_TRES } from '../../../150101/enums/registro-solicitud-anual.enum';
import { Observable,Subject,catchError, from, map, of, switchMap, take, takeUntil } from 'rxjs';
import { Solicitud150102State, Solicitud150102Store } from '../../estados/solicitud150102.store';
import { CommonModule } from '@angular/common';
import { DatosComponent } from '../datos/datos.component';
import { PAGO_DE_DERECHOS } from '../../constantes/solicitud150102.enum';
import { REPORTE_ANUAL_PASOS } from '../../enums/reporte-anual.enum';
import { ServicioDeFormularioService } from '../../../../shared/services/forma-servicio/servicio-de-formulario.service';
import { Solicitud150102Query } from '../../estados/solicitud150102.query';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';

/**
 * @description Interfaz que define la estructura y propiedades de una acción asociada a un botón interactivo.
 * Esta interfaz permite manejar eventos y datos relacionados con el funcionamiento del botón.
 *
 * @interface AccionBoton
 * @property {string} accion - Define la acción que se ejecutará cuando se interactúe con el botón.
 * Puede incluir valores como 'cont' para avanzar, o 'atras' para retroceder, según la lógica del asistente.
 * @property {number} valor - Representa un valor numérico asociado a la acción, como el índice del paso actual.
 * Este campo se utiliza para identificar el contexto de la acción realizada.
 */
interface AccionBoton {
  /** Especifica la acción a realizar al presionar el botón (e.g., 'cont' para continuar, 'atras' para retroceder). */
  accion: string;

  /** Valor numérico asociado a la acción, usado para definir el paso o estado actual. */
  valor: number;
}

/**
 * @description Componente que gestiona el proceso de solicitud de reporte.
 * Utiliza un asistente (wizard) para guiar al usuario a través de diferentes pasos.
 */
@Component({
  selector: 'app-solicitud-de-reporte', // Selector del componente
  standalone: true, // Indica que este componente no es independiente y depende de otros módulos
  imports: [
    CommonModule,
    WizardComponent,
    DatosComponent,
    PasoFirmaComponent,
    AlertComponent,
    BtnContinuarComponent,
    AlertComponent,
  ], // Importa el componente Wizard para su uso en este componente
  templateUrl: './solicitud-de-reporte.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './solicitud-de-reporte.component.scss', // Ruta del archivo de estilos
})
export class SolicitudDeReporteComponent implements OnInit,OnDestroy{
  /** Mensaje de texto que se muestra al guardar la solicitud exitosamente. */
 get TEXTOS(): string {
    return `La solicitud ha sido guardada exitosamente. Tiene 15 días naturales para firmarla, después de ese tiempo desaparecerá del listado de solicitudes pendientes por firmar. Número de solicitud [${this.guardarIdSolicitud}].`;
  }
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
  /** Indica si se debe mostrar una alerta para firmar la solicitud. */
  public firmarAlert: boolean = false;
  /** Estado actual de la solicitud */
  public solicitud150102State!: Solicitud150102State;
  /**
   * Representa el estado actual del pago de derechos.
   *
   * Inicialmente se establece con el valor `ADJUNTAR` de la enumeración `PAGO_DE_DERECHOS`.
   *
   * @type {string}
   */
  PAGO_DE_DERECHOS: string = PAGO_DE_DERECHOS.ADJUNTAR;
  /**
   * Mensaje de error a mostrar.
   */
  esValido = true;

  /** Referencia al componente del asistente (wizard) */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Referencia al componente `DatosComponent` identificado mediante el template reference variable `#datos`.
   *
   * Permite acceder directamente a las propiedades y métodos del componente hijo desde el componente padre.
   */
  @ViewChild('datos') datosComponent!: DatosComponent;

  /** Lista de pasos dentro del asistente */
  pantallasPasos: ListaPasosWizard[] = REPORTE_ANUAL_PASOS;

  /**
   * @description Índice del paso actual dentro del asistente.
   *
   * @type {number}
   * @default 1
   */
  indice: number = 1;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Contiene el mensaje de error que se mostrará al usuario.
   *
   * Se actualiza dinámicamente en función de las validaciones del formulario u otras operaciones fallidas.
   */
  mensajeError: string = '';

  /** Configuración de los datos de los pasos para el asistente */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length, // Número total de pasos en el asistente
    indice: this.indice, // Índice actual del paso
    txtBtnAnt: 'Anterior', // Texto del botón para retroceder
    txtBtnSig: 'Continuar', // Texto del botón para avanzar
  };

  /** Estado de la sección de consulta */
  public consultaState!: ConsultaioState;
  /** Servicio para manejar la lógica del asistente (wizard) */
  wizardService = inject(WizardService);
  /** Estado de validación del formulario */
  public formErrorAlert = ERROR_FORMA_ALERT;
  // new form validation
  /**
   * Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
   */
  public esFormaValido: boolean = false;
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
   * Inicializa una nueva instancia del componente.
   * 
   * @param tramiteQuery - Servicio de consulta para gestionar y recuperar datos relacionados con el trámite 150102.
   * @param _solicitudSvc - Servicio para manejar operaciones relacionadas con las solicitudes.
   * @param tramiteStore - Almacén para gestionar el estado del trámite 150102.
   * @param toastrService - Servicio para mostrar notificaciones tipo toast al usuario.
   * @param consultaQuery - Servicio de consulta para recuperar datos de consulta.
   * @param servicioDeFormularioService - Servicio para gestionar operaciones relacionadas con formularios.
   */
  constructor(
      private tramiteQuery: Solicitud150102Query,
      private _solicitudSvc: SolicitudService,
      public tramiteStore: Solicitud150102Store,
      private toastrService: ToastrService,
      private consultaQuery: ConsultaioQuery,
      private servicioDeFormularioService: ServicioDeFormularioService,
  ) {}

  
  /**
   * Método del ciclo de vida que se llama después de que Angular ha inicializado todas las propiedades enlazadas a datos de una directiva.
   * 
   * Se suscribe al observable `selectConsultaioState$` de `consultaQuery` para actualizar la propiedad local `consultaState`
   * cada vez que el estado cambia, y se da de baja automáticamente cuando el componente se destruye.
   * 
   * También se suscribe al observable `seleccionarSolicitud$` de `tramiteQuery` para actualizar la propiedad local
   * `solicitud150102State` con la solicitud actual, y se da de baja al destruirse el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      ).subscribe();
    this.tramiteQuery.seleccionarSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitud150102State = solicitud;
      });
  }


  /**
   * Maneja la navegación entre pasos en un componente wizard de varios pasos según la acción proporcionada.
   *
   * @param e - Un objeto de tipo `AccionBoton` que contiene el índice del paso actual (`valor`) y la acción de navegación (`accion`), que puede ser 'cont' (continuar) o 'ant' (anterior).
   *
   * @remarks
   * - Valida el formulario actual antes de permitir la navegación al siguiente paso si el formulario no está en modo solo lectura o actualización.
   * - Si el formulario no es válido, marca el formulario como tocado y previene la navegación.
   * - Utiliza el observable `shouldNavigate$` para determinar si se permite la navegación al siguiente paso.
   * - Actualiza el índice del paso actual (`indice`) y el estado relacionado (`datosPasos.indice`) según corresponda.
   * - Llama a los métodos de navegación apropiados del wizard (`siguiente` para avanzar, `atras` para retroceder).
   *
   * @example
   * ```typescript
   * getValorIndice({ valor: 2, accion: 'cont' });
   * ```
   */
  getValorIndice(e: AccionBoton): void {
      if (e.valor > 0 && e.valor <= this.pantallasPasos.length) {
      const NEXT_INDEX =
        e.accion === 'cont' ? e.valor + 1 :
        e.accion === 'ant' ? e.valor - 1 :
        e.valor;
        let noError=0;
    if (this.indice === 1 ) {
      noError = this.datosComponent.validarTodosLosFormularios();
    }
    if (noError===1) {
      this.esFormaValido = true;
      this.esFormaValidoDos = false;
      this.esFormaValidoTres = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if (noError===2) {
      this.esFormaValidoDos = true;
      this.esFormaValido = false;
      this.esFormaValidoTres = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if (noError===3) {
      this.esFormaValidoTres = true;
      this.esFormaValidoDos = false;
      this.esFormaValido = false;
      this.datosPasos.indice = this.indice;
      return;
    }
    else if (noError===4) {
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
      this.datosPasos.indice = this.indice;
      return;
    } 
    this.esFormaValido = false;
    this.esFormaValidoDos = false;
    this.esFormaValidoTres = false;
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
}

  /**
   * Guarda los datos actuales de la solicitud enviando un payload al servicio backend.
   *
   * Construye un objeto payload a partir del estado actual (`solicitud150102State`), incluyendo
   * información sobre fracciones, sectores, reporte anual, observaciones, descripción y otros
   * campos relevantes. El método luego llama al método de servicio `_solicitudSvc.guardar` para persistir
   * los datos. La operación está envuelta en una Promesa, que se resuelve con la respuesta del backend si
   * es exitosa, o se rechaza con un error si la operación falla.
   *
   * @returns {Promise<JSONResponse>} Una promesa que se resuelve con la respuesta del backend (`JSONResponse`)
   * si la operación de guardado es exitosa, o se rechaza con un error si falla.
   */
  public guardar():Promise<JSONResponse> {
    const SOLICITUDE = this.solicitud150102State;
    const [OBSERVACIONES, DESCRIPCION] = SOLICITUDE.idProgramaCompuesto.split(",");
    const PAYLOAD = {
      "fracciones": [
          {
              "cveFraccion": SOLICITUDE.bienesProducidosDatos[0].fraccion,
              "bienesProducidos": {
                  "descripcionBienProducido": SOLICITUDE.bienesProducidosDatos[0].bienProducido,
                  "totalBienesProducidos": SOLICITUDE.bienesProducidosDatos[0].totalBienesProducidos,
                  "volumenMercadoNacional": SOLICITUDE.bienesProducidosDatos[0].mercadoNacional,
                  "olumenExportaciones": SOLICITUDE.bienesProducidosDatos[0].exportaciones
              }
          }
      ],
      "sectores": [
          {
              "idConfProgramaSE": 0
          }
      ],
      "reporte_anual": {
          "saldo": SOLICITUDE.saldo,
          "porcentaje": SOLICITUDE.porcentajeExportacion,
          "ventasTotales": SOLICITUDE.ventasTotales,
          "totalExportaciones": SOLICITUDE.totalExportaciones,
          "totalImportaciones": SOLICITUDE.totalImportaciones,
          "totalPersonalAdmin1": 0,
          "totalPersonalAdmin2": 0,
          "totalPersonalObrero1": 0,
          "totalPersonalObrero2": 0
      },
      "observaciones": OBSERVACIONES,
      "descripcion": DESCRIPCION,
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
      "ide_generica_1": SOLICITUDE.inicio,
      "ide_generica_2": SOLICITUDE.fin,
      "descripcion_clob_generica_1": SOLICITUDE.modalidad,
      "descripcion_clob_generica_2": SOLICITUDE.idProgramaCompuesto
      }

      return new Promise((resolve, reject) => {
        this._solicitudSvc.guardar(PAYLOAD).pipe(
          takeUntil(this.destroyNotifier$)
        ).subscribe((response) => {
          if(esValidObject(response)) {
            const RESPONSE = doDeepCopy(response);
            this.tramiteStore.actualizarIdSolicitud(RESPONSE?.datos?.id_solicitud ?? 0);
            this.firmarAlert = true;
            this.guardarIdSolicitud = RESPONSE?.datos?.id_solicitud ?? 0;
            resolve(response);
          }
        },error=>{
          reject(error);
        });
      });
  }

  /**
   * Intenta guardar el estado actual de la solicitud y determina si se debe proceder con la navegación.
   *
   * Este método realiza los siguientes pasos:
   * 1. Emite el estado actual de `solicitud150102State`.
   * 2. Llama al método asíncrono `guardar()` para persistir el estado.
   * 3. Procesa la respuesta:
   *    - Si el código de respuesta es '00', muestra un mensaje de éxito y retorna `true`.
   *    - De lo contrario, muestra un mensaje de error y retorna `false`.
   * 4. Maneja cualquier error durante la operación de guardado registrando el error, mostrando un mensaje de error y retornando `false`.
   *
   * @returns Un `Observable<boolean>` que emite `true` si la operación de guardado fue exitosa y se debe proceder con la navegación, o `false` en caso contrario.
   */
   private shouldNavigate$(): Observable<boolean> {
    return of(this.solicitud150102State).pipe(
      take(1),
      switchMap(() => from(this.guardar())),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = DATOS.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      }),
      catchError((error) => {
        console.error('Error during save operation:', error);
        this.toastrService.error(error.message || 'Ocurrió un error al guardar la solicitud.');
        return of(false);
      })
    );
  }

   /**
   * Método que se ejecuta cuando cambia de tab en paso-uno.
   * Oculta el mensaje de error de validación.
   */
  public alCambiarPestana(): void {
      this.esFormaValido = false;
      this.esFormaValidoDos = false;
      this.esFormaValidoTres = false;
  }

  /**
   * Método del ciclo de vida que se llama cuando el componente es destruido.
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a cualquier suscripción
   * que limpie recursos y prevenga fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
