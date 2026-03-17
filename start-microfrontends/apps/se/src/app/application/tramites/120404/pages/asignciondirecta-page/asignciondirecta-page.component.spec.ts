import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignciondirectaPageComponent } from './asignciondirecta-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ASIGNACION } from '../../constants/asignacion.enum';

describe('AsignciondirectaPageComponent', () => {
  let component: AsignciondirectaPageComponent;
  let fixture: ComponentFixture<AsignciondirectaPageComponent>;

  const { of } = require('rxjs');
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignciondirectaPageComponent],
      imports: [require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        { provide: require('../../services/solicitud.service').SolicitudService, useValue: {} },
          { provide: require('../../estados/store/tramite120404.store').Tramite120404Store, useValue: { setContinuarTriggered: jest.fn() } },
        { provide: require('../../estados/queries/tramite120404.query').Tramite120404Query, useValue: { selectTramite120404$: of({}) } },
        { provide: require('ngx-toastr').ToastrService, useValue: { success: jest.fn(), error: jest.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignciondirectaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct steps', () => {
    expect(component.pasos).toEqual(ASIGNACION);
  });

  it('should initialize with the correct step index', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize DatosPasos correctly', () => {
    expect(component.datosPasos).toEqual({
      nroPasos: ASIGNACION.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    });
  });

  it('should update indice and navigate forward', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any; 

    component.getValorIndice({ accion: 'cont', valor: 2 });

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should update indice and navigate backward', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    component.getValorIndice({ accion: 'back', valor: 1 });

    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should ignore invalid indice values', () => {
    component.getValorIndice({ accion: 'cont', valor: 6 });

    expect(component.indice).toBe(1); 
  });

    it('should handle onBuscarIntento event', () => {
      component.onBuscarIntento({ submitted: true, invalid: true, numTramite: '123' });
      expect(component.showBuscarError).toBe(true);
      expect(component.numTramite).toBe('123');
    });

    it('should handle onFormValidation event', () => {
      component.onFormValidation({ isValid: false, errors: ['error'] });
      expect(component.showValidationError).toBe(true);
      expect(component.validationErrors).toContain('error');
      component.onFormValidation(null);
      expect(component.showValidationError).toBe(false);
      expect(component.validationErrors).toEqual([]);
    });

    it('should emit cargarArchivosEvento on onClickCargaArchivos', () => {
      const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
      component.onClickCargaArchivos();
      expect(spy).toHaveBeenCalled();
    });

    it('should update activarBotonCargaArchivos on manejaEventoCargaDocumentos', () => {
      component.manejaEventoCargaDocumentos(true);
      expect(component.activarBotonCargaArchivos).toBe(true);
    });

    it('should update seccionCargarDocumentos on cargaRealizada', () => {
      component.cargaRealizada(true);
      expect(component.seccionCargarDocumentos).toBe(false);
      component.cargaRealizada(false);
      expect(component.seccionCargarDocumentos).toBe(true);
    });

    it('should update cargaEnProgreso on onCargaEnProgreso', () => {
      component.onCargaEnProgreso(false);
      expect(component.cargaEnProgreso).toBe(false);
    });

    it('should update isSaltar on onBlancoObligatoria', () => {
      component.onBlancoObligatoria(true);
      expect(component.isSaltar).toBe(true);
    });

    it('should clean up on ngOnDestroy', () => {
      const spy = jest.spyOn(component['destroyNotifier$'], 'next');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });

    it('should validate step 1 with missing numTramite', () => {
      component.indice = 1;
      component.numTramite = '';
      expect(component['validateStep1']()).toBe(false);
      expect(component.validationErrors).toContain('El número de trámite es requerido.');
    });

    it('should validate step 1 with valid numTramite', () => {
      component.indice = 1;
      component.numTramite = '123';
      expect(component['validateStep1']()).toBe(true);
    });

    it('should validate step 2 and 3 as always valid', () => {
      component.indice = 2;
      expect(component['validateStep2']()).toBe(true);
      component.indice = 3;
      expect(component['validateStep3']()).toBe(true);
    });

    it('should validate current step', () => {
      component.indice = 1;
      component.numTramite = '';
      expect(component['validateCurrentStep']()).toBe(false);
      component.indice = 2;
      expect(component['validateCurrentStep']()).toBe(true);
    });
});
