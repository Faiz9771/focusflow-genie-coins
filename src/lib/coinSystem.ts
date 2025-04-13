
// Basic coin system utility functions
import { toast } from "sonner";

// In a real app, this would be stored in a database
let userCoins = 120; // Default starting coins

export const getCoinBalance = () => {
  return userCoins;
};

export const earnCoins = (amount: number, reason?: string) => {
  userCoins += amount;
  
  if (reason) {
    toast.success(`Earned ${amount} coins: ${reason}`, {
      description: `New balance: ${userCoins} coins`
    });
  }
  
  return userCoins;
};

export const spendCoins = (amount: number, item?: string): boolean => {
  if (userCoins >= amount) {
    userCoins -= amount;
    
    if (item) {
      toast.success(`Spent ${amount} coins on ${item}`, {
        description: `Remaining balance: ${userCoins} coins`
      });
    }
    
    return true;
  } else {
    toast.error("Not enough coins!", {
      description: `You need ${amount} coins but only have ${userCoins}`
    });
    return false;
  }
};
