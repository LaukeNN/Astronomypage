
import React, { useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButtonComponent = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={{ "client-id": "test" }}> {/* Use 'test' for sandbox or add env var */}
            <PayPalButtons
                style={{ layout: "horizontal", height: 40, tagline: false }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        onSuccess(details);
                    });
                }}
                onError={(err) => {
                    onError(err);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalButtonComponent;
