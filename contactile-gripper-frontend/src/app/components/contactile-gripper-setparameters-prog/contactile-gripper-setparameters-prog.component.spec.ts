import {ComponentFixture, TestBed} from '@angular/core/testing';
import {contactile-gripper-setparameters-progComponent} from "./contactile-gripper-setparameters-prog.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContactileGripperSetParametersProgComponent', () => {
  let fixture: ComponentFixture<ContactileGripperSetParametersProgComponent>;
  let component: ContactileGripperSetParametersProgComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactileGripperSetParametersProgComponent],
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

    fixture = TestBed.createComponent(ContactileGripperSetParametersProgComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
