//firebase
import { useI18n } from "vue-i18n";
import { messaging, getToken, onMessage } from "./firebase";
import { useToastStorage } from "./stores/ToasterStorage";
export const ask_for_permission = async () => {
  const { t } = useI18n();

  const { notify } = useToastStorage();
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BCBZKNKL8JVeOqWGsWtSRKi2CIzxwbLmkx008q7dY7JcVcMIfRYCuBkpkqh8gBZJM_ibFbrHQuXE453Z1D93X1c",
    });
    return token;
  } catch (error) {
    console.log(error);
    notify(
      "error",
      t("error_registering_notifications"),
      t("verify_notification_permissions"),
      3000,
    );
  }
};

// Escuchar notificaciones en foreground
export function set_on_message_payload(payload: (payl: any) => void) {
  onMessage(messaging, payload);
}

//firebase

navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then(async (registration) => {
    console.log("✅ Service Worker registrado:", registration);

    // Esperar a que el Service Worker esté listo antes de obtener el token
    return navigator.serviceWorker.ready;
  })
  .then(async (registration) => {
    const token = await getToken(messaging, {
      vapidKey:
        "BCBZKNKL8JVeOqWGsWtSRKi2CIzxwbLmkx008q7dY7JcVcMIfRYCuBkpkqh8gBZJM_ibFbrHQuXE453Z1D93X1c",
      serviceWorkerRegistration: registration,
    });
    console.log("✅ Token FCM:", token);
  })
  .catch((error) => {
    console.error("❌ Error en el Service Worker:", error);
  });
