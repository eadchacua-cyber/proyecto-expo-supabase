import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../supabase';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  talla: string;
}

export default function TiendaRopaCRUD() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [talla, setTalla] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);

  // LEER (Read)
  const cargarProductos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      Alert.alert('Error al cargar', error.message);
    } else {
      setProductos(data || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // CREAR (Create) y ACTUALIZAR (Update)
  const guardarProducto = async () => {
    if (!nombre.trim() || !precio.trim() || !talla.trim()) {
      Alert.alert('Campos incompletos', 'Ingresa nombre, precio y talla.');
      return;
    }

    const precioNumero = parseFloat(precio);
    if (isNaN(precioNumero)) {
      Alert.alert('Precio inválido', 'Ingresa un número válido para el precio.');
      return;
    }

    if (editandoId !== null) {
      const { error } = await supabase
        .from('productos')
        .update({
          nombre: nombre.trim(),
          precio: precioNumero,
          talla: talla.trim().toUpperCase(),
        })
        .eq('id', editandoId);

      if (error) {
        Alert.alert('Error al actualizar', error.message);
        return;
      }
      setEditandoId(null);
    } else {
      const { error } = await supabase.from('productos').insert([
        {
          nombre: nombre.trim(),
          precio: precioNumero,
          talla: talla.trim().toUpperCase(),
        },
      ]);

      if (error) {
        Alert.alert('Error al crear', error.message);
        return;
      }
    }

    setNombre('');
    setPrecio('');
    setTalla('');
    cargarProductos();
  };

  // Preparar edición
  const iniciarEdicion = (item: Producto) => {
    setEditandoId(item.id);
    setNombre(item.nombre);
    setPrecio(String(item.precio));
    setTalla(item.talla);
  };

  // ELIMINAR (Delete)
  const eliminarProducto = async (id: number) => {
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) {
      Alert.alert('Error al eliminar', error.message);
    } else {
      cargarProductos();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Tienda de Ropa - Inventario</Text>

      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la prenda (ej. Camiseta Oversize)"
          value={nombre}
          onChangeText={setNombre}
        />
        <View style={styles.filaInputs}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Precio (ej. 25.50)"
            keyboardType="numeric"
            value={precio}
            onChangeText={setPrecio}
          />
          <TextInput
            style={[styles.input, { width: 100 }]}
            placeholder="Talla (S, M, L)"
            value={talla}
            onChangeText={setTalla}
          />
        </View>

        <TouchableOpacity style={styles.botonPrincipal} onPress={guardarProducto}>
          <Text style={styles.textoBotonPrincipal}>
            {editandoId !== null ? 'Actualizar Prenda' : 'Agregar Prenda'}
          </Text>
        </TouchableOpacity>

        {editandoId !== null && (
          <TouchableOpacity
            style={styles.botonCancelar}
            onPress={() => {
              setEditandoId(null);
              setNombre('');
              setPrecio('');
              setTalla('');
            }}
          >
            <Text style={styles.textoBotonCancelar}>Cancelar edición</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) => String(item.id)}
        refreshing={cargando}
        onRefresh={cargarProductos}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay prendas registradas todavía.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombrePrenda}>{item.nombre}</Text>
              <Text style={styles.detallePrenda}>
                Talla: {item.talla} • ${Number(item.precio).toFixed(2)}
              </Text>
            </View>
            <View style={styles.acciones}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => iniciarEdicion(item)}
              >
                <Text style={styles.textoAccion}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => eliminarProducto(item.id)}
              >
                <Text style={styles.textoAccion}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    padding: 16,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
    textAlign: 'center',
  },
  formulario: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  filaInputs: {
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
  },
  botonPrincipal: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonPrincipal: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonCancelar: {
    marginTop: 8,
    alignItems: 'center',
  },
  textoBotonCancelar: {
    color: '#6b7280',
    fontSize: 14,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  nombrePrenda: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  detallePrenda: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  acciones: {
    flexDirection: 'row',
    gap: 8,
  },
  botonEditar: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  botonEliminar: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoAccion: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  vacio: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
    fontSize: 15,
  },
});