import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { Solicitud6101Store } from '../../estados/solicitud6101.store';
import { SolicitudService } from '../../services/solicitud/solicitud.service';

/**
 * Componente que representa el primer paso de un trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
})
/**
 * Componente que representa el primer paso de un trámite.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice utilizado para identificar la posición actual en un proceso o lista.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Identificador del trámite actual, recibido como propiedad de entrada del componente.
   */
  @Input() tramiteId!: string;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor de la clase.
   *
   * @param consultaQuery - Inyección del servicio de consulta tipo `ConsultaioQuery`.
   * @param solicitudService - Inyección del servicio de solicitud tipo `SolicitudService`.
   *
   * Nota: La inicialización se realizará en métodos específicos según sea necesario.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public solicitudService: SolicitudService,
    private solicitud6101Store: Solicitud6101Store
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
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
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void { 
    this.solicitudService
      .guardarDatosFormulario()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => {
        if (respuesta.success) {
          const FORM = respuesta?.datos?.solicitudForm;
          this.esDatosRespuesta = true;
          this.solicitud6101Store.actualizarAduanaAux(FORM?.aduanaAux);
          this.solicitud6101Store.actualizarJuntaTecnicaDerivada(FORM?.juntaTecnicaDerivada);
          this.solicitud6101Store.actualizarNumeroPedimento(FORM?.numeroPedimento);
          this.solicitud6101Store.actualizarNombreComercialMercancia(FORM?.nombreComercialMercancia);
          this.solicitud6101Store.actualizarDescDetalladaMercancia(FORM?.descDetalladaMercancia);
          this.solicitud6101Store.actualizarFraccionI(FORM?.fraccionI);
          this.solicitud6101Store.actualizarCapitulo(FORM?.capitulo);
          this.solicitud6101Store.actualizarPartida(FORM?.partida);
          this.solicitud6101Store.actualizarSubpartida(FORM?.subpartida);
          this.solicitud6101Store.actualizarSubdivision(FORM?.subdivision);
          this.solicitud6101Store.actualizarFraccionII(FORM?.fraccionII);
          this.solicitud6101Store.actualizarCapituloII(FORM?.capituloII);
          this.solicitud6101Store.actualizarPartidaII(FORM?.partidaII);
          this.solicitud6101Store.actualizarSubpartidaII(FORM?.subpartidaII);
          this.solicitud6101Store.actualizarSubdivisionII(FORM?.subdivisionII);
          this.solicitud6101Store.actualizarFraccionIII(FORM?.fraccionIII);
          this.solicitud6101Store.actualizarCapituloIII(FORM?.capituloIII);
          this.solicitud6101Store.actualizarPartidaIII(FORM?.partidaIII);
          this.solicitud6101Store.actualizarSubpartidaIII(FORM?.subpartidaIII);
          this.solicitud6101Store.actualizarSubdivisionIII(FORM?.subdivisionIII);
          this.solicitud6101Store.actualizarManifiestosSeleccionados(FORM?.manifiestosSeleccionados);
        }
      });
  }

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
