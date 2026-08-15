export type CreatePartnerDto = {
  name: string;
  description: string;
  email: string;
  phone: string | null;
  logo: string | null;
  video: string | null;
  activity: string;
  address: string;
  contact: string | null;
  socialMedia: string | null;
};

export type UpdatePartnerDto = Partial<CreatePartnerDto>;
