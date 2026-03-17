import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedaPermisosComponent } from './busqueda-permisos.component';
import { of } from 'rxjs';
import { Modal } from 'bootstrap';
import { HttpClientModule } from '@angular/common/http';

describe('BusquedaPermisosComponent', () => {
  let component: BusquedaPermisosComponent;
  let fixture: ComponentFixture<BusquedaPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaPermisosComponent, HttpClientModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BusquedaPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component initialization', () => {
    expect(component.busquedaPermisosForm).toBeDefined();
    expect(component.busquedaPermisosForm.controls['folioTramiteBusqueda']).toBeDefined();
    expect(component.busquedaPermisosForm.controls['motivoSuspension']).toBeDefined();
    expect(component.busquedaPermisosForm.controls['numAutorizacion']).toBeDefined();
    expect(component.busquedaPermisosForm.controls['fechaSuspension']).toBeDefined();
  });

  it('should call relanzarGrid and update permisosVigentesTabla when folio matches', () => {
    const permisosMock = {
      code: 200,
      data: [
        {
          numeroResolucion: '123',
          folioTramite: 'test-value',
          tipoSolicitud: 'Solicitud 1',
          regimen: 'Regimen 1',
          clasificacionRegimen: 'Clasificacion 1',
          periodoDeVigencia: '2023',
          fraccionArancelaria: '1234',
          unidad: 'Unidad 1',
          nico: 'Nico 1',
          nicoDescripcion: 'Descripcion Nico',
          acotacion: 'Acotacion 1',
          cantidadAutorizada: '100',
          valorAutorizado: '200',
          fechaInicioVigencia: '2023-01-01',
          fechaFinVigencia: '2023-12-31',
        },
      ],
      message: 'Success'
    };

    jest.spyOn(component['suspensionPermisoService'], 'obtenerPermisosVigentes').mockReturnValue(of(permisosMock));

    component.relanzarGrid('test-value');

    expect(component.permisosVigentesTabla.length).toBe(1);
    expect(component.permisosVigentesTabla[0].numeroResolucion).toBe('123');
  });

  it('should call relanzarGrid and clear permisosVigentesTabla when folio does not match', () => {
    const permisosMock = {
      code: 200,
      data: [
        {
          numeroResolucion: '123',
          folioTramite: 'other-folio',
          tipoSolicitud: 'Solicitud 1',
          regimen: 'Regimen 1',
          clasificacionRegimen: 'Clasificacion 1',
          periodoDeVigencia: '2023',
          fraccionArancelaria: '1234',
          unidad: 'Unidad 1',
          nico: 'Nico 1',
          nicoDescripcion: 'Descripcion Nico',
          acotacion: 'Acotacion 1',
          cantidadAutorizada: '100',
          valorAutorizado: '200',
          fechaInicioVigencia: '2023-01-01',
          fechaFinVigencia: '2023-12-31',
        },
      ],
      message: 'Success'
    };

    const setPermisosVigentesTablaSpy = jest.spyOn(component['tramite140216Store'], 'setPermisosVigentesTabla');
    const abrirModalAlertaFolioIncorrectoSpy = jest.spyOn(component, 'abrirModalAlertaFolioIncorrecto');

    jest.spyOn(component['suspensionPermisoService'], 'obtenerPermisosVigentes').mockReturnValue(of(permisosMock));

    component.relanzarGrid('test-value');

    expect(component.permisosVigentesTabla.length).toBe(0);
    expect(setPermisosVigentesTablaSpy).toHaveBeenCalledWith([]);
    expect(abrirModalAlertaFolioIncorrectoSpy).toHaveBeenCalled();
  });

  it('should call abrirAlertaFolioModal if folioTramiteBusqueda is empty', () => {
    const abrirAlertaFolioModalSpy = jest.spyOn(component, 'abrirAlertaFolioModal');
    component.relanzarGrid('');
    expect(abrirAlertaFolioModalSpy).toHaveBeenCalled();
    component.relanzarGrid(null as any);
    expect(abrirAlertaFolioModalSpy).toHaveBeenCalledTimes(2);
  });

  it('should mark form as touched and return false if invalid on validarFormulario', () => {
    component.busquedaPermisosForm.patchValue({ folioTramiteBusqueda: null });
    const markAllAsTouchedSpy = jest.spyOn(component.busquedaPermisosForm, 'markAllAsTouched');
    const valid = component.validarFormulario();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(valid).toBe(false);
  });

  it('should return true if form is valid on validarFormulario', () => {
    component.busquedaPermisosForm.patchValue({
      folioTramiteBusqueda: 'folio',
      motivoSuspension: 'motivo',
      numAutorizacion: '123',
      fechaSuspension: '2023-01-01'
    });
    const valid = component.validarFormulario();
    expect(valid).toBe(true);
  });

  it('should set correct notification on abrirAlertaModal', () => {
    component.abrirAlertaModal();
    expect(component.nuevaAlertaNotificacion).toBeDefined();
    expect(component.nuevaAlertaNotificacion.titulo).toBe('Alerta');
    expect(component.nuevaAlertaNotificacion.mensaje).toContain('Debe seleccionar un elemento');
  });

  it('should set correct notification on abrirAlertaFolioModal', () => {
    component.abrirAlertaFolioModal();
    expect(component.alertaFolioNotificacion).toBeDefined();
    expect(component.alertaFolioNotificacion.titulo).toBe('Alerta');
    expect(component.alertaFolioNotificacion.mensaje).toContain('Folio trámites es un campo obligatorio');
  });

  it('should set correct notification on abrirModalAlertaFolioIncorrecto', () => {
    component.abrirModalAlertaFolioIncorrecto();
    expect(component.alertaFolioIncorrectoNotificacion).toBeDefined();
    expect(component.alertaFolioIncorrectoNotificacion.titulo).toBe('Alerta');
    expect(component.alertaFolioIncorrectoNotificacion.mensaje).toContain('El Folio del trámite ingresado no puede ser suspendido');
  });

  it('should call mostrarModal with correct id for obtenerDetallePermiso', () => {
    const mostrarModalSpy = jest.spyOn(component, 'mostrarModal');
    component.seleccionadaPermisosVigentesTabla = [{
      numeroResolucion: '123',
      tipoSolicitud: 'Solicitud 1',
      regimen: 'Regimen 1',
      clasificacionRegimen: 'Clasificacion 1',
      periodoDeVigencia: '2023',
      fraccionArancelaria: '1234',
      unidad: 'Unidad 1',
      nico: 'Nico 1',
      nicoDescripcion: 'Descripcion Nico',
      acotacion: 'Acotacion 1',
      cantidadAutorizada: '100',
      valorAutorizado: '200',
      fechaInicioVigencia: '2023-01-01',
      fechaFinVigencia: '2023-12-31'
    }];
    component.obtenerDetallePermiso();
    expect(mostrarModalSpy).toHaveBeenCalledWith('detalle-del-permiso');
  });

  it('should call mostrarModal with correct id for obtenerDetalleTitular', () => {
    const mostrarModalSpy = jest.spyOn(component, 'mostrarModal');
    component.seleccionadaPermisosVigentesTabla = [{
      numeroResolucion: '123',
      tipoSolicitud: 'Solicitud 1',
      regimen: 'Regimen 1',
      clasificacionRegimen: 'Clasificacion 1',
      periodoDeVigencia: '2023',
      fraccionArancelaria: '1234',
      unidad: 'Unidad 1',
      nico: 'Nico 1',
      nicoDescripcion: 'Descripcion Nico',
      acotacion: 'Acotacion 1',
      cantidadAutorizada: '100',
      valorAutorizado: '200',
      fechaInicioVigencia: '2023-01-01',
      fechaFinVigencia: '2023-12-31'
    }];
    component.obtenerDetalleTitular();
    expect(mostrarModalSpy).toHaveBeenCalledWith('detalle-rfc-facultad');
  });

  it('should call mostrarModal with correct id for obtenerPersonasNotificacion', () => {
    const mostrarModalSpy = jest.spyOn(component, 'mostrarModal');
    component.seleccionadaPermisosVigentesTabla = [{
      numeroResolucion: '123',
      tipoSolicitud: 'Solicitud 1',
      regimen: 'Regimen 1',
      clasificacionRegimen: 'Clasificacion 1',
      periodoDeVigencia: '2023',
      fraccionArancelaria: '1234',
      unidad: 'Unidad 1',
      nico: 'Nico 1',
      nicoDescripcion: 'Descripcion Nico',
      acotacion: 'Acotacion 1',
      cantidadAutorizada: '100',
      valorAutorizado: '200',
      fechaInicioVigencia: '2023-01-01',
      fechaFinVigencia: '2023-12-31'
    }];
    component.obtenerPersonasNotificacion();
    expect(mostrarModalSpy).toHaveBeenCalledWith('personas-notificar');
  });

  it('should update fechaSuspension in form and store on cambioFechaSuspension', () => {
    const setFechaSuspensionSpy = jest.spyOn(component['tramite140216Store'], 'setFechaSuspension');
    component.cambioFechaSuspension('2023-01-01');
    expect(component.busquedaPermisosForm.value.fechaSuspension).toBe('2023-01-01');
    expect(setFechaSuspensionSpy).toHaveBeenCalledWith('2023-01-01');
  });

  it('should show modal when mostrarModal is called with valid id', () => {
    document.body.innerHTML = '<div id="test-modal"></div>';
    const modalElement = document.getElementById('test-modal');
    const modalInstance = { show: jest.fn() };
    jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(modalInstance as any);

    component.mostrarModal('test-modal');

    expect(Modal.getOrCreateInstance).toHaveBeenCalledWith(modalElement);
    expect(modalInstance.show).toHaveBeenCalled();
  });

  it('should call setValoresStore and update store value', () => {
    const setFolioTramiteBusquedaSpy = jest.spyOn(component['tramite140216Store'], 'setFolioTramiteBusqueda');
    component.busquedaPermisosForm.patchValue({ folioTramiteBusqueda: 'test-value' });

    component.setValoresStore(component.busquedaPermisosForm, 'folioTramiteBusqueda', 'setFolioTramiteBusqueda');

    expect(setFolioTramiteBusquedaSpy).toHaveBeenCalledWith('test-value');
  });

  it('should complete destruirNotificador$ on ngOnDestroy', () => {
    const destruirNotificadorSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(destruirNotificadorSpy).toHaveBeenCalled();
  });
});