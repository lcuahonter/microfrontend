import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud6102State, Solicitud6102Store } from '../../estados/solicitud6102.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JuntaTecnicaRegistroService } from '../../service/junta-tecnica-registro.service';
import { Solicitud6102Query } from '../../estados/solicitud6102.query';

/**
 * Componente que gestiona la solicitud del trámite 6102.
 * Contiene la lógica para inicializar el formulario, manejar eventos y comunicarse con el estado global.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true, 
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    CatalogoSelectComponent
  ],
  providers: [],
  templateUrl: './Solicitud.component.html',
  styleUrl: './Solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {

  /**
  * Formulario reactivo para gestionar los datos del aviso.
  */
  tecnicaForm!: FormGroup;

  /**
  * Estado actual de la solicitud.
  */
  public solicitudState!: Solicitud6102State;

  /**
  * Sujeto utilizado como notificador para la destrucción del componente.
  * Se emite un valor cuando el componente se destruye, permitiendo cancelar
  * suscripciones o liberar recursos asociados.
  */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
    * Lista de contenedores.
    */
  contenedores: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

    /**
    * Lista de aduana.
    */
  aduana: {
    catalogos: Catalogo[];
    labelNombre: string;
    primerOpcion: string;
  };

   /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private store: Solicitud6102Store,
    private query: Solicitud6102Query,
    private juntaTecnicaRegistroService: JuntaTecnicaRegistroService,
    private consultaioQuery: ConsultaioQuery
  ) {
      this.contenedores = {
        catalogos: [],
        labelNombre: 'Fracción arancelaria determinada',
        primerOpcion: 'Seleccione un valor',
      };
      this.aduana = {
        catalogos: [],
        labelNombre: 'Toma de muestra',
        primerOpcion: 'Seleccione una opción',
      };
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * 
   * - Suscribe al observable `seleccionarSolicitud$` para actualizar el estado de la solicitud
   *   utilizando `takeUntil` para manejar la destrucción del componente.
   * - Inicializa el formulario llamando a `inicializarFormulario`.
   * - Carga las opciones de contenedores llamando a `cargarContenedoresOpciones`.
   * - Carga las opciones de aduana llamando a `cargarAduanaOpciones`.
   */
  ngOnInit(): void {
    this.query.seleccionarSolicitud$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
      })
    )
    .subscribe();
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaDatos = seccionState;
        this.soloLectura = this.consultaDatos.readonly;
      })
    )
    .subscribe();
    this.inicializarFormulario();
    this.guardarDatosFormulario();
    this.cargarContenedoresOpciones();
    this.cargarAduanaOpciones();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable `destroyNotifier$` para notificar a los suscriptores
   * que deben limpiar recursos o cancelar suscripciones, y luego completa el observable.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Inicializa el formulario `tecnicaForm` con los valores predeterminados 
   * obtenidos del estado actual de la solicitud (`solicitudState`).
   * 
   * El formulario contiene los siguientes campos:
   * - `contenedores`: Campo obligatorio que toma su valor inicial de `solicitudState?.contenedores`.
   * - `aduana`: Campo obligatorio que toma su valor inicial de `solicitudState?.aduana`.
   * - `observaciones`: Campo opcional que toma su valor inicial de `solicitudState?.observaciones`.
   * 
   * Se utiliza el servicio `FormBuilder` para crear el grupo de controles 
   * y se aplican validaciones donde corresponda.
   */
  inicializarFormulario(): void {
    this.tecnicaForm = this.fb.group({
      contenedores: [this.solicitudState?.contenedores, [Validators.required]],
      aduana: [this.solicitudState?.aduana, [Validators.required]],
      observaciones: {value:this.solicitudState?.observaciones, disabled: this.soloLectura},
    });
    this.guardarDatosFormulario();
    }

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    if (this.soloLectura) {
      this.tecnicaForm.disable();
    } else {
      this.tecnicaForm.enable();
    }
  }

  /**
  * Actualiza un valor en el estado global utilizando el almacén.
  * @param form Formulario reactivo.
  * @param campo Nombre del campo a actualizar.
  * @param metodoNombre Nombre del método del almacén para actualizar el estado.
  */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Solicitud6102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Carga las opciones de contenedores desde el servicio `juntaTecnicaRegistroService`
   * y las asigna al catálogo de contenedores.
   *
   * Este método utiliza un observable para obtener los datos de la lista de contenedores
   * y se asegura de limpiar las suscripciones utilizando `takeUntil` con el notificador
   * de destrucción del componente.
   *
   * @returns {void} No retorna ningún valor.
   */
  cargarContenedoresOpciones(): void {
    this.juntaTecnicaRegistroService.getOptionLista("contenedorLista").pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (data) => {
        this.contenedores.catalogos = data.data;
      },
    );
  }

  /**
   * Carga las opciones de aduana desde el servicio `juntaTecnicaRegistroService` y las asigna
   * al catálogo de aduanas. Este método utiliza un observable para suscribirse a los datos
   * y asegura la limpieza de la suscripción utilizando `takeUntil` con el `destroyNotifier$`.
   *
   * @remarks
   * Este método es parte del componente `Solicitud` y se encarga de inicializar las opciones
   * de aduana necesarias para el funcionamiento del formulario.
   *
   * @returns {void} No retorna ningún valor.
   */
  cargarAduanaOpciones(): void {
    this.juntaTecnicaRegistroService.getOptionLista("aduanaLista").pipe(takeUntil(this.destroyNotifier$)).subscribe(
      (data) => {
        this.aduana.catalogos = data.data;
      },
    );
  }
}
