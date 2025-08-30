import { Card, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useSelector } from "react-redux";
import { RootState } from "../state/redux-configurator";
import { useEffect, useMemo, useState } from "react";
import { fetchMetadata, useAppDispatch } from "../state/metadata-reducer";
import { AssetDto } from "../interfaces/asset-dto";
import { currenciesMap } from "../interfaces/currencies-map";

interface AccountBalanceProps {
  assets: AssetDto[]
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ assets }) => {
    const [isLoading, setIsLoading] = useState(true);
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

    return (
        <Card>
            <div className="m-4">
                <h1 className="text-1xl font-bold mb-8 text-foreground">Account Balance</h1>
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
            </div>
        </Card>
    );
}