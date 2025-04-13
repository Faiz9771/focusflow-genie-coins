
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Get current user's coin balance from Supabase
export const getCoinBalance = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.error("User not logged in");
    return 0;
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', session.user.id)
      .single();
      
    if (error) throw error;
    
    return data?.coins || 0;
  } catch (error) {
    console.error("Error fetching coin balance:", error);
    return 0;
  }
};

// For backward compatibility with existing code
// This function returns a cached value (120) instead of making a DB call
export const getCoinBalanceSync = () => {
  return 120; // Default value for components that expect a sync function
};

// Earn coins - increases user's balance
export const earnCoins = async (amount: number, reason?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.error("User not logged in");
    toast.error("You need to be logged in to earn coins");
    return 0;
  }
  
  try {
    // First get current coins
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', session.user.id)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentCoins = profile?.coins || 0;
    const newBalance = currentCoins + amount;
    
    // Update coins in profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coins: newBalance })
      .eq('id', session.user.id);
      
    if (updateError) throw updateError;
    
    // Show toast message
    if (reason) {
      toast.success(`Earned ${amount} coins: ${reason}`, {
        description: `New balance: ${newBalance} coins`
      });
    }
    
    return newBalance;
  } catch (error) {
    console.error("Error earning coins:", error);
    toast.error("Failed to update coin balance");
    return 0;
  }
};

// Spend coins - decreases user's balance if they have enough
export const spendCoins = async (amount: number, item?: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    console.error("User not logged in");
    toast.error("You need to be logged in to spend coins");
    return false;
  }
  
  try {
    // First get current coins
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', session.user.id)
      .single();
      
    if (fetchError) throw fetchError;
    
    const currentCoins = profile?.coins || 0;
    
    // Check if user has enough coins
    if (currentCoins < amount) {
      toast.error("Not enough coins!", {
        description: `You need ${amount} coins but only have ${currentCoins}`
      });
      return false;
    }
    
    // Update coins in profile
    const newBalance = currentCoins - amount;
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ coins: newBalance })
      .eq('id', session.user.id);
      
    if (updateError) throw updateError;
    
    // Show toast message
    if (item) {
      toast.success(`Spent ${amount} coins on ${item}`, {
        description: `Remaining balance: ${newBalance} coins`
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error spending coins:", error);
    toast.error("Failed to update coin balance");
    return false;
  }
};
