const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./configSystem');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const savingsSchema = new mongoose.Schema({
  goal: Number,
  current: Number,
  transactions: [{
    type: String,
    amount: Number,
    month: String
  }]
});

const Savings = mongoose.model('Savings', savingsSchema);

app.get('/savings', async (req, res) => {
  try {
    const savingsData = await Savings.findOne();
    res.json(savingsData || config.savingsData);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar dados', error: err });
  }
});

app.put('/savings', async (req, res) => {
  try {
    const { goal, current, transactions } = req.body;
    let savingsData = await Savings.findOne();
    if (!savingsData) {
      savingsData = new Savings({ goal, current, transactions });
    } else {
      savingsData.goal = goal;
      savingsData.current = current;
      savingsData.transactions = transactions;
    }
    await savingsData.save();
    res.json(savingsData);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar dados', error: err });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));