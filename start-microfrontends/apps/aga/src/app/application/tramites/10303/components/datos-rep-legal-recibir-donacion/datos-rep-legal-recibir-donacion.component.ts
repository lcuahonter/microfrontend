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
 * Componente para gestionar los datos del representante legal autorizado para recibir donaciones.
 */
@Component({
  selector: 'app-datos-rep-legal-recibir-donacion',
  templateUrl: './datos-rep-legal-recibir-donacion.component.html',
  styleUrl: './datos-rep-legal-recibir-donacion.component.scss'
})
export class DatosRepLegalRecibirDonacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario de datos del representante legal autorizado para recibir donaciones.
   */
  datosRepLegalRecibirDonacionForm!: FormGroup;

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
   * Se ejecuta al inicializar el componente.
   * Llama a la función `inicializaCatalogos()` para cargar los catálogos necesarios.
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
    this.crearDatosRepLegalRecibirDonacionForm();

    this.paisSeleccion();

    if (this.formularioDeshabilitado) {
      this.datosRepLegalRecibirDonacionForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.datosRepLegalRecibirDonacionForm.enable();
    }
  }

  /**
    * Inicializa el formulario reactivo
    * @returns {void}
    */
  crearDatosRepLegalRecibirDonacionForm(): void {
    this.datosRepLegalRecibirDonacionForm = this.fb.group({
      rfcRepLegalAutorizado: [this.registroDeDonacionState?.rfcRepLegalAutorizado],
      nombreRepLegalAutorizado: [{ value: this.registroDeDonacionState?.nombreRepLegalAutorizado, disabled: true }],
      calleRepLegalAutorizado: [{ value: this.registroDeDonacionState?.calleRepLegalAutorizado, disabled: true }],
      numExteriorRepLegalAutorizado: [{ value: this.registroDeDonacionState?.numExteriorRepLegalAutorizado, disabled: true }],
      numInteriorRepLegalAutorizado: [{ value: this.registroDeDonacionState?.numInteriorRepLegalAutorizado, disabled: true }],
      cvePaisRepLegalAutorizado: [{ value: this.registroDeDonacionState?.cvePaisRepLegalAutorizado, disabled: true }],
      codigoPostalRepLegalAutorizado: [{ value: this.registroDeDonacionState?.codigoPostalRepLegalAutorizado, disabled: true }],
      estadoRepLegalAutorizado: [{ value: this.registroDeDonacionState?.estadoRepLegalAutorizado, disabled: true }],
      coloniaRepLegalAutorizado: [{ value: this.registroDeDonacionState?.coloniaRepLegalAutorizado, disabled: true }],
      correoElectronicoRepLegalAutorizado: [{ value: this.registroDeDonacionState?.correoElectronicoRepLegalAutorizado, disabled: true }],
      telefonoRepLegalAutorizado: [{ value: this.registroDeDonacionState?.telefonoRepLegalAutorizado, disabled: true }]
    });
  }

  /**
   * Inicializa los catálogos necesarios, como el de países.
   * Llama al servicio `donacionesExtranjerasService` para obtener la lista de países.
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
    const PAIS = this.datosRepLegalRecibirDonacionForm.get('cvePaisRepLegalAutorizado')?.value;
    this.tramite10303Store.setCvePaisRepLegalAutorizado(PAIS);
  }

  /**
   * Busca un contribuyente por RFC y actualiza los datos del representante legal autorizado.
   * @param {number} valor - Valor que indica si la búsqueda debe proceder.
   * @param {string} id - RFC del contribuyente a buscar.
   */
  buscarContribuyenteRfc(valor: number, id: string): void {
    // Implement the logic to search for the contributor by RFC
    this.donacionesExtranjerasService.buscarContribuyente(id).pipe(
      takeUntil(this.destruirNotificador$)
    ).subscribe({
      next: (result: ContribuyenteRespuesta) => {
        const DATA = result?.data[0];
        if (DATA !== null) {
          if (valor === 3) {
            this.construirRepLegalAutorizado(DATA, true);
          }
          else {
            this.toastr.error("Valor erronio");
          }
        } else {
          if (valor === 3) {
            this.construirRepLegalAutorizado(DATA, false);
          } else {
            this.toastr.error("Valor erronio");
          }
        }
      }
    });
  }

  /**
   * Completa los campos del formulario con los datos del contribuyente encontrado.
   * @param {Contribuyente} data - Datos del contribuyente obtenidos de la búsqueda.
   * @param {boolean} encontrado - Indica si el contribuyente fue encontrado.
   */
  construirRepLegalAutorizado(data: Contribuyente, encontrado: boolean): void {
    if (encontrado) {
      const VALORES_DE_FORMATO = {
        nombreRepLegalAutorizado: data.rfc.length === 12 ? data.razonSocial ?? '' : `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        calleRepLegalAutorizado: data.calle,
        numExteriorRepLegalAutorizado: data.numeroExterior,
        numInteriorRepLegalAutorizado: data.numeroInterior ?? '',
        estadoRepLegalAutorizado: data.estado,
        coloniaRepLegalAutorizado: data.colonia,
        codigoPostalRepLegalAutorizado: data.codigoPostal,
        cvePaisRepLegalAutorizado: data.pais,
        correoElectronicoRepLegalAutorizado: data.correoElectronico,
        telefonoRepLegalAutorizado: data.telefono
      };

      this.datosRepLegalRecibirDonacionForm.patchValue(VALORES_DE_FORMATO);

      this.tramite10303Store.setNombreRepLegalAutorizado(VALORES_DE_FORMATO.nombreRepLegalAutorizado);
      this.tramite10303Store.setCalleRepLegalAutorizado(VALORES_DE_FORMATO.calleRepLegalAutorizado);
      this.tramite10303Store.setNumExteriorRepLegalAutorizado(VALORES_DE_FORMATO.numExteriorRepLegalAutorizado);
      this.tramite10303Store.setNumInteriorRepLegalAutorizado(VALORES_DE_FORMATO.numInteriorRepLegalAutorizado);
      this.tramite10303Store.setEstadoRepLegalAutorizado(VALORES_DE_FORMATO.estadoRepLegalAutorizado);
      this.tramite10303Store.setColoniaRepLegalAutorizado(VALORES_DE_FORMATO.coloniaRepLegalAutorizado);
      this.tramite10303Store.setCodigoPostalRepLegalAutorizado(VALORES_DE_FORMATO.codigoPostalRepLegalAutorizado);
      this.tramite10303Store.setCvePaisRepLegalAutorizado(VALORES_DE_FORMATO.cvePaisRepLegalAutorizado);
      this.tramite10303Store.setCorreoElectronicoRepLegalAutorizado(VALORES_DE_FORMATO.correoElectronicoRepLegalAutorizado);
      this.tramite10303Store.setTelefonoRepLegalAutorizado(VALORES_DE_FORMATO.telefonoRepLegalAutorizado);
    } else {
      this.restablecerFormulario();
    }
  }

  /**
   * Resetea todos los campos del formulario a sus valores iniciales.
   */
  restablecerFormulario(): void {
    this.datosRepLegalRecibirDonacionForm.reset();
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
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}