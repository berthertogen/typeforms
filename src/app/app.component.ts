import { Component } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { FormBuilder, Validators } from '@angular/forms';
import { OnInit, OnDestroy } from '@angular/core';
import { EmployeeTypeform } from './models/employee.typeform';
import { Typeform, Fields } from './validation/typeform';
import { Employee } from './models/employee';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';
import { Observable } from 'rxjs/Observable';
import { notInArray, isDateValid, checkTimeDIff } from './validation/custom-validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private revalidateWorkdayEndSubscription: Subscription;

  form: EmployeeTypeform;
  searchFirstNames$ = (text$: Observable<string>) =>
    text$
      .debounceTime(500)
      .distinctUntilChanged()
      .filter(q => q !== "")
      .map(query => this.employeeService.getFirstNames(query));

  constructor(private employeeService: EmployeeService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = new EmployeeTypeform(this.formBuilder, this.employeeService);

    this.revalidateWorkdayEndSubscription =
      this.form.workdayStart$.combineLatest(this.form.nightwork$)
        .subscribe(time => this.form.validate("workdayEnd")); // string is statically analyzed

    this.form.validate();
  }

  ngOnDestroy(): void {
    this.revalidateWorkdayEndSubscription.unsubscribe();
  }
}
