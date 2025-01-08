import { FontMetrics, SanitizerResult } from "../types/sanitizer";
import { ValidationRule } from "../types/validations";

export class MetricsValidationService {
  validateMetrics(metrics: FontMetrics, rules: ValidationRule[]): SanitizerResult {
    return {
      success: false,
      message: 'Metrics are not valid',
      errors: []
    }
  }
}