import { TestBed } from '@angular/core/testing';
import { Chofer40102Query } from './chofer40102.query';
import { Chofer40102Store } from './chofer40102.store';
import { Choferesnacionales40102State } from './chofer40102.store';
import { of } from 'rxjs';

describe('Chofer40102Query', () => {
  let query: Chofer40102Query;
  let store: Chofer40102Store;

  const initialState: Choferesnacionales40102State = {
    datosDelChoferNacionalAlta: [
      { nombre: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'García', curp: 'ABCD123456HDFLRS09' }
    ],
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    datosDelChoferNacionalModification: [],
    datosDelChoferNacionalRetirada: [],
    
    datosDelChoferExtranjerosAlta: [],
    datosDelChoferExtranjerosModification: [],
    datosDelChoferExtranjerosRetirada: []
    // ...otros campos del estado según definición...
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Chofer40102Query, Chofer40102Store]
    });
    store = TestBed.inject(Chofer40102Store);
    query = TestBed.inject(Chofer40102Query);
    store.update(() => initialState);
  });

  it('should be created', () => {
    expect(query).toBeTruthy();
  });

  it('should select the full solicitud state', (done) => {

    query.selectSolicitud$.subscribe(state => {
      expect(state).toEqual(initialState);
      done();
    });
  });

  it('should select the full seccion state', (done) => {
    query.selectSeccionState$.subscribe(state => {
      expect(state).toEqual(initialState);
      done();
    });
  });

  it('should select datosDelChoferNacionalAlta', (done) => {
    query.getdatosDelChoferNacional$.subscribe(lista => {
      expect(lista).toEqual(initialState.datosDelChoferNacionalAlta);
      done();
    });
  });
});