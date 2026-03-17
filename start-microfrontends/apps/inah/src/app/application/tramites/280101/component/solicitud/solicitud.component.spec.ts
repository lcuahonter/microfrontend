import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import { Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query';
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service';
import { CatalogoSelectComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { HttpClientModule } from '@angular/common/http';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let storeMock: any;
  let queryMock: any;
  let serviceMock: any;

  beforeEach(async () => {
    storeMock = {
      setModalidad: jest.fn(),
      setExposicionOpcion: jest.fn(),
      setNombre: jest.fn(),
      setAduana: jest.fn(),
      setDescripcionClobGenerica: jest.fn(),
      setCantMonumentos: jest.fn(),
    };

    queryMock = {
      selectSolicitud$: of({
        modalidadOpcion: '1',
        exposicionOpcion: 'true',
        nombre: 'Test Name',
        aduana: [{ id: 1, descripcion: 'Aduana 1' }],
        descripcionClobGenerica: 'Test Description',
        cantMonumentos: '5',
      }),
    };

    serviceMock = {
      getAduana: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Aduana 1' }])),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
SolicitudComponent,
        CatalogoSelectComponent,
        InputRadioComponent,
        TituloComponent,
      ],
      providers: [
        { provide: Tramite280101Store, useValue: storeMock },
        { provide: Tramite280101Query, useValue: queryMock },
        { provide: PermisoDeExportacionService, useValue: serviceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

   it('should initialize the form and fetch aduana data on ngOnInit', () => {
    const getAduanaSpy = jest.spyOn(component, 'getAduana');
    const establecerValoresFormularioSpy = jest.spyOn(component, 'establecerValoresFormulario');
    component.ngOnInit();
    expect(getAduanaSpy).toHaveBeenCalled();
    expect(establecerValoresFormularioSpy).toHaveBeenCalled();
    expect(component.solicitudForm).toBeDefined();
  });

  it('should disable the nombre field if exposicionOpcion is "false"', () => {
    component.solicitudForm.patchValue({ exposicionOpcion: 'false' });
    component.setValoresStore(component.solicitudForm, 'exposicionOpcion', 'setExposicionOpcion');
    fixture.detectChanges();
    expect(component.solicitudForm.get('nombre')?.disabled).toBe(true);
  });

  it('should enable the nombre field if exposicionOpcion is "true"', () => {
    component.setValoresStore(component.solicitudForm, 'exposicionOpcion', 'setExposicionOpcion');
    expect(component.solicitudForm.get('nombre')?.enabled).toBeTruthy();
  });

  it('should call the correct store method when setValoresStore is invoked', () => {
    const form = component.solicitudForm;
    component.setValoresStore(form, 'modalidadOpcion', 'setModalidad');
    expect(storeMock.setModalidad).toHaveBeenCalledWith('1');

    component.setValoresStore(form, 'cantMonumentos', 'setCantMonumentos');
    expect(storeMock.setCantMonumentos).toHaveBeenCalledWith('5');
  });

  it('should clean up subscriptions on destroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });
});
