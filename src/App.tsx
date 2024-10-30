import { useEffect, useState } from "react";
import { checkout } from "@imtbl/sdk";

const checkoutSDK = new checkout.Checkout();

const environmentId = "91db7008-e655-4e80-914f-635ee49c34d6";
const collectionName = "Kotlet collection";
const items = [
  {
    productId: "Kotlet1",
    qty: 1,
    name: "Kotlet 1",
    image: "https://kotlet-nft.pages.dev/tier1.webp",
    description: `The tier 1 kotlet is a simple and classic dish, representing the essence of comfort food. Made from a thin slice of meat, typically pork or chicken, it is coated in breadcrumbs and fried until golden and crispy. This kotlet is often served without fancy accompaniments, letting its crunchy exterior and tender interior shine. It's a staple of everyday meals, frequently enjoyed with a side of mashed potatoes or simple salad.`,
  },
];

export function App() {
  const [saleWidget, setSale] =
    useState<checkout.Widget<typeof checkout.WidgetType.SALE>>();

  useEffect(() => {
    (async () => {
      const widgets = await checkoutSDK.widgets({
        config: { theme: checkout.WidgetTheme.DARK },
      });
      const saleWidget = widgets.create(checkout.WidgetType.SALE);
      setSale(saleWidget);
    })();
  }, []);

  useEffect(() => {
    if (!saleWidget) return;

    saleWidget.mount("primary-sales", {
      environmentId,
      collectionName,
      items,
    });

    saleWidget.addListener(
      checkout.SaleEventType.SUCCESS,
      (data: checkout.SaleSuccess) => {
        console.log("success", data);
      },
    );
    saleWidget.addListener(
      checkout.SaleEventType.FAILURE,
      (data: checkout.SaleFailed) => {
        console.log("failure", data);
      },
    );
    saleWidget.addListener(
      checkout.SaleEventType.TRANSACTION_SUCCESS,
      (data: checkout.SaleTransactionSuccess) => {
        console.log("tx success", data);
      },
    );
    saleWidget.addListener(
      checkout.SaleEventType.PAYMENT_METHOD,
      (data: checkout.SalePaymentMethod) => {
        console.log("payment method selected", data);
      },
    );
    saleWidget.addListener(checkout.SaleEventType.CLOSE_WIDGET, () => {
      saleWidget.unmount();
    });
  }, [saleWidget]);

  return <div id="primary-sales" />;
}
