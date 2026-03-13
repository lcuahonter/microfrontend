import { TestBed } from '@angular/core/testing';
import { Chofer40103Query } from './chofer40103.query';
import { Chofer40103Store } from './chofer40103.store';
import { Choferesnacionales40103State } from './chofer40103.store';
import { of } from 'rxjs';

describe('Chofer40103Query', () => {
  let query: Chofer40103Query;
  let store: Chofer40103Store;

  const initialState: Choferesnacionales40103State = {
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
      providers: [Chofer40103Query, Chofer40103Store]
    });
    store = TestBed.inject(Chofer40103Store);
    query = TestBed.inject(Chofer40103Query);
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