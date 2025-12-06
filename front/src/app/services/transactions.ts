import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// 1. Exporta a Interface Transaction (resolve TS2724)
export interface Transaction {
  _id?: string;
  description: string;
  type: 'Receita' | 'Despesa';
  category: string;
  value: number;
  date: Date;
}

export interface TransactionResponse {
  transactions: Transaction[];
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
// 2. Exporta a classe com o nome 'TransactionsService' (resolve TS2305)
export class TransactionsService { 
  private http = inject(HttpClient);
  private base = 'http://localhost:3000/transactions';

  // 3. Usa a tipagem correta (resolve TS2571 e TS7006)
  listar(): Observable<TransactionResponse> {
    return this.http.get<TransactionResponse>(this.base);
  }

  criar(transacao: Omit<Transaction, '_id'>): Observable<Transaction> {
    return this.http.post<Transaction>(this.base, transacao);
  }
}