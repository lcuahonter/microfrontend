import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnlaceComponent } from './enlace.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite32615TercerosQuery } from '../../../../estados/queries/tramite32615_terceros.query';
import { Tramite32615TercerosStore } from '../../../../estados/tramites/tramite32615_terceros.store';

describe('EnlaceComponent', () => {
  let component: EnlaceComponent;
  let fixture: ComponentFixture<EnlaceComponent>;
  let tramite32615QueryMock: Partial<Tramite32615TercerosQuery>;
  let tramite32615StoreMock: Partial<Tramite32615TercerosStore>;

  beforeEach(async () => {
    tramite32615QueryMock = {
      selectSolicitud$: of({
        resigtro: '12345',
        resigtroFedral: '12345',
        cargo: 'Manager',
        telefono: '1234567890',
        telefonoEnlace: '1234567890',
        correo: 'test@example.com',
        correoEnlace: 'test@example.com',
        suplente: 'John Doe',
      }),
    };

    tramite32615StoreMock = {
      setResigtroFedral: jest.fn(),
      setCargo: jest.fn(),
      setTelefonoEnlace: jest.fn(),
      setCorreoEnlace: jest.fn(),
      setSuplente: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule,
      EnlaceComponent
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite32615TercerosQuery, useValue: tramite32615QueryMock },
        { provide: Tramite32615TercerosStore, useValue: tramite32615StoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.enlace).toBeDefined();
    expect(component.enlace.get('resigtroFedral')?.value).toBe('12345');
    expect(component.enlace.get('cargo')?.value).toBe('Manager');
  });

  it('debería cargar datos del encabezado de enlace desde JSON', () => {
    component.getEnlace();
    expect(component.enlaceHeaderData).toBeDefined();
    expect(component.enlaceHeaderData.length).toBeGreaterThan(0);
  });

  it('debería abrir el modal e inicializar el formulario', () => {
    component.abrirModal();
    expect(component.modal).toBe('show');
    expect(component.enlace).toBeDefined();
  });

  it('debería actualizar el formulario con datos del representante', () => {
    component.patchData();
    expect(component.enlace.get('rfc')?.value).toBe(component.representativeData.rfc);
    expect(component.enlace.get('nombre')?.value).toBe(component.representativeData.nombre);
    expect(component.enlace.get('apellidoPaterno')?.value).toBe(component.representativeData.apellidoPaterno);
    expect(component.enlace.get('apellidoMaterno')?.value).toBe(component.representativeData.apellidoMaterno);
    expect(component.enlace.get('cuidad')?.value).toBe(component.representativeData.cuidad);
  });

  it('debería deshabilitar campos específicos del formulario después de actualizar datos', () => {
    component.patchData();
    expect(component.enlace.get('rfc')?.disabled).toBe(true);
    expect(component.enlace.get('nombre')?.disabled).toBe(true);
    expect(component.enlace.get('apellidoPaterno')?.disabled).toBe(true);
    expect(component.enlace.get('apellidoMaterno')?.disabled).toBe(true);
    expect(component.enlace.get('cuidad')?.disabled).toBe(true);
  });

  it('debería establecer valores en el store', () => {
    const form = component.enlace;
    form.get('resigtroFedral')?.setValue('67890');
    component.setValoresStore(form, 'resigtroFedral', 'setResigtroFedral');
    expect(tramite32615StoreMock.setResigtroFedral).toHaveBeenCalledWith('67890');
  });

  it('debería limpiar suscripciones en ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('debería validar campos obligatorios en el formulario', () => {
    component.enlace.get('resigtroFedral')?.setValue('');
    component.enlace.get('cargo')?.setValue('');
    expect(component.enlace.get('resigtroFedral')?.valid).toBe(false);
    expect(component.enlace.get('cargo')?.valid).toBe(false);
  });

  it('debería manejar correctamente la visibilidad del modal', () => {
    component.abrirModal();
    expect(component.modal).toBe('show');
    component.modal = 'hide';
    expect(component.modal).toBe('hide');
  });
});