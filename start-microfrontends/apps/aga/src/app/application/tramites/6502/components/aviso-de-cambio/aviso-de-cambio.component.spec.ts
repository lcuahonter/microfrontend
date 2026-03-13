import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AvisoDeCambioComponent } from './aviso-de-cambio.component';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ReactiveFormsModule, FormBuilder, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { RegistroPoblacionalService } from '../../service/registro-poblacional.service';
import { Tramite6502Store } from '../../../../core/estados/tramites/tramite6502.store';
import { Tramite6502Query } from '../../../../core/queries/tramite6502.query';
import { ElementRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('AvisoDeCambioComponent', () => {
  let component: AvisoDeCambioComponent;
  let fixture: ComponentFixture<AvisoDeCambioComponent>;
  let mockRegistroService: jest.Mocked<RegistroPoblacionalService>;
  let mockStore: jest.Mocked<Tramite6502Store>;
  let mockQuery: jest.Mocked<Tramite6502Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    mockRegistroService = {
      obtenerInstalacionesPrincipalesTablaDatos: jest.fn(),
      obtenerFromaDatos: jest.fn()
    } as any;

    mockStore = {
      setCurpActualizada: jest.fn(),
      setConfirmacioCurpActualizada: jest.fn()
    } as any;

    mockQuery = {
      selectSolicitud$: new Subject()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new Subject()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AvisoDeCambioComponent,
        TablaDinamicaComponent,
        TituloComponent,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        { provide: RegistroPoblacionalService, useValue: mockRegistroService },
        { provide: Tramite6502Store, useValue: mockStore },
        { provide: Tramite6502Query, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoDeCambioComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    // Emit initial state for consultaioQuery
    (mockConsultaioQuery.selectConsultaioState$ as Subject<any>).next({ readonly: false });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cargarEstadoTramite', () => {
    it('should update solicitudState when store emits new value', () => {
      const testState = { curpActualizada: 'TEST123', confirmacioCurpActualizada: 'TEST123' };
      
      component.cargarEstadoTramite();
      (mockQuery.selectSolicitud$ as Subject<any>).next(testState);
      
      expect(component.solicitudState).toEqual(testState);
    });
  });

  describe('obtenerInstalacionesPrincipalesTablaDatos', () => {
    it('should set instalacionesPrincipalesTablaDatos with service response', fakeAsync(() => {
      const mockData = {
        code: 200,
        message: "Consulta exitosa", 
        data: [{ 
          tipo_persona: "AgenteAduanal",
          nombre: "MISAEL BARRAGAN RUIZ",
          rfc: "LEQI8101314S7",
          registro_poblacional: "LEQI810131HDGSXGC" 
        }] 
      };
      mockRegistroService.obtenerInstalacionesPrincipalesTablaDatos.mockReturnValue(of(mockData));

      component.obtenerInstalacionesPrincipalesTablaDatos();
      tick();

      expect(component.instalacionesPrincipalesTablaDatos).toEqual([mockData.data[0]]);
    }));

    it('should handle empty response', fakeAsync(() => {
      mockRegistroService.obtenerInstalacionesPrincipalesTablaDatos.mockReturnValue(of({ code: 200, message: "Consulta exitosa", data: [] }));
      component.instalacionesPrincipalesTablaDatos = []; 

      component.obtenerInstalacionesPrincipalesTablaDatos();
      tick();

      expect(component.instalacionesPrincipalesTablaDatos).toEqual([]);
    }));
  });

  describe('obtenerFormaDatos', () => {
    it('should set formaDatos and call crearFormulario', fakeAsync(() => {
      const mockData = { 
        code: 200,
        message: "Consulta exitosa",
        data: [{ 
          nombre: 'Test', 
          registroFederal: '123', 
          curp: 'TEST123' 
        }] 
      };
      mockRegistroService.obtenerFromaDatos.mockReturnValue(of(mockData));
      const crearFormSpy = jest.spyOn(component, 'crearFormulario');

      component.obtenerFormaDatos();
      tick();

      expect(component.formaDatos).toEqual([mockData.data[0]]);
      expect(crearFormSpy).toHaveBeenCalled();
    }));
  });

  describe('crearFormulario', () => {
    beforeEach(() => {
      component.formaDatos = [{
        nombre: 'Test Name',
        registroFederal: 'RF123',
        curp: 'CURP123'
      }];
    });

    it('should create form with correct initial values', () => {
      component.crearFormulario();

      expect(component.modalForma).toBeTruthy();
      expect(component.modalForma.get('nombre')?.value).toBe('Test Name');
      expect(component.modalForma.get('registroFederal')?.value).toBe('RF123');
      expect(component.modalForma.get('curp')?.value).toBe('CURP123');
    });

    it('should set validators for curp fields', () => {
      component.crearFormulario();

      const curpActualizada = component.modalForma.get('curpActualizada');
      const confirmacion = component.modalForma.get('confirmacioCurpActualizada');

      expect(curpActualizada?.validator).toBeTruthy();
      expect(confirmacion?.validator).toBeTruthy();
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component.modalForma = formBuilder.group({
        curpActualizada: ['NEWCURP123', Validators.required],
        confirmacioCurpActualizada: ['NEWCURP123', Validators.required]
      });
    });

    it('should call store method when form is valid', () => {
      component.setValoresStore(component.modalForma, 'curpActualizada', 'setCurpActualizada');

      expect(mockStore.setCurpActualizada).toHaveBeenCalledWith('NEWCURP123');
    });

    it('should not call store method when form is invalid', () => {
      component.modalForma.get('curpActualizada')?.setValue('');
      component.setValoresStore(component.modalForma, 'curpActualizada', 'setCurpActualizada');

      expect(mockStore.setCurpActualizada).not.toHaveBeenCalled();
    });
  });

  describe('modal operations', () => {

    it('should open and close modal', () => {
      component.modalInstance = {
        show: jest.fn(),
        hide: jest.fn()
      } as any;

      component.openModal();
      expect(component.modalInstance.show).toHaveBeenCalled();

      component.hideModal();
      expect(component.modalInstance.hide).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$', () => {
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('form operations', () => {
    beforeEach(() => {
      component.modalForma = formBuilder.group({
        nombre: ['Test Name'],
        registroFederal: ['RF123'],
        curp: ['CURP123'],
        curpActualizada: ['NEW123'],
        confirmacioCurpActualizada: ['NEW123']
      });
      component.instalacionesPrincipalesTablaDatos = [{
        tipo_persona: '',
        nombre: '',
        rfc: '',
        registro_poblacional: ''
      }];
    });

    it('should update table data when obtaining form values', () => {
      component.obtenerValoresFormulario();
      
      expect(component.instalacionesPrincipalesTablaDatos[0].nombre).toBe('Test Name');
      expect(component.instalacionesPrincipalesTablaDatos[0].registro_poblacional).toBe('NEW123');
      expect(component.instalacionesPrincipalesTablaDatos[0].rfc).toBe('RF123');
    });

    it('should reset form when clearing values', () => {
      component.limpiarValoresFormulario();
      
      expect(component.modalForma.get('nombre')?.value).toBeNull();
      expect(component.modalForma.get('registroFederal')?.value).toBeNull();
      expect(component.modalForma.get('curp')?.value).toBeNull();
    });
  });
});