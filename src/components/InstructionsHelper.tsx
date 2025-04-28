import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from "react-native";
import { getDeviceManufacturer } from "../utils/deviceInfo";
import { getCurrentDeviceInstructions } from "../utils/instructions";
import { DeviceData } from "../data/deviceData";

interface InstructionsHelperProps {
	/**
	 * Function to render custom UI with the instructions data
	 */
	renderInstructions: (data: {
		deviceData: DeviceData | null;
		manufacturerName: string | null;
		hasInstructions: boolean;
	}) => React.ReactNode;

	/**
	 * Optional fallback UI to render when no instructions are found
	 */
	renderNoInstructions?: () => React.ReactNode;

	/**
	 * Optional function to render loading state
	 */
	renderLoading?: () => React.ReactNode;
}

/**
 * A component that provides device-specific instructions data to a render function
 * for complete customization of the UI
 */
const InstructionsHelper = ({
	renderInstructions,
	renderNoInstructions,
	renderLoading,
}: InstructionsHelperProps) => {
	const [loading, setLoading] = React.useState(true);
	const [deviceData, setDeviceData] = React.useState<DeviceData | null>(null);

	React.useEffect(() => {
		if (Platform.OS !== "android") {
			setLoading(false);
			return;
		}

		try {
			const data = getCurrentDeviceInstructions();
			setDeviceData(data);
		} catch (err) {
			console.error("Error getting device instructions:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	if (Platform.OS !== "android") {
		return null;
	}

	if (loading) {
		return renderLoading ? renderLoading() : null;
	}

	if (!deviceData?.user_solution && renderNoInstructions) {
		return renderNoInstructions();
	}

	return renderInstructions({
		deviceData,
		manufacturerName: deviceData?.name || null,
		hasInstructions: !!deviceData?.user_solution,
	});
};

export default InstructionsHelper;
