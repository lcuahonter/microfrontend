import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  DatosPasos,
  FormularioDinamico,
  ListaPasosWizard,
  PERSONA_MORAL_NACIONAL,
  SolicitanteComponent,
  TituloComponent,
  WizardComponent
} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud11102StaObjResp, Solicitud11102State } from '../../estados/tramite11102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteComponent } from '../../components/datos-del-tramite/datos-del-tramite.component';
import { ModificacionDonacionesImmexService } from '../../services/modificacion-donaciones-immex.service';
import { PASOS } from '../../constants/pasos.enum';
import { Tramite11102Query } from '../../estados/tramite11102.query';

/**
 * Interfaz que representa una acción ejecutada por un botón dentro de un flujo o formulario paso a paso.
 */
interface AccionBoton {
  /**
   * Acción que se desea ejecutar, como por ejemplo:
   * - `'cont'`: para continuar al siguiente paso.
   * - `'ant'`: para retroceder al paso anterior.
   * - Otros valores definidos por el flujo.
   */
  accion: string;

  /**
   * Índice numérico del paso al que se quiere navegar.
   * Usado para controlar la navegación dentro del flujo.
   */
  valor: number;
}

/**
 * Componente que representa el paso uno del trámite.
 */
@Component({
  selector: 'paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SolicitanteComponent,
    DatosDelTramiteComponent,
    TituloComponent
  ],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false; // Indica si hay datos de respuesta del servidor

  /**
   * Subject utilizado para notificar y manejar la destrucción de suscripciones.
   *
   * Se emite y completa en el método `ngOnDestroy` para evitar fugas de memoria
   * al cancelar todas las suscripciones activas del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject(); // Subject para manejar la destrucción de suscripciones

  /**
   * Estado de la consulta del trámite.
   * Este estado se utiliza para manejar la información del trámite actual.
   */
  public consultaState!: ConsultaioState; // Estado de la consult
  /**
   * Evento que se emite al continuar con el flujo del trámite.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Tipo de persona (e.g., física o moral).
   */
  tipoPersona!: number;

  /**
   * Datos del formulario dinámico de la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Datos del formulario dinámico del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña seleccionada en el wizard.
   */
  indice: number = 1;

  /**
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Referencia al componente del wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Formulario reactivo que contiene los datos de la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud11102State;

  /**
   * Constructor del componente PasoUno.
   * @param service11102 Servicio para manejar la solicitud
   * @param consultaQuery Servicio para consultar el estado
   * @param query Query para obtener el estado del trámite
   * @param fb FormBuilder para crear formularios reactivos
   */
  constructor(
    private service11102: ModificacionDonacionesImmexService, // Servicio para manejar la solicitud
    private consultaQuery: ConsultaioQuery, // Servicio para consultar el estado
    private query: Tramite11102Query, // Query para obtener el estado del trámite
    private fb: FormBuilder // FormBuilder para crear formularios reactivos
  ) {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Se suscribe al observable del estado de consulta (`selectConsultaioState$`) y actualiza la propiedad `consultaState` con el valor recibido.
   * - Utiliza `takeUntil` para cancelar la suscripción automáticamente cuando el componente se destruye, evitando fugas de memoria.
   * - Si el estado indica que está en modo actualización (`update`), llama a `guardarDatosFormulario()` para cargar los datos.
   * - Si no está en modo actualización, activa el modo de solo lectura para mostrar los datos de respuesta.
   */
  ngOnInit(): void {
    this.solicitudForm = this.fb.group({      
      folioOriginal: [{ value: this.solicitudState?.folioOriginal, disabled: true }, [Validators.required]]
    });

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$), // Se desuscribe al destruir el componente
        map((consultaState) => {
          this.consultaState = consultaState; // Asigna el estado de la consulta
        })
      )
      .subscribe();

    if (this.consultaState?.update) {
      this.guardarDatosFormulario(); // Si está en modo actualización, guarda los datos del formulario
    } else {
      this.esDatosRespuesta = true; // Si no, activa el modo de datos de respuesta
    }
  }

  /**
   * Obtiene los datos de la solicitud desde el servicio y actualiza el estado global.
   *
   * Realiza una petición al servicio para obtener los datos de la solicitud.
   * Al recibir la respuesta, marca que existen datos de respuesta y construye un objeto `Solicitud31803State`
   * con los datos recibidos. Luego, actualiza el estado global del formulario utilizando el método
   * `actualizarEstadoFormulario` del servicio.
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  guardarDatosFormulario(): void {
    this.service11102
      .getDatosDeTrtamitelDoc()
      .pipe(
        takeUntil(this.destroyNotifier$) // Se desuscribe al destruir el componente
      )
      .subscribe((resp: Solicitud11102StaObjResp) => {
        if (resp) {
          this.esDatosRespuesta = true; 
          this.service11102.actualizarEstadoFormulario(
            resp.modificacionDonacionesImmex
          );
        }
      });
  }
  /**
   * Método que se ejecuta después de que la vista ha sido inicializada.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL; // Asigna los datos de persona moral nacional
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL; // Asigna los datos de domicilio fiscal
     }
  /**
   * Datos de configuración para los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Selecciona la pestaña indicada por el índice.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Emite el evento para continuar con el flujo del trámite.
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * Cambia el índice del wizard según la acción recibida.
   * @param e Objeto que contiene la acción ('cont' o 'ant') y el índice del paso.
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
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Este método emite un evento a través de `destroyNotifier$` para notificar a las suscripciones activas
   * que deben cancelarse, evitando fugas de memoria. Luego, completa el subject para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Emite el evento de destrucción
    this.destroyNotifier$.complete(); // Completa el subject para limpiar suscripciones
  }
}
