import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';

import { ProductorIndirectoComponent } from './productor-indirecto.component';
import { ProsecService } from '../../services/prosec.service';
import { AutorizacionProsecStore } from '../../estados/autorizacion-prosec.store';
import { AUtorizacionProsecQuery } from '../../estados/autorizacion-prosec.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ProsecState } from '../../estados/autorizacion-prosec.store';
import { FilaProductos } from '../../models/prosec.model';

const mockProsecState: ProsecState = {
  modalidad: '',
  Estado: [],
  RepresentacionFederal: [],
  ActividadProductiva: [],
  Sector: [],
  Fraccion_arancelaria: '',
  contribuyentes: 'ABC123XYZ',
  domiciliosFormaValida: false,
  productorFromValida: false,
  sectoresFromValida: false,
  sectorDatos: [],
  producirDatos: [],
  plantasDatos: [],
  productorDatos: [],
  prosecDatos: [] // Added missing property
};

class MockAUtorizacionProsecQuery {
  selectProsec$ = observableOf(mockProsecState);
}

class MockAutorizacionProsecStore {
  setProductorFromValida = jest.fn();
  setContribuyentes = jest.fn();
}

class MockProsecService {
  formValida = jest.fn();
  obtenerTablaDatos = jest.fn().mockReturnValue(observableOf([
    { contribuyentes: 'ABC123', razonSocial: 'Test S.A.', Correo: 'test@example.com' }
  ]));
}

describe('ProductorIndirectoComponent', () => {
  let component: ProductorIndirectoComponent;
  let fixture: ComponentFixture<ProductorIndirectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ProductorIndirectoComponent],
      providers: [
        FormBuilder,
        { provide: ProsecService, useClass: MockProsecService },
        { provide: AutorizacionProsecStore, useClass: MockAutorizacionProsecStore },
        { provide: AUtorizacionProsecQuery, useClass: MockAUtorizacionProsecQuery },
        ConsultaioQuery
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductorIndirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and subscribe in ngOnInit', () => {
  jest.useFakeTimers(); // Ensure fake timers are active

  const prosecService = TestBed.inject(ProsecService);
  const autorizacionProsecStore = TestBed.inject(AutorizacionProsecStore);

  const formValidaSpy = jest.spyOn(prosecService, 'formValida');
  const setValidSpy = jest.spyOn(autorizacionProsecStore, 'setProductorFromValida');

  // Mock the state used in initActionFormBuild
  (component as any).productorState = { contribuyentes: '' };

  // Init component and form
  component.ngOnInit();
  fixture.detectChanges();

  // Make the form valid by setting a non-empty value
  const formControl = component.productorIndirecto.get('contribuyentes');
  formControl?.setValue('TEST');

  // Trigger change detection and RxJS delay
  fixture.detectChanges();
  jest.advanceTimersByTime(50); // Must be more than 10ms used in delay()

  // Expect calls
  expect(setValidSpy).toHaveBeenCalledWith(true);
  expect(formValidaSpy).toHaveBeenCalled();

  jest.useRealTimers(); // Clean up
});

  it('should call disable if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.productorIndirecto = component['fb'].group({ contribuyentes: [''] });
    const disableSpy = jest.spyOn(component.productorIndirecto, 'disable');
    component.inicializarEstadoFormulario();
    expect(disableSpy).toHaveBeenCalled();
  });

  it('should call enable if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.productorIndirecto = component['fb'].group({ contribuyentes: [''] });
    const enableSpy = jest.spyOn(component.productorIndirecto, 'enable');
    component.inicializarEstadoFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should build the form with initActionFormBuild', () => {
    component.initActionFormBuild();
    expect(component.productorIndirecto.get('contribuyentes')).toBeTruthy();
    expect(component.productorIndirecto.value.contribuyentes).toBe('ABC123XYZ');
  });

  it('should call obtenerTablaDatos and populate productorDato', () => {
    component.recuperarDatos();
    expect(component.productorDato.length).toBeGreaterThan(0);
  });

  it('should NOT set productorDato if response is null', () => {

jest.spyOn(component['ProsecService'], 'obtenerTablaDatos').mockReturnValue(observableOf([] as FilaProductos[] ));
    component.recuperarDatos();
    expect(component.productorDato.length).toBe(0);
  });

  it('should call store method in setValoresStore', () => {
  const form = component['fb'].group({ contribuyentes: ['XYZ987'] });

  // Inject the mocked store
  const store = component['AutorizacionProsecStore'];

  // Manually define the mocked method on the store
  store.setcontribuyentes = jest.fn();

  // Call the method under test
  component.setValoresStore(form, 'contribuyentes', 'setcontribuyentes' as any);

  // Expect the mocked method to have been called correctly
  expect(store.setcontribuyentes).toHaveBeenCalledWith('XYZ987');
});


  it('should clean up on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
