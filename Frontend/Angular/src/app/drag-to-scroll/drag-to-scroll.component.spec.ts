import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragToScrollComponent } from './drag-to-scroll.component';

describe('DragToScrollComponent', () => {
  let component: DragToScrollComponent;
  let fixture: ComponentFixture<DragToScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragToScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragToScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
