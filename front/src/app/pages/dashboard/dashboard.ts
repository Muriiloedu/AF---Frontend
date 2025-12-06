import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionsService, Transaction } from '../../services/transactions';
// 1. IMPORTAÇÃO NOVA: Para usar o ngModel e ngSubmit no formulário
import { FormsModule, NgForm } from '@angular/forms'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. ADICIONA O FormsModule AOS IMPORTS
  imports: [CommonModule, CurrencyPipe, DatePipe, FormsModule], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit { 
  
  private service = inject(TransactionsService);

  transacoes: Transaction[] = [];
  saldoTotal: number = 0;
  // 3. VARIÁVEL PARA CONTROLAR A EXIBIÇÃO DO FORMULÁRIO
  mostrarFormulario: boolean = false; 

  ngOnInit(): void {
    this.carregarDados();
  }

  // Função que carrega a lista e o saldo
  carregarDados() {
    this.service.listar().subscribe({
      next: (dados) => {
        this.transacoes = dados.transactions;
        this.saldoTotal = dados.balance;
        this.mostrarFormulario = false; // Esconde o form após carregar
      },
      error: (erro) => console.error('Erro ao buscar transações:', erro)
    });
  }

  // 4. FUNÇÃO PARA REGISTRAR (CHAMADA PELO NGSubmit)
  registrarTransacao(form: NgForm) {
    if (form.invalid) {
      console.error('Formulário inválido');
      return;
    }

    // Acessa o objeto de dados do formulário
    const novaTransacao = form.value;
    
    // A API Node.js espera a data como Date, então garantimos que está no formato correto.
  
    novaTransacao.value = Number(novaTransacao.value); // Garante que o valor é um número

    this.service.criar(novaTransacao).subscribe({
      next: () => {
        // 5. ATUALIZA OS DADOS APÓS O SUCESSO DO POST
        this.carregarDados(); 
        form.resetForm({ type: 'Receita' }); // Limpa o form e reseta o Tipo
        alert('Transação registrada com sucesso!');
        this.mostrarFormulario = false; // Esconde o formulário após sucesso
      },
      error: (erro) => {
        console.error('Erro ao registrar transação (Node.js log):', erro);
        alert('Erro ao registrar transação. Verifique o console do Node.js.');
      }
    });
  }
}