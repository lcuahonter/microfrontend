import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { DatosComunesTresService } from '../../../../shared/services/datos-comunes-tres.service';
import { RubroTransporteFerrovarioService } from '../../services/rubro-transporte-ferrovario/rubro-transporte-ferrovario.service';
import { TercerosRelacionadosService } from '../../../../shared/services/terceros-relacionados.service';

// Componente que gestiona el paso uno del trámite 32613, incluyendo la carga y actualización de datos, el control de pestañas y la suscripción al estado de consulta.
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})

export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice utilizado para identificar la pestaña activa dentro del paso.
   * @type {number}
   */
  public indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  
  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  // Constructor que inyecta los servicios necesarios para consultar el estado, gestionar datos comunes y manejar el rubro de transporte ferroviario.
  constructor(
    private consultaQuery: ConsultaioQuery,
    private rubroTransporteFerrovarioService: RubroTransporteFerrovarioService,
    private datosComunesTresService: DatosComunesTresService,
    private tercerosRelacionadosSvc: TercerosRelacionadosService,
  ) {
      // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
    }

  /** Método que se ejecuta al inicializar el componente. */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
    }

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.datosComunesTresService
      .getDatosComunesTresData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          Object.entries(resp).forEach(([key, value]) => {
            this.datosComunesTresService.actualizarEstadoFormulario(key, value);
          });
        }
      });

    this.tercerosRelacionadosSvc.getConsultaDatos().pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((resp) => {
      if (resp) {
        Object.entries(resp).forEach(([key, value]) => {
          this.tercerosRelacionadosSvc.actualizarEstadoFormulario(key, value);
        });
      }
    });

    this.rubroTransporteFerrovarioService
      .getrubroTransporteFerrovarioData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          Object.entries(resp).forEach(([key, value]) => {
            this.rubroTransporteFerrovarioService.actualizarEstadoFormulario(key, value);
          });
        }
      });
  }

  /**
   * Cambia la pestaña activa según el índice proporcionado.
   * @param i - El índice de la pestaña que se desea activar.
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
}
