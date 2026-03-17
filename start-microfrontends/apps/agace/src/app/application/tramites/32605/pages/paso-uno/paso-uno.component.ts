import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CTPATComponent } from '../../components/c-tpat/c-tpat.component';
import { DatosComunesComponent } from '../../components/datos-comunes/datos-comunes.component';
import { ImportadorExportadorComponent } from '../../components/importador-exportador/importador-exportador.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { SolicitudService } from '../../services/solicitud.service';
import { TercerosRelacionadosComponent } from '../../components/terceros-relacionados/terceros-relacionados.component';


/**
 * Componente que representa el primer paso de un trámite.
 * Maneja la visualización y activación de diferentes secciones (tabs) según el tipo de endoso.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Índice utilizado para identificar la pestaña activa dentro del paso.
   */
  indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  public perfiles: string | number = '';

  /**
   * @desc Valor seleccionado para el campo de reconocimiento mutuo en el formulario.
   * @remarks Utilizado para almacenar la opción elegida por el usuario en el paso uno del trámite.
   */
  reconocimientoMutuoValue: string = '';

  /**
   * Referencia al componente ImportadorExportadorComponent para acceder a sus métodos de validación.
   * Permite validar el formulario de datos de importador/exportador antes de continuar al siguiente paso.
   */
  @ViewChild('importadorExportadorRef')
  importadorExportadorComponent!: ImportadorExportadorComponent;

  /**
   * Referencia al componente TercerosRelacionadosComponent para acceder a sus métodos de validación.
   * Permite validar los formularios de terceros relacionados incluyendo representante legal,
   * enlace operativo y personas de notificaciones.
   */
  @ViewChild('tercerosRelacionadosRef')
  tercerosRelacionadosComponent!: TercerosRelacionadosComponent;

  /**
   * Referencia al componente DatosComunesComponent para acceder a sus métodos de validación.
   * Permite validar el formulario de datos comunes antes de continuar al siguiente paso.
   */
  @ViewChild('datosComunesRef') datosComunesComponent!: DatosComunesComponent;

  /**
   * Referencia al componente CTPATComponent para acceder a sus métodos de validación.
   * Permite validar el formulario de CTPAT antes de continuar al siguiente paso.
   */
  @ViewChild('ctpatRef') ctpatComponent!: CTPATComponent;
  /**
   * Lista de secciones del formulario.
   * Lista de pasos dentro del formulario con sus respectivos componentes.
   */
  seccionesDeLaSolicitud = [
    { index: 1, title: 'Solicitante', component: 'solicitante' },
    { index: 2, title: 'Datos Comunes', component: 'datos-comunes' },
    {
      index: 3,
      title: 'Terceros Relacionados',
      component: 'terceros-relacionados',
    },
    {
      index: 4,
      title: 'Importador y/o Exportador',
      component: 'importador-exportador',
    },
    { index: 5, title: 'CTPAT', component: 'c-tpat' },
    { index: 6, title: 'Perfiles', component: 'perfiles' },
  ];

  constructor(
    private consultaQuery: ConsultaioQuery,
    public solicitudService: SolicitudService
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.solicitudService
      .obtenerDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitudService.actualizarEstado(resp);
        }
      });
  }

  /**
   * Cambia la pestaña activa según el índice proporcionado.
   * El índice de la pestaña que se desea activar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  /**
   * Valida todos los formularios del paso uno.
   * Retorna true si todos los formularios son válidos, false en caso contrario.
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

    if (this.datosComunesComponent) {
      const DATOS_COMUNES_VALID =
        this.datosComunesComponent.validarFormulario();
      if (!DATOS_COMUNES_VALID) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.tercerosRelacionadosComponent) {
      if (!this.tercerosRelacionadosComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.importadorExportadorComponent) {
      if (!this.importadorExportadorComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.ctpatComponent) {
      if (!this.ctpatComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * Maneja los cambios en el valor de perfiles.
   *
   * Este método asigna el valor recibido (`string` o `number`) a la
   * propiedad interna `perfiles`, para mantener actualizado el estado
   * del componente.
   *
   * @param {string | number} evento - Identificador o valor del perfil seleccionado.
   * @returns {void}
   */
  perfilesChanges(evento: string | number): void {
    this.perfiles = evento;
  }

  /**
   * Determina si una pestaña debe mostrarse en la interfaz.
   *
   * - Para la pestaña con índice **5**, solo se mostrará si
   *   `reconocimientoMutuoValue` es igual a `'1'`.
   * - Para la pestaña con índice **6**, solo se mostrará si
   *   `perfiles` es igual a `'1'`.
   * - En cualquier otro caso, siempre retorna `true` (la pestaña se muestra).
   *
   * @param {number} tabIndex - Índice de la pestaña que se evalúa.
   * @returns {boolean} `true` si la pestaña debe mostrarse, `false` en caso contrario.
   *
   * @example
   * <!-- Uso en template -->
   * <ng-container *ngIf="mostrarTab(5)">
   *   <app-tab-reconocimiento></app-tab-reconocimiento>
   * </ng-container>
   */
  mostrarTab(tabIndex: number): boolean {
    if (tabIndex === 5) {
      return this.reconocimientoMutuoValue === '1';
    }
    if (tabIndex === 6) {
      return this.perfiles === '1';
    }
    return true;
  }

  /**
   * Maneja el cambio de valor para el reconocimiento mutuo.
   * Actualiza la propiedad `reconocimientoMutuoValue` con el valor seleccionado.
   *
   * El nuevo valor seleccionado para reconocimiento mutuo.
   */
  onReconocimientoMutuoChange(value: string): void {
    this.reconocimientoMutuoValue = value;
  }
}
