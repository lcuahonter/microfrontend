import { Chofer40102Store, createChoferState, Choferesnacionales40102State } from './chofer40102.store';
import { DatosDelChoferNacional, ChoferesExtranjeros } from '../models/registro-muestras-mercancias.model';
import { Catalogo } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';

describe('Chofer40102Store', () => {
  let store: Chofer40102Store;

  beforeEach(() => {
    store = new Chofer40102Store();
  });

  it('should create the store with initial state', () => {
    expect(store).toBeTruthy();
    expect(store.getValue()).toEqual(createChoferState());
  });

  it('should set primer apellido', () => {
    store.setPrimerApellido('García');
    expect(store.getValue().primerApellido).toBe('García');
  });

  it('should set segundo apellido', () => {
    store.setSegundoApellido('López');
    expect(store.getValue().segundoApellido).toBe('López');
  });

  it('should set nombre', () => {
    store.setNombre('Juan');
    expect(store.getValue().nombre).toBe('Juan');
  });

  it('should set datosDelChoferNacionalAlta', () => {
    const datos: DatosDelChoferNacional[] = [{ nombre: 'Juan' } as any];
    store.update((state) => ({ ...state, datosDelChoferNacionalAlta: datos }));
    expect(store.getValue().datosDelChoferNacionalAlta).toEqual(datos);
  });

  it('should set datosDelChoferExtranjerosAlta', () => {
    const datos: ChoferesExtranjeros[] = [{ nombre: 'Pedro' } as any];
    store.update((state) => ({ ...state, datosDelChoferExtranjerosAlta: datos }));
    expect(store.getValue().datosDelChoferExtranjerosAlta).toEqual(datos);
  });

  it('should clear choferes (reset state)', () => {
    store.setPrimerApellido('García');
    store.clearChoferes();
    expect(store.getValue()).toEqual(createChoferState());
  });

});