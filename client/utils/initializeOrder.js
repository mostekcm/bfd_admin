const getItemKey = item => `${item.sku.product.name},${item.sku.variety},${item.sku.size}`;

export const initializeLineItems = (initialValues, cases) => {
  let index = 0;
  if (!initialValues.lineItems) initialValues.lineItems = [];

  const originalLineItems = initialValues.lineItems;

  const values = {};

  originalLineItems.forEach(item => item.quantity && item.quantity > 0 && (values[getItemKey(item)] = item));

  /* Parse through the cases and add to the initial values */
  if (cases && cases.length > 0) cases.forEach((thisCase) => {
    (thisCase.sku.varieties.length > 0 ? thisCase.sku.varieties : ['']).forEach((variety) => {
      const varietyCase = JSON.parse(JSON.stringify(thisCase));
      varietyCase.sku.variety = variety;
      if (!values[getItemKey(varietyCase)]) {
        initialValues.lineItems[index] = varietyCase;
      } else {
        initialValues.lineItems[index] = values[getItemKey(varietyCase)];
      }
      ++index;
    });
  });
};

export const initializeDisplayItems = (initialValues, displays) => {
  if (!initialValues.displayItems || initialValues.displayItems.length == 0) {
    initialValues.displayItems = [];

    /* Parse through the cases and add to the initial values */
    if (displays && displays.length > 0) displays.forEach((thisDisplay) => {
      initialValues.displayItems.push(thisDisplay);
    });
  }
};

