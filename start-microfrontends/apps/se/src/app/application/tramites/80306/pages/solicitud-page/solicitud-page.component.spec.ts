import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudPageComponent } from './solicitud-page.component';
import { HttpClient } from '@angular/common/http';

describe('SolicitudPageComponent', () => {
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let component: { ngOnDestroy: () => void; seleccionaTab: (arg0: {}) => void; wizardComponent: { siguiente?: any; atras?: any; }; getValorIndice: (arg0: { valor: {}; accion: {}; }) => void; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ],
      declarations: [
        SolicitudPageComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: HttpClient, useValue: {} }
      ],
    })
      .overrideComponent(SolicitudPageComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = function () {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should have pasos defined and be an array', () => {
  expect((component as any).pasos).toBeDefined();
  expect(Array.isArray((component as any).pasos)).toBe(true);
  });

  it('should have indice initialized to 1', () => {
  expect((component as any).indice).toBe(1);
  });

  it('should have titulo initialized correctly', () => {
  expect((component as any).titulo).toBe('Registro de solicitud modificación programa IMMEX (Baja de servicios)');
  });

  it('should have TEXTO_DE_ALERTA set to the expected constant', () => {
  expect((component as any).TEXTO_DE_ALERTA).toContain('La solicitud ha quedado registrada');
  });

  it('should have cargarArchivosEvento as EventEmitter', () => {
  expect((component as any).cargarArchivosEvento).toBeDefined();
  // EventEmitter is a function/class, so instance check is possible
  expect(typeof (component as any).cargarArchivosEvento.emit).toBe('function');
  });

  it('should update indice in seleccionaTab if payload has indice', () => {
    (component as any).indice = 1;
    if (typeof component.seleccionaTab === 'function') {
      component.seleccionaTab({ indice: 4 });
      expect((component as any).indice).toBe(4);
    }
  });

  it('should call wizardComponent.siguiente and atras in getValorIndice', () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({ valor: {}, accion: {} });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab({});
  });

  it('should run #getValorIndice()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: {},
      accion: {},
    });

  });
});


  describe('SolicitudPageComponent additional methods', () => {
    let fixture: ComponentFixture<SolicitudPageComponent>;
    let component: SolicitudPageComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [SolicitudPageComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        providers: [
          { provide: HttpClient, useValue: {} }
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(SolicitudPageComponent);
      component = fixture.debugElement.componentInstance;
      // Mock wizardComponent
      component.wizardComponent = {
        atras: jest.fn(),
        siguiente: jest.fn(),
        indiceActual: 0
      } as any;
      component.datosPasos = { nroPasos: 3, indice: 1, txtBtnAnt: 'Anterior', txtBtnSig: 'Continuar' };
    });

    it('should update indices on anterior()', () => {
      component.wizardComponent.indiceActual = 2;
      component.anterior();
      expect(component.indice).toBe(3);
      expect(component.datosPasos.indice).toBe(3);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should set seccionCargarDocumentos to false when cargaRealizada(true)', () => {
      component.seccionCargarDocumentos = true;
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);
    });

    it('should set seccionCargarDocumentos to true when cargaRealizada(false)', () => {
      component.seccionCargarDocumentos = false;
      component.cargaRealizada(false);
      expect(component.seccionCargarDocumentos).toBe(true);
    });

    it('should emit cargarArchivosEvento on onClickCargaArchivos()', () => {
      const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
      component.onClickCargaArchivos();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('should update indices on siguiente()', () => {
      component.wizardComponent.indiceActual = 1;
      component.siguiente();
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    });

    it('should update activarBotonCargaArchivos on manejaEventoCargaDocumentos()', () => {
      component.activarBotonCargaArchivos = false;
      component.manejaEventoCargaDocumentos(true);
      expect(component.activarBotonCargaArchivos).toBe(true);
      component.manejaEventoCargaDocumentos(false);
      expect(component.activarBotonCargaArchivos).toBe(false);
    });

    it('should update cargaEnProgreso on onCargaEnProgreso()', () => {
      component.cargaEnProgreso = false;
      component.onCargaEnProgreso(true);
      expect(component.cargaEnProgreso).toBe(true);
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);
    });
  });
