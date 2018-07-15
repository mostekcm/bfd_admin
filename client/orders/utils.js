import _ from 'lodash';

export const getEstimatedShipping = (total) => {
  if (total === 0) return 0;
  total = parseFloat(total);
  const shippingPercent = [
    { amount: 300, percent: 2.0 },
    { amount: 150, percent: 4.5 },
    { amount: 0, percent: 7.0 }
  ];

  if (total < 0) return 0;

  let percent = 0;
  shippingPercent.forEach((data) => {
    if (percent === 0 && total > data.amount) percent = data.percent;
  });

  return total * percent / 100.0;
};

export const getEstimatedShippingAndHandling = (total) => {
  total = parseFloat(total);
  return getEstimatedShipping(total) + 0.03*total;
};

export const getPaidCommissionData = (commissions, commissionInfo, payee, paidDate, orderId) => {
  const commissionInfoForPayee = _(commissionInfo).filter(info => info.payee === payee).value();
  commissions = commissions || [];

  if (commissionInfoForPayee.length === 1) {
    let found = false;
    commissions.forEach(commission => {
      if (commission.payee === payee) {
        commission.paidAmount = commissionInfoForPayee[0].due;
        commission.multiplier = commissionInfoForPayee[0].multiplier;
        commission.paidDate = paidDate;
        found = true;
        console.warn(`Overwriting commission date for ${this.orderId.value} for payee ${payee}`);
      }
    });

    if (!found) commissions.push({
      payee,
      paidAmount: commissionInfoForPayee[0].due,
      multiplier: commissionInfoForPayee[0].multiplier,
      paidDate
    });

    return {
      commissions
    };
  }

  throw new Error(`Something bad happened such that there was no commission information for ${payee} on order ${orderId}`);
};
