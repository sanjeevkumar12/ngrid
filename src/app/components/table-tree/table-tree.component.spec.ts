import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTreeComponent } from './table-tree.component';

describe('TableTreeComponent', () => {
  let component: TableTreeComponent;
  let fixture: ComponentFixture<TableTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableTreeComponent]
    });
    fixture = TestBed.createComponent(TableTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
