import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { Tramite240305Query } from '../../estados/tramite240305Query.query';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { Subject, of } from 'rxjs';

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let tramite240305Query: Tramite240305Query;
  let tramite240305Store: Tramite240305Store;
  let consultaQuery: ConsultaioQuery;

  beforeEach(() => {
    tramite240305Query = {
      getPagoDerechos$: of({} as PagoDerechosFormState),
    } as unknown as Tramite240305Query;

    tramite240305Store = {
      updatePagoDerechosFormState: jest.fn(),
    } as unknown as Tramite240305Store;

    consultaQuery = {
      selectConsultaioState$: of({ readonly: true }),
    } as unknown as ConsultaioQuery;

    component = new PagoDeDerechosContenedoraComponent(
      tramite240305Query,
      tramite240305Store,
      consultaQuery
    );
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar y establecer pagoDerechoFormState', () => {
    component.ngOnInit();
    expect(component.pagoDerechoFormState).toBeDefined();
  });

  it('Debería actualizar el estado de esFormularioSoloLectura', () => {
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('Debería actualizar pagoDerechos en la tienda', () => {
    const mockData: PagoDerechosFormState = {
      claveReferencia: 'testClaveReferencia',
      cadenaDependencia: 'testCadenaDependencia',
      banco: 'testBanco',
      llavePago: 'testLlavePago',
      fechaPago: '2024-01-01',
      importePago: '1000'
    };
    component.updatePagoDerechos(mockData);
    expect(tramite240305Store.updatePagoDerechosFormState).toHaveBeenCalledWith(mockData);
  });

  it('Deberían limpiar las suscripciones en Destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['unsubscribe$'], 'next');
    const completeSpy = jest.spyOn(component['unsubscribe$'], 'complete');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
