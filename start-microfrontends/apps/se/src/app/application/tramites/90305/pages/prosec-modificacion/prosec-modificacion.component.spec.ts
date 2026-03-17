import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProsecModificacionComponent } from './prosec-modificacion.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock WizardComponent used in ViewChild
@Component({
  selector: 'app-wizard',
  template: '',
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('ProsecModificacionComponent', () => {
  let component: ProsecModificacionComponent;
  let fixture: ComponentFixture<ProsecModificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProsecModificacionComponent, MockWizardComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProsecModificacionComponent);
    component = fixture.componentInstance;

    // Manually mock ViewChild reference
    component.wizardComponent = new MockWizardComponent() as any;
    fixture.detectChanges();

     component.wizardComponent = {
    siguiente: jest.fn(),
    atras: jest.fn(),
  } as any;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call siguiente() when accion is "cont"', () => {
    const accion = { accion: 'cont', valor: 2 };
    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });


  it('should update indice and call atras() when accion is not "cont"', () => {
    const accion = { accion: 'back', valor: 2 };
    component.getValorIndice(accion);

    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not update indice or call wizard methods for invalid valor', () => {
    const accion = { accion: 'cont', valor: 6 };
    component.getValorIndice(accion);

    expect(component.indice).toBe(1); // unchanged
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
