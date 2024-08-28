import { create } from "zustand";


const mainStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    token: localStorage.getItem("token") || null,
    setToken: (token) => {
        set({ token });
        localStorage.setItem("token", token);
    },
}));
export default mainStore;