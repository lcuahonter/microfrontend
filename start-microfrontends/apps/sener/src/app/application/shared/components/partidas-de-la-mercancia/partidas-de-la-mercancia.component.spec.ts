import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartidasDeLaMercanciaComponent } from './partidas-de-la-mercancia.component';
import { ConfiguracionColumna } from '@ng-mf/data-access-user';

interface PartidasDeLaMercanciaModelo {
  id: number;
  cantidad: string;
  unidadDeMedida: string;
  fraccionFrancelaria: string;
  descripcion: string;
  valorUSD: number;
  precioUnitarioUSD: string;
  totalUSD: string;
}

describe('PartidasDeLaMercanciaComponent', () => {
  let component: PartidasDeLaMercanciaComponent;
  let fixture: ComponentFixture<PartidasDeLaMercanciaComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PartidasDeLaMercanciaComponent],
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(PartidasDeLaMercanciaComponent);
    component = fixture.componentInstance;

    // 🛠 Inicializamos los formularios necesarios antes del renderizado
    component.partidasDelaMercanciaForm = formBuilder.group({
      cantidadPartidasDeLaMercancia: ['', Validators.required],
      nombrePartida: ['', Validators.required],
      descripcionPartidasDeLaMercancia: ['', Validators.required],
      valorPartidaUSDPartidasDeLaMercancia: ['', Validators.required],
      cantidadModificar: ['', Validators.required],
      descripcionModificar: ['', Validators.required],
    });

    // 🛠 También se puede simular el segundo formulario requerido por el componente
    component.formForTotalCount = formBuilder.group({
      cantidadTotal: [''],
      valorTotalUSD: [''],
    });

    // 🛠 Datos simulados para las tablas
    component.tableHeaderData = [];
    component.tableBodyData = [];

    fixture.detectChanges(); // 🛠 Detectamos cambios una vez que las entradas están listas
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería devolver true si el control del formulario es inválido en esInvalido', () => {
    component.partidasDelaMercanciaForm.controls['cantidadPartidasDeLaMercancia'].setValue('');
    component.partidasDelaMercanciaForm.controls['cantidadPartidasDeLaMercancia'].markAsTouched();

    const ES_INVALIDO = component.esInvalido('cantidadPartidasDeLaMercancia');
    expect(ES_INVALIDO).toBe(true);
  });

  it('debería devolver false si el control del formulario es válido en esInvalido', () => {
    component.partidasDelaMercanciaForm.controls['cantidadPartidasDeLaMercancia'].setValue('Valor Válido');
    component.partidasDelaMercanciaForm.controls['cantidadPartidasDeLaMercancia'].markAsTouched();

    const ES_INVALIDO = component.esInvalido('cantidadPartidasDeLaMercancia');
    expect(ES_INVALIDO).toBe(false);
  });

 it('debería emitir setValoresStoreEvent con los argumentos correctos cuando se llama a setValoresStore', () => {
  const EMIT_SPY = jest.spyOn(component.setValoresStoreEvent, 'emit');
  const TEST_FORM = component.partidasDelaMercanciaForm;
  const MOCK_TEST_CAMPO = 'testCampo';

  component.setValoresStore(TEST_FORM, MOCK_TEST_CAMPO);

  expect(EMIT_SPY).toHaveBeenCalledWith({
    form: TEST_FORM,
    campo: MOCK_TEST_CAMPO,
  });
});


it('debería emitir setValoresStoreEvent con los argumentos correctos cuando se llama a setValoresStore', () => {
  const EMIT_SPY = jest.spyOn(component.setValoresStoreEvent, 'emit');
  const TEST_FORM = component.partidasDelaMercanciaForm;
  const MOCK_TEST_CAMPO = 'testCampo';

  component.setValoresStore(TEST_FORM, MOCK_TEST_CAMPO);

  expect(EMIT_SPY).toHaveBeenCalledWith({
    form: TEST_FORM,
    campo: MOCK_TEST_CAMPO,
  });
});

});
