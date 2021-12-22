import os

from django.shortcuts import redirect
from dotenv import load_dotenv
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Room
from .models import Vote
from .util import execute_spotify_api_request, is_spotify_authenticated, update_or_create_user_tokens, play_song, \
    pause_song, skip_song

load_dotenv()
REDIRECT_URI = os.environ.get('REDIRECT_URI')
CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')


class AuthURL(APIView):
    def get(self, request):
        scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scope,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url
        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(session_id=request.session.session_key,
                                 access_token=access_token, refresh_token=refresh_token, expires_in=expires_in,
                                 token_type=token_type)
    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request):
        is_authenticated = is_spotify_authenticated(session_id=self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    room = ''
    song_id = ''

    def get(self, request):
        room_code = self.request.session.get('room_code')
        self.room = Room.objects.filter(code=room_code)
        if self.room.exists():
            self.room = self.room[0]
            host = self.room.host
        else:
            return Response({}, status.HTTP_404_NOT_FOUND)
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        if 'item' not in response:
            return Response(response, status.HTTP_422_UNPROCESSABLE_ENTITY)
        # return Response(response, status.HTTP_200_OK)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        self.song_id = item.get('id')
        artist_string = ''
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ','
            name = artist.get('name')
            artist_string += name
        votes = len(Vote.objects.filter(room=self.room, song_id=self.song_id))

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': votes,
            'votes_required': self.room.votes_to_skip,
            'id': self.song_id
        }
        self.update_room_song()
        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self):
        current_song = self.room.current_song
        if current_song != self.song_id:
            self.room.current_song = self.song_id
            self.room.save(update_fields=['current_song'])
            votes = Vote.objects.filter(room=self.room).delete()


class PauseSong(APIView):
    def put(self, request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status.HTTP_204_NO_CONTENT)
        return Response({}, status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, request):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status.HTTP_204_NO_CONTENT)
        return Response({}, status.HTTP_403_FORBIDDEN)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        votes = Vote.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:
            votes.delete()
            skip_song(room.host)
        else:
            vote = Vote(user=self.request.session.session_key, room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status=status.HTTP_204_NO_CONTENT)
