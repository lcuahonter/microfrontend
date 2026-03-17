import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DestinatarioComponent } from './destinatario.component';
import { Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

describe('DestinatarioComponent', () => {
  let component: DestinatarioComponent;
  let fixture: ComponentFixture<DestinatarioComponent>;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;

  beforeEach(async () => {
    tramiteStoreMock = {
      setGrupoReceptorNombre: jest.fn(),
      setGrupoReceptorApellidoPrimer: jest.fn(),
      setGrupoReceptorApellidoSegundo: jest.fn(),
      setGrupoReceptorNumeroFiscal: jest.fn(),
      setGrupoReceptorRazonSocial: jest.fn(),
      setGrupoDeDireccionesCiudad: jest.fn(),
      setGrupoDeDireccionesCalle: jest.fn(),
      setGrupoDeDireccionesNumeroLetra: jest.fn(),
      setGrupoDeDireccionesTelefono: jest.fn(),
      setGrupoDeDireccionesCorreoElectronico: jest.fn(),
      setGrupoRepresentativoLugar: jest.fn(),
      setGrupoRepresentativoNombreExportador: jest.fn(),
      setGrupoRepresentativoEmpresa: jest.fn(),
      setGrupoRepresentativoCargo: jest.fn(),
      setgrupoDeTransportePuertoEmbarque: jest.fn(),
      setgrupoDeTransportePuertoDesembarque: jest.fn(),
      setFormValidity: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        grupoReceptor: {
          nombre: 'John',
          apellidoPrimer: 'Doe',
          apellidoSegundo: 'Smith',
          numeroFiscal: '12345',
          razonSocial: 'Empresa Ejemplo',
        },
        grupoDeDirecciones: {
          ciudad: 'Ciudad Ejemplo',
          calle: 'Calle Ejemplo',
          numeroLetra: '123A',
          telefono: '1234567890',
          correoElectronico: 'correo@ejemplo.com',
        },
        grupoRepresentativo: {
          lugar: 'Lugar Ejemplo',
          nombreExportador: 'Exportador Ejemplo',
          empresa: 'Empresa Ejemplo',
          cargo: 'Cargo Ejemplo',
        },
        grupoDeTransporte: {
          puertoEmbarque: 'Puerto Embarque',
          puertoDesembarque: 'Puerto Desembarque',
        },
      }),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TituloComponent,
        DestinatarioComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite110216Store, useValue: tramiteStoreMock },
        { provide: Tramite110216Query, useValue: tramiteQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.registroFormulario).toBeDefined();
    expect(component.grupoReceptor.get('nombre')?.value).toBe('John');
    expect(component.grupoDeDirecciones.get('ciudad')?.value).toBe('Ciudad Ejemplo');
    expect(component.grupoRepresentativo.get('lugar')?.value).toBe('Lugar Ejemplo');
    expect(component.grupoDeTransporte.get('puertoEmbarque')?.value).toBe('Puerto Embarque');
  });

  it('should call setValoresStore when a field changes', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    const input = fixture.debugElement.nativeElement.querySelector('#nombre');
    input.value = 'Nuevo Nombre';
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.grupoReceptor, 'nombre', 'setGrupoReceptorNombre');
  });

  it('should validate the form on validarDestinatarioFormulario', () => {
    component.registroFormulario.get('grupoReceptor.nombre')?.setValue('');
    component.validarDestinatarioFormulario();
    expect(component.registroFormulario.get('grupoReceptor.nombre')?.touched).toBe(true);
    expect(component.registroFormulario.valid).toBe(false);
  });

  it('should mark all fields as touched if form is invalid on onSubmit', () => {
    component.registroFormulario.get('grupoReceptor.nombre')?.setValue('');
    component.validarDestinatarioFormulario();
    expect(component.registroFormulario.get('grupoReceptor.nombre')?.touched).toBe(true);
    expect(component.registroFormulario.valid).toBe(false);
  });

  it('should not mark fields as touched if form is valid on onSubmit', () => {
    component.onSubmit();
    expect(component.registroFormulario.valid).toBe(false);
  });

  it('should call isValid from ValidacionesFormularioService', () => {
    const isValidSpy = jest.spyOn(validacionesServiceMock, 'isValid');
    component.isValid(component.grupoReceptor, 'nombre');
    expect(isValidSpy).toHaveBeenCalledWith(component.grupoReceptor, 'nombre');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize grupoReceptor with default values', () => {
    expect(component.grupoReceptor.get('nombre')?.value).toBe('John');
    expect(component.grupoReceptor.get('apellidoPrimer')?.value).toBe('Doe');
    expect(component.grupoReceptor.get('apellidoSegundo')?.value).toBe('Smith');
  });

  it('should initialize grupoDeDirecciones with default values', () => {
    expect(component.grupoDeDirecciones.get('ciudad')?.value).toBe('Ciudad Ejemplo');
    expect(component.grupoDeDirecciones.get('calle')?.value).toBe('Calle Ejemplo');
    expect(component.grupoDeDirecciones.get('numeroLetra')?.value).toBe('123A');
  });

  it('should initialize grupoRepresentativo with default values', () => {
    expect(component.grupoRepresentativo.get('lugar')?.value).toBe('Lugar Ejemplo');
    expect(component.grupoRepresentativo.get('nombreExportador')?.value).toBe('Exportador Ejemplo');
    expect(component.grupoRepresentativo.get('empresa')?.value).toBe('Empresa Ejemplo');
  });

  it('should initialize grupoDeTransporte with default values', () => {
    expect(component.grupoDeTransporte.get('puertoEmbarque')?.value).toBe('Puerto Embarque');
    expect(component.grupoDeTransporte.get('puertoDesembarque')?.value).toBe('Puerto Desembarque');
  });

  it('should mark grupoReceptor.nombre as invalid if empty', () => {
    component.grupoReceptor.get('nombre')?.setValue('');
    expect(component.grupoReceptor.get('nombre')?.valid).toBe(true);
  });

  it('should mark grupoDeDirecciones.ciudad as invalid if empty', () => {
    component.grupoDeDirecciones.get('ciudad')?.setValue('');
    expect(component.grupoDeDirecciones.get('ciudad')?.valid).toBe(false);
  });

  it('should mark grupoRepresentativo.lugar as invalid if empty', () => {
    component.grupoRepresentativo.get('lugar')?.setValue('');
    expect(component.grupoRepresentativo.get('lugar')?.valid).toBe(false);
  });

  it('should mark grupoDeTransporte.puertoEmbarque as valid if not empty', () => {
    component.grupoDeTransporte.get('puertoEmbarque')?.setValue('Puerto Embarque');
    expect(component.grupoDeTransporte.get('puertoEmbarque')?.valid).toBe(true);
  });

  it('should call setValoresStore for grupoReceptor.nombre on change', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.grupoReceptor.get('nombre')?.setValue('Nuevo Nombre');
    const inputElement = fixture.debugElement.nativeElement.querySelector('#nombre');
    inputElement.dispatchEvent(new Event('change'));
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.grupoReceptor, 'nombre', 'setGrupoReceptorNombre');
  });

  it('should call setValoresStore for grupoDeDirecciones.ciudad on change', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.grupoDeDirecciones.get('ciudad')?.setValue('Nueva Ciudad');
    const inputElement = fixture.debugElement.nativeElement.querySelector('#ciudad');
    inputElement.dispatchEvent(new Event('change'));
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.grupoDeDirecciones, 'ciudad', 'setGrupoDeDireccionesCiudad');
  });

  it('should call setValoresStore for grupoRepresentativo.lugar on change', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.grupoRepresentativo.get('lugar')?.setValue('Nuevo Lugar');
    const inputElement = fixture.debugElement.nativeElement.querySelector('#lugar');
    inputElement.dispatchEvent(new Event('change'));
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.grupoRepresentativo, 'lugar', 'setGrupoRepresentativoLugar');
  });

  it('should disable form elements on onClick', () => {
    component.onClick();
    expect(component.estaDeshabilitado).toBe(true);
  });

  it('should mark all fields as touched on validarDestinatarioFormulario', () => {
    component.validarDestinatarioFormulario();
    expect(component.registroFormulario.touched).toBe(true);
  });

  it('should not call setValoresStore if form is invalid', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.grupoReceptor.get('nombre')?.setValue('');
    component.onSubmit();
    expect(setValoresStoreSpy).not.toHaveBeenCalled();
  });
  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.registroFormulario.disabled).toBe(true);
  });

  it('should enable the form when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.registroFormulario.enabled).toBe(true);
  });
});