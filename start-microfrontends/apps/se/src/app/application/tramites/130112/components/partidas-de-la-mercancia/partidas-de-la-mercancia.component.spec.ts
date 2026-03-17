import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartidasDeLaMercanciaComponent } from './partidas-de-la-mercancia.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

describe('PartidasDeLaMercanciaComponent', () => {
  let component: PartidasDeLaMercanciaComponent;
  let fixture: ComponentFixture<PartidasDeLaMercanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PartidasDeLaMercanciaComponent], 
    }).compileComponents();
  
    fixture = TestBed.createComponent(PartidasDeLaMercanciaComponent);
    component = fixture.componentInstance;
    component.partidasDelaMercanciaForm = new FormGroup({
      cantidadPartidasDeLaMercancia: new FormControl('', Validators.required),
      nombrePartida: new FormControl('', Validators.required),
      descripcionPartidasDeLaMercancia: new FormControl('', Validators.required), 
      valorPartidaUSDPartidasDeLaMercancia: new FormControl('', Validators.required),
      fraccionTigiePartidasDeLaMercancia: new FormControl('', Validators.required),
      fraccionDescripcionPartidasDeLaMercancia: new FormControl('', Validators.required),
    });
    component.modificarPartidasDelaMercanciaForm = new FormGroup({
      cantidadPartidasDeLaMercancia: new FormControl('', Validators.required),
      descripcionPartidasDeLaMercancia: new FormControl('', Validators.required),
      valorPartidaUSDPartidasDeLaMercancia: new FormControl('', Validators.required),
      fraccionTigiePartidasDeLaMercancia: new FormControl('', Validators.required),
      fraccionDescripcionPartidasDeLaMercancia: new FormControl('', Validators.required),
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
    const emitSpy = jest.spyOn(component.filaSeleccionadaChange, 'emit');
    const filasSeleccionadas: PartidasDeLaMercanciaModelo[]=[
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

    component.handleListaDeFilaSeleccionada(filasSeleccionadas);

    expect(emitSpy).toHaveBeenCalledWith(filasSeleccionadas);
  });

  it('should emit validarYEnviarFormularioEvent when validarYEnviarFormulario is called', () => {
    const emitSpy = jest.spyOn(component.validarYEnviarFormularioEvent, 'emit');

    component.validarYEnviarFormulario();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit setValoresStoreEvent with correct arguments when setValoresStore is called', () => {
    const emitSpy = jest.spyOn(component.setValoresStoreEvent, 'emit');
    const testForm = new FormGroup({
      testControl: new FormControl('')
    });
    const testCampo = 'testCampo';
    const testMetodoNombre = 'testMetodoNombre';

    component.partidasDelaMercanciaForm = testForm;

    component.setValoresStore(testForm, testCampo);

    expect(emitSpy).toHaveBeenCalledWith({
      form: testForm,
      campo: testCampo
     
    });
  });
});