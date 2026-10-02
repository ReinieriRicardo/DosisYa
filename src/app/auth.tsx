import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function AuthScreen() {
  //estados
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //renderizado de la pantalla de autenticación
  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <View>
        <View>
          <Ionicons name="medical" size={80} color="white" />
        </View>
      </View>

      <Text>DosisYa</Text>
      <Text>Nunca vuelvas a olvidar tu medicamento</Text>

      <View>
        <Text>Bienvenido de vuelta!</Text>
        <Text>
          {hasBiometrics
            ? "Usa tu huella digital para iniciar sesión"
            : "Inicia sesión con tu contraseña"}
        </Text>

        <TouchableOpacity>
          <Ionicons
            name={hasBiometrics ? "finger-print-outline" : "keypad-outline"}
            size={24}
            color="white"
          />
          <Text>
            {isAuthenticated
              ? "Autenticando.."
              : hasBiometrics
                ? "Iniciar sesión con huella digital"
                : "Iniciar sesión con contraseña"}

            {error && (
              <View>
                <Ionicons name="alert-circle" size={20} color="#f44336" />
                <Text>{error}</Text>
              </View>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

//estilos de la pantalla de autenticación
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
