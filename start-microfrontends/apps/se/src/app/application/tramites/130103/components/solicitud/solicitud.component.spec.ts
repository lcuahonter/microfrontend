import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ImportacionDefinitivaService } from '../../services/importacion-definitiva.service';
import { Tramite130103Store } from '../../../../estados/tramites/tramite130103.store';
import { Tramite130103Query } from '../../../../estados/queries/tramite130103.query';
import { HttpClient } from '@angular/common/http';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { PartidasDeLaMercanciaComponent } from '../../../../shared/components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';

 
describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let importacionDefinitivaService: any;
  let tramite130105Store: any;
  let tramite130105Query: any;
  let consultaioQuery: any;
  let fb: FormBuilder;
  let http: any;

  beforeEach(() => {
    importacionDefinitivaService = {
      buscarDatosPost: jest.fn().mockReturnValue(of({ datos: { requisitos: '' } })),
      getRegimenCatalogo: jest.fn().mockReturnValue(of([])),
      getUnidadMedidaCatalogo: jest.fn().mockReturnValue(of([])),
      getFraccionDivisionesCatalogo: jest.fn().mockReturnValue(of([])),
      getEsquemaReglaCatalogo: jest.fn().mockReturnValue(of([])),
      getClasificacionRegimenCatalogo: jest.fn().mockReturnValue(of([])),
      getFraccionCatalogoService: jest.fn().mockReturnValue(of([])),
      getEntidadesFederativasCatalogo: jest.fn().mockReturnValue(of([])),
      getBloqueService: jest.fn().mockReturnValue(of([])),
      getPaisesPorBloqueService: jest.fn().mockReturnValue(of([])),
      getRepresentacionFederalCatalogo: jest.fn().mockReturnValue(of([])),
      getTodosPaisesSeleccionados: jest.fn().mockReturnValue(of([])),
      getFraccionDescripcionPartidasDeLaMercanciaService: jest.fn().mockReturnValue(of([])),
      getMostrarPartidasService: jest.fn().mockReturnValue(of({ codigo: '00', datos: [] }))
    };
    tramite130105Store = { actualizarEstado: jest.fn() };
    tramite130105Query = {
      mostrarTabla$: of(false),
      selectSolicitud$: of({ tableBodyData: [], defaultSelect: '', regimen: '', clasificacion: '', producto: '', descripcion: '', fraccion: '', cantidad: '', valorFacturaUSD: '', unidadesMedida:'', bloque: '', usoEspecifico: '', justificacionImportacionExportacion: '', observaciones: '', entidad: '', representacion: '', modificarPartidasDelaMercanciaForm: {}, cantidadTotal: '', valorTotalUSD: '', fechasSeleccionadas: [], idSolicitud: 0 }),
    };
    consultaioQuery = { selectConsultaioState$: of({ readonly: false }) };
    fb = new FormBuilder();
    http = {};
    component = new SolicitudComponent(
      fb,
      http as HttpClient,
      tramite130105Store as Tramite130103Store,
      tramite130105Query as Tramite130103Query,
      importacionDefinitivaService as ImportacionDefinitivaService,
      consultaioQuery as ConsultaioQuery
    );
    component.criterioDictamenForm = fb.group({ criterioDictamen: [''] });
    component.partidasDelaMercanciaForm = fb.group({ fraccionTigiePartidasDeLaMercancia: [''], cantidadPartidasDeLaMercancia: [''], valorPartidaUSDPartidasDeLaMercancia: [''], descripcionPartidasDeLaMercancia: [''] });
    component.mercanciaForm = fb.group({ cantidad: [''], valorFacturaUSD: [''], fraccion: [''] });
    component.formDelTramite = fb.group({ regimen: [''] });
    component.frmRepresentacionForm = fb.group({ entidad: [''] });
    component.paisForm = fb.group({});
    component.modificarPartidasDelaMercanciaForm = fb.group({});
    component.formForTotalCount = fb.group({ cantidadTotal: [''], valorTotalUSD: [''] });
    component.tableBodyData = [];
    component.unidadCatalogo = [];
    component.seccionState = {
      idSolicitud: 0,
      producto: '',
      descripcion: '',
      fraccion: '',
      cantidad: '',
      valorPartidaUSD: '',
      unidadMedida: '',
      solicitud: '',
      defaultSelect: '',
      defaultProducto: '',
      regimen: '',
      clasificacion: '',
      filaSeleccionada: [],
      cantidadPartidasDeLaMercancia: '1',
      fraccionTigiePartidasDeLaMercancia: 'clave',
      fraccionDescripcionPartidasDeLaMercancia: 'desc',
      valorPartidaUSDPartidasDeLaMercancia: '2',
      descripcionPartidasDeLaMercancia: 'desc',
      valorFacturaUSD: '',
      bloque: '',
      usoEspecifico: '',
      justificacionImportacionExportacion: '',
      observaciones: '',
      entidad: '',
      representacion: '',
      mostrarTabla: false,
      mostrarPartidas: [],
      modificarPartidasDelaMercanciaForm: {
        cantidadPartidasDeLaMercancia: '1',
        valorPartidaUSDPartidasDeLaMercancia: '2',
        descripcionPartidasDeLaMercancia: 'desc',
        fraccionTigiePartidasDeLaMercancia: 'clave',
        fraccionDescripcionPartidasDeLaMercancia: 'desc'
      },
      cantidadTotal: '',
      valorTotalUSD: '',
      fechasSeleccionadas: [],
      tableBodyData: [],
      unidadesMedida: '',
      fraccionArancelariaProsec: '',
      mercanciaEsquema: '',
      criterioDictamen: '',
      descripcionFraccionProsec: ''
    };
    component.filaSeleccionada = [];
    component.partidasDeLaMercanciaComponent = { abrirCargarArchivoModalReal: jest.fn() } as any;
  });

  it('should call buscarDatosPost and set criterioDictamen on success', () => {
    const response = { datos: { requisitos: 'test' } };
    importacionDefinitivaService.buscarDatosPost.mockReturnValue(of(response));
    const spySetValoresStore = jest.spyOn(component, 'setValoresStore');
    component.criterioDictamenForm.get('criterioDictamen')?.setValue('');
    component.processBuscarMercancia({});
    expect(importacionDefinitivaService.buscarDatosPost).toHaveBeenCalled();
    expect(component.criterioDictamenForm.get('criterioDictamen')?.value).toBe('test');
    expect(spySetValoresStore).toHaveBeenCalled();
  });

  it('should handle error in processBuscarMercancia', () => {
    importacionDefinitivaService.buscarDatosPost.mockReturnValue(throwError(() => new Error('error')));
    component.criterioDictamenForm.get('criterioDictamen')?.setValue('init');
    component.processBuscarMercancia({});
    expect(component.criterioDictamenForm.get('criterioDictamen')?.value).toBe('');
  });

  it('should call processBuscarMercancia in onMercanciaEsquemaChange with value', () => {
     importacionDefinitivaService.buscarDatosPost.mockReturnValue(of({ datos: { requisitos: 'test' } }));
     const spy = jest.spyOn(component, 'processBuscarMercancia');
     component.onMercanciaEsquemaChange({ fraccionArancelariaTIGIE_clave: 'clave', clave: 1 });
     expect(spy).toHaveBeenCalled();
  });

  it('should clear criterioDictamen in onMercanciaEsquemaChange with no value', () => {
    component.criterioDictamenForm.get('criterioDictamen')?.setValue('init');
    component.onMercanciaEsquemaChange(null);
    expect(component.criterioDictamenForm.get('criterioDictamen')?.value).toBe('');
  });

  it('should validateFormulario and mark forms as touched', () => {
    component.formDelTramite = fb.group({ solicitud: [''], regimen: [''], clasificacion: [''] });
    component.mercanciaForm = fb.group({ producto: [''], unidadesMedida: [''], descripcion: [''], fraccion: [''], cantidad: [''], valorFacturaUSD: [''] });
    component.paisForm = fb.group({ bloque: [''], usoEspecifico: [''], justificacionImportacionExportacion: [''], observaciones: [''] });
    component.frmRepresentacionForm = fb.group({ entidad: [''], representacion: [''] });
    component.tableBodyData = [];
    const valid = component.validarFormulario();
    expect(valid).toBe(false);
    expect(component.isInvalidaPartidas).toBe(true);
  });

  it('should handle manejarlaFilaSeleccionada', () => {
    const filas = [{ id: 1 }];
    component.manejarlaFilaSeleccionada(filas as any);
    expect(component.filaSeleccionada).toEqual(filas);
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should validateYEnviarFormulario and update state', () => {
    component.partidasDelaMercanciaForm = fb.group({ cantidadPartidasDeLaMercancia: ['1'], descripcionPartidasDeLaMercancia: ['desc'], valorPartidaUSDPartidasDeLaMercancia: ['2'], fraccionTigiePartidasDeLaMercancia: ['clave'], fraccionDescripcionPartidasDeLaMercancia: ['desc'] });
    component.seccionState = {
  idSolicitud: 0,
  producto: '',
  descripcion: '',
  fraccion: '',
  cantidad: '',
  valorPartidaUSD: '',
  unidadMedida: '',
  solicitud: '',
  defaultSelect: '',
  defaultProducto: '',
  regimen: '',
  clasificacion: '',
  filaSeleccionada: [],
  cantidadPartidasDeLaMercancia: '1',
  fraccionTigiePartidasDeLaMercancia: 'clave',
  fraccionDescripcionPartidasDeLaMercancia: 'desc',
  valorPartidaUSDPartidasDeLaMercancia: '2',
  descripcionPartidasDeLaMercancia: 'desc',
  valorFacturaUSD: '',
  bloque: '',
  usoEspecifico: '',
  justificacionImportacionExportacion: '',
  observaciones: '',
  entidad: '',
  representacion: '',
  mostrarTabla: false,
  mostrarPartidas: [],
  modificarPartidasDelaMercanciaForm: {
    cantidadPartidasDeLaMercancia: '1',
    valorPartidaUSDPartidasDeLaMercancia: '2',
    descripcionPartidasDeLaMercancia: 'desc',
    fraccionTigiePartidasDeLaMercancia: 'clave',
    fraccionDescripcionPartidasDeLaMercancia: 'desc'
  },
  cantidadTotal: '',
  valorTotalUSD: '',
  fechasSeleccionadas: [],
  tableBodyData: [],
  unidadesMedida: '',
  fraccionArancelariaProsec: '',
  mercanciaEsquema: '',
  criterioDictamen: '',
  descripcionFraccionProsec: ''
};
    component.unidadCatalogo = [{  id: 1, clave: '', descripcion: '' }];
    component.tableBodyData = [];
    component.formForTotalCount = fb.group({ cantidadTotal: [''], valorTotalUSD: [''] });
    component.mostrarTabla = false;
    component.validarYEnviarFormulario();
    expect(component.mostrarTabla).toBe(true);
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should handle navegarParaModificarPartida', () => {
    component.filaSeleccionada = [{ id: 1 } as any];
    component.navegarParaModificarPartida();
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should call getPaisesPorBloque in enCambioDeBloque', () => {
    const spy = jest.spyOn(component, 'getPaisesPorBloque');
    component.enCambioDeBloque(1);
    expect(spy).toHaveBeenCalledWith('1');
  });

it('should call getClasificacionRegimenCatalogo in setValoresStore for regimen', () => {
  importacionDefinitivaService.getClasificacionRegimenCatalogo.mockReturnValue(of([]));
  const spy = jest.spyOn(component, 'getClasificacionRegimenCatalogo');
  component.formDelTramite = fb.group({ regimen: ['test'] });
  component.setValoresStore({ form: component.formDelTramite, campo: 'regimen' });
  expect(spy).toHaveBeenCalledWith('test');
});

  it('should call getRepresentacionFederalCatalogo in setValoresStore for entidad', () => {
    const spy = jest.spyOn(component, 'getRepresentacionFederalCatalogo');
    component.frmRepresentacionForm = fb.group({ entidad: ['ent'] });
    component.setValoresStore({ form: component.frmRepresentacionForm, campo: 'entidad' });
    expect(spy).toHaveBeenCalledWith('ent');
  });

  it('should call getFraccionDescripcionPartidasDeLaMercancia in setValoresStore for fraccionTigiePartidasDeLaMercancia', () => {
    const spy = jest.spyOn(component, 'getFraccionDescripcionPartidasDeLaMercancia');
    component.partidasDelaMercanciaForm = fb.group({ fraccionTigiePartidasDeLaMercancia: ['clave'] });
    component.setValoresStore({ form: component.partidasDelaMercanciaForm, campo: 'fraccionTigiePartidasDeLaMercancia' });
    expect(spy).toHaveBeenCalledWith('clave');
  });

  it('should disable modificar if no filaSeleccionada', () => {
    component.filaSeleccionada = [];
    expect(component.disabledModificar()).toBe(true);
  });

  it('should patch modificarPartidasDelaMercanciaForm in modificarPartidaSeleccionada', () => {
    const evento = { fraccionFrancelaria: 'clave', cantidad: '1', totalUSD: '2', descripcion: 'desc' } as any;
    const spy = jest.spyOn(component, 'getFraccionAllDatos');
    component.modificarPartidasDelaMercanciaForm = fb.group({ cantidadPartidasDeLaMercancia: [''], valorPartidaUSDPartidasDeLaMercancia: [''], descripcionPartidasDeLaMercancia: [''], fraccionModificationPartidasDeLaMercancia: [''] });
    component.modificarPartidaSeleccionada(evento);
    expect(spy).toHaveBeenCalledWith('clave');
    expect(component.modificarPartidasDelaMercanciaForm.get('cantidadPartidasDeLaMercancia')?.value).toBe('1');
  });

  it('should update tableBodyData in partidaModificada', () => {
    component.tableBodyData = [{ id: 1, cantidad: '1', totalUSD: '2', precioUnitarioUSD: '3', descripcion: 'desc' } as any];
    const evento = { id: 1, cantidad: '2', totalUSD: '4', precioUnitarioUSD: '5', descripcion: 'desc2' } as any;
    component.formForTotalCount = fb.group({ cantidadTotal: [''], valorTotalUSD: [''] });
    component.partidaModificada(evento);
    expect(component.tableBodyData[0].cantidad).toBe('2');
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should remove items in partidasEliminadas', () => {
    component.tableBodyData = [{ id: 1, cantidad: '1', totalUSD: '2' } as any, { id: 2, cantidad: '2', totalUSD: '3' } as any];
    component.formForTotalCount = fb.group({ cantidadTotal: [''], valorTotalUSD: [''] });
    component.partidasEliminadas(['1']);
    expect(component.tableBodyData.length).toBe(1);
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should show notificacion if fraccion is missing in validarYCargarArchivo', () => {
    component.mercanciaForm = fb.group({ cantidad: ['1'], valorFacturaUSD: ['1'], fraccion: [''] });
    component.mostrarErroresMercancia = false;
    component.mostrarErroresPartidas = false;
    component.validarYCargarArchivo();
    expect(component.mostrarNotificacion).toBe(true);
  });

  it('should call abrirCargarArchivoModalReal in validarYCargarArchivo', () => {
    component.mercanciaForm = fb.group({ cantidad: ['1'], valorFacturaUSD: ['1'], fraccion: ['1'] });
    component.mostrarErroresMercancia = false;
    component.mostrarErroresPartidas = false;
    component.validarYCargarArchivo();
    expect(component.partidasDeLaMercanciaComponent.abrirCargarArchivoModalReal).toHaveBeenCalled();
  });

  it('should call getRegimenCatalogo', () => {
    importacionDefinitivaService.getRegimenCatalogo.mockReturnValue(of([]));
    component.catalogosArray = [[], []];
    component.getRegimenCatalogo();
    expect(importacionDefinitivaService.getRegimenCatalogo).toHaveBeenCalled();
  });

  it('should call getUnidadMedidaCatalogo', () => {
    importacionDefinitivaService.getUnidadMedidaCatalogo.mockReturnValue(of([]));
    component.unidadMedidaCatalogo = [];
    component.getUnidadMedidaCatalogo();
    expect(importacionDefinitivaService.getUnidadMedidaCatalogo).toHaveBeenCalled();
  });

  it('should call getFraccionDivisionesCatalogo', () => {
    importacionDefinitivaService.getFraccionDivisionesCatalogo.mockReturnValue(of([]));
    component.catalogosProsec = [];
    component.getFraccionDivisionesCatalogo();
    expect(importacionDefinitivaService.getFraccionDivisionesCatalogo).toHaveBeenCalled();
  });

  it('should call getEsquemaReglaCatalogo', () => {
    importacionDefinitivaService.getEsquemaReglaCatalogo.mockReturnValue(of([]));
    component.esquemaRegla = [];
    component.getEsquemaReglaCatalogo();
    expect(importacionDefinitivaService.getEsquemaReglaCatalogo).toHaveBeenCalled();
  });

  it('should call getClasificacionRegimenCatalogo', () => {
    importacionDefinitivaService.getClasificacionRegimenCatalogo.mockReturnValue(of([]));
    component.catalogosArray = [[], []];
    component.getClasificacionRegimenCatalogo('test');
    expect(importacionDefinitivaService.getClasificacionRegimenCatalogo).toHaveBeenCalledWith('test');
  });

  it('should call getFraccionCatalogo', () => {
    importacionDefinitivaService.getFraccionCatalogoService.mockReturnValue(of([{ clave: '1', descripcion: 'desc' }]));
    component.fraccionCatalogo = [];
    component.getFraccionCatalogo();
    expect(importacionDefinitivaService.getFraccionCatalogoService).toHaveBeenCalled();
    expect(component.fraccionCatalogo[0].descripcion).toContain('1 - desc');
  });

  it('should call getBloque', () => {
    importacionDefinitivaService.getBloqueService.mockReturnValue(of([]));
    component.elementosDeBloque = [];
    component.getBloque();
    expect(importacionDefinitivaService.getBloqueService).toHaveBeenCalled();
  });

  it('should call getPaisesPorBloque', () => {
    importacionDefinitivaService.getPaisesPorBloqueService.mockReturnValue(of([]));
    component.paisesPorBloque = [];
    component.getPaisesPorBloque('1');
    expect(importacionDefinitivaService.getPaisesPorBloqueService).toHaveBeenCalledWith(component.idProcedimiento.toString(), '1');
  });

  it('should call getEntidadesFederativasCatalogo', () => {
    importacionDefinitivaService.getEntidadesFederativasCatalogo.mockReturnValue(of([]));
    component.entidadFederativa = [];
    component.getEntidadesFederativasCatalogo();
    expect(importacionDefinitivaService.getEntidadesFederativasCatalogo).toHaveBeenCalled();
  });

  it('should call getRepresentacionFederalCatalogo', () => {
    importacionDefinitivaService.getRepresentacionFederalCatalogo.mockReturnValue(of([]));
    component.representacionFederal = [];
    component.getRepresentacionFederalCatalogo('ent');
    expect(importacionDefinitivaService.getRepresentacionFederalCatalogo).toHaveBeenCalledWith(component.idProcedimiento.toString(), 'ent');
  });

  it('should call getTodosPaisesSeleccionados in todosPaisesSeleccionados', () => {
    importacionDefinitivaService.getTodosPaisesSeleccionados.mockReturnValue(of([]));
    component.paisesPorBloque = [];
    component.todosPaisesSeleccionados(true);
    expect(importacionDefinitivaService.getTodosPaisesSeleccionados).toHaveBeenCalledWith(component.idProcedimiento.toString());
  });

  it('should call getFraccionDescripcionPartidasDeLaMercancia', () => {
    importacionDefinitivaService.getFraccionDescripcionPartidasDeLaMercanciaService.mockReturnValue(of([]));
    component.fraccionDescripcionPartidasDeLaMercancia = [];
    component.getFraccionDescripcionPartidasDeLaMercancia('clave');
    expect(importacionDefinitivaService.getFraccionDescripcionPartidasDeLaMercanciaService).toHaveBeenCalledWith(component.idProcedimiento.toString(), 'clave');
  });

  it('should call getFraccionAllDatos', () => {
    importacionDefinitivaService.getFraccionDescripcionPartidasDeLaMercanciaService.mockReturnValue(of([]));
    component.fraccionModificationPartidasDeLaMercancia = [];
    component.getFraccionAllDatos('clave');
    expect(importacionDefinitivaService.getFraccionDescripcionPartidasDeLaMercanciaService).toHaveBeenCalledWith(component.idProcedimiento.toString(), 'clave');
  });

  it('should call getMostrarPartidas and update state', () => {
    importacionDefinitivaService.getMostrarPartidasService.mockReturnValue(of({ codigo: '00', datos: [{ candidatoEliminar: 1, unidadMedidaDescripcion: 'desc', fraccionClave: 'clave', descripcionOriginal: 'desc', importeUnitarioUSD: '1', importeTotalUSD: '2', fraccionDescripcion: 'desc' }] }));
    component.seccionState = { idSolicitud: 1 } as any;
    component.mostrarPartidas = [];
    component.getMostrarPartidas();
    expect(importacionDefinitivaService.getMostrarPartidasService).toHaveBeenCalledWith(1);
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalled();
  });

  it('should call fechasSeleccionadas and update state', () => {
    const evento = ['2022-01-01'];
    component.fechasSeleccionadas(evento);
    expect(tramite130105Store.actualizarEstado).toHaveBeenCalledWith({ fechasSeleccionadas: evento });
  });

  it('should calculateImporteUnitario', () => {
    expect(component.calcularImporteUnitario('2', '6')).toBe('3.000');
    expect(component.calcularImporteUnitario('0', '6')).toBe('0');
  });

  it('should call ngOnDestroy and complete destroyed$', () => {
    const spy = jest.spyOn(component['destroyed$'], 'next');
    const spy2 = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});