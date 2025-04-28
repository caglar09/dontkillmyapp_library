import React, { useState, useEffect } from "react";
import {
	Modal,
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { getCurrentDeviceInstructions } from "../utils/instructions";
import { DeviceData } from "../data/deviceData";

interface InstructionModalProps {
	/**
	 * Whether the modal is visible
	 */
	visible: boolean;

	/**
	 * Callback when the modal is closed
	 */
	onClose: () => void;

	/**
	 * Optional title for the modal
	 * @default "Keep App Running in Background"
	 */
	title?: string;

	/**
	 * Optional text for the close button
	 * @default "Got it"
	 */
	closeButtonText?: string;

	/**
	 * Optional custom styles for the modal container
	 */
	containerStyle?: object;

	/**
	 * Optional custom styles for the modal content
	 */
	contentStyle?: object;

	/**
	 * Optional custom styles for the title
	 */
	titleStyle?: object;

	/**
	 * Optional custom styles for the close button
	 */
	buttonStyle?: object;

	/**
	 * Optional custom styles for the button text
	 */
	buttonTextStyle?: object;

	/**
	 * Optional custom device data to override automatic detection
	 */
	deviceData?: DeviceData;

	/**
	 * Optional callback when no instructions are found for the device
	 */
	onNoInstructions?: () => void;
}

/**
 * A modal component that displays device-specific instructions for keeping
 * an app running in the background based on the device manufacturer.
 */
const InstructionModal = ({
	visible,
	onClose,
	title = "Keep App Running in Background",
	closeButtonText = "Got it",
	containerStyle,
	contentStyle,
	titleStyle,
	buttonStyle,
	buttonTextStyle,
	deviceData,
	onNoInstructions,
}: InstructionModalProps) => {
	const [instructions, setInstructions] = useState<DeviceData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (visible) {
			setLoading(true);

			// Use provided device data or get it automatically
			const data = deviceData || getCurrentDeviceInstructions();
			setInstructions(data);

			if (!data && onNoInstructions) {
				onNoInstructions();
			}

			setLoading(false);
		}
	}, [visible, deviceData, onNoInstructions]);

	// Don't render anything if not on Android
	if (Platform.OS !== "android") {
		return null;
	}

	// Don't render if no instructions are found and modal shouldn't be shown
	if (!loading && !instructions && !deviceData) {
		return null;
	}

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<SafeAreaView style={[styles.container, containerStyle]}>
				<View style={[styles.content, contentStyle]}>
					<Text style={[styles.title, titleStyle]}>{title}</Text>

					{loading ? (
						<Text style={styles.loadingText}>Loading instructions...</Text>
					) : instructions?.user_solution ? (
						<WebView
							originWhitelist={["*"]}
							source={{
								html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                          padding: 8px;
                          margin: 0;
                          color: #333;
                          font-size: 16px;
                          line-height: 1.5;
                        }
                        img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 8px;
                          margin: 10px 0;
                        }
                        h3, h4 {
                          margin-top: 20px;
                          margin-bottom: 10px;
                        }
                        .img-block {
                          display: flex;
                          flex-direction: column;
                          margin: 15px 0;
                        }
                        figure {
                          margin: 10px 0;
                        }
                        figcaption {
                          font-size: 14px;
                          color: #666;
                          margin-top: 5px;
                        }
                        code {
                          background-color: #f5f5f5;
                          padding: 2px 4px;
                          border-radius: 4px;
                          font-family: monospace;
                        }
                        .caution-box {
                          background-color: #fff3cd;
                          border-left: 4px solid #ffc107;
                          padding: 12px;
                          margin: 15px 0;
                          border-radius: 4px;
                        }
                      </style>
                    </head>
                    <body>
                      ${instructions.user_solution}
                    </body>
                  </html>
                `,
							}}
							style={styles.webView}
							scalesPageToFit={false}
							javaScriptEnabled={true}
							domStorageEnabled={true}
						/>
					) : (
						<Text style={styles.noInstructionsText}>
							No specific instructions found for your device. General Android
							battery optimization settings may apply.
						</Text>
					)}

					<TouchableOpacity
						style={[styles.button, buttonStyle]}
						onPress={onClose}
					>
						<Text style={[styles.buttonText, buttonTextStyle]}>
							{closeButtonText}
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	content: {
		width: "90%",
		height: "80%",
		backgroundColor: "white",
		borderRadius: 10,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
	},
	webView: {
		flex: 1,
		minWidth: "100%",
		marginVertical: 10,
	},
	loadingText: {
		flex: 1,
		textAlign: "center",
		marginTop: 20,
	},
	noInstructionsText: {
		flex: 1,
		textAlign: "center",
		marginTop: 20,
		padding: 20,
	},
	button: {
		backgroundColor: "#2196F3",
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 5,
		marginTop: 15,
		marginBottom: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});

export default InstructionModal;
