import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import { DesistimientoStore } from '../../estados/tramite220404.store';
import { DesistimientoService } from '../../services/desistimiento.service';
import { DesistimientoQuery } from '../../estados/tramite220404.query';
import { SeccionLibQuery, SeccionLibStore, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let desistimientoStoreMock: any;
  let desistimientoServiceMock: any;
  let desistimientoQueryMock: any;
  let validacionesFormularioServiceMock: any;
  let seccionQueryMock: any;
  let seccionStoreMock: any;

  beforeEach(async () => {
    // Mock dependencies
    desistimientoStoreMock = {
      setDescripcion: jest.fn(),
    };
    desistimientoServiceMock = {
      getDesistimientoSolicitud: jest.fn(() =>
        of({
          folio: '1502200400120257001000002',
          tipoDeSolicitud: 'SENASICA-05-001-B Certificado Zoosanitario para Exportación',
          descripcion: '',
        })
      ),
    };
    desistimientoQueryMock = {
      selectDesistimiento$: of({
        folio: '1502200400120257001000002',
        tipoDeSolicitud: 'SENASICA-05-001-B Certificado Zoosanitario para Exportación',
        descripcion: '',
      }),
    };
    validacionesFormularioServiceMock = {
      isValid: jest.fn(() => true),
    };
    seccionQueryMock = {
      selectSeccionState$: of({
        seccion: [true],
        formaValida: [false],
      }),
    };
    seccionStoreMock = {
      establecerFormaValida: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      imports: [ReactiveFormsModule, TituloComponent],
      providers: [
        FormBuilder,
        { provide: DesistimientoStore, useValue: desistimientoStoreMock },
        { provide: DesistimientoService, useValue: desistimientoServiceMock },
        { provide: DesistimientoQuery, useValue: desistimientoQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesFormularioServiceMock },
        { provide: SeccionLibQuery, useValue: seccionQueryMock },
        { provide: SeccionLibStore, useValue: seccionStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    jest.spyOn(component, 'crearFormDesistimiento');
    jest.spyOn(component, 'getDesistimiento');

    component.ngOnInit();

    expect(component.crearFormDesistimiento).toHaveBeenCalled();
    expect(component.getDesistimiento).toHaveBeenCalled();
  });

  it('should fetch desistimiento data and update the form', () => {
    component.getDesistimiento();

    expect(desistimientoServiceMock.getDesistimientoSolicitud).toHaveBeenCalled();
    expect(component.desistimientoFormState.folio).toBe('1502200400120257001000002');
    expect(component.desistimientoFormState.tipoDeSolicitud).toBe('SENASICA-05-001-B Certificado Zoosanitario para Exportación');
    expect(component.desistimientoFormState.descripcion).toBe('');
  });

  it('should update descripcion and call the store', () => {
    const descripcionControl = component.formPermisoDesistir.get('descripcion');
    descripcionControl?.setValue('Nuevo motivo');
    component.onDescripcionChange();

    expect(desistimientoStoreMock.setDescripcion).toHaveBeenCalledWith(component.desistimientoFormState, 'Nuevo motivo');
  });

  it('should validate a specific form field', () => {
    const isValid = component.isValid(component.formPermisoDesistir, 'descripcion');
    expect(validacionesFormularioServiceMock.isValid).toHaveBeenCalledWith(component.formPermisoDesistir, 'descripcion');
    expect(isValid).toBe(true);
  });

  it('should handle status changes and update validation in store', () => {
    jest.spyOn(component, 'actualizarValidationInStore');
    component.formPermisoDesistir.updateValueAndValidity();

    expect(component.actualizarValidationInStore).toHaveBeenCalled();
  });
});