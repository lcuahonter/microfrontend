import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AvisoComponent } from './aviso.component';
import { AvisoService } from '../../services/aviso.service';
import { Tramite32505Store } from '../../../../estados/tramites/trimite32505.store';
import { Tramite32505Query } from '../../../../estados/queries/tramite32505.query';
import { ValidacionesFormularioService, BotonAccionesTipos } from '@libs/shared/data-access-user/src';
import { HttpClientModule } from '@angular/common/http';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
}));

describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;
  let avisoServiceMock: any;
  let tramiteQueryMock: any;
  let storeMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    avisoServiceMock = {
      obtenerPais: jest.fn().mockReturnValue(of({ datos: [{ id: 1, nombre: 'México' }] })),
      obtenerAnio: jest.fn().mockReturnValue(of({ datos: [2023, 2024] })),
      obtenerCilindros: jest.fn().mockReturnValue(of({ datos: [4, 6, 8] })),
      obtenerCombustible: jest.fn().mockReturnValue(of({ datos: ['Gasolina', 'Diesel'] })),
      obtenerAduana: jest.fn().mockReturnValue(of({ datos: ['Aduana 1', 'Aduana 2'] })),
      obtenerPaisIssued: jest.fn().mockReturnValue(of({ datos: [{ id: 1, nombre: 'USA' }] })),
      obtenerAvisoTabla: jest.fn().mockReturnValue(of({ datos: [] })),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({}),
    };

    storeMock = {
      setTipoBusqueda: jest.fn(),
      setTipoBusquedaAviso: jest.fn(),
      setFolioTipo: jest.fn(),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, AvisoComponent, HttpClientModule],
      providers: [
        { provide: AvisoService, useValue: avisoServiceMock },
        { provide: Tramite32505Store, useValue: storeMock },
        { provide: Tramite32505Query, useValue: tramiteQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.aviosForm).toBeDefined();
  });

  it('should update store values when setValoresStore is called', () => {
    const form = component.adaceForm;
    form.get('tipoBusqueda')?.setValue('Manual');
    component.setValoresStore(form, 'tipoBusqueda', 'setTipoBusqueda');
    expect(storeMock.setTipoBusqueda).toHaveBeenCalledWith('Manual');
  });

  it('should handle mostrarCampos correctly', () => {
    component.adaceForm.get('tipoBusqueda')?.setValue('Manual');
    component.mostrarCampos();
    expect(component.datosDelAvisoVisible).toBe(true);
    expect(component.datosCargaMasiva).toBe(false);

    component.adaceForm.get('tipoBusqueda')?.setValue('Carga masiva');
    component.mostrarCampos();
    expect(component.datosDelAvisoVisible).toBe(true);
    expect(component.datosCargaMasiva).toBe(true);
  });

  it('should handle mostrarCamposAviso with empty values', () => {
    component.aviosForm.get('tipoBusquedaAviso')?.setValue('');
    component.mostrarCamposAviso();
    expect(component.datosDelVehiculo).toBe(true);
    expect(component.datosFolioVUCEM).toBe(true);
  });

  it('should reset form and clear options on openModalCancelarTramite', () => {
    component.openModalCancelarTramite();
    expect(component.optionsPais).toEqual([]);
  });

  it('should clean up observables on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('guardarDatosFormulario', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call donanteDomicilio and disable form when soloLectura is true', () => {
      const donanteDomicilioSpy = jest.spyOn(component, 'donanteDomicilio').mockImplementation(() => {});
      const disableSpy = jest.spyOn(component.aviosForm, 'disable');
      component.soloLectura = true;

      component.guardarDatosFormulario();

      expect(donanteDomicilioSpy).toHaveBeenCalled();
      expect(disableSpy).toHaveBeenCalled();
    });

    it('should call donanteDomicilio and enable form when soloLectura is false', () => {
      const donanteDomicilioSpy = jest.spyOn(component, 'donanteDomicilio').mockImplementation(() => {});
      const enableSpy = jest.spyOn(component.aviosForm, 'enable');
      component.soloLectura = false;

      component.guardarDatosFormulario();

      expect(donanteDomicilioSpy).toHaveBeenCalled();
      expect(enableSpy).toHaveBeenCalled();
    });
  });

  describe('abrirPopup', () => {
    it('should set esPopupAbierto to true', () => {
      component.esPopupAbierto = false;
      component.abrirPopup();
      expect(component.esPopupAbierto).toBe(true);
    });

    it('should change esPopupAbierto from false to true', () => {
      component.esPopupAbierto = false;
      component.abrirPopup();
      expect(component.esPopupAbierto).toBe(true);
    });
  });

  describe('datosDelAviso', () => {
    it('should set esPopupAbierto to true', () => {
      component.esPopupAbierto = false;

      component.datosDelAviso();

      expect(component.esPopupAbierto).toBe(true);
    });

    it('should show modal when datosAviso element exists', () => {
      const { Modal } = require('bootstrap');
      Modal.mockClear();
      const mockModalInstance = {
        show: jest.fn(),
        hide: jest.fn()
      };
      Modal.mockReturnValue(mockModalInstance);

      const mockElement = document.createElement('div');
      mockElement.setAttribute('class', 'modal');
      mockElement.setAttribute('id', 'testModal');

      document.body.appendChild(mockElement);

      component.datosAviso = { nativeElement: mockElement } as any;

      component.datosDelAviso();

      expect(component.esPopupAbierto).toBe(true);
      expect(Modal).toHaveBeenCalledWith(mockElement);
      expect(mockModalInstance.show).toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    it('should handle case when datosAviso element does not exist', () => {
      component.datosAviso = undefined as any;

      expect(() => component.datosDelAviso()).not.toThrow();
      expect(component.esPopupAbierto).toBe(true);
    });
  });

  describe('accionesBotones', () => {
    it('should set esManualAsivoAgregarClicked to true when action is AGREGAR', () => {
      component.esManualAsivoAgregarClicked = false;

      component.accionesBotones(BotonAccionesTipos.AGREGAR);

      expect(component.esManualAsivoAgregarClicked).toBe(true);
    });

    it('should handle ELIMINAR action without throwing error', () => {
      expect(() => component.accionesBotones(BotonAccionesTipos.ELIMINAR)).not.toThrow();
    });

    it('should handle MODIFICAR action without throwing error', () => {
      expect(() => component.accionesBotones(BotonAccionesTipos.MODIFICAR)).not.toThrow();
    });

    it('should not change esManualAsivoAgregarClicked for non-AGREGAR actions', () => {
      component.esManualAsivoAgregarClicked = false;

      component.accionesBotones(BotonAccionesTipos.ELIMINAR);
      expect(component.esManualAsivoAgregarClicked).toBe(false);

      component.accionesBotones(BotonAccionesTipos.MODIFICAR);
      expect(component.esManualAsivoAgregarClicked).toBe(false);
    });
  });

  describe('Form Getter Methods', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return adaceForm from aviosForm', () => {
      const adaceFormGroup = component.adaceForm;
      
      expect(adaceFormGroup).toBeDefined();
      expect(adaceFormGroup.get('adace')).toBeTruthy();
      expect(adaceFormGroup.get('pais')).toBeTruthy();
      expect(adaceFormGroup.get('anio')).toBeTruthy();
    });

    it('should return adace control from adaceForm', () => {
      const adaceControl = component.adace;
      
      expect(adaceControl).toBeDefined();
      expect(adaceControl).toBe(component.aviosForm.get('adaceForm.adace'));
    });

    it('should return pais control from adaceForm', () => {
      const paisControl = component.pais;
      
      expect(paisControl).toBeDefined();
      expect(paisControl).toBe(component.aviosForm.get('adaceForm.pais'));
    });

    it('should return anio control from adaceForm', () => {
      const anioControl = component.anio;
      
      expect(anioControl).toBeDefined();
      expect(anioControl).toBe(component.aviosForm.get('adaceForm.anio'));
    });

    it('should return tipoBusqueda control from adaceForm', () => {
      const tipoBusquedaControl = component.tipoBusqueda;
      
      expect(tipoBusquedaControl).toBeDefined();
      expect(tipoBusquedaControl).toBe(component.aviosForm.get('adaceForm.tipoBusqueda'));
    });

    it('should return tipoBusquedaAviso control from adaceForm', () => {
      const tipoBusquedaAvisoControl = component.tipoBusquedaAviso;
      
      expect(tipoBusquedaAvisoControl).toBeDefined();
      expect(tipoBusquedaAvisoControl).toBe(component.aviosForm.get('adaceForm.tipoBusquedaAviso'));
    });

    it('should return folioTipo control from adaceForm', () => {
      const folioTipoControl = component.folioTipo;
      
      expect(folioTipoControl).toBeDefined();
      expect(folioTipoControl).toBe(component.aviosForm.get('adaceForm.folioTipo'));
    });

    it('should return cilindros control from adaceForm', () => {
      const cilindrosControl = component.cilindros;
      
      expect(cilindrosControl).toBeDefined();
      expect(cilindrosControl).toBe(component.aviosForm.get('adaceForm.cilindros'));
    });
  });

  describe('mostrarCamposAviso', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show correct fields when tipoBusquedaAviso is "Importación"', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('Importación');
      
      component.mostrarCamposAviso();
      
      expect(component.datosDelVehiculo).toBe(true);
      expect(component.datosFolioVUCEM).toBe(false);
      expect(component.datosDelImportacion).toBe(true);
      expect(component.datosDelVenta).toBe(false);
      expect(component.datosNIVNumeroSerie).toBe(false);
    });

    it('should show correct fields when tipoBusquedaAviso is "Venta"', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('Venta');
      
      component.mostrarCamposAviso();
      
      expect(component.datosFolioVUCEM).toBe(true);
      expect(component.datosDelVehiculo).toBe(false);
      expect(component.datosDelImportacion).toBe(false);
      expect(component.datosDelVenta).toBe(true);
      expect(component.datosNIVNumeroSerie).toBe(false);
    });

    it('should show correct fields when tipoBusquedaAviso is "Venta" and folioTipo is "Si"', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('Venta');
      component.adaceForm.get('folioTipo')?.setValue('Si');
      
      component.mostrarCamposAviso();
      
      expect(component.datosDelVenta).toBe(true);
      expect(component.datosDelVehiculo).toBe(false);
      expect(component.datosDelImportacion).toBe(false);
      expect(component.datosFolioVUCEM).toBe(true);
      expect(component.datosNIVNumeroSerie).toBe(true);
    });

    it('should show correct fields when tipoBusquedaAviso is "Venta" and folioTipo is "No"', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('Venta');
      component.adaceForm.get('folioTipo')?.setValue('No');
      
      component.mostrarCamposAviso();
      
      expect(component.datosDelVenta).toBe(true);
      expect(component.datosDelVehiculo).toBe(false);
      expect(component.datosDelImportacion).toBe(false);
      expect(component.datosFolioVUCEM).toBe(true);
      expect(component.datosNIVNumeroSerie).toBe(false);
    });

    it('should show correct fields when tipoBusquedaAviso is "Importación y venta"', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('Importación y venta');
      
      component.mostrarCamposAviso();
      
      expect(component.datosDelVehiculo).toBe(true);
      expect(component.datosFolioVUCEM).toBe(false);
      expect(component.datosDelImportacion).toBe(true);
      expect(component.datosDelVenta).toBe(true);
    });

    it('should show default fields when tipoBusquedaAviso is empty or unknown value', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('');
      
      component.mostrarCamposAviso();
      
      expect(component.datosFolioVUCEM).toBe(true);
      expect(component.datosDelVehiculo).toBe(true);
      expect(component.datosDelImportacion).toBe(true);
    });

    it('should show default fields when tipoBusquedaAviso has unknown value', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue('UnknownType');
      
      component.mostrarCamposAviso();
      
      expect(component.datosFolioVUCEM).toBe(true);
      expect(component.datosDelVehiculo).toBe(true);
      expect(component.datosDelImportacion).toBe(true);
    });

    it('should handle null values gracefully', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue(null);
      component.adaceForm.get('folioTipo')?.setValue(null);
      
      expect(() => component.mostrarCamposAviso()).not.toThrow();
      
      expect(component.datosFolioVUCEM).toBe(true);
      expect(component.datosDelVehiculo).toBe(true);
      expect(component.datosDelImportacion).toBe(true);
    });

    it('should handle undefined values gracefully', () => {
      component.adaceForm.get('tipoBusquedaAviso')?.setValue(undefined);
      component.adaceForm.get('folioTipo')?.setValue(undefined);
      
      expect(() => component.mostrarCamposAviso()).not.toThrow();
    });
  });
});