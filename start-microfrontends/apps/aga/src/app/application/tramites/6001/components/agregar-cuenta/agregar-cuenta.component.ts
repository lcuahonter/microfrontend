import { AgregarCuenta6001State, Tramite6001Store } from '../../estados/tramite6001.store';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { REGEX_RFC } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { RegistroCuentasBancariasService } from '../../services/registro-cuentas-bancarias.service';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { Tramite6001Query } from '../../estados/tramite6001.query';
import { resetStores } from '@datorama/akita/src/lib/resetStores';


/**
 * Componente AgregarCuenta que se utiliza para mostrar y gestionar los AgregarCuenta.
 * 
 * Este componente utiliza varios subcomponentes como TituloComponent, CommonModule,
 * ReactiveFormsModule,CatalogoSelectComponent para mostrar información y permitir al usuario seleccionar y agregar cuenta.
 * 
 * @component
 */
@Component({
  selector: 'app-agregar-cuenta',
  standalone: true,
  imports: [CommonModule, TituloComponent,CatalogoSelectComponent,ReactiveFormsModule],
  templateUrl: './agregar-cuenta.component.html',
  styleUrl: './agregar-cuenta.component.scss',
})
export class AgregarCuentaComponent implements OnInit,OnDestroy {

  /**
   * Representa el catálogo de tipos de personas.
   * Se espera que esta propiedad sea un array de objetos `Catalogo`.
   */
  public tipoDePersona!: Catalogo[];

  /**
   * Una lista de países donde reside el titular de la cuenta.
   * 
   * @type {Catalogo[]}
   */
  public paisDondeRadica!: Catalogo[];
  
  /**
   * Una propiedad pública que contiene un array de objetos `Catalogo`.
   * Esta propiedad representa el catálogo de instituciones.
   */
  public institucion!: Catalogo[];

  /**
   * Representa el estado del componente, que es un array de objetos `Catalogo`.
   */
  public estado!: Catalogo[];

  /**
   * Un grupo de formularios para agregar una nueva cuenta.
   * Este grupo de formularios contiene los controles y validadores requeridos para el componente 'Agregar Cuenta'.
   */
  public agregarCuentaForm!: FormGroup;

    /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();


  /**
   * Representa el estado para agregar una cuenta en el componente AgregarCuenta6001.
   * Este estado se utiliza para gestionar los datos y el comportamiento asociado con el proceso de adición de cuentas.
   */
  public agregarCuentaState!: AgregarCuenta6001State;
  /**
   * Indica si el formulario "Agregar Cuenta" ha sido enviado.
   */
  public tieneAgregarCuentaFormEnviado: boolean = false;

  /**
   * Constructor del componente AgregarCuentaComponent.
   * 
   * @param _registroCuentasBancariasSvc - Servicio para gestionar registros de cuentas bancarias.
   * @param fb - Instancia de FormBuilder para crear formularios reactivos.
   */
  constructor( 
      private _registroCuentasBancariasSvc: RegistroCuentasBancariasService,
      private fb: FormBuilder,
      private tramite6001Store: Tramite6001Store,
      private tramite6001Query: Tramite6001Query,
    ) { 
        //
  }

  /**
   * Gancho de ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Este método se utiliza para realizar la inicialización del componente, como la obtención de datos necesarios.
   * 
   * Se llaman los siguientes métodos en este orden:
   * - `getTipoDePersona()`: Obtiene el tipo de persona.
   * - `getPaisDondeRadica()`: Obtiene el país donde reside la persona.
   * - `getInstitucion()`: Obtiene la información de la institución.
   * - `getEstado()`: Obtiene la información del estado.
   */
  ngOnInit(): void {
    this.tramite6001Query.agregarCuenta$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.agregarCuentaState = seccionState;
      })
    )
    .subscribe();
    this.crearAgregarCuentaForm();
    this.getTipoDePersona();
    this.getPaisDondeRadica();
    this.getInstitucion();
    this.getEstado();
  }

  /**
   * Crea una copia profunda del objeto proporcionado.
   * 
   * Este método serializa el objeto a una cadena JSON y luego lo analiza de nuevo a un nuevo objeto,
   * creando efectivamente una copia profunda. Tenga en cuenta que este enfoque puede no manejar funciones,
   * valores indefinidos o referencias circulares correctamente.
   * 
   * @param obj - El objeto que se va a copiar profundamente. Por defecto es un objeto vacío.
   * @returns Una copia profunda del objeto proporcionado.
   */
  /*eslint class-methods-use-this: ["error", { "exceptMethods": ["deepCopy"] }] */
  public deepCopy(obj = {}): RespuestaCatalogos {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Crea e inicializa el grupo de formularios para agregar una cuenta.
   * 
   * El grupo de formularios contiene los siguientes controles:
   * - `titularDeLaCuenta`: El nombre del titular de la cuenta, requerido y con una longitud máxima de 90 caracteres.
   * - `persona`: La persona asociada con la cuenta.
   * - `rfc`: El RFC (Registro Federal de Contribuyentes), requerido y debe coincidir con el patrón especificado.
   * - `numeroDeCuenta`: El número de cuenta, requerido y con una longitud máxima de 30 caracteres.
   * - `pais`: El país asociado con la cuenta.
   * - `institucion`: La institución asociada con la cuenta.
   * - `estado`: El estado asociado con la cuenta.
   * - `sucursal`: La sucursal, requerida, con una longitud máxima de 10 caracteres, y debe coincidir con el patrón especificado.
   * - `numeroDePlaza`: El número de plaza, requerido, con una longitud máxima de 10 caracteres, y debe coincidir con el patrón especificado.
   * 
   * @returns {void}
   */
  public crearAgregarCuentaForm():void {
    this.agregarCuentaForm = this.fb.group({
      titularDeLaCuenta: [this.agregarCuentaState.titularDeLaCuenta,[Validators.required,Validators.maxLength(90)]],
      persona: [this.agregarCuentaState.persona],
      rfc: [this.agregarCuentaState.rfc,[Validators.required,Validators.pattern(REGEX_RFC)]],
      numeroDeCuenta: [this.agregarCuentaState.numeroDeCuenta,[Validators.required,Validators.maxLength(30)]],
      pais: [this.agregarCuentaState.pais],
      institucion: [this.agregarCuentaState.institucion],
      estado: [this.agregarCuentaState.estado],
      sucursal: [this.agregarCuentaState.sucursal,[Validators.required,Validators.maxLength(10),Validators.pattern(/[^0-9A-Za-z&_-]/)]],
      numeroDePlaza: [this.agregarCuentaState.numeroDePlaza,[Validators.required,Validators.maxLength(10),Validators.pattern(/[^0-9A-Za-z]/)]]
    })
  }

  /**
   * Obtiene los datos del tipo de persona desde el servicio y los asigna a la propiedad `tipoDePersona`.
   * 
   * Este método realiza una solicitud HTTP para recuperar los datos del tipo de persona utilizando el 
   * método del servicio `_registroCuentasBancariasSvc.getTipoDePersonaDatos()`. La respuesta se copia 
   * profundamente para asegurar la inmutabilidad y luego se asigna a la propiedad `tipoDePersona`.
   * 
   * @returns {void} Este método no devuelve un valor.
   */
  public getTipoDePersona(): void {
    this._registroCuentasBancariasSvc.getTipoDePersonaDatos().subscribe((response) => {
      const API_RESPONSE = this.deepCopy(response);
      this.tipoDePersona = API_RESPONSE.data;
    })
  }

  /**
   * Obtiene los datos del país donde reside el usuario desde el servicio.
   * Se suscribe a la respuesta del servicio y asigna los datos a `paisDondeRadica`.
   * Utiliza una copia profunda de la respuesta para asegurar la inmutabilidad.
   */
  public getPaisDondeRadica(): void {
    this._registroCuentasBancariasSvc.getPaisDondeRadicaDatos().subscribe((response) => {
      const API_RESPONSE = this.deepCopy(response);
      this.paisDondeRadica = API_RESPONSE.data;
    })
  }

  /**
   * Obtiene los datos de la institución desde el servicio y los asigna a la propiedad `institucion`.
   * 
   * Este método llama al método `getInstitucionDatos` del servicio `_registroCuentasBancariasSvc`,
   * se suscribe al observable devuelto por el servicio y procesa la respuesta.
   * La respuesta se copia profundamente y la propiedad `data` de la respuesta copiada se asigna a la propiedad `institucion`.
   * 
   * @returns {void}
   */
  public getInstitucion(): void {
    this._registroCuentasBancariasSvc.getInstitucionDatos().subscribe((response) => {
      const API_RESPONSE = this.deepCopy(response);
      this.institucion = API_RESPONSE.data;
    })
  }

  /**
   * Obtiene los datos del estado desde el servicio y los asigna a la propiedad `estado`.
   * 
   * Este método llama al método `getEstadoDatos` del servicio `_registroCuentasBancariasSvc`,
   * se suscribe al observable devuelto por el servicio y procesa la respuesta.
   * La respuesta se copia profundamente y la propiedad `data` de la respuesta copiada se asigna a la propiedad `estado`.
   * 
   * @returns {void}
   */
  public getEstado(): void {
    this._registroCuentasBancariasSvc.getEstadoDatos().subscribe((response) => {
      const API_RESPONSE = this.deepCopy(response);
      this.estado = API_RESPONSE.data;
    })
  }


  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */

  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite6001Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite6001Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Activa el cambio del componente actual a 'DatosGenerales'.
   * Este método se utiliza para guardar el estado actual y navegar al componente 'DatosGenerales'.
   *
   * @public
   * @returns {void}
   */
  public guardar(): void {
    this.tieneAgregarCuentaFormEnviado = true;
    if(this.agregarCuentaForm.valid) {
      this._registroCuentasBancariasSvc.conjuntoTablaDatos(this.agregarCuentaForm.value);
      this._registroCuentasBancariasSvc.cambiarComponente('DatosGenerales');
    }
  }

  /**
   * Cancela la operación actual de agregar una cuenta bancaria.
   */
  public cancelar(): void {
    this.agregarCuentaForm.reset(this.agregarCuentaForm.value);
    this.agregarCuentaForm.updateValueAndValidity();
    resetStores(); 
    this._registroCuentasBancariasSvc.cambiarComponente('DatosGenerales');
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
