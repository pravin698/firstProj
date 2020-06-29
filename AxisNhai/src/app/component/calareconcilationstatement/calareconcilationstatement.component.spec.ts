import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalareconcilationstatementComponent } from './calareconcilationstatement.component';

describe('CalareconcilationstatementComponent', () => {
  let component: CalareconcilationstatementComponent;
  let fixture: ComponentFixture<CalareconcilationstatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalareconcilationstatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalareconcilationstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
