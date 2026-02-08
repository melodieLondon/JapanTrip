/** * JAPAN PLAN - CORE LOGIC
 * This script runs on all pages and initializes only what is needed.
 */

const APP_STATE = {
    exchangeRate: 206.82,
    // Load expenses from local storage or start empty
    expenses: JSON.parse(localStorage.getItem('japan_expenses')) || []
};

document.addEventListener('DOMContentLoaded', () => {
    initPageFeatures();
});

// Add these to the top of your app.js
let isPoundsToYen = true; 
const EXCHANGE_RATE = 206.82;

function toggleCurrencyDirection() {
    isPoundsToYen = !isPoundsToYen;
    
    // Update Labels
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const rateText = document.getElementById('rate-text');
    const inputField = document.getElementById('currency-input');
    const outputField = document.getElementById('currency-output');

    if (isPoundsToYen) {
        inputLabel.innerText = "Pounds (£)";
        outputLabel.innerText = "Yen (¥)";
        rateText.innerText = `Rate: £1 = ¥${EXCHANGE_RATE}`;
        outputField.innerText = "¥ 0";
    } else {
        inputLabel.innerText = "Yen (¥)";
        outputLabel.innerText = "Pounds (£)";
        rateText.innerText = `Rate: ¥1000 ≈ £${(1000 / EXCHANGE_RATE).toFixed(2)}`;
        outputField.innerText = "£ 0.00";
    }
    
    inputField.value = ""; // Clear input on swap
    handleConversion();
}

function handleConversion() {
    const val = parseFloat(document.getElementById('currency-input').value);
    const output = document.getElementById('currency-output');
    
    if (isNaN(val) || val <= 0) {
        output.innerText = isPoundsToYen ? "¥ 0" : "£ 0.00";
        return;
    }

    if (isPoundsToYen) {
        // GBP -> JPY
        const result = (val * EXCHANGE_RATE).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
        output.innerText = result;
    } else {
        // JPY -> GBP
        const result = (val / EXCHANGE_RATE).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
        output.innerText = result;
    }
}

function initPageFeatures() {
    // Check if we are on the Budget page
    if (document.getElementById('expense-list')) {
        renderExpenses();
    }
    
    // Check if we are on the Checklist page
    if (document.getElementById('packing-list')) {
        // You would move your renderPacking functions here
    }

    // Currency Converter logic (works on any page with these IDs)
    const gbpInput = document.getElementById('gbp-input');
    if (gbpInput) {
        gbpInput.addEventListener('input', convertCurrency);
    }
}

// --- BUDGET LOGIC ---
function addExpense() {
    const itemInput = document.getElementById('expense-item');
    const costInput = document.getElementById('expense-cost');

    const item = itemInput.value.trim();
    const cost = parseFloat(costInput.value);

    if (item === "" || isNaN(cost)) return;

    APP_STATE.expenses.push({ id: Date.now(), item, cost });
    saveAndSync();
    
    itemInput.value = '';
    costInput.value = '';
    renderExpenses();
}

function deleteExpense(id) {
    APP_STATE.expenses = APP_STATE.expenses.filter(ex => ex.id !== id);
    saveAndSync();
    renderExpenses();
}

function saveAndSync() {
    localStorage.setItem('japan_expenses', JSON.stringify(APP_STATE.expenses));
}

function renderExpenses() {
    const listBody = document.getElementById('expense-list');
    const totalCell = document.getElementById('total-cost');
    if (!listBody) return;

    listBody.innerHTML = '';
    let total = 0;

    APP_STATE.expenses.forEach(ex => {
        total += ex.cost;
        listBody.innerHTML += `
            <tr>
                <td>${ex.item}</td>
                <td class="text-right">£ ${ex.cost.toFixed(2)}</td>
                <td><button onclick="deleteExpense(${ex.id})" class="text-red-500 font-bold">X</button></td>
            </tr>
        `;
    });
    totalCell.textContent = `£ ${total.toFixed(2)}`;
}

// --- CURRENCY LOGIC ---
function convertCurrency() {
    const input = document.getElementById('gbp-input').value;
    const output = document.getElementById('jpy-output');
    if (input) {
        const result = (input * APP_STATE.exchangeRate).toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
        output.innerText = result;
    } else {
        output.innerText = "¥ 0";
    }
}