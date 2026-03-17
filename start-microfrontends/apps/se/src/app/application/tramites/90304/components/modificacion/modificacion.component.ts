import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { EmpresasLista, EmpresasListaResquesta, ModificacionResquesta } from '../../models/prosec.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Solicitud90304State, Tramite90304Store } from '../../estados/tramite90304.store';
import { Subject, map, takeUntil } from 'rxjs';
import { TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { ProducirMercanciasComponent } from '../../../../shared/components/producir-mercancias/producir-mercancias.component';
import { ProsecService } from '../../services/prosec/prosec.service';
import { TABLA_EMPRESAS_LISTA } from '../../constantes/prosec.enum';
import { Tramite90304Query } from '../../estados/tramite90304.query';

/**
 * Componente para mostrar la información de modificación de un trámite.
 * @component ModificacionComponent
 */
@Component({
  selector: 'app-modificacion',
  standalone: true,
  imports: [
    ProducirMercanciasComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TituloComponent
  ],
  templateUrl: './modificacion.component.html',
  styleUrl: './modificacion.component.scss'
})
export class ModificacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario de modificación
   * @type {FormGroup}
   */
  modificacionForm!: FormGroup;

  /**
   * Lista de empresas obtenidas del servicio
   * @type {EmpresasLista[]}
   */
  empresasLista: EmpresasLista[] = [];

  /**
   * Tabla de selección de empresas
   * @type {TablaSeleccion}
   */
  tablaSeleccion = TablaSeleccion.BUTTON;

  /**
   * Configuración de la tabla de empresas
   * @type {ConfiguracionColumna<EmpresasLista>[]}
   */
  configuracionTabla = TABLA_EMPRESAS_LISTA;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

   /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;
   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * Indica si el trámite está en estado de baja.
   * Cuando es `true`, el trámite está dado de baja.
   */
  isBaja: boolean = true;

   /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud90304State;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param prosecService - Servicio para gestionar datos relacionados con PROSEC.
   * @param consultaioQuery - Query para obtener el estado de la consultaio.
   * @param store - Store para gestionar el estado del trámite 90304.
   * @param query - Query para obtener el estado del trámite 90304.
   */
  constructor(
    private fb: FormBuilder,
    private prosecService: ProsecService,
    private consultaioQuery: ConsultaioQuery,
    private store: Tramite90304Store,
    private query: Tramite90304Query,
  ) {
    // constructor vacío
  }

  /**
   * Se ejecuta al inicializar el componente.
   * Llama a los métodos `obtenerModificacionDatos` y `obtenerEmpresasListaDatos` para obtener los datos necesarios.
   * Inicializa el formulario principal llamando a `crearModificacionForm`.
   * @returns {void}
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.obtenerEmpresasListaDatos();
    this.crearModificacionForm();
    this.obtenerModificacionDatos();
  }

  /**
   * Crea el formulario de modificación utilizando FormBuilder.
   * Inicializa los campos del formulario y los desactiva para evitar la edición directa.
   * @returns {void}
   */
  crearModificacionForm(): void {
    this.modificacionForm = this.fb.group({
      registroFederalContribuyentes: [{ value: '', disabled: true }],
      representacionFederal: [{ value: '', disabled: true }],
      tipoModificacion: [{ value: '', disabled: true }],
      modificacionPrograma: [{ value: '', disabled: true }],
    });
  }

  /**
   * Obtiene los datos de modificación desde el servicio `ProsecService`.
   * Se suscribe al observable y actualiza el formulario con los datos obtenidos.
   * @returns {void}
   */
  obtenerModificacionDatos(): void {
    this.prosecService.obtenerModificacionDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((modificacion: ModificacionResquesta) => {
        this.modificacionForm.patchValue({
          registroFederalContribuyentes: modificacion.data[0].registroFederalContribuyentes,
          representacionFederal: modificacion.data[0].representacionFederal,
          tipoModificacion: modificacion.data[0].tipoModificacion,
          modificacionPrograma: modificacion.data[0].modificacionPrograma,
        });
      });
  }

  /**
   * Obtiene la lista de empresas desde el servicio `ProsecService`.
   * Se suscribe al observable y almacena los datos en `empresasLista`.
   * @returns {void}
   */
  obtenerEmpresasListaDatos(): void {
    this.prosecService.obtenerEmpresasListaDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((empresas: EmpresasListaResquesta) => {
        this.empresasLista = empresas.data.length > 0 ? empresas.data : [];
      });
  }
  
  /**
   * Maneja el evento de clic en una fila de la tabla.
   * Solo procesa eventos de botones y mantiene la lógica de toggle correcta.
   * @param {Event} event - Evento de clic en la fila.
   * @returns {void}
   */
  onFilaClic(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    if (TARGET.tagName === 'BUTTON') {
      const CURRENT_TEXT = TARGET.textContent?.trim();
      if (CURRENT_TEXT === 'Baja') {
        this.isBaja = false;
        this.prosecService.setIsBaja(this.isBaja);
        this.store.setIsBaja(this.isBaja);
      } else if (CURRENT_TEXT === 'Activada' || CURRENT_TEXT === 'Activar') {
        this.isBaja = true;
        this.prosecService.setIsBaja(this.isBaja);
        this.store.setIsBaja(this.isBaja);
      }
    }
  }
  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}
