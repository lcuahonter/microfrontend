import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

// Mock: ComponenteRepresentanteLegal
@Component({
  selector: 'app-representante-legal',
  template: ''
})
class MockRepresentanteLegalComponent {
  validarFormularioRepresentante = jest.fn();
}

// Mock: EnlaceOperativoComponent
@Component({
  selector: 'app-enlace-operativo',
  template: ''
})
class MockEnlaceOperativoComponent {
  validarEnlaceOperativo = jest.fn();
  enlaceOperativoDataForm: FormGroup;

  constructor() {
    this.enlaceOperativoDataForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }
}

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TercerosRelacionadosComponent],
      declarations: [
        MockRepresentanteLegalComponent,
        MockEnlaceOperativoComponent
      ]
    })
    .overrideComponent(TercerosRelacionadosComponent, {
      set: {
        template: `
          <app-representante-legal #representanteLegalRef></app-representante-legal>
          <app-enlace-operativo #enlaceOperativoRef></app-enlace-operativo>
        `
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;

    // Acceder a los componentes hijos
    const representanteDebug = fixture.debugElement.children.find(c => c.name === 'app-representante-legal');
    component.representanteLegalComponent = representanteDebug?.componentInstance;

    const enlaceDebug = fixture.debugElement.children.find(c => c.name === 'app-enlace-operativo');
    component.enlaceOperativoComponent = enlaceDebug?.componentInstance;

    fixture.detectChanges();
  });

  it('should return true if all validations pass', () => {
    jest.spyOn(component.representanteLegalComponent, 'validarFormularioRepresentante').mockReturnValue(true);
    jest.spyOn(component.enlaceOperativoComponent, 'validarEnlaceOperativo').mockReturnValue(true);
    
    // Establecer correctamente el valor del formulario y hacerlo válido
    component.enlaceOperativoComponent.enlaceOperativoDataForm.patchValue({ name: 'Test' });
    component.enlaceOperativoComponent.enlaceOperativoDataForm.updateValueAndValidity();

    const result = component.validarFormulario();
    expect(result).toBe(true);
  });

  it('should return false if representanteLegalComponent is missing', () => {
    component.representanteLegalComponent = undefined as any;
    const result = component.validarFormulario();
    expect(result).toBe(false);
  });

  it('should return false if validarFormularioRepresentante returns false', () => {
    jest.spyOn(component.representanteLegalComponent, 'validarFormularioRepresentante').mockReturnValue(false);
    const result = component.validarFormulario();
    expect(result).toBe(false);
  });

  it('should return false if enlaceOperativoComponent is missing', () => {
    component.enlaceOperativoComponent = undefined as any;
    const result = component.validarFormulario();
    expect(result).toBe(false);
  });

  it('should return false if validarEnlaceOperativo returns false', () => {
    jest.spyOn(component.representanteLegalComponent, 'validarFormularioRepresentante').mockReturnValue(true);
    jest.spyOn(component.enlaceOperativoComponent, 'validarEnlaceOperativo').mockReturnValue(false);
    const result = component.validarFormulario();
    expect(result).toBe(false);
  });

  it('should return true if enlaceOperativoDataForm is invalid', () => {
    jest.spyOn(component.representanteLegalComponent, 'validarFormularioRepresentante').mockReturnValue(true);
    jest.spyOn(component.enlaceOperativoComponent, 'validarEnlaceOperativo').mockReturnValue(true);
    
    // Establecer valor de formulario inválido
    component.enlaceOperativoComponent.enlaceOperativoDataForm.patchValue({ name: '' });
    component.enlaceOperativoComponent.enlaceOperativoDataForm.updateValueAndValidity();

    const result = component.validarFormulario();
    expect(result).toBe(true);
  });
});