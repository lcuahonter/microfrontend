import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReprestantanteComponent } from './represtantante.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('ReprestantanteComponent', () => {
  let component: ReprestantanteComponent;
  let fixture: ComponentFixture<ReprestantanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReprestantanteComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReprestantanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores por defecto', () => {
    const formValues = component.represtantante.value;
    expect(formValues.rfc).toBe(component.datosRepresentativos.rfc);
    expect(formValues.nombre).toBe(component.datosRepresentativos.nombre);
    expect(formValues.apellidoPaterno).toBe(component.datosRepresentativos.apellidoPaterno);
    expect(formValues.apellidoMaterno).toBe(component.datosRepresentativos.apellidoMaterno);
    expect(formValues.telefono).toBe(component.datosRepresentativos.telefono);
    expect(formValues.correo).toBe(component.datosRepresentativos.correo);
  });

  it('debería deshabilitar controles específicos del formulario al inicializar', () => {
    expect(component.represtantante.get('rfc')?.disabled).toBe(true);
    expect(component.represtantante.get('nombre')?.disabled).toBe(true);
    expect(component.represtantante.get('apellidoPaterno')?.disabled).toBe(true);
    expect(component.represtantante.get('apellidoMaterno')?.disabled).toBe(true);
  });

  it('debería actualizar el store cuando se llama a setValoresStore', () => {
    const mockStoreMethod = jest.fn();
    component['tramite32615Store'] = { updateField: mockStoreMethod } as any;

    component.setValoresStore(component.represtantante, 'telefono', 'setTelefono');
    expect(mockStoreMethod).toHaveBeenCalledWith(component.represtantante.get('telefono')?.value);
  });

  it('debería cancelar las suscripciones al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería validar los campos obligatorios del formulario', () => {
    const form = component.represtantante;
    form.get('telefono')?.setValue('');
    form.get('correo')?.setValue('');

    expect(form.get('telefono')?.valid).toBe(false);
    expect(form.get('correo')?.valid).toBe(false);

    form.get('telefono')?.setValue('1234567890');
    form.get('correo')?.setValue('test@example.com');

    expect(form.get('telefono')?.valid).toBe(true);
    expect(form.get('correo')?.valid).toBe(true);
  });
});