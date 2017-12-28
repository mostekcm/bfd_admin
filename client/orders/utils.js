import _ from 'lodash';

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
