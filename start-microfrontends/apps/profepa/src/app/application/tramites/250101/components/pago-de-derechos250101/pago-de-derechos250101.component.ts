import { Catalogo,CatalogoSelectComponent,InputFechaComponent,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component,OnDestroy,OnInit} from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { Subject,map,takeUntil } from 'rxjs';
import { Tramite250101State, Tramite250101Store } from '../../estados/tramite250101.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { INPUT_FECHA_PAGO } from '../../constantes/flora-fauna.enum';
import { Tramite250101Query } from '../../estados/tramite250101.query';
import catalogoDatos from '@libs/shared/theme/assets/json/250101/banco.json';
import pago from '@libs/shared/theme/assets/json/250101/pago-formdatos.json';
/**
 * Componente encargado de gestionar el pago de derechos dentro del trámite 221602.
 * Permite al usuario ingresar los datos correspondientes al pago de derechos, como clave, dependencia, banco,
 * llave, fecha e importe. También interactúa con el store para almacenar los datos del trámite.
 * 
 * Este componente utiliza un formulario reactivo para gestionar los datos del pago de derechos, y actualiza el store 
 * con los valores proporcionados.
 * 
 * @component
 * @example
 * <app-pago-de-derechos250101</app-pago-de-derechos250101>
 * 
 * @imports
 * - `TituloComponent`: Componente para mostrar el título en la interfaz.
 * - `FormsModule`: Módulo necesario para trabajar con formularios basados en plantillas.
 * - `ReactiveFormsModule`: Módulo necesario para trabajar con formularios reactivos en Angular.
 * - `CatalogoSelectComponent`: Componente para seleccionar valores de un catálogo.
 * 
 */
@Component({
  selector: 'app-pago-de-derechos250101',
  standalone: true,
  imports: [
    TituloComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,InputFechaComponent
  ],
  templateUrl: './pago-de-derechos250101.component.html',
  styleUrls: ['./pago-de-derechos250101.component.scss']
})

/**
 * Componente encargado de gestionar el pago de derechos del trámite 250101.
 * Utiliza un formulario reactivo para que el usuario ingrese datos como la clave, dependencia, banco, 
 * llave, fecha e importe. Además, actualiza el estado del trámite en el store.
 * 
 * @class
 * @implements OnInit, OnDestroy
 * @example
 * <app-pago-de-derechos250101></app-pago-de-derechos250101>
 * 
 * @constructor
 * El constructor inicializa las dependencias necesarias y prepara el formulario reactivo para gestionar los 
 * datos del pago de derechos.
 * 
 * @property {FormGroup} pagoDerechosForm - Formulario reactivo que gestiona los datos relacionados con el 
 * pago de derechos, como clave, dependencia, banco, llave, fecha e importe.
 * @property {Catalogo[]} bancocatalogo - Lista de opciones de bancos obtenidas del catálogo.
 * @property {Solicitud250101State} solicitudState - Estado de la solicitud 250101 que contiene los valores actuales de la solicitud.
 * 
 * @method ngOnInit() - Método que se ejecuta cuando el componente es inicializado. Inicializa el formulario reactivo
 * y carga los datos de la solicitud.
 * @method setValoresStore() - Método para actualizar el store del trámite con los valores del formulario.
 * @method ngOnDestroy() - Método que se ejecuta cuando el componente es destruido, liberando recursos y completando
 * la notificación de destrucción.
 */
export class PagoDeDerechos250101Component implements OnInit, OnDestroy {

  /**
   * Lista de opciones de banco obtenidas de un catálogo.
   */
  public bancocatalogo: Catalogo[] =catalogoDatos.banco;

  /**
   * Estado de la solicitud 250101, que contiene los valores actuales de la solicitud.
   */
  public solicitudState!: Tramite250101State;

  /**
   * Formulario reactivo que gestiona los datos relacionados con el pago de derechos, como clave, dependencia, banco,
   * llave, fecha e importe.
   */
  pagoDerechosForm!: FormGroup;
 
  /**
   * Constante para configurar el input de fecha.
   * Define las propiedades del campo de entrada de fecha.
   */
  INPUT_FECHA_CONFIG = INPUT_FECHA_PAGO;
  /**
   * Subject utilizado para gestionar la destrucción del componente y evitar memory leaks.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente. Inicializa las dependencias necesarias y prepara el formulario reactivo.
   * 
   * @param fb - FormBuilder utilizado para crear el formulario reactivo.
   * @param tramite221602Store - Store que gestiona los valores persistentes del trámite 221602.
   * @param tramite221602Query - Query que se utiliza para obtener el estado actual de la solicitud 221602.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250101Store: Tramite250101Store,
    private tramite250101Query: Tramite250101Query,
    private consultaioQuery: ConsultaioQuery
  ) { // Constructor que inyecta las dependencias necesarias
    }

  /**
   * Método que se ejecuta cuando el componente es inicializado.
   * 
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((seccionState) => {
      this.esFormularioSoloLectura = seccionState.readonly;
      if(!this.pagoDerechosForm) {
        this.inicializarFormulario();
      }
      this.inicializarEstadoFormulario();
    });
  }


  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (!this.pagoDerechosForm) {return}
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
       this.pagoDerechosForm.enable();
       this.pagoDerechosForm.get('clave')?.disable();
       this.pagoDerechosForm.get('dependencia')?.disable();
       this.pagoDerechosForm.get('importe')?.disable()
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
public guardarDatosFormulario(): void {
    if (!this.pagoDerechosForm) {return}
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.pagoDerechosForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.pagoDerechosForm.enable();
    } 
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * 
   * Configura el formulario para gestionar los campos relacionados con el pago de derechos, como clave, 
   * dependencia, banco, llave, fecha e importe. También asigna valores predeterminados a algunos campos.
   */
  private inicializarFormulario(): void {
    this.tramite250101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250101State;
        })
      )
      .subscribe();

    this.pagoDerechosForm = this.fb.group({
      clave: [this.solicitudState.clave,[Validators.required,Validators.maxLength(14)]],
      dependencia: [this.solicitudState.dependencia,[Validators.required,Validators.maxLength(20)]],
      banco: [this.solicitudState.banco, Validators.required],
      llave: [this.solicitudState.llave, [Validators.required,Validators.maxLength(10)]],
      fecha: [this.solicitudState.fecha, Validators.required],
      importe: [this.solicitudState.importe,[Validators.required,Validators.maxLength(16)]],
      revisados:[this.solicitudState.revisados]
    });

    this.pagoDerechosForm.get('clave')?.disable();
    this.pagoDerechosForm.get('dependencia')?.disable();
    this.pagoDerechosForm.get('importe')?.disable();
    this.pagoDerechosForm.get('clave')?.setValue(pago.formData.clave);
    this.pagoDerechosForm.get('dependencia')?.setValue(pago.formData.dependencia);
    this.pagoDerechosForm.get('importe')?.setValue(pago.formData.importe);
  }

  /**
   * Método que actualiza el store con los valores del formulario.
   * 
   * @param form - Formulario reactivo con los datos actuales.
   * @param campo - El campo que debe actualizarse en el store.
   * @param metodoNombre - El nombre del método en el store que se debe invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite250101Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite250101Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }
   /**
   * Maneja los cambios en el campo "Fecha de Pago".
   * Actualiza el estado del almacén con la fecha de pago proporcionada.  
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.pagoDerechosForm.patchValue({
      fecha: nuevo_valor,
    });
    this.tramite250101Store.setFecha(nuevo_valor);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * 
   * Libera los recursos y completa la notificación de destrucción del componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}

