import tweepy
from tweepy import OAuthHandler
 
consumer_key = 'suzY9DeNS6c3WEU0sZsiP4HUW'
consumer_secret = 'z62W1Juwd1Zi6zmTTD5GA8rFdidyPKUGqIQROm2xmKUz4tFVGf'
access_token = '731575416327114753-YTzWQEHxxkDqquhf5mjl0lzQu97mbBA'
access_secret = 'aE3WwqvZDSRVq06Pen0kcJcJTyuYDBiCOJEokEzxyQc7H'
 
auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_secret)
 
api = tweepy.API(auth)

from tweepy import Stream
from tweepy.streaming import StreamListener
 
class MyListener(StreamListener):
 
    def on_data(self, data):
        try:
            with open('python.json', 'a') as f:
                f.write(data)
                return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True
 
    def on_error(self, status):
        print(status)
        return True
 
twitter_stream = Stream(auth, MyListener())
twitter_stream.filter(track=['#habit' , '#smoking'])
