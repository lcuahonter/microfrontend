import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { DatosEmpresaComponent } from '../../component/datos-empresa/datos-empresa.component';
import { DatosEmpresaService } from '../../services/datos-empresa.service';
import { SolicitanteComponent } from '@ng-mf/data-access-user';

/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * El índice de la pestaña actualmente seleccionada.
   */
  indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado de la consulta, que contiene información sobre el estado actual del formulario.
   */
  public consultaState!: ConsultaioState;

  /**
   * Referencia ViewChild al componente solicitante.
   */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

  /**
   * Referencia ViewChild al componente datos-empresa.
   */
  @ViewChild('datosEmpresaRef') datosEmpresa!: DatosEmpresaComponent;

  /**
   * Constructor del componente PasoUnoComponent.
   * @param datosEmpresaService Servicio para manejar los datos de la empresa.
   * @param consultaQuery Consulta para obtener el estado actual del formulario.
   */
  constructor(
    private datosEmpresaService: DatosEmpresaService,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta y actualiza el estado del componente según los datos obtenidos.
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
    this.datosEmpresaService
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.datosEmpresaService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Selecciona una pestaña estableciendo su índice.
   * @param i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Valida los formularios del paso uno y marca los campos inválidos como tocados para mostrar errores de validación.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    // Validar formulario de solicitante (pestaña 1)
    if (this.solicitante && this.solicitante.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    // Validar formularios de datos empresa (pestaña 2)
    if (this.datosEmpresa) {
      const DATOS_EMPRESA_VALID = this.datosEmpresa.validarFormularios();
      if (!DATOS_EMPRESA_VALID) {
        isValid = false;
      } else {
        isValid = true;
      }
    } else {
      isValid = false;
    }

    if(!isValid && this.indice === 1) {
      this.indice = 2;
      setTimeout(() => {
        this.validarFormularios();
      }, 1000);
    }

    return isValid;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Limpia los recursos suscritos para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
