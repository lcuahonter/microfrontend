import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilesFerrovarioComponent } from './perfiles-ferrovario.component';
import { Tramite32618Query } from '../../estados/tramite32618query';
import { Tramite32618Store } from '../../estados/tramite32618.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('PerfilesFerrovarioComponent', () => {
  let component: PerfilesFerrovarioComponent;
  let fixture: ComponentFixture<PerfilesFerrovarioComponent>;
  let mockTramiteQuery: Partial<Tramite32618Query>;
  let mockStore: Partial<Tramite32618Store>;
  let mockConsultaQuery: Partial<ConsultaioQuery>;
  
  beforeEach(async () => {
    mockStore = {
      setDynamicFieldValue: jest.fn(),
    };

    mockTramiteQuery = {
      selectRubroTransporteFerrovario$: of({
        pip: 'Si',
        oea: 'No',
        otosProgramas: 'Si',
        customsTradePartnership: 'No',
        antiguedad: '2 años',
      }),
    };

    mockConsultaQuery = {
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
      imports: [PerfilesFerrovarioComponent],
      providers: [
        { provide: Tramite32618Query, useValue: mockTramiteQuery },
        { provide: Tramite32618Store, useValue: mockStore },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilesFerrovarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  


  it('debería hacer patch a los valores y mostrar las plantillas según las banderas condicionales', () => {
    component.rubroTransporteFerrovariostate = {
      pip: 'Si',
      oea: 'Si',
      otosProgramas: 'No',
      customsTradePartnership: 'Si',
    } as any;

    component.asignarValorCondicional();

    expect(component.mostarCustomtemplate2).toBe(true);
    expect(component.mostarCustomtemplate3).toBe(true);
    expect(component.mostarCustomtemplate4).toBe(true);
    expect(component.mostarCustomtemplate5).toBe(false);
  });

  it('debería llamar a setDynamicFieldValue cuando se activa establecerCambioDeValor', () => {
    const spy = jest.spyOn(mockStore, 'setDynamicFieldValue');
    component.establecerCambioDeValor({ campo: 'pip', valor: 'Si' });
    expect(spy).toHaveBeenCalledWith('pip', 'Si');
    expect(component.mostarCustomtemplate3).toBe(true);
  });


  it('debería actualizar el input de texto en otrasCertificaciones y llamar a setDynamicFieldValue', () => {
    component.addOtrasCertificacionesGroup();
    const inputEvent = { target: { value: 'CERT1' } } as any;

    component.textValorCambio(inputEvent, 'nombre', 0);

    const grupo = component.otrasCertificaciones.at(0);
    expect(grupo.get('nombre')?.value).toBe('CERT1');
    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledWith(
      'otrasCertificaciones',
      expect.any(Array)
    );
  });

  it('debería limpiar las suscripciones al destruir', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
