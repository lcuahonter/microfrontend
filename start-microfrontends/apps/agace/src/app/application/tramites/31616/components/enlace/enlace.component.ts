import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud31616TercerosState, Tramite31616TercerosStore } from '../../../../estados/tramites/tramite31616_terceros.store';
import { TableBodyData, TableComponent } from '@ng-mf/data-access-user';
import { map, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite31616TercerosQuery } from '../../../../estados/queries/tramite31616_terceros.query';
import enlace from '@libs/shared/theme/assets/json/31601/enlace.json';
import enlaceData from '@libs/shared/theme/assets/json/31601/enlace-data.json';

/**
 * Componente encargado de gestionar la información del enlace del trámite 31616.
 */
@Component({
  selector: 'app-enlace',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './enlace.component.html',
  styleUrl: './enlace.component.scss',
})
export class EnlaceComponent implements OnInit, OnDestroy {
  /**
   * Encabezados de la tabla de enlace.
   */
  public enlaceHeaderData: string[] = [];

  /**
   * Cuerpo de la tabla de enlace.
   */
  public enlanceBodyData: TableBodyData[] = [];

  /**
   * Datos de la tabla de enlace cargados desde archivo JSON.
   */
  public enlaceTableData = enlace;

  /**
   * Formulario reactivo para los datos del representante/enlace.
   */
  public enlace!: FormGroup;

  /**
   * Datos predefinidos del representante cargados desde JSON.
   */
  public representativeData = enlaceData;

  /**
   * Estado actual de la solicitud del trámite.
   */
  public solicitudState!: Solicitud31616TercerosState;

  /**
   * Sujeto para notificar destrucción y cancelar suscripciones activas.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Controla la visibilidad del modal.
   */
  public modal: string = 'modal';

  /**
   * Referencia al botón de cierre del modal.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * Constructor del componente.
   * 
   * @param fb Instancia de FormBuilder para crear formularios.
   * @param tramite31616Store Store para modificar el estado del trámite.
   * @param tramite31616Query Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite31616Store: Tramite31616TercerosStore,
    private tramite31616Query: Tramite31616TercerosQuery
  ) {
    //Añade lógica aquí
  }

  /**
   * Método del ciclo de vida que se ejecuta al iniciar el componente.
   * Inicializa el formulario y carga los datos del encabezado de la tabla.
   */
  ngOnInit(): void {
    this.tramite31616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.getRegistroForm();
    this.getEnlace();
  }

  /**
   * Carga los encabezados de la tabla de enlace desde los datos JSON.
   */
  public getEnlace(): void {
    this.enlaceHeaderData = this.enlaceTableData?.tableHeader;
  }

  /**
   * Abre el modal y carga el formulario con los datos del representante.
   */
  public abrirModal(): void {
    this.modal = 'show';
    this.getRegistroForm();
  }

  /**
   * Inicializa el formulario con validadores y datos del estado o los datos predeterminados.
   */
  public getRegistroForm(): void {
    this.enlace = this.fb.group({
      resigtroFedral: [
        this.solicitudState?.resigtroFedral && this.solicitudState?.resigtroFedral !== ''
          ? this.solicitudState?.resigtroFedral
          : this.representativeData?.resigtro,
        Validators.required,
      ],
      rfc: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      cargo: [
        this.solicitudState?.cargo && this.solicitudState?.cargo !== ''
          ? this.solicitudState?.cargo
          : this.representativeData?.cargo,
        Validators.required,
      ],
      cuidad: ['', Validators.required],
      telefonoEnlace: [
        this.solicitudState?.telefonoEnlace && this.solicitudState?.telefonoEnlace !== ''
          ? this.solicitudState?.telefonoEnlace
          : this.representativeData?.telefono,
        Validators.required,
      ],
      correoEnlace: [
        this.solicitudState?.correoEnlace && this.solicitudState?.correoEnlace !== ''
          ? this.solicitudState?.correoEnlace
          : this.representativeData?.correo,
        Validators.required,
      ],
      suplente: [this.solicitudState?.suplente, Validators.required],
    });

    this.patchData();
  }

  /**
   * Parchea el formulario con los datos predefinidos del representante.
   */
  public patchData(): void {
    this.enlace.patchValue({
      rfc: this.representativeData?.rfc,
      nombre: this.representativeData?.nombre,
      apellidoPaterno: this.representativeData?.apellidoPaterno,
      apellidoMaterno: this.representativeData?.apellidoMaterno,
      cuidad: this.representativeData?.cuidad,
    });

    this.enlace.get('rfc')?.disable();
    this.enlace.get('nombre')?.disable();
    this.enlace.get('apellidoPaterno')?.disable();
    this.enlace.get('apellidoMaterno')?.disable();
    this.enlace.get('cuidad')?.disable();
  }

  /**
   * Establece un valor en el store del trámite.
   * 
   * @param form Formulario reactivo que contiene el valor.
   * @param campo Nombre del campo a obtener.
   * @param metodoNombre Nombre del método en el store a invocar.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite31616TercerosStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite31616Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
