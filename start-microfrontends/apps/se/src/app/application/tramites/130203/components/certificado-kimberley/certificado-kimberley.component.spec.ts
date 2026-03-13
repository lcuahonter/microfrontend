import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CertificadoKimberleyComponent } from './certificado-kimberley.component';
import { Tramite130203Store } from '../../estados/tramites/tramites130203.store';
import { Tramite130203Query } from '../../estados/queries/tramite130203.query';
import { ExportacionDeDiamantesEnBrutoService } from '../../services/exportacion-de-diamantes-en-bruto.service';
import { of, Subject } from 'rxjs';

describe('CertificadoKimberleyComponent', () => {
  let component: CertificadoKimberleyComponent;
  let fixture: ComponentFixture<CertificadoKimberleyComponent>;
  let MOCK_STORE: jest.Mocked<Tramite130203Store>;
  let MOCK_QUERY: jest.Mocked<Tramite130203Query>;
  let MOCK_SERVICE: jest.Mocked<ExportacionDeDiamantesEnBrutoService>;

  beforeEach(async () => {
    MOCK_STORE = {
      actualizarEstado: jest.fn(),
    } as any;

    MOCK_QUERY = {
      selectSolicitud$: of({
        especifique: 'Test',
        numero: '12345',
        nombre: 'Empresa Test',
        tipoEmpresa: '1',
        paisOrigen: 'MX',
        lineaCheckbox: true,
        direccionExportador: 'Dirección Test',
        nombreImportador: 'Importador Test',
        direccionImportador: 'Dirección Importador',
        numeroEnLetraDeLosLotes: 'Uno',
        numeroEnLetraDeLosLotesEnIngles: 'One',
        numeroDeFactura: 'F12345',
        cantidadEnQuilates: '100',
        valorDeLosDiamantes: '5000',
      }),
    } as any;

    MOCK_SERVICE = {
      getPaisesEmisores: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'México' }])),
      getNombresIngles: jest.fn().mockReturnValue(of([{ idDelPais: 1, name: 'Mexico' }])),
      getNombreExporter: jest.fn().mockReturnValue(of('Empresa Exportadora Test')),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, CertificadoKimberleyComponent],
      providers: [
        FormBuilder,
        { provide: Tramite130203Store, useValue: MOCK_STORE },
        { provide: Tramite130203Query, useValue: MOCK_QUERY },
        { provide: ExportacionDeDiamantesEnBrutoService, useValue: MOCK_SERVICE },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoKimberleyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('debería llamar a loadData y subscribeToState', () => {
      jest.spyOn(component, 'loadData');
      jest.spyOn(component, 'subscribeToState');

      component.ngOnInit();

      expect(component.loadData).toHaveBeenCalled();
      expect(component.subscribeToState).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    it('debería cargar paisesEmisores desde el servicio', () => {
      component.loadData();
      expect(MOCK_SERVICE.getPaisesEmisores).toHaveBeenCalled();
      expect(component.paisesEmisores).toEqual([{ id: 1, descripcion: 'México' }]);
    });

    it('debería cargar nombresIngles desde el servicio', () => {
      component.loadData();
      expect(MOCK_SERVICE.getNombresIngles).toHaveBeenCalled();
      expect(component.nombresIngles).toEqual([{ idDelPais: 1, name: 'Mexico' }]);
    });

    it('debería cargar nombreExportador desde el servicio y actualizar el formulario', () => {
      component.loadData();
      expect(MOCK_SERVICE.getNombreExporter).toHaveBeenCalled();
      expect(component.datosDelExportador.get('nombreExportador')?.value).toBe('Empresa Exportadora Test');
    });
  });

  describe('subscribeToState', () => {
    it('debería actualizar los formularios con los valores del estado', () => {
      component.subscribeToState();

      expect(component.formularioEmpresa.get('numero')?.value).toBe('12345');
      expect(component.datosDelExportador.get('direccionExportador')?.value).toBe('Dirección Test');
      expect(component.datosDelImportador.get('nombreImportador')?.value).toBe('Importador Test');
      expect(component.datosDeLaRemesa.get('numeroEnLetraDeLosLotes')?.value).toBe('Uno');
      expect(component.datosDeLosDiamantes.get('cantidadEnQuilates')?.value).toBe('100');
    });
  });

  describe('setValoresStore', () => {
    it('debería actualizar el store con el valor del formulario', () => {
      component.formularioEmpresa.get('nombre')?.setValue('Nuevo Nombre');
      component.setValoresStore(component.formularioEmpresa, 'nombre');

      expect(MOCK_STORE.actualizarEstado).toHaveBeenCalledWith({ nombre: 'Nuevo Nombre' });
    });

    it('debería llamar a updateNombreIngles si el campo es tipoEmpresa', () => {
      jest.spyOn(component, 'updateNombreIngles');
      component.formularioEmpresa.get('tipoEmpresa')?.setValue('1');
      component.setValoresStore(component.formularioEmpresa, 'tipoEmpresa');

      expect(component.updateNombreIngles).toHaveBeenCalledWith(1);
    });
  });

  describe('updateNombreIngles', () => {
    it('debería actualizar el campo nombre basado en paisId', () => {
      component.nombresIngles = [{ idDelPais: 1, name: 'Mexico' }];
      component.updateNombreIngles(1);

      expect(component.formularioEmpresa.get('nombre')?.value).toBe('Mexico');
    });

    it('debería establecer nombre como una cadena vacía si no se encuentra coincidencia', () => {
      component.nombresIngles = [{ idDelPais: 2, name: 'USA' }];
      component.updateNombreIngles(1);

      expect(component.formularioEmpresa.get('nombre')?.value).toBe('');
    });
  });

  describe('isInvalid', () => {
    it('debería devolver true si el control es inválido, sucio o tocado', () => {
      const CONTROL = component.formularioEmpresa.get('numero');
      CONTROL?.setErrors({ required: true });
      CONTROL?.markAsTouched();

      expect(component.isInvalid('numero')).toBe(true);
    });

    it('debería devolver false si el control es válido', () => {
      const CONTROL = component.formularioEmpresa.get('numero');
      CONTROL?.setValue('12345');

      expect(component.isInvalid('numero')).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('debería completar el subject destroyed$', () => {
      const SPY_NEXT = jest.spyOn(component['destroyed$'], 'next');
      const SPY_COMPLETE = jest.spyOn(component['destroyed$'], 'complete');

      component.ngOnDestroy();

      expect(SPY_NEXT).toHaveBeenCalled();
      expect(SPY_COMPLETE).toHaveBeenCalled();
    });
  });
});