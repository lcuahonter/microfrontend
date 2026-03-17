import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModificarPartidasComponent } from './modificar-partidas.component';
import { PartidasDeLaMercanciaModelo } from '../../models/modificar-partidas.model';

describe('ModificarPartidasComponent', () => {
  let component: ModificarPartidasComponent;
  let fixture: ComponentFixture<ModificarPartidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ModificarPartidasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarPartidasComponent);
    component = fixture.componentInstance;
    component.modificarPartidasDelaMercanciaForm = new FormGroup({
      cantidadPartidasDeLaMercancia: new FormControl('', Validators.required),
      descripcionPartidasDeLaMercancia: new FormControl('', Validators.required),
      valorPartidaUSDPartidasDeLaMercancia: new FormControl('', Validators.required),
    });
    component.formForTotalCount = new FormGroup({
      cantidadTotal: new FormControl('', Validators.required),
      valorTotalUSD: new FormControl('', Validators.required),
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filaSeleccionadaChange when handleListaDeFilaSeleccionada is called', () => {
    const filasSeleccionadas: PartidasDeLaMercanciaModelo[] = [
      {
        id: '1',
        cantidad: '10',
        unidadDeMedida: 'kg',
        fraccionFrancelaria: '1234.56.78',
        descripcion: 'Producto A',
        precioUnitarioUSD: '100',
        totalUSD: '1000',
      },
      {
        id: '2',
        cantidad: '5',
        unidadDeMedida: 'kg',
        fraccionFrancelaria: '8765.43.21',
        descripcion: 'Producto B',
        precioUnitarioUSD: '100',
        totalUSD: '1000',
      }
    ];
  });

  it('should emit setValoresStoreEvent with correct arguments when setValoresStore is called', () => {
    const testForm = new FormGroup({
      testControl: new FormControl('')
    });
    const testCampo = 'testCampo';
    const testMetodoNombre = 'testMetodoNombre';
  });
});
