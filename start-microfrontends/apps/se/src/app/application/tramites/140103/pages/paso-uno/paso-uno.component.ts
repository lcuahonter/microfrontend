import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CancelacionDeCertificateComponent } from '../../components/cancelacionde/cancelacion-de-certificado.component';
import { Solicitud140103Service } from '../../services/service140103.service';


@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.css'],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  @ViewChild('cancelacionDeCertificateComponent', { static: false }) cancelacionDeCertificateComponent: CancelacionDeCertificateComponent | undefined;
  /**
   * @description
   * Este componente maneja los datos del trámite 140103, permitiendo la visualización y edición de los datos del establecimiento.
   * Utiliza un servicio para obtener y actualizar los datos del formulario.
   */
  @Input() showBuscarError: boolean = false;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Estado de la consulta, utilizado para almacenar y gestionar el estado de la consulta.
   */
  public consultaState!: ConsultaioState;

  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;

  public formFieldValidado: boolean = true;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Inyecta los servicios necesarios para manejar la solicitud y consultar el estado de la sección. */
  constructor(
    private solicitud140103Service: Solicitud140103Service,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

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
    this.solicitud140103Service
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitud140103Service.actualizarEstadoFormulario(resp);
        }
      });
  }

public validarFormularios(): boolean {
  let allFormsValid = true;
  if (this.cancelacionDeCertificateComponent) {
    if(this.cancelacionDeCertificateComponent?.isFormValido() === false) {
      this.formFieldValidado = false;
      return false;
    }
    this.formFieldValidado = true;
    if (!this.cancelacionDeCertificateComponent?.CuposDisponiblesDatos.length) {
      allFormsValid = true;
      this.formFieldValidado = false;
    }
  }
  return allFormsValid;
}


  /**
   * Método del ciclo de vida de Angular que se ejecuta justo antes de destruir el componente.
   *
   * Este método se utiliza para limpiar recursos, específicamente para completar
   * el `Subject` `destroyNotifier$`, el cual es usado en combinación con el operador `takeUntil`
   * para cancelar automáticamente las suscripciones a observables y evitar fugas de memoria.
   *
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}

