import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";

export default function AuthScreen() {
  //estados
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null); //que pueda ser string o null
  const router = useRouter();

  //efecto para verificar si el usuario tiene biometría disponible al montar el componente
  useEffect(() => {
    const checkBiometrics = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setHasBiometrics(hasHardware && isEnrolled);
    };

    void checkBiometrics();
  }, []);

  //función para autenticar al usuario
  const authenticate = async () => {
    try {
      setIsAuthenticated(true);
      setError(null);

      //verificar si el dispositivo tiene biometría disponible y configurada
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      //si el dispositivo no tiene biometría o no está configurada, mostrar un error
      if (!hasHardware || !isEnrolled || supportedTypes.length === 0) {
        setIsAuthenticated(false);
        setError("Biometría no disponible");
        return;
      }

      //autenticación biométrica o con contraseña según la disponibilidad
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage:
          hasHardware && isEnrolled
            ? "Autenticación biométrica"
            : "Autenticación con contraseña",
        fallbackLabel: "Usar contraseña",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      //si la autenticación es exitosa, redirigir al usuario a la pantalla principal
      if (auth.success) {
        router.push("/home");
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
      setError("Error al autenticar, intente de nuevo");
    }
  };

  //renderizado de la pantalla de autenticación
  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={72} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>DosisYa</Text>
          <Text style={styles.subtitle}>
            Nunca vuelvas a olvidar tu medicamento
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.instructions}>
            {hasBiometrics
              ? "Usa tu huella digital para iniciar sesión"
              : "Inicia sesión con tu contraseña"}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isAuthenticated}
            onPress={authenticate}
            style={[
              styles.authButton,
              isAuthenticated && styles.authButtonDisabled,
            ]}
          >
            <Ionicons
              name={hasBiometrics ? "finger-print-outline" : "keypad-outline"}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.authButtonText}>
              {isAuthenticated
                ? "Autenticando..."
                : hasBiometrics
                  ? "Iniciar sesión con huella digital"
                  : "Iniciar sesión con contraseña"}
            </Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#B42318" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

//estilos de la pantalla de autenticación
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 36,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  card: {
    width: "100%",
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    color: "#15294F",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  instructions: {
    color: "#5F6B7A",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 24,
    textAlign: "center",
  },
  authButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#31558F",
    borderRadius: 16,
  },
  authButtonDisabled: {
    opacity: 0.65,
  },
  authButtonText: {
    flexShrink: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FEE4E2",
    borderRadius: 12,
  },
  errorText: {
    flex: 1,
    color: "#B42318",
    fontSize: 14,
    lineHeight: 20,
  },
});
