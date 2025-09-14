import { useState } from "react";
import { AssetDto } from "../../interfaces/asset-dto";
import { Card, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { floorToTwoDecimal } from "../../utils/floor-util";

interface AssetsSummaryProps {
    assets: AssetDto[];
}

export const AssetsSummary: React.FC<AssetsSummaryProps> = ({ assets }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});


    return (        
        <Card>
            <div className="m-4">
                <div className='flex w-full justify-between items-center mb-8'>
                    <h1 className="text-1xl font-bold text-foreground">Assets Summary</h1>
                    </div>
                
                 <Table
                    aria-label="Account balance table"
                    isStriped
                    removeWrapper
                    >
                    <TableHeader>
                        <TableColumn key="symbol" allowsSorting>
                            Symbol
                        </TableColumn>
                        <TableColumn key="type" allowsSorting>
                            Type
                        </TableColumn>
                        <TableColumn key="quantity" allowsSorting>
                            Amount
                        </TableColumn>
                        <TableColumn key="quantity" allowsSorting>
                            Value
                        </TableColumn>
                    </TableHeader>

                    <TableBody
                        isLoading={isLoading}
                        items={assets.filter(item => item.quantity > 0 && item.assetType !== 'CURRENCY')}
                        loadingContent={<Spinner label="Loading..." />}
                        emptyContent={"No assets"}
                    >
                        {(item) => (
                        <TableRow key={item.assetSymbol}>
                            <TableCell>{item.assetSymbol}</TableCell>
                            <TableCell>{item.assetType}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{floorToTwoDecimal(item.quantity * item.price)}</TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};