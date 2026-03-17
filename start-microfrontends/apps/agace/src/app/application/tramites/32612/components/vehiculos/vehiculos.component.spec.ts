import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiculosComponent } from './vehiculos.component';
import { FormGroup } from '@angular/forms';
import { of, Subject } from 'rxjs';

// Mock dependencies
const mockTramite32612Store = {
  setDynamicFieldValue: jest.fn(),
};
const mockTramite32612Query = {
  selectSolicitude$: of({}),
};
const mockConsultaQuery = {
  selectConsultaioState$: of({}),
};

describe('VehiculosComponent', () => {
  let component: VehiculosComponent;
  let fixture: ComponentFixture<VehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculosComponent],
      providers: [
        { provide: 'Tramite32612Store', useValue: mockTramite32612Store },
        { provide: 'Tramite32612Query', useValue: mockTramite32612Query },
        { provide: 'ConsultaioQuery', useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initialized FormGroups', () => {
    expect(component.forma.get('sellosFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('procedimientoFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('anexeElProcedimientoFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('aduanalCuentaFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('conservarseFormGroup')).toBeInstanceOf(FormGroup);
  });

  it('should emit value change using emitirCambioDeValor', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(mockTramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should get sellosFormGroup', () => {
    expect(component.sellosFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should get procedimientoFormGroup', () => {
    expect(component.procedimientoFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should get anexeElProcedimientoFormGroup', () => {
    expect(component.anexeElProcedimientoFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should get aduanalCuentaFormGroup', () => {
    expect(component.aduanalCuentaFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should get conservarseFormGroup', () => {
    expect(component.conservarseFormGroup).toBeInstanceOf(FormGroup);
  });
});
