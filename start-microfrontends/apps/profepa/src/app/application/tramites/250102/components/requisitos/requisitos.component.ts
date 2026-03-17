import { CONFIGURATION_TABLA_REQUISITOS,CONFIGURATION_TABLA_TRANSPORTE,Requisito,Transporte } from '../../models/flora-fauna.models';
import { Catalogo,CatalogoSelectComponent,ConfiguracionColumna,InputFechaComponent,TablaDinamicaComponent,TablaSeleccion,TituloComponent } from '@libs/shared/data-access-user/src';
import { Component,OnDestroy,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators } from '@angular/forms';
import { Subject,map,takeUntil } from 'rxjs';
import { Tramite250102State, Tramite250102Store } from '../../estados/tramite250102.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { INPUT_FECHA } from '../../constantes/flora-fauna.enum';
import { ModalComponent } from '../modal/modal.component';
import { Tramite250102Query } from '../../estados/tramite250102.query';
import catalogoDatos from '@libs/shared/theme/assets/json/250102/banco.json';


/**
 * Componente encargado de gestionar los requisitos y el transporte del trámite 250102.
 * Permite agregar, visualizar y eliminar elementos en las tablas dinámicas de requisitos y transporte,
 * así como almacenar los valores en el estado del store.
 * 
 * @component
 * @example
 * <app-requisitos></app-requisitos>
 */
@Component({
  selector: 'app-requisitos',
  standalone: true,
  imports: [
    ModalComponent,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
    FormsModule,
    ReactiveFormsModule,InputFechaComponent,
  ],
  templateUrl: './requisitos.component.html',
  styleUrl: './requisitos.component.scss',
})
export class RequisitosComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Catálogo de medios de transporte.
   * @type {Catalogo[]}
   */
  medio: Catalogo[] = catalogoDatos.medio

  /**
   * Catálogo de requisitos.
   * @type {Catalogo[]}
   */
  requisitoCatalogo: Catalogo[] = catalogoDatos.requisito;

  /**
   * Tipo de selección para las tablas.
   * @type {TablaSeleccion}
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de la tabla de transporte.
   * @type {ConfiguracionColumna<Transporte>[]}
   */
  configuracionTransporteTabla: ConfiguracionColumna<Transporte>[] = CONFIGURATION_TABLA_TRANSPORTE;

  /**
   * Datos de la tabla de transporte.
   * @type {Transporte[]}
   */
  TransporteTabla: Transporte[] = [];

  /**
   * Configuración de la tabla de requisitos.
   * @type {ConfiguracionColumna<Requisito>[]}
   */
  configuracionRequisitosTabla: ConfiguracionColumna<Requisito>[] = CONFIGURATION_TABLA_REQUISITOS;

  /**
   * Datos de la tabla de requisitos.
   * @type {Requisito[]}
   */
  RequisitosTabla: Requisito[] = [];

  /**
   * Estado de visibilidad del modal de transporte.
   * @type {boolean}
   */
  showtransporteModal = false;

  /**
   * Estado de visibilidad del modal de requisitos.
   * @type {boolean}
   */
  showrequisitosModal = false;

  /**
   * Formulario de transporte y requisitos.
   * @type {FormGroup}
   */
  transporteForm!: FormGroup;

  /**
   * Estado actual del store del trámite 250102.
   * @type {Tramite250102State}
   */
  public solicitudState!: Tramite250102State;

  /**
   * Subject para destruir suscripciones y evitar fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constante para configurar el input de fecha.
   * Define las propiedades del campo de entrada de fecha.
   * @type {typeof INPUT_FECHA}
   */
  INPUT_FECHA = INPUT_FECHA;

  /**
   * Maneja los cambios en el campo "Fecha".
   * Actualiza el estado del almacén con la fecha proporcionada.
   * @param {string} nuevo_valor - Nuevo valor de la fecha.
   */
  cambioFechasFinal(nuevo_valor: string): void {
    this.transporteForm.patchValue({
      fechas: nuevo_valor,
    });
    this.tramite250102Store.establecerDatos({ fechas: nuevo_valor });
  }

  /**
   * Constructor que inyecta las dependencias necesarias.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {Tramite250102Store} tramite250102Store - Store del trámite.
   * @param {Tramite250102Query} tramite250102Query - Query del trámite.
   * @param {ConsultaioQuery} consultaioQuery - Query de consulta IO.
   */
  constructor(
    private fb: FormBuilder,
    private tramite250102Store: Tramite250102Store,
    private tramite250102Query: Tramite250102Query,
    public consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
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
   * Inicializa el formulario dependiendo del modo (solo lectura o editable).
   * Si está en solo lectura, carga y bloquea el formulario.
   * Si no, crea un formulario editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Crea el formulario y, si está en modo solo lectura, lo deshabilita.
   * De lo contrario, lo habilita para edición.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.transporteForm.disable();
    } else {
      this.transporteForm.enable();
    }
  }

  /**
   * Inicializa el componente, suscribiéndose al estado del store
   * y creando el formulario reactivo.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales de la solicitud.
   * Configura el formulario para gestionar los campos relacionados con el pago de derechos, como clave, 
   * dependencia, banco, llave, fecha e importe. También asigna valores predeterminados a algunos campos.
   * @private
   */
  private inicializarFormulario(): void {
    this.tramite250102Query.selectTramiteState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState as Tramite250102State;
        })
      )
      .subscribe();

    this.transporteForm = this.fb.group({
      medio: [this.solicitudState?.medio, Validators.required],
      identificacion: [this.solicitudState?.identificacion,[Validators.required,Validators.maxLength(16)]],
      economico: [this.solicitudState?.economico,[Validators.required,Validators.maxLength(50)]],
      placa: [this.solicitudState?.placa,[Validators.required,Validators.maxLength(25)]],
      numero: [this.solicitudState?.numero,[Validators.required,Validators.maxLength(50)]],
      fechas: [this.solicitudState?.fechas,Validators.required],
      requisito: [this.solicitudState?.requisito, Validators.required],
    });
  }

  /**
   * Alterna la visibilidad del modal de transporte.
   */
  transporte(): void {
    this.showtransporteModal = !this.showtransporteModal;
  }

  /**
   * Alterna la visibilidad del modal de transporte para eliminar.
   */
  transporteEliminar(): void {
    this.showtransporteModal = !this.showtransporteModal;
  }

  /**
   * Alterna la visibilidad del modal de requisitos para eliminar.
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
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param {FormGroup} form - El formulario reactivo.
   * @param {string} campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite250102Store.establecerDatos({ [campo]: VALOR });
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
    this.RequisitosTabla.push(REQUISITO_FORMDATA);
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