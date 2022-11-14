import { useState } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  // const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

    // const {
    //   data,
    //   // refetch: refetchOrderCount,
    //   // isLoading:isLoadingCountOrder,isRefetching: isRefetchingCountOrder,
    // } = useAppQuery({
    //   url: "/api/orders/count",
    //   reactQueryOptions: {
    //     onSuccess: () => {
    //       setIsLoadingOrder(false);
    //     },
    //   },
    // });

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: "5 products created!" });
    } else {
      setIsLoading(false);
      setToastProps({
        content: "There was an error creating products",
        error: true,
      });
    }
  };

  // const handlePopulateorder = async () => {
  //   setIsLoading(true);
  //   const response = await fetch("/api/orders/create");

  //   if (response.ok) {
  //     await refetchOrderCount();
  //     setToastProps({ content: "5 Order created!" });
  //   } else {
  //     setIsLoading(false);
  //     setToastProps({
  //       content: "There was an error creating Orders",
  //       error: true,
  //     });
  //   }
  // };

  return (
    <>
      {toastMarkup}
      <Card
        title="Product Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 products",
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample products are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL PRODUCTS
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCount ? "-" : data.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card>

      {/* <Card
        title="Order Counter"
        sectioned
        primaryFooterAction={{
          content: "Populate 5 Order",
          onAction: handlePopulateorder,
          loading: isLoadingOrder,
        }}
      >
        <TextContainer spacing="loose">
          <p>
            Sample Order are created with a default title and price. You can
            remove them at any time.
          </p>
          <Heading element="h4">
            TOTAL ORDER
            <DisplayText size="medium">
              <TextStyle variation="strong">
                {isLoadingCountOrder ? "-" : dataOrder.count}
              </TextStyle>
            </DisplayText>
          </Heading>
        </TextContainer>
      </Card> */}
    </>
  );
}
