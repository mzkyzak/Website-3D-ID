import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Firebase Auth Error:", error.code, error.message);
    let msg = "Gagal login dengan Google.";
    
    switch (error.code) {
      case 'auth/configuration-not-found':
        msg = "Firebase Auth belum dikonfigurasi. Buka Firebase Console > Authentication > Sign-in method > aktifkan Google Sign-In, lalu pastikan domain 'localhost' ada di Authorized Domains.";
        break;
      case 'auth/operation-not-allowed':
        msg = "Google Sign-In belum diaktifkan! Buka Firebase Console > Authentication > Sign-in method > Aktifkan Google.";
        break;
      case 'auth/popup-closed-by-user':
        msg = "Popup login ditutup. Silakan coba lagi.";
        break;
      case 'auth/unauthorized-domain': {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        msg = `Domain '${host}' belum diizinkan. Buka Firebase Console (proyek mzkyzakchat) > Authentication > tab Settings > bagian Authorized domains > Add domain > "${host}". BUKAN di "Safelist client IDs" pada Google Sign-In.`;
        break;
      }
      case 'auth/popup-blocked':
        msg = "Popup diblokir oleh browser. Izinkan popup untuk situs ini.";
        break;
      case 'auth/internal-error':
        msg = "Kesalahan internal Firebase. Pastikan Google Sign-In sudah diaktifkan di Firebase Console.";
        break;
      default:
        if (error.message) msg = `Login gagal: ${error.message}`;
    }
    
    const enhanced = new Error(msg);
    enhanced.code = error.code;
    throw enhanced;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
