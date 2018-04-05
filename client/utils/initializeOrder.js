const getItemKey = item => `${item.sku.product.name},${item.sku.variety},${item.sku.size},${item.size}`;

export const initializeLineItems = (initialValues, cases) => {
  let index = 0;
  if (!initialValues.lineItems) initialValues.lineItems = [];

  const originalLineItems = initialValues.lineItems;

  const values = {};

  originalLineItems.forEach(item => ((item.quantity && item.quantity > 0) || (item.tester && item.tester.quantity && item.tester.quantity > 0)) && (values[getItemKey(item)] = item));

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

const getDisplayItemKey = item => `${item.name},${item.product.name}`;

export const initializeDisplayItems = (initialValues, displays) => {
  initialValues.displayItems = initialValues.displayItems || [];

  const originalDisplayItems = initialValues.displayItems;

  const values = {};

  originalDisplayItems.forEach(item => item.quantity && item.quantity > 0 && (values[getDisplayItemKey(item)] = item));

  /* Parse through the cases and add to the initial values */
  if (displays && displays.length > 0) displays.map((thisDisplay, index) => {
    if (!values[getDisplayItemKey(thisDisplay)]) {
      initialValues.displayItems[index] = thisDisplay;
    } else {
      initialValues.displayItems[index] = values[getDisplayItemKey(thisDisplay)];
    }
  });
};

