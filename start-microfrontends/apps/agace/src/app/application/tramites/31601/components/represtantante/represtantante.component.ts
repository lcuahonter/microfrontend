import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, Notificacion, NotificacionesComponent, TituloComponent } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud31601State, Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import representanteDatos from '@libs/shared/theme/assets/json/31601/represtantante-data.json';

/**
 * Componente para gestionar la información del representante del importador/exportador.
 */
@Component({
  selector: 'app-represtantante', // Selector del componente en la plantilla HTML
  templateUrl: './represtantante.component.html', // Ruta a la plantilla HTML
  styleUrl: './represtantante.component.scss', // Ruta al archivo de estilos SCSS
  standalone: true, // Define que el componente puede funcionar de forma independiente (sin módulo específico)
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule ,NotificacionesComponent], // Módulos y componentes necesarios
})
export class ReprestantanteComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para los datos del representante.
   */
  represtantante!: FormGroup;

  /**
   * Datos predefinidos del representante.
   */
  datosRepresentativos = representanteDatos;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud31601State;

  /**
   * Notificador para destruir las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 
   /**
   * @description
   * Notificación actual que se muestra en el componente.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor del componente.
   * @param {FormBuilder} fb - Instancia de FormBuilder para la creación de formularios.
   * @param {Tramite31601Store} tramite31601Store - Store para gestionar el estado del trámite.
   * @param {Tramite31601Query} tramite31601Query - Query para obtener el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31601Store: Tramite31601Store,
    private tramite31601Query: Tramite31601Query,
     private consultaioQuery: ConsultaioQuery,
  ) {
      this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario reactivo y carga los datos predefinidos del representante.
   */
  ngOnInit(): void {
    // Inicializa el formulario con las validaciones
    this.inicializarEstadoFormulario();
  }
  /*  
  Asigna datos al formulario si 'resigtro' tiene un valor válido.  
  Llena automáticamente los campos con datos de `datosRepresentativos`.  
  Evita que el usuario tenga que escribir manualmente la información.  
  Mejora la experiencia al buscar un representante existente.  
*/
   openBuscar(): void {
    
  const RESGISTRO_VALUE = this.represtantante.get('resigtro')?.value;

  if (RESGISTRO_VALUE) {
    this.represtantante.patchValue({
      rfcDatos: RESGISTRO_VALUE,
      nombre: this.datosRepresentativos.nombre,
      apellidoPaterno: this.datosRepresentativos.apellidoPaterno,
      apellidoMaterno: this.datosRepresentativos.apellidoMaterno,
      telefono:this.datosRepresentativos.telefono,
      correo:this.datosRepresentativos.correo
    });
  }
   this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Mensaje',
      mensaje: 'Datos guardados correctamente.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    
  }

  /**
   * @method inicializarEstadoFormulario
   * @description
   * Inicializa el estado del formulario del representante, estableciendo los valores predeterminados
   * a partir del estado de la solicitud o de los datos representativos proporcionados.
   * Deshabilita los campos que no deben ser modificados por el usuario y rellena el formulario
   * con los datos correspondientes. Si el formulario está en modo solo lectura, deshabilita
   * todos los campos.
   *
   * @returns {void}
   *
   * @memberof ReprestantanteComponent
   */
  inicializarEstadoFormulario(): void {
        this.tramite31601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.represtantante = this.fb.group({
      resigtro: [this.solicitudState?.resigtro, Validators.required],
      rfcDatos: [this.solicitudState?.rfcDatos, Validators.required],
      nombre: [this.solicitudState?.nombre, Validators.required],
      apellidoPaterno: [this.solicitudState?.apellidoPaterno, Validators.required],
      apellidoMaterno: [this.solicitudState?.apellidoMaterno, Validators.required],
      telefono: [this.solicitudState?.telefono, Validators.required],
      correo: [this.solicitudState?.correo, Validators.required],
    });

    // Deshabilita los campos que no deben ser modificados
    this.represtantante.get('rfc')?.disable();
    this.represtantante.get('nombre')?.disable();
    this.represtantante.get('apellidoPaterno')?.disable();
    this.represtantante.get('apellidoMaterno')?.disable();

    if (this.esFormularioSoloLectura && this.represtantante) {
     this.represtantante.disable();
    } else {
        this.represtantante.enable();
    }  

  }
  /**
   * Establece el valor de un campo en el store de Tramite31601.
   *
   * @param {FormGroup} form - El grupo de formularios que contiene el campo.
   * @param {string} campo - El nombre del campo cuyo valor se va a establecer.
   * @param {keyof Tramite31601Store} metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31601Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31601Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}