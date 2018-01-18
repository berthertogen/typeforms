import { Observable } from "rxjs/Observable";
import { FormGroup, FormBuilder } from "@angular/forms";

export type Fields<T> = {
  [K in keyof T]: any;
}

export class Typeform<TFormInterface> {

  constructor(public formGroup: FormGroup) {
  }

  public getField<TKey extends keyof TFormInterface>(key: TKey): TFormInterface[TKey] {
    return this.formGroup.controls[key].value as TFormInterface[TKey];
  }

  public getFieldObservable<TKey extends keyof TFormInterface>(key: TKey): Observable<TFormInterface[TKey]> {
    return this.formGroup.controls[key].valueChanges;
  }

  public setField<TKey extends keyof TFormInterface>(key: TKey, value: TFormInterface[TKey]): void {
    this.formGroup.patchValue({ [key.toString()]: value });
  }

  public hasError(key: keyof TFormInterface, validatie: string): boolean {
    if (key == null) {
      return false;
    }
    return this.hasErrors(key) && this.formGroup.controls[key].errors[validatie];
  }

  public hasErrors(key?: keyof TFormInterface): boolean {
    if (key == null) {
      return this.formGroup.invalid && (this.formGroup.touched || this.formGroup.dirty);
    }
    const control = this.formGroup.controls[key];
    return control.invalid && (control.touched || control.dirty);
  }

  public validate(...keys: (keyof TFormInterface)[]): void {
    let formKeys: string[] = [];

    if (!keys || !keys.length) {
      for (let formKey in this.formGroup.controls) {
        formKeys = [...formKeys, formKey];
      }
    }
    else {
      formKeys = keys;
    }

    for (let formKey of formKeys) {
      let control = this.formGroup.controls[formKey];
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }
}
