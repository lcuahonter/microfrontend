import { Component, ViewChild } from '@angular/core';
import { AVISO } from '@ng-mf/data-access-user';
import { AlertComponent } from '@ng-mf/data-access-user';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { DatosPasos } from '@ng-mf/data-access-user';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/paso-tres-steps.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { TODOS_PASOS, MSG_REGISTRO_EXITOSO } from '../../enums/solicitud32501.enum';
import { WizardComponent } from '@ng-mf/data-access-user';
import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';
import { GuardaSolicitud32501Request } from '../../models/solicitud-request.model';
import { Solicitud32501State, Solicitud32501Store } from '../../estados/solicitud32501.store';
import { Solicitud32501Query } from '../../estados/solicitud32501.query';
import { Subject, map, takeUntil } from 'rxjs';
import { CodigoRespuesta } from '../../../../core/enums/notificacion.enum';


/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    AlertComponent,
  ],
  providers: [MercanciasDesmontadasOSinMontarService],
})
/**
 * Componente que representa la página de solicitud.
 */
export class SolicitudPageComponent {


  constructor(
    public mercanciasDesmontadasOSinMontarService: MercanciasDesmontadasOSinMontarService,
    private solicitud32501Query: Solicitud32501Query,
    private solicitud32501Store: Solicitud32501Store
  ) { }

  public solicitudState!: Solicitud32501State; 

  folioTramite: number = 0;

  /**
   * Subject para controlar la destrucción de subscripciones (takeUntil).
   */
  private destroyed$ = new Subject<void>();

  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public formErrorAlert = `<div class="d-flex justify-content-center text-center">
  <div>
    <div class="col-md-12">
      Faltan campos por capturar.
    </div>
  </div>
</div>
`

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Mensaje que muestra folio temporal.
   */
  msgRegistroExitoso!: string;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

    /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   */
  @ViewChild(PasoDosComponent) pasoDosComponent!: PasoDosComponent;


  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Variable utilizada para almacenar el tipo de alerta.
   */
  alerta = TODOS_PASOS.Importante;

  /**
  * Mensaje de información para la alerta.
  */
  public infoAlert = 'alert-info';


  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
     * Constante que almacena el valor de la nota de privacidad.
     * 
     * @constant AVISO_PRIVACIDAD_ADJUNTAR - Almacena el valor definido en `NOTA.AVISO_PRIVACIDAD_ADJUNTAR`.
     * Se utiliza para adjuntar o gestionar el aviso de privacidad dentro del sistema.
     */
  AVISO_PRIVACIDAD_ADJUNTAR = AVISO.Aviso;

  /**
* Controla la visibilidad del mensaje de error cuando la validación de formularios falla.
* }
*/
  esFormaValido: boolean = false;


  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   */
  public getValorIndice(e: AccionBoton): void {

    if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarTodosLosFormularios();

        if (!isValid) {
          this.esFormaValido = true;
          this.datosPasos.indice = this.indice;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }

         this.mercanciasDesmontadasOSinMontarService
        .postGuardarSolicitud(this.obtenerValoresFormulario())
        .pipe(
          map((response) => {
            if(response.codigo === CodigoRespuesta.EXITO &&
          response.datos?.id_solicitud){
            this.solicitud32501Store.establecerDatos({
                  idSolicitud: response.datos?.id_solicitud
                });

              this.folioTramite = response.datos.id_solicitud;
              this.msgRegistroExitoso = MSG_REGISTRO_EXITOSO(
                              this.folioTramite.toString()                               
                            ) + this.alerta;
            }
          }

          )
        )
        .subscribe();
      }
     
      this.esFormaValido = false;
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      this.wizardComponent.siguiente();
      return;
    }

    this.indice = e.valor;
    this.datosPasos.indice = this.indice;
    this.wizardComponent.atras();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);

  }


  obtenerValoresFormulario(): GuardaSolicitud32501Request {
    this.solicitud32501Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuestaState: Solicitud32501State) => {
          this.solicitudState = respuestaState;
        })
      )
      .subscribe();

    if(this.solicitudState.ideGenerica1 === 'TAV.IMP') {

      return {
      solicitante: {
        rfc: this.solicitudState.solicitante.rfc,
        nombre: this.solicitudState.solicitante.denominacion,
        es_persona_moral: false,
        certificado_serial_number: 'sincertificadodigital'
      },
      direccion: {
        nombre_comercial: this.solicitudState.nombreComercial,
        cve_entidad: this.solicitudState.entidadFederativa ? String(this.solicitudState.entidadFederativa) : '',
        cve_deleg_mun: this.solicitudState.delegacionMunicipio ? String(this.solicitudState.delegacionMunicipio) : '',
        cve_colonia: this.solicitudState.colonia ? String(this.solicitudState.colonia) : '',
        calle: this.solicitudState.calle,
        num_exterior: this.solicitudState.numeroExterior,
        num_interior: this.solicitudState.numeroInterior,
        cp: this.solicitudState.codigoPostal
      },
      mercancia: {
        cve_fraccion_arancelaria: this.solicitudState.cveFraccionArancelaria ? String(this.solicitudState.cveFraccionArancelaria) : '',
        nico: this.solicitudState.nico,
        descripcion_mercancia: this.solicitudState.descripcionMercancia,
        peso: Number(this.solicitudState.peso),
        valor_usd: Number(this.solicitudState.valorUSD)
      }

    }

    } else {
      return {
      solicitante: {
        rfc: this.solicitudState.solicitante.rfc,
        nombre: this.solicitudState.solicitante.denominacion,
        es_persona_moral: false,
        certificado_serial_number: 'sincertificadodigital'
      },
      direccion: {
        nombre_comercial: this.solicitudState.nombreComercial,
        cve_entidad: this.solicitudState.entidadFederativa ? String(this.solicitudState.entidadFederativa) : '',
        cve_deleg_mun: this.solicitudState.delegacionMunicipio ? String(this.solicitudState.delegacionMunicipio) : '',
        cve_colonia: this.solicitudState.colonia ? String(this.solicitudState.colonia) : '',
        calle: this.solicitudState.calle,
        num_exterior: this.solicitudState.numeroExterior,
        num_interior: this.solicitudState.numeroInterior,
        cp: this.solicitudState.codigoPostal
      },
      mercancia: {
        cve_fraccion_arancelaria: undefined,
        descripcion_mercancia: undefined
      },
      id_transaccion_vu: this.solicitudState.idTransaccionVU ? this.solicitudState.idTransaccionVU : undefined,
      operacion_importacion: this.solicitudState.operacionDeImportacionLista

    }
    }
    

  }


}
