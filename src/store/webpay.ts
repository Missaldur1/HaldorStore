import { create } from "zustand";

type WebpayState = {
  amount: number;
  orderTempId: string;
  items: any[];
  customer: any;
  setData: (data: Partial<WebpayState>) => void;
  clear: () => void;
};

export const useWebpay = create<WebpayState>((set) => ({
  amount: 0,
  orderTempId: "",
  items: [],
  customer: {},
  setData: (data) => set((s) => ({ ...s, ...data })),
  clear: () => set({ amount: 0, orderTempId: "", items: [], customer: {} }),
}));