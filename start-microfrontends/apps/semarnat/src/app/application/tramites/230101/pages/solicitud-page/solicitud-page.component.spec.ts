import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { SeccionQuery } from '../../../../estados/queries/seccion.query';
import { SeccionStore } from '../../../../estados/seccion.store';
import { WizardComponent } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let mockSeccionQuery: any;
  let mockSeccionStore: any;

  beforeEach(() => {
    mockSeccionQuery = {
      selectSeccionState$: of({ seccion: [], formaValida: [] }),
    };
    mockSeccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      providers: [
        { provide: SeccionQuery, useValue: mockSeccionQuery },
        { provide: SeccionStore, useValue: mockSeccionStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize seccion state on ngOnInit', () => {
    component.ngOnInit();
    expect(component.seccion).toEqual({ seccion: [], formaValida: [] });
  });

  it('should assign secciones and call store methods', () => {
    const PASO_1 = {
      step1: { valid: false },
      step2: { valid: true },
      step3: { valid: false },
    };
  
    const expectedSecciones = Object.values(PASO_1);
    const expectedFormaValida = [false, true, false]; 
  

  });
  it('should update the indice when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should update the indice and navigate wizard on getValorIndice call', () => {
    const mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };
    component.wizardComponent = mockWizardComponent as unknown as WizardComponent;

    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();

    component.getValorIndice({ accion: 'back', valor: 1 });
    expect(component.indice).toBe(1);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
  });

});
