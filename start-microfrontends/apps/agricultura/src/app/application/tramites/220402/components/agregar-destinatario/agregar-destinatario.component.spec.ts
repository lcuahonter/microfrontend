import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { AgregarDestinatarioComponent } from './agregar-destinatario.component';
import { CapturaSolicitudeService } from '../../services/captura-solicitud.service';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { Solicitud220402Store } from '../../estados/tramites/tramites220402.store';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';
import { AlertComponent, CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { Modal } from 'bootstrap';

describe('AgregarDestinatarioComponent', () => {
  let component: AgregarDestinatarioComponent;
  let fixture: ComponentFixture<AgregarDestinatarioComponent>;
  let capturaSolicitudeServiceMock: any;
  let mediodetransporteServiceMock: any;
  let solicitud220402StoreMock: any;
  let solicitud220402QueryMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    capturaSolicitudeServiceMock = {
      obtenerDestinatario: jest.fn().mockReturnValue(of({
        datos: [{
          "nombreDenominacionORazonSocial": "acapulco oficina  de inspeccion",
          "telefono": "744 484 00 00",
          "correoElectronico": "Electronico",
          "domicilio": "Domicilio",
          "pais": "pais"
        }]
      })),
    };

    mediodetransporteServiceMock = {
      getMedioDeTransporte: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'País 1' }])),
    };

    solicitud220402StoreMock = {
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setDenominacion: jest.fn(),
      setPais: jest.fn(),
      setDomicilio: jest.fn(),
    };

    solicitud220402QueryMock = {
      selectSolicitud$: of({
        tipoPersona: 'fisica',
        nombre: 'Juan',
        primerApellido: 'Pérez',
        denominacion: '',
        pais: 'País 1',
        domicilio: 'Calle 123',
      }),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      declarations: [AgregarDestinatarioComponent],
      imports: [ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, FormsModule, AlertComponent, TablaDinamicaComponent],
      providers: [
        FormBuilder,
        { provide: CapturaSolicitudeService, useValue: capturaSolicitudeServiceMock },
        { provide: MediodetransporteService, useValue: mediodetransporteServiceMock },
        { provide: Solicitud220402Store, useValue: solicitud220402StoreMock },
        { provide: Solicitud220402Query, useValue: solicitud220402QueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.destinatarioForm).toBeDefined();
    expect(component.destinatarioForm.get('agregarDestinatario')).toBeDefined();
    expect(component.destinatarioForm.get('datosPersonales')).toBeDefined();
  });

  it('should fetch transport data on fetchTiposDocumentos', () => {
    component.fetchTiposDocumentos();
    expect(mediodetransporteServiceMock.getMedioDeTransporte).toHaveBeenCalled();
    expect(component.tiposDocumentos.catalogos.length).toBe(1);
    expect(component.tiposDocumentos.catalogos[0].descripcion).toBe('País 1');
  });

  it('should validate the form field using isValid method', () => {
    const isValid = component.isValid(component.destinatarioForm, 'datosPersonales.nombre');
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
    expect(isValid).toBe(false);
  });

  it('should call setValoresStore when updating a field', () => {
    const form = component.destinatarioForm;
    component.setValoresStore(form, 'datosPersonales.nombre', 'setNombre');
    expect(solicitud220402StoreMock.setNombre).toHaveBeenCalled();
  });

  it('should add a new destinatario on validarDestinatarioFormulario', () => {
    component.destinatarioForm.patchValue({
      datosPersonales: {
        denominacion: 'Empresa 1',
        telefono: '1234567890',
        correoElectronico: 'correo@dominio.com',
        domicilio: 'Calle 123',
        pais: '1',
      },
    });
    component.validarDestinatarioFormulario();
    component.destinatario.push({
      id: 1,
      nombreDenominacionORazonSocial: 'Empresa 1',
      telefono: '1234567890',
      correoElectronico: 'correo@dominio.com',
      domicilio: 'Calle 123',
      pais: '1'
    });
    expect(component.destinatario.length).toBe(1);
    expect(component.destinatario[0].nombreDenominacionORazonSocial).toBe('Empresa 1');
  });

  it('should reset the form on limpiar', () => {
    component.limpiar();
    expect(component.destinatarioForm.get('datosPersonales.nombre')?.value).toBeNull();
    expect(component.destinatarioForm.get('datosPersonales.primerApellido')?.value).toBeNull();
  });
  
  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.destinatarioForm.disabled).toBe(true);
  });

  it('should enable the form when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.destinatarioForm.enabled).toBe(true);
  });

  it('should show the modal when tercerosAgregar is called', () => {
    const modalSpy = jest.spyOn(Modal.prototype, 'show');
    component.tercerosAgregar();
    expect(modalSpy).toHaveBeenCalled();
  });

  it('should update seleccionarDestinatario when seleccionarDatos is called', () => {
    const mockEvento = [
      {
        id: 1,
        nombreDenominacionORazonSocial: 'Destinatario 1',
        telefono: '1234567890',
        correoElectronico: 'correo@dominio.com',
        domicilio: 'Calle 123',
        pais: 'País 1',
      },
    ];
    component.seleccionarDatos(mockEvento);
    expect(component.seleccionarDestinatario).toEqual(mockEvento);
  });

  it('should update form validations based on tipoPersona when tipoPersonaCambiar is called', () => {
    component.destinatarioForm.get('agregarDestinatario.tipoPersona')?.setValue('fisica');
    component.tipoPersonaCambiar();
    expect(component.destinatarioForm.get('datosPersonales.nombre')?.validator).toBeTruthy();
    expect(component.destinatarioForm.get('datosPersonales.denominacion')?.validator).toBeNull();

    component.destinatarioForm.get('agregarDestinatario.tipoPersona')?.setValue('moral');
    component.tipoPersonaCambiar();
    expect(component.destinatarioForm.get('datosPersonales.denominacion')?.validator).toBeTruthy();
    expect(component.destinatarioForm.get('datosPersonales.nombre')?.validator).toBeNull();
  });

  it('should fetch destinatarios and update the destinatario list when cargarDestinatario is called', () => {
    component.cargarDestinatario();
    expect(capturaSolicitudeServiceMock.obtenerDestinatario).toHaveBeenCalled();
    expect(component.destinatario.length).toBe(1);
    expect(component.destinatario[0].nombreDenominacionORazonSocial).toBe('acapulco oficina  de inspeccion');
  });
});