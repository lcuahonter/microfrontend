import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesistimientoPageComponent } from './desistimiento-page.component';
import { BtnContinuarComponent, SeccionLibQuery, SeccionLibStore, SolicitanteComponent, WizardComponent } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';

describe('DesistimientoPageComponent', () => {
  let component: DesistimientoPageComponent;
  let fixture: ComponentFixture<DesistimientoPageComponent>;
  let seccionQueryMock: any;
  let seccionStoreMock: any;
  let mockWizardComponent: any;


  beforeEach(async () => {
    seccionQueryMock = {
      selectSeccionState$: of({
        seccion: [false, true],
        formaValida: [false, false],
      }),
    };

    seccionStoreMock = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    };

    mockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DesistimientoPageComponent,PasoUnoComponent, PasoDosComponent,SolicitudComponent],
      imports: [WizardComponent, BtnContinuarComponent, HttpClientTestingModule, SolicitanteComponent],
      providers: [
        { provide: SeccionLibQuery, useValue: seccionQueryMock },
        { provide: SeccionLibStore, useValue: seccionStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DesistimientoPageComponent);
    component = fixture.componentInstance;

    // Mock ViewChild components
    component.wizardComponent = mockWizardComponent as WizardComponent;
    component.pasoUnoComponent = {} as PasoUnoComponent;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the active tab on seleccionaTab', () => {
    component.seleccionaTab(2);

    expect(component.indice).toBe(2);
  });

it('should update indice and call navigation actions in getValorIndice', () => {
  // Arrange
  const mockWizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn(),
  };
  component.wizardComponent = mockWizardComponent as any; // Assign the mock

  // Case: Moving forward
  const accionForward = { accion: 'cont', valor: 2 };

  // Act
  component.getValorIndice(accionForward);

  // Assert
  expect(component.indice).toBe(2);
  expect(mockWizardComponent.siguiente).toHaveBeenCalled(); // Verify forward action

  // Case: Moving backward
  const accionBackward = { accion: 'ant', valor: 1 };

  // Act
  component.getValorIndice(accionBackward);

  // Assert
  expect(component.indice).toBe(1);
  expect(mockWizardComponent.atras).toHaveBeenCalled(); // Verify backward action
});

  it('should not update indice for invalid values in getValorIndice', () => {
    const invalidAccion = { accion: 'cont', valor: 6 };
    component.getValorIndice(invalidAccion);

    expect(component.indice).not.toBe(6);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });
});