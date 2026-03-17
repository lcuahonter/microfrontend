import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaguicidasComponent } from './plaguicidas.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Shared2605Service } from '../../../../shared/services/shared2605/shared2605.service';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { Tramite260505Store } from '../../../../estados/tramites/260505/tramite260505.store';
import { Tramite260505Query } from '../../../../estados/queries/260505/tramite260505.query';

// Mocks for dependencies
const mockShared2605Service = {
  getAllState: jest.fn(() => of({})),
  buildPayload: jest.fn(() => ({})),
  guardarDatosPost: jest.fn(() => of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })),
};
const mockToastrService = {
  success: jest.fn(),
  error: jest.fn(),
};
const mockTramite260505Store = {
  setContinuarTriggered: jest.fn(),
  setIdSolicitud: jest.fn(),
};
const mockTramite260505Query = {
  selectSolicitud$: of({ continuarTriggered: false }),
};
// WizardComponent and PasoUnoComponent mocks
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}
class MockPasoUnoComponent {
  validarFormularios = jest.fn(() => true);
}
describe('PlaguicidasComponent', () => {
  let component: PlaguicidasComponent;
  let fixture: ComponentFixture<PlaguicidasComponent>;

  beforeEach(async () => {
    // Use the actual class names for providers, but override with useValue mocks
    await TestBed.configureTestingModule({
      declarations: [PlaguicidasComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Shared2605Service, useValue: mockShared2605Service },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Tramite260505Store, useValue: mockTramite260505Store },
        { provide: Tramite260505Query, useValue: mockTramite260505Query },
        { provide: TOAST_CONFIG, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaguicidasComponent);
    component = fixture.componentInstance;
    // Attach mocks for ViewChilds
    component.wizardComponent = new MockWizardComponent() as any;
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });



  it('should update indice and call wizardComponent.siguiente() when getValorIndice is called with accion "cont"', () => {
    // Ensure pasoUnoComponent and wizardComponent are always mocks
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    component.wizardComponent = new MockWizardComponent() as any;
    component.indice = 2;
    component.datosPasos.indice = 2;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(3);
    expect((component.wizardComponent.siguiente as jest.Mock).mock.calls.length).toBeGreaterThan(0);
  });

  it('should update indice and call wizardComponent.atras() when getValorIndice is called with accion "ant"', () => {
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    component.wizardComponent = new MockWizardComponent() as any;
    component.indice = 2;
    component.datosPasos.indice = 2;
    component.getValorIndice({ accion: 'ant', valor: 2 });
    expect(component.indice).toBe(1);
    expect((component.wizardComponent.atras as jest.Mock).mock.calls.length).toBeGreaterThan(0);
  });

  it('should not update indice if valor is out of range', () => {
    // Ensure pasoUnoComponent is always a mock with validarFormularios
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    const initialIndice = component.indice;
    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(initialIndice);
    component.getValorIndice({ accion: 'cont', valor: 999 });
    expect(component.indice).toBe(initialIndice);
  });

  it('should emit cargarArchivosEvento when onClickCargaArchivos is called', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos when manejaEventoCargaDocumentos is called', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update seccionCargarDocumentos when cargaRealizada is called', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should update cargaEnProgreso when onCargaEnProgreso is called', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should call pasoUnoComponent.validarFormularios in validarFormulariosPasoActual when indice is 1', () => {
    component.indice = 1;
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    const spy = jest.spyOn(component.pasoUnoComponent, 'validarFormularios');
    component.validarFormulariosPasoActual();
    expect(spy).toHaveBeenCalled();
  });

  it('should return true in validarFormulariosPasoActual when indice is not 1', () => {
    component.indice = 2;
    expect(component.validarFormulariosPasoActual()).toBe(true);
  });

  it('should stop navigation and set isPeligro = true when step 1 is invalid', () => {
    component.pasoUnoComponent = { validarFormularios: () => false } as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.isPeligro).toBe(true);
  });

  it('should emit cargarArchivosEvento event', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('should toggle seccionCargarDocumentos', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should navigate when API returns codigo 00', (done) => {
    mockShared2605Service.guardarDatosPost.mockReturnValue(
      of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })
    );
    component['shouldNavigate$']().subscribe((result) => {
      expect(result).toBe(true);
      expect(mockToastrService.success).toHaveBeenCalled();
      done();
    });
  });

  it('should NOT navigate when API returns different code', (done) => {
    mockShared2605Service.guardarDatosPost.mockReturnValue(
      of({ codigo: '99', mensaje: 'ERROR', datos: { id_solicitud: 123 } })
    );
    component['shouldNavigate$']().subscribe((result) => {
      expect(result).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalled();
      done();
    });
  });

  it('should store id_solicitud on guardar()', async () => {
    mockShared2605Service.guardarDatosPost.mockReturnValue(
      of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })
    );
    await component.guardar({ x: 1 });
    expect(component.guardarIdSolicitud).toBe(123);
    expect(mockTramite260505Store.setIdSolicitud).toHaveBeenCalledWith(123);
  });
});
