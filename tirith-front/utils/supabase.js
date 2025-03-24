import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchData(table) {
  const { data, error } = await supabase
    .from(table)
    .select('*');
  
  if (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return null;
  }
  
  return data;
}

export async function insertData(table, record) {
  const { data, error } = await supabase
    .from(table)
    .insert(record)
    .select();
  
  if (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
    return null;
  }
  
  return data;
} 