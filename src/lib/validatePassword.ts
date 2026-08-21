export interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}
 
export const passwordRules: PasswordRule[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  {
    label: "One special character",
    test: (v) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(v),
  },
];
 
export function isPasswordValid(password: string): boolean {
  return passwordRules.every((rule) => rule.test(password));
}