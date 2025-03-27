import unittest
import requests
import os
from datetime import datetime, timedelta, timezone

API_BASE_URL = os.getenv("API_BASE_URL", "https://mycalendarapp-backend.onrender.com")
USER_ID = os.getenv("TEST_USER_ID", "6adec525-d93c-4bb6-9571-fb206549b9f2")

class TestCreateEventAPI(unittest.TestCase):
    def setUp(self):
        self.valid_event = {
            "title": "Test Event",
            "start": (datetime.now(timezone.utc) + timedelta(days=1)).isoformat(),
            "end": (datetime.now(timezone.utc) + timedelta(days=1, hours=1)).isoformat(),
            "description": "Test event description",
            "group": None,
            "owner": USER_ID,
        }

        self.invalid_event = {
            "title": "",
            "start": "invalid-date",
            "end": "invalid-date",
        }

    def test_create_event_success(self):
        """Test successful event creation"""
        print(self.valid_event)
        response = requests.post(f"{API_BASE_URL}/tasksevents/", json=self.valid_event)
        response_data = response.json()
        self.assertEqual(response.status_code, 201)
        
        api_start = response_data["start"].replace("Z", "+00:00")
        api_end = response_data["end"].replace("Z", "+00:00")

        self.assertEqual(api_start, self.valid_event["start"])
        self.assertEqual(api_end, self.valid_event["end"])
        self.assertEqual(response_data["title"], self.valid_event["title"])

    def test_create_event_failure(self):
        """Test event creation failure with invalid data"""
        response = requests.post(f"{API_BASE_URL}/tasksevents/", json=self.invalid_event)
        response_data = response.json()
        self.assertEqual(response.status_code, 400)
        
        self.assertIn("title", response_data)
        self.assertIn("start", response_data)
        self.assertIn("end", response_data)

if __name__ == "__main__":
    unittest.main()