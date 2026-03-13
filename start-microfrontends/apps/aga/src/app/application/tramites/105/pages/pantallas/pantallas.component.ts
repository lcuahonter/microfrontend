import { Component, ViewChild,EventEmitter } from '@angular/core';
import { AccionBoton,RegistroSolicitudService, esValidObject,getValidDatos } from '@ng-mf/data-access-user';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { PASOS } from '@ng-mf/data-access-user';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { DatosComponent } from '../datos/datos.component';
import { Tramite105Store,Solicitud105State } from '../../estados/tramite105.store';
import { Tramite105Query } from '../../estados/tramite105.query';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';

/**
 * Este componente se utiliza para mostrar los pasos del asistente - 220401
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'app-pantallas',
  standalone: false,
  templateUrl: './pantallas.component.html',
})

export class PantallasComponent {
    /**
   * Referencia al componente DatosDelTramiteDosComponent para validar el formulario del paso dos.
   */
    @ViewChild(DatosComponent) datosComponent!: DatosComponent;
  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;
  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se utiliza para referenciar la solicitud en curso.
   */
  idSolicitudState: number | null = 0;
 /**
  * @property {Solicitud105State} solicitudState
  * @description
  * Estado actual de la solicitud del trámite 105.
  */
  solicitudState!: Solicitud105State;
  
 /**
  * Indica si la sección de carga de documentos está activa.
  * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
  */
  seccionCargarDocumentos: boolean = true;
    /**
   * @description
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

   /**
   * Indica si la carga de documentos está en progreso.
   * Se inicializa en true para indicar que la carga está en progreso al inicio.
   */
  cargaEnProgreso: boolean = true;
 /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de carga de documentos.
   */
  cargarArchivosEvento = new EventEmitter<void>();
   /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  
  public isPeligro: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  activarBotonCargaArchivos: boolean = false;
  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string = 'Faltan campos por capturar.';
  /**
   * Referencia al componente WizardComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Esta variable se utiliza para almacenar los datos de los pasos.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  constructor(
    private tramite105Store: Tramite105Store,
    public registroSolicitudService: RegistroSolicitudService,
    private toastrService: ToastrService,
     private tramite105Query: Tramite105Query
  ) {
     this.tramite105Query.selectSolicitud$.pipe(
      takeUntil(this.destroyed$)).subscribe((solicitudState) => {
        this.solicitudState = solicitudState;
    });
  }

  /**
   * Este método se utiliza para establecer el índice del paso.
   */
  getValorIndice(e: AccionBoton): void {
    this.isPeligro = false;
     this.datosComponent.validarDatosDelTramiteDos(); 
      this.datosComponent.validarDatosDelTramiteUno(); 
      let storeStateVal = this.tramite105Store.getValue(); // or this.tramite105Query.getValue();
    if (e.valor > 0 && e.valor < 5) {
     if((storeStateVal.validFormularioTramiteDo===true && storeStateVal.validFormularioUno===true) && (e.valor > 0 && e.valor < 5)){
       this.guardarDatosApi(e);
        }
     else {
        this.isPeligro = true;
        return;
}
    }
  }
  /**
  * Emite un evento para cargar archivos.
  * {void} No retorna ningún valor.
  */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

    /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado del botón de carga de archivos.
   * @param carga - Indica si la carga de documentos está activa o no.
   * @returns {void} No retorna ningún valor.
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }
 /**
 * @method anterior
 * @description
 * Método para navegar programáticamente al paso anterior del wizard.
 * Ejecuta la transición backward en el componente wizard y actualiza los
 * índices correspondientes para mantener sincronización de estado.
 * 
 */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
    /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   * @param cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * @returns {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  /**
   * Método para manejar el evento de carga en progreso.
   * @param carga Indica si la carga está en progreso.
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
  /**
        * @method guardarDatosApi
        * @description
        * Guarda los datos del formulario en la API y maneja la navegación del wizard según la respuesta.
        * Actualiza el estado de error, muestra mensajes y sincroniza el identificador de la solicitud.
        *
        * @param {AccionBoton} e - Acción del botón presionado (continuar o anterior).
        * @api_call
        * Realiza llamada a la API para guardar datos usando el adaptador correspondiente.
        * Maneja la respuesta:
        * - Si hay error, muestra alerta y regresa al primer paso.
        * - Si es exitoso, actualiza el ID de la solicitud y navega al paso correspondiente.
        * - Muestra mensajes de éxito o error usando Toastr.
        * @state_update
        * Actualiza:
        * - `formErrorAlert`, `esFormaValido`, `indice`, `datosPasos.indice`, `wizardComponent.indiceActual`, `idSolicitudState`
        * @navigation_control
        * Controla navegación del wizard según la acción y respuesta.
        */
       guardarDatosApi(e: AccionBoton): void {
         let storeStateVal = this.tramite105Store.getValue();
         const PAYLOAD = {
           aduana: "200",
           calle: "234234",
           codigoPostal: "23423",
           colonia: "07442950004",
           depositoFiscalGas: false,
           depositoFiscalVehiculos: false,
           distribucionGas: "0",
           domicilio: true,
           entidadFederativa: "BCS",
           entidadFederativaDos: null,
           exportacion: true,
           fraccionarancelaria: null,
           importacion: false,
           industriaAutomotriz: "0",
           localidad: "234234",
           mercanciTablaDatos: [
             {
               descripcion: "Con pedigree o certificado de alto registro",
               descripcionAdicional: "234234",
               fraccionArancelaria: "01039101 - Con pedigree o certificado de alto registro"
             }
           ],
           motivoNoDespachoAduana: "23423434",
           municipioDelegacion: "14014",
           numeroExterior: "32432",
           numeroInterior: "4324324",
           operaciones: "02",
           pais: "AND",
           procedimientoCargaDescarga: "234234",
           registradosTablaDatosRegistore: [
             {
               nombres: "234234",
               numeroPatente: "4234",
               operaciones: "01",
               primerApellido: "234324",
               segundoApellido: "23423"
             }
           ],
           serviciosTerceros: "0",
           sistemasMedicionUbicacion: "234234234",
           ubicacion: false,
           ubicacionDescripcion: "",
           validFormularioTramiteDo: true,
           validFormularioUno: true
         };
         let shouldNavigate = false;
         this.registroSolicitudService.postGuardarDatos('105', PAYLOAD).subscribe(response => {
           shouldNavigate = response.codigo === '00';
           if (shouldNavigate) {
             if (esValidObject(response) && esValidObject(response.datos)) {
               const DATOS = response.datos as { id_solicitud?: number };
               const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
               this.idSolicitudState = ID_SOLICITUD;
               this.tramite105Store.setIdSolicitud(ID_SOLICITUD);
             }
             // Calcular el nuevo índice basado en la acción
             let indiceActualizado = e.valor;
             if (e.accion === 'cont') {
               indiceActualizado = e.valor;
             }
             this.toastrService.success(response.mensaje);
             if (indiceActualizado > 0 && indiceActualizado < 5) {
               this.indice = indiceActualizado;
               this.datosPasos.indice = indiceActualizado;
               if (e.accion === 'cont') {
                 this.wizardComponent.siguiente();
               } else {
                 this.wizardComponent.atras();
               }
             }
           } else {
             this.toastrService.error(response.mensaje);
           }
         });
       }
        /**
 * @method siguiente
 * @description
 * Método para navegar programáticamente al siguiente paso del wizard.
 * Ejecuta la transición forward en el componente wizard y actualiza los
 * índices correspondientes para mantener sincronización de estado.
 * 
 */
  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
      }