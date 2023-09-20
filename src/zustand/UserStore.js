import create from "zustand";

const useUserStore = create((set) => ({
  username: null,
  idUser : null,
  NamaPengambilBensin: null,
  jamPengambilBensin: null,
  setUsername: (username) => set({ username }),
  setidUser: (idUser) => set({ idUser }),
  setNamaPengambilBensin: (NamaPengambilBensin) => set({ NamaPengambilBensin }),
  setjamPengambilBensin: (jamPengambilBensin) => set({ jamPengambilBensin }),
}));

export default useUserStore;
