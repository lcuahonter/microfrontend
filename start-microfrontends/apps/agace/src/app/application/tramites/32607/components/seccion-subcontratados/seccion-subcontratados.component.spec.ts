import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SeccionSubcontratadosComponent } from './seccion-subcontratados.component';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import {
  Catalogo,
  CatalogoSelectComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SeccionSubcontratadosComponent', () => {
  let component: SeccionSubcontratadosComponent;
  let fixture: ComponentFixture<SeccionSubcontratadosComponent>;
  let solicitudServiceMock: any;
  let solicitud32607StoreMock: any;
  let solicitud32607QueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirSolicitudCatologoSelectLista: jest.fn().mockReturnValue(of({})),
      conseguirSeccionSubcontratados: jest.fn().mockReturnValue(
        of({
          subcontrataRFC: 'RFC123',
          subcontrataRazonSocial: 'Test Company',
        })
      ),
    };

    solicitud32607StoreMock = {
      actualizarSubcontrataRFCBusqueda: jest.fn(),
      actualizarSubcontrataRFC: jest.fn(),
      actualizarSubcontrataRazonSocial: jest.fn(),
      actualizarSubcontrataEmpleados: jest.fn(),
      actualizarSubcontrataBimestre: jest.fn(),
    };

    solicitud32607QueryMock = {
      selectSolicitud$: of({
        subcontrataRFCBusqueda: 'RFC123',
        subcontrataRFC: 'RFC123',
        subcontrataRazonSocial: 'Test Company',
        subcontrataEmpleados: '10',
        subcontrataBimestre: '1',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [
        SeccionSubcontratadosComponent,
        CommonModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TituloComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32607Store, useValue: solicitud32607StoreMock },
        { provide: Solicitud32607Query, useValue: solicitud32607QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeccionSubcontratadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.subcontratadosForm).toBeDefined();
    expect(
      component.subcontratadosForm.controls['subcontrataRFCBusqueda']
    ).toBeDefined();
  });

  it('should patch form values from state on ngOnInit', () => {
    expect(component.subcontratadosForm.value).toEqual({
      subcontrataRFCBusqueda: 'RFC123',
      subcontrataEmpleados: '10',
      subcontrataBimestre: '1',
    });
  });

  it('should update store on actualizarSubcontrataRFCBusqueda', () => {
    const event = { target: { value: 'RFC456' } } as unknown as Event;
    component.actualizarSubcontrataRFCBusqueda(event);
    expect(
      solicitud32607StoreMock.actualizarSubcontrataRFCBusqueda
    ).toHaveBeenCalledWith('RFC456');
  });

  it('should update store on actualizarSubcontrataRFC', () => {
    const event = { target: { value: 'RFC789' } } as unknown as Event;
    component.actualizarSubcontrataRFC(event);
    expect(
      solicitud32607StoreMock.actualizarSubcontrataRFC
    ).toHaveBeenCalledWith('RFC789');
  });

  it('should update store on actualizarSubcontrataRazonSocial', () => {
    const event = { target: { value: 'New Company' } } as unknown as Event;
    component.actualizarSubcontrataRazonSocial(event);
    expect(
      solicitud32607StoreMock.actualizarSubcontrataRazonSocial
    ).toHaveBeenCalledWith('New Company');
  });

  it('should update store on actualizarSubcontrataEmpleados', () => {
    const event = { target: { value: '20' } } as unknown as Event;
    component.actualizarSubcontrataEmpleados(event);
    expect(
      solicitud32607StoreMock.actualizarSubcontrataEmpleados
    ).toHaveBeenCalledWith('20');
  });

  it('should update store on actualizarSubcontrataBimestre', () => {
    solicitud32607StoreMock.actualizarSubcontrataBimestre(2);
    expect(
      solicitud32607StoreMock.actualizarSubcontrataBimestre
    ).toHaveBeenCalledWith(2);
  });

  it('should update store on actualizarCatseleccionados', () => {
    solicitud32607StoreMock.actualizarCatseleccionados = jest.fn();
    const catalogo: Catalogo = { id: 5 } as Catalogo;
    solicitud32607StoreMock.actualizarCatseleccionados(catalogo.id);
    expect(
      solicitud32607StoreMock.actualizarCatseleccionados
    ).toHaveBeenCalledWith(5);
  });

  it('should update store on actualizarServicio', () => {
    solicitud32607StoreMock.actualizarServicio = jest.fn();
    const catalogo: Catalogo = { id: 7 } as Catalogo;
    solicitud32607StoreMock.actualizarServicio(catalogo.id);
    expect(solicitud32607StoreMock.actualizarServicio).toHaveBeenCalledWith(7);
  });

  it('should update store on actualizar190', () => {
    solicitud32607StoreMock.actualizar190 = jest.fn();
    solicitud32607StoreMock.actualizar190('valor190');
    expect(solicitud32607StoreMock.actualizar190).toHaveBeenCalledWith(
      'valor190'
    );
    solicitud32607StoreMock.actualizar190(190);
    expect(solicitud32607StoreMock.actualizar190).toHaveBeenCalledWith(190);
  });

  it('should update store on actualizar191', () => {
    solicitud32607StoreMock.actualizar191 = jest.fn();
    solicitud32607StoreMock.actualizar191('valor191');
    expect(solicitud32607StoreMock.actualizar191).toHaveBeenCalledWith(
      'valor191'
    );
    solicitud32607StoreMock.actualizar191(191);
    expect(solicitud32607StoreMock.actualizar191).toHaveBeenCalledWith(191);
  });

  it('should update store on actualizar199', () => {
    solicitud32607StoreMock.actualizar199 = jest.fn();
    solicitud32607StoreMock.actualizar199('valor199');
    expect(solicitud32607StoreMock.actualizar199).toHaveBeenCalledWith(
      'valor199'
    );
    solicitud32607StoreMock.actualizar199(199);
    expect(solicitud32607StoreMock.actualizar199).toHaveBeenCalledWith(199);
  });

  it('should update store on actualizarEmpleados', () => {
    solicitud32607StoreMock.actualizarEmpleados = jest.fn();
    const event = { target: { value: '33' } } as unknown as Event;
    const value = (event.target as HTMLInputElement | null)?.value;
    solicitud32607StoreMock.actualizarEmpleados(value);
    expect(solicitud32607StoreMock.actualizarEmpleados).toHaveBeenCalledWith(
      '33'
    );
  });

  it('should update store on actualizarBimestre', () => {
    solicitud32607StoreMock.actualizarBimestre = jest.fn();
    const catalogo: Catalogo = { id: 2 } as Catalogo;
    solicitud32607StoreMock.actualizarBimestre(catalogo.id);
    expect(solicitud32607StoreMock.actualizarBimestre).toHaveBeenCalledWith(2);
  });

  it('should update store on actualizar2034', () => {
    solicitud32607StoreMock.actualizar2034 = jest.fn();
    solicitud32607StoreMock.actualizar2034('valor2034');
    expect(solicitud32607StoreMock.actualizar2034).toHaveBeenCalledWith(
      'valor2034'
    );
    solicitud32607StoreMock.actualizar2034(2034);
    expect(solicitud32607StoreMock.actualizar2034).toHaveBeenCalledWith(2034);
  });

  it('should update store on actualizar236', () => {
    solicitud32607StoreMock.actualizar236 = jest.fn();
    solicitud32607StoreMock.actualizar236('valor236');
    expect(solicitud32607StoreMock.actualizar236).toHaveBeenCalledWith(
      'valor236'
    );
    solicitud32607StoreMock.actualizar236(236);
    expect(solicitud32607StoreMock.actualizar236).toHaveBeenCalledWith(236);
  });

  it('should update store on actualizar237', () => {
    solicitud32607StoreMock.actualizar237 = jest.fn();
    solicitud32607StoreMock.actualizar237('valor237');
    expect(solicitud32607StoreMock.actualizar237).toHaveBeenCalledWith(
      'valor237'
    );
    solicitud32607StoreMock.actualizar237(237);
    expect(solicitud32607StoreMock.actualizar237).toHaveBeenCalledWith(237);
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.subcontratadosForm = new FormBuilder().group({ test: ['value'] });
    component.guardarDatosFormulario();
    expect(component.subcontratadosForm.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.subcontratadosForm = new FormBuilder().group({ test: ['value'] });
    component.guardarDatosFormulario();
    expect(component.subcontratadosForm.enabled).toBe(true);
  });

  it('should emit data on cerrarModal', () => {
    jest.spyOn(component.seccionSubcontratados, 'emit');
    component.subcontratadosForm.setValue({
      subcontrataRFCBusqueda: 'RFC123',
      subcontrataRFC: 'RFC123',
      subcontrataRazonSocial: 'Test Company',
      subcontrataEmpleados: '10',
      subcontrataBimestre: '1',
    });
    component.cerrarModal();
    expect(component.seccionSubcontratados.emit).toHaveBeenCalledWith({
      denominacion: 'Test Company',
      RFC: 'RFC123',
      numeroDeEmpleados: '10',
      bimestre: '1',
    });
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
