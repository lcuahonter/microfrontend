import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite420101State, Tramite420101Store } from '../../estados/tramite420101Store.store';
import { CrossListEtiqueta } from '../../models/proveedores.model';
import { CrosslistComponent } from '@libs/shared/data-access-user/src';
import { RegistrarProveedoresService } from '../../service/registrar-proveedores.service';
import { Tramite420101Query } from '../../estados/tramite420101Query.query';

@Component({
  selector: 'app-registro-de-proveedores-manual',
  standalone: true,
  imports: [
    CrosslistComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './registro-de-proveedores-manual.component.html',
  styleUrl: './registro-de-proveedores-manual.component.scss'
})
export class RegistroDeProveedoresManualComponent implements OnInit, OnDestroy {

  /**
   * Formulario reactivo que contiene los campos para el registro de proveedores.
   * @type {FormGroup}
   */
  public proveedoreForm!: FormGroup;

  /**
   * Arreglo que almacena los datos utilizados para la lista cruzada.
   * @type {string[]}
   */
  public usoCrossListDatos: string[] = [];

  /**
   * Subject que notifica la destrucción del componente para liberar recursos.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Etiquetas para la lista cruzada de normas seleccionadas.
   * @type {CrossListEtiqueta}
   */
  public usoNormaSeleccionadaLabel: CrossListEtiqueta = {
    tituluDeLaIzquierda: 'Norma:',
    derecha: 'Norma(s) seleccionada(s)*:',
  };

  /**
   * Etiquetas para la lista cruzada de programas IMMEX seleccionados.
   * @type {CrossListEtiqueta}
   */
  public usoProgramaImmexLabel: CrossListEtiqueta = {
    tituluDeLaIzquierda: 'Número de programa IMMEX:',
    derecha: 'IMMEX seleccionado:',
  };

  /**
   * Etiquetas para la lista cruzada de programas PROSEC seleccionados.
   * @type {CrossListEtiqueta}
   */
  public usoProgramaProsecLabel: CrossListEtiqueta = {
    tituluDeLaIzquierda: 'Número de programa PROSEC:',
    derecha: 'PROSEC seleccionado:',
  };

  /**
   * Etiquetas para la lista cruzada de aduanas seleccionadas.
   * @type {CrossListEtiqueta}
   */
  public usoAduanaSeleccionadaLabel: CrossListEtiqueta = {
    tituluDeLaIzquierda: 'Aduana en las que opera:',
    derecha: 'Aduana(s) seleccionada(s)*:',
  };

  /**
   * Constructor del componente que inicializa las dependencias necesarias.
   * @param fb - Servicio para construir formularios reactivos.
   * @param ubicaccion - Servicio para manejar la navegación hacia atrás.
   * @param tramite420101Query - Servicio de consulta para datos relacionados con el trámite 420101.
   * @param tramite420101Store - Servicio de almacenamiento para datos relacionados con el trámite 420101.
   * @param registrarProveedoresService - Servicio para gestionar operaciones de registro de proveedores.
   */
  constructor(
    private fb: FormBuilder,
    private ubicaccion: Location,
    private tramite420101Query: Tramite420101Query,
    private tramite420101Store: Tramite420101Store,
    private registrarProveedoresService: RegistrarProveedoresService
  ) { }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe a los datos de la lista cruzada, inicializa el formulario de proveedores y obtiene los datos de proveedores manuales.
   */
  ngOnInit(): void {
    this.tramite420101Query
      .select((state: Tramite420101State) => state.usoCrossListDatos)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos: string[]) => {
        this.usoCrossListDatos = datos;
      });
    this.iniciarProveedore();
    this.getProveedoresManual();
  }

  /**
   * Obtiene los datos de proveedores manuales y actualiza el formulario con los valores recibidos.
   */
  getProveedoresManual(): void {
    this.registrarProveedoresService
      .proveedoresManual()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.proveedoreForm.patchValue(data);
      });
  }

  /**
   * Inicializa el formulario reactivo para el registro de proveedores con valores predeterminados.
   */
  iniciarProveedore(): void {
    this.proveedoreForm = this.fb.group({
      registroFederalContribuyente: [
        { value: 'ABC123456XYZ', disabled: false },
        Validators.required,
      ],
      razonSocial: [{ value: 'Empresa Demo S.A. de C.V.', disabled: true }],
      domicilioFiscal: [{ value: 'Av. Reforma 123, CDMX', disabled: true }],
    });
  }

  /**
   * Agrega un nuevo proveedor a la tabla de proveedores y navega hacia atrás.
   */
  agregarProveedore(): void {
    const VALOR = {
      rfc: this.proveedoreForm.get('registroFederalContribuyente')?.value,
      razonSocial: this.proveedoreForm.get('razonSocial')?.value,
      domicilioFiscal: this.proveedoreForm.get('domicilioFiscal')?.value,
    };
    this.tramite420101Store.updateProveedoresTabla([VALOR]);
    this.ubicaccion.back();
  }

  /**
   * Cancela la operación actual y navega hacia atrás.
   */
  cancelar(): void {
    this.ubicaccion.back();
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Completa el observable `destroyNotifier$` para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
