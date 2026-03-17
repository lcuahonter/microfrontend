import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiembroDeLaEmpresaComponent } from './miembro-de-la-empresa.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud31101Store } from '../../estados/solicitud31101.store';
import { Solicitud31101Query } from '../../estados/solicitud31101.query';
import {
  CatalogoSelectComponent,
  ConsultaioQuery,
  InputRadioComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class SolicitudServiceMock {
  conseguirDatosGeneralesCatologo = jest.fn().mockReturnValue(
    of({
      enSuCaracterDe: { catalogos: [{ id: 1, descripcion: 'Socio' }] },
      nacionalidad: { catalogos: [{ id: 2, descripcion: 'Mexicana' }] },
      tipoDePersona: { catalogos: [{ id: 3, descripcion: 'Física' }] },
    })
  );
}

class Solicitud31101StoreMock {
  actualizarMiembroCaracterDe = jest.fn();
  actualizarMiembroTributarMexico = jest.fn();
  actualizarMiembroNacionalidad = jest.fn();
  actualizarMiembroRFC = jest.fn();
  actualizarMiembroTipoPersonaMuestra = jest.fn();
  actualizarMiembroNombre = jest.fn();
  actualizarMiembroApellidoPaterno = jest.fn();
  actualizarMiembroApellidoMaterno = jest.fn();
  actualizarMiembroNombreEmpresa = jest.fn();
  actualizarMiembroRegistroFederal = jest.fn();
  actualizarMiembroNombreCompleto = jest.fn();
}

class Solicitud31101QueryMock {
  selectSolicitud$ = of({
    miembroCaracterDe: 1,
    miembroTributarMexico: 1,
    miembroNacionalidad: 2,
    miembroRfc: 'RFC123',
    miembroRegistroFederal: 'REGFED',
    miembroNombreCompleto: 'NOMBRE COMPLETO',
    miembroTipoPersonaMuestra: 3,
    miembroNombre: 'JUAN',
    miembroApellidoPaterno: 'PEREZ',
    miembroApellidoMaterno: 'LOPEZ',
    miembroNombreEmpresa: 'EMPRESA SA',
  });
}

class ConsultaioQueryMock {
  selectConsultaioState$ = of({ readonly: false });
}

describe('MiembroDeLaEmpresaComponent', () => {
  let component: MiembroDeLaEmpresaComponent;
  let fixture: ComponentFixture<MiembroDeLaEmpresaComponent>;
  let solicitudService: SolicitudServiceMock;
  let solicitud31101Store: Solicitud31101StoreMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MiembroDeLaEmpresaComponent,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        InputRadioComponent,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useClass: SolicitudServiceMock },
        { provide: Solicitud31101Store, useClass: Solicitud31101StoreMock },
        { provide: Solicitud31101Query, useClass: Solicitud31101QueryMock },
        { provide: ConsultaioQuery, useClass: ConsultaioQueryMock },
      ],
    })
      .overrideComponent(MiembroDeLaEmpresaComponent, {
        set: {
          providers: [
            { provide: SolicitudServiceMock, useClass: SolicitudServiceMock },
            {
              provide: Solicitud31101StoreMock,
              useClass: Solicitud31101StoreMock,
            },
            {
              provide: Solicitud31101QueryMock,
              useClass: Solicitud31101QueryMock,
            },
            { provide: ConsultaioQueryMock, useClass: ConsultaioQueryMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MiembroDeLaEmpresaComponent);
    component = fixture.componentInstance;
    solicitudService = TestBed.inject(SolicitudService as any);
    solicitud31101Store = TestBed.inject(Solicitud31101Store as any);
    component.enSuCaracterDeLista = {
      labelNombre: 'Test',
      required: true,
      primerOpcion: '',
      catalogos: [],
    };
    component.nacionalidadLista = {
      labelNombre: 'Test',
      required: true,
      primerOpcion: '',
      catalogos: [],
    };
    component.tipoDePersonaLista = {
      labelNombre: 'Test',
      required: true,
      primerOpcion: '',
      catalogos: [],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with values from the store', () => {
    expect(component.miembroEmpresaForm).toBeDefined();
    expect(component.miembroEmpresaForm.get('miembroCaracterDe')?.value).toBe(
      1
    );
    expect(component.miembroEmpresaForm.get('miembroNacionalidad')?.value).toBe(
      2
    );
    expect(
      component.miembroEmpresaForm.get('miembroTipoPersonaMuestra')?.value
    ).toBe(3);
  });

  it('should call store methods when updating fields', () => {
    component.actualizarMiembroCaracterDe({ id: 1, descripcion: 'Socio' });
    expect(
      solicitud31101Store.actualizarMiembroCaracterDe
    ).toHaveBeenCalledWith(1);

    component.actualizarMiembroTributarMexico(2);
    expect(
      solicitud31101Store.actualizarMiembroTributarMexico
    ).toHaveBeenCalledWith(2);

    component.actualizarMiembroNacionalidad({ id: 2, descripcion: 'Mexicana' });
    expect(
      solicitud31101Store.actualizarMiembroNacionalidad
    ).toHaveBeenCalledWith(2);

    const event = { target: { value: 'RFC999' } } as any as Event;
    component.actualizarMiembroRFC(event);
    expect(solicitud31101Store.actualizarMiembroRFC).toHaveBeenCalledWith(
      'RFC999'
    );
  });

  it('should emit eventoCerrarModal when cerrarModal is called', () => {
    const emitSpy = jest.spyOn(component.eventoCerrarModal, 'emit');
    component.cerrarModal();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit eventoActualizarMiembro with correct values on aceptarModal', () => {
    component.enSuCaracterDeLista = {
      catalogos: [{ id: 1, descripcion: 'Socio' }],
    } as any;
    component.nacionalidadLista = {
      catalogos: [{ id: 2, descripcion: 'Mexicana' }],
    } as any;
    component.tipoDePersonaLista = {
      catalogos: [{ id: 3, descripcion: 'Física' }],
    } as any;
    component.sinoOpcion = { radioOptions: [{ value: 1, label: 'Sí' }] } as any;

    component.miembroEmpresaForm.patchValue({
      miembroCaracterDe: 1,
      miembroNacionalidad: 2,
      miembroTipoPersonaMuestra: 3,
      miembroTributarMexico: 1,
      miembroNombreCompleto: 'NOMBRE COMPLETO',
      miembroRfc: 'RFC123',
      miembroNombre: 'JUAN',
      miembroNombreEmpresa: 'EMPRESA SA',
      miembroRegistroFederal: 'REGFED',
    });

    const emitSpy = jest.spyOn(component.eventoActualizarMiembro, 'emit');
    component.aceptarModal();

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoPersonaMuestra: 'Física',
        caracterDe: 'Socio',
        nacionalidad: 'Mexicana',
        tributarMexico: 'Sí',
        nombreCompleto: 'NOMBRE COMPLETO',
        rfc: 'RFC123',
        paisNombre: 'JUAN',
        nombreEmpresa: 'EMPRESA SA',
        razonSocial: 'REGFED',
      })
    );
  });

  it('should disable form if esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.miembroEmpresaForm.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.miembroEmpresaForm.enabled).toBe(true);
  });

  it('should call actualizarMiembroRegistroFederal and actualizarMiembroNombreCompleto on buscarRFCDatos', () => {
    component.miembroEmpresaForm.get('miembroRfc')?.setValue('RFC123');
    component.buscarRFCDatos();
    expect(
      solicitud31101Store.actualizarMiembroRegistroFederal
    ).toHaveBeenCalledWith('MAVL621207C95');
    expect(
      solicitud31101Store.actualizarMiembroNombreCompleto
    ).toHaveBeenCalledWith('EUROFOODS DE MEXICO GONZALEZ PINAL');
  });

  it('should return true for noEsValido if control is invalid and touched', () => {
    const control = component.miembroEmpresaForm.get('miembroNombre');
    control?.setValue('');
    control?.markAsTouched();
    expect(component.noEsValido('miembroNombre')).toBe(true);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const nextSpy = jest.spyOn(destroy$, 'next');
    const completeSpy = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
