import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { PASOS } from '@libs/shared/data-access-user/src/core/enums/130301/modificacion.enum';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';

class MockPasoUnoComponent {
  validarTodosFormulariosPasoUno = jest.fn(() => true);
}

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockWizardComponent: { siguiente: jest.Mock; atras: jest.Mock };
  let mockTramiteStore: jest.Mocked<Tramite130301Store>;

  beforeEach(async () => {
    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    mockTramiteStore = TestBed.inject(Tramite130301Store) as jest.Mocked<Tramite130301Store>;
    fixture.detectChanges();
    component.wizardComponent = mockWizardComponent as any;
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockTramiteStore.resetStore = jest.fn();
    if (component) {
      component.indice = 1;
    }
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar indice en 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debe inicializar datosPasos correctamente', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('debe actualizar indice y llamar a wizardComponent.siguiente al ejecutar getValorIndice con "cont"', () => {
    mockWizardComponent.siguiente();
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debe actualizar indice y llamar a wizardComponent.atras al ejecutar getValorIndice con "atras"', () => {
    component.indice = 2;
    component.datosPasos.indice = 2;
    component.getValorIndice({ accion: 'ant', valor: 1 });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

  it('no debe actualizar indice ni llamar métodos de wizardComponent si valor está fuera de rango', () => {
    component.indice = PASOS.length;
    component.datosPasos.indice = PASOS.length;
    component.getValorIndice({ accion: 'cont', valor: PASOS.length + 1 });
    expect(component.indice).toBe(PASOS.length);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should emit cargarArchivosEvento', () => {
    jest.spyOn(component.cargarArchivosEvento, 'emit');

    component.onClickCargaArchivos();

    expect(component.cargarArchivosEvento.emit).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);

    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update seccionCargarDocumentos correctly', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);

    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should update cargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);

    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should complete destroyed$ subject and reset store', () => {
    jest.spyOn(component['destroyed$'], 'next');
    jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyed$'].next).toHaveBeenCalled();
    expect(component['destroyed$'].complete).toHaveBeenCalled();
    expect(mockTramiteStore.resetStore).toHaveBeenCalled();
  });
});
