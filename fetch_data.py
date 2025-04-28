
import requests
import json
import os

# List of manufacturers to fetch data for (lowercase, spaces replaced with hyphens if needed)
manufacturers = [
    "huawei", "xiaomi", "oneplus", "samsung", "meizu", "asus", "wiko", 
    "lenovo", "oppo", "vivo", "realme", "blackview", "tecno", "sony", 
    "unihertz", "motorola", "nokia", "htc", "google", "aosp"
]

api_base_url = "https://dontkillmyapp.com/api/v2/"
data_dir = "/home/ubuntu/dontkillmyapp_library/data"
output_file = os.path.join(data_dir, "dontkillmyapp_data.json")

all_data = {}

print(f"Fetching data for {len(manufacturers)} manufacturers...")

for manufacturer in manufacturers:
    api_url = f"{api_base_url}{manufacturer}.json"
    print(f"Fetching: {api_url}")
    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        # Check if the response content type is JSON
        if 'application/json' in response.headers.get('Content-Type', ''):
            data = response.json()
            print(f"Successfully fetched data for {manufacturer}")
            # Store relevant data (adjust based on actual API response structure if needed)
            all_data[manufacturer] = {
                "name": data.get("name", manufacturer.capitalize()),
                "manufacturer_raw": data.get("manufacturer", [manufacturer]),
                "url": data.get("url"),
                "award": data.get("award"),
                "position": data.get("position"),
                "explanation": data.get("explanation"),
                "user_solution": data.get("user_solution"),
                "developer_solution": data.get("developer_solution")
            }
        else:
            # Handle cases where the response is not JSON (e.g., 404 page is HTML)
            print(f"Skipping {manufacturer}: Received non-JSON response (Status: {response.status_code})")
            # Optionally, check for specific status codes like 404
            if response.status_code == 404:
                print(f"  -> Manufacturer '{manufacturer}' not found in API.")
            else:
                print(f"  -> Content-Type: {response.headers.get('Content-Type')}")

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for {manufacturer}: {e}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON for {manufacturer}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred for {manufacturer}: {e}")

print(f"\nFetched data for {len(all_data)} manufacturers.")

# Save all collected data to a single JSON file
try:
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=4)
    print(f"Successfully saved data to {output_file}")
except IOError as e:
    print(f"Error writing data to file {output_file}: {e}")
except Exception as e:
    print(f"An unexpected error occurred while saving data: {e}")


