import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialsummarryComponent } from './financialsummarry.component';

describe('FinancialsummarryComponent', () => {
  let component: FinancialsummarryComponent;
  let fixture: ComponentFixture<FinancialsummarryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialsummarryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialsummarryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
