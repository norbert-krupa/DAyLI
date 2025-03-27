import unittest
import requests
import os
from datetime import datetime, timedelta, timezone

API_BASE_URL = os.getenv("API_BASE_URL", "https://mycalendarapp-backend.onrender.com")
USER_ID = os.getenv("TEST_USER_ID", "6adec525-d93c-4bb6-9571-fb206549b9f2")
UNAUTHORIZED_USER_ID = os.getenv("UNAUTHORIZED_USER_ID", "c12fbf09-86de-4011-a0d2-8ca0fb5ead61")
PERMANENT_EVENT_ID = os.getenv("PERMANENT_EVENT_ID", "0d285ce6-f3ac-44e7-b5af-d38cfe1290e6")
PERMANENT_GROUP_ID = os.getenv("PERMANENT_GROUP_ID", "f4a19505-76c1-4942-aaef-baf771c9591b")
NOT_FOUND_UUID = "00000000-0000-0000-0000-000000000000"

class APITests(unittest.TestCase):

    def setUp(self):
        now = datetime.now(timezone.utc)
        self.valid_event = {
            "owner": USER_ID,
            "title": "test5",
            "start": (now + timedelta(hours=1)).isoformat().replace("+00:00", "Z"),
            "end": (now + timedelta(hours=2)).isoformat().replace("+00:00", "Z"),
            "description": "this is test5",
            "group": None
        }

        self.valid_group = {
            "owner": USER_ID,
            "name": "test group 4",
            "description": "this is test group 4",
            "group_color": "#bd10e0"
        }

        self.added_event_ids = []
        self.added_group_ids = []


    def tearDown(self):
        for event_id in self.added_event_ids:
            url = f"{API_BASE_URL}/tasksevents/{event_id}/?owner={USER_ID}"
            response = requests.delete(url)
            self.assertEqual(response.status_code, 204, "Expected 204 No Content")

        for group_id in self.added_group_ids:
            url = f"{API_BASE_URL}/taskeventgroups/{group_id}/?owner={USER_ID}"
            response = requests.delete(url)
            self.assertEqual(response.status_code, 204, "Expected 204 No Content")



    def test_read_all_events(self):
        """Test reading all events"""

        url = f"{API_BASE_URL}/tasksevents/?owner={USER_ID}"
        response = requests.get(url)

        self.assertEqual(response.status_code, 200, "Expected 200 OK")

        data = response.json()
        self.assertIsInstance(data, list, "Expected response to be a list")

        for event in data:
            self.assertIn("id", event)
            self.assertIn("title", event)
            self.assertIn("owner", event)
            self.assertIn("start", event)
            self.assertIn("end", event)
            self.assertIn("description", event)
            self.assertIn("group", event)
            self.assertEqual(event["owner"], USER_ID, "Event owner mismatch")



    def test_read_event(self):
        """Test reading a specific event"""

        url = f"{API_BASE_URL}/tasksevents/{PERMANENT_EVENT_ID}/?owner={USER_ID}"
        response = requests.get(url)

        self.assertEqual(response.status_code, 200, "Expected 200 OK")

        data = response.json()

        self.assertIsInstance(data, dict, "Expected response to be a dictionary")

        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("owner", data)
        self.assertIn("start", data)
        self.assertIn("end", data)
        self.assertIn("description", data)
        self.assertIn("group", data)
        self.assertEqual(data["owner"], USER_ID, "Event owner mismatch")



    def test_read_event_no_owner(self):
        """Test reading an event without specifying an owner"""

        url = f"{API_BASE_URL}/tasksevents/{PERMANENT_EVENT_ID}/"
        response = requests.get(url)
        data = response.json()

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")

    

    def test_read_event_unauthorized(self):
        """Test reading an event with an unauthorized user"""

        url = f"{API_BASE_URL}/tasksevents/{PERMANENT_EVENT_ID}/?owner={UNAUTHORIZED_USER_ID}"
        response = requests.get(url)
        data = response.json()

        self.assertEqual(response.status_code, 401, "Expected 401 Unauthorized")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Unauthorized", "Unexpected error message")

    

    def test_read_event_not_found(self):
        """Test reading an event that does not exist"""

        url = f"{API_BASE_URL}/tasksevents/{NOT_FOUND_UUID}/?owner={USER_ID}"
        response = requests.get(url)
        data = response.json()

        self.assertEqual(response.status_code, 404, "Expected 404 Not Found")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "TaskEvent not found", "Unexpected error message")

    

    def test_create_event(self):
        """Test creating an event"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            self.added_event_ids.append(data["id"])
        except KeyError:
            print("Event ID not found in response")

        self.assertEqual(response.status_code, 201, "Expected 201 Created")
        self.assertIsInstance(data, dict, "Expected response to be a dictionary")
        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("owner", data)
        self.assertIn("start", data)
        self.assertIn("end", data)
        self.assertIn("description", data)
        self.assertIn("group", data)
        self.assertEqual(data["owner"], USER_ID, "Event owner mismatch")


    
    def test_create_event_no_owner(self):
        """Test creating an event without specifying an owner"""

        event = self.valid_event.copy()
        event.pop("owner")

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=event)
        data = response.json()

        try:
            self.added_event_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")

    
    def test_create_event_no_title(self):
        """Test creating an event without a title"""

        event = self.valid_event.copy()
        event.pop("title")

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=event)
        data = response.json()

        try:
            self.added_event_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("title", data, "Expected 'title' field in response")
        self.assertIsInstance(data["title"], list, "'title' field should be a list")
        self.assertIn("This field is required.", data["title"], "Expected required field error message")

    

    def test_create_event_no_start(self):
        """Test creating an event without a start time"""

        event = self.valid_event.copy()
        event.pop("start")

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=event)
        data = response.json()

        try:
            self.added_event_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("start", data, "Expected 'start' field in response")
        self.assertIsInstance(data["start"], list, "'start' field should be a list")
        self.assertIn("This field is required.", data["start"], "Expected required field error message")

    

    def test_create_event_no_end(self):
        """Test creating an event without an end time"""

        event = self.valid_event.copy()
        event.pop("end")

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=event)
        data = response.json()

        try:
            self.added_event_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("end", data, "Expected 'end' field in response")
        self.assertIsInstance(data["end"], list, "'end' field should be a list")
        self.assertIn("This field is required.", data["end"], "Expected required field error message")

    

    def test_update_event(self):
        """Test updating an event"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            event_id = data["id"]
            self.added_event_ids.append(event_id)
        except KeyError:
            print("Event ID not found in response")

        event = self.valid_event.copy()
        event.pop("owner")
        event["title"] = "test5 updated"
        event["description"] = "this is test5 updated"
        event["start"] = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat().replace("+00:00", "Z")
        event["end"] = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat().replace("+00:00", "Z")

        url = f"{API_BASE_URL}/tasksevents/{event_id}/?owner={USER_ID}"
        response = requests.put(url, json=event)
        data = response.json()

        self.assertEqual(response.status_code, 200, "Expected 200 OK")
        self.assertIsInstance(data, dict, "Expected response to be a dictionary")
        self.assertIn("id", data)
        self.assertIn("title", data)
        self.assertIn("owner", data)
        self.assertIn("start", data)
        self.assertIn("end", data)
        self.assertIn("description", data)
        self.assertIn("group", data)
        self.assertEqual(data["owner"], USER_ID, "Event owner mismatch")
        self.assertEqual(data["title"], "test5 updated", "Unexpected event title")
        self.assertEqual(data["description"], "this is test5 updated", "Unexpected event description")
        self.assertEqual(data["start"], event["start"], "Unexpected event start time")
        self.assertEqual(data["end"], event["end"], "Unexpected event end time")

    

    def test_update_event_no_owner(self):
        """Test updating an event without specifying an owner"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            event_id = data["id"]
            self.added_event_ids.append(event_id)
        except KeyError:
            print("Event ID not found in response")

        event = self.valid_event.copy()
        event.pop("owner")
        event["title"] = "test5 updated"
        event["description"] = "this is test5 updated"
        event["start"] = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat().replace("+00:00", "Z")
        event["end"] = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat().replace("+00:00", "Z")

        url = f"{API_BASE_URL}/tasksevents/{event_id}/"
        response = requests.put(url, json=event)
        data = response.json()

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")



    def test_update_event_unauthorized(self):
        """Test updating an event with an unauthorized user"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            event_id = data["id"]
            self.added_event_ids.append(event_id)
        except KeyError:
            print("Event ID not found in response")

        event = self.valid_event.copy()
        event.pop("owner")
        event["title"] = "test5 updated"
        event["description"] = "this is test5 updated"
        event["start"] = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat().replace("+00:00", "Z")
        event["end"] = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat().replace("+00:00", "Z")

        url = f"{API_BASE_URL}/tasksevents/{event_id}/?owner={UNAUTHORIZED_USER_ID}"
        response = requests.put(url, json=event)
        data = response.json()

        self.assertEqual(response.status_code, 401, "Expected 401 Unauthorized")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Unauthorized", "Unexpected error message")


    def test_update_event_not_found(self):
        """Test updating an event that does not exist"""

        event = self.valid_event.copy()
        event["title"] = "test5 updated"
        event["description"] = "this is test5 updated"
        event["start"] = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat().replace("+00:00", "Z")
        event["end"] = (datetime.now(timezone.utc) + timedelta(hours=3)).isoformat().replace("+00:00", "Z")

        url = f"{API_BASE_URL}/tasksevents/{NOT_FOUND_UUID}/?owner={USER_ID}"
        response = requests.put(url, json=event)
        data = response.json()

        self.assertEqual(response.status_code, 404, "Expected 404 Not Found")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "TaskEvent not found", "Unexpected error message")


    def test_delete_event(self):
        """Test deleting an event"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            event_id = data["id"]
            self.added_event_ids.append(event_id)
        except KeyError:
            print("Event ID not found in response")
        
        url = f"{API_BASE_URL}/tasksevents/{event_id}/?owner={USER_ID}"
        response = requests.delete(url)
        self.assertEqual(response.status_code, 204, "Expected 204 No Content")
        
        try:
            self.added_event_ids.remove(event_id)
        except ValueError:
            print("Event ID not found in added_event_ids")

    

    def test_delete_event_no_owner(self):
        """Test deleting an event without specifying an owner"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            event_id = data["id"]
            self.added_event_ids.append(event_id)
        except KeyError:
            print("Event ID not found in response")
        
        url = f"{API_BASE_URL}/tasksevents/{event_id}/"
        response = requests.delete(url)
        data = response.json()

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")


    
    def test_delete_event_unauthorized(self):
        """Test deleting an event with an unauthorized user"""

        url = f"{API_BASE_URL}/tasksevents/"
        response = requests.post(url, json=self.valid_event)
        data = response.json()

        try:
            event_id = data["id"]
            self.added_event_ids.append(event_id)
        except KeyError:
            print("Event ID not found in response")
        
        url = f"{API_BASE_URL}/tasksevents/{event_id}/?owner={UNAUTHORIZED_USER_ID}"
        response = requests.delete(url)
        data = response.json()

        self.assertEqual(response.status_code, 401, "Expected 401 Unauthorized")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Unauthorized", "Unexpected error message")


    
    def test_delete_event_not_found(self):
        """Test deleting an event that does not exist"""

        url = f"{API_BASE_URL}/tasksevents/{NOT_FOUND_UUID}/?owner={USER_ID}"
        response = requests.delete(url)
        data = response.json()

        self.assertEqual(response.status_code, 404, "Expected 404 Not Found")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "TaskEvent not found", "Unexpected error message")
        


    def test_read_all_groups(self):
        """Test reading all groups"""

        url = f"{API_BASE_URL}/taskeventgroups/?owner={USER_ID}"
        response = requests.get(url)

        self.assertEqual(response.status_code, 200, "Expected 200 OK")

        data = response.json()
        self.assertIsInstance(data, list, "Expected response to be a list")

        for group in data:
            self.assertIn("id", group)
            self.assertIn("name", group)
            self.assertIn("owner", group)
            self.assertIn("description", group)
            self.assertIn("group_color", group)
            self.assertEqual(group["owner"], USER_ID, "Group owner mismatch")

    

    def test_read_group(self):
        """Test reading a specific group"""

        url = f"{API_BASE_URL}/taskeventgroups/{PERMANENT_GROUP_ID}/?owner={USER_ID}"
        response = requests.get(url)

        self.assertEqual(response.status_code, 200, "Expected 200 OK")

        data = response.json()

        self.assertIsInstance(data, dict, "Expected response to be a dictionary")

        self.assertIn("id", data)
        self.assertIn("name", data)
        self.assertIn("owner", data)
        self.assertIn("description", data)
        self.assertIn("group_color", data)
        self.assertEqual(data["owner"], USER_ID, "Group owner mismatch")



    def test_read_group_no_owner(self):
        """Test reading a group without specifying an owner"""

        url = f"{API_BASE_URL}/taskeventgroups/{PERMANENT_GROUP_ID}/"
        response = requests.get(url)
        data = response.json()

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")

    

    def test_read_group_unauthorized(self):
        """Test reading a group with an unauthorized user"""

        url = f"{API_BASE_URL}/taskeventgroups/{PERMANENT_GROUP_ID}/?owner={UNAUTHORIZED_USER_ID}"
        response = requests.get(url)
        data = response.json()

        self.assertEqual(response.status_code, 401, "Expected 401 Unauthorized")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Unauthorized", "Unexpected error message")



    def test_read_group_not_found(self):
        """Test reading a group that does not exist"""

        url = f"{API_BASE_URL}/taskeventgroups/{NOT_FOUND_UUID}/?owner={USER_ID}"
        response = requests.get(url)
        data = response.json()

        self.assertEqual(response.status_code, 404, "Expected 404 Not Found")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "TaskEventGroup not found", "Unexpected error message")



    def test_create_group(self):
        """Test creating a group"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            self.added_group_ids.append(data["id"])
        except KeyError:
            print("Group ID not found in response")

        self.assertEqual(response.status_code, 201, "Expected 201 Created")
        self.assertIsInstance(data, dict, "Expected response to be a dictionary")
        self.assertIn("id", data)
        self.assertIn("name", data)
        self.assertIn("owner", data)
        self.assertIn("description", data)
        self.assertIn("group_color", data)
        self.assertEqual(data["owner"], USER_ID, "Group owner mismatch")



    def test_create_group_no_owner(self):
        """Test creating a group without specifying an owner"""

        group = self.valid_group.copy()
        group.pop("owner")

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=group)
        data = response.json()

        try:
            self.added_group_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")

    

    def test_create_group_no_name(self):
        """Test creating a group without a name"""

        group = self.valid_group.copy()
        group.pop("name")

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=group)
        data = response.json()

        try:
            self.added_group_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("name", data, "Expected 'name' field in response")
        self.assertIsInstance(data["name"], list, "'name' field should be a list")
        self.assertIn("This field is required.", data["name"], "Expected required field error message")

    

    def test_create_group_no_color(self):
        """Test creating a group without a color"""

        group = self.valid_group.copy()
        group.pop("group_color")

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=group)
        data = response.json()

        try:
            self.added_group_ids.append(data["id"])
        except KeyError:
            pass

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("group_color", data, "Expected 'group_color' field in response")
        self.assertIsInstance(data["group_color"], list, "'group_color' field should be a list")
        self.assertIn("This field is required.", data["group_color"], "Expected required field error message")


    
    def test_update_group(self):
        """Test updating a group"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            group_id = data["id"]
            self.added_group_ids.append(group_id)
        except KeyError:
            print("Group ID not found in response")

        group = self.valid_group.copy()
        group.pop("owner")
        group["name"] = "test group 4 updated"
        group["description"] = "this is test group 4 updated"
        group["group_color"] = "#50e3c2"

        url = f"{API_BASE_URL}/taskeventgroups/{group_id}/?owner={USER_ID}"
        response = requests.put(url, json=group)
        data = response.json()

        self.assertEqual(response.status_code, 200, "Expected 200 OK")
        self.assertIsInstance(data, dict, "Expected response to be a dictionary")
        self.assertIn("id", data)
        self.assertIn("name", data)
        self.assertIn("owner", data)
        self.assertIn("description", data)
        self.assertIn("group_color", data)
        self.assertEqual(data["owner"], USER_ID, "Group owner mismatch")
        self.assertEqual(data["name"], "test group 4 updated", "Unexpected group name")
        self.assertEqual(data["description"], "this is test group 4 updated", "Unexpected group description")
        self.assertEqual(data["group_color"], "#50e3c2", "Unexpected group color")

    

    def test_update_group_no_owner(self):
        """Test updating a group without specifying an owner"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            group_id = data["id"]
            self.added_group_ids.append(group_id)
        except KeyError:
            print("Group ID not found in response")

        group = self.valid_group.copy()
        group.pop("owner")
        group["name"] = "test group 4 updated"
        group["description"] = "this is test group 4 updated"
        group["group_color"] = "#50e3c2"

        url = f"{API_BASE_URL}/taskeventgroups/{group_id}/"
        response = requests.put(url, json=group)
        data = response.json()

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")

    

    def test_update_group_unauthorized(self):
        """Test updating a group with an unauthorized user"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            group_id = data["id"]
            self.added_group_ids.append(group_id)
        except KeyError:
            print("Group ID not found in response")

        group = self.valid_group.copy()
        group.pop("owner")
        group["name"] = "test group 4 updated"
        group["description"] = "this is test group 4 updated"
        group["group_color"] = "#50e3c2"

        url = f"{API_BASE_URL}/taskeventgroups/{group_id}/?owner={UNAUTHORIZED_USER_ID}"
        response = requests.put(url, json=group)
        data = response.json()

        self.assertEqual(response.status_code, 401, "Expected 401 Unauthorized")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Unauthorized", "Unexpected error message")

    

    def test_update_group_not_found(self):
        """Test updating a group that does not exist"""

        group = self.valid_group.copy()
        group["name"] = "test group 4 updated"
        group["description"] = "this is test group 4 updated"
        group["group_color"] = "#50e3c2"

        url = f"{API_BASE_URL}/taskeventgroups/{NOT_FOUND_UUID}/?owner={USER_ID}"
        response = requests.put(url, json=group)
        data = response.json()

        self.assertEqual(response.status_code, 404, "Expected 404 Not Found")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "TaskEventGroup not found", "Unexpected error message")

    

    def test_delete_group(self):
        """Test deleting a group"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            group_id = data["id"]
            self.added_group_ids.append(group_id)
        except KeyError:
            print("Group ID not found in response")
        
        url = f"{API_BASE_URL}/taskeventgroups/{group_id}/?owner={USER_ID}"
        response = requests.delete(url)
        self.assertEqual(response.status_code, 204, "Expected 204 No Content")
        
        try:
            self.added_group_ids.remove(group_id)
        except ValueError:
            print("Group ID not found in added_group_ids")

    

    def test_delete_group_no_owner(self):
        """Test deleting a group without specifying an owner"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            group_id = data["id"]
            self.added_group_ids.append(group_id)
        except KeyError:
            print("Group ID not found in response")
        
        url = f"{API_BASE_URL}/taskeventgroups/{group_id}/"
        response = requests.delete(url)
        data = response.json()

        self.assertEqual(response.status_code, 400, "Expected 400 Bad Request")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Owner is required", "Unexpected error message")

    

    def test_delete_group_unauthorized(self):
        """Test deleting a group with an unauthorized user"""

        url = f"{API_BASE_URL}/taskeventgroups/"
        response = requests.post(url, json=self.valid_group)
        data = response.json()

        try:
            group_id = data["id"]
            self.added_group_ids.append(group_id)
        except KeyError:
            print("Group ID not found in response")
        
        url = f"{API_BASE_URL}/taskeventgroups/{group_id}/?owner={UNAUTHORIZED_USER_ID}"
        response = requests.delete(url)
        data = response.json()

        self.assertEqual(response.status_code, 401, "Expected 401 Unauthorized")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "Unauthorized", "Unexpected error message")

    

    def test_delete_group_not_found(self):
        """Test deleting a group that does not exist"""

        url = f"{API_BASE_URL}/taskeventgroups/{NOT_FOUND_UUID}/?owner={USER_ID}"
        response = requests.delete(url)
        data = response.json()

        self.assertEqual(response.status_code, 404, "Expected 404 Not Found")
        self.assertIn("error", data, "Response should contain an 'error' field")
        self.assertEqual(data["error"], "TaskEventGroup not found", "Unexpected error message")


if __name__ == "__main__":
    unittest.main()