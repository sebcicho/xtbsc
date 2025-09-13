import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useApiClient } from "../../api-client";
import { currenciesMap } from "../../interfaces/currencies-map";
import { AssetDto } from "../../interfaces/asset-dto";
import { Button, Card, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { AmountInput } from "../common/amount-input";
import { SelectCurrency } from "../common/select-currency.component";
import { TransactionDto } from "../../interfaces/transaction-dto";
import { CallServerResult } from "../../interfaces/call-server-result";

interface AssetBalanceProps {
  symbol: string,
  type: string,
  onTransactionMade?: () => void;
}

interface TransactionMode {
    mode: "BUY" | "SELL";
}

export const AssetBalance: React.FC<AssetBalanceProps> = ({ symbol, type }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { apiFetchAuthenticated, apiPostAuthenticated } = useApiClient();
    const [errors, setErrors] = useState({});
    const [mode, setMode] = useState<TransactionMode>();
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [assetUserDetails, setAssetUserDetails] = useState<{ assets: AssetDto[]} | null >(null);

    const assets = assetUserDetails?.assets;
    const lastAsset = assets?.[assets.length - 1];

    const units = lastAsset?.quantity ?? 0;
    const heldValue = lastAsset ? Number((lastAsset.quantity * lastAsset.price).toFixed(2)) : 0;
    const headerText = mode?.mode === "BUY" ? "Buy" : mode?.mode === "SELL" ? "Sell" :"";

    const fetchAssetUserDetails = async () => {
          const res = await apiFetchAuthenticated("http://localhost:8080/user/asset?symbol=" + symbol);
          const data = await res.json();
          setAssetUserDetails(data);
      };
      
      useEffect(() => {
        if(isAuthenticated && user) {
            fetchAssetUserDetails();
        }
      }, [isAuthenticated, user]);

    const callServer = async (
        data: { amount: number; currency: string; price?: number }
    ): Promise<{ error: string | null }> => {
        try {
            const transaction: TransactionDto = {
                assetType: type,
                assetSymbol: symbol,
                quantity: mode?.mode === "BUY" ? data.amount : -data.amount,
                price: data.price,
                timestampTransaction: Date.now(),
                currency: data.currency,
            };

            const response: CallServerResult = await apiPostAuthenticated(
                "http://localhost:8080/transaction/trade",
                { transaction }
            ).then(async (res) => {
                const text = await res.text();
                return text ? JSON.parse(text) : {};
            });

            if (response?.error && response?.reason) {
                return { error: response.error + ": " + response.reason };
            }

            return { error: null };
        } catch (err: any) {
            console.error("Error while performing transactions:", err);
            return {
                error: "Unexpected error while performing transactions",
            };
        }
    };

    const onBuy = () => {
        setMode({ mode: "BUY" });
        onOpen();
    };

    const onSell = () => {
        setMode({ mode: "SELL" });
        onOpen();
    }

    return (isAuthenticated && user && assetUserDetails) ?
        <div>
          <Card className="p-6">
            <p className="mb-2">
              <Button variant="bordered" color="success" onPress={onBuy}>
                  Buy
              </Button>
            </p>
            <p className="mb-2">
              <Button variant="bordered" color="danger" onPress={onSell}>
                  Sell
              </Button>
            </p>
            <p className="font-semibold mb-1">
                    Units: <span className="font-bold">{units}</span>
            </p>
            <p className="font-semibold mb-1">
                    Held value: <span className="font-bold">{`${heldValue} ${type==='Currency' ? currenciesMap[symbol] ?? symbol : '$'}`}</span>
            </p>
          </Card>
          <Modal isOpen={isOpen} placement="top-center"
                    onOpenChange={() => {
                        setErrors({});
                        onOpenChange();
                    }}
                    classNames={{
                        base: "bg-gray-950 text-foreground",
                        header: "text-xl font-bold",
                        body: "text-foreground",
                        footer: "border-t border-divider",
                    
                    }}>
                <Form
                    validationErrors={errors}
                    onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault();

                        const fd = new FormData(e.currentTarget);
                        const amountRaw = fd.get("amount");
                        const cleanedAmount = String(amountRaw ?? "")
                            .replace(/,/g, "")
                            .trim();
                            
                        const currencyRaw = fd.get("currency");
                        const payload = {
                            amount: Number(cleanedAmount ?? 0),
                            currency: String(currencyRaw ?? ""),
                            mode: mode?.mode
                        };

                        const result = await callServer(payload);
                        if (result.error === null) {
                            setErrors({});
                            onClose();
                            fetchAssetUserDetails();
                        } else {
                            setErrors({ amount: result.error });
                        }
                    }}
                >
                  <ModalContent >
                  {(onClose) => (
                      <>
                      <ModalHeader className="flex flex-col gap-1 text-white">{headerText}</ModalHeader>
                      <ModalBody>
                          <AmountInput name="amount" label="Amount"/>
                          <SelectCurrency name="currency" />
                      </ModalBody>
                      <ModalFooter>
                          <Button color="danger" variant="flat" onPress={onClose}>
                              Close
                          </Button>
                          <Button color="primary" type="submit" variant="ghost">
                              Confirm
                          </Button>
                      </ModalFooter>
                      </>
                  )}
                  </ModalContent>
                </Form>
            </Modal>
           

        </div>
        : null;
}