import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDeProcesosComponent } from './seguridad-de-procesos.component';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

jest.mock('../../estados/solicitud32612.query');
jest.mock('../../estados/solicitud32612.store');
jest.mock('@ng-mf/data-access-user');

describe('SeguridadDeProcesosComponent', () => {
  let component: SeguridadDeProcesosComponent;
  let fixture: ComponentFixture<SeguridadDeProcesosComponent>;
  let tramite32612QueryMock: any;
  let tramite32612StoreMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    tramite32612QueryMock = {
      selectSolicitude$: of({}),
    };
    tramite32612StoreMock = {
      setDynamicFieldValue: jest.fn(),
    };
    consultaQueryMock = {
      selectConsultaioState$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [SeguridadDeProcesosComponent],
      providers: [
        { provide: Tramite32612Query, useValue: tramite32612QueryMock },
        { provide: Tramite32612Store, useValue: tramite32612StoreMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDeProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forma with two FormGroups', () => {
    expect(component.forma.get('procesamientoFormGroup')).toBeInstanceOf(FormGroup);
    expect(component.forma.get('comunicacionFormGroup')).toBeInstanceOf(FormGroup);
  });

  it('should get procesamientoFormGroup', () => {
    expect(component.procesamientoFormGroup).toBe(component.forma.get('procesamientoFormGroup'));
  });

  it('should get comunicacionFormGroup', () => {
    expect(component.comunicacionFormGroup).toBe(component.forma.get('comunicacionFormGroup'));
  });

  it('should call setDynamicFieldValue on emitirCambioDeValor', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(tramite32612StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should set solicitudeState on ngOnInit', () => {
    component.solicitudeState = undefined as any;
    component.ngOnInit();
    expect(component.solicitudeState).toBeDefined();
  });

  it('should set consultaState in constructor', () => {
    expect(component.consultaState).toBeDefined();
  });
});
