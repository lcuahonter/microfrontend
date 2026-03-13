import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DomicilioFiscalComponent } from './domicilio-fiscal.component';

describe('DomicilioFiscalComponent', () => {
  let component: DomicilioFiscalComponent;
  let fixture: ComponentFixture<DomicilioFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DomicilioFiscalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario reactivo en ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.domicilioFiscalFormulario).toBeDefined();
  });

  it('debería inicializar el formulario con valores por defecto', () => {
    component.inicializarFormulario();
    expect(component.domicilioFiscalFormulario).toBeDefined();
    expect(component.domicilioFiscalFormulario.controls).toBeDefined();
  });

  it('debería tener la estructura correcta del formulario', () => {
    component.inicializarFormulario();
    expect(component.domicilioFiscalFormulario instanceof FormGroup).toBe(true);
    // Agrega verificaciones específicas de controles si aplica
    // Ejemplo: expect(component.domicilioFiscalFormulario.get('nombreCampo')).toBeDefined();
  });
});
