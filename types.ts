
export interface InvolvedPerson {
  name: string;
  icNumber: string;
  position: string;
}

export interface Signature {
  name: string;
  position: string;
  phone: string;
  date: string;
}

export interface CaseReport {
  title: string;
  schoolName: string;
  schoolCode: string;
  incidentDate: string;
  schoolAddress: string;
  involvedPerson: InvolvedPerson;
  chronology: string;
  actionsTaken: string;
  preparedBy: Signature;
  checkedBy: Signature;
  verifiedBy: Signature;
}
