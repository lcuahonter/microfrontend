import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild, effect, inject, input, signal } from '@angular/core';
import { SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';

import { TABS_CAPTURAR_SOLICITUD } from '../../enum/230901.enum';

import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';

import { Solicitante, Tramite230901Store } from '../../estados/store/tramite230901.store';
import { DUMMY_SOLICITUD, DefaultValidacionFormularios } from '../../interfaces/catalogos.response';

import { TercerosComponent } from '../../components/terceros/terceros.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { UtilidadesService } from '../../services/utilidades.service';
import { SHARED_MODULES } from '../../shared-imports';
import { TabCapturarSolicitud, ValidacionFormularios } from '../../interfaces/catalogos.interface';


/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 * Este componente gestiona la selección de pestañas y el estado de habilitación
 * de las mismas basado en el estado del trámite.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: true,
  imports: [SHARED_MODULES,
    SolicitanteComponent,
    DatosSolicitudComponent,
    TercerosComponent,
    PagoDeDerechosComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class PasoUnoComponent implements OnInit {
  /** Referencia al componente WizardComponent. */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /** Injects  {Tramite230901Query} tramite230901Query - Servicio de consulta para el estado del trámite "230901". */
  private store = inject(Tramite230901Store)
  /**
 * Utilidades a reutilizar dentro del tramite
 */
  public utils = inject(UtilidadesService);
  /** 
 * Inicializa el estado del formulario 
*/
  public solicitudState = this.utils.solicitud;

  /** 
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
  */
  public consultaState = this.utils.consultaState;

  /** Indice  seleccionado por default inicia en 1 */
  indiceTab: number = 1;

  /**
    * Valida si el formulario esta validado par continuar el proceso caso contrario habilita el formulario requerido
  */
  esGuardarDatos = input<ValidacionFormularios>(DefaultValidacionFormularios);

  /** Indica si el formulario es valido.*/
  esFormValido = signal<boolean>(false);

  /** Listado de las pestañas paso 1 */
  listaDeTabs = signal<TabCapturarSolicitud[]>(TABS_CAPTURAR_SOLICITUD)

  constructor() {
    effect(() => {
      const VALUE = this.esGuardarDatos();
      const { isFormValid, isGuardForm, tabRequired } = VALUE;
      if (!isFormValid && isGuardForm) {
        this.indiceTab = tabRequired
      }
    })
  }

  ngOnInit(): void {
    if (this.consultaState().update) { this.guardarDatosFormulario() }
    if (this.solicitudState().cve_clasificacion_regimen !== '') {
      this.listaDeTabs.update(lista => lista.map((tab) => ({ ...tab, disabled: false })))
    }
  }

  /**
  * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
  * Si la respuesta es válida, activa el indicador de datos cargados.
  */
  guardarDatosFormulario(): void {
    this.store.establecerDatos(DUMMY_SOLICITUD)
    this.listaDeTabs.update(lista => lista.map((tab) => ({ ...tab, disabled: false })))
  }

  habilitarTerceros(e: boolean): void {
    this.listaDeTabs.update(lista => lista.map((tab) => ({ ...tab, disabled: !e })))
  }

  onDatosGeneralesLoaded(datosGenerales: DatosGeneralesModel): void {
    const { datos: DATOS } = datosGenerales;

    const DATOS_SOLICITANTE: Solicitante =
    {
      rfc: DATOS.rfc_original,
      certificado_serial_number: '',
      nombre: DATOS.identificacion.tipo_persona.toLowerCase() === 'f' ? `${DATOS.identificacion.nombre || ''} ${DATOS.identificacion.ap_paterno || ''} ${DATOS.identificacion.ap_materno || ''}` : DATOS.identificacion.razon_social
    };

    this.store.establecerDatos({ rol_capturista: DATOS.identificacion.tipo_persona.toLowerCase() === 'f' ? 'PersonaFisica' : 'PersonaMoral' })
    this.store.setDatosSolicitante(DATOS_SOLICITANTE);
  }

}
