import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CancelacionDeCertificateComponent } from '../../components/cancelacionde/cancelacion-de-certificado.component';
import { Solicitud140205Service } from '../../services/service140205.service';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrls: ['./paso-uno.component.css'],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @ViewChild reference to the CancelacionDeCertificateComponent.
   * 
   * This property holds an instance of the CancelacionDeCertificateComponent, which is accessed via the template reference variable
   * 'cancelacionDeCertificateComponent'. It is used to interact with the child component from the parent component.
   * 
   * @type {CancelacionDeCertificateComponent | undefined}
   * @see https://angular.io/api/core/ViewChild
   * 
   * @memberof PasoUnoComponent
   */
  @ViewChild('cancelacionDeCertificateComponent', { static: false })
  cancelacionDeCertificateComponent:
    | CancelacionDeCertificateComponent
    | undefined;

  /**
   * @description
   * Este componente maneja los datos del trámite 140205, permitiendo la visualización y edición de los datos del establecimiento.
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

  /**
   * Indica si los campos del formulario han sido validados correctamente.
   * 
   * Esta propiedad se utiliza para controlar el estado de validación de los campos del formulario
   * dentro del componente. Se actualiza en el método `validarFormularios` según la validez de los formularios hijos.
   *
   * @type {boolean}
   */
  public formFieldValidado: boolean = true;

  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Inyecta los servicios necesarios para manejar la solicitud y consultar el estado de la sección. */
  constructor(
    private solicitud140205Service: Solicitud140205Service,
    private consultaQuery: ConsultaioQuery
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * Suscribe al estado de consulta usando el servicio `ConsultaioQuery` y actualiza la propiedad `consultaState`.
   * Si el estado indica que se debe actualizar (`update`), llama a `guardarDatosFormulario()` para cargar los datos.
   * En caso contrario, establece `esDatosRespuesta` en `true`.
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
    this.solicitud140205Service
      .getRegistroTomaMuestrasMercanciasData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitud140205Service.actualizarEstadoFormulario(resp);
        }
      });
  }

  public validarFormularios(): boolean {
    let allFormsValid = true;
    if (this.cancelacionDeCertificateComponent) {
      if (this.cancelacionDeCertificateComponent?.isFormValido() === false) {
        this.formFieldValidado = false;
        return false;
      }
      this.formFieldValidado = true;
      if (
        !this.cancelacionDeCertificateComponent?.CuposDisponiblesDatos.length
      ) {
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
