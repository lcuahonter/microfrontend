import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarRequerimientoComponent } from './solicitar-requerimiento.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AutoridadService } from '../../services/autoridad.service';
import { Tramite32401Store } from '../../estados/tramite32401.store';
import { Tramite32401Query } from '../../estados/tramite32401.query';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';

describe('SolicitarRequerimientoComponent', () => {
  let component: SolicitarRequerimientoComponent;
  let fixture: ComponentFixture<SolicitarRequerimientoComponent>;
  let autoridadServiceMock: any;
  let tramite32401StoreMock: any;
  let tramite32401QueryMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    autoridadServiceMock = {
      obtenerTramiteLista: jest.fn().mockReturnValue(of({ catalogos: [] })),
      agregarSolicitud: jest
        .fn()
        .mockReturnValue(of({ success: true, datos: {} })),
      agregarRequerimientoOpcions: jest.fn().mockReturnValue(of([])),
    };

    tramite32401StoreMock = {
      setTipoBusqueda: jest.fn(),
      setDelContenedor: jest.fn(),
    };

    tramite32401QueryMock = {
      selectSolicitud$: of({}),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        SolicitarRequerimientoComponent,
      ],
      declarations: [],
      providers: [
        { provide: AutoridadService, useValue: autoridadServiceMock },
        { provide: Tramite32401Store, useValue: tramite32401StoreMock },
        { provide: Tramite32401Query, useValue: tramite32401QueryMock },
        {
          provide: ValidacionesFormularioService,
          useValue: validacionesServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarRequerimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitarForm).toBeDefined();
    expect(component.solicitarForm.controls['tipoBusqueda']).toBeDefined();
  });

  it('should call obtenerAduanaLista and populate tramiteList', () => {
    component.obtenerAduanaLista();
    expect(autoridadServiceMock.obtenerTramiteLista).toHaveBeenCalled();
    expect(component.tramiteList.catalogos).toEqual([]);
  });

  it('should handle cambiarRequerimiento correctly', () => {
    component.cambiarRequerimiento('Requerimiento');
    expect(component.mostrarSeccionAduanaaFecha).toBe(true);
    expect(component.mostrarSeccionNoManifiesto).toBe(false);

    component.cambiarRequerimiento('Inicio');
    expect(component.mostrarSeccionAduanaaFecha).toBe(false);
    expect(component.mostrarSeccionNoManifiesto).toBe(true);
  });

  it('should call setValoresStore and update the store', () => {
    const form = component.solicitarForm;
    form.patchValue({ tipoBusqueda: 'test' });
    component.setValoresStore(form, 'tipoBusqueda', 'setTipoBusqueda');
    expect(tramite32401StoreMock.setTipoBusqueda).toHaveBeenCalledWith('test');
  });

  it('should validate form fields using isValid', () => {
    const isValid = component.isValid(component.solicitarForm, 'tipoBusqueda');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(
      component.solicitarForm,
      'tipoBusqueda'
    );
    expect(isValid).toBe(true);
  });

  it('should add data to datosDelContenedor on obtenerTablaPoblada', () => {
    component.obtenerTablaPoblada();
    expect(autoridadServiceMock.agregarSolicitud).toHaveBeenCalled();
    expect(component.datosDelContenedor.length).toBe(2);
  });

  it('should reset the form and clear data on limpiarFormulario', () => {
    component.solicitarForm.patchValue({ tipoBusqueda: 'test' });
    component.datosDelContenedor = [{ id: 1 } as any];
    component.tramiteList.catalogos = [{} as any];

    component.limpiarFormulario();

    expect(component.solicitarForm.value).toEqual({
      tipoBusqueda: 'test',
      rfc: '',
      tipoDeTramite: '',
      folioDeTramite: '',
    });
    expect(component.datosDelContenedor).toEqual([]);
    expect(component.tramiteList.catalogos).toEqual([]);
  });

  it('should navigate to a new route on valorDeAlternancia', () => {
    const routerSpy = jest.spyOn(component['router'], 'navigate');
    component.valorDeAlternancia({
      column: '123',
      row: {
        estadoDelTramite: '',
        folioTramite: '',
        id: 1,
        razonSocial: '',
        rfc: '',
        tipoTramite: '',
      },
    });
    expect(routerSpy).toHaveBeenCalledWith(
      ['agace/manifiesto-aereo/requiremento'],
      {
        state: {
          data: {
            column: '123',
            row: {
              estadoDelTramite: '',
              folioTramite: '',
              id: 1,
              razonSocial: '',
              rfc: '',
              tipoTramite: '',
            },
          },
        },
      }
    );
  });

  it('should call agregarRequerimientoOpcions and populate requerimientoOpcions', () => {
    const mockRequerimientoOpcions = [{ value: 1, label: 'Option 1' }];
    jest
      .spyOn(autoridadServiceMock, 'agregarRequerimientoOpcions')
      .mockReturnValue(of(mockRequerimientoOpcions));

    component.agregarRequerimientoOpcions();

    expect(autoridadServiceMock.agregarRequerimientoOpcions).toHaveBeenCalled();
    expect(component.requerimientoOpcions).toEqual(mockRequerimientoOpcions);
  });
});
