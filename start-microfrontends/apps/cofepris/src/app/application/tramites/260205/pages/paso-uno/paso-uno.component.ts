import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { GuardarAdapter_260205 } from '../../adapters/guardar-payload.adapter';
import { MateriasPrimasDestinadosService } from '../../services/material-primas-destinados.service';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDeDerechosContenedoraComponent } from "../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component";
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { Tramite260205Query } from '../../estados/queries/tramite260205.query';
import { Tramite260205Store } from '../../estados/stores/tramite260205.store';
/**
 * Decorador que define un componente Angular llamado `PasoUnoComponent`.
 * Este componente es parte de la aplicación y representa la primera etapa de un trámite específico.
 * 
 * @selector `app-paso-uno` - Selector utilizado para identificar este componente en las plantillas HTML.
 * @standalone `true` - Indica que este componente es independiente y no requiere un módulo específico.
 * @imports - Lista de módulos y componentes que se importan para ser utilizados dentro de este componente:
 *   - `CommonModule`: Proporciona directivas comunes de Angular como `ngIf` y `ngFor`.
 *   - `SolicitanteComponent`: Componente relacionado con la información del solicitante.
 *   - `ContenedorDeDatosSolicitudComponent`: Componente que contiene los datos de la solicitud.
 *   - `TercerosRelacionadosVistaComponent`: Componente para visualizar terceros relacionados.
 *   - `PagoDeDerechosComponent`: Componente para gestionar el pago de derechos.
 *   - `PagoDeDerechosContenedoraComponent`: Componente contenedor para el pago de derechos.
 * @templateUrl `./paso-uno.component.html` - Ruta del archivo HTML que define la estructura visual del componente.
 * @styleUrl `./paso-uno.component.scss` - Ruta del archivo SCSS que contiene los estilos específicos del componente.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosComponent,
    PagoDeDerechosContenedoraComponent
],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnDestroy, OnChanges {

  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * Índice numérico utilizado como referencia o posición actual.
   * Comienza en 1 por defecto.
   *
   * @type {number}
   */
  indice: number = 2;

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
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
   public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
   public esDatosRespuesta: boolean = false;

  /**
   * Constructor que inicializa el componente con las dependencias necesarias y configura
   * las suscripciones para manejar el índice de ruta previo y el estado de la consulta.
   * 
   * @param store - Almacén del estado para Tramite260205.
   * @param query - Consulta del estado de Tramite260205.
   * @param consultaQuery - Consulta del estado general (Consultaio).
   * @param materiasPrimasDestinadosService - Servicio para manejar materias primas destinadas.
  */
  constructor(
    protected store: Tramite260205Store,
    private query: Tramite260205Query,
    private consultaQuery: ConsultaioQuery,
    private materiasPrimasDestinadosService: MateriasPrimasDestinadosService,
    private registroSolicitudService: RegistroSolicitudService,
  ) {
    this.query.indicePrevioRuta$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((indice: number) => {
        if (indice) {
          this.indice = indice;
        }
      });
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$)).subscribe((seccionState) => {
      
        this.consultaState = seccionState;
        if (this.consultaState && this.consultaState.procedureId === '260205' &&
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
   * Guarda los datos del formulario y actualiza el estado del formulario en el servicio correspondiente.
   * 
   * Este método realiza una solicitud al servicio `materiasPrimasDestinadosService` para obtener los datos 
   * del trámite y, si la respuesta es válida, actualiza el estado del formulario con los datos obtenidos.
   * 
   * Utiliza el operador `takeUntil` para gestionar la suscripción y asegurarse de que se cancele 
   * cuando el observable `destroyNotifier$` emita un valor, evitando fugas de memoria.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @remarks
   * - Este método depende de `materiasPrimasDestinadosService` para realizar la solicitud y actualizar el estado.
   * - La propiedad `esDatosRespuesta` se establece en `true` si la respuesta del servicio es válida.
   * - Es importante asegurarse de que `destroyNotifier$` esté correctamente configurado para evitar problemas de suscripción.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
       this.registroSolicitudService.parcheOpcionesPrellenadas(260205,SOLICITUDE_ID).subscribe((res:any) => {
         if(res && res.datos){
           GuardarAdapter_260205.patchToStore(res.datos, this.store);
         }
       });
       this.esDatosRespuesta = true;

  }


  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * 
   * Este método se utiliza para realizar tareas de limpieza, como notificar a los observables
   * que deben finalizar y liberar recursos asociados al componente. En este caso, se envía
   * una señal al observable `destroyNotifier$` para indicar que debe completarse y finalizar.
   * 
   * Es importante implementar este método para evitar fugas de memoria y garantizar que
   * los recursos utilizados por el componente se liberen correctamente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Establece el índice seleccionado en el store.
   *
   * @param i - El índice a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.store.setIndice(i);
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
}
