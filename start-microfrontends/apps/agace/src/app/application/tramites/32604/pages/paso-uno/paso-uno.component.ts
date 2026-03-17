import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Índice utilizado para identificar la pestaña activa dentro del paso.
   * @type {number}
   */
  indice: number = 1;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = true;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;

  /**
   * Constructor de la clase PasoUnoComponent.
   *
   * @param store Instancia del store específico para la solicitud 32604, utilizada para gestionar el estado de la aplicación.
   * @param consultaQuery Servicio para realizar consultas relacionadas con la aplicación.
   * @param empresasComercializadorasService Servicio para gestionar operaciones relacionadas con empresas comercializadoras.
   *
   * La inicialización de propiedades y lógica adicional se realiza en métodos específicos según sea necesario.
   */
  constructor(
    public store: Solicitud32604Store,
    private consultaQuery: ConsultaioQuery,
    public empresasComercializadorasService: EmpresasComercializadorasService
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.empresasComercializadorasService
      .guardarDatosFormulario()
      .pipe(takeUntil(this.destroyNotifier$))
      // eslint-disable-next-line complexity
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          const FORM = resp?.datos?.solicitudFormulario;
          this.store.actualizarIdPersonaSolicitud(FORM.idPersonaSolicitud ?? '');
          this.store.actualizarRfcTercero(FORM.rfcTercero ?? '');
          this.store.actualizarRfc(FORM.rfc ?? '');
          this.store.actualizarNombre(FORM.nombre ?? '');
          this.store.actualizarApellidoPaterno(FORM.apellidoPaterno ?? '');
          this.store.actualizarApellidoMaterno(FORM.apellidoMaterno ?? '');
          this.store.actualizarTelefono(FORM.telefono ?? '');
          this.store.actualizarCorreoElectronico(FORM.correoElectronico ?? '');
          this.store.actualizarEnlaceRfcTercero(FORM.agregarEnlaceRfcTercero ?? '');
          this.store.actualizarEnlaceRfc(FORM.agregarEnlaceRfc ?? '');
          this.store.actualizarEnlaceNombre(FORM.agregarEnlaceNombre ?? '');
          this.store.actualizarEnlaceApellidoPaterno(FORM.agregarEnlaceApellidoPaterno ?? '');
          this.store.actualizarEnlaceApellidoMaterno(FORM.agregarEnlaceApellidoMaterno ?? '');
          this.store.actualizarEnlaceCiudadEstado(FORM.agregarEnlaceCiudadEstado ?? '');
          this.store.actualizarEnlaceCargo(FORM.agregarEnlaceCargo ?? '');
          this.store.actualizarEnlaceTelefono(FORM.agregarEnlaceTelefono ?? '');
          this.store.actualizarEnlaceCorreoElectronico(FORM.agregarEnlaceCorreoElectronico ?? '');
          this.store.actualizarEnlaceSuplente(FORM.agregarEnlaceSuplente ?? false);
          this.store.actualizar2089(FORM['2089'] ?? 0);
          this.store.actualizar2090(FORM['2090'] ?? 0);
          this.store.actualizar2091(FORM['2091'] ?? 0);
          this.store.actualizar2042(FORM['2042'] ?? 0);
          this.store.actualizar2043(FORM['2043'] ?? 0);
          this.store.actualizar2044(FORM['2044'] ?? 0);
          this.store.actualizarFechaInicioComercio(FORM.fechaInicioComercio ?? '');
          this.store.actualizarFechaPago(FORM.fechaPago ?? '');
          this.store.actualizarMonto(FORM.monto ?? '');
          this.store.actualizarOperacionesBancarias(FORM.operacionesBancarias ?? '');
          this.store.actualizarLlavePago(FORM.llavePago ?? '');
          this.store.actualizarTransportistaRFC(FORM.transportistaRFC ?? '');
          this.store.actualizarTransportistaRFCModifTrans(FORM.transportistaRFCModifTrans ?? '');
          this.store.actualizarTransportistaRazonSocial(FORM.transportistaRazonSocial ?? '');
          this.store.actualizarTransportistaDomicilio(FORM.transportistaDomicilio ?? '');
          this.store.actualizarTransportistaCaat(FORM.transportistaCaat ?? '');
          this.store.actualizarTransportistaIdDomicilio(FORM.transportistaIdDomicilio ?? '');
          this.store.actualizarTransportistaIdRFC(FORM.transportistaIdRFC ?? '');
          this.store.actualizarTransportistaIdRazonSocial(FORM.transportistaIdRazonSocial ?? '');
          this.store.actualizarTransportistaIdCaat(FORM.transportistaIdCaat ?? '');
          this.store.actualizarMiembroCaracterDe(FORM.miembroCaracterDe ?? '');
          this.store.actualizarMiembroTributarMexico(FORM.miembroTributarMexico ?? 0);
          this.store.actualizarMiembroNacionalidad(FORM.miembroNacionalidad ?? '');
          this.store.actualizarMiembroRFC(FORM.miembroRfc ?? '');
          this.store.actualizarMiembroRegistroFederal(FORM.miembroRegistroFederal ?? '');
          this.store.actualizarMiembroNombreCompleto(FORM.miembroNombreCompleto ?? '');
          this.store.actualizarMiembroTipoPersonaMuestra(FORM.miembroTipoPersonaMuestra ?? '');
          this.store.actualizarMiembroNombre(FORM.miembroNombre ?? '');
          this.store.actualizarMiembroApellidoPaterno(FORM.miembroApellidoPaterno ?? '');
          this.store.actualizarMiembroApellidoMaterno(FORM.miembroApellidoMaterno ?? '');
          this.store.actualizarMiembroNombreEmpresa(FORM.miembroNombreEmpresa ?? '');
          this.store.actualizarSubcontrataRFCBusqueda(FORM.subcontrataRFCBusqueda ?? '');
          this.store.actualizarSubcontrataRFC(FORM.subcontrataRFC ?? '');
          this.store.actualizarSubcontrataRazonSocial(FORM.subcontrataRazonSocial ?? '');
          this.store.actualizarSubcontrataEmpleados(FORM.subcontrataEmpleados ?? '');
          this.store.actualizarSubcontrataBimestre(FORM.subcontrataBimestre ?? 0);
          this.store.actualizarPrincipales(FORM.principales ?? 0);
          this.store.actualizarMunicipio(FORM.municipio ?? '');
          this.store.actualizarTipoDeInstalacion(FORM.tipoDeInstalacion ?? 0);
          this.store.actualizarEntidadFederativa(FORM.entidadFederativa ?? '');
          this.store.actualizarRegistroSESAT(FORM.registroSESAT ?? '');
          this.store.actualizarDescripcion(FORM.descripcion ?? '');
          this.store.actualizarCodigoPostal(FORM.codigoPostal ?? '');
          this.store.actualizarProcesoProductivo(FORM.procesoProductivo ?? 0);
          this.store.actualizarGoceDelInmueble(FORM.goceDelInmueble ?? 0);
          this.store.actualizarEmpresa(FORM.empresa ?? 0);
          this.store.actualizarComercioExterior(FORM.comercioExterior ?? 0);
          this.store.actualizarMutuo(FORM.mutuo ?? 0);
          this.store.actualizarCatseleccionados(FORM.catseleccionados ?? 0);
          this.store.actualizarServicio(FORM.servicio ?? 0);
          this.store.actualizar190(FORM['190'] ?? 0);
          this.store.actualizar191(FORM['191'] ?? 0);
          this.store.actualizar199(FORM['199'] ?? 0);
          this.store.actualizarEmpleados(FORM.empleados ?? '');
          this.store.actualizarBimestre(FORM.bimestre ?? 0);
          this.store.actualizar2034(FORM['2034'] ?? 0);
          this.store.actualizar236(FORM['236'] ?? 0);
          this.store.actualizar237(FORM['237'] ?? 0);
          this.store.actualizar238(FORM['238'] ?? 0);
          this.store.actualizar239(FORM['239'] ?? 0);
          this.store.actualizar240(FORM['240'] ?? 0);
          this.store.actualizar243(FORM['243'] ?? 0);
          this.store.actualizar244(FORM['244'] ?? 0);
          this.store.actualizar245(FORM['245'] ?? 0);
          this.store.actualizarIndiqueTodos(FORM.indiqueTodos ?? 0);
          this.store.actualizar246(FORM['246'] ?? 0);
          this.store.actualizarFile1(FORM.file1 ?? '');
          this.store.actualizarFile2(FORM.file2 ?? '');
          this.store.actualizar247(FORM['247'] ?? 0);
          this.store.actualizar248(FORM['248'] ?? 0);
          this.store.actualizarIdentificacion(FORM.identificacion ?? '');
          this.store.actualizarLugarDeRadicacion(FORM.lugarDeRadicacion ?? '');
          this.store.actualizar249(FORM['249'] ?? 0);
          this.store.actualizar250(FORM['250'] ?? 0);
          this.store.actualizar251(FORM['251'] ?? 0);
          this.store.actualizarCheckbox1(FORM.checkbox1 ?? false);
          this.store.actualizarCheckbox2(FORM.checkbox2 ?? false);
          this.store.actualizarCheckbox3(FORM.checkbox3 ?? false);
          this.store.actualizarActualmente2(FORM.actualmente2 ?? '');
          this.store.actualizarActualmente1(FORM.actualmente1 ?? '');
        }
      });
  }

  /**
   * Cambia la pestaña activa según el índice proporcionado.
   * @param i - El índice de la pestaña que se desea activar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método que se ejecuta cuando el componente se destruye.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
