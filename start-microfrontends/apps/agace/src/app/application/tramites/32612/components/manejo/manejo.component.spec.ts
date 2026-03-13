import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManejoComponent } from './manejo.component';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('ManejoComponent', () => {
  let component: ManejoComponent;
  let fixture: ComponentFixture<ManejoComponent>;
  let mockTramite32612Store: any;
  let mockTramite32612Query: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockTramite32612Store = { setDynamicFieldValue: jest.fn() };
    mockTramite32612Query = { selectSolicitude$: of({}) };
    mockConsultaQuery = { selectConsultaioState$: of({}) };

    await TestBed.configureTestingModule({
      imports: [ManejoComponent],
      providers: [
        { provide: Tramite32612Store, useValue: mockTramite32612Store },
        { provide: Tramite32612Query, useValue: mockTramite32612Query },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManejoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forma with two FormGroups', () => {
    expect(component.forma.contains('reporteDeAnomaliasFormGroup')).toBe(true);
    expect(component.forma.contains('investigacionFormGroup')).toBe(true);
  });

  it('should get reporteDeAnomaliasFormGroup', () => {
    expect(component.reporteDeAnomaliasFormGroup).toBe(component.forma.get('reporteDeAnomaliasFormGroup'));
  });

  it('should get investigacionFormGroup', () => {
    expect(component.investigacionFormGroup).toBe(component.forma.get('investigacionFormGroup'));
  });

  it('should call setDynamicFieldValue when emitirCambioDeValor is called', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(mockTramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should clean up destroyNotifier$ on ngOnDestroy', () => {
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
