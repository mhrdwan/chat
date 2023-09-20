import create from "zustand";

const useUserStore = create((set) => ({
  username: null,
  idUser: null,
  NamaPengambilBensin: null,
  jamPengambilBensin: null,
  HitungBerapaLiter: null,
  Displayzutand: null,
  TerbaruAmbil: null,
  setUsername: (username) => set({ username }),
  setidUser: (idUser) => set({ idUser }),
  setNamaPengambilBensin: (NamaPengambilBensin) => set({ NamaPengambilBensin }),
  setjamPengambilBensin: (jamPengambilBensin) => set({ jamPengambilBensin }),
  setHitungBerapaLiter: (HitungBerapaLiter) => set({ HitungBerapaLiter }),
  setDisplayzutand: (Displayzutand) => set({ Displayzutand }),
  setTerbaruAmbil: (TerbaruAmbil) => set({ TerbaruAmbil }),
}));

export default useUserStore;
