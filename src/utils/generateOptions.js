module.exports = (selected) =>{
    const options = {
        'crypto-wallet':'Crypto Wallet',
        'credit-card':'Credit Card',
        'debit-card':'Debit Card',
        'paypal':'Paypal'
    }

    let html = ``;
    for (const key in options) {
        html += `<option value="${key}" ${selected == key ? 'selected' : ''}>${options[key]}</option>`;
    }
    return html;
}