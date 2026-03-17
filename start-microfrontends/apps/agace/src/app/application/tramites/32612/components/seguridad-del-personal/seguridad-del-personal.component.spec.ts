import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDelPersonalComponent } from './seguridad-del-personal.component';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

jest.mock('../../estados/solicitud32612.store');
jest.mock('../../estados/solicitud32612.query');
jest.mock('@ng-mf/data-access-user');

describe('SeguridadDelPersonalComponent', () => {
  let component: SeguridadDelPersonalComponent;
  let fixture: ComponentFixture<SeguridadDelPersonalComponent>;
  let tramite32612Store: Tramite32612Store;
  let tramite32612Query: Tramite32612Query;
  let consultaQuery: ConsultaioQuery;

  beforeEach(async () => {
    tramite32612Store = new Tramite32612Store();
    tramite32612Query = new Tramite32612Query(tramite32612Store);
    consultaQuery = new ConsultaioQuery({} as any);

    (tramite32612Query.selectSolicitude$ as any) = of({});
    (consultaQuery.selectConsultaioState$ as any) = of({});

    await TestBed.configureTestingModule({
      imports: [SeguridadDelPersonalComponent],
      providers: [
        { provide: Tramite32612Store, useValue: tramite32612Store },
        { provide: Tramite32612Query, useValue: tramite32612Query },
        { provide: ConsultaioQuery, useValue: consultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDelPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups', () => {
    expect(component.antecedentesLaboralesFormGroup).toBeInstanceOf(FormGroup);
    expect(component.procedimientoFormGroup).toBeInstanceOf(FormGroup);
    expect(component.administracionFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should call setDynamicFieldValue when emitirCambioDeValor is called', () => {
    const spy = jest.spyOn(tramite32612Store, 'setDynamicFieldValue');
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(spy).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should clean up subscriptions on destroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
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
