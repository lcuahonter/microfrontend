import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepresentanteComponent } from './representante.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Tramite260605Store } from '../../../../estados/tramites/tramite260605.store';
import { Tramite260605Query } from '../../../../estados/queries/tramite260605.query';
import { ModificatNoticeService } from '../../services/modificat-notice.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('RepresentanteComponent', () => {
  let component: RepresentanteComponent;
  let fixture: ComponentFixture<RepresentanteComponent>;
  let tramite260605StoreMock: jest.Mocked<Tramite260605Store>;
  let tramite260605QueryMock: any;
  let modificatNoticeServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramite260605StoreMock = {
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
    } as any;

    tramite260605QueryMock = {
      selectSolicitud$: of({
        rfc: 'RFC123',
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
      }),
    };

    modificatNoticeServiceMock = {
      ObtenerReprestantanteData: jest.fn().mockReturnValue(of({
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'Gómez',
      })),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RepresentanteComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite260605Store, useValue: tramite260605StoreMock },
        { provide: Tramite260605Query, useValue: tramite260605QueryMock },
        { provide: ModificatNoticeService, useValue: modificatNoticeServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('guardarDatosFormulario debe deshabilitar el formulario si es solo lectura', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.representante.disabled).toBe(true);
  });

  it('guardarDatosFormulario debe habilitar el formulario si no es solo lectura', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarFormulario();
    component.guardarDatosFormulario();
    expect(component.representante.enabled).toBe(true);
  });

  it('inicializarEstadoFormulario debe llamar a guardarDatosFormulario si es solo lectura', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario debe llamar a inicializarFormulario si no es solo lectura', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnInit debe llamar a inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('obtenerAduanasDisponiblesDatos debe actualizar los campos del formulario', () => {
    component.inicializarFormulario();
    component.obtenerAduanasDisponiblesDatos();
    expect(modificatNoticeServiceMock.ObtenerReprestantanteData).toHaveBeenCalled();
    expect(component.representante.get('nombre')?.value).toBe('Juan');
    expect(component.representante.get('apellidoPaterno')?.value).toBe('Pérez');
    expect(component.representante.get('apellidoMaterno')?.value).toBe('Gómez');
  });

  it('setValoresStore debe llamar al método correspondiente del store', () => {
    component.inicializarFormulario();
    component.representante.get('rfc')?.setValue('RFC999');
    component.setValoresStore(component.representante, 'rfc', 'setRfc');
    expect(tramite260605StoreMock.setRfc).toHaveBeenCalledWith('RFC999');
  });

  it('ngOnDestroy debe limpiar el subject destroyNotifier$', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});