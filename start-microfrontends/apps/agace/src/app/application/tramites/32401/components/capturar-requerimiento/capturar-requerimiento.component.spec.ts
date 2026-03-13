import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturarRequerimientoComponent } from './capturar-requerimiento.component';
import { AutoridadService } from '../../services/autoridad.service';
import { Tramite32401Store } from '../../estados/tramite32401.store';
import { Tramite32401Query } from '../../estados/tramite32401.query';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';

describe('CapturarRequerimientoComponent', () => {
  let component: CapturarRequerimientoComponent;
  let fixture: ComponentFixture<CapturarRequerimientoComponent>;
  let autoridadServiceMock: any;
  let tramite32401StoreMock: any;
  let tramite32401QueryMock: any;

  beforeEach(async () => {
    autoridadServiceMock = {
      obtenerAduanaLista: jest.fn().mockReturnValue(of({})),
    };

    tramite32401StoreMock = {
      setMotivoCancelacion: jest.fn(),
      setTipoDeRequerimiento: jest.fn(),
    };

    tramite32401QueryMock = {
      selectSolicitud$: of({
        motivoCancelacion: 'Test Motivo',
        tipoDeRequerimiento: 'Test Tipo',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CapturarRequerimientoComponent,
        CommonModule,
        FormsModule,
        TituloComponent,
        CatalogoSelectComponent,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: AutoridadService, useValue: autoridadServiceMock },
        { provide: Tramite32401Store, useValue: tramite32401StoreMock },
        { provide: Tramite32401Query, useValue: tramite32401QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CapturarRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.capturarRequirementoForm).toBeDefined();
    expect(
      component.capturarRequirementoForm.get('motivoCancelacion')
    ).toBeTruthy();
    expect(
      component.capturarRequirementoForm.get('tipoDeRequerimiento')
    ).toBeTruthy();
  });

  it('should call buscarAduanaLista and set aduanaLista', () => {
    component.buscarAduanaLista();
    expect(autoridadServiceMock.obtenerAduanaLista).toHaveBeenCalled();
    expect(component.aduanaLista).toEqual({});
  });

  it('should patch form values from solicitudState on ngOnInit', () => {
    expect(component.capturarRequirementoForm.value).toEqual({
      motivoCancelacion: 'Test Motivo',
      tipoDeRequerimiento: 'Test Tipo',
    });
  });

  it('should call setValoresStore with correct parameters', () => {
    const form = component.capturarRequirementoForm;
    form.patchValue({ motivoCancelacion: 'New Motivo' });
    component.setValoresStore(
      form,
      'motivoCancelacion',
      'setMotivoCancelacion'
    );
    expect(tramite32401StoreMock.setMotivoCancelacion).toHaveBeenCalledWith(
      'New Motivo'
    );
  });

  it('should update indice on seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(
      component['destroyNotifier$'],
      'next'
    );
    const destroyNotifierCompleteSpy = jest.spyOn(
      component['destroyNotifier$'],
      'complete'
    );
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
