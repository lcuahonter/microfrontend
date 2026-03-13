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
 * Componente para gestionar los datos de la persona autorizada para recibir donaciones.
 */
@Component({
  selector: 'app-datos-persona-oir-recibir',
  templateUrl: './datos-persona-oir-recibir.component.html',
  styleUrl: './datos-persona-oir-recibir.component.scss'
})
export class DatosPersonaOirRecibirComponent implements OnInit, OnDestroy {
  /**
   * Formulario de datos de la persona autorizada para recibir donaciones.
   */
  datosPersonaOirRecibirForm!: FormGroup;

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
    this.crearDatosPersonaOirRecibirForm();

    this.paisSeleccion();

    if (this.formularioDeshabilitado) {
      this.datosPersonaOirRecibirForm.disable();
    } else if (!this.formularioDeshabilitado) {
      this.datosPersonaOirRecibirForm.enable();
    }
  }

  /**
    * Inicializa el formulario reactivo
    * @returns {void}
    */
  crearDatosPersonaOirRecibirForm(): void {
    this.datosPersonaOirRecibirForm = this.fb.group({
      rfcPersonaAutorizada: [this.registroDeDonacionState?.rfcPersonaAutorizada],
      nombrePersonaAutorizada: [{ value: this.registroDeDonacionState?.nombrePersonaAutorizada, disabled: true }],
      callePersonaAutorizada: [{ value: this.registroDeDonacionState?.callePersonaAutorizada, disabled: true }],
      numExteriorPersonaAutorizada: [{ value: this.registroDeDonacionState?.numExteriorPersonaAutorizada, disabled: true }],
      numInteriorPersonaAutorizada: [{ value: this.registroDeDonacionState?.numInteriorPersonaAutorizada, disabled: true }],
      cvePaisPersonaAutorizada: [{ value: this.registroDeDonacionState?.cvePaisPersonaAutorizada, disabled: true }],
      codigoPostalPersonaAutorizada: [{ value: this.registroDeDonacionState?.codigoPostalPersonaAutorizada, disabled: true }],
      estadoPersonaAutorizada: [{ value: this.registroDeDonacionState?.estadoPersonaAutorizada, disabled: true }],
      coloniaPersonaAutorizada: [{ value: this.registroDeDonacionState?.coloniaPersonaAutorizada, disabled: true }],
      correoElectronicoPersonaAutorizada: [{ value: this.registroDeDonacionState?.correoElectronicoPersonaAutorizada, disabled: true }],
      telefonoPersonaAutorizada: [{ value: this.registroDeDonacionState?.telefonoPersonaAutorizada, disabled: true }]
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
    const PAIS = this.datosPersonaOirRecibirForm.get('cvePaisPersonaAutorizada')?.value;
    this.tramite10303Store.setCvePaisPersonaAutorizada(PAIS);
  }

  /**
   * Busca un contribuyente por RFC y actualiza los datos de la persona autorizada.
   * @param valor - Valor que indica si la búsqueda debe proceder.
   * @param id - RFC del contribuyente a buscar.
   */
  buscarContribuyenteRfc(valor: number, id: string): void {
    // Implement the logic to search for the contributor by RFC
    this.donacionesExtranjerasService.buscarContribuyente(id).pipe(
      takeUntil(this.destruirNotificador$)
    ).subscribe({
      next: (result: ContribuyenteRespuesta) => {
        const DATA = result?.data[0];
        if (DATA !== null) {
          if (valor === 4) {
            this.construirPOyR(DATA, true);
          }
          else {
            this.toastr.error("Valor erronio");
          }
        } else {
          if (valor === 4) {
            this.construirPOyR(DATA, false);
          } else {
            this.toastr.error("Valor erronio");
          }
        }
      }
    });
  }

  /**
   * Completa los campos del formulario con los datos del contribuyente encontrado.
   * @param data - Datos del contribuyente obtenidos de la búsqueda.
   * @param encontrado - Indica si el contribuyente fue encontrado.
   */
  construirPOyR(data: Contribuyente, encontrado: boolean): void {
    if (encontrado) {
      const VALORES_DE_FORMATO = {
        nombrePersonaAutorizada: data.rfc.length === 12 ? data.razonSocial ?? '' : `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        callePersonaAutorizada : data.calle,
        numExteriorPersonaAutorizada: data.numeroExterior,
        numInteriorPersonaAutorizada: data.numeroInterior ?? '',
        estadoPersonaAutorizada: data.estado,
        coloniaPersonaAutorizada: data.colonia,
        codigoPostalPersonaAutorizada: data.codigoPostal,
        cvePaisPersonaAutorizada: data.pais,
        correoElectronicoPersonaAutorizada: data.correoElectronico,
        telefonoPersonaAutorizada: data.telefono
      };

      this.datosPersonaOirRecibirForm.patchValue(VALORES_DE_FORMATO);

      this.tramite10303Store.setNombrePersonaAutorizada(VALORES_DE_FORMATO.nombrePersonaAutorizada);
      this.tramite10303Store.setCallePersonaAutorizada(VALORES_DE_FORMATO.callePersonaAutorizada);
      this.tramite10303Store.setNumExteriorPersonaAutorizada(VALORES_DE_FORMATO.numExteriorPersonaAutorizada);
      this.tramite10303Store.setNumInteriorPersonaAutorizada(VALORES_DE_FORMATO.numInteriorPersonaAutorizada);
      this.tramite10303Store.setEstadoPersonaAutorizada(VALORES_DE_FORMATO.estadoPersonaAutorizada);
      this.tramite10303Store.setColoniaPersonaAutorizada(VALORES_DE_FORMATO.coloniaPersonaAutorizada);
      this.tramite10303Store.setCodigoPostalPersonaAutorizada(VALORES_DE_FORMATO.codigoPostalPersonaAutorizada);
      this.tramite10303Store.setCvePaisPersonaAutorizada(VALORES_DE_FORMATO.cvePaisPersonaAutorizada);
      this.tramite10303Store.setCorreoElectronicoPersonaAutorizada(VALORES_DE_FORMATO.correoElectronicoPersonaAutorizada);
      this.tramite10303Store.setTelefonoPersonaAutorizada(VALORES_DE_FORMATO.telefonoPersonaAutorizada);
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
    this.datosPersonaOirRecibirForm.reset();
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
