document.addEventListener('DOMContentLoaded', function() {
    // Get references to all necessary HTML elements
    const initialSavingsInput = document.getElementById('initialSavings');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const annualInterestRateInput = document.getElementById('annualInterestRate');
    const savingDurationInput = document.getElementById('savingDuration');
    const calculateBtn = document.getElementById('calculateBtn');
    const futureValueDisplay = document.getElementById('futureValue');

    // Add an event listener to the button
    calculateBtn.addEventListener('click', calculateSavings);

    function calculateSavings() {
        // 1. Get input values (and convert to numbers)
        const initialSavings = parseFloat(initialSavingsInput.value);
        const monthlyContribution = parseFloat(monthlyContributionInput.value);
        // Convert annual percentage rate to a decimal monthly rate
        const annualInterestRate = parseFloat(annualInterestRateInput.value) / 100;
        const savingDurationYears = parseFloat(savingDurationInput.value);

        // Basic validation: ensure inputs are valid numbers
        if (isNaN(initialSavings) || isNaN(monthlyContribution) || isNaN(annualInterestRate) || isNaN(savingDurationYears)) {
            futureValueDisplay.textContent = 'Please enter valid numbers for all fields.';
            futureValueDisplay.style.color = '#e74c3c'; // Red for error
            return;
        }

        if (savingDurationYears <= 0) {
            futureValueDisplay.textContent = 'Duration must be at least 1 year.';
            futureValueDisplay.style.color = '#e74c3c';
            return;
        }

        // 2. Convert to monthly periods
        const monthlyInterestRate = annualInterestRate / 12;
        const totalMonths = savingDurationYears * 12;

        // 3. Calculate Future Value (FV)
        let futureValue = 0;

        // Calculation for Initial Savings: FV = P * (1 + r)^n
        // If there's an initial amount, it also grows with compounding
        if (initialSavings > 0) {
            futureValue += initialSavings * Math.pow((1 + monthlyInterestRate), totalMonths);
        }

        // Calculation for Monthly Contributions (Future Value of an Annuity):
        // FV = P * [((1 + r)^n - 1) / r] * (1 + r_monthly) - to account for payments made at the beginning of the period
        // If payments are at the end, the last part `* (1 + r_monthly)` is removed.
        // For simplicity and common use, let's assume end-of-period payments or adjust as needed.
        // A common and slightly simpler annuity formula used is:
        // FV_annuity = P * (((1 + r)^n - 1) / r)
        // Where r is the per-period rate, n is total periods.

        if (monthlyContribution > 0) {
            // This formula is for future value of an ordinary annuity (payments at end of period)
            // If you want payments at the beginning of the period, multiply by (1 + monthlyInterestRate)
            let futureValueContributions = monthlyContribution * ( (Math.pow(1 + monthlyInterestRate, totalMonths) - 1) / monthlyInterestRate );
            futureValue += futureValueContributions;
        }
        
        // Handle edge case for zero interest rate to prevent division by zero
        if (annualInterestRate === 0) {
             futureValue = initialSavings + (monthlyContribution * totalMonths);
        }


        // 4. Display the result
        // Format to Indian Rupees (₹) with 2 decimal places
        const formattedFutureValue = futureValue.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        futureValueDisplay.textContent = formattedFutureValue;
        futureValueDisplay.style.color = '#27ae60'; // Green for success
    }
});
