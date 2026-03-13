import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, map, merge, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { DonacionesExtranjerasService } from '../../services/donaciones-extranjeras/donaciones-extranjeras.service';

import { Contribuyente, ContribuyenteRespuesta } from '../../models/donaciones-extranjeras.model';
import { RegistroDeDonacion10303State, Tramite10303Store } from '../../estados/tramites/tramite10303.store';
import { Catalogo } from '@ng-mf/data-access-user';
import { Tramite10303Query } from '../../estados/queries/tramite10303.query';

/**
 * Componente que maneja los datos del representante legal del donatario.
 */
@Component({
  selector: 'app-datos-rep-legal-donatario',
  templateUrl: './datos-rep-legal-donatario.component.html',
  styleUrl: './datos-rep-legal-donatario.component.scss'
})
export class DatosRepLegalDonatarioComponent implements OnInit, OnDestroy {
  /**
   * Formulario de datos del representante legal del donatario.
   */
  datosRepLegalDonatarioForm!: FormGroup;

  /**
   * Subject para destruir las suscripciones.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Lista de países obtenida desde el servicio.
   */
  pais!: Catalogo[];

  /**
    * Estado de la registro de donacion.
    */
  public registroDeDonacionState: RegistroDeDonacion10303State | undefined;

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * Constructor del componente.
   * 
   * @param donacionesExtranjerasService Servicio para gestionar las donaciones extranjeras.
   */
  constructor(
    private donacionesExtranjerasService: DonacionesExtranjerasService,
    private fb: FormBuilder,
    private tramite10303Store: Tramite10303Store,
    private tramite10303Query: Tramite10303Query,
    private toastr: ToastrService
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Llama a la función `inicializaCatalogos()` para cargar los catálogos de países.
   */
  ngOnInit(): void {
    this.inicializaCatalogos();

    this.tramite10303Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.registroDeDonacionState = seccionState;
        })
      )
      .subscribe();

    // Inicializar el formulario principal
    this.crearDatosRepLegalDonatarioForm();

    this.paisSeleccion();

    if (this.formularioDeshabilitado) {
      this.datosRepLegalDonatarioForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.datosRepLegalDonatarioForm.enable();
    }
  }

  /**
    * Inicializa el formulario reactivo
    * @returns {void}
    */
  crearDatosRepLegalDonatarioForm(): void {
    this.datosRepLegalDonatarioForm = this.fb.group({
      rfcRepLegalDonatario: [this.registroDeDonacionState?.rfcRepLegalDonatario],
      nombreRepLegalDonatario: [{ value: this.registroDeDonacionState?.nombreRepLegalDonatario, disabled: true }],
      calleRepLegalDonatario: [{ value: this.registroDeDonacionState?.calleRepLegalDonatario, disabled: true }],
      numExteriorRepLegalDonatario: [{ value: this.registroDeDonacionState?.numExteriorRepLegalDonatario, disabled: true }],
      numInteriorRepLegalDonatario: [{ value: this.registroDeDonacionState?.numInteriorRepLegalDonatario, disabled: true }],
      cvePaisRepLegalDonatario: [{ value: this.registroDeDonacionState?.cvePaisRepLegalDonatario, disabled: true }],
      codigoPostalRepLegalDonatario: [{ value: this.registroDeDonacionState?.codigoPostalRepLegalDonatario, disabled: true }],
      estadoRepLegalDonatario: [{ value: this.registroDeDonacionState?.estadoRepLegalDonatario, disabled: true }],
      coloniaRepLegalDonatario: [{ value: this.registroDeDonacionState?.coloniaRepLegalDonatario, disabled: true }],
      correoElectronicoRepLegalDonatario: [{ value: this.registroDeDonacionState?.correoElectronicoRepLegalDonatario, disabled: true }],
      telefonoRepLegalDonatario: [{ value: this.registroDeDonacionState?.telefonoRepLegalDonatario, disabled: true }]
    });
  }

  /**
   * Método que inicializa los catálogos necesarios, como el de países, llamando al servicio `donacionesExtranjerasService`.
   */
  inicializaCatalogos(): void {
    const PAIS$ = this.donacionesExtranjerasService
      .getPaises()
      .pipe(
        map((resp) => {
          this.pais = resp.data;
        })
      );

    merge(
      PAIS$
    )
    .pipe(takeUntil(this.destruirNotificador$))
    .subscribe();
  }

  /**
   * Establece el país seleccionado en el store de tramite10303.
   */
  paisSeleccion(): void {
    const PAIS = this.datosRepLegalDonatarioForm.get('cvePaisRepLegalDonatario')?.value;
    this.tramite10303Store.setCvePaisRepLegalDonatario(PAIS);
  }

  /**
   * Busca un contribuyente por RFC y actualiza los datos del representante legal donatario.
   * 
   * @param {number} valor - Valor que determina si la búsqueda se debe realizar correctamente (en este caso 2).
   * @param {string} id - RFC del contribuyente que se va a buscar.
   */
  buscarContribuyenteRfc(valor: number, id: string): void {
    // Implementar la lógica para buscar el colaborador por RFC
    this.donacionesExtranjerasService.buscarContribuyente(id).pipe(
      takeUntil(this.destruirNotificador$)
    ).subscribe({
      next: (result: ContribuyenteRespuesta) => {
        const DATA = result?.data[0];
        if (DATA !== null) {
          if (valor === 2) {
            this.construirRLdonatario(DATA, true);
          }
          else {
            this.toastr.error("Valor erronio");
          }
        } else {
          if (valor === 2) {
            this.construirRLdonatario(DATA, false);
          } else {
            this.toastr.error("Valor erronio");
          }
        }
      }
    });
  }

  /**
   * Completa los campos del formulario con los datos del contribuyente encontrado.
   * Si el contribuyente no se encuentra, resetea el formulario.
   * 
   * @param {Contribuyente} data - Datos del contribuyente obtenidos de la búsqueda.
   * @param {boolean} encontrado - Indica si el contribuyente fue encontrado (true o false).
   */
  construirRLdonatario(data: Contribuyente, encontrado: boolean): void {
    if (encontrado) {
      const VALORES_DE_FORMATO = {
        nombreRepLegalDonatario: data.rfc.length === 12 ? data.razonSocial ?? '' : `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        calleRepLegalDonatario: data.calle,
        numExteriorRepLegalDonatario: data.numeroExterior,
        numInteriorRepLegalDonatario: data.numeroInterior ?? '',
        estadoRepLegalDonatario: data.estado,
        coloniaRepLegalDonatario: data.colonia,
        codigoPostalRepLegalDonatario: data.codigoPostal,
        cvePaisRepLegalDonatario: data.pais,
        correoElectronicoRepLegalDonatario: data.correoElectronico,
        telefonoRepLegalDonatario: data.telefono
      };

      this.datosRepLegalDonatarioForm.patchValue(VALORES_DE_FORMATO);

      this.tramite10303Store.setNombreRepLegalDonatario(VALORES_DE_FORMATO.nombreRepLegalDonatario);
      this.tramite10303Store.setCalleRepLegalDonatario(VALORES_DE_FORMATO.calleRepLegalDonatario);
      this.tramite10303Store.setNumExteriorRepLegalDonatario(VALORES_DE_FORMATO.numExteriorRepLegalDonatario);
      this.tramite10303Store.setNumInteriorRepLegalDonatario(VALORES_DE_FORMATO.numInteriorRepLegalDonatario);
      this.tramite10303Store.setEstadoRepLegalDonatario(VALORES_DE_FORMATO.estadoRepLegalDonatario);
      this.tramite10303Store.setColoniaRepLegalDonatario(VALORES_DE_FORMATO.coloniaRepLegalDonatario);
      this.tramite10303Store.setCodigoPostalRepLegalDonatario(VALORES_DE_FORMATO.codigoPostalRepLegalDonatario);
      this.tramite10303Store.setCvePaisRepLegalDonatario(VALORES_DE_FORMATO.cvePaisRepLegalDonatario);
      this.tramite10303Store.setCorreoElectronicoRepLegalDonatario(VALORES_DE_FORMATO.correoElectronicoRepLegalDonatario);
      this.tramite10303Store.setTelefonoRepLegalDonatario(VALORES_DE_FORMATO.telefonoRepLegalDonatario);
    } else {
      this.restablecerFormulario();
    }
  }

  /**
    * Establece los valores en el store de tramite5701.
    *
    * @param {FormGroup} form - El formulario del cual se obtiene el valor.
    * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
    * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
    * @returns {void}
    */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite10303Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite10303Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Resetea todos los campos del formulario a sus valores iniciales.
   */
  restablecerFormulario(): void {
    this.datosRepLegalDonatarioForm.reset();
  }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}
