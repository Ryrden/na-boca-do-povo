import { ref, Ref } from 'vue';
import useSupabase from 'boot/supabase';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface useAuthUserType {
  user: Ref<User | null>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
  isUnauthenticated: () => boolean;
  register: (email: string, password: string) => Promise<User | null>;
  update: (data: Partial<User>) => Promise<User | null>;
}

const user: Ref<User | null> = ref(null);

function useAuthUser(): useAuthUserType {
  const { supabase }: { supabase: SupabaseClient } = useSupabase();

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<User> => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      switch (error.status) {
        case 400:
          throw new Error(
            'E-mail ou senha incorretos. Caso não tenha uma conta, por favor, registre-se.'
          );

        default:
          throw new Error('Serviço indisponível, tente novamente mais tarde.');
      }
    }

    user.value = data.user;

    return user.value;
  };

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
  };

  /**
   * Check if the user is logged in or not
   */
  const isLoggedIn = (): boolean => !!user.value;

  /**
   * Check if the user is not logged
   */
  const isUnauthenticated = (): boolean => !isLoggedIn();

  /**
   * Register
   */
  const register = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      switch (error.status) {
        case 400:
          throw new Error(
            'Email já cadastrado, por favor, tente um e-mail diferente.'
          );

        case 422:
          throw new Error('A senha deve conter no mínimo 6 caracteres.');

        default:
          throw new Error('Serviço indisponível, tente novamente mais tarde.');
      }
    }

    user.value = data.user;

    return user.value;
  };

  /**
   * Update user email, password, or meta data
   */
  const update = async (userToUpdate: Partial<User>): Promise<User | null> => {
    const { data, error } = await supabase.auth.updateUser(userToUpdate);
    if (error) throw error;
    user.value = data.user;

    return user.value;
  };

  return {
    user,
    login,
    isLoggedIn,
    logout,
    register,
    update,
    isUnauthenticated,
  };
}

export { useAuthUser };
export type { useAuthUserType };
