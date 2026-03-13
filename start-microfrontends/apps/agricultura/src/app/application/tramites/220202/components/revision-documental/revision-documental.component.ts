import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { Subject, Subscription, map, takeUntil } from 'rxjs';
import {
  Catalogo,
  ConsultaioQuery,
  ConsultaioState,
} from '@ng-mf/data-access-user';
import {
  HojaTrabajoModel,
  ValidacionesModel,
} from '../../../../core/models/hoja-trabajo/hoja-trabajo.model';
import { CommonModule } from '@angular/common';
import { HojaTrabajoAgriculturaQuery } from '../../../../shared/queries/hoja-trabajo-agricultura.query';
import { HojaTrabajoAgriculturaStore } from '../../../../shared/estados/hoja-trabajo-agricultura.store';
import { HojaTrabajoComponent } from '../hoja-trabajo/hoja-trabajo.component';
import { HojaTrabajoService } from '../../services/220202/hoja-trabajo/hoja-trabajo.service';
import { OrdenServiciosTratamientoComponent } from '../orden-servicios-tratamiento/orden-servicios-tratamiento.component';
import { RemisionMuestrasDiagnosticoComponent } from '../remision-muestras-diagnostico/remision-muestras-diagnostico.component';
import { ResponseCatalogo } from '../../../../core/models/hoja-trabajo/response-catalogo.model';
import { ResponseHojaTrabajoModel } from '../../../../core/models/hoja-trabajo/response-hoja-trabajo.model';

@Component({
  selector: 'app-revision-documental',
  standalone: true,
  imports: [
    CommonModule,
    HojaTrabajoComponent,
    RemisionMuestrasDiagnosticoComponent,
    OrdenServiciosTratamientoComponent,
  ],
  templateUrl: './revision-documental.component.html',
  styleUrl: './revision-documental.component.scss',
})
/**
 * Class: RevisionDocumentalComponent
 *
 * Description:
 *  Aqui va la descripcion
 *
 *
 * @created 28 de noviembre 2025
 * @version 1.0
 * @category Componente
 */
export class RevisionDocumentalComponent implements OnInit, OnDestroy {
  @Output() siguienteEmit: EventEmitter<void> = new EventEmitter();
  /**
   * Servicio que gestiona las operaciones de hoja de trabajo
   * (consultas, catálogos, guardado, descargas, etc.).
   */
  private hojaTrabajoService: HojaTrabajoService = inject(HojaTrabajoService);

  /**
   * Arreglo de suscripciones creadas en el componente.
   * Se utiliza para cancelar las suscripciones en ngOnDestroy y evitar fugas de memoria.
   */
  subscription: Subscription[] = [];

  /**
   * Índice de la pestaña actual del componente hijo (tabs internos).
   */
  indice: number = 1;

  /**
   * Índice de la pestaña seleccionada en el componente padre
   * (si aplica una estructura de tabs anidados).
   */
  indicePadre: number = 1;

  /**
   * Folio del trámite actualmente seleccionado.
   * Se inicializa con un valor de ejemplo y se actualiza desde el estado de consulta.
   */
  folioTramite: string = '';

  /**
   * Nombre del dictaminador asociado al trámite/hoja de trabajo.
   * Se obtiene desde el estado de consulta.
   */
  nombreDictaminador: string = '';

  /**
   * Catálogo de tipos de laboratorio disponibles para el trámite.
   */
  tiposLaboratorio: Catalogo[] = [];

  /**
   * Catálogo de unidades de medida comerciales disponibles
   * para los formularios relacionados con la hoja de trabajo.
   */
  unidadMedidaComercial: Catalogo[] = [];

  /**
   * Bandera que indica si la pestaña de remisión de muestras debe estar disponible/visible.
   */
  tabRemision: boolean = false;

  /**
   * Bandera que indica si la pestaña de orden de servicios de tratamiento debe estar disponible/visible.
   */
  tabOrden: boolean = false;

  /**
   * Objeto que contiene el estado de validaciones de las diferentes secciones
   * de la hoja de trabajo.
   */
  validaciones!: ValidacionesModel;

  /**
   * Modelo completo de la hoja de trabajo, que agrega la información
   * de todas las secciones/steps del flujo.
   */
  dataCompleta!: HojaTrabajoModel;

  /**
   * Catálogo de nombres de laboratorio separados por tipo:
   * - autorizadoAprobado: laboratorios autorizados/aprobados.
   * - oficial: laboratorios oficiales.
   */
  nombresLaboratorios: {
    autorizadoAprobado: Catalogo[];
    oficial: Catalogo[];
  } = { autorizadoAprobado: [], oficial: [] };

  /**
   * Query que permite observar/leer el estado de la hoja de trabajo de agricultura.
   */
  private hojaTrabajoAgriculturaQuery: HojaTrabajoAgriculturaQuery = inject(
    HojaTrabajoAgriculturaQuery
  );

  /**
   * Store que administra y actualiza el estado de la hoja de trabajo de agricultura.
   */
  private hojaTrabajoAgriculturaStore: HojaTrabajoAgriculturaStore = inject(
    HojaTrabajoAgriculturaStore
  );

  /**
   * Query que permite acceder al estado global de la consulta (CONSULTAIO),
   * incluyendo datos como folio, usuario actual, etc.
   */
  private consultaioQuery: ConsultaioQuery = inject(ConsultaioQuery);

  /**
   * Estado actual de CONSULTAIO obtenido desde la query.
   */
  consultaState!: ConsultaioState;

  /**
   * Notificador utilizado para completar observables con takeUntil
   * al destruir el componente y así evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * Inicializa los catálogos necesarios para el flujo:
   * - Tipos de laboratorio (y sus nombres).
   * - Unidades de medida comerciales.
   */
  constructor() {
    this.catalogoTiposLaboratorio();
    this.catalogoUnidadMedidaComercial();
  }

  /**
   * Cambia la pestaña activa del componente.
   *
   * @param tab      Índice de la pestaña a seleccionar.
   * @param esPadre  Indica si el índice corresponde a la pestaña del componente padre.
   */
  seleccionaTab(tab: number, esPadre: boolean = false): void {
    if (esPadre) {
      this.indicePadre = tab;
      return;
    }
    if (this.tabOrden && tab === 3) {
      this.indice = tab;
    }
    if (this.tabRemision && tab === 2) {
      this.indice = tab;
    }
    if (tab === 1) {
      this.indice = tab;
    }
  }

  /**
   * Guarda la información completa de la hoja de trabajo en el backend.
   * Asigna el folio de trámite al modelo completo y, al responder el backend,
   * almacena el id de la hoja de trabajo en el store.
   */
  guardar(esSiguiente: boolean = false): void {
    this.dataCompleta.num_folio_tramite = this.folioTramite;
    this.subscription.push(
      this.hojaTrabajoService
        .guardarHojaTrabajo('220202', this.dataCompleta)
        .subscribe({
          next: (data: ResponseHojaTrabajoModel) => {
            this.hojaTrabajoAgriculturaStore.setIdHojaTrabajo({
              id_hoja_trabajo: data.datos.id_hoja_trabajo ?? 0,
              orden_tratamiento: data.datos?.orden_tratamiento?.orden_tratamiento ?? 0,
              remision_muestra: data.datos?.remision_muestra?.remision_muestra ?? 0,
            });
            if (esSiguiente) {
              this.siguienteEmit.emit();
            }
          },
        })
    );
  }

  /**
   * Consulta los nombres de laboratorio para un tipo de laboratorio específico
   * y los asigna al catálogo correspondiente (autorizado/aprobado u oficial).
   *
   * @param tipoLaboratorio Elemento del catálogo que representa el tipo de laboratorio.
   */
  catalogoNombresLaboratorio(tipoLaboratorio: Catalogo): void {
    this.subscription.push(
      this.hojaTrabajoService
        .catalogoNombresLaboratorio('220202', tipoLaboratorio.clave ?? '')
        .subscribe({
          next: (data: ResponseCatalogo) => {
            if (tipoLaboratorio.descripcion === 'Autorizado/Aprobado') {
              this.nombresLaboratorios.autorizadoAprobado = data.datos;
            } else {
              this.nombresLaboratorios.oficial = data.datos;
            }
          },
        })
    );
  }


  /**
   * Envía al emit al componente padre para ocultar hoja trabajo y mostrar dictaminar.
   * Se utiliza como paso siguiente en el flujo (por ejemplo, avanzar de pantalla).
   */
  siguiente(): void {
    if (
      this.validaciones.hojaTrabajo &&
      this.validaciones.remisionMuestra &&
      this.validaciones.ordenTratamiento
    ) {
      this.guardar(true);
    }
  }

  /**
   * Consulta el catálogo de tipos de laboratorio para el trámite
   * y lo almacena en la propiedad tiposLaboratorio.
   * Además, precarga los catálogos de nombres para los primeros tipos obtenidos.
   */
  catalogoTiposLaboratorio(): void {
    this.subscription.push(
      this.hojaTrabajoService.catalogoTiposLaboratorio('220202').subscribe({
        next: (data: ResponseCatalogo) => {
          this.tiposLaboratorio = data.datos;
          this.catalogoNombresLaboratorio(this.tiposLaboratorio[0]);
          this.catalogoNombresLaboratorio(this.tiposLaboratorio[1]);
        },
      })
    );
  }

  /**
   * Consulta el catálogo de unidades de medida comerciales para el trámite
   * y lo almacena en la propiedad unidadMedidaComercial.
   */
  catalogoUnidadMedidaComercial(): void {
    this.subscription.push(
      this.hojaTrabajoService
        .catalogoUnidadMedidaComercial('220202')
        .subscribe({
          next: (data: ResponseCatalogo) =>
            (this.unidadMedidaComercial = data.datos),
        })
    );
  }

  /**
   * - Suscribe al estado de la hoja de trabajo para obtener la información completa,
   *   las validaciones y determinar qué pestañas deben estar activas.
   * - Suscribe al estado de CONSULTAIO para obtener el folio de trámite
   *   y el nombre del dictaminador actual.
   */
  ngOnInit(): void {
    this.hojaTrabajoAgriculturaQuery.selectHojaTrabajo$.subscribe((next) => {
      this.dataCompleta = next;
      this.tabRemision = next.requiere_toma_muestra;
      this.tabOrden = next.requiere_tratamiento;
      this.validaciones = next.validaciones;
    });

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          this.folioTramite = seccionState.folioTramite;
          this.nombreDictaminador = seccionState.current_user;
        })
      )
      .subscribe(() => ({}));
  }

  /**
   * - Cancela todas las suscripciones almacenadas en el arreglo subscription.
   * - Emite y completa el Subject destroyNotifier$ para finalizar los streams
   *   que usan takeUntil.
   */
  ngOnDestroy(): void {
    this.subscription.forEach((sub: Subscription) => sub.unsubscribe());
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
