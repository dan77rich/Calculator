// get the loan values from the page
function getValues() {

    // step1 get values from the page
    let lamount = Number(document.getElementById("lamount").value);
    let lterm = parseInt(document.getElementById("lterm").value);
    let lrate = parseFloat(document.getElementById("lrate").value);


    // check for NaN
    if (isNaN(lamount)) {
        alert("Enter a valid amount. Must be a number");
        document.getElementById("lamount").focus();
    } else if (isNaN(lterm)) {
        alert("Enter a valid payment term. Enter the number of monthly payments for the loan");
        document.getElementById("lterm").focus();
    } else if (isNaN(lrate)) {
        alert("Enter a valid loan rate. Must be valid number");
        document.getElementById("lrate").focus();
    } else {
        let mrate = calcRate(lrate);
        // calculate monthly payment
        let lpayment = calcPayment(lamount, mrate, lterm);
        // build our schedule
        let payments = buildSchedule(lamount, mrate, lterm, lpayment);

        // // call display data
        displayData(payments, lamount, lpayment);
    }

    // step 2 - calculate the payment



}

// builds an amorization schedule
function buildSchedule(amount, rate, term, payment) {
    let payments = [];

    let balance = amount;
    let totalInterest = 0;
    let monthlyInterest = 0;
    let monthlyPrincipal = 0;


    for (let month = 1; month <= term; month++) {

        monthlyInterest = calcInterest(balance, rate);
        totalInterest += monthlyInterest;
        monthlyPrincipal = payment - monthlyInterest;
        balance = balance - monthlyPrincipal;


        let curPayment = {
            month: month,
            payment: payment,
            principal: monthlyPrincipal,
            interest: monthlyPrincipal,
            totalInterest: totalInterest,
            balance: balance
        }

        payments.push(curPayment);
    }

    // return an array of payment objects
    return payments;

}

// display the tables of payments
// ad the summary info at the top page
function displayData(payments, lamount, lpayment) {
    
   
    let tableBody = document.getElementById("scheduleBody");
    let template = document.getElementById("schedule-template");
    // clear the table of previous values
    tableBody.innerHTML = "";

    for (let index = 0; index < payments.length; index++) {
        // clone the template
        let paymentRow = document.importNode(template.content,true);
        // get an array of columns
        
        let paymentCols =  paymentRow.querySelectorAll("td");

        paymentCols[0].textContent = payments[index].month;
        paymentCols[1].textContent = payments[index].payment.toFixed(2);
        paymentCols[2].textContent = payments[index].principal.toFixed(2);
        paymentCols[3].textContent = payments[index].interest.toFixed(2);
        paymentCols[4].textContent = payments[index].totalInterest.toFixed(2);
        paymentCols[5].textContent = payments[index].balance.toFixed(2);
        // write the payment to the page
        tableBody.appendChild(paymentRow);

    }
document.getElementById("payment").innerHTML = Number(lpayment).toLocaleString("en-us", {
    style:"currency",
    currency: "USD"
});

document.getElementById("totalPrincipal").innerHTML = Number(lamount).toLocaleString("en-us", {
    style:"currency",
    currency: "USD"
});

let totalInterest = payments[payments.length-1].totalInterest;

document.getElementById("totalInterest").innerHTML = Number(totalInterest).toLocaleString("en-us", {
    style:"currency",
    currency: "USD"
});

let totalCost = lamount + totalInterest;

document.getElementById("totalCost").innerHTML = Number(totalCost).toLocaleString("en-us", {
    style:"currency",
    currency: "USD"
});

}

// helper functions
// calculates a payment, rate is a monthly rate, term is totalmonths
function calcPayment(amount, rate, term) {
    let payment = 0;

    payment = (amount * rate) / (1 - Math.pow(1 + rate, -term));

    return payment;
}
// monthly rate calculation for loan
function calcRate(rate) {
    return rate = rate / 1200;
}

function calcInterest(balance, rate) {
    return balance * rate;
}