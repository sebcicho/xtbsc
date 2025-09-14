export const floorToTwoDecimal = (num: number): number => {
    return Math.floor(num * 100) / 100;
}