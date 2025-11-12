// Student type definitions
export interface Student {
  id: number;
  lastName: string;
  firstMidName: string;
  enrollmentDate: string;
  fullName: string;
  enrollmentCount: number;
}

export interface CreateStudent {
  lastName: string;
  firstMidName: string;
  enrollmentDate: string;
}

export interface UpdateStudent {
  lastName: string;
  firstMidName: string;
  enrollmentDate: string;
  rowVersion?: Uint8Array;
}
