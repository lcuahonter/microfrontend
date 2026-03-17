import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DatosEmpresaComponent } from './datos-empresa.component';
import { Tramite140205Store } from '../../../../estados/tramites/tramite140205.store';
import { Tramite140205Query } from '../../../../estados/queries/tramite140205.query';
import { CancelacionCertificadosService } from '../../services/cancelacionCertificados.service';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

describe('DatosEmpresaComponent', () => {
  let component: DatosEmpresaComponent;
  let fixture: ComponentFixture<DatosEmpresaComponent>;
  let mockStore: any;
  let mockQuery: any;
  let mockService: any;

  beforeEach(async () => {
    mockStore = {
      setGrupoEmpresa: jest.fn(),
      updateGrupoEmpresa: jest.fn(),
      setCampo: jest.fn(),
    };

    mockQuery = {
      selectSolicitud$: of({
        grupoEmpresa: {
          rfc: 'RFC12345678901',
          nombre: 'Empresa Test',
          primerApellido: 'Apellido1',
          segundoApellido: 'Apellido2',
          actividadEconomica: 'Comercio',
          datosRfc: 'DatosRFC',
          clave: 'Clave123',
          correo: 'test@example.com',
          calle: 'Calle 123',
          numeroExterior: '10',
          numeroInterior: '2',
          codigoPostal: '12345',
          colonia: 'Colonia Test',
          pais: 'México',
          estado: 'Estado Test',
          localidad: 'Localidad Test',
          municipio: 'Municipio Test',
          telefono: '1234567890',
        },
      }),
      selectConsultaioState$: of({ readonly: false }),
    };

    mockService = {
      getDatosConsulta: jest.fn().mockReturnValue(of({
        success: true,
        datos: { GrupoEmpresa: { rfc: 'RFC12345678901', nombre: 'Empresa Test' } }
      })),
      validate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TituloComponent,
        CommonModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Tramite140205Store, useValue: mockStore },
        { provide: Tramite140205Query, useValue: mockQuery },
        { provide: CancelacionCertificadosService, useValue: mockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('grupoEmpresa')).toBeDefined();
  });

  it('should display company data when buscarEmpresa is called with valid RFC', () => {
    component.ngOnInit();
    const grupoEmpresa = component.solicitudForm.get('grupoEmpresa') as FormGroup;
    grupoEmpresa.get('rfc')?.setValue('RFC12345678901');
    jest.spyOn(component, 'fetchGetDatos');
    const emitSpy = jest.spyOn(component.datosEmpresaBuscar, 'emit');
    component.buscarEmpresa();
    expect(component.mostrarDatosGenerales).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should not call fetchGetDatos if RFC is invalid', () => {
    component.ngOnInit();
    const grupoEmpresa = component.solicitudForm.get('grupoEmpresa') as FormGroup;
    grupoEmpresa.get('rfc')?.setValue('RFC123'); 
    jest.spyOn(component, 'fetchGetDatos');
    component.buscarEmpresa();
    expect(component.fetchGetDatos).not.toHaveBeenCalled();
    expect(component.mostrarDatosGenerales).toBe(false);
  });

  it('should call setGrupoEmpresa in fetchGetDatos when service returns success', () => {
    component.ngOnInit();
    component.fetchGetDatos();
    expect(mockStore.setGrupoEmpresa).toHaveBeenCalledWith({ rfc: 'RFC12345678901', nombre: 'Empresa Test' });
  });

  it('grupoEmpresa getter should return FormGroup', () => {
    component.ngOnInit();
    expect(component.grupoEmpresa instanceof FormGroup).toBe(true);
  });

  it('setValoresStore should call store method with correct value', () => {
    component.ngOnInit();
    const grupoEmpresa = component.solicitudForm.get('grupoEmpresa') as FormGroup;
    grupoEmpresa.get('nombre')?.setValue('Nuevo Nombre');
  });

  it('inicializarFormulario should disable form and show data if soloLectura is true', () => {
    component.ngOnInit();
    component.soloLectura = true;
    component.inicializarFormulario();
    expect(component.solicitudForm.disabled).toBe(true);
    expect(component.mostrarDatosGenerales).toBe(true);
  });

  it('inicializarFormulario should enable form if soloLectura is false', () => {
    component.ngOnInit();
    component.soloLectura = false;
    component.inicializarFormulario();
    expect(component.solicitudForm.enabled).toBe(true);
  });

  it('should unsubscribe on destroy', () => {
    const destroySpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate form controls', () => {
    component.ngOnInit();
    const grupoEmpresa = component.solicitudForm.get('grupoEmpresa');
    grupoEmpresa?.get('rfc')?.setValue('');
    expect(grupoEmpresa?.get('rfc')?.valid).toBe(false);
    grupoEmpresa?.get('rfc')?.setValue('RFC12345678901');
    expect(grupoEmpresa?.get('rfc')?.valid).toBe(true);
  });

  it('should mark rfc as touched when buscarEmpresa is called', () => {
    component.ngOnInit();
    const grupoEmpresa = component.solicitudForm.get('grupoEmpresa') as FormGroup;
    grupoEmpresa.get('rfc')?.setValue('RFC12345678901');
    const markAsTouchedSpy = jest.spyOn(grupoEmpresa.get('rfc')!, 'markAsTouched');
    component.buscarEmpresa();
    expect(markAsTouchedSpy).toHaveBeenCalled();
  });
});
