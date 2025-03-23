document.addEventListener('DOMContentLoaded', () => {
    const goalInput = document.getElementById('goal');
    const currentInput = document.getElementById('current');
    const percentageSpan = document.getElementById('percentage');
    const addButton = document.getElementById('add');
    const removeButton = document.getElementById('remove');
    const correctButton = document.getElementById('correct');
    const transactionsList = document.getElementById('transactions-list');

    let savingsData = {
        goal: 10000,
        current: 0,
        transactions: []
    };

    const updateUI = () => {
        currentInput.value = savingsData.current;
        const percentage = (savingsData.current / savingsData.goal) * 100;
        percentageSpan.textContent = `${percentage.toFixed(2)}%`;
        renderTransactions();
    };

    const renderTransactions = () => {
        transactionsList.innerHTML = '';
        savingsData.transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.textContent = `${transaction.month}: ${transaction.type} de R$ ${transaction.amount.toFixed(2)}`;
            transactionsList.appendChild(li);
        });
    };

    const fetchSavingsData = async () => {
        try {
            const response = await fetch('http://localhost:3000/savings');
            savingsData = await response.json();
            updateUI();
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
        }
    };

    const updateSavingsData = async (data) => {
        try {
            await fetch('http://localhost:3000/savings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            fetchSavingsData();
        } catch (err) {
            console.error('Erro ao salvar dados:', err);
        }
    };

    const getCurrentMonth = () => {
        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const date = new Date();
        return months[date.getMonth()];
    };

    addButton.addEventListener('click', () => {
        const amount = parseFloat(prompt('Digite o valor a ser adicionado:'));
        if (!isNaN(amount)) {
            savingsData.current += amount;
            savingsData.transactions.push({
                type: 'Adicionado',
                amount: amount,
                month: getCurrentMonth()
            });
            updateSavingsData(savingsData);
        }
    });

    removeButton.addEventListener('click', () => {
        const amount = parseFloat(prompt('Digite o valor a ser removido:'));
        if (!isNaN(amount)) {
            savingsData.current -= amount;
            savingsData.transactions.push({
                type: 'Removido',
                amount: amount,
                month: getCurrentMonth()
            });
            updateSavingsData(savingsData);
        }
    });

    correctButton.addEventListener('click', () => {
        const amount = parseFloat(prompt('Digite o valor corrigido:'));
        if (!isNaN(amount)) {
            savingsData.current = amount;
            updateSavingsData(savingsData);
        }
    });

    fetchSavingsData();
});