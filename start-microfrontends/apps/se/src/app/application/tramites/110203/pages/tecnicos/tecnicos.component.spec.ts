
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TecnicosComponent } from './tecnicos.component';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { Tramite110203Store } from '../../../../estados/tramites/tramite110203.store';
import { Tramite110203Query } from '../../../../estados/queries/tramite110203.query';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Solocitud110203Service } from '../../service/service110203.service';

const mockSolocitud110203Service = {
  getAllState: jest.fn(() => of({})),
  guardarDatosPost: jest.fn(() => of({ codigo: '00', mensaje: 'Success' })),
  buildTratados: jest.fn(() => ({})),
  buildDestinatario: jest.fn(() => ({})),
  buildTransporte: jest.fn(() => ({})),
  buildCertificado: jest.fn(() => ({})),
  buildDatosCertificado: jest.fn(() => ({}))
};

const mockTramite110203Store = {
  setIdSolicitud: jest.fn(),
  setPasoActivo: jest.fn()
};

const mockTramite110203Query = {
  selectSolicitud$: of({
    idSolicitud: 0
  })
};

const mockToastrService = {
  success: jest.fn(),
  error: jest.fn()
};

describe('TecnicosComponent', () => {
  let component: TecnicosComponent;
  let fixture: ComponentFixture<TecnicosComponent>;

  const mockWizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TecnicosComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Solocitud110203Service, useValue: mockSolocitud110203Service },
        { provide: Tramite110203Store, useValue: mockTramite110203Store },
        { provide: Tramite110203Query, useValue: mockTramite110203Query },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicosComponent);
    component = fixture.componentInstance;
    
    // Mock pantallasPasos to have enough steps for the tests
    component.pantallasPasos = [
      { titulo: 'Step 1', indice: 1, activo: false, completado: false },
      { titulo: 'Step 2', indice: 2, activo: false, completado: false },
      { titulo: 'Step 3', indice: 3, activo: false, completado: false },
      { titulo: 'Step 4', indice: 4, activo: false, completado: false },
      { titulo: 'Step 5', indice: 5, activo: false, completado: false }
    ];
    
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;
    component.validarTodosFormulariosPasoUno = jest.fn(() => true);
    
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update indice and call wizard.siguiente when accion is "cont"', () => {
    const accion: AccionBoton = { valor: 2, accion: 'cont' };

    component.getValorIndice(accion);

    expect(component.indice).toBe(3); // valor + 1 = 2 + 1 = 3
    expect(component.datosPasos.indice).toBe(3); // Should also update datosPasos
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should navigate backwards when accion is "ant"', () => {
    // Set initial state to step 3
    component.indice = 3;
    const accion: AccionBoton = { valor: 3, accion: 'ant' };
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(2); // valor - 1 = 3 - 1 = 2
    expect(component.datosPasos.indice).toBe(2);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should update indice and call wizard.atras when accion is "ant"', () => {
    // Set initial state to step 4
    component.indice = 4;
    const accion: AccionBoton = { valor: 4, accion: 'ant' };

    component.getValorIndice(accion);

    expect(component.indice).toBe(3); // valor - 1 = 4 - 1 = 3
    expect(component.datosPasos.indice).toBe(3);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should ignore invalid valor that would result in index outside bounds', () => {
    const initialIndice = component.indice; // Should be 1
    const accion: AccionBoton = { valor: 0, accion: 'cont' }; // Would result in indice = 1, which is valid
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(1); // valor + 1 = 0 + 1 = 1 (valid)
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should ignore valor that would exceed maximum steps', () => {
    const initialIndice = component.indice; // Should be 1
    const accion: AccionBoton = { valor: 5, accion: 'cont' }; // Would result in indice = 6, exceeding pantallasPasos.length (5)
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(initialIndice); // Should remain unchanged
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should ignore valor that would result in negative index', () => {
    component.indice = 1;
    const accion: AccionBoton = { valor: 1, accion: 'ant' }; // Would result in indice = 0, which is invalid
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(1); // Should remain unchanged
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should not proceed when validation fails on step 1', () => {
    // Mock validation to return false
    component.validarTodosFormulariosPasoUno = jest.fn(() => false);
    component.indice = 1;
    const accion: AccionBoton = { valor: 1, accion: 'cont' };
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(1); // Should remain unchanged
    expect(component.esFormaValido).toBe(true); // Error flag should be set
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should proceed when validation passes on step 1', () => {
    // Mock validation to return true
    component.validarTodosFormulariosPasoUno = jest.fn(() => true);
    component.indice = 1;
    const accion: AccionBoton = { valor: 1, accion: 'cont' };
    
    component.getValorIndice(accion);
    
    expect(component.indice).toBe(2); // valor + 1 = 1 + 1 = 2
    expect(component.esFormaValido).toBe(false); // Error flag should be reset
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should not call validation when not on step 1 or action is not cont', () => {
    const validationSpy = jest.spyOn(component, 'validarTodosFormulariosPasoUno');
    component.indice = 2;
    const accion: AccionBoton = { valor: 2, accion: 'ant' };
    
    component.getValorIndice(accion);
    
    expect(validationSpy).not.toHaveBeenCalled();
    expect(component.indice).toBe(1); // valor - 1 = 2 - 1 = 1
  });
});
