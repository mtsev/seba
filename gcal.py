import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def get_service():
    """
    Creates and returns a Google Calendar API service object.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)
    return service

def upcoming_events(num=10):
    """
    Returns a list of upcoming events.
    """
    service = get_service()
    event_list = []

    # Call the Calendar API
    now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
    print(f'Getting the upcoming {num} events')
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                        maxResults=num, singleEvents=True,
                                        orderBy='startTime').execute()
    events = events_result.get('items', [])

    if not events:
        event_list.append('No upcoming events found.')

    for event in events:
        date_str = event['start'].get('dateTime', event['start'].get('date'))
        start = datetime.datetime.strptime(date_str[:-6], '%Y-%m-%dT%H:%M:%S')
        event_list.append(f'{start.strftime("%a %d %b, %H:%M")} - {event["summary"]}')

    return event_list

