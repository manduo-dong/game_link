import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, ValidatorFn, ValidationErrors, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('passFormControl').value === formGroup.get('confirmFormControl').value)
    return null;
  else
    return {passwordMismatch: true};
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{

  formGroup: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      passFormControl : ['', [Validators.required, Validators.minLength(8),]],
      confirmFormControl : [Validators.required]
    }, {validator: passwordMatchValidator});

    this.formGroup.get('confirmFormControl').setValue('')
  }

  title = 'game-link';

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  // passFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.minLength(8),
  // ]);

  // confirmFormControl = new FormControl('', [
  //   Validators.required
  // ]);
  get passFormControl() { return this.formGroup.get('passFormControl'); }
  get confirmFormControl() { return this.formGroup.get('confirmFormControl'); }

  onPasswordInput() {
    if (this.formGroup.hasError('passwordMismatch'))
      this.confirmFormControl.setErrors([{'passwordMismatch': true}]);
    else
      this.confirmFormControl.setErrors(null);
  }
  showLoginError = false;
  signUpDone = false;

  matcher = new MyErrorStateMatcher();

  checkDisabled() {
    return !(this.emailFormControl.valid && this.passFormControl.valid && this.confirmFormControl.valid &&
      this.passFormControl.value == this.confirmFormControl.value)
  }

  showError() {
    this.showLoginError = true
  }

  doneSignUp(v:boolean) {
    this.signUpDone = v
  }
}
