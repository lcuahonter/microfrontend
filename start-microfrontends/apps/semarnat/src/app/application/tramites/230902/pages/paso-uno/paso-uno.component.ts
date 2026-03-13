import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioState, SolicitanteComponent, TIPO_PERSONA } from '@libs/shared/data-access-user/src';
import { map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosSolicitudComponent } from '../../components/datos-solicitud/datos-solicitud.component';
import { PagoDeDerechosComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { PermisoCitesService } from '../../services/permiso-cites.service';
import { Subject } from 'rxjs';
import { TercerosComponent } from '../../components/terceros/terceros.component';
import { Tramite230902Query } from '../../estados/tramite230902.query';

/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * El índice de la pestaña actualmente seleccionada.
   */
  indice: number = 1;

  /**
   * Indica si la tabla está deshabilitada.
   */
  isTablDisabled: boolean = false;

  /**
   * Indica si los datos de respuesta están disponibles.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Notificador para destruir las suscripciones.
   * Se utiliza para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta actual.
   */
  public consultaState!: ConsultaioState;

  /**
   * Referencia al componente SolicitanteComponent.
   */
  @ViewChild('solicitante') solicitante!: SolicitanteComponent;
  /**
   * @property {DatosSolicitudComponent} datosSolicitud
   * @description
   * Referencia al componente hijo `DatosSolicitudComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de datos de solicitud,
   * especialmente para validar los formularios de solicitud y mercancía.
   */
  @ViewChild('datosSolicitud') datosSolicitud!: DatosSolicitudComponent;

  /**
   * @property {TercerosComponent} tablaTerceros
   * @description
   * Referencia al componente hijo `TercerosComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de terceros,
   * para gestionar la tabla de destinatarios y sus datos generales.
   */
  @ViewChild('terceros') tablaTerceros!: TercerosComponent;

  /**
   * @property {PagoDeDerechosComponent} pagoDerechos
   * @description
   * Referencia al componente hijo `PagoDeDerechosComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de pago de derechos,
   * especialmente para validar la información de pago y llave de pago.
   */
  @ViewChild('pagoDerechos') pagoDerechos!: PagoDeDerechosComponent;

  constructor(
    private tramite230901Query: Tramite230902Query,
    private permisoCitesService: PermisoCitesService,
    private consultaQuery: ConsultaioQuery
  ) {
    // do nothing
  }

  /**
   * Método del ciclo de vida OnInit.
   * Inicializa las suscripciones y el estado del componente.
   */
  ngOnInit(): void {
    this.tramite230901Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe(state => {
        this.isTablDisabled = state.tipodeMovimiento ? false : true;
      });

    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    ).subscribe();

    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Guarda los datos del formulario y actualiza el estado del formulario.
   */
  guardarDatosFormulario(): void {
    this.permisoCitesService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.permisoCitesService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método del ciclo de vida AfterViewInit.
   * Llama al método para obtener el tipo de persona del solicitante.
   */
  ngAfterViewInit(): void {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }

  /**
   * Método del ciclo de vida OnDestroy.
   * Limpia las suscripciones cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios de los componentes hijos en el orden siguiente:
   * - Solicitante
   * - Datos de solicitud
   * - Pago de derechos
   * 
   * Para cada componente, verifica si está disponible y si su formulario es válido.
   * Si algún formulario es inválido, marca sus controles como "tocados" para mostrar los errores de validación.
   * Si algún componente no está disponible o su formulario es inválido, establece `isValid` a `false`.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` si alguno no lo es o si falta algún componente.
   */
  public validarFormularios(): boolean {
  let isValid = true;

  if (this.solicitante?.form) {
    if (this.solicitante.form.invalid) {
      this.solicitante.form.markAllAsTouched();
      isValid = false;
    }
  } else {
    isValid = false;
  }

  if (this.datosSolicitud) {
    if (!this.datosSolicitud.validarFormulario()) {
      isValid = false;
    }
  } else {
    isValid = false;
  }

  if (this.pagoDerechos) {
    if (!this.pagoDerechos.validarFormulario()) {
      isValid = false;
    }
  } else {
    isValid = false;
  }

  return isValid;
  }

  /**
   * Selecciona una pestaña estableciendo su índice.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}