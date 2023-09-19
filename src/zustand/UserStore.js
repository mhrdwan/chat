import create from "zustand";

const useUserStore = create((set) => ({
  username: null,
  idUser : null,
  setUsername: (username) => set({ username }),
  setidUser: (idUser) => set({ idUser }),
}));

export default useUserStore;
