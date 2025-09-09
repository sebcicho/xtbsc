import { Button, Card, Form, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, NumberInput, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@heroui/react";
import { useSelector } from "react-redux";
import { RootState } from "../state/redux-configurator";
import { useEffect, useMemo, useState } from "react";
import { fetchMetadata, useAppDispatch } from "../state/metadata-reducer";
import { AssetDto } from "../interfaces/asset-dto";
import { currenciesMap } from "../interfaces/currencies-map";
import { useApiClient } from "../api-client";
import { TransactionDto } from "../interfaces/transaction-dto";

interface AccountBalanceProps {
    assets: AssetDto[];
    onFundsAdded?: () => void;
}

interface CallServerResult {
    error?: string;
    reason?: string;
}
export const AccountBalance: React.FC<AccountBalanceProps> = ({ assets, onFundsAdded }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const { apiPostAuthenticated } = useApiClient();
    const currencyMetadata = useSelector((state: RootState) => state.metadata.currencyMetadata);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchMetadata());
    }, [dispatch]);

    useEffect(() => {
        if (currencyMetadata) {
            setIsLoading(false);
        }
    }, [currencyMetadata]);

    const currencyAssetsMap = useMemo(() => {
    return assets
        .filter(asset => asset.assetType === "CURRENCY")
        .reduce<Record<string, number>>((acc, asset) => {
        acc[asset.assetSymbol] = asset.quantity;
        return acc;
        }, {});
    }, [assets]);

    const mergedCurrencyData = useMemo(() => {
        return (currencyMetadata ?? []).map((symbol) => ({
            symbol,
            quantity: currencyAssetsMap[symbol] ?? 0, // default to 0 if missing
        }));
    }, [currencyMetadata, currencyAssetsMap]);


    const callServer = async (
        data: { amount: number; currency: string; price?: number }
    ): Promise<{ error: string | null }> => {
        try {
            const transaction: TransactionDto = {
                assetType: "CURRENCY",
                assetSymbol: data.currency,
                quantity: data.amount,
                price: data.price,
                timestampTransaction: Date.now(),
                currency: data.currency,
            };

            const response: CallServerResult = await apiPostAuthenticated(
                "http://localhost:8080/transaction/account",
                { transaction }
            ).then(res => res.json());

            if (response?.error && response?.reason) {
                return { error: response.error + ": " + response.reason };
            }

            return { error: null };
        } catch (err: any) {
            return {
                error: "Unexpected error while adding funds",
            };
        }
    };

  
    return (
        <Card>
            <div className="m-4">
                <div className='flex w-full justify-between items-center mb-8'>
                    <h1 className="text-1xl font-bold text-foreground">Account Balance</h1>
                    <Button onPress={onOpen}>Add funds</Button>
                </div>
                
                 <Table
                    aria-label="Account balance table"
                    isStriped
                    removeWrapper
                    >
                    <TableHeader>
                        <TableColumn key="symbol" allowsSorting>
                            Currency
                        </TableColumn>
                        <TableColumn key="quantity" allowsSorting>
                            Amount
                        </TableColumn>
                    </TableHeader>

                    <TableBody
                        isLoading={isLoading}
                        items={mergedCurrencyData}
                        loadingContent={<Spinner label="Loading..." />}
                        emptyContent={"No currencies available"}
                    >
                        {(item) => (
                        <TableRow key={item.symbol}>
                            <TableCell>{item.symbol}</TableCell>
                            <TableCell>{item.quantity} {currenciesMap[item.symbol]}</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}
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
                        const currencyRaw = fd.get("currency");
                        const payload = {
                            amount: Number(amountRaw ?? 0),
                            currency: String(currencyRaw ?? ""),
                        };

                        const result = await callServer(payload);
                        console.log(result);
                        if (result.error === null) {
                            setErrors({});
                            onClose();
                            if (onFundsAdded) {
                                onFundsAdded();
                            }
                        } else {
                            setErrors({ amount: result.error });
                        }
                    }}
                >
                    <ModalContent >
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1 text-white">Add funds</ModalHeader>
                        <ModalBody>
                            <NumberInput
                                isRequired
                                classNames={{
                                    innerWrapper: "bg-gray-950 text-white",
                                    mainWrapper: "bg-gray-950 text-white",

                                }}
                                label="Funds"
                                placeholder="Enter the amount"
                                variant="bordered"
                                name="amount"
                            />
                            <Select
                                isRequired 
                                variant="bordered"
                                classNames={{
                                    trigger: "text-white bg-gray-950",
                                    value: "text-white bg-gray-950 group-data-[has-value=true]:!text-white",
                                    popoverContent: "bg-gray-950 text-white",
                                    listbox: "bg-gray-950 text-white",
                                    innerWrapper: "bg-gray-950 text-white",
                                    mainWrapper: "bg-gray-950 text-white",

                                }}
                                label="Currency" placeholder="Select a currency"
                                name="currency"
                                >
                                {Object.entries(currenciesMap).map(([key, ]) => (
                                    <SelectItem
                                        key={key}>{key}</SelectItem>
                                ))}
                            </Select>
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
        </Card>
    );
}