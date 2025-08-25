import { DataPoint } from "../interfaces/data-point";

interface AssetInfoProps {
  currentData: DataPoint[],
  name: string,
  symbol: string,
  type: string,
}

export const AssetInfo: React.FC<AssetInfoProps> = ({ currentData, name, symbol, type }) => {
    const currentPrice = Number(currentData[currentData.length - 1]?.[symbol]);
  const high = Math.max(
    ...currentData.map(dp => {
      const value = Number(dp[symbol]);
      return isNaN(value) ? 0 : value;
    })
  );
  const low = Math.min(
    ...currentData.map(dp => {
      const value = Number(dp[symbol]);
      return isNaN(value) ? 0 : value;
    })
  );

  return (
    <div>
      <p className="font-semibold mb-1">Name: <span className="font-normal">{name}</span></p>
      <p className="font-semibold mb-1">Type: <span className="font-normal">{type === 'ST' ? 'Stock' : type}</span></p>
      <p className="font-semibold mb-1">
        Current Price: <span className="font-bold">{isNaN(currentPrice) ? '-' : `${currentPrice} $`}</span>
      </p>
      <p className="font-semibold mb-1">
        Time high: <span style={{ color: '#45be86ff' }} className="font-bold">{isFinite(high) ? `${high} $` : '-'}</span>
      </p>
      <p className="font-semibold mb-1">
        Time low: <span style={{ color: '#af366fff' }} className="font-bold">{isFinite(low) ? `${low} $` : '-'}</span>
      </p>
    </div>
  );
};