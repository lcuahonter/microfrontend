import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IntroPermisoComponent } from './intro-permiso.component';
import { SolicitanteService } from '@libs/shared/data-access-user/src';

describe('IntroPermisoComponent', () => {
  let component: IntroPermisoComponent;
  let fixture: ComponentFixture<IntroPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IntroPermisoComponent,
        HttpClientTestingModule
      ],
      providers: [
        SolicitanteService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntroPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should update indice and call wizardComponent.siguiente() when accion is "cont" and valor is valid', () => {
    // Arrange
    const mockWizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.wizardComponent = mockWizardComponent;
    const accion: any = { accion: 'cont', valor: 3 };

    // Act
    component.getValorIndice(accion);

    // Assert
    expect(component.indice).toBe(3);
    expect(mockWizardComponent.siguiente).toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice and call wizardComponent.atras() when accion is not "cont" and valor is valid', () => {
    const mockWizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.wizardComponent = mockWizardComponent;
    const accion: any = { accion: 'back', valor: 2 };

    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(mockWizardComponent.atras).toHaveBeenCalled();
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizardComponent methods when valor is out of range', () => {
    const mockWizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.wizardComponent = mockWizardComponent;
    component.indice = 1;
    const accion: any = { accion: 'cont', valor: 0 };

    component.getValorIndice(accion);

    expect(component.indice).toBe(1);
    expect(mockWizardComponent.siguiente).not.toHaveBeenCalled();
    expect(mockWizardComponent.atras).not.toHaveBeenCalled();
  });
});