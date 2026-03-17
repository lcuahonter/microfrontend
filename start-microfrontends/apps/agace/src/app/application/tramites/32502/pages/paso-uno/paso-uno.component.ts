import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioState, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { map, takeUntil } from 'rxjs';
import { AvisoService } from '../../services/aviso.service';
import { ConsultaioQuery} from '@ng-mf/data-access-user';
import { EventEmitter } from '@angular/core';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { Output } from '@angular/core';
import { Solicitud32502State } from '../../../../estados/tramites/tramite32502.store';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [CommonModule, SolicitanteComponent, SolicitudComponent],
})
export class PasoUnoComponent implements OnInit,OnDestroy, AfterViewInit {

  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  tipoPersona!: number;
  persona: FormularioDinamico[] = [];
  domicilioFiscal: FormularioDinamico[] = [];
  indice: number = 1;
    /**
   * Observable utilizado para limpiar las suscripciones al destruir el componente.
   * Esto ayuda a evitar fugas de memoria.
   */
    private notificadorDestruccion$: Subject<void> = new Subject();
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 
    /**
    * Indica si los datos de respuesta del servidor están disponibles.
    */
    public datosRespuestaDisponibles: boolean = false;
  
    /**
   * Referencia al componente `solicitudComponent`.
   */
  @ViewChild('solicitudComponent', { static: false }) solicitudComponent: SolicitudComponent | undefined;

    /**
     * Estado actual de la consulta.
     */
    public estadoConsulta!: ConsultaioState;
  /**
   * Emite evento cuando se cambia de tab para ocultar error message.
   */
  @Output() cambioDePestana = new EventEmitter<void>();

  /**
/**
* Constructor del componente.
* Inicializa los servicios y dependencias necesarias.
*/
constructor( private AvisoService:AvisoService,
private consultaQuery: ConsultaioQuery,
) {
//no hacer nada
this.consultaQuery.selectConsultaioState$
.pipe(  
  takeUntil(this.notificadorDestruccion$),
  map((seccionState: { readonly: boolean })=>{
    this.esFormularioSoloLectura = seccionState.readonly; 
  })
)
.subscribe();
}

/**
   * Hook del ciclo de vida que se llama al inicializar el componente.
   * Realiza la suscripción al estado de la consulta y obtiene los datos de la bandeja de solicitudes si es necesario.
   */
     ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSeccion) => {
        this.estadoConsulta = estadoSeccion;
      });

    if (this.estadoConsulta.update) {
      this.obtenerDatosBandejaSolicitudes();
    } else {
      this.datosRespuestaDisponibles = true;
    }
  }

  /**
   * Obtiene los datos de la bandeja de solicitudes desde el servidor.
   */
  obtenerDatosBandejaSolicitudes(): void {
    this.AvisoService.obtenerDatosEstado()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((datos: Solicitud32502State) => {
        if (datos) {
          this.datosRespuestaDisponibles = true;
          this.AvisoService.establecerDatosEstado(datos);
        }
      });
  }

   /**
   * Valida todos los formularios del paso uno.
   * 
   * Este método valida principalmente el formulario de solicitante que es el único
   * obligatorio. Los otros formularios solo se validan si están disponibles.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` en caso contrario.
   */
   public validarTodosLosFormularios(): boolean {
    let allFormsValid = true;
        
    // Validar el formulario de certificado de origen si existe y es visible
    if (this.indice >= 2 && this.solicitudComponent && (this.solicitudComponent.extranjeroAvisoAgace|| this.solicitudComponent.mercanciaST|| this.solicitudComponent.direccionST || this.solicitudComponent.pedimentoST)) {
      this.solicitudComponent.extranjeroAvisoAgace.markAllAsTouched();
      this.solicitudComponent.mercanciaST.markAllAsTouched();
      this.solicitudComponent.direccionST.markAllAsTouched();
      this.solicitudComponent.pedimentoST.markAllAsTouched();
      if (!this.solicitudComponent.extranjeroAvisoAgace.valid || !this.solicitudComponent.mercanciaST.valid || !this.solicitudComponent.direccionST.valid || !this.solicitudComponent.pedimentoST.valid) {
        allFormsValid = false;
      }
      
    }
    return allFormsValid ;
  }
  /**
   * Hook del ciclo de vida que se llama cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
  ngAfterViewInit(): void {

    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  seleccionaTab(i: number): void {
    this.indice = i;
      this.cambioDePestana.emit();
  }
}