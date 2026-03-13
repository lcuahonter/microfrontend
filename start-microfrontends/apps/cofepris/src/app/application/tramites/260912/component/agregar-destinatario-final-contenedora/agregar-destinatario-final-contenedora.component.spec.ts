import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite260912Store } from '../../estados/tramite-260912.store';
import { ID_PROCEDIMIENTO } from '../../enums/domicilio-del-establecimiento.enum';
import { Destinatario } from '../../../../shared/models/terceros-relacionados.model';

jest.mock('../../estados/tramite-260912.store');

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let tramiteStoreMock: jest.Mocked<Tramite260912Store>;
  let component: AgregarDestinatarioFinalContenedoraComponent;

  beforeEach(() => {
    tramiteStoreMock = {
      updateDestinatarioFinalTablaDatos: jest.fn(),
    } as any;
    component = new AgregarDestinatarioFinalContenedoraComponent(tramiteStoreMock);
    component.idProcedimiento = ID_PROCEDIMIENTO;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set idProcedimiento to ID_PROCEDIMIENTO', () => {
    expect(component.idProcedimiento).toBe(ID_PROCEDIMIENTO);
  });
});