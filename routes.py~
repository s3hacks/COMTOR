# -------------imports for flask------------------------------
from flask import Flask
from flask import redirect, flash, render_template, request, session, abort
from flask_twitter_oembedder import TwitterOEmbedder
from flask_cache import Cache

app = Flask(__name__)

# for twitter 
app.config['CACHE_TYPE'] = 'simple'
app.config['TWITTER_CONSUMER_KEY'] = 'suzY9DeNS6c3WEU0sZsiP4HUW'
app.config['TWITTER_CONSUMER_SECRET'] = 'z62W1Juwd1Zi6zmTTD5GA8rFdidyPKUGqIQROm2xmKUz4tFVGf'
app.config['TWITTER_ACCESS_TOKEN'] = '731575416327114753-YTzWQEHxxkDqquhf5mjl0lzQu97mbBA'
app.config['TWITTER_TOKEN_SECRET'] = 'aE3WwqvZDSRVq06Pen0kcJcJTyuYDBiCOJEokEzxyQc7H'
cache = Cache(app)
twitter_oembedder = TwitterOEmbedder(app,cache)


# ----------------- Home Page ----------------------------------
'''
using sessions to remember whether a user is logged in or not. 
'''
@app.route('/')
@app.route('/index')
def index():
    '''
    input : This is the home page
    output: either directs to the login page or the main page
    functionality: if the user is not logged in, he will go to login page
		   else he goes to the main page
    '''
   
    return render_template('index.html') 
   



if __name__ == "__main__":
    app.run()
