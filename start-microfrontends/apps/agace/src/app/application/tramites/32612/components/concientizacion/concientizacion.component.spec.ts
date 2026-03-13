import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcientizacionComponent } from './concientizacion.component';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('ConcientizacionComponent', () => {
  let component: ConcientizacionComponent;
  let fixture: ComponentFixture<ConcientizacionComponent>;
  let tramite32612StoreMock: any;
  let tramite32612QueryMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    tramite32612StoreMock = { setDynamicFieldValue: jest.fn() };
    tramite32612QueryMock = { selectSolicitude$: of({ test: 'state' }) };
    consultaQueryMock = { selectConsultaioState$: of({ test: 'consultaState' }) };

    await TestBed.configureTestingModule({
      imports: [ConcientizacionComponent],
      providers: [
        { provide: Tramite32612Store, useValue: tramite32612StoreMock },
        { provide: Tramite32612Query, useValue: tramite32612QueryMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConcientizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitudeState on ngOnInit', () => {
    expect(component.solicitudeState).toEqual({ test: 'state' });
  });

  it('should initialize consultaState in constructor', () => {
    expect(component.consultaState).toEqual({ test: 'consultaState' });
  });

  it('should return capacitacionFormGroup from forma', () => {
    expect(component.capacitacionFormGroup).toBeTruthy();
    expect(component.capacitacionFormGroup instanceof Object).toBe(true);
  });

  it('should return capacitacionDosFormGroup from forma', () => {
    expect(component.capacitacionDosFormGroup).toBeTruthy();
    expect(component.capacitacionDosFormGroup instanceof Object).toBe(true);
  });

  it('should call setDynamicFieldValue when emitirCambioDeValor is called', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(tramite32612StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
