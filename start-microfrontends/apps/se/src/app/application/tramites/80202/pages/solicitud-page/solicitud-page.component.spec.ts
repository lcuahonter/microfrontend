import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { SolicitudPageComponent } from './solicitud-page.component';
import { ImmexAmpliacionSensiblesStore } from '../../estados/immex-ampliacion-sensibles.store';
import { ImmexAmpliacionSensiblesQuery } from '../../estados/immex-ampliacion-sensibles.query';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { ToastrService } from 'ngx-toastr';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  // Mock services
  const mockStore = {
    setIdSolicitud: jest.fn()
  };

  const mockQuery = {
    selectSolicitud$: of({})
  };

  const mockRegistroService = {
    postGuardarDatos: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'Success', datos: { id_solicitud: 123 } }))
  };

  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: ImmexAmpliacionSensiblesStore, useValue: mockStore },
        { provide: ImmexAmpliacionSensiblesQuery, useValue: mockQuery },
        { provide: RegistroSolicitudService, useValue: mockRegistroService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values set correctly', () => {
    expect(component.indice).toBe(1);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update title based on valor in obtenerNombreDelTítulo', () => {
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(1)).toBe('Registro de solicitud IMMEX modalidad ampliación sensibles');
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(2)).toBe('Cargar archivos');
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(4)).toBe('Firmar');
    expect(SolicitudPageComponent.obtenerNombreDelTítulo(999)).toBe('Registro de solicitud IMMEX modalidad ampliación sensibles');
  });

  it('should update title in enTabChange', () => {
    component.enTabChange(1);
    expect(component.tituloMensaje).toBe('Zoosanitario para importación');
    
    component.enTabChange(2);
    expect(component.tituloMensaje).toBe('Captura del certificado zoosanitario para importación');
  });

  it('should handle manejaEventoCargaDocumentos correctly', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should handle cargaRealizada correctly', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should handle onCargaEnProgreso correctly', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
    
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });
});