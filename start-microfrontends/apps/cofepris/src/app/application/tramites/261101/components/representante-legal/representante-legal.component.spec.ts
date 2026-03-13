import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { By } from '@angular/platform-browser';

describe('RepresentanteLegalComponent', () => {
  let COMPONENT: RepresentanteLegalComponent;
  let FIXTURE: ComponentFixture<RepresentanteLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RepresentanteLegalComponent], // Importar el componente aquí
    }).compileComponents();

    FIXTURE = TestBed.createComponent(RepresentanteLegalComponent);
    COMPONENT = FIXTURE.componentInstance;
    FIXTURE.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(COMPONENT).toBeTruthy();
  });

  it('debería inicializar el grupo de formulario', () => {
    expect(COMPONENT.domicilioEstablecimiento).toBeInstanceOf(FormGroup);
    expect(COMPONENT.domicilioEstablecimiento.controls['representanteLegalRFC']).toBeTruthy();
    expect(COMPONENT.domicilioEstablecimiento.controls['buscar']).toBeTruthy();
    expect(COMPONENT.domicilioEstablecimiento.controls['representanteLegalNombre']).toBeTruthy();
    expect(COMPONENT.domicilioEstablecimiento.controls['representanteLegalApPaterno']).toBeTruthy();
    expect(COMPONENT.domicilioEstablecimiento.controls['representanteLegalApMaterno']).toBeTruthy();
  });

  it('debería renderizar correctamente los inputs del formulario', () => {
    const REPRESENTANTE_LEGAL_RFC_INPUT = FIXTURE.debugElement.query(By.css('#representanteLegalRFCPostal'));
    const BUSCAR_INPUT = FIXTURE.debugElement.query(By.css('#buscar'));
    const REPRESENTANTE_LEGAL_NOMBRE_INPUT = FIXTURE.debugElement.query(By.css('#representanteLegalNombre'));
    const REPRESENTANTE_LEGAL_AP_PATERNO_INPUT = FIXTURE.debugElement.query(By.css('#representanteLegalApMaterno'));

    expect(REPRESENTANTE_LEGAL_RFC_INPUT).toBeTruthy();
    expect(BUSCAR_INPUT).toBeTruthy();
    expect(REPRESENTANTE_LEGAL_NOMBRE_INPUT).toBeTruthy();
    expect(REPRESENTANTE_LEGAL_AP_PATERNO_INPUT).toBeTruthy();
  });

  it('debería llamar a setValoresStore cuando un input cambia', () => {
    jest.spyOn(COMPONENT, 'setValoresStore');
    const REPRESENTANTE_LEGAL_RFC_INPUT = FIXTURE.debugElement.query(By.css('#representanteLegalRFCPostal')).nativeElement;

    REPRESENTANTE_LEGAL_RFC_INPUT.value = 'representanteLegalRFC123';
    REPRESENTANTE_LEGAL_RFC_INPUT.dispatchEvent(new Event('change'));

    expect(COMPONENT.setValoresStore).toHaveBeenCalledWith(COMPONENT.domicilioEstablecimiento, 'representanteLegalRFC');
  });

  it('debería actualizar el valor del control del formulario cuando se llama setValoresStore', () => {
    COMPONENT.setValoresStore(COMPONENT.domicilioEstablecimiento, 'representanteLegalRFC');
    expect(COMPONENT.domicilioEstablecimiento.get('representanteLegalRFC')?.value).toBe('representanteLegalRFC123');
  });

  it('debería manejar renderizado condicional (si aplica)', () => {
    // Agregar pruebas para cualquier elemento condicional en la plantilla
  });

  it('debería manejar entradas inválidas del formulario de manera adecuada', () => {
    COMPONENT.domicilioEstablecimiento.get('representanteLegalRFC')?.setValue('');
    expect(COMPONENT.domicilioEstablecimiento.valid).toBeFalsy();
  });
});
