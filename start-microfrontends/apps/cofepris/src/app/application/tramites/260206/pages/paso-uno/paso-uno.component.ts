import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { SeccionLibStore, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260206 } from '../../adapters/guardar-payload.adapter';
import { MaquilaMateriasPrimasService } from '../../services/maquila-materias-primas.service';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { SECCIONES_TRAMITE_260206 } from '../../constantes/maquila-materias-primas.enum';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';
import { Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy, OnChanges {

  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * @private
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo la limpieza de suscripciones
   * y otros recursos para evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Índice que representa el número actual o posición en un flujo o proceso.
   * Se inicializa con un valor predeterminado de 1.
   */
  public indice: number | undefined = 1;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
   public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
   public esDatosRespuesta: boolean = false;

   /**
          * @property {ContenedorDeDatosSolicitudComponent} contenedorDeDatosSolicitudComponent
          * @description
          * Referencia al componente hijo `ContenedorDeDatosSolicitudComponent` obtenida
          * mediante el decorador `@ViewChild`.
          *
          * Esta propiedad permite invocar métodos públicos del contenedor y acceder
          * a sus propiedades, por ejemplo para delegar la validación del formulario
          * interno (`validarContenedor()`).
          *
          * > Nota: Angular inicializa esta referencia después de que la vista
          * ha sido cargada, comúnmente en el ciclo de vida `ngAfterViewInit`.
          */
         @ViewChild(ContenedorDeDatosSolicitudComponent)
         contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;
     
         @ViewChild(PagoDeDerechosContenedoraComponent)
         pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;
     
         @ViewChild(TercerosRelacionadosVistaComponent)
         tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;
     
   

  /**
   * Constructor de la clase PasoUnoComponent.
   * 
   * @param seccionStore - Servicio para gestionar el estado de las secciones.
   * @param tramite260206Store - Almacén público para manejar el estado del trámite 260206.
   * @param Tramite260206Query - Consulta para obtener información relacionada con el trámite 260206.
   * 
   * Este constructor inicializa el componente y llama al método `asignarSecciones` 
   * para configurar las secciones necesarias.
   */
  constructor(private seccionStore: SeccionLibStore,
    public tramite260206Store: Tramite260206Store,
    private Tramite260206Query: Tramite260206Query,
    private consultaQuery: ConsultaioQuery,
    private materiasPrimasService: MaquilaMateriasPrimasService,
    private registroSolicitudService: RegistroSolicitudService,

  ){
    this.asignarSecciones();
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$)).subscribe((seccionState) => {
      this.consultaState = seccionState;
      if (this.consultaState && this.consultaState.procedureId === '260206' &&
        this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    }); 
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
        const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
        if (CONFIRMAR_VALOR) {
          this.seleccionaTab(CONFIRMAR_VALOR);
        }
      }
    }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
          this.registroSolicitudService.parcheOpcionesPrellenadas(260206,SOLICITUDE_ID).subscribe((res:any) => {
            if(res && res.datos){
              GuardarAdapter_260206.patchToStore(res.datos, this.tramite260206Store);
            }
          });
          this.esDatosRespuesta = true;

  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable `getTabSeleccionado$` del servicio `Tramite260206Query`
   * para obtener el índice de la pestaña seleccionada y lo asigna a la propiedad `indice`.
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria
   * al destruir el componente.
   */
  ngOnInit(): void {
    this.Tramite260206Query.getTabSeleccionado$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((tab) => {
      this.indice = tab;
    });
  }

   /**
   * @description
   * Método que se encarga de validar el primer paso del flujo.
   *
   * Invoca al método `validarContenedor()` del componente hijo
   * `ContenedorDeDatosSolicitudComponent` para comprobar si los
   * datos del formulario son correctos.
   *
   * En caso de que el componente hijo no esté disponible o
   * retorne `null/undefined`, se devuelve `false` por defecto.
   *
   * @returns {boolean}
   * - `true`: si el contenedor y su formulario interno son válidos.
   * - `false`: si el contenedor no es válido o no está disponible.
   */
   validarPasoUno(): boolean {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
    return (
      (ESTABVALIDO && ESTERCEROSVALIDO)? true : false

    );
  }

  /**
   * Valida todos los pasos del formulario.
   *
   * Invoca los métodos de validación de los componentes hijos:
   * - ContenedorDeDatosSolicitudComponent
   * - TercerosRelacionadosVistaComponent
   * - PagoDeDerechosContenedoraComponent
   *
   * @returns {boolean}
   * - `true` si todos los componentes son válidos.
   * - `false` si alguno no es válido o no está disponible.
   */
  validarTodosLosPasos(): boolean {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  }

  /**
   * Cambia la pestaña seleccionada en el componente.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.tramite260206Store.updateTabSeleccionado(i);
  }

  /**
   * Método para asignar las secciones existentes al stored
   */
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_260206
    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (Object.prototype.hasOwnProperty.call(PREDETERMINADO.PASO_1, LLAVE_SECCION)) {
        // @ts-expect-error - fix this
        SECCIONES.push(PREDETERMINADO.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
