import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormularioDinamico } from '@ng-mf/data-access-user';
import { ModificacionTransportacionMaritimaService } from '../../services/modificacion-transportacion-maritima/modificacion-transportacion-maritima.service';
import { ModificarCaatMaritimoComponent } from '../../components/modificar-caat-maritimo/modificar-caat-maritimo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Tramite40202Store } from '../../estados/tramite40202.store';

/**
 * Componente para gestionar el paso uno del trámite.
 */
@Component({
  standalone: true,
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  imports: [ModificarCaatMaritimoComponent, SolicitanteComponent, CommonModule, ReactiveFormsModule],
})
export class DatosComponent implements OnInit, OnDestroy {
  /** 
   * Referencia al componente CAAT Marítimo
   */
  @ViewChild(ModificarCaatMaritimoComponent) caatMaritimoComponent!: ModificarCaatMaritimoComponent;

  /** 
   * Configuración del formulario para la persona moral 
   */
  persona: FormularioDinamico[] = [];

  /** 
   * Configuración del formulario para el domicilio fiscal 
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

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
   * @param consultaQuery - Consulta para obtener el estado de la consulta.
   * @param tramite40202Store - Almacén para manejar el estado del trámite 40202.
   * @param modificacionTransportacionMaritimaService - Servicio para manejar la modificación de la transportación marítima.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite40202Store: Tramite40202Store,
    private modificacionTransportacionMaritimaService: ModificacionTransportacionMaritimaService
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
      //this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }



  /**
   * Selecciona la pestaña especificada.
   * 
   * @param i - El índice de la pestaña a seleccionar.
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