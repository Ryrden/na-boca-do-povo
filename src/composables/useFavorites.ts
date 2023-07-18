import { SupabaseClient } from '@supabase/supabase-js';
import useSupabase from 'src/boot/supabase';

interface Favorite {
  user_id: string;
  favorite_congress_person_id: number;
  favorite_congress_person_image_url: string;
  favorite_congress_person_name: string;
  favorite_congress_person_party: string;
}

function useFavorites() {
  const { supabase }: { supabase: SupabaseClient } = useSupabase();

  // Function to fetch favorites from the "favorites" table
  const fetchFavorites = async (user_logged_id: string): Promise<Favorite[]> => {
    const { data, error } = await supabase.from('favorites').select('*').eq('user_id', user_logged_id);
    if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
    if (data) {
        return data;
    }

    return [];
  };

  // Function to add a new favorite to the "favorites" table
  const addFavorite = async (user_logged_id: string, id: number, imageUrl: string, name: string, party: string,): Promise<void> => {

    const favorite: Favorite = {
      user_id: user_logged_id,
      favorite_congress_person_id: id,
      favorite_congress_person_image_url: imageUrl,
      favorite_congress_person_name: name,
      favorite_congress_person_party: party,
    }

    const { error } = await supabase.from('favorites').insert(favorite);
    if (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
  };

  const deleteFavorite = async (user_logged_id: string, id: number) => {
    const { error } = await supabase.from('favorites').delete().eq('user_id', user_logged_id).eq('favorite_congress_person_id', id);
    if (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  }

  return {
    fetchFavorites,
    addFavorite,
    deleteFavorite,
  };
}

export { useFavorites };