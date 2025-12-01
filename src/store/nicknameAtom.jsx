import { atom } from 'jotai';

export const nicknameAtom = atom(
  localStorage.getItem("nickname") || "",
  (get, set, newNickname) => {
    set(nicknameAtom, newNickname);
    localStorage.setItem("nickname", newNickname);
  }
);