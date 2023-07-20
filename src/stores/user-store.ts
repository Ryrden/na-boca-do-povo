import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    //TODO: Definir o tipo de congressPersonFavoriteList como CongressPerson[]
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
