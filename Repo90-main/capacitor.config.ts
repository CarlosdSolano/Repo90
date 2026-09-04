import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.recomposicion90.app",
  appName: "Recomposición 90",
  webDir: "dist",
  bundledWebRuntime: false,
  android: {
    backgroundColor: "#0A0B0D",
    allowMixedContent: false
  },
  ios: {
    contentInset: "automatic"
  }
};

export default config;
