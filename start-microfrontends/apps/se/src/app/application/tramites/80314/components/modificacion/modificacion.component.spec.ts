import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf, Subject } from 'rxjs';
import { ModificacionComponent } from './modificacion.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Tramite80314Store } from '../../estados/tramite80314.store';
import { Tramite80314Query } from '../../estados/tramite80314.query';

describe('ModificacionComponent', () => {
  let fixture!: ComponentFixture<ModificacionComponent>;
  let component!: ModificacionComponent;
  let immerModificacionService: jest.Mocked<ImmerModificacionService>;
  let tramite80314Store: jest.Mocked<Tramite80314Store>;
  let tramite80314Query: jest.Mocked<Tramite80314Query>;

  beforeEach(() => {
    immerModificacionService = {
      getDatosModificacion: jest.fn().mockReturnValue(observableOf({})),
      getActividadProductiva: jest.fn().mockReturnValue(observableOf({ data: [] })),
    } as unknown as jest.Mocked<ImmerModificacionService>;

    tramite80314Store = {
      setDatosModificacion: jest.fn(),
      setActividadProductiva: jest.fn(),
    } as unknown as jest.Mocked<Tramite80314Store>;

    tramite80314Query = {
      selectSolicitud$: observableOf({}),
    } as unknown as jest.Mocked<Tramite80314Query>;

    TestBed.configureTestingModule({
      imports: [ModificacionComponent, FormsModule, ReactiveFormsModule, ToastrModule.forRoot(), HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: immerModificacionService, useValue: immerModificacionService },
        { provide: Tramite80314Store, useValue: tramite80314Store },
        { provide: Tramite80314Query, useValue: tramite80314Query },
        provideToastr({ positionClass: 'toast-top-right' }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.modificacionForm).toBeDefined();
  });

  it('should call loadDatosModificacion on ngOnInit', () => {
    const loadDatosModificacionSpy = jest.spyOn(component, 'loadDatosModificacion');
    component.ngOnInit();
    expect(loadDatosModificacionSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario on ngOnInit', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.ngOnInit();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should set form values with setFormValues', () => {
    component.derechoState = {
      datosModificacion: {
        rfc: 'RFC123',
        federal: 'FED456',
        tipo: 'TIPO789',
        programa: 'PROG101',
        actividadProductivaActual: 'ACTPROD',
        actividadProductiva: 'ACTPROD2',
      },
    } as any;
    component.inicializarFormulario();
    component.setFormValues();

    expect(component.modificacionForm.get('rfc')?.value).toBe('RFC123');
    expect(component.modificacionForm.get('federal')?.value).toBe('FED456');
    expect(component.modificacionForm.get('tipo')?.value).toBe('TIPO789');
    expect(component.modificacionForm.get('programa')?.value).toBe('PROG101');
    expect(component.modificacionForm.get('actividadProductivaActual')?.value).toBe('ACTPROD');
  });

  it('should call the correct store method in setValoresStore', () => {
    component.inicializarFormulario();
    component.modificacionForm.get('rfc')?.setValue('RFC999');

    const storeSpy = jest.spyOn(component['tramite80314Store'], 'setDatosModificacion');

    component.setValoresStore(component.modificacionForm, 'rfc', 'setDatosModificacion');

    expect(storeSpy).toHaveBeenCalledWith('RFC999');
  });
});
