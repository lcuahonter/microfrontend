import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent,RegistroSolicitudService,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { PermisoSanitarioImportacionMedicamentosService } from '../../services/permiso-sanitario-importacion-medicamentos.service';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';
import { ViewChild } from '@angular/core';
import { GuardarAdapter_260212 } from '../../adapters/guardar-mapping.adapter';
import { Tramite260212Store  } from '../../estados/tramite260212.store';
import { Tramite260212Query } from '../../../260212/estados/tramite260212.query';

/**
 * @component PasoUnoComponent
 * @description Container component representing the first step of the procedure form.
 * It handles the selected tab index using state from `Tramite260212Query` and updates it via `Tramite260212Store`.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  providers: [PermisoSanitarioImportacionMedicamentosService],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.css',
})
export class PasoUnoComponent implements OnDestroy, OnChanges {
  /**
   * @input confirmarSinPagoDeDerechos
   * @description Indica si se confirma el paso sin pago de derechos.
   */
  @Input() confirmarSinPagoDeDerechos: number = 0;

  /**
   * @viewChild contenedorDeDatosSolicitudComponent
   * @description Referencia al componente hijo ContenedorDeDatosSolicitudComponent.
   */
  @ViewChild(ContenedorDeDatosSolicitudComponent)
  contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

  /**
   * @viewChild pagoDeDerechosContenedoraComponent
   * @description Referencia al componente hijo PagoDeDerechosContenedoraComponent.
   */
  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
   * @viewChild tercerosRelacionadosVistaComponent
   * @description Referencia al componente hijo TercerosRelacionadosVistaComponent.
   */
  @ViewChild(TercerosRelacionadosVistaComponent)
  tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;

  /**
   * @description Índice de la pestaña seleccionada.
   */
  indice: number = 2;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /**
   * Constructor del componente PasoUnoComponent.
   * 
   * @param consultaQuery Instancia de ConsultaioQuery para consultar el estado.
   * @param servico Servicio para gestionar los datos del trámite.
   * 
   * Suscribe al estado de consulta y actualiza la propiedad consultaState.
   * Si el procedimiento es '260212' y requiere actualización, guarda los datos del formulario.
   * Si no, marca que los datos de respuesta están listos.
   */
  constructor(
    public consultaQuery: ConsultaioQuery,
    public servico: PermisoSanitarioImportacionMedicamentosService,
    private registroSolicitudService: RegistroSolicitudService,
    private tramite260212Store: Tramite260212Store,
    private tramite260212Query: Tramite260212Query,
 
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (
      this.consultaState &&
      this.consultaState.procedureId === '260212' &&
      this.consultaState.update
    ) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  } 

  /**
   * Método del ciclo de vida de Angular que se llama cuando cambian las propiedades de entrada.
   * 
   * @param changes Cambios detectados en las propiedades de entrada.
   * 
   * Si cambia 'confirmarSinPagoDeDerechos' y no es el primer cambio, selecciona la pestaña correspondiente.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['confirmarSinPagoDeDerechos'] &&
      !changes['confirmarSinPagoDeDerechos'].firstChange
    ) {
      const CONFIRMAR_VALOR =
        changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }

  /**
   * @method guardarDatosFormulario
   * @description
   * Guarda los datos del formulario y actualiza el estado del formulario en base a la respuesta obtenida.
   *
   * Este método utiliza el servicio `PermisoSanitarioImportacionMedicamentosService` para obtener los datos
   * del trámite y actualiza el estado del formulario si se recibe una respuesta válida. Además, se asegura
   * de que la suscripción se cancele correctamente utilizando el operador `takeUntil` con el observable
   * `destroyNotifier$`.
   *
   * @returns {void} No devuelve ningún valor.
   */
  guardarDatosFormulario(): void {
    const SOLICITUDE_ID=Number(this.consultaState.id_solicitud)
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       this.registroSolicitudService.parcheOpcionesPrellenadas(260212,SOLICITUDE_ID).subscribe((res:any) => {
         if(res && res.datos){
           GuardarAdapter_260212.patchToStore(res.datos, this.tramite260212Store);
         }
       });
       this.esDatosRespuesta = true;
  }

  /**
   * Selecciona una pestaña (tab) en función del índice proporcionado.
   *
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
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

  /**
   * @method validarPasoUno
   * @description
   * Valida el primer paso del formulario verificando que tanto el contenedor de datos de la solicitud
   * como el de terceros relacionados sean válidos.
   *
   * @returns {boolean} Retorna true si ambos contenedores son válidos, de lo contrario false.
   */
  validarPasoUno(): boolean {
    const ESTABVALIDO =
      this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO =
      this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
    return ESTABVALIDO && ESTERCEROSVALIDO;
  }
}
