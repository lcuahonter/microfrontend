import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, InputFecha, InputFechaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { FECHA_PAGO, PagoDerechosState } from '../../models/materiales-peligrosos.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject,map,takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { MaterialesPeligrososService } from '../../services/materiales-peligrosos.service';
import { SeccionLibState } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Tramite230501Query } from "../../estados/queries/tramite230501Query.query";
import { Tramite230501Store } from '../../estados/stores/tramite230501Store.store';

/**
 * Componente Angular para gestionar el pago de derechos en el trámite 230501.
 * Este componente permite a los usuarios seleccionar un banco y una fecha para el pago,
 * y muestra información relacionada con el estado del pago de derechos.
 * 
 * @remarks
 * Este componente utiliza formularios reactivos para gestionar la entrada del usuario
 * y se integra con servicios para obtener datos relacionados con materiales peligrosos.
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [CommonModule, TituloComponent, CatalogoSelectComponent, ReactiveFormsModule, InputFechaComponent],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
  providers: [MaterialesPeligrososService],
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo utilizado para gestionar los datos relacionados con el pago de derechos.
   * Este formulario contiene los controles necesarios para capturar y validar la información
   * requerida en el proceso de pago.
   */
  public pagoDerechos!: FormGroup;
  /**
   * Clasificación asociada al componente.
   * Esta propiedad almacena una cadena que representa la clasificación actual.
   */
  public clasificacion: string = '';
  /**
   * Sujeto utilizado como notificador para la destrucción de componentes.
   * Este observable se utiliza para cancelar suscripciones y evitar fugas de memoria
   * cuando el componente se destruye.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Representa el estado actual del pago de derechos.
   * Esta propiedad se utiliza para gestionar y almacenar 
   * la información relacionada con el estado del proceso 
   * de pago de derechos en el componente.
   */
  public pagoDerechosState!: PagoDerechosState;
  /**
   * Representa el estado de la sección en el componente.
   * Esta propiedad se utiliza para manejar el estado de la sección
   * dentro del flujo de trabajo del componente.
   */
  private seccion!: SeccionLibState;

  /**
* Indica si el formulario está en modo solo lectura.
* Cuando es `true`, los campos del formulario no se pueden editar.
*/
  esFormularioSoloLectura: boolean = false;

  public fechaPagoInput: InputFecha = FECHA_PAGO;

  /**
   * Constructor de la clase PagoDeDerechosComponent.
   * 
   * @param materialesPeligrososService Servicio para inicializar y gestionar el catálogo de materiales peligrosos.
   * @param fb Constructor de formularios reactivos para la creación y gestión de formularios.
   * @param tramite230501Store Almacén para gestionar el estado relacionado con el trámite 230501.
   * @param tramite230501Query Consultas relacionadas con el estado del trámite 230501.
   * @param consultaQuery Consulta para obtener el estado de la sección de consulta.
   * @description Este constructor inicializa el componente y llama al servicio de materiales peligrosos
   * para inicializar el catálogo de pago de derechos.
   */
  constructor(
    public materialesPeligrososService: MaterialesPeligrososService, 
    private fb: FormBuilder,
    public tramite230501Store: Tramite230501Store, 
    public tramite230501Query: Tramite230501Query, 
    public consultaQuery: ConsultaioQuery
  ) {
    this.materialesPeligrososService.inicializaPagoDerechosCatalogo();
  }


  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * En este método se configuran dos observables para gestionar el estado del componente:
   * 
   * 1. `tramite230501Query.seletPagoDerechosState$`:
   *    - Se suscribe al estado de la sección de pago de derechos.
   *    - Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye.
   *    - Mapea el estado recibido y lo asigna a la propiedad `pagoDerechosState`.
   * 
   * 2. `consultaQuery.selectConsultaioState$`:
   *    - Se suscribe al estado de consulta.
   *    - Utiliza el operador `takeUntil` para cancelar la suscripción cuando el componente se destruye.
   *    - Mapea el estado recibido y actualiza las propiedades `esFormularioSoloLectura` y llama al método `inicializarEstadoFormulario`.
   * 
   * Este método asegura que el componente esté sincronizado con los estados relevantes y que las propiedades necesarias
   * se inicialicen correctamente.
   */
  ngOnInit(): void {
    this.tramite230501Query.seletPagoDerechosState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.pagoDerechosState = seccionState;
        })
      ).subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  
  /**
   * Inicializa el estado del formulario de pago de derechos.
   * 
   * Este método verifica si el formulario de pago de derechos (`pagoDerechos`) 
   * ha sido creado. Si no existe, se invoca el método `createPagoDerechos` 
   * para inicializarlo. Además, si el formulario está configurado como 
   * de solo lectura (`esFormularioSoloLectura`), se deshabilita el formulario 
   * para evitar modificaciones.
   * 
   * @returns {void} No retorna ningún valor.
   */
  inicializarEstadoFormulario(): void {
    if (!this.pagoDerechos) {
      this.createPagoDerechos();
    }
    if (this.esFormularioSoloLectura) {
      this.pagoDerechos.disable();
    }
  }
  
  /**
* Establece el estado de validación del formulario de destinatario.
* 
* @param valida - Un valor booleano que indica si el formulario de datos del destinatario es válido.
*/
  setFormValida(valida: boolean): void {
    this.tramite230501Store.setFormValida({ pagoDeDerechos: valida });
  }

  /**
   * Este método inicializa el formulario `pagoDerechos` con varios campos predefinidos
   * y sus respectivas validaciones. Algunos campos están deshabilitados y tienen valores
   * predeterminados.
   * Campos del formulario:
   * - clave: Clave del trámite, deshabilitado y con valor predeterminado.
   * - dependencia: Dependencia correspondiente, deshabilitado y con valor predeterminado.
   * - banco: Banco donde se realizará el pago, requerido.
   * - llavePago: Llave de pago, deshabilitado y con valor predeterminado.
   * - importePago: Importe del pago, deshabilitado y con valor predeterminado.
    */
  createPagoDerechos(): void {    
    this.pagoDerechos = this.fb.group({
      clave: [{ value: this.pagoDerechosState.clave, disabled: true }],
      dependencia: [{ value: this.pagoDerechosState.dependencia, disabled: true }],
      banco: [this.pagoDerechosState.banco, [Validators.required]],
      llavePago: [{ value: this.pagoDerechosState.llavePago, disabled: true }],
      fecha: [this.pagoDerechosState.fecha, [Validators.required]],
      importePago: [{ value: this.pagoDerechosState.importePago, disabled: true }],
    });

  }

  /**
   * Maneja el cambio de tiempo seleccionado por el usuario.
   * 
   * @param value - El valor seleccionado, que puede ser una cadena o un número.
   * 
   * @remarks
   * Este método actualiza el estado del formulario y establece la propiedad 
   * 'fecha' en el estado de `tramite230501Store` con el valor seleccionado.
   */
  onCambioDeTiempo(event: string): void {
    const VALOR_SELECCIONADO = event
    this.setFormValida(this.pagoDerechos.valid);
    this.tramite230501Store.setPagoDerechosStateProperty('fecha', VALOR_SELECCIONADO);
  }


  /**
   * Maneja la selección de una clasificación actualizando la propiedad `clasificacion`
   * con el valor del campo 'banco' del formulario `pagoDerechos`. También valida
   * el formulario y actualiza el estado del `tramite230501Store` con la clasificación seleccionada.
   *
   * @remarks
   * Este método realiza las siguientes acciones:
   * - Recupera el valor del campo 'banco' del formulario `pagoDerechos`.
   * - Actualiza la propiedad `clasificacion` con el valor recuperado.
   * - Llama a `setFormValida` para validar el formulario.
   * - Actualiza el estado del `tramite230501Store` con la clasificación seleccionada.
   */
  clasificacionSeleccione(): void {
    this.clasificacion = this.pagoDerechos.get('banco')?.value
    this.setFormValida(this.pagoDerechos.valid);
    this.tramite230501Store.setPagoDerechosStateProperty('banco', this.clasificacion);
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
}
