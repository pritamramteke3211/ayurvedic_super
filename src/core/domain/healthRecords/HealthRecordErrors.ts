export class HealthRecordDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HealthRecordDomainError';
  }
}

export class RecordNotFoundError extends HealthRecordDomainError {
  constructor(id: string) {
    super(`Health record with ID ${id} was not found.`);
    this.name = 'RecordNotFoundError';
  }
}

export class InvalidRecordTitleError extends HealthRecordDomainError {
  constructor(message = 'Record title cannot be empty.') {
    super(message);
    this.name = 'InvalidRecordTitleError';
  }
}
