import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { CatalogoSelectComponent, TituloComponent, InputFechaComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TituloComponent,
        InputFechaComponent,
        PagoDeDerechosComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;

    component.formularioPagoDerechos = new FormGroup({
      claveDeReferencia: new FormControl(''),
      cadenaPagoDependencia: new FormControl(''),
      llaveDePago: new FormControl(''),
      fechaDePago: new FormControl(''),
      banco: new FormControl(''),
      impPago: new FormControl(''),
    });
    component.banco = [
      { id: 1, descripcion: 'Banco 1' },
      { id: 2, descripcion: 'Banco 2' },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.formularioPagoDerechos).toBeDefined();
    expect(component.formularioPagoDerechos.get('claveDeReferencia')).toBeDefined();
    expect(component.formularioPagoDerechos.get('cadenaPagoDependencia')).toBeDefined();
    expect(component.formularioPagoDerechos.get('llaveDePago')).toBeDefined();
    expect(component.formularioPagoDerechos.get('fechaDePago')).toBeDefined();
    expect(component.formularioPagoDerechos.get('banco')).toBeDefined();
    expect(component.formularioPagoDerechos.get('impPago')).toBeDefined();
  });

  it('should capitalize input value for llaveDePago on user input', () => {
    const inputEvent = new Event('input');
    const inputElement = document.createElement('input');
    inputElement.value = 'testvalue';
    Object.defineProperty(inputEvent, 'target', { value: inputElement });

    component.capitalizarYGuardar('llaveDePago', 'setLlaveDePago', inputEvent);

    const controlValue = component.formularioPagoDerechos.get('llaveDePago')?.value;
    expect(controlValue).toBe('TESTVALUE');
  });

  it('should update banco value in the form when a banco is selected', () => {
    const bancoControl = component.formularioPagoDerechos.get('banco');
    bancoControl?.setValue(1);
    expect(bancoControl?.value).toBe(1);
  });

  it('should handle fechaDePago input correctly', () => {
    const fechaControl = component.formularioPagoDerechos.get('fechaDePago');
    fechaControl?.setValue('2025-04-10');
    expect(fechaControl?.value).toBe('2025-04-10');
  });

  it('should call capitalizarYGuardar on input event for llaveDePago', () => {
    const spy = jest.spyOn(component, 'capitalizarYGuardar');
    const inputEvent = new Event('input');
    const inputElement = document.createElement('input');
    inputElement.value = 'testvalue';
    Object.defineProperty(inputEvent, 'target', { value: inputElement });

    component.capitalizarYGuardar('llaveDePago', 'setLlaveDePago', inputEvent);
    expect(spy).toHaveBeenCalledWith('llaveDePago', 'setLlaveDePago', inputEvent);
  });

  it('should handle impPago input correctly', () => {
    const impPagoControl = component.formularioPagoDerechos.get('impPago');
    impPagoControl?.setValue(1000);
    expect(impPagoControl?.value).toBe(1000);
  });

  it('should handle cadenaPagoDependencia input correctly', () => {
    const cadenaControl = component.formularioPagoDerechos.get('cadenaPagoDependencia');
    cadenaControl?.setValue('DEPENDENCIA123');
    expect(cadenaControl?.value).toBe('DEPENDENCIA123');
  });

  it('should handle claveDeReferencia input correctly', () => {
    const claveControl = component.formularioPagoDerechos.get('claveDeReferencia');
    claveControl?.setValue('REF12345');
    expect(claveControl?.value).toBe('REF12345');
  });
});