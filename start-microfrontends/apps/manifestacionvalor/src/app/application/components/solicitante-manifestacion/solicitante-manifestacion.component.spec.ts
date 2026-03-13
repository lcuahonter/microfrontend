import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitanteManifestacionComponent } from './solicitante-manifestacion.component';

describe('SolicitanteManifestacionComponent', () => {
  let component: SolicitanteManifestacionComponent;
  let fixture: ComponentFixture<SolicitanteManifestacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitanteManifestacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitanteManifestacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
