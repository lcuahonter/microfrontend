import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { JSONResponse, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CamCertificadoService } from '../../services/cam-certificado.service';
import { CamDatosCertificadoComponent } from '../../components/cam-datos-certificado/cam-datos-certificado.component';
import { CamDestinatarioComponent } from '../../components/cam-destinatario/cam-destinatario.component';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { CommonModule } from '@angular/common';
import { camCertificadoStore } from '../../estados/cam-certificado.store';
/**
 * @component PasoUnoComponent
 * @description Este componente es responsable de manejar el primer paso del trámite.
 * Incluye la lógica para seleccionar una pestaña y actualizar el índice.
 * 
 * @import { Component } from '@angular/core';
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [SolicitanteComponent, CertificadoOrigenComponent, CamDestinatarioComponent, CamDatosCertificadoComponent, CommonModule]
})
/**
 * @class PasoUnoComponent
 * @implements {OnInit, OnDestroy}
 * @description Componente que maneja el primer paso del trámite, incluyendo la selección de pestañas y la gestión del estado de la consulta.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property {number} indice - El índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
  * Estado actual de la consulta.
  *
  * @type {ConsultaioState}
  * @memberof NombreDelComponente
  * @description
  * Esta propiedad almacena el estado relacionado con la funcionalidad de consulta,
  * el cual puede ser utilizado para mostrar u operar sobre los datos actuales del store.
  */
  public consultaState!: ConsultaioState;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   *
   * @type {Subject<void>}
   * @memberof NombreDelComponente
   * @description
   * Esta propiedad se utiliza junto con operadores de RxJS (como `takeUntil`)
   * para cancelar automáticamente las suscripciones cuando el componente es destruido.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @desc Indica si los datos de la respuesta están presentes o disponibles.
   * @type {boolean}
   * @memberof PasoUnoComponent
   * @compodoc
   * @description
   * [español] Bandera booleana que determina si se muestran o procesan los datos de respuesta en el componente.
   */
  public esDatosRespuesta: boolean = false;


  /**
   * @property solicitante - Referencia al componente `SolicitanteComponent`.
   */
  @ViewChild('solicitanteRef') solicitante!: SolicitanteComponent;

  /**
   * @property certificadoOrigen - Referencia al componente `CertificadoOrigenComponent`.
   */
  @ViewChild('certificadoOrigenRef') certificadoOrigen!: CertificadoOrigenComponent;

  /**
   * @property camDestinatario - Referencia al componente `CamDestinatarioComponent`.
   */
  @ViewChild('camDestinatarioRef') camDestinatario!: CamDestinatarioComponent;

  /**
   * @property camDatosCertificado - Referencia al componente `CamDatosCertificadoComponent`.
   */
  @ViewChild('camDatosCertificadoRef') camDatosCertificado!: CamDatosCertificadoComponent;

  /**
   * Constructor de la clase.
   * 
   * @param consultaQuery Servicio para realizar consultas relacionadas con la entidad Consultaio.
   * @param camCertificadoService Servicio para gestionar certificados CAM.
   */
  constructor(private consultaQuery: ConsultaioQuery, private camCertificadoService: CamCertificadoService, public store: camCertificadoStore) { }
  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe a los cambios en el estado de la consulta y guarda los datos del formulario si es necesario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
        if (this.consultaState?.update) {
          this.getMostrarDatos(Number(this.consultaState?.id_solicitud));
          this.store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
        } else {
          this.esDatosRespuesta = true;
        }
      })
    ).subscribe();
  }

  /**
   * @method seleccionaTab
   * @description Selecciona una pestaña y actualiza el índice.
   * @param {number} i - El índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method validarFormularios
   * @description Valida los formularios de los componentes hijos.
   * @returns {boolean} Indica si todos los formularios son válidos.
   */
  validarFormularios(): boolean {
    let isValid = true;
    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }
    if (this.camDatosCertificado) {
      if (!this.camDatosCertificado.validarFormularios()) {
        isValid = false;
      }
    }
    else {
      isValid = false;
    }
    if (this.camDestinatario) {
      if (!this.camDestinatario.validarFormularios()) {
        isValid = false;
      }
    }
    else {
      isValid = false;
    }
    if (this.certificadoOrigen) {
      if (!this.certificadoOrigen.validarFormularios()) {
        isValid = false;
      }
    }
    else {
      isValid = false;
    }
    return isValid;
  }

  /**
   * @method getMostrarDatos 
   * @description Obtiene los datos para mostrar en base al ID de la solicitud proporcionado.
   * @param idSolicitud Identificador de la solicitud para obtener los datos a mostrar.
   */
  getMostrarDatos(idSolicitud: number): void {
    this.camCertificadoService.getMostrarDatos(idSolicitud).pipe(takeUntil(this.destroyNotifier$)).subscribe((resp: JSONResponse) => {
      if (resp.codigo === '00') {
        this.camCertificadoService.setMostrarDatos(resp.datos as unknown as Record<string, unknown[]>);
      }
    });
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el Subject para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}