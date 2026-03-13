import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite32506State, Tramite32506Store } from '../../estados/tramite32506.store';
import { AvisoComponent } from '../../components/aviso/aviso.component';
import { AvisoDestruccionService } from '../../services/aviso-destruccion.service';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { Tramite32506Query } from '../../estados/tramite32506.query';


/**
 * Componente para gestionar el paso uno del trámite 32506.
 *
 * Este componente permite al usuario navegar entre las pestañas del trámite y gestionar
 * los datos del solicitante y del aviso.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, AvisoComponent],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente `SolicitanteComponent`.
   *
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del solicitante dentro de la plantilla.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Índice de la pestaña activa.
   *
   * Esta propiedad indica la pestaña actual seleccionada en el componente.
   */
  indice: number = 1;

  /**
   * Estado actual del trámite 32506.
   *
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite32506State;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor del componente.
   *
   * @param {Tramite32506Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite32506Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite32506Store,
    public tramiteQuery: Tramite32506Query,
    public avisoDestruccionService: AvisoDestruccionService,
    private consultaQuery: ConsultaioQuery
  ) {
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
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   *
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos. También inicializa el índice de la pestaña activa.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
    this.indice = this.tramiteState.pestanaActiva;
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.avisoDestruccionService
      .guardarDatosFormulario()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp.success) {
          this.esDatosRespuesta = true;
          const FORM1 = resp?.datos?.avisoFormulario;
          const FORM2 = resp?.datos?.desperdicioFormulario;
          const FORM3 = resp?.datos?.pedimentoFormulario;
          const FORM4 = resp?.datos?.procesoFormulario;
          const FORM5 = resp?.datos?.domicilioFormulario;

          this.store.setDestruccionMercanciasTabla(resp?.datos?.destruccionMercanciasTabla)

          this.store.setAvisoFormularioAdace(FORM1?.adace);
          this.store.setAvisoFormularioCalle(FORM1?.calle);
          this.store.setAvisoFormularioCodigoPostal(FORM1?.codigoPostal);
          this.store.setAvisoFormularioColonia(FORM1?.claveColonia);
          this.store.setAvisoFormularioDelegacionMunicipio(
            FORM1?.claveDelegacionMunicipio
          );
          this.store.setAvisoFormularioEntidadFederativa(
            FORM1?.claveEntidadFederativa
          );
          this.store.setAvisoFormularioFechaTranslado(FORM1?.fechaTranslado);
          this.store.setAvisoFormularioJustificacion(FORM1?.justificacion);
          this.store.setAvisoFormularioNombreComercial(FORM1?.nombreComercial);
          this.store.setAvisoFormularioNumeroExterior(FORM1?.numeroExterior);
          this.store.setAvisoFormularioNumeroInterior(FORM1?.numeroInterior);
          this.store.setAvisoFormularioTipoAviso(FORM1?.tipoAviso);
          this.store.setAvisoFormularioTipoCarga(FORM1?.tipoCarga);
          this.store.setAvisoFormularioValorAnioProgramaImmex(
            FORM1?.valorAnioProgramaImmex
          );
          this.store.setAvisoFormularioValorProgramaImmex(
            FORM1?.valorProgramaImmex
          );
          this.store.setPeriodicidadMensualDestruccion(
            FORM1?.periodicidadMensualDestruccion
          );

          // Desperdicio Formulario
          this.store.setCantidadDesp(FORM2?.cantidadDesp);
          this.store.setCircunstanciaHechos(FORM2?.circunstanciaHechos);
          this.store.setClaveUnidadMedidaDesp(FORM2?.claveUnidadMedidaDesp);
          this.store.setDescripcionDesperdicio(FORM2?.descripcionDesperdicio);
          this.store.setDescripcionMercancia(FORM2?.descripcionMercancia);

          // Pedimento Formulario
          this.store.setCantidadPedimento(FORM3?.cantidadPedimento);
          this.store.setClaveAduanaPedimento(FORM3?.claveAduanaPedimento);
          this.store.setClaveFraccionArancelariaPedimento(
            FORM3?.claveFraccionArancelariaPedimento
          );
          this.store.setClaveUnidadMedidaPedimento(
            FORM3?.claveUnidadMedidaPedimento
          );

          // Proceso Formulario
          this.store.setDescripcionProcesoDestruccion(
            FORM4?.descripcionProcesoDestruccion
          );

          // Domicilio Formulario
          this.store.setDomicilioFormularioCalle(FORM5?.calle);
          this.store.setDomicilioFormularioCodigoPostal(FORM5?.codigoPostal);
          this.store.setDomicilioFormularioColonia(FORM5?.claveColonia);
          this.store.setDomicilioFormularioDelegacionMunicipio(
            FORM5?.claveDelegacionMunicipio
          );
          this.store.setDomicilioFormularioEntidadFederativa(
            FORM5?.claveEntidadFederativa
          );
          this.store.setDomicilioFormularioNombreComercial(
            FORM5?.nombreComercial
          );
          this.store.setDomicilioFormularioNumeroExterior(
            FORM5?.numeroExterior
          );
          this.store.setDomicilioFormularioNumeroInterior(
            FORM5?.numeroInterior
          );
          this.store.setDomicilioFormularioRfc(FORM5?.rfc);
        }
      });
  }

  /**
   * Cambia la pestaña activa.
   *
   * Este método actualiza el índice de la pestaña activa y llama al método correspondiente
   * del store para actualizar el estado.
   *
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.store.setPestanaActiva(this.indice);
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
