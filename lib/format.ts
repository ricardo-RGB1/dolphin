// create a typescript function that formats a number to a string and uses the Intl.NumberFormat to format the number. The return value should be in U.S. dollars and should have a minimum of 2 decimal places.
// Example: format(123456.789) // $123,456.79
const formatPrice = (price: number): string => { 
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
};

export default formatPrice;