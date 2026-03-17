
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { DatosGeneralesRevision, RevisionService } from '../../services/revision.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosGeneralesComponent } from '../../shared/datos-generales/datos-generales.component';
import { PagoDeDerechosComponent } from '../../shared/pago-de-derechos/pago-de-derechos.component';
import { TercerosRelacionadosComponent } from '../../shared/terceros-relacionados/terceros-relacionados.component';

import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';

import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { Solicitud220503Store } from '../../estados/tramites220503.store';

/**
 * Componente para la revisión documental.
 */
@Component({
  selector: 'app-revision-documental',
  templateUrl: './revision-documental.component.html',
  styleUrl: './revision-documental.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DatosGeneralesComponent,
    TercerosRelacionadosComponent,
    PagoDeDerechosComponent,
  ],
})
export class RevisionDocumentalComponent implements OnChanges {

   @Input() isActive: boolean = false;
   /**
    * 
     * Subject para desuscribirse de los observables.
     * @type {Subject<void>}
     */
    private destroyed$ = new Subject<void>();
  /**
   * Índice del tab seleccionado.
   * @type {number}
   */
  indice: number = 1;
  /**
   * Indica si el contenido es colapsable.
   * @type {boolean}
   */
  colapsable: boolean = true;
  /**
   * Índice actual de la fila.
   * @type {number}
   */
  currentIndex: number = 1;
  /**
   * Filas de datos.
   * @type {any[]}
   */
  rows: { [key: string]: string }[] = [];
  /**
   * Formulario principal.
   * @type {any}
   */
  forma: string = '';
  @ViewChild('tercerosRelacionadosRef') tercerosRelacionados!: TercerosRelacionadosComponent;

  @ViewChild('pagoDeDerechosRef') pagoDeDerechos!: PagoDeDerechosComponent;
    @ViewChild('datosGenerals') datosGenerals!: DatosGeneralesComponent;
  /**
   * Selecciona un tab específico.
   * @param {number} i - El índice del tab a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /** Constructor para inyectar el servicio de solicitud de pantallas. */
    constructor(
       private solicitud220503Store: Solicitud220503Store,
    private revisionService: RevisionService,
         private NOTIF: NotificacionesService,
         private solicitud220503Query: Solicitud220503Query,
         
    ) {
    }

  ngOnChanges():void {
  if (this.isActive) {
 this.solicitud220503Query.certificadosAutorizados$
      .subscribe(certificados => {

        if (certificados !== null && certificados !== undefined) {
          this.getDatosGeneralesRevision(
            '220503',
            String(certificados)
          );
        }
      });
   
  }
}

   /**
   * Carga los datos generales de la revisión documental
   * y los asigna al estado del componente.
   */
  datosGeneralesRevision!: DatosGeneralesRevision;
  getDatosGeneralesRevision(tramite: string, certificado: string): void {
    this.revisionService
      .getDatosGeneralesRevision(tramite, certificado)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        if (resp.codigo !== '00') {
          this.NOTIF.showNotification({
        tipoNotificacion: 'toastr',
    categoria: 'danger',
    mensaje: resp.mensaje ?? '',
    titulo: 'Error',
    modo: '',
    cerrar: true,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: 'Cancelar',
          });
          return;
        }
  const DATOS = resp.datos;
  this.datosGeneralesRevision = DATOS;
  this.solicitud220503Store.setIdSolicitud(DATOS?.id_solicitud);
      });
  }



validarFormularios(): boolean {
  let isValid = true;
  if(this.pagoDeDerechos){
if(!this.pagoDeDerechos.validarFormulario()){
  isValid = false;
}
  }
  else{
    isValid =false;
  }
  if(this.tercerosRelacionados){
if(!this.tercerosRelacionados.validarFormulario()){
  isValid = false;
}
  }
return isValid
}
}
