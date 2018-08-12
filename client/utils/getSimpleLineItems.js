import _ from 'lodash';

export const getName = sku => `${sku.product.name}${ sku.size !== 'N/A' ? ', ' + sku.size : ''}${ sku.variety ? ', ' + sku.variety : ''}`;

export const getSimpleLineItemsForOrder = (order) => {
  order.totals = order.totals || {};
  const lineItems = order.lineItems;
  const displayItems = order.displayItems;

  const purchaseLineItems = _(lineItems)
    .map(lineItem => ({
      name: getName(lineItem.sku || {}),
      quantity: Math.round(lineItem.quantity * lineItem.size)
    }))
    .filter(lineItem => lineItem.quantity)
    .sortBy('name')
    .value();

  const displayLineItems = _(displayItems)
    .map(displayItem => ({
      name: displayItem.product.name.length > 0 ? `${displayItem.name} for ${displayItem.product.name}` : displayItem.name,
      quantity: displayItem.quantity
    }))
    .filter(displayItem => displayItem.quantity)
    .sortBy('name')
    .value();

  const offsetMerchItems = _(displayItems)
    .map(displayItem => _.map(displayItem.offsetMerch, offsetMerch => ({
      name: getName(offsetMerch.sku),
      quantity: Math.round(parseFloat(offsetMerch.quantity) * parseFloat(displayItem.quantity))
    })))
    .flatten()
    .value();

  const packingLineItems1 = _(purchaseLineItems)
    .concat(offsetMerchItems)
    .groupBy('name')
    .value();

  const packingLineItems = _(packingLineItems1)
    .map(groups => ({
      name: groups[0].name,
      quantity: _.sumBy(groups, 'quantity')
    }))
    .sortBy('name')
    .value();

  const testerLineItems = _(lineItems)
    .map(lineItem => ({
      name: getName(lineItem.sku).replace(`, ${lineItem.sku.size}`, ''),
      quantity: lineItem.tester.quantity
    }))
    .filter(lineItem => lineItem.quantity)
    .groupBy('name')
    .map(groups => ({
      name: groups[0].name,
      quantity: _.sumBy(groups, 'quantity')
    }))
    .sortBy('name')
    .value();

  return {
    displayLineItems,
    packingLineItems,
    testerLineItems
  };
};

export const getSimpleLineItems = (orders) => {
  let allDisplayLineItems = [];
  let allPackingLineItems = [];
  let allTesterLineItems = [];

  orders.forEach(order => {
    const {
      displayLineItems,
      packingLineItems,
      testerLineItems
    } = getSimpleLineItemsForOrder(order);
    allDisplayLineItems = _(allDisplayLineItems)
      .concat(displayLineItems)
      .groupBy('name')
      .map(groups => ({
        name: groups[0].name,
        quantity: _.sumBy(groups, 'quantity')
      }))
      .sortBy('name')
      .value();

    allPackingLineItems = _(allPackingLineItems)
      .concat(packingLineItems)
      .groupBy('name')
      .map(groups => ({
        name: groups[0].name,
        quantity: _.sumBy(groups, 'quantity')
      }))
      .sortBy('name')
      .value();

    allTesterLineItems = _(allTesterLineItems)
      .concat(testerLineItems)
      .groupBy('name')
      .map(groups => ({
        name: groups[0].name,
        quantity: _.sumBy(groups, 'quantity')
      }))
      .sortBy('name')
      .value();

  });

  return {
    displayLineItems: allDisplayLineItems,
    packingLineItems: allPackingLineItems,
    testerLineItems: allTesterLineItems
  };
};
