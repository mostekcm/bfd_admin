import axios from 'axios';
import domtoimage from 'dom-to-image-chrome-fix';

import * as constants from './constants';

// TODO: Grab from config from server
const baseUrl = window.config.BASE_API_URL;

// const printPDF = (id) => {
//   var doc = new jsPDF();
//   var elementHandler = {
//     '#clientPrintContent': function (element, renderer) {
//       return true;
//     }
//   };
//   var source = document.getElementById(id);
//   doc.fromHTML(
//     source,
//     15,
//     15,
//     {
//       'width': 180, 'elementHandlers': elementHandler
//     });
//   // Output
//   return doc.output();
//}

const printPDF = (id) => {
  // return domtoimage.toBlob(document.getElementById('app'), { });
  return domtoimage.toBlob(document.body.parentNode, {});
};
//         const doc = new PDFDocument;
//         const stream = doc.pipe(blobStream());
//
//         doc.image(dataUrl, 0, 0);
//
//         doc.end();
//
//         stream.on('finish', () => {
//           //const blob = stream.toBlob('application/pdf');
//           const url = stream.toBlobURL('application/pdf');
//
//           const link = document.createElement('a');
//           link.download = 'my-image-name.svg';
//           link.href = url;
//           link.click();
//           return "something";
//         });
//       }
//     );
// };

export function saveOrderPdf(order) {
  return {
    type: constants.SAVE_ORDER_PDF,
    meta: {
      orderId: order.id
    },
    payload: {
      promise: printPDF('body')
        .then((pdf) => {
          const data = new FormData();

          data.append('pdf', pdf, { type: 'image/png' });

          return axios.post(`${baseUrl}/api/orders/${order.id}/pdf`, data, {
            responseType: 'json'
          });
        })
    }
  };
}

export function requestSendOrderEmail(order) {
  return {
    type: constants.REQUEST_SEND_ORDER_EMAIL,
    meta: {
      orderId: order.id
    },
    payload: {
      promise: printPDF('body')
    }
  };
}

export function cancelSendOrderEmail() {
  return {
    type: constants.CANCEL_SEND_ORDER_EMAIL
  };
}

export function sendOrderEmail(orderId, emailText, pdf) {
  return (dispatch) => {
    const data = new FormData();

    data.append('pdf', pdf, { type: 'image/png' });
    data.append('emailText', emailText);

    dispatch({
      type: constants.SEND_ORDER_EMAIL,
      meta: {
        orderId: orderId
      },
      payload: {
        promise: axios.post(`${baseUrl}/api/orders/${orderId}/email`, data, {
          responseType: 'json'
        })
      }
    });
  };
}