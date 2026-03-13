import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetosDelTramiteComponent } from './datos-del-tramite.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { Tramite130102Store } from '../../../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../../../estados/queries/tramite130102.query';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { ProductoResponse } from 'libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';
import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';

describe('DetosDelTramiteComponent', () => {
  let component: DetosDelTramiteComponent;
  let fixture: ComponentFixture<DetosDelTramiteComponent>;

  const mockStore = {
    setSolicitud: jest.fn(),
    setTipoDocumento: jest.fn(),
    setFraccion: jest.fn(),
  };

  const mockQuery = {
    selectSolicitud$: of({ fraccion: '1234' }),
  };

  const mockConsultaioQuery = {
    selectConsultaioState$: of({ readonly: false }),
  };

  const mockFormularioRegistroService = {
    registrarFormulario: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetosDelTramiteComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: Tramite130102Store, useValue: mockStore },
        { provide: Tramite130102Query, useValue: mockQuery },
        { provide: FormularioRegistroService, useValue: mockFormularioRegistroService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetosDelTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with expected controls', () => {
    expect(component.formDelTramite).toBeDefined();
    expect(component.formDelTramite.get('solicitud')).toBeTruthy();
    expect(component.formDelTramite.get('tipoDocumento')).toBeTruthy();
    expect(component.formDelTramite.get('fraccion')).toBeTruthy();
  });

  it('should call registrarFormulario on ngOnInit', () => {
    jest.spyOn(component as any, 'fetchSolicitudeOptions').mockImplementation();
    component.ngOnInit();
    expect(mockFormularioRegistroService.registrarFormulario).toHaveBeenCalledWith('formDelTramite', component.formDelTramite);
  });

  it('should handle readonly form properly', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.formDelTramite.disabled).toBeTruthy();
  });

  it('should handle editable form properly', () => {
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.formDelTramite.enabled).toBeTruthy();
  });

  it('should fetch solicitude options from JSON', () => {
  const mockResponse: ProductoResponse = {
    options: [{ label: 'Option 1', value: '1' }],
    defaultSelect: '1',
  };
  const http = {
    get: jest.fn().mockReturnValue(of(mockResponse))
  };
  (component as any)['http'] = http;
  component.fetchSolicitudeOptions();
  expect(component.solicitude).toEqual(mockResponse.options);
  expect(component.defaultSelect).toEqual('1');
});


  it('should update selected value on value change', () => {
    component.onValueChange('Nuevo');
    expect(component.selectedValue).toBe('Nuevo');
  });

  it('should call tipoTransporte and set selectedValue to Nuevo', () => {
    component.tipoTransporte();
    expect(component.selectedValue).toBe('Nuevo');
  });

  it('should cleanup on destroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
