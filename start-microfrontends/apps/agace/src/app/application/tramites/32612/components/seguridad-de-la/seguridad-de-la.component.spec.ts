import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadDeLaComponent } from './seguridad-de-la.component';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('SeguridadDeLaComponent', () => {
  let component: SeguridadDeLaComponent;
  let fixture: ComponentFixture<SeguridadDeLaComponent>;
  let mockTramite32612Store: any;
  let mockTramite32612Query: any;
  let mockConsultaioQuery: any;

  beforeEach(async () => {
    mockTramite32612Store = { setDynamicFieldValue: jest.fn() };
    mockTramite32612Query = { selectSolicitude$: of({}) };
    mockConsultaioQuery = { selectConsultaioState$: of({}) };

    await TestBed.configureTestingModule({
      imports: [SeguridadDeLaComponent],
      providers: [
        { provide: Tramite32612Store, useValue: mockTramite32612Store },
        { provide: Tramite32612Query, useValue: mockTramite32612Query },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadDeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forma with tecnologiaFormGroup and tecnologiaDosFormGroup', () => {
    expect(component.forma.contains('tecnologiaFormGroup')).toBe(true);
    expect(component.forma.contains('tecnologiaDosFormGroup')).toBe(true);
  });

  it('should get tecnologiaFormGroup', () => {
    expect(component.tecnologiaFormGroup).toBe(component.forma.get('tecnologiaFormGroup'));
  });

  it('should get tecnologiaDosFormGroup', () => {
    expect(component.tecnologiaDosFormGroup).toBe(component.forma.get('tecnologiaDosFormGroup'));
  });

  it('should call setDynamicFieldValue when emitirCambioDeValor is called', () => {
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

  it('should set solicitudeState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudeState).toBeDefined();
  });

  it('should set consultaState in constructor', () => {
    expect(component.consultaState).toBeDefined();
  });
});
