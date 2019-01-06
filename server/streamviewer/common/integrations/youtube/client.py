#!/usr/bin/python

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from ..exceptions import APIError

# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.

YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'


class YoutubeAPI(object):
    _developer_key = None
    _youtube_client = None

    def __init__(self, developer_key):
        self._developer_key = developer_key
        self._youtube_client = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
                                     developerKey=self._developer_key)

    def search_live_streams(self, search_term, max_result=50, order="viewCount", relevance_language="en"):
        """
        Search for the live streams using youtube data api
        :param search_term: If search term is provided, it would pass it to api
        :param max_result: the page size
        :param order: ordering
        :param relevance_language:
        :return:
        """
        try:
            search_response = self._youtube_client.search().list(
                q=search_term,
                part='id,snippet',
                maxResults=max_result,
                eventType="live",
                type="video",
                order=order,
                relevanceLanguage=relevance_language
            ).execute()
            videos = []
            # get the result and return data
            for search_item in search_response.get('items', []):
                video = {'id': search_item.get('id', {}).get('videoId')}
                video.update(search_item.get('snippet', {}))
                videos.append(video)
            return videos
        except HttpError as e:
            raise APIError(str(e))
