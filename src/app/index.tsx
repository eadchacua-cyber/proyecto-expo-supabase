import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InicioScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600' }}
        style={styles.banner}
      />

      <Text style={styles.titulo}>Tienda de Ropa - Trabajo Grupal</Text>
      <Text style={styles.subtitulo}>
        Gestión rápida de inventario y catálogo de prendas urbanas.
      </Text>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitulo}>MVP - Entrega 1</Text>
        <Text style={styles.cardTexto}>• Consulta prendas por categoría</Text>
        <Text style={styles.cardTexto}>• Verifica tallas y precios en tiempo real</Text>
        <Text style={styles.cardTexto}>• Registra nuevos ingresos al inventario</Text>
      </View>

      <TouchableOpacity
        style={styles.botonPrincipal}
        onPress={() => router.push('/catalogo')}
      >
        <Text style={styles.textoBoton}>Ver Catálogo de Prendas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardInfo: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 25,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  cardTexto: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  botonPrincipal: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});