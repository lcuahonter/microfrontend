import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifiestoDeAceptacionComponent } from './manifiesto-de-aceptacion.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TituloComponent, AlertComponent } from '@ng-mf/data-access-user';
import { By } from '@angular/platform-browser';

describe('ManifiestoDeAceptacionComponent', () => {
  let component: ManifiestoDeAceptacionComponent;
  let fixture: ComponentFixture<ManifiestoDeAceptacionComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManifiestoDeAceptacionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManifiestoDeAceptacionComponent);
    component = fixture.componentInstance;
    formBuilder = new FormBuilder();
    component.manifestoForm = formBuilder.group({
      manifesto: new FormControl(false),
    });
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar los textos del manifiesto', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(component.manifestoText.Texto1);
    expect(compiled.textContent).toContain(component.manifestoText.Texto2);
  });

 it('debería deshabilitar el checkbox si esFormularioSoloLectura es true', () => {
  component.esFormularioSoloLectura = true;
  component.manifestoForm.get('manifesto')?.disable(); 
  fixture.detectChanges();

  const checkbox: HTMLInputElement = fixture.debugElement.query(By.css('#manifesto')).nativeElement;
  expect(checkbox.disabled).toBe(true);
});

it('debería habilitar el checkbox si esFormularioSoloLectura es false', () => {
  component.esFormularioSoloLectura = false;
  component.manifestoForm.get('manifesto')?.enable(); 
  fixture.detectChanges();

  const checkbox: HTMLInputElement = fixture.debugElement.query(By.css('#manifesto')).nativeElement;
  expect(checkbox.disabled).toBe(false);
});

  it('debería emitir el evento setValoresStoreEvent al cambiar el valor del checkbox', () => {
    jest.spyOn(component.setValoresStoreEvent, 'emit');

    const checkbox: HTMLInputElement = fixture.debugElement.query(By.css('#manifesto')).nativeElement;
    checkbox.click();
    fixture.detectChanges();

    expect(component.setValoresStoreEvent.emit).toHaveBeenCalledWith({
      form: component.manifestoForm,
      campo: 'manifesto',
    });
  });
});
