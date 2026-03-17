import { Catalogo, CatalogoSelectComponent, InputFechaComponent, JSONResponse, REGEX_IMPORTE_PAGO, REGEX_LLAVE_DE_PAGO, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { CommonModule } from '@angular/common';
import { INPUT_FECHA_CONFIG } from '../../services/certificados-licencias.enum';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';

/**
 * Componente `PagoDeDerechosComponent` que representa el formulario para el pago de derechos.
 * Este componente es standalone y utiliza varios módulos y componentes para su funcionalidad.
 * @decorator `@Component`
 */
@Component({
  selector: 'app-pago-de-derechos',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    InputFechaComponent,
    TituloComponent,
    ReactiveFormsModule
  ],
  templateUrl: './pago-de-derechos.component.html',
  styleUrl: './pago-de-derechos.component.scss',
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {

  /**
     * Formulario de la solicitud.
     */
    formSolicitud!: FormGroup;
  
    /**
     * Subject para notificar la destrucción del componente.
     */
    private destroyNotifier$: Subject<void> = new Subject();
  
    /**
     * Constante para configurar el input de fecha.
     */
    INPUT_FECHA_CONFIG = INPUT_FECHA_CONFIG;

    /**
     * Representa el estado de la Solicitud 260701.
     * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
     * Se espera que se inicialice con una instancia de `Solicitud260303State`.
     */
    public solicitudState!: Solicitud260701State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
    public esFormularioSoloLectura: boolean = false;

    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
    public consultaState!: ConsultaioState;


    /**
     * Constructor del componente `PagoDeDerechosComponent`.
     * @param fb - Instancia de `FormBuilder` para crear formularios reactivos.
     * @param certificadosLicenciasSvc - Servicio para manejar operaciones relacionadas con certificados y licencias.
     * @param tramite260701Store - Store para gestionar el estado del trámite 260701.
     * @param tramite260701Query - Query para consultar el estado del trámite 260701.
     */
    constructor(
      private fb: FormBuilder,
      private certificadosLicenciasSvc: CertificadosLicenciasService,
      private tramite260701Store: Tramite260701Store,
      private tramite260701Query: Tramite260701Query,
      private consultaioQuery: ConsultaioQuery
    ) {
        this.consultaioQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
      this.fetchBancoData();
    }
  
    /**
     * Catálogo de bancos.
     */
    public bancoCatalogo!: Catalogo[];
  
    /**
     * Método para actualizar el banco seleccionado.
     * @param e {Catalogo} Banco seleccionado.
     */
    ngOnInit(): void {
      this.crearFormSolicitudForm();
    }


    /**
     * Inicializa el FormGroup `formSolicitud` con controles predefinidos y sus validadores.
     * 
     * El formulario incluye los siguientes campos:
     * - `claveDeReferencia`: Un campo de texto con una longitud máxima de 50 caracteres.
     * - `cadenaDependencia`: Un campo de texto con una longitud máxima de 50 caracteres.
     * - `banco`: Un campo para la información del banco, sin validación específica aplicada.
     * - `llaveDePago`: Un campo alfanumérico obligatorio con exactamente 10 caracteres en mayúsculas o dígitos.
     * - `fechaPago`: Un campo para la fecha de pago, sin validación específica aplicada.
     * - `importePago`: Un campo para el monto del pago, que permite solo caracteres alfanuméricos.
     * 
     * Se aplican validadores para garantizar la integridad de los datos y hacer cumplir formatos de entrada específicos.
     */
    public crearFormSolicitudForm(): void {
       this.tramite260701Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.solicitudState = seccionState;
      })).subscribe();
      this.formSolicitud = this.fb.group({
        claveDeReferencia: [this.solicitudState?.claveDeReferencia,[Validators.maxLength(50)]],
        cadenaDependencia: [this.solicitudState?.cadenaDependencia,Validators.maxLength(50)],
        banco: [this.solicitudState?.banco],
        llaveDePago: [this.solicitudState?.llaveDePago,[Validators.required,Validators.pattern(REGEX_LLAVE_DE_PAGO)]],
        fechaPago: [this.solicitudState?.fechaPago],
        importePago: [this.solicitudState?.importePago,Validators.pattern(REGEX_IMPORTE_PAGO)],
      });

      if (this.consultaState.update) {
        if (this.solicitudState?.fechaPago) {
          this.formSolicitud.get('fechaPago')?.setValue(this.solicitudState?.['fechaPago']);
        }
      }
    }
  
    /**
     * Método para actualizar el banco seleccionado.
     * @param e {Catalogo} Banco seleccionado.
     */
    fetchBancoData(): void {
      this.certificadosLicenciasSvc.getBancoDatos().pipe(takeUntil(this.destroyNotifier$)).subscribe((response:JSONResponse) => {
          const DATOS = JSON.parse(JSON.stringify(response));
          this.bancoCatalogo = DATOS.data
        });
    }

      /**
       * Establece el valor de un campo en el store de Tramite31601.
       * @param form - El grupo de formularios que contiene el campo.
       * @param campo - El nombre del campo cuyo valor se va a establecer.
       * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
       */
      public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260701Store): void {
        const VALOR = form.get(campo)?.value;
        (this.tramite260701Store[metodoNombre] as (value: unknown) => void)(VALOR);
      }

  /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearFormSolicitudForm();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  public guardarDatosFormulario(): void {
    this.crearFormSolicitudForm();
    Promise.resolve().then(() => {
      if (this.esFormularioSoloLectura) {
      this.formSolicitud.disable();
      } else if (!this.esFormularioSoloLectura) {
      this.formSolicitud.enable();
      }
    });
  }
  
    /**
     * Método para actualizar el banco seleccionado.
     * @param e {Catalogo} Banco seleccionado.
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }

}
