import json
from pprint import pprint

tweets = []
def tweet_id():
	with open('python.json', 'r') as f:
    		line = f.readlines() # read only the first tweet/line
    		for each in line:
    			tweet = json.loads(each) # load it as Python dict
		    	tweets.append(tweet['id'])

	f.close()
	return tweets[0:-3]





