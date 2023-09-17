import create from "zustand";

const useUserStore = create((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
}));

export default useUserStore;
