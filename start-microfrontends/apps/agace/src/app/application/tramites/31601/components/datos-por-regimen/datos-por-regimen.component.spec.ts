import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosPorRegimenComponent } from './datos-por-regimen.component';
import { Tramite31601Store } from '../../../../estados/tramites/tramite31601.store';
import { Tramite31601Query } from '../../../../estados/queries/tramite31601.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('DatosPorRegimenComponent', () => {
  let component: DatosPorRegimenComponent;
  let fixture: ComponentFixture<DatosPorRegimenComponent>;
  let tramite31601StoreMock: Partial<Tramite31601Store>;
  let tramite31601QueryMock: Partial<Tramite31601Query>;
  let consultaioQueryMock: Partial<ConsultaioQuery>;

  beforeEach(async () => {
    tramite31601StoreMock = {
      setCancelacionProcedimiento: jest.fn(),
      setCumpleLineamientos: jest.fn(),
    };

    tramite31601QueryMock = {
      selectSolicitud$: of({
        cancelacionProcedimiento: 'valorCancelacion',
        cumpleLineamientos: 'valorLineamientos',
        nombreCompleto: '',
        tipoDePersonaMiembro: '',
        nombreMiembro: '',
        apellidoPaternoMiembro: '',
      } as any)
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        user: null,
        readonly: false,
        loading: false,
        error: null,
        tipoDeTramite: '',
        estadoDeTramite: '',
        create: false,
        update: false,
        consultaioSolicitante: null,
      })
    };

    await TestBed.configureTestingModule({
      imports: [DatosPorRegimenComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite31601Store, useValue: tramite31601StoreMock },
        { provide: Tramite31601Query, useValue: tramite31601QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPorRegimenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    const crearRegimenFormSpy = jest.spyOn(component, 'crearRegimenForm');
    component.ngOnInit();
    expect(crearRegimenFormSpy).toHaveBeenCalled();
  });

  it('should create regimenForm with correct default values', () => {
    component.crearRegimenForm();
    expect(component.regimenForm.get('cancelacionProcedimiento')?.value).toBe('valorCancelacion');
    expect(component.regimenForm.get('cumpleLineamientos')?.value).toBe('valorLineamientos');
  });

  it('should disable form controls if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.crearRegimenForm();
    expect(component.regimenForm.get('cancelacionProcedimiento')?.disabled).toBe(true);
    expect(component.regimenForm.get('cumpleLineamientos')?.disabled).toBe(true);
  });

  it('should enable form controls if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.crearRegimenForm();
    expect(component.regimenForm.get('cancelacionProcedimiento')?.enabled).toBe(true);
    expect(component.regimenForm.get('cumpleLineamientos')?.enabled).toBe(true);
  });

  it('should call the correct store method in setValoresStore', () => {
    component.crearRegimenForm();
    component.regimenForm.get('cancelacionProcedimiento')?.setValue('nuevoValor');
    component.setValoresStore('cancelacionProcedimiento', 'setCancelacionProcedimiento');
    expect(tramite31601StoreMock.setCancelacionProcedimiento).toHaveBeenCalledWith('nuevoValor');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});