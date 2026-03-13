import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { FormularioDinamico, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { PARAMETERO } from '../../constantes/constantes';
import { SagarpaService } from '../../services/sagarpa/sagarpa.service';
import { Solicitud220501Query } from '../../estados/tramites220501.query';
import { Solicitud220501Store } from '../../estados/tramites220501.store';
import { Solicitud220502Query } from '../../../220502/estados/tramites220502.query';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';



/**
 * Componente para gestionar el paso uno del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
  standalone: false,
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {
  /** 
   * Referencia al componente SolicitanteComponent 
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente SolicitudComponent
   */
    @ViewChild(SolicitudComponent)
solicitud!: SolicitudComponent;

  /** 
   * Configuración del formulario para la persona moral 
   */
  persona: FormularioDinamico[] = [];

  /** 
   * Configuración del formulario para el domicilio fiscal 
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Estado de la consulta, utilizado para manejar el estado del formulario.
   */
  public consultaState!: ConsultaioState;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si se debe mostrar la sección de revisión documental.
   */
  mostrarRevisionDocumental: boolean = true;

  /**
   * Parámetro utilizado para determinar el tipo de datos a mostrar.
   * Se utiliza para decidir si se muestran los datos generales o los datos de la solicitud.
   */
  parametero = PARAMETERO;
   /**
   * Indica si el trámite se encuentra en estado de revisión documental.
   * @default false
   */
  isRevisionDocumental: boolean = false;

  /**
   * Cantidad de certificados pendientes de autorización.
   */
  pendientesAutorizadosCertificados!: number;

  /**
   * Referencia al componente SolicitudComponent
   */
  @ViewChild(SolicitudComponent) solicitudComponent!: SolicitudComponent;

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   * 
   * @param cdr Servicio para detectar cambios manualmente.
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private consultaQuery: ConsultaioQuery,
    private solicitud220501Store: Solicitud220501Store,
    private solicitud220502Query: Solicitud220502Query,
     private solicitud220501Query: Solicitud220501Query,
    private sagarpaService: SagarpaService,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.solicitud220501Query.selectSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((solicitud) => {
        this.pendientesAutorizadosCertificados = Number(solicitud.certificadosAutorizados);
      })
    ).subscribe();   

    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.mostrarRevisionDocumental = false;
          } else {
            this.mostrarRevisionDocumental = true;
          }
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
    this.sagarpaService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitud220501Store.setSagarpaState(resp.solicitud220501State);
          this.sagarpaService.actualizarEstadoFormulario(resp.solicitud220502State);
        }
      });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   * Configura los datos de persona y domicilio fiscal y asigna el tipo de persona en el componente `SolicitanteComponent`.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;

    setTimeout(() => {
      this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
      this.cdr.detectChanges();
    }, 0);
  }

/**
 * Marca todos los controles del paso uno como tocados para activar las validaciones.
 */
  public marcarPasoUno(): void {
  this.solicitud?.marcarTodosLosControles();
}

  /**
   * Método para seleccionar una pestaña.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
/**
 * Verifica si el paso uno del formulario es válido.
 * @returns 
 */
  public pasoUnoValido(): boolean {
  return this.solicitud?.formValid;
}

   /**
   * Actualiza el estado de revisión documental según el valor recibido.
   *
   * @param evento - Valor booleano que indica si el trámite está en revisión documental.
   */
  certificadosAutorizValor(evento: boolean): void {
    this.isRevisionDocumental = evento;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}