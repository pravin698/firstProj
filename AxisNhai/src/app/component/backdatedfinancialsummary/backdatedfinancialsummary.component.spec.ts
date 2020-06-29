import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdatedfinancialsummaryComponent } from './backdatedfinancialsummary.component';

describe('BackdatedfinancialsummaryComponent', () => {
  let component: BackdatedfinancialsummaryComponent;
  let fixture: ComponentFixture<BackdatedfinancialsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackdatedfinancialsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackdatedfinancialsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
