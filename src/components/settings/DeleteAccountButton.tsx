import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface DeleteAccountButtonProps {
  onDeleted: () => void;
}

export function DeleteAccountButton({ onDeleted }: DeleteAccountButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      setIsDeleting(true);

      // Call the server-side function to delete the user account
      const { error } = await supabase.rpc('delete_user_account');

      if (error) throw error;
      
      toast.success('Your account has been deleted');
      onDeleted();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={cn(
        "w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg",
        "text-white font-medium transition-colors",
        isConfirming
          ? "bg-red-600 hover:bg-red-700"
          : "bg-red-500 hover:bg-red-600",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      <Trash2 className="w-5 h-5" />
      <span>
        {isDeleting ? 'Deleting...' : isConfirming ? 'Click again to confirm' : 'Delete Account'}
      </span>
    </button>
  );
}