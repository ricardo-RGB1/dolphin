import { create } from "zustand";

type ConfettiStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useConfettiStore = create<ConfettiStore>((set) => ({ 
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));


// * create is a function that allows us to create a store
// * set is a function that allows us to update the store