/* 
export const calculateFine = (dueDate, returnDate) => {
  if (!dueDate || !returnDate) {
    return 0;
  }

  const due = new Date(dueDate);
  const returned = new Date(returnDate);
  const daysLate = Math.floor((returned - due) / (1000 * 60 * 60 * 24));

  if (daysLate <= 0) {
    return 0;
  }

  // Fine calculation rules
  const finePerDay = 0.50; // 50 cents per day
  const maxFine = 20.00;   // Maximum fine capped at $20

  const calculatedFine = Math.min(daysLate * finePerDay, maxFine);
  return Number(calculatedFine.toFixed(2));
};

module.exports = calculateFine;
 */

export const caculateFine = (dueDate) => {
  const finePerHour = 0.1; // Fine per hour 10 cents
  const today = new Date();

  if (today > dueDate) {
    const lateHours = Math.floor((today - dueDate) / (1000 * 60 * 60));
    const fine = lateHours * finePerHour;
    return fine;
  }
  return 0;
};
