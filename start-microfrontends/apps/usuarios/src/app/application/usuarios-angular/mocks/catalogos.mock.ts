import { Dependencia, Rol, UnidadAdministrativa } from '../core/models/rol.model';
import { Tramite } from '../core/models/tramite.model';

export const ROLES_MOCK: Rol[] = [
  { id: 1, clave: 'OP_GEN', nombre: 'Operativo General', descripcion: 'Operaciones generales de comercio exterior', tipoRol: 'OPERATIVO', activo: true },
  { id: 2, clave: 'AUT_GEN', nombre: 'Autorizador General', descripcion: 'Autoriza trámites de comercio exterior', tipoRol: 'AUTORIZADOR', activo: true },
  { id: 3, clave: 'ADMIN', nombre: 'Administrador', descripcion: 'Administración del sistema VUCEM', tipoRol: 'ADMINISTRADOR', activo: true },
  { id: 4, clave: 'FUNC', nombre: 'Funcionario', descripcion: 'Funcionario de gobierno', tipoRol: 'FUNCIONARIO', activo: true },
  { id: 5, clave: 'OP_IMP', nombre: 'Operativo Importación', descripcion: 'Trámites de importación', tipoRol: 'OPERATIVO', activo: true },
  { id: 6, clave: 'OP_EXP', nombre: 'Operativo Exportación', descripcion: 'Trámites de exportación', tipoRol: 'OPERATIVO', activo: true },
  { id: 7, clave: 'AUT_ESP', nombre: 'Autorizador Especial', descripcion: 'Autoriza trámites especiales', tipoRol: 'AUTORIZADOR', activo: true },
];

export const DEPENDENCIAS_MOCK: Dependencia[] = [
  { id: 1, clave: 'SAT', nombre: 'Servicio de Administración Tributaria', activa: true },
  { id: 2, clave: 'SE', nombre: 'Secretaría de Economía', activa: true },
  { id: 3, clave: 'SHCP', nombre: 'Secretaría de Hacienda y Crédito Público', activa: true },
  { id: 4, clave: 'SEMARNAT', nombre: 'Secretaría de Medio Ambiente y Recursos Naturales', activa: true },
  { id: 5, clave: 'SAGARPA', nombre: 'Secretaría de Agricultura y Desarrollo Rural', activa: true },
  { id: 6, clave: 'SSA', nombre: 'Secretaría de Salud', activa: true },
  { id: 7, clave: 'SEDENA', nombre: 'Secretaría de la Defensa Nacional', activa: true },
  { id: 8, clave: 'SEMAR', nombre: 'Secretaría de Marina', activa: true },
];

export const UNIDADES_MOCK: UnidadAdministrativa[] = [
  { id: 1, clave: 'ADUANA_CDMX', nombre: 'Aduana Ciudad de México', dependenciaId: 1, activa: true },
  { id: 2, clave: 'ADUANA_MTY', nombre: 'Aduana Monterrey', dependenciaId: 1, activa: true },
  { id: 3, clave: 'ADUANA_GDL', nombre: 'Aduana Guadalajara', dependenciaId: 1, activa: true },
  { id: 4, clave: 'DGCE', nombre: 'Dirección General de Comercio Exterior', dependenciaId: 2, activa: true },
  { id: 5, clave: 'DGIA', nombre: 'Dirección General de Industria y Aranceles', dependenciaId: 2, activa: true },
  { id: 6, clave: 'UCA', nombre: 'Unidad de Coordinación Aduanera', dependenciaId: 3, activa: true },
  { id: 7, clave: 'DGGIMAR', nombre: 'DGGIMAR', dependenciaId: 4, activa: true },
  { id: 8, clave: 'SENASICA', nombre: 'SENASICA', dependenciaId: 5, activa: true },
];

export const TRAMITES_MOCK: Tramite[] = [
  { id: 1, clave: 'VUCEM-001', nombre: 'Pedimento de Importación', descripcion: 'Trámite para importación de mercancías', activo: true },
  { id: 2, clave: 'VUCEM-002', nombre: 'Pedimento de Exportación', descripcion: 'Trámite para exportación de mercancías', activo: true },
  { id: 3, clave: 'VUCEM-003', nombre: 'Permiso Previo de Importación', descripcion: 'Permiso previo requerido para importación', activo: true },
  { id: 4, clave: 'VUCEM-004', nombre: 'Permiso Previo de Exportación', descripcion: 'Permiso previo requerido para exportación', activo: true },
  { id: 5, clave: 'VUCEM-005', nombre: 'Aviso Automático de Importación', descripcion: 'Aviso automático para importaciones', activo: true },
  { id: 6, clave: 'VUCEM-006', nombre: 'Certificado de Origen', descripcion: 'Certificado de origen de mercancías', activo: true },
  { id: 7, clave: 'VUCEM-007', nombre: 'Manifestación de Valor', descripcion: 'Manifestación del valor en aduana', activo: true },
  { id: 8, clave: 'VUCEM-008', nombre: 'Informe de Descargo', descripcion: 'Informe de descargo de temporales', activo: true },
  { id: 9, clave: 'VUCEM-009', nombre: 'Registro de Empresa Certificada', descripcion: 'Registro OEA / NEEC', activo: true },
  { id: 10, clave: 'VUCEM-010', nombre: 'Constancia de Exportación', descripcion: 'Constancia para exportaciones definitivas', activo: true },
  { id: 11, clave: 'VUCEM-011', nombre: 'Autorización de Depósito Fiscal', descripcion: 'Autorización para depósito fiscal', activo: true },
  { id: 12, clave: 'VUCEM-012', nombre: 'Reporte de Inventarios', descripcion: 'Reporte de inventarios en depósito', activo: true },
];

export const PAISES_MOCK = [
  { clave: 'MEX', nombre: 'México' },
  { clave: 'USA', nombre: 'Estados Unidos' },
  { clave: 'CAN', nombre: 'Canadá' },
  { clave: 'CHN', nombre: 'China' },
  { clave: 'DEU', nombre: 'Alemania' },
  { clave: 'JPN', nombre: 'Japón' },
  { clave: 'ESP', nombre: 'España' },
  { clave: 'BRA', nombre: 'Brasil' },
  { clave: 'ARG', nombre: 'Argentina' },
  { clave: 'COL', nombre: 'Colombia' },
  { clave: 'GBR', nombre: 'Reino Unido' },
  { clave: 'FRA', nombre: 'Francia' },
  { clave: 'ITA', nombre: 'Italia' },
  { clave: 'KOR', nombre: 'Corea del Sur' },
  { clave: 'IND', nombre: 'India' },
];
