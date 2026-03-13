import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ConsultaioQuery, ConsultaioState } from '@libs/shared/data-access-user/src';
import { DatosGeneralesComponent } from '../datos-generales/datos-generales.component';
import { PagoDeDerechosComponent } from '../pago-de-derechos/pago-de-derechos.component';
import { SagarpaService } from '../../services/sagarpa/sagarpa.service';
import { TercerosRelacionadosComponent } from '../terceros-relacionados/terceros-relacionados.component';

/**
 * Componente para la revisión documental.
 */
@Component({
  selector: 'app-revision-documental',
  templateUrl: './revision-documental.component.html',
  styleUrl: './revision-documental.component.scss',
  standalone: true,
  imports: [DatosGeneralesComponent, TercerosRelacionadosComponent, PagoDeDerechosComponent, CommonModule],
})
export class RevisionDocumentalComponent implements OnInit, OnDestroy {

  /**
  * Índice del tab seleccionado.
  * @type {number}
  */
  indice: number = 1;
  /**
 * Indica si el contenido es colapsable.
 * @type {boolean}
 */
  colapsable: boolean = true;
  /**
  * Índice actual de la fila.
  * @type {number}
  */
  currentIndex: number = 1;
  /**
  * Filas de datos.
  * @type {any[]}
  */
  rows: { [key: string]: string }[] = [];
  /**
  * Formulario principal.
  * @type {any}
  */
  forma: string = '';

  /**
   * Estado de la consulta, utilizado para manejar el estado del formulario.
   */
  public consultaState!: ConsultaioState;

  /** 
   * Datos de respuesta del servidor utilizados para actualizar el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Subject para notificar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   * 
   * @param cdr Servicio para detectar cambios manualmente.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private sagarpaService: SagarpaService,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$),
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
    this.sagarpaService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
        }
      });
  }

  /**
   * Selecciona un tab específico.
   * @param {number} i - El índice del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Se utiliza para limpiar los recursos y evitar fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}