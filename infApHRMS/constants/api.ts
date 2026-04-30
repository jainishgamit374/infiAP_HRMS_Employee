import { Platform } from 'react-native';
import Constants from 'expo-constants';

const resolveDevHost = () => {
	const hostUri =
		Constants.expoConfig?.hostUri ||
		(Constants as any).manifest2?.extra?.expoClient?.hostUri ||
		(Constants as any).manifest?.debuggerHost;

	if (!hostUri) {
		return null;
	}

	return hostUri.split(':')[0];
};

const DEFAULT_API_BASE_URL = Platform.select({
	android: 'http://10.0.2.2:3000/api/v1',
	ios: 'http://localhost:3000/api/v1',
	default: 'http://localhost:3000/api/v1',
});

const devHost = resolveDevHost();
const DEV_HOST_API_BASE_URL = devHost ? `http://${devHost}:3000/api/v1` : null;

export const API_BASE_URL =
	process.env.EXPO_PUBLIC_API_BASE_URL || DEV_HOST_API_BASE_URL || DEFAULT_API_BASE_URL;

export const ADMIN_API_URL = API_BASE_URL;
