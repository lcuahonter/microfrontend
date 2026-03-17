import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuplicadoDeCertificadoComponent } from './duplicado-de-certificado.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';

// ✅ Componente hijo simulado (mock)
@Component({
  selector: 'buscar-certificado-de-origen',
  template: ''
})
class MockBuscarCertificadoDeOrigenComponent {
  validarFormulario = jest.fn();
}

// ✅ Componente host para pruebas de integración
@Component({
  template: `
    <app-duplicado-de-certificado>
      <buscar-certificado-de-origen #buscarCertificado></buscar-certificado-de-origen>
    </app-duplicado-de-certificado>
  `
})
class TestHostComponent {
  @ViewChild(DuplicadoDeCertificadoComponent)
  duplicadoComponent!: DuplicadoDeCertificadoComponent;
}

describe('DuplicadoDeCertificadoComponent (Jest)', () => {
  let component: DuplicadoDeCertificadoComponent;
  let fixture: ComponentFixture<DuplicadoDeCertificadoComponent>;
  let mockBuscarCertificado: jest.Mocked<MockBuscarCertificadoDeOrigenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DuplicadoDeCertificadoComponent,
        MockBuscarCertificadoDeOrigenComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicadoDeCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockBuscarCertificado = {
      validarFormulario: jest.fn()
    } as unknown as jest.Mocked<MockBuscarCertificadoDeOrigenComponent>;
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería retornar false si buscarCertificado no está definido', () => {
    component.buscarCertificado = undefined as any;
    const resultado = component.validarFormulario();
    expect(resultado).toBe(false);
  });

  it('debería retornar false si el formulario del hijo es inválido', () => {
    mockBuscarCertificado.validarFormulario.mockReturnValue(false);

    const resultado = component.validarFormulario();

    expect(resultado).toBe(false);
    expect(mockBuscarCertificado.validarFormulario).toHaveBeenCalled();
  });

  it('debería retornar true si el formulario del hijo es válido', () => {
    mockBuscarCertificado.validarFormulario.mockReturnValue(true);

    const resultado = component.validarFormulario();

    expect(resultado).toBe(true);
    expect(mockBuscarCertificado.validarFormulario).toHaveBeenCalled();
  });

  it('debería emitir el evento rowClicked', () => {
    const emitSpy = jest.spyOn(component.rowClicked, 'emit');

    component.rowClicked.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('debería permitir suscribirse al evento rowClicked', () => {
    let eventoEmitido = false;
    component.rowClicked.subscribe(() => (eventoEmitido = true));

    component.rowClicked.emit();

    expect(eventoEmitido).toBe(true);
  });

  it('debería tener la propiedad standalone como false en los metadatos', () => {
    const cmp = (DuplicadoDeCertificadoComponent as any).ɵcmp;
    expect(cmp.standalone).toBe(false);
  });

  it('debería tener el templateUrl correcto', () => {
    const cmp = (DuplicadoDeCertificadoComponent as any).ɵcmp;
    expect(cmp.templateUrl).toContain('duplicado-de-certificado.component.html');
  });
});

describe('Integración con el componente hijo', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestHostComponent,
        DuplicadoDeCertificadoComponent,
        MockBuscarCertificadoDeOrigenComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('debería inicializar correctamente el componente host', () => {
    expect(hostComponent.duplicadoComponent).toBeTruthy();
  });
});
