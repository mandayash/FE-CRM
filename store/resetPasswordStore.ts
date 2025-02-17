import { create } from "zustand";

interface ResetPasswordState {
  email: string;
  isOTPSent: boolean;
  isOTPVerified: boolean;
  setEmail: (email: string) => void;
  setOTPSent: (status: boolean) => void;
  setOTPVerified: (status: boolean) => void;
  reset: () => void;
}

export const useResetPasswordStore = create<ResetPasswordState>((set) => ({
  email: "",
  isOTPSent: false,
  isOTPVerified: false,
  setEmail: (email) => set({ email }),
  setOTPSent: (status) => set({ isOTPSent: status }),
  setOTPVerified: (status) => set({ isOTPVerified: status }),
  reset: () => set({ email: "", isOTPSent: false, isOTPVerified: false }),
}));
