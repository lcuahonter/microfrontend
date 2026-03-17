import { DatosDelChoferNacional, ChoferesExtranjeros, PagoDerechosLista, Vehiculo, Chofer, DirectorGeneralData } from './registro-muestras-mercancias.model';

describe('Model Interfaces', () => {
  it('should create a DatosDelChoferNacional object with required fields', () => {
    const chofer: DatosDelChoferNacional = {
      id: 1,
      telefono: '5551234567',
      correoElectronico: 'test@email.com',
    };
    expect(chofer.telefono).toBe('5551234567');
    expect(chofer.correoElectronico).toBe('test@email.com');
  });

  it('should create a ChoferesExtranjeros object with optional fields', () => {
    const chofer: ChoferesExtranjeros = {
      numero: 'CHE001',
      primerApellido: 'Smith',
      nacionalidad: 'USA',
      correoElectronico: 'john.smith@email.com',
      telefono: '+1-555-123-4567',
    };
    expect(chofer.numero).toBe('CHE001');
    expect(chofer.nacionalidad).toBe('USA');
  });

  it('should create a PagoDerechosLista object with mixed fields', () => {
    const pago: PagoDerechosLista = {
      numero: 'PAG001',
      calle: 'Av. Principal',
      estado: 'CDMX',
      pais: 'México',
      apellidoPaterno: 'García',
      rfc: 'GALO850315ABC',
      vigenciaGafete: '2025-12-31',
    };
    expect(pago.numero).toBe('PAG001');
    expect(pago.estado).toBe('CDMX');
  });

  it('should create a Vehiculo object with required fields', () => {
    const vehiculo: Vehiculo = {
      id: 1,
      solicitudVehiculoVin2: 'VIN123',
      solicitudVehiculoTipoVehiculo: 'Tractor',
      solicitudVehiculoNumeroEconomico: 'ECO001',
      solicitudVehiculoNumeroPlacas: 'ABC-123',
      solicitudVehiculoPaisEmisor: 'México',
      solicitudDomicilioEstado: 'Nuevo León',
      solicitudVehiculoMarca: 'Volvo',
      solicitudVehiculoModelo: 'VNL',
      anioVehiculoVEH: '2023',
      solicitudVehiculoTransponder: 'TRP001',
      solicitudVehiculoColor: 'Blanco',
    };
    expect(vehiculo.id).toBe(1);
    expect(vehiculo.solicitudVehiculoVin2).toBe('VIN123');
  });

  it('should create a Chofer object with required and optional fields', () => {
    const chofer: Chofer = {
      descripcion: 'Chofer Nacional',
      clave: 'CHN001',
      id: 1,
      curp: 'CURP123',
      rfc: 'RFC123',
      nombre: 'Carlos',
      apellidoPaterno: 'Pérez',
      apellidoMaterno: 'Martínez',
      telefono: '5551234567',
      correo: 'carlos@email.com',
    };
    expect(chofer.descripcion).toBe('Chofer Nacional');
    expect(chofer.clave).toBe('CHN001');
    expect(chofer.telefono).toBe('5551234567');
  });

  it('should create a DirectorGeneralData object', () => {
    const director: DirectorGeneralData = {
      nombre: 'Juan',
      primerApellido: 'García',
      segundoApellido: 'López',
      apellidoPaterno: 'García',
      apellidoMaternoCHN: 'López',
    };
    expect(director.nombre).toBe('Juan');
    expect(director.apellidoMaternoCHN).toBe('López');
  });
});
