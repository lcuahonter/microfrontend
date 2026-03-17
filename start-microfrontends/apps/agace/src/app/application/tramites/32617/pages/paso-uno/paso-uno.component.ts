import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CTPATComponent } from '../../components/c-tpat/c-tpat.component';

import { DatosComunesComponent } from '../../components/datos-comunes/datos-comunes.component';
import { ImportadorExportadorComponent } from '../../components/importador-exportador/importador-exportador.component';
import { OeaTercerizacionLogisticaRegistroService } from '../../services/oea-tercerizacion-logistica-registro.service';
import { StoreResponse } from '../../estados/tramites32617.store';
import { TercerosRelacionadosComponent } from '../../components/terceros-relacionados/terceros-relacionados.component';

/**
 * Componente que representa el primer paso de un trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.scss'],
})
/**
 * Componente que representa el primer paso de un trámite.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {

    /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;
  
  /**
   * Índice utilizado para identificar la posición actual en un proceso o lista.
   * @type {number}
   */
  indice: number = 1;

      /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente ImportadorExportadorComponent para acceder a sus métodos de validación.
   * Permite validar el formulario de datos de importador/exportador antes de continuar al siguiente paso.
   */
  reconocimientoMutuoValue: string[] = [];

   /**
   * Referencia al componente ImportadorExportadorComponent para acceder a sus métodos de validación.
   * Permite validar el formulario de datos de importador/exportador antes de continuar al siguiente paso.
   */
  @ViewChild('importadorExportadorRef')importadorExportadorComponent!: ImportadorExportadorComponent;

  /**
   * Referencia al componente TercerosRelacionadosComponent para acceder a sus métodos de validación.
   * Permite validar los formularios de terceros relacionados incluyendo representante legal,
   * enlace operativo y personas de notificaciones.
   */
  @ViewChild('tercerosRelacionadosRef') tercerosRelacionadosComponent!: TercerosRelacionadosComponent;

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
    { index: 3, title: 'Terceros Relacionados', component: 'terceros-relacionados' },
    { index: 4, title: 'Tercerización Logística', component: 'importador-exportador' },
    { index: 5, title: 'CTPAT', component: 'c-tpat' },
    { index: 6, title: 'Perfiles', component: 'perfiles' }
  ];

  /**
   * Estado actual de la consulta obtenido desde el store global.
   * Contiene la información relevante para el flujo del trámite en este paso.
   */
  public consultaState!:ConsultaioState;

    constructor(
    @Inject(OeaTercerizacionLogisticaRegistroService)
    public registroService: OeaTercerizacionLogisticaRegistroService,
    public consultaQuery: ConsultaioQuery
  ) {
// Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

/**
 * Método del ciclo de vida que se ejecuta al inicializar el componente.
 *
 * Suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
 * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
 * decide si debe cargar los datos del formulario o marcar que los datos de respuesta están listos.
 *
 * @returns {void}
 */
ngOnInit(): void {
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
    if (this.consultaState && this.consultaState.update) {
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
    this.registroService
      .obtenerDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.registroService.actualizarEstado(resp);
        } else {
          this.esDatosRespuesta = false;
        }
      });
  }

  /**
   * Selecciona una pestaña específica.
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i:number): void {
    this.indice = i;
  }


  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones activas para prevenir fugas de memoria.
   *
   * @returns {void}
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
        const DATOS_COMUNES_VALID = this.datosComunesComponent.validarFormulario();
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
   * Maneja el cambio de valor para el reconocimiento mutuo.
   * Actualiza la propiedad `reconocimientoMutuoValue` con el valor seleccionado.
   *
   * El nuevo valor seleccionado para reconocimiento mutuo.
   */
  onReconocimientoMutuoChange(value: [string,string]) :void {
    this.reconocimientoMutuoValue = value;
  }
}
