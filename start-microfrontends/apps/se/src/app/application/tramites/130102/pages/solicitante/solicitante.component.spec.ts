import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solicitante130102Component } from './solicitante.component';
import { DetosDelTramiteComponent } from '../../component/datos-del-tramite/datos-del-tramite.component';
import { DetosDelLaMarcaciaComponent } from '../../component/datos-de-la-mercacia/datos-de-la-mercacia.component';
import { PartidasDeLaComponent } from '../../component/partidas-de-la/partidas-de-la.component';
import { UsoEspicificoComponent } from '../../component/uso-especifico/uso-especifico.component';
import { CriterioDeDictComponent } from '../../component/criterio-de-dict/criterio-de-dict.component';
import { PaisProcendenciaComponent } from '../../component/pais-procendencia/pais-procendencia.component';
import { RepresentacionComponent } from '../../component/representacion/representacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitanteComponent', () => {
  let component: Solicitante130102Component;
  let fixture: ComponentFixture<Solicitante130102Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Solicitante130102Component],
      imports: [DetosDelTramiteComponent, DetosDelLaMarcaciaComponent, PartidasDeLaComponent, UsoEspicificoComponent, CriterioDeDictComponent, PaisProcendenciaComponent, RepresentacionComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Solicitante130102Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
