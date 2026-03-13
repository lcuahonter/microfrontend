import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { EventEmitter } from '@angular/core';
import { ProductoOpción } from '../../constantes/vehiculos-adaptados.enum';
import { Catalogo } from '@ng-mf/data-access-user';

describe('DetosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDelTramiteComponent, ReactiveFormsModule], 
    }).compileComponents();
  
    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
    component.form = new FormBuilder().group({
      regimen: ['', Validators.required],
      solicitud: ['', Validators.required], 
      controlName: ['', Validators.required], 
      classification:['',Validators.required]
    });
  
    component.inputFields = [
      { label: 'Field 1', placeholder: 'Enter value', required: true ,controlName: 'regimen'},
      { label: 'Field 2', placeholder: 'Enter value', required: false ,controlName: 'classification'},
    ];
    component.catalogosArray = [
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }],
    ] as Catalogo[][];
    component.solicitudOpciones = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ] as ProductoOpción[];
  
    fixture.detectChanges();
  });
  
  

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe devolver verdadero si el control de formulario no es válido', () => {
    component.form.controls['controlName'].setValue('');
    component.form.controls['controlName'].markAsTouched();
  
    const isInvalid = component.esInvalido('controlName');
    expect(isInvalid).toBe(true);
  });
  
  it('Debe emitir setValoresStoreEvent con datos correctos', () => {
    const emitSpy = jest.spyOn(component.setValoresStoreEvent, 'emit'); 
  
    const testForm = formBuilder.group({
      testControl: ['', Validators.required],
    });
    const testCampo = 'testCampo';
    const testMetodoNombre = 'testMetodoNombre';
  
    component.setValoresStore(testForm, testCampo);
  
    expect(emitSpy).toHaveBeenCalledWith({
      form: testForm,
      campo: testCampo
    });
  });
  
});
