import { TestBed } from '@angular/core/testing';
import { Tramite230201Query } from './tramite230201.query';
import { Tramite230201Store, createInitialState } from './tramite230201.store';
import { Solicitud230201State } from './tramite230201.store';
import { DestinatarioConfiguracionItem } from '../enum/destinatario-tabla.enum';
import { DatosDetalle, DatosSolicitud } from '../models/datos-tramite.model';

describe('Tramite230201Query', () => {
  let query: Tramite230201Query;
  let store: Tramite230201Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Tramite230201Store, Tramite230201Query],
    });

    store = TestBed.inject(Tramite230201Store);
    query = TestBed.inject(Tramite230201Query);
  });

  it('should create the query', () => {
    expect(query).toBeTruthy();
  });

  it('should return the complete state using selectSolicitud$', (done) => {
    const mockState: Solicitud230201State = {
      ...createInitialState(),
      claveDeReferencia: 'REF123',
      banco: [{ id: 1, descripcion: 'BANCO' }],
    };

    store.update(mockState);

    query.selectSolicitud$.subscribe((state) => {
      expect(state).toEqual(mockState);
      done();
    });
  });
});

describe('Tramite230201Store', () => {
  let store: Tramite230201Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Tramite230201Store],
    });

    store = TestBed.inject(Tramite230201Store);
  });

  it('should create the store', () => {
    expect(store).toBeTruthy();
  });

  it('should update claveDeReferencia', () => {
    store.setClaveDeReferencia('REF123');
    expect(store._value().claveDeReferencia).toBe('REF123');
  });

  it('should update banco', () => {
    const bancoMock = [{ id: 1, descripcion: 'BANCO' }];
    store.setBanco(bancoMock);
    expect(store._value().banco).toEqual(bancoMock);
  });

  it('should update fechasSeleccionadas', () => {
    const fechas = ['2025-05-15', '2025-05-16'];
    store.setFechasSeleccionadas(fechas);
    expect(store._value().fechasSeleccionadas).toEqual(fechas);
  });

  it('should reset the store', () => {
    store.setClaveDeReferencia('REF123');
    store.reset();
    expect(store._value()).toEqual(createInitialState());
  });

  it('should update destinatarios', () => {
    const destinatarios: DestinatarioConfiguracionItem[] = [
      { nombre: 'John', apellidoPaterno: 'Doe', apellidoMaterno: 'Smith', razonSocial: 'Company A', pais: 12, paisStr: 'Mexico', ciudad: 'Ciudad de Mexico', domicilio: 'Calle 123', codigoPostal: 12345 },
      { nombre: 'Jane', apellidoPaterno: 'Doe', apellidoMaterno: 'Johnson', razonSocial: 'Company B', pais: 21, paisStr: 'United States', ciudad: 'New York', domicilio: 'Street 456', codigoPostal: 67890 },
    ];
    store.setDatosDestinatario(destinatarios);
    expect(store._value().destinatarios).toEqual(destinatarios);
  });

  it('should update datosSolicitud', () => {
    const datosSolicitud: DatosSolicitud[] = [
      { id: 1, fraccionArancelaria: 1234, cantidad: 10, cantidadLetra: 'Diez', descripcion: 'Descripción 1' },
      { id: 2, fraccionArancelaria: 5678, cantidad: 20, cantidadLetra: 'Veinte', descripcion: 'Descripción 2' },
    ];
    store.setDatosSolicitud(datosSolicitud);
    expect(store._value().datosSolicitud).toEqual(datosSolicitud);
  });

  it('should update datosDetalle', () => {
    const datosDetalle : DatosDetalle[] = [
      { id: 1, nombreCientifico: 'Test Cientifico', nombreComunDetalle: 'Nombre Comun 1', descripcion: 'Descripcion 1' },
      { id: 2, nombreCientifico: 'Test Cientifico 2', nombreComunDetalle: 'Nombre Comun 2', descripcion: 'Descripcion 2' },
    ];
    store.setDatosDetalle(datosDetalle);
    expect(store._value().datosDetalle).toEqual(datosDetalle);
  });

  it('should update fraccionArancelaria', () => {
    store.setFraccionArancelaria('1234');
    expect(store._value().fraccionArancelaria).toBe('1234');
  });

  it('should update descripcionFraccionArancelaria', () => {
    store.setDescripcionFraccionArancelaria('Test Description');
    expect(store._value().descripcionFraccionArancelaria).toBe('Test Description');
  });

  it('should update cantidad', () => {
    store.setCantidad('100');
    expect(store._value().cantidad).toBe('100');
  });

  it('should update cantidadLetra', () => {
    store.setCantidadLetra('Cien');
    expect(store._value().cantidadLetra).toBe('Cien');
  });

  it('should update genero', () => {
    const genero = [{ id: 1, descripcion: 'Genero 1' }];
    store.setGenero(genero);
    expect(store._value().genero).toEqual(genero);
  });

  it('should update especie', () => {
    const especie = [{ id: 1, descripcion: 'Especie 1' }];
    store.setEspecie(especie);
    expect(store._value().especie).toEqual(especie);
  });

  it('should update nombreComun', () => {
    const nombreComun = [{ id: 1, descripcion: 'Nombre Comun 1' }];
    store.setNombreComun(nombreComun);
    expect(store._value().nombreComun).toEqual(nombreComun);
  });

  it('should update unidadDeMedida', () => {
    const unidadDeMedida = [{ id: 1, descripcion: 'Unidad 1' }];
    store.setUnidadDeMedida(unidadDeMedida);
    expect(store._value().unidadDeMedida).toEqual(unidadDeMedida);
  });

  it('should update medioDeTransporte', () => {
    const medioDeTransporte = [{ id: 1, descripcion: 'Transporte 1' }];
    store.setMedioDeTransporte(medioDeTransporte);
    expect(store._value().medioDeTransporte).toEqual(medioDeTransporte);
  });
});