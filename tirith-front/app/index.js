import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator } from 'react-native';
import { fetchData, insertData } from '../utils/supabase';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const result = await fetchData('items');
      if (result) {
        setData(result);
      }
    } catch (e) {
      setError("Erreur de connexion à la base de données");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function addItem() {
    if (!newItem.trim()) return;
    
    try {
      setLoading(true);
      const result = await insertData('items', { name: newItem });
      if (result) {
        setData([...data, ...result]);
        setNewItem('');
      }
    } catch (e) {
      setError("Erreur lors de l'ajout de l'élément");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Si vous n'avez pas encore configuré Supabase, on affiche un message d'instruction
  if (!global.supabaseConfigured) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Configuration PostgreSQL avec Supabase</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Pour configurer Supabase :</Text>
          <Text style={styles.infoText}>1. Créez un compte sur supabase.com</Text>
          <Text style={styles.infoText}>2. Créez un nouveau projet</Text>
          <Text style={styles.infoText}>3. Obtenez votre URL et clé anon depuis les paramètres API</Text>
          <Text style={styles.infoText}>4. Mettez à jour le fichier utils/supabase.js avec vos identifiants</Text>
          <Text style={styles.infoText}>5. Créez une table 'items' avec une colonne 'name' de type text</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PostgreSQL avec Supabase</Text>
      
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="Nouvel élément"
        />
        <Button title="Ajouter" onPress={addItem} disabled={loading} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Aucun élément trouvé</Text>
          )}
        />
      )}
      
      <Button title="Actualiser" onPress={loadData} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    marginBottom: 8,
  },
}); 