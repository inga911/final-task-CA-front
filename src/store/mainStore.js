import { create } from "zustand";

// const mainStore = create((set) => ({

//     user: null,
//     setUser: (val) => set({ user: val }),

//     messages: [],
//     setMessages: (newMessages) => set({ messages: newMessages || [] }),

//     token: "",
//     setToken: val => set({ token: val }),

// }));

// export default mainStore;


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