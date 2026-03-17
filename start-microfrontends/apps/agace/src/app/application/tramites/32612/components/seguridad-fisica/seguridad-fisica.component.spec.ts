import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguridadFisicaComponent } from './seguridad-fisica.component';
import { Tramite32612Store } from '../../estados/solicitud32612.store';
import { Tramite32612Query } from '../../estados/solicitud32612.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

describe('SeguridadFisicaComponent', () => {
  let component: SeguridadFisicaComponent;
  let fixture: ComponentFixture<SeguridadFisicaComponent>;
  let mockTramite32612Store: any;
  let mockTramite32612Query: any;
  let mockConsultaQuery: any;

  beforeEach(async () => {
    mockTramite32612Store = { setDynamicFieldValue: jest.fn() };
    mockTramite32612Query = { selectSolicitude$: of({}) };
    mockConsultaQuery = { selectConsultaioState$: of({}) };

    await TestBed.configureTestingModule({
      imports: [SeguridadFisicaComponent],
      providers: [
        { provide: Tramite32612Store, useValue: mockTramite32612Store },
        { provide: Tramite32612Query, useValue: mockTramite32612Query },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeguridadFisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups', () => {
    expect(component.instalacionesFormGroup).toBeInstanceOf(FormGroup);
    expect(component.accesosFormGroup).toBeInstanceOf(FormGroup);
    expect(component.perimetralesFormGroup).toBeInstanceOf(FormGroup);
    expect(component.estacionamientosFormGroup).toBeInstanceOf(FormGroup);
    expect(component.dispositivosFormGroup).toBeInstanceOf(FormGroup);
    expect(component.alumbradoFormGroup).toBeInstanceOf(FormGroup);
    expect(component.sistemasFormGroup).toBeInstanceOf(FormGroup);
  });

  it('should call setDynamicFieldValue when emitirCambioDeValor is called', () => {
    const event = { campo: 'testCampo', valor: 'testValor' };
    component.emitirCambioDeValor(event);
    expect(mockTramite32612Store.setDynamicFieldValue).toHaveBeenCalledWith('testCampo', 'testValor');
  });

  it('should set solicitudeState on ngOnInit', () => {
    component.solicitudeState = undefined as any;
    component.ngOnInit();
    expect(component.solicitudeState).toBeDefined();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it('should set consultaState from consultaQuery observable', () => {
    expect(component.consultaState).toBeDefined();
  });
});
