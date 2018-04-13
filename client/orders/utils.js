import _ from 'lodash';

export const getEstimatedShipping = (total) => {
  if (total === 0) return 0;
  total = parseFloat(total);
  const hundreds = Math.ceil(total/100.0);
  const shippingPercent = {
    1: 16.87,
    2: 13,
    3: 11,
    4: 9,
    5: 8,
    default: 6.87
  };

  return total * (hundreds <= 5 ? shippingPercent[hundreds] : shippingPercent.default) / 100.0;
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
