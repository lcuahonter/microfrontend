import { ChangeDetectorRef } from '@angular/core';
import { ModificarAgenteComponent } from './modificar-agente.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
let cdrMock: Partial<ChangeDetectorRef>;

describe('ModificarAgenteComponent', () => {
  let component: ModificarAgenteComponent;
  let tramite30505StoreMock: any;
  let tercerosServiceMock: any;
  let locationMock: any;

  beforeEach(() => {
    cdrMock = {
      detectChanges: jest.fn(), 
    };
    tramite30505StoreMock = {
      updateAgenteDatos: jest.fn(),
      setTipoFigura: jest.fn(),
      detectChanges: jest.fn(), 

    };
    tercerosServiceMock = {
      agente$: of([
        {
          tipoFigura: '1',
          patenteModificada: 'PM',
          numPatenteModal: '1234',
          rfcModal: 'RFCMOD',
          obligFisc: true,
          autPantente: true,
          nombre: 'NOMBRE',
          apellidoPaterno: 'PATERNO',
          apellidoMaterno: 'MATERNO',
          razonSocial: 'RAZON',
          patente2: 'P2',
          razonAgencia: 'AGENCIA'
        }
      ])
    };
    locationMock = { back: jest.fn() };
    component = new ModificarAgenteComponent(
      new FormBuilder(),
      tramite30505StoreMock,
      tercerosServiceMock,
      locationMock,
      { markForCheck: jest.fn() } as any 
      
    );
    component.selectedAgente = {
      tipoFigura: '1',
      patenteModificada: 'PM',
      numPatenteModal: '1234',
      rfcModal: 'RFCMOD',
      obligFisc: true,
      autPantente: true,
      nombre: 'NOMBRE',
      apellidoPaterno: 'PATERNO',
      apellidoMaterno: 'MATERNO',
      razonSocial: 'RAZON',
      patente2: 'P2',
      razonAgencia: 'AGENCIA'
    } as any;
  });

  it('should initialize form with selectedAgente on crearFormulario', () => {
    component.crearFormulario();
    expect(component.datosTramite).toBeDefined();
    expect(component.datosTramite.get('tipoFigura')?.value).toBe('1');
  });
 

  it('should set mostrarAgente and mostrarAgencia on onSelectFigura', () => {
    component.onSelectFigura({ target: { value: '1' } } as any);
    expect(component.mostrarAgente).toBe(true);
    expect(component.mostrarAgencia).toBe(false);

    component.onSelectFigura({ target: { value: '3' } } as any);
    expect(component.mostrarAgente).toBe(false);
    expect(component.mostrarAgencia).toBe(true);
  });

  it('should reset form and hide sections on limpiarSociedadesScc', () => {
    component.crearFormulario();
    component.mostrarAgente = true;
    component.mostrarAgencia = true;
    component.limpiarSociedadesScc();
    expect(component.datosTramite.pristine).toBe(true);
    expect(component.mostrarAgente).toBe(false);
    expect(component.mostrarAgencia).toBe(false);
  });

  it('should reset form and call back on cerrarDialogoSociedadesScc', () => {
    component.crearFormulario();
    component.cerrarDialogoSociedadesScc();
    expect(locationMock.back).toHaveBeenCalled();
  });

  it('should call store method in setValoresStore', () => {
    component.crearFormulario();
    component.datosTramite.get('tipoFigura')?.setValue('2');
    component.setValoresStore(component.datosTramite, 'tipoFigura', 'setTipoFigura');
    expect(tramite30505StoreMock.setTipoFigura).toHaveBeenCalledWith('2');
  });

  it('should add AgenteDatos, update store, reset form, and call back on aceptarSociedadesScc', () => {
    component.crearFormulario();
    component.datosTramite.patchValue({
      tipoFigura: '1',
      patenteModificada: 'PM',
      numPatenteModal: '1234',
      rfcModal: 'RFCMOD',
      obligFisc: true,
      autPantente: true,
      nombre: 'NOMBRE',
      apellidoPaterno: 'PATERNO',
      apellidoMaterno: 'MATERNO',
      razonSocial: 'RAZON',
      patente2: 'P2',
      razonAgencia: 'AGENCIA'
    });
    component.agenteDatos = [];
    component.aceptarSociedadesScc();
    expect(component.agenteDatos.length).toBe(1);
    expect(tramite30505StoreMock.updateAgenteDatos).toHaveBeenCalledWith(component.agenteDatos);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
