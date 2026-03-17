import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BtnContinuarComponent, DatosPasos, FormularioDinamico, ListaPasosWizard, PASOS, SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContenedorComponent } from '../../components/contenedor/contenedor.component';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { Tramite11204Store } from '../../estados/tramite11204.store';

/**
 * Interfaz que representa una AccionBoton.
 * Utilizamos esta interfaz para definir la estructura de los datos de una AccionBoton.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
  standalone: true,
  imports: [SolicitanteComponent, CommonModule, ContenedorComponent, BtnContinuarComponent]
})
export class PasoUnoComponent implements AfterViewInit,OnInit {
  /**
   * Referencia al componente Solicitante.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona.
   */
  tipoPersona!: number;

  /**
   * Arreglo que contiene los datos del formulario dinámico de la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Arreglo que contiene los datos del formulario dinámico del domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña actual.
   */
  indice: number = 1;

  /**
   * Evento de salida que emite cuando se hace clic en el botón continuar.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Bandera de validación.
   */
  validacion: boolean = false;

  /**
   * Arreglo que contiene los pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Datos del número de pedimento.
   */
  @Input() datosNroPedimento!: unknown;

  /**
   * Referencia al componente Wizard.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Sujeto para notificar la destrucción del componente.
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  constructor(private datosTramiteService: DatosTramiteService,
    private consultaioQuery: ConsultaioQuery,
    public tramite11204Store: Tramite11204Store,
  ) { }

  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
        })
      )
      .subscribe();
    if (this.consultaDatos.update) {
      this.fetchGetDatosConsulta();
    }
  }

  /**
 * @method fetchGetDatosConsulta
 * @description Método para obtener los datos de consulta desde el servicio `DatosTramiteService` y actualizar el estado del store `tramite11204Store`.
 * 
 * Este método realiza una solicitud HTTP para obtener los datos de consulta y, si la respuesta es exitosa, actualiza múltiples propiedades del store con los datos recibidos.
 * Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye, evitando fugas de memoria.
 * 
 * @returns {void}
 */
  public fetchGetDatosConsulta(): void {
    this.datosTramiteService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$)).subscribe((respuesta) => {
        if (respuesta.success) {
          this.tramite11204Store.setTipoBusqueda(respuesta.datos.tipoBusqueda);
          this.tramite11204Store.setAduana(respuesta.datos.aduana);
          this.tramite11204Store.setFechaIngreso(respuesta.datos.fechaIngreso);
          this.tramite11204Store.setInicialesContenedor(respuesta.datos.inicialesContenedor);
          this.tramite11204Store.setNumeroContenedor(respuesta.datos.numeroContenedor);
          this.tramite11204Store.setDigitoDeControl(respuesta.datos.digitoDeControl);
          this.tramite11204Store.setContenedores(respuesta.datos.contenedores);
          this.tramite11204Store.setAduanaMenuDesplegable(respuesta.datos.aduanaMenuDesplegable);
          this.tramite11204Store.setVigencia(respuesta.datos.vigencia);
          this.tramite11204Store.setDelContenedor(respuesta.datos.datosDelContenedor);
        }
      });
  }

  /**
   * Gancho de ciclo de vida angular que se llama después de que la vista del componente se haya inicializado por completo.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }

  /**
   * Selecciona una pestaña.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Emite el evento continuar.
   */
  continuar(): void {
    this.continuarEvento.emit('');
  }

  /**
   * Obtiene el valor del índice y navega en el wizard.
   * @param e El evento de acción del botón.
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
