import { Agregar220401Store, Solicitud220401State } from '../../../../estados/tramites/agregar220401.store';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { AgregarQuery } from '../../../../estados/queries/agregar.query';

import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { Pantallas220401Service } from '../pantallas220401.service';
import { TercerosRelacionadosComponent } from '../terceros-relacionados/terceros-relacionados.component';
import { TituloComponent } from '@ng-mf/data-access-user';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';

/**
 * @component CombinacionRequeridaComponent
 * @description
 * Componente encargado de gestionar la combinación de diferentes datos en el flujo 220401.
 * Implementa los ciclos de vida de Angular OnInit y OnDestroy para la inicialización y limpieza
 * de recursos durante la vida útil del componente.
 */
@Component({
  selector: 'app-combinacion-requerida',
  templateUrl: './combinacion-requerida.component.html',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CommonModule,
    TercerosRelacionadosComponent,
    CatalogoSelectComponent,
  ],
  styleUrl: './combinacion-requerida.component.scss',
})
export class CombinacionRequeridaComponent implements OnInit, OnDestroy {
  /**
   * Arreglo que contiene los elementos del catálogo relacionados con las especies disponibles.
   * Se utiliza para cargar y gestionar las especies seleccionadas en el formulario.
   */
  public especie!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con las funciones zootécnicas disponibles.
   * Se utiliza para cargar y gestionar las funciones zootécnicas seleccionadas en el formulario.
   */
  public funcionZootecnica!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con las mercancías disponibles.
   * Se utiliza para cargar y gestionar las mercancías seleccionadas en el formulario.
   */
  public mercancia!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con los países de destino disponibles.
   * Se utiliza para cargar y gestionar los países de destino seleccionados en el formulario.
   */
  public paisDestino!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con los nombres de los establecimientos disponibles.
   * Se utiliza para cargar y gestionar los nombres de establecimientos seleccionados en el formulario.
   */
  public nombreEstablecimiento!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con los tipos de actividad disponibles.
   * Se utiliza para cargar y gestionar los tipos de actividad seleccionados en el formulario.
   */
  public tipoActividad!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con las aduanas de salida disponibles.
   * Se utiliza para cargar y gestionar las aduanas de salida seleccionadas en el formulario.
   */
  public aduanaSalida!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con las OISA de salida disponibles.
   * Se utiliza para cargar y gestionar las OISA de salida seleccionadas en el formulario.
   */
  public oisaSalida!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con los regímenes de mercancía disponibles.
   * Se utiliza para cargar y gestionar los regímenes de mercancía seleccionados en el formulario.
   */
  public regimenMercancia!: Catalogo[];

  /**
   * Arreglo que contiene los elementos del catálogo relacionados con los países de origen disponibles.
   * Se utiliza para cargar y gestionar los países de origen seleccionados en el formulario.
   */
  public paisOrigen!: Catalogo[];

  /**
   * Representa el formulario reactivo utilizado para combinar diferentes datos en el componente.
   * Se utiliza para gestionar y validar los datos relacionados con las diferentes secciones del formulario.
   */
  public formCombinacion!: FormGroup;

  /**
   * Subject utilizado para emitir una notificación cuando el componente se destruye.
   * Se utiliza para gestionar la cancelación de suscripciones y evitar fugas de memoria
   * mediante el operador 'takeUntil' en observables.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Representa el estado de la solicitud en el flujo 220401.
   * Contiene la información relevante relacionada con el estado actual de la solicitud
   * y se utiliza para gestionar y mostrar los datos en el componente.
   */
  public solicitudState!: Solicitud220401State;

  /**
   * Valor recibido desde el componente padre para determinar la opción seleccionada en el radio principal.
   * Se utiliza para condicionar la visualización y lógica del formulario.
   */
  @Input() certificadaValue: unknown;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, el formulario no permite edición.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * El constructor se encarga de inyectar los servicios necesarios para el componente.
   * Cada servicio tiene una función específica que facilita la interacción con el formulario,
   * la validación, el manejo de estado de la aplicación y la carga de datos.
   *
   * @param fb Servicio para la creación y manejo de formularios reactivos en Angular.
   * @param validacionesService Servicio para manejar las validaciones de los formularios.
   * @param agregar220401Store Servicio encargado del manejo del estado relacionado con el flujo 220401.
   * @param agregarQuery Servicio que proporciona información o estados adicionales para el componente.
   * @param _pantallas220401Service Servicio encargado de la lógica específica relacionada con las pantallas del flujo 220401.
   * @param consultaioQuery Servicio para consultar el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private agregar220401Store: Agregar220401Store,
    private agregarQuery: AgregarQuery,
    private _pantallas220401Service: Pantallas220401Service,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.crearFormCombinacion();
          this.guardarDatosFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama a la función para inicializar el formulario de combinación.
   */
  ngOnInit(): void {
    this.inicializarCombinacionFormulario();
  }

  /**
   * Inicializa el formulario de combinación requerido.
   * 
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), 
   * guarda los datos actuales del formulario llamando a `guardarDatosFormulario()`.
   * De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   */
  inicializarCombinacionFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
  }

  /**
   * Inicializa el formulario y carga los datos necesarios para el componente.
   *
   * Este método realiza las siguientes acciones:
   * - Se suscribe al observable `selectSolicitud$` para obtener el estado de la solicitud y lo asigna a `solicitudState`.
   * - Llama a `crearFormCombinacion` para crear la estructura del formulario.
   * - Carga los datos requeridos para los campos del formulario, incluyendo especie, función zootécnica, mercancía, país de destino, nombre del establecimiento, tipo de actividad, aduana de salida, OISA de salida, régimen de mercancía y país de origen.
   */
  inicializarFormulario(): void {
    this.agregarQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormCombinacion();
    this.loaddatEspecieData();
    this.loadFuncionZootecnica();
    this.loadMercancia();
    this.laodPaisDestino();
    this.loadNombreEstablecimiento();
    this.loadTipoActividad();
    this.loadAduanaSalida();
    this.loadOisaSalida();
    this.loadRegimenMercancia();
    this.loadPaisOrigen();
  }

  /**
   * Guarda los datos del formulario de combinación requerida.
   * 
   * Inicializa el formulario y ajusta su estado de habilitación según si es de solo lectura.
   * - Si el formulario es de solo lectura, lo deshabilita.
   * - Si no es de solo lectura, lo habilita.
   */
  guardarDatosFormulario(): void { 
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formCombinacion.disable();
    } else {
      this.formCombinacion.enable();
    }
  }

  /**
   * Verifica si un campo específico del formulario `formCombinacion` no es válido
   * y ha sido tocado (modificado por el usuario).
   *
   * @param field El nombre del campo dentro del formulario que se desea validar.
   * @returns Retorna `true` si el campo tiene errores y ha sido tocado, de lo contrario `false`.
   */
  public isValid(field: string): boolean | null {
    return this.validacionesService.isValid(this.formCombinacion, field);
  }

  /**
   * Crea el formulario `formCombinacion` con los valores del estado `solicitudState`
   * y aplica validación de longitud máxima (200) a `puntoIngreso`.
   */
  public crearFormCombinacion(): void {
    this.formCombinacion = this.fb.group({
      tipoProducto: [this.solicitudState?.tipoProducto],
      especie: [this.solicitudState?.especie],
      funcionZootecnica: [this.solicitudState?.funcionZootecnica],
      mercancia: [this.solicitudState?.mercancia],
      paisDestino: [this.solicitudState?.paisDestino],
      nombreEstablecimiento: [this.solicitudState?.nombreEstablecimiento],
      tipoActividad: [this.solicitudState?.tipoActividad],
      otro: [this.solicitudState?.otro],
      aduanaSalida: [this.solicitudState?.aduanaSalida],
      oisaSalida: [this.solicitudState?.oisaSalida],
      regimenMercancia: [this.solicitudState?.regimenMercancia],
      paisOrigen: [this.solicitudState?.paisOrigen],
      puntoIngreso: [this.solicitudState?.puntoIngreso, [Validators.maxLength(200)]],
      nombreEstablecimientoCheck: [this.solicitudState?.nombreEstablecimientoCheck],
      numeroAutorizacionCheck: [this.solicitudState?.numeroAutorizacionCheck],
      tipoActividadCheck: [this.solicitudState?.tipoActividadCheck],
      otroCheck: [this.solicitudState?.otroCheck],
      fechaArribo: [this.solicitudState?.fechaArribo],
      uso: [this.solicitudState?.uso],
    });
  }

  /**
   * Establece un valor en el store llamando dinámicamente un método según su nombre.
   *
   * @param form El formulario reactivo que contiene el valor.
   * @param campo El nombre del campo dentro del formulario.
   * @param metodoNombre El nombre del método del store que se va a invocar (debe existir en `Agregar220401Store`).
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Agregar220401Store): void {
    const VALOR = form.get(campo)?.value;
    (this.agregar220401Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Carga los datos de especie desde el servicio y los asigna a la propiedad `especie`.
   */
  loaddatEspecieData(): void {
    this._pantallas220401Service.getEspecieData().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.especie = data;
    });
  }

  /**
   * Carga las funciones zootécnicas desde el servicio y las asigna a la propiedad `funcionZootecnica`.
   */
  loadFuncionZootecnica(): void {
    this._pantallas220401Service.getFuncionZootecnica().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.funcionZootecnica = data;
    });
  }

  /**
   * Carga los datos de mercancía desde el servicio y los asigna a la propiedad `mercancia`.
   */
  loadMercancia(): void {
    this._pantallas220401Service.getMercancia().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.mercancia = data;
    });
  }

  /**
   * Carga los datos del país de destino desde el servicio y los asigna a la propiedad `paisDestino`.
   */
  laodPaisDestino(): void {
    this._pantallas220401Service.getlaodPaisDestino().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.paisDestino = data;
    });
  }

  /**
   * Carga los nombres de establecimientos desde el servicio y los asigna a la propiedad `nombreEstablecimiento`.
   */
  loadNombreEstablecimiento(): void {
    this._pantallas220401Service.getNombreEstablecimiento().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.nombreEstablecimiento = data;
    });
  }

  /**
   * Carga los tipos de actividad desde el servicio y los asigna a la propiedad `tipoActividad`.
   */
  loadTipoActividad(): void {
    this._pantallas220401Service.getTipoActividad().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.tipoActividad = data;
    });
  }

  /**
   * Carga los datos de aduanas de salida desde el servicio y los asigna a la propiedad `aduanaSalida`.
   */
  loadAduanaSalida(): void {
    this._pantallas220401Service.getAduanaSalida().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.aduanaSalida = data;
    });
  }

  /**
   * Carga los datos de OISA de salida desde el servicio y los asigna a la propiedad `oisaSalida`.
   */
  loadOisaSalida(): void {
    this._pantallas220401Service.getOisaSalida().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.oisaSalida = data;
    });
  }

  /**
   * Carga los regímenes de mercancía desde el servicio y los asigna a la propiedad `regimenMercancia`.
   */
  loadRegimenMercancia(): void {
    this._pantallas220401Service.getRegimenMercancia().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.regimenMercancia = data;
    });
  }

  /**
   * Carga los países de origen desde el servicio y los asigna a la propiedad `paisOrigen`.
   */
  loadPaisOrigen(): void {
    this._pantallas220401Service.getPaisOrigen().pipe(takeUntil(this.destroyNotifier$)).subscribe((data) => {
      this.paisOrigen = data;
    });
  }

  /**
   * Hook de ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Emite una señal para cancelar todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
