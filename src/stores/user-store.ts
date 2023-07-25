import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    congressPersonFavoriteList: [] as any[],
  }),

  getters: {
    name: (state) => state.name,
    congressPersonFavoriteList: (state) => state.congressPersonFavoriteList,
  },

  actions: {
    setName(name: string) {
      this.name = name;
    },
    setCongressPersonFavoriteList(congressPersonFavoriteList: any[]) {
      this.congressPersonFavoriteList = congressPersonFavoriteList;
    }
  }
});
