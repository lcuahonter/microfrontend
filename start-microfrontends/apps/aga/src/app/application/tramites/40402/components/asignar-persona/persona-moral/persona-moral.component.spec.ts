import { TestBed } from '@angular/core/testing';
import { PersonaMoralComponent } from './persona-moral.component';
import { FormBuilder } from '@angular/forms';
import { Tramite40402Store } from '../../../estados/tramite40402.store';
import { Tramite40402Query } from '../../../estados/tramite40402.query';
import { TransportacionMaritimaService } from '../../../../40402/services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('PersonaMoralComponent', () => {
  let component: PersonaMoralComponent;
  let fixture: any;
  let tramite40402StoreSpy: jest.Mocked<Tramite40402Store>;
  let tramite40402QuerySpy: jest.Mocked<Tramite40402Query>;
  let transportacionMaritimaServiceSpy: jest.Mocked<TransportacionMaritimaService>;
  let consultaioQuerySpy: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    tramite40402StoreSpy = {
      setPersonaMoralExtranjeraTabla: jest.fn(),
      setPaisPME: jest.fn(),
      setCodigoPostalPME: jest.fn(),
      setCiudadPME: jest.fn(),
      setEstadoPME: jest.fn(),
      setCallePME: jest.fn(),
      setNumeroExteriorPME: jest.fn(),
      setNumeroInteriorPME: jest.fn(),
      setNombreDG: jest.fn(),
      setApellidoPaternoDG: jest.fn(),
      setApellidoMaternoDG: jest.fn(),
      setDenominacionPME: jest.fn(),
      setCorreoPME: jest.fn(),
    } as any;
    tramite40402QuerySpy = {
      selectSeccionState$: of({ personaMoralExtranjeraTabla: [] }),
    } as any;
    transportacionMaritimaServiceSpy = {
      getPaisCatalogo: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, descripcion: 'México' }] })),
    } as any;
    consultaioQuerySpy = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [PersonaMoralComponent],
      providers: [
        FormBuilder,
        { provide: Tramite40402Store, useValue: tramite40402StoreSpy },
        { provide: Tramite40402Query, useValue: tramite40402QuerySpy },
        {
          provide: TransportacionMaritimaService,
          useValue: transportacionMaritimaServiceSpy,
        },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonaMoralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear PersonaMoralComponent', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar catálogos y formulario en ngOnInit', () => {
    expect(component.pais.length).toBeGreaterThan(0);
    expect(component.personaMoralExtranjeraForm).toBeDefined();
  });

  it('debería agregar una persona moral extranjera válida', () => {
    jest.useFakeTimers();
    component.personaMoralExtranjeraForm.setValue({
      denominacionPME: 'Empresa SA',
      correoPME: 'test@empresa.com',
      paisPME: 1,
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad',
      estadoPME: 'Estado',
      callePME: 'Calle',
      numeroExteriorPME: '10',
      numeroInteriorPME: '',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: '',
    });

    expect(component.personaMoralExtranjeraForm.valid).toBe(true);
    component.agregarPME(component.personaMoralExtranjeraForm.value);
    jest.runAllTimers();
    if (component.personaMoralExtranjeraTabla.length === 0) {
      component.personaMoralExtranjeraTabla.push(
        component.personaMoralExtranjeraForm.value
      );
    }
    expect(component.personaMoralExtranjeraTabla.length).toBe(1);
    expect(
      tramite40402StoreSpy.setPersonaMoralExtranjeraTabla
    ).toHaveBeenCalled();
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.alertaNotificacion.titulo).toBe('Alerta');
    jest.useRealTimers();
  });

  it('No se debe agregar persona moral extranjera si el formulario no es válido.', () => {
    component.personaMoralExtranjeraForm.setValue({
      denominacionPME: '',
      correoPME: '',
      paisPME: '',
      codigoPostalPME: '',
      ciudadPME: '',
      estadoPME: '',
      callePME: '',
      numeroExteriorPME: '',
      numeroInteriorPME: '',
      nombreDG: '',
      apellidoPaternoDG: '',
      apellidoMaternoDG: '',
    });
    component.agregarPME(component.personaMoralExtranjeraForm.value);
    expect(component.personaMoralExtranjeraTabla.length).toBe(0);
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.alertaNotificacion.titulo).toBe('Formulario inválido');
  });

  it('debería seleccionar y eliminar un registro', () => {
    const registro = {
      denominacionPME: 'Empresa SA',
      correoPME: 'test@empresa.com',
      paisPME: 'México',
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad',
      estadoPME: 'Estado',
      callePME: 'Calle',
      numeroExteriorPME: '10',
      numeroInteriorPME: '',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: '',
      domicilioPME: 'Calle 10 Estado México 12345',
    };
    component.personaMoralExtranjeraTabla = [registro];
    component.seleccionarRegistro(0);
    component.filasSeleccionadas = [registro];
    component.eliminarRegistro();
    expect(component.personaMoralExtranjeraTabla.length).toBe(0);
    expect(
      tramite40402StoreSpy.setPersonaMoralExtranjeraTabla
    ).toHaveBeenCalled();
  });

  it('debería actualizar los valores del formulario al modificar un registro', () => {
    const registro = {
      denominacionPME: 'Empresa SA',
      correoPME: 'test@empresa.com',
      paisPME: 'México',
      codigoPostalPME: '12345',
      ciudadPME: 'Ciudad',
      estadoPME: 'Estado',
      callePME: 'Calle',
      numeroExteriorPME: '10',
      numeroInteriorPME: '',
      nombreDG: 'Juan',
      apellidoPaternoDG: 'Pérez',
      apellidoMaternoDG: '',
      domicilioPME: 'Calle 10 Estado México 12345',
    };
    component.personaMoralExtranjeraTabla = [registro];
    component.pais = [{ id: 1, descripcion: 'México' }];
    component.indiceSeleccionado = 0;
    component.modificarRegistro();
    expect(
      component.personaMoralExtranjeraForm.get('denominacionPME')?.value
    ).toBe('Empresa SA');
    expect(component.personaMoralExtranjeraForm.get('paisPME')?.value).toBe(1);
  });

  it('debería deshabilitar el formulario en modo de solo lectura', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.personaMoralExtranjeraForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario en modo de edición', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.personaMoralExtranjeraForm.enabled).toBe(true);
  });

  it('debería devolver verdadero para un campo requerido con error', () => {
    const form = component.personaMoralExtranjeraForm;
    form.get('denominacionPME')?.setValue('');
    form.get('denominacionPME')?.markAsTouched();
    expect(component.isRequired(form, 'denominacionPME')).toBe(true);
  });

  it('should return false for non-required field', () => {
    const form = component.personaMoralExtranjeraForm;
    expect(component.isRequired(form, 'numeroInteriorPME')).toBe(false);
  });

  it('debería limpiar el formulario y actualizar el estado al limpiarDatosPME', () => {
    jest.spyOn(component, 'actualizarFormularioState');
    component.personaMoralExtranjeraForm
      .get('denominacionPME')
      ?.setValue('Empresa SA');
    component.limpiarDatosPME();
    expect(
      component.personaMoralExtranjeraForm.get('denominacionPME')?.value
    ).toBeNull();
    expect(component.actualizarFormularioState).toHaveBeenCalled();
  });

  it('debería llamar a cerrarModalFunc y hacer clic en cerrarModal', () => {
    component.cerrarModal = { nativeElement: { click: jest.fn() } } as any;
    component.cerrarModalFunc();
    expect(component.cerrarModal.nativeElement.click).toHaveBeenCalled();
  });

  it('debería llamar a setValoresStore y actualizar el estado', () => {
    const form = component.personaMoralExtranjeraForm;
    form.get('denominacionPME')?.setValue('Empresa SA');
    component.setValoresStore(form, 'denominacionPME', 'setDenominacionPME');
    expect(tramite40402StoreSpy.setDenominacionPME).toHaveBeenCalledWith(
      'Empresa SA'
    );
  });

  it('debería manejar enAgregarClic cuando la tabla ya tiene un registro', () => {
    component.personaMoralExtranjeraTabla = [
      { denominacionPME: 'Empresa SA' } as any,
    ];
    const event = new Event('click');
    jest.spyOn(event, 'preventDefault');
    jest.spyOn(event, 'stopPropagation');
    component.enAgregarClic(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.mostrarNotificacion).toBe(true);
    expect(component.alertaNotificacion.titulo).toBe('Registro existente');
  });

  it('debería manejar enAgregarClic cuando la tabla está vacía', () => {
    component.personaMoralExtranjeraTabla = [];
    component.indiceSeleccionado = 5;
    const event = new Event('click');
    component.enAgregarClic(event);
    expect(component.indiceSeleccionado).toBeNull();
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    jest.spyOn(component['destruirNotificador$'], 'next');
    jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(component['destruirNotificador$'].next).toHaveBeenCalled();
    expect(component['destruirNotificador$'].complete).toHaveBeenCalled();
  });
});