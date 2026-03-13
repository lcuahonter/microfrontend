import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionAduaneraComponent } from './gestion-aduanera.component';
import { FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';

// Mocks for dependencies
const mockTramite32612Store = {
  setDynamicFieldValue: jest.fn(),
};
const mockTramite32612Query = {
  selectSolicitude$: of({}),
};
const mockConsultaQuery = {
  selectConsultaioState$: of({}),
};

describe('GestionAduaneraComponent', () => {
  let component: GestionAduaneraComponent;
  let fixture: ComponentFixture<GestionAduaneraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAduaneraComponent],
      providers: [
        { provide: 'Tramite32612Store', useValue: mockTramite32612Store },
        { provide: 'Tramite32612Query', useValue: mockTramite32612Query },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionAduaneraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initialized form groups', () => {
    expect(component.forma instanceof FormGroup).toBe(true);
    expect(component.gestionFormGroup instanceof FormGroup).toBe(true);
    expect(component.controlFormGroup instanceof FormGroup).toBe(true);
    expect(component.actualizadaFormGroup instanceof FormGroup).toBe(true);
  });

  it('should call setDynamicFieldValue on emitirCambioDeValor', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(mockTramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should set solicitudeState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudeState).toEqual({ test: 'value' });
  });

  it('should set consultaState in constructor', () => {
    const testState = {
      procedureId: '123',
      parameter: 'param',
      department: 'dept',
      folioTramite: 'folio',
      consulta: 'state',
      // Add all other required properties of ConsultaioState here
      // Example:
      property1: 'value1',
      property2: 'value2',
      property3: 'value3',
      property4: 'value4',
      property5: 'value5'
    };
    // Re-run constructor logic
    GestionAduaneraComponent.prototype.constructor.call(component, mockTramite32612Store, mockTramite32612Query, component['consultaQuery']);
    expect(component.consultaState).toEqual(testState);
  });
});
