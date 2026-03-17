import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { seComponent } from './se.component';
import { ConsultasSeService } from '../../shared/services/consultaSE.service';
import { BusquedaTramite } from '../../core/models/tramites/se/response/busquedaResponse';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('seComponent', () => {
  let component: seComponent;
  let fixture: ComponentFixture<seComponent>;
  let consultasSeService: any;
  let router: any;

  const mockTramites: BusquedaTramite[] = [
    {
      tipo_tramite: 'IMMEX',
      folio_tramite: '1234567890123456789012345',
      estatus_tramite: 'Aprobado',
      no_resolucion_programa: 'RES-001-2024',
      fecha_resolucion: '2024-01-15',
      sentido_resolucion: 'Favorable'
    },
    {
      tipo_tramite: 'PROSEC',
      folio_tramite: '9876543210987654321098765',
      estatus_tramite: 'En proceso',
      no_resolucion_programa: 'RES-002-2024',
      fecha_resolucion: '2024-02-20',
      sentido_resolucion: 'Pendiente'
    }
  ];

  const mockLoginState = {
    rfc: 'MAVL621207C95',
    nombre: 'Test User',
    isAuthenticated: true
  };

  const mockDetallesTramite = {
    codigo: '00',
    causa: '',
    datos: {
      num_folio_tramite: '1234567890123456789012345',
      id_tipo_tramite: 1,
      id_solicitud: 100,
      acronimo: 'IMMEX',
      dias_habiles_transcurridos: 5,
      tipo_solicitud: 'Nueva',
      tareas_activas: ['Revisión', 'Validación']
    }
  };

  beforeEach(async () => {
    const consultasSeServiceSpy = jasmine.createSpyObj('ConsultasSeService', [
      'obtenerTramites',
      'obtenerDetallesTramite'
    ]);


    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [seComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: ConsultasSeService, useValue: consultasSeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    consultasSeService = TestBed.inject(ConsultasSeService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(seComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con todos los campos vacíos', () => {
    expect(component.FormBusquedaTramite).toBeDefined();
    expect(component.FormBusquedaTramite.get('folio')?.value).toBe('');
    expect(component.FormBusquedaTramite.get('programa')?.value).toBe('');
    expect(component.FormBusquedaTramite.get('ano')?.value).toBe('');
    expect(component.FormBusquedaTramite.get('resolucion')?.value).toBe('');
    expect(component.FormBusquedaTramite.get('certificado')?.value).toBe('');
  });

  describe('Validaciones del formulario', () => {
    it('debería requerir al menos un campo para ser válido', () => {
      expect(component.FormBusquedaTramite.valid).toBe(false);
      expect(component.tieneErrorAlMenosUno()).toBe(true);
    });

    it('debería ser válido cuando folio tiene un valor válido', () => {
      component.FormBusquedaTramite.get('folio')?.setValue('1234567890123456789012345');
      expect(component.FormBusquedaTramite.valid).toBe(true);
      expect(component.tieneErrorAlMenosUno()).toBe(false);
    });

    it('debería validar que folio solo acepte números', () => {
      const folioControl = component.FormBusquedaTramite.get('folio');
      
      folioControl?.setValue('ABC123');
      expect(folioControl?.hasError('pattern')).toBe(true);

      folioControl?.setValue('1234567890123456789012345');
      expect(folioControl?.hasError('pattern')).toBe(false);
    });

    it('debería validar que folio tenga mínimo 25 caracteres', () => {
      const folioControl = component.FormBusquedaTramite.get('folio');
      
      folioControl?.setValue('123');
      expect(folioControl?.hasError('minlength')).toBe(true);

      folioControl?.setValue('1234567890123456789012345');
      expect(folioControl?.hasError('minlength')).toBe(false);
    });

    it('debería validar que programa solo acepte números', () => {
      const programaControl = component.FormBusquedaTramite.get('programa');
      
      programaControl?.setValue('ABC');
      expect(programaControl?.hasError('pattern')).toBe(true);

      programaControl?.setValue('12345');
      expect(programaControl?.hasError('pattern')).toBe(false);
    });

    it('debería validar que año tenga máximo 4 caracteres', () => {
      const anoControl = component.FormBusquedaTramite.get('ano');
      
      anoControl?.setValue('20245');
      expect(anoControl?.hasError('maxlength')).toBe(true);

      anoControl?.setValue('2024');
      expect(anoControl?.hasError('maxlength')).toBe(false);
    });

    it('debería validar que resolución tenga máximo 19 caracteres', () => {
      const resolucionControl = component.FormBusquedaTramite.get('resolucion');
      
      resolucionControl?.setValue('12345678901234567890');
      expect(resolucionControl?.hasError('maxlength')).toBe(true);

      resolucionControl?.setValue('1234567890123456789');
      expect(resolucionControl?.hasError('maxlength')).toBe(false);
    });

    it('debería validar que certificado tenga máximo 50 caracteres', () => {
      const certificadoControl = component.FormBusquedaTramite.get('certificado');
      
      certificadoControl?.setValue('a'.repeat(51));
      expect(certificadoControl?.hasError('maxlength')).toBe(true);

      certificadoControl?.setValue('a'.repeat(50));
      expect(certificadoControl?.hasError('maxlength')).toBe(false);
    });
  });

  describe('buscarTramite', () => {
    it('debería mostrar alerta cuando no hay al menos un campo', () => {
      component.buscarTramite();

      expect(component.alertaVisible).toBe(true);
      expect(component.mensajeAlerta).toContain('Debe capturar al menos un dato');
    });

    it('debería llamar al servicio y obtener trámites cuando el formulario es válido', () => {
      const mockResponse = { data: mockTramites };
      consultasSeService.obtenerTramites.and.returnValue(of(mockResponse));

      component.FormBusquedaTramite.get('folio')?.setValue('1234567890123456789012345');
      component.buscarTramite();

      expect(consultasSeService.obtenerTramites).toHaveBeenCalled();
      expect(component.datosBusquedaTramites).toEqual(mockTramites);
      expect(component.alertaVisible).toBe(false);
    });

    it('debería marcar todos los campos como touched cuando el formulario es inválido', () => {
      spyOn(component.FormBusquedaTramite, 'markAllAsTouched');
      
      component.buscarTramite();

      expect(component.FormBusquedaTramite.markAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('seleccionarTramite', () => {
    it('debería obtener detalles del trámite y navegar cuando la respuesta es exitosa', () => {
      consultasSeService.obtenerDetallesTramite.and.returnValue(of(mockDetallesTramite));
      spyOn(localStorage, 'setItem');

      component.seleccionarTramite(mockTramites[0]);

      expect(consultasSeService.obtenerDetallesTramite).toHaveBeenCalledWith({
        roles_usuario: ["AdministradorDependencia", "Dictaminador"],
        user_name: "MAVL621207C95",
        folio: '1234567890123456789012345'
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('folioTramite', '1234567890123456789012345');
      expect(localStorage.setItem).toHaveBeenCalledWith('tipoTramite', '1');
      expect(localStorage.setItem).toHaveBeenCalledWith('idSolicitud', '100');
      expect(localStorage.setItem).toHaveBeenCalledWith('acronimo', 'IMMEX');
      expect(localStorage.setItem).toHaveBeenCalledWith('diaHabilesTranscurridos', '5');

      expect(router.navigate).toHaveBeenCalledWith(['immex/datos-generales-tramite']);
    });

    it('debería mostrar alerta cuando la respuesta tiene un código de error', () => {
      const mockErrorResponse = {
        codigo: '01',
        causa: 'Error al obtener detalles',
        datos: null
      };
      consultasSeService.obtenerDetallesTramite.and.returnValue(of(mockErrorResponse));

      component.seleccionarTramite(mockTramites[0]);

      expect(component.alertaVisible).toBe(true);
      expect(component.mensajeAlerta).toContain('Error al obtener detalles');
    });

    it('debería guardar tareas activas en localStorage como JSON', () => {
      consultasSeService.obtenerDetallesTramite.and.returnValue(of(mockDetallesTramite));
      spyOn(localStorage, 'setItem');

      component.seleccionarTramite(mockTramites[0]);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'tareasActivas',
        JSON.stringify(['Revisión', 'Validación'])
      );
    });
  });

  describe('obtenerRFCLogin', () => {
    it('debería obtener el RFC del estado de login', (done) => {
      component.obtenerRFCLogin();

      setTimeout(() => {
        expect(component['rfcLogin']).toBe('MAVL621207C95');
        done();
      }, 100);
    });
  });

  describe('Getters de controles del formulario', () => {
    it('debería obtener el control folio', () => {
      const control = component.folio;
      expect(control).toBe(component.FormBusquedaTramite.get('folio'));
    });

    it('debería obtener el control programa', () => {
      const control = component.programa;
      expect(control).toBe(component.FormBusquedaTramite.get('programa'));
    });

    it('debería obtener el control ano', () => {
      const control = component.ano;
      expect(control).toBe(component.FormBusquedaTramite.get('ano'));
    });

    it('debería obtener el control resolucion', () => {
      const control = component.resolucion;
      expect(control).toBe(component.FormBusquedaTramite.get('resolucion'));
    });

    it('debería obtener el control certificado', () => {
      const control = component.certificado;
      expect(control).toBe(component.FormBusquedaTramite.get('certificado'));
    });
  });

  it('debería tener configuración de tabla con 6 columnas', () => {
    expect(component.configuracionTabla.length).toBe(6);
    expect(component.configuracionTabla[0].encabezado).toBe('Tipo trámite');
    expect(component.configuracionTabla[1].encabezado).toBe('Folio trámite');
    expect(component.configuracionTabla[5].encabezado).toBe('Sentido resolución');
  });

  it('debería inicializar alertaVisible como false', () => {
    expect(component.alertaVisible).toBe(false);
  });

  it('debería inicializar mensajeAlerta como string vacío', () => {
    expect(component.mensajeAlerta).toBe('');
  });

  it('debería inicializar claseAlerta como alert-danger', () => {
    expect(component.claseAlerta).toBe('alert-danger');
  });
});