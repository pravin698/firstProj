import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitlewdgerComponent } from './limitlewdger.component';

describe('LimitlewdgerComponent', () => {
  let component: LimitlewdgerComponent;
  let fixture: ComponentFixture<LimitlewdgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitlewdgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitlewdgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
