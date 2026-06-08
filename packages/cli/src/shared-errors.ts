export type CliErrorCode =
  | 'PARSE_ERROR'
  | 'CONFIG_ERROR'
  | 'PATH_INVALID'
  | 'COMMAND_NOT_SUPPORTED'
  | 'VALIDATION_FAILED'
  | 'RUNTIME_FAILED'
  | 'REPORT_FAILED'
  | 'CONFIRMATION_DECLINED';

export type CliError = {
  code: CliErrorCode;
  message: string;
  details?: string;
  hint?: string;
};

export const createCliError = (
  code: CliErrorCode,
  message: string,
  details?: string,
  hint?: string,
): CliError => ({
  code,
  message,
  details,
  hint,
});
