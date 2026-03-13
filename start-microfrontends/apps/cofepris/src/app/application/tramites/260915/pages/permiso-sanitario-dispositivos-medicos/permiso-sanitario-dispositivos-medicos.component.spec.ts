import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { PermisoSanitarioDispositivosMedicosComponent } from './permiso-sanitario-dispositivos-medicos.component';

describe('ImportacionProductosComponent', () => {
  let component: PermisoSanitarioDispositivosMedicosComponent;
  let fixture: ComponentFixture<PermisoSanitarioDispositivosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PermisoSanitarioDispositivosMedicosComponent],
      imports: [WizardComponent, BtnContinuarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PermisoSanitarioDispositivosMedicosComponent);
    component = fixture.componentInstance;

    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent; 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with the correct default values', () => {
    expect(component.indice).toBe(1);
    expect(component.wizardComponent).toBeDefined();
  });
  
  it('should set the indice to 1 when getValorIndice is called with an invalid accion', () => {
    const accionBoton = { accion: 'invalid', valor: 2 };
    component.getValorIndice(accionBoton);  
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  } );

  it('should set the indice to 1 when getValorIndice is called with an undefined accion', () => {
    const accionBoton = { accion: undefined, valor: 2 };

    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
  it('should set the indice to 1 when getValorIndice is called with an empty accion', () => {
    const accionBoton = { accion: '', valor: 2 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  }); 



  it('should navigate to the next step when accion is "cont" and valor is valid', () => {
    const accionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(2); 
    expect(component.wizardComponent.siguiente).toHaveBeenCalled(); 
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should navigate to the previous step when accion is "atras" and valor is valid', () => {
    const accionBoton = { accion: 'atras', valor: 3 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled(); 
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not navigate if valor is out of range (too low)', () => {
    const accionBoton = { accion: 'cont', valor: 0 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should not navigate if valor is out of range (too high)', () => {
    const accionBoton = { accion: 'cont', valor: 6 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
