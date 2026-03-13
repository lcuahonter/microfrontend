import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfcSolicitanteComponent } from './rfc-solicitante.component';

describe('RfcSolicitanteComponent', () => {
  let component: RfcSolicitanteComponent;
  let fixture: ComponentFixture<RfcSolicitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfcSolicitanteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RfcSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
