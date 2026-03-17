import { CONFIGURATION_TABLA_REQUISITOS,CONFIGURATION_TABLA_TRANSPORTE,Requisito,Transporte } from '../../models/flora-fauna.models';
import { Catalogo,CatalogoSelectComponent,ConfiguracionColumna,InputFechaComponent,TablaDinamicaComponent,TablaSeleccion,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component,OnDestroy,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { Subject,map,takeUntil } from 'rxjs';
import { Tramite250101State, Tramite250101Store } from '../../estados/tramite250101.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { INPUT_FECHA } from '../../constantes/flora-fauna.enum';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250101Query } from '../../estados/tramite250101.query';
import catalogoDatos from '@libs/shared/theme/assets/json/250101/banco.json';
import reuisitosDatosDummy from '@libs/shared/theme/assets/json/250101/requisitos-datos-dummy.json';
/**
 * Componente encargado de gestionar los requisitos y el transporte del trámite 250101.
 * Permite agregar elementos a las tablas dinámicas y almacenar los valores en el estado del store.
 */
@Component({
  selector: 'app-requisitos250101',
  standalone: true,
  imports: [
    ModalComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    FormsModule,
    ReactiveFormsModule,InputFechaComponent
  ],
  templateUrl: './requisitos250101.component.html',
  styleUrl: './requisitos250101.component.scss'
})
export class Requisitos250101Component implements OnInit, OnDestroy {

  /**
   * Catálogo de medios de transporte.
   */
  public medio: Catalogo[] =catalogoDatos.medio

  /**
   * Catálogo de requisitos.
   */
  public requisitoCatalogo: Catalogo[] = catalogoDatos.requisito;

  /**
   * Tipo de selección para las tablas.
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de la tabla de transporte.
   */
  public configuracionTransporteTabla: ConfiguracionColumna<Transporte>[] = CONFIGURATION_TABLA_TRANSPORTE;

  /**
   * Datos de la tabla de transporte.
   */
  public TransporteTabla: Transporte[] = [];

  /**
   * Configuración de la tabla de requisitos.
   */
  public configuracionRequisitosTabla: ConfiguracionColumna<Requisito>[] = CONFIGURATION_TABLA_REQUISITOS;

  /**
   * Datos de la tabla de requisitos.
   */
  public requisitosTabla: Requisito[] = [];

  /**
   * Estado de visibilidad del modal de transporte.
   */
  public showtransporteModal = false;

  /**
   * Estado de visibilidad del modal de requisitos.
   */
  public showrequisitosModal = false;

  /**
   * Formulario de transporte y requisitos.
   */
  transporteForm!: FormGroup;

  /**
   * Estado actual del store del trámite 250101.
   */
  public solicitudState!: Tramite250101State;

  /**
   * Subject para destruir suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false;
 
  /**
   * Constructor que inyecta las dependencias necesarias.
   */
   /**
     * Constante para configurar el input de fecha.
     * Define las propiedades del campo de entrada de fecha.
     */
    INPUT_FECHA = INPUT_FECHA;
 /**
   * Maneja los cambios en el campo "Fecha".
   * Actualiza el estado del almacén con la fecha proporcionada.  
   */
    cambioFechasFinal(nuevo_valor: string): void {
      this.transporteForm.patchValue({
        fechas: nuevo_valor,
      });
      this.tramite250101Store.setFechas(nuevo_valor);
    }
  /**
 * Constructor que inyecta el constructor de formularios y los servicios del store y queries.
 * Permite gestionar el estado y las consultas del trámite 250101.
 */
  constructor(
    private fb: FormBuilder,
    private tramite250101Store: Tramite250101Store,
    private tramite250101Query: Tramite250101Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    // Constructor que inyecta las dependencias necesarias
  }

  /**
   * Inicializa el componente, suscribiéndose al estado del store
   * y creando el formulario reactivo.
   */
  ngOnInit(): void {
    this.tramite250101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250101State;
        })
      )
      .subscribe();

      /**
 * Si la tabla de transporte está vacía, se agrega una fila con datos dummy de identificación.
 * Los campos número de identificación, número económico y placa se inicializan con el mismo valor.
 */
     if(this.TransporteTabla.length === 0){
       const TRANSPORTE_FORMDATA = {
        numeroIdentificacion: reuisitosDatosDummy.numeroIdentificacion,
        numeroEconomico: reuisitosDatosDummy.numeroIdentificacion,
        placa: reuisitosDatosDummy.numeroIdentificacion,
       };
       this.TransporteTabla.push(TRANSPORTE_FORMDATA);
      }

      /**
 * Si la tabla de requisitos está vacía, se agrega una fila con datos dummy.
 * Los campos incluyen número, fecha y tipo del requisito.
 */
       if(this.requisitosTabla.length === 0){
       const REQUISITO_FORMDATA = {
        No: reuisitosDatosDummy.No,
        Fecha: reuisitosDatosDummy.Fecha,
        Tipo: reuisitosDatosDummy.Tipo,
       };
       this.requisitosTabla.push(REQUISITO_FORMDATA);
      }

    this.transporteForm = this.fb.group({
      medio: [this.solicitudState.medio, Validators.required],
      identificacion: [this.solicitudState.identificacion,[Validators.required,Validators.maxLength(16)]],
      economico: [this.solicitudState.economico,[Validators.required,Validators.maxLength(50)]],
      placa: [this.solicitudState.placa,[Validators.required,Validators.maxLength(25)]],
      numero: [this.solicitudState.numero,[Validators.required,Validators.maxLength(50)]],
      fechas: [this.solicitudState.fechas,Validators.required],
      requisito: [this.solicitudState.requisito, Validators.required],
    });

    /**
 * Se suscribe al estado de la sección para actualizar el modo de solo lectura del formulario.
 * Finaliza la suscripción automáticamente al destruirse el componente.
 */
    this.consultaioQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe((seccionState) => {
      this.esFormularioSoloLectura = seccionState.readonly;
      this.inicializarEstadoFormulario();
    });
  }


   /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
       this.transporteForm.enable();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
public guardarDatosFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.transporteForm.disable();
      if(this.TransporteTabla.length === 0){
       const TRANSPORTE_FORMDATA = {
        numeroIdentificacion: reuisitosDatosDummy.numeroIdentificacion,
        numeroEconomico: reuisitosDatosDummy.numeroIdentificacion,
        placa: reuisitosDatosDummy.numeroIdentificacion,
       };
       this.TransporteTabla.push(TRANSPORTE_FORMDATA);
      }
       if(this.requisitosTabla.length === 0){
       const REQUISITO_FORMDATA = {
        No: reuisitosDatosDummy.No,
        Fecha: reuisitosDatosDummy.Fecha,
        Tipo: reuisitosDatosDummy.Tipo,
       };
       this.requisitosTabla.push(REQUISITO_FORMDATA);
      }
    } else if (!this.esFormularioSoloLectura) {
      this.transporteForm.enable();
    } 
  }

  /**
   * Alterna la visibilidad del modal de transporte.
   */
  transporte(): void {
    this.showtransporteModal = !this.showtransporteModal;
  }
   /**
   * Alterna la visibilidad del modal de transporte.
   */
  transporteEliminar(): void {
    this.showtransporteModal = !this.showtransporteModal;
  }
  /**
   * Alterna la visibilidad del modal de requisitos.
   */
  requisitosEliminar(): void {
    this.showrequisitosModal = !this.showrequisitosModal;
  }

  /**
   * Alterna la visibilidad del modal de requisitos.
   */
  requisitos(): void {
    this.showrequisitosModal = !this.showrequisitosModal;
  }


  /**
   * Asigna valores del formulario al store llamando un método por nombre.
   * 
   * @param form Formulario del cual se obtiene el valor.
   * @param campo Nombre del campo dentro del formulario.
   * @param metodoNombre Nombre del método del store a invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite250101Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite250101Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Se ejecuta cuando el componente se destruye. Limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Agrega un nuevo registro a la tabla de requisitos con los datos del formulario.
   */
  requisitosDatos(): void {
    const REQUISITO_FORMDATA = {
      No: this.transporteForm.value.numero,
      Fecha: this.transporteForm.value.fechas,
      Tipo: this.requisitoCatalogo.find(item => item.id === Number(this.transporteForm.value.requisito))?.descripcion,
    };
    this.requisitosTabla.push(REQUISITO_FORMDATA);
    this.showrequisitosModal = !this.showrequisitosModal;
  }

  /**
   * Agrega un nuevo registro a la tabla de transporte con los datos del formulario.
   */
  transporteDatos(): void {
    const TRANSPORTE_FORMDATA = {
      numeroIdentificacion: this.transporteForm.value.identificacion,
      numeroEconomico: this.transporteForm.value.economico,
      placa: this.transporteForm.value.placa,
    };
    this.TransporteTabla.push(TRANSPORTE_FORMDATA);
    this.showtransporteModal = !this.showtransporteModal;
  }
}
