import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useCallback, use } from "react";
import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

// Obtener el ancho de la pantalla
const { width } = Dimensions.get("window");
const AnimatedCircle = Animated.createAnimatedComponent(Circle); // Componente de círculo animado

// props de la barra de progreso circular
interface CircularProgressProps {
  progress: number;
  totalDosage: number;
  completeDoses: number;
}

// Componente de barra de progreso circular
function CircularProgress({
  progress,
  totalDosage,
  completeDoses,
}: CircularProgressProps) {
  const animatedValue = useRef(new Animated.Value(0)).current; // Valor animado para la barra de progreso
  const size = width * 0.5; // Tamaño del círculo
  const strokeWidth = 15; // Ancho del borde del círculo
  const radius = (size - strokeWidth) / 2; // Radio del círculo
  const circumference = 2 * Math.PI * radius; // Circunferencia del círculo

  useEffect(() => {
    // Animar el valor de la barra de progreso
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]); // Reiniciar la animación cuando el progreso cambie

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0], // Calcular el desplazamiento del trazo
  });

  return (
    <View>
      <View>
        <Text> {Math.round(progress)}%</Text>
        <Text>
          {completeDoses} de {totalDosage} dosis
        </Text>
      </View>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="lightgray"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#1D4ED8", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>Progreso Diario</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {}
          <CircularProgress
            progress={50}
            totalDosage={10}
            completeDoses={5}
          />{" "}
          //cuando haga el hook va a cambiar el valor
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  greeting: {
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  notificationButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    marginLeft: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#146922",
    minWidth: 20,
  },
  notificationCount: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  progressDetails: {
    fontSize: 11,
    color: "white",
    fontWeight: "bold",
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  progressTextContainer: {
    position: "absolute",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentage: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  progressLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "bold",
  },
});
