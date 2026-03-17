import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock WizardComponent
@Component({
  selector: 'app-mock-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PantallasComponent, MockWizardComponent]
    })
    .overrideComponent(PantallasComponent, {
      set: {
        template: `<app-mock-wizard></app-mock-wizard>`
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;

    // Mock ViewChild manually
    const wizardDebug = fixture.debugElement.query(By.directive(MockWizardComponent));
    component.wizardComponent = wizardDebug.componentInstance;
    
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a wizardComponent.siguiente() cuando accion es "cont" y valor está en rango', () => {
    // Asegura que wizardComponent esté asignado
    if (!component.wizardComponent) {
      const wizardDebug = fixture.debugElement.query(By.directive(MockWizardComponent));
      component.wizardComponent = wizardDebug.componentInstance;
    }
    const spy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it('debe llamar a wizardComponent.atras() cuando accion no es "cont" y valor está en rango', () => {
    // Asegura que wizardComponent esté asignado
    if (!component.wizardComponent) {
      const wizardDebug = fixture.debugElement.query(By.directive(MockWizardComponent));
      component.wizardComponent = wizardDebug.componentInstance;
    }
    const spy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'back', valor: 3 });
    expect(component.indice).toBe(3);
    expect(spy).toHaveBeenCalled();
  });

  it('no debe cambiar el índice ni llamar métodos del wizard cuando valor está fuera de rango', () => {
    // Asegura que wizardComponent esté asignado
    if (!component.wizardComponent) {
      const wizardDebug = fixture.debugElement.query(By.directive(MockWizardComponent));
      component.wizardComponent = wizardDebug.componentInstance;
    }
    const spyNext = jest.spyOn(component.wizardComponent, 'siguiente');
    const spyBack = jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1); // valor por defecto
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyBack).not.toHaveBeenCalled();

    component.getValorIndice({ accion: 'cont', valor: 5 });
    expect(component.indice).toBe(1); // sigue sin cambios
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyBack).not.toHaveBeenCalled();
  });
});
