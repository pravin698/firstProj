import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegsitrationComponent } from './regsitration.component';

describe('RegsitrationComponent', () => {
  let component: RegsitrationComponent;
  let fixture: ComponentFixture<RegsitrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegsitrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegsitrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
