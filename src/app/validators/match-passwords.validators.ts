import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Função para validar se as senhas coincidem
export const matchPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const senha = control.get('senha')?.value;
  const confirmarSenha = control.get('confirmarSenha')?.value;
  
  return senha === confirmarSenha ? null : { senhaNaoConfere: true };
};
