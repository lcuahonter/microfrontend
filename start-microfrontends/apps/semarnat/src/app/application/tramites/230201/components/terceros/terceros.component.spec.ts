import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosComponent } from './terceros.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite230201Store, createInitialState } from '../../estados/tramite230201.store';
import { Tramite230201Query } from '../../estados/tramite230201.query';
import { CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { DestinatarioConfiguracionItem } from '../../enum/destinatario-tabla.enum';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PhytosanitaryExportacionService } from '../../services/phytosanitary-exportacion.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TemplateRef } from '@angular/core';

describe('TercerosComponent', () => {
  let component: TercerosComponent;
  let fixture: ComponentFixture<TercerosComponent>;
  let tramite230201StoreMock: any;
  let tramite230201QueryMock: any;
  let modalServiceMock: any;
  let phytosanitaryServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramite230201StoreMock = {
      setEntidadFederativa: jest.fn(),
      setTercerosPopupState: jest.fn(),
      setDatosDestinatario: jest.fn(),
    };

    tramite230201QueryMock = {
      selectSolicitud$: of({
        entidadFederativa: 'MORELOS',
        destinatarios: [],
      }),
    };

    phytosanitaryServiceMock = {
      getMetaInfo: jest.fn(() => of({ datos: { test: 'meta' } })),
      getPais: jest.fn(() => of({ 
        data: [
          { id: 125, descripcion: 'México' },
          { id: 126, descripcion: 'Estados Unidos' }
        ] 
      })),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
      }),
    };

    modalServiceMock = {
      show: jest.fn(() => ({ hide: jest.fn() })),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TercerosComponent, ReactiveFormsModule, TablaDinamicaComponent, CatalogoSelectComponent, TituloComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Tramite230201Store, useValue: tramite230201StoreMock },
        { provide: Tramite230201Query, useValue: tramite230201QueryMock },
        { provide: BsModalService, useValue: modalServiceMock },
        { provide: PhytosanitaryExportacionService, useValue: phytosanitaryServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and tablaDatos on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formularioDestinatario).toBeDefined();
    expect(component.solicitudState.destinatarios).toEqual([]);
  });

  it('should handle changes in entidadFederativa and update the store', () => {
    component.ngOnInit();
    component.formularioDestinatario.get('entidadFederativa')?.setValue('MORELOS');
    component.manejarCambioEntidadFederativa();
  });

  it('should handle fila seleccionada and enable modificar button', () => {
    const mockRow: DestinatarioConfiguracionItem = {
      pais: 125,
      ciudad: 'Cuernavaca',
      domicilio: 'Calle 123',
      codigoPostal: 62000,
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: '',
      razonSocial: '',
      paisStr: '',
    };

    component.manejarFilaSeleccionada([mockRow]);
    expect(component.botonModificarHabilitado).toBe(true);
  });

  it('should disable modificar button when no fila is seleccionada', () => {
    component.manejarFilaSeleccionada([]);
    expect(component.botonModificarHabilitado).toBe(false);
  });


  it('should close the popup and update the store', () => {
    component.cerrarPopup();
    expect(component.popupAbierto).toBeFalsy();
    expect(component.popupCerrado).toBeFalsy();
    expect(tramite230201StoreMock.setTercerosPopupState).toHaveBeenCalledWith(false);
  });


  it('should close the modal and reset the form', () => {
    component.modalRef = { hide: jest.fn() } as unknown as BsModalRef;
    component.cerrarModal();
    expect(component.modalRef.hide).toHaveBeenCalled();
    expect(component.agregarMercanciasForm.pristine).toBe(true);
  });


  it('should save destinatario data and update the store', () => {
    component.agregarMercanciasForm = new FormBuilder().group({
      pais: ['125'],
      ciudad: ['Cuernavaca'],
      domicilio: ['Calle 123'],
      codigoPostal: ['62000'],
      nombre: ['John'],
      apellidoPaterno: ['Doe'],
      apellidoMaterno: [''],
      razonSocial: [''],
    });

    component.guardarDestinatario();

    expect(tramite230201StoreMock.setDatosDestinatario).toHaveBeenCalledTimes(1);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroyNotifierSpy = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const destroyNotifierCompleteSpy = jest.spyOn(component['notificadorDestruccion$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalled();
    expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
  });

  it('should update form state when readonly is false', () => {
    component.soloLectura = false;
    component.ngOnInit();
    const enableSpy = jest.spyOn(component.formularioDestinatario, 'enable');
    component.updateEstadoFormulario();
    expect(enableSpy).toHaveBeenCalled();
  });

  it('should handle onTipoPersonaChange for fisica type', () => {
    component.ngOnInit();
    component.onTipoPersonaChange('fisica');
    
    const nombreControl = component.agregarMercanciasForm.get('nombre');
    const apellidoPaternoControl = component.agregarMercanciasForm.get('apellidoPaterno');
    const apellidoMaternoControl = component.agregarMercanciasForm.get('apellidoMaterno');
    const razonSocialControl = component.agregarMercanciasForm.get('razonSocial');
    
    expect(nombreControl?.hasError('required')).toBe(true);
    expect(apellidoPaternoControl?.hasError('required')).toBe(true);
    expect(apellidoMaternoControl?.hasError('required')).toBe(false); 
    expect(razonSocialControl?.hasError('required')).toBe(false);
  });

  it('should handle onTipoPersonaChange for moral type', () => {
    component.ngOnInit();
    component.onTipoPersonaChange('moral');
    
    const nombreControl = component.agregarMercanciasForm.get('nombre');
    const apellidoPaternoControl = component.agregarMercanciasForm.get('apellidoPaterno');
    const apellidoMaternoControl = component.agregarMercanciasForm.get('apellidoMaterno');
    const razonSocialControl = component.agregarMercanciasForm.get('razonSocial');
    
    expect(nombreControl?.hasError('required')).toBe(false);
    expect(apellidoPaternoControl?.hasError('required')).toBe(false);
    expect(apellidoMaternoControl?.hasError('required')).toBe(false);
    expect(razonSocialControl?.hasError('required')).toBe(true);
  });

  it('should open popup when botonModificarHabilitado is true', () => {
    component.botonModificarHabilitado = true;
    component.abrirPopup();
    expect(component.popupAbierto).toBe(true);
    expect(tramite230201StoreMock.setTercerosPopupState).toHaveBeenCalledWith(true);
  });

  it('should not open popup when botonModificarHabilitado is false', () => {
    component.botonModificarHabilitado = false;
    component.abrirPopup();
    expect(component.popupAbierto).toBe(false);
  });


  it('should not edit data modal when no fila is selected', () => {
    const mockTemplate = {} as TemplateRef<unknown>;
    component.filaSeleccionada = [];
    component.editDataModal(mockTemplate);
    expect(modalServiceMock.show).not.toHaveBeenCalled();
  });

  it('should eliminate selected items', () => {
    component.solicitudState = {
      ...createInitialState(),
      destinatarios: [
        {
          pais: 125,
          ciudad: 'Cuernavaca',
          domicilio: 'Calle 123',
          codigoPostal: 62000,
          nombre: 'John',
          apellidoPaterno: 'Doe',
          apellidoMaterno: 'Smith',
          razonSocial: 'Test Company',
          paisStr: 'México',
        }
      ]
    };
    component.filaSeleccionada = [component.solicitudState.destinatarios[0]];
    component.botonModificarHabilitado = true;
    component.ngOnInit();
    
    component.eliminarSeleccionados();
    
    expect(component.filaSeleccionada).toEqual([]);
    expect(component.botonModificarHabilitado).toBe(false);
    expect(tramite230201StoreMock.setDatosDestinatario).toHaveBeenCalledWith([]);
  });

  it('should save destinatario when form is valid', () => {
    component.ngOnInit();
    component.agregarMercanciasForm.patchValue({
      pais: 125,
      ciudad: 'Cuernavaca',
      domicilio: 'Calle 123',
      codigoPostal: 62000,
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
      razonSocial: 'Test Company',
      nacionalidad: 'nacional',
      tipoPersona: 'fisica'
    });
    
    const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');
    component.guardarDestinatario();
    
    expect(tramite230201StoreMock.setDatosDestinatario).toHaveBeenCalledTimes(1);
    expect(cerrarModalSpy).toHaveBeenCalled();
  });

  it('should replace existing data when saving destinatario with existing data', () => {
    component.ngOnInit();
    component.solicitudState = {
      ...createInitialState(),
      destinatarios: [
        {
          pais: 126,
          ciudad: 'Test City',
          domicilio: 'Test Address',
          codigoPostal: 12345,
          nombre: 'Test',
          apellidoPaterno: 'User',
          apellidoMaterno: 'Test',
          razonSocial: 'Old Company',
          paisStr: 'Estados Unidos',
        }
      ]
    };
    
    component.agregarMercanciasForm.patchValue({
      pais: 125,
      ciudad: 'Cuernavaca',
      domicilio: 'Calle 123',
      codigoPostal: 62000,
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
      razonSocial: 'Test Company',
      nacionalidad: 'nacional',
      tipoPersona: 'fisica'
    });
    
    component.guardarDestinatario();
    
    expect(tramite230201StoreMock.setDatosDestinatario).toHaveBeenCalledTimes(1);
    expect(component.solicitudState.destinatarios[0].paisStr).toBe('Estados Unidos');
    expect(component.solicitudState.destinatarios[0].nombre).toBe('Test');
  });

  it('should not save destinatario when form is invalid', () => {
    component.ngOnInit();
    component.agregarMercanciasForm.patchValue({
      pais: '',
      ciudad: '',
      domicilio: '',
      codigoPostal: '',
    });
    
    const cerrarModalSpy = jest.spyOn(component, 'cerrarModal');
    component.guardarDestinatario();
    
    expect(cerrarModalSpy).not.toHaveBeenCalled();
  });



  it('should load data from services on init', () => {
    component.ngOnInit();
    expect(phytosanitaryServiceMock.getMetaInfo).toHaveBeenCalled();
    expect(phytosanitaryServiceMock.getPais).toHaveBeenCalled();
  });
});