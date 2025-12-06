import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev")); // Logger para ver as requisições
app.use(cors()); // Permite requisições do frontend Angular

// Conexão com MongoDB
// Usamos o dbName explicitamente, como você tinha.
mongoose.connect(process.env.MONGODB_URI, { dbName: "aula" })
.then(() => console.log("Conectado ao MongoDB"))
.catch(err => {
    console.error("Erro na conexão com MongoDB:", err.message);
    process.exit(1);
});

// 1. Definição do Schema de Transação (Movimentação Financeira)
const transactionSchema = new mongoose.Schema({
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    // Tipo: Receita (Entrada) ou Despesa (Saída)
    type: { 
        type: String, 
        required: true, 
        enum: ['Receita', 'Despesa'],
        trim: true
    },
    category: { 
        type: String, 
        required: true, 
        trim: true 
    },
    value: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    date: { 
        type: Date, 
        required: true 
    }
}, { 
    collection: "Transactions", 
    timestamps: true 
});

const Transaction = mongoose.model("Transaction", transactionSchema, "Transactions");

// =================================================================
// ROTAS DA API REST (CRUD para /transactions)
// =================================================================

// Rota Raiz
app.get("/", (req, res) => res.json({ msg: "API de Gestão Financeira rodando." }));

// Rota 1: CREATE (Registrar Nova Transação)
app.post("/transactions", async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (err) {
        // Erro 400 para erros de validação do Mongoose
        res.status(400).json({ error: err.message });
    }
}); 

// Rota 2: READ ALL (Visualizar Lista de Transações e Saldo)
app.get("/transactions", async (req, res) => {
    try {
        // Ordena por data mais recente
        const transactions = await Transaction.find().sort({ date: -1 });
        
        // Cálculo do Saldo
        const balance = transactions.reduce((acc, trans) => {
            if (trans.type === 'Receita') {
                return acc + trans.value;
            } else {
                return acc - trans.value;
            }
        }, 0);

        // Retorna a lista de transações e o saldo total
        res.json({ transactions, balance });
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar transações." });
    }
});

// Rota 3: READ ONE (Buscar Transação por ID)
app.get("/transactions/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) return res.status(404).json({ msg: "Transação não encontrada" });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Rota 4: UPDATE (Atualizar Transação)
app.put("/transactions/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!transaction) return res.status(404).json({ msg: "Transação não encontrada" });

        res.json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota 5: DELETE (Deletar Transação)
app.delete("/transactions/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) return res.status(404).json({ msg: "Transação não encontrada" });

        res.json({ msg: "Transação deletada com sucesso" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));