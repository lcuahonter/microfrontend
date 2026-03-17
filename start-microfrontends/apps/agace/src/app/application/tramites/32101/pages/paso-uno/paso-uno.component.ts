import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { Solicitud32101State, Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { Subject, map, takeUntil } from 'rxjs';
import { ConsultaAvisoAcreditacionService } from '../../services/consulta-aviso-acreditacion.service';
import { FormularioDinamico } from '@ng-mf/data-access-user';
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Referencia al componente `SolicitanteComponent` dentro de la vista.
   * 
   * Esta propiedad utiliza el decorador `@ViewChild` para obtener una instancia
   * del componente `SolicitanteComponent` que se encuentra en la plantilla del
   * componente actual. Permite interactuar directamente con los métodos y 
   * propiedades del componente hijo.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Representa el tipo de persona asociado.
   * 
   * @type {number}
   * @remarks
   * Este valor se utiliza para identificar si la persona es física o moral.
   * Los valores específicos deben ser definidos según los requisitos del sistema.
   */
  tipoPersona!: number;
  /**
   * Representa un arreglo de objetos de tipo FormularioDinamico.
   * 
   * @remarks
   * Este arreglo se utiliza para almacenar información dinámica relacionada con el formulario.
   */
  persona: FormularioDinamico[] = [];
  /**
   * Arreglo que almacena los datos del formulario dinámico relacionados con el domicilio fiscal.
   * 
   * Cada elemento del arreglo es una instancia de `FormularioDinamico`, que representa
   * un conjunto de campos dinámicos configurados para capturar información específica.
   */
  domicilioFiscal: FormularioDinamico[] = [];
  /**
   * Índice que representa el número actual o posición en un proceso o lista.
   * Se inicializa con el valor 1.
   */
  indice: number = 1;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esDatosRespuesta: boolean = false;

    /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

    /**
   * Estado actual del trámite 6402.
   *
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Solicitud32101State;

    /**
   * Constructor del componente.
   *
   * @param {Tramite6402Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite6402Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite32101Store,
    public consultaioQuery: ConsultaioQuery,
    public consultaAvisoAcreditacionService: ConsultaAvisoAcreditacionService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos. También inicializa el índice de la pestaña activa.
   */
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
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Obtiene los datos de consulta del servicio y actualiza el store.
   */
  public fetchGetDatosConsulta(): void {
    this.consultaAvisoAcreditacionService
      .getDatosConsulta()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          this.esDatosRespuesta = true;
          const FORM = respuesta?.datos?.solicitudFormulario;
          this.store.setTipoDeInversion(FORM.tipoDeInversion ?? []);
          this.store.setValorEnPesos(FORM.valorEnPesos ?? '');
          this.store.setDescripcionGeneral(FORM.descripcionGeneral ?? '');
          this.store.setListaDeDocumentos(FORM.listaDeDocumentos ?? '');
          this.store.setComprobante(FORM.comprobante ?? '');
          this.store.setManifiesto1(FORM.manifiesto1 ?? '');
          this.store.setManifiesto2(FORM.manifiesto2 ?? '');
          this.store.setManifiesto3(FORM.manifiesto3 ?? '');
          this.store.setClaveDeReferencia(FORM.claveDeReferencia ?? '');
          this.store.setCadenaDeLaDependencia(FORM.cadenaDeLaDependencia ?? '');
          this.store.setNumeroDeOperacion(FORM.numeroDeOperacion ?? '');
          this.store.setBanco(FORM.banco ?? []);
          this.store.setLlaveDePago(FORM.llaveDePago ?? '');
          this.store.setFechaInicialInput(FORM.fechaInicialInput ?? '');
          this.store.setImporteDePago(FORM.importeDePago ?? '');
        }
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista del componente ha sido inicializada.
   * 
   * En este método:
   * - Se inicializa la propiedad `persona` con los datos de una persona moral nacional.
   * - Se establece el domicilio fiscal correspondiente a una persona moral o física nacional.
   * - Se invoca el método `obtenerTipoPersona` del servicio `solicitante` para definir el tipo de persona como moral nacional.
   */
  ngAfterViewInit(): void {

    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
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

  /**
   * Selecciona una pestaña específica estableciendo el índice correspondiente.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

}
