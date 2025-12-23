import {ComponentFixture, TestBed} from '@angular/core/testing';
import {contactile-gripper-getdata-progComponent} from "./contactile-gripper-getdata-prog.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContactileGripperGetDataProgComponent', () => {
  let fixture: ComponentFixture<ContactileGripperGetDataProgComponent>;
  let component: ContactileGripperGetDataProgComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactileGripperGetDataProgComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactileGripperGetDataProgComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
