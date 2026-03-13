import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransporteFerroviarioComponent } from './transporte-ferroviario.component';
import { Tramite32613Store } from '../../../../estados/tramites/tramite32613.store';
import { Tramite32613Query } from '../../../../estados/queries/tramite32613.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('TransporteFerroviarioComponent', () => {
  let component: TransporteFerroviarioComponent;
  let fixture: ComponentFixture<TransporteFerroviarioComponent>;
  let storeMock: Partial<Tramite32613Store>;
  let queryMock: Partial<Tramite32613Query>;
  let consultaQueryMock: Partial<ConsultaioQuery>;
  
  beforeEach(async () => {
    storeMock = {
      setDynamicFieldValue: jest.fn()
    };

    queryMock = {
      selectRubroTransporteFerrovario$: of({})
    };

    consultaQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
        update: false,
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        someOtherField1: null,
        someOtherField2: null,
        someOtherField3: null,
        tipoDeTramite: '',
        estadoDeTramite: '',
        create: false,
        consultaioSolicitante: null
      })
    };
    
    await TestBed.configureTestingModule({
      imports: [TransporteFerroviarioComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite32613Store, useValue: storeMock },
        { provide: Tramite32613Query, useValue: queryMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransporteFerroviarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

    it('debería agregar grupo correoTelefono', () => {
    const lengthBefore = component.correosTelefonicos.length;
    component.addCorreoTelefonoGroup();
    expect(component.correosTelefonicos.length).toBe(lengthBefore + 1);
  });

    it('Debería actualizar la tienda cuando cambie el valor del texto.', () => {
    const event = { target: { value: 'test@example.com' } } as any;
    component.textValorCambio(event, 'correoTextInput');
    expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('correoTextInput', 'test@example.com');
  });

    it('debería deshabilitar senaleRadioInput cuando senaleSiSuSolicitud es 1', () => {
    component.rubroTransporteFerrovariostate = { senaleSiSuSolicitud: 1 };
    component.initializeForm();
    component.asignarValorCondicional();
    expect(component.transporteFerroviarioForm.get('senaleRadioInput')?.disabled).toBe(true);
  });

    it('debería habilitar senaleRadioInput cuando senaleSiSuSolicitud es 2', () => {
    component.rubroTransporteFerrovariostate = { senaleSiSuSolicitud: 2 };
    component.initializeForm();
    component.asignarValorCondicional();
    expect(component.transporteFerroviarioForm.get('senaleRadioInput')?.enabled).toBe(true);
  });

    it('debería actualizar la tienda y la UI en función de establecerCambioDeValorUno', () => {
    component.establecerCambioDeValorUno({ campo: 'indiqueSiCuentaCarga', valor: 'Si' });
    expect(component.mostrarAlertaUno).toBe(true);
    expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('indiqueSiCuentaCarga', 'Si');
  });

    it('debería retornar un error de validación cuando no se llenen los correoTelefonicos', () => {
    component.correosTelefonicos.clear();
    component.addCorreoTelefonoGroup();
    const errors = component.correosTelefonicos.errors;
    expect(errors?.['atLeastOneRequired']).toBe(true);
  });

    it('debería poblar templateMap después de la inicialización de la vista', async () => {
      await component.ngAfterViewInit();
      expect(component.templateMap['customSection1']).toBeDefined();
    });

  it('debería completar destroyNotifier$ en ngOnDestroy', () => {
      const completeSpy = jest.spyOn(
        (component as any).destroyNotifier$,
        'complete'
      );
      const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debería actualizar la tienda cuando se llama a radioValorCambio', () => {
      component.radioValorCambio(1, 'senaleSiSuSolicitud');
      expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('senaleSiSuSolicitud', 1);
    });

    it('debería actualizar la tienda con el array de correosTelefonicos cuando cambie el input de texto en el array', () => {
      const fb = TestBed.inject(FormBuilder);
      component.transporteFerroviarioForm.setControl(
        'correosTelefonicos',
        fb.array([
          fb.group({ correoLada: '', correoTelefono: '' }),
          fb.group({ correoLada: '', correoTelefono: '' }),
          fb.group({ correoLada: '', correoTelefono: '' }),
          fb.group({ correoLada: '', correoTelefono: '' }),
        ])
      );

      const input = document.createElement('input');
      input.value = '8888';
      const event = new Event('input');
      Object.defineProperty(event, 'target', { writable: false, value: input });

      component.textValorCambio(event, 'correoTelefono', 0);

      expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('correosTelefonicos', [
        { correoLada: '', correoTelefono: '8888' },
        { correoLada: '', correoTelefono: '' },
        { correoLada: '', correoTelefono: '' },
        { correoLada: '', correoTelefono: '' },
      ]);
    });

    it('debería llamar a validacionesService.isValid en esValido()', () => {
      const campo = 'correoTextInput';
      const spy = jest.spyOn(component['validacionesService'], 'isValid').mockReturnValue(true);
      const result = component.esValido(campo);
      expect(spy).toHaveBeenCalledWith(component.transporteFerroviarioForm, campo);
      expect(result).toBe(true);
    });

    it('debería establecer mostrarTemplate3Alerta en true y actualizar la tienda cuando unidadesArrendadas tiene valor', () => {
      component.customTemplate3Events({ campo: 'unidadesArrendadas', valor: '3' });
      expect(component.mostrarTemplate3Alerta).toBe(true);
      expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('unidadesArrendadas', '3');
    });

    it('debería llamar a store.setDynamicFieldValue en emitirCambioValor()', () => {
      const data = { campo: 'clasificacionInformacion', valor: 2 };
      component.emitirCambioValor(data);
      expect(storeMock.setDynamicFieldValue).toHaveBeenCalledWith('clasificacionInformacion', 2);
    });

    it('debería deshabilitar unidadesPropias y unidadesArrendadas en customTemplate3Form si readonly es true', () => {
      component.consultaState = { readonly: true, update: false } as any;
      component.template3Array = [
        { formControlName: 'unidadesPropias', required: true },
        { formControlName: 'unidadesArrendadas', required: false }
      ];
      component.initializeCustomTemplate3Form();

      expect(component.customTemplate3Form.get('unidadesPropias')?.disabled).toBe(true);
      expect(component.customTemplate3Form.get('unidadesArrendadas')?.disabled).toBe(true);
    });

    it('debería hacer patch a correosTelefonicos desde rubroTransporteFerrovariostate si el array existe', () => {
      component.rubroTransporteFerrovariostate = {
        correosTelefonicos: [
          { correoLada: '01', correoTelefono: '1234' },
          { correoLada: '02', correoTelefono: '5678' }
        ]
      };

      component.initializeForm();
      component.addCorreoTelefonoGroup();
      component.addCorreoTelefonoGroup();

      component.asignarValorCondicional();

      const values = component.correosTelefonicos.getRawValue();
      expect(values[0]).toEqual({ correoLada: '01', correoTelefono: '1234' });
      expect(values[1]).toEqual({ correoLada: '02', correoTelefono: '5678' });
    });

});
