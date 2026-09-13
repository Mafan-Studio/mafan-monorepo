export interface Inquiry {
  id: string;
  name: string;
  email: string;
  childName?: string;
  message?: string;
  createdAt: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  childName?: string;
  message?: string;
}
