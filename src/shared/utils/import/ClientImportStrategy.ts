import type { Client } from '../../../core/entities/Client';

export interface IImportStrategy<T> {
  processRow(row: any): T | null;
}

export class ClientImportStrategy implements IImportStrategy<Omit<Client, 'id'>> {
  private normalize(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  private getField(row: any, possibleNames: string[]): string {
    const normalizedPossibleNames = possibleNames.map(this.normalize);
    
    for (const key of Object.keys(row)) {
      if (normalizedPossibleNames.includes(this.normalize(key))) {
        return row[key] || '';
      }
    }
    return '';
  }

  processRow(row: any): Omit<Client, 'id'> | null {
    const name = this.getField(row, ['Nome da pessoa', 'Nome', 'Name']);
    if (!name) return null;

    const emailRaw = this.getField(row, ['Email da pessoa', 'Email', 'E-mail']);
    const emails = emailRaw
      .split(/[;,]/)
      .map((e: string) => e.trim())
      .filter((e: string) => e !== '');
      
    const phone = this.getField(row, ['Telefone da Pessoa', 'Telefone da pessoa', 'Telefone', 'Phone', 'Celular']) || '-';
    const address = this.getField(row, ['Endereco da pessoa', 'Endereco', 'Address']);
    const cnpj = this.getField(row, ['Inscricao estadual da pessoa', 'CNPJ', 'CPF', 'Documento']);

    return {
      name,
      emails,
      phone,
      address,
      cnpj,
    };
  }
}
