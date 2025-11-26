import { create } from "zustand";

interface WebpayCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  reference?: string;
}

type WebpayState = {
  amount: number;
  orderTempId: string;
  items: any[];
  customer: WebpayCustomer;
  setData: (data: Partial<WebpayState>) => void;
  clear: () => void;
};

export const useWebpay = create<WebpayState>((set) => ({
  amount: 0,
  orderTempId: "",
  items: [],
  customer: {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
    reference: "",
  },
  setData: (data) => set((s) => ({ ...s, ...data })),
  clear: () =>
    set({
      amount: 0,
      orderTempId: "",
      items: [],
      customer: {
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        region: "",
        reference: "",
      },
    }),
}));