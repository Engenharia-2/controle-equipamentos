export interface Client {
  id?: string;
  name: string;
  emails: string[];
  phone: string;
  cnpj?: string;
  address?: string;
}
