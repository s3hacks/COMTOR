# -------------imports for flask------------------------------
from flask import Flask
from flask import redirect, flash, render_template, request, session, abort, Response
from flask_twitter_oembedder import TwitterOEmbedder
from flask_cache import Cache
from camera.capture import Camera
from twitter import mine

# for playing sound
from pygame import mixer
mixer.init()
mixer.music.load('beep.mp3')

# opencv
import cv2
import numpy as np

images_positive=[]
testimages=[]

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

# test images
def test_data(trainimages,image):
    maximum=0.0
    for i in trainimages:
        error=np.sum(i*image)**2
        if(error>maximum):
            maximum=error
    return maximum


def get_imagestest(image):
    '''
    input : nothing
    functionality : uses webcamera to record video, converts to gray scale
                    appends to the list of images
    output : return the frames of the object as a numpy array
    '''    
    global images_positive      
    val=test_data(images_positive[int(len(images_positive)/2):int(len(images_positive)/2)+25],image)

    print val
    if(val>.948):
         mixer.music.play()




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

def gen(Camera):
	 global images_positive
	 count = 0
   	 while True:
        	frame = Camera.get_frame()
		if not count > 50:
			image = Camera.get_frame_image()
			image=cv2.resize(image,(100,100))
			image=np.asarray(image, dtype="float32")
            		image=image/np.sqrt(np.sum(image**2))
			images_positive.append(image)
		else:
			del Camera
			train = True
			return 

		count = count + 1
        	yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def gen1(Camera):
   	 while True:
        	frame = Camera.get_frame()
		image = Camera.get_frame_image()
		image=cv2.resize(image,(100,100))
		image=np.asarray(image, dtype="float32")
            	image=image/np.sqrt(np.sum(image**2))
		get_imagestest(image)
        	yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/train')
def train():

   '''
   input : This is the home page
   output: either directs to the login page or the main page
   functionality: if the user is not logged in, he will go to login page
		  else he goes to the main page
   '''

   train = True
    
   return Response(gen(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/test')
def test():
    train = True
    return Response(gen1(Camera()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/live')   
def live():
	train = True
	return render_template('train.html' , train = train) 
   
@app.route('/livetest')   
def live1():
	train = True
	return render_template('test.html' , train = train)


@app.route('/tweets')   
def tweets():
	tweets = mine.tweet_id()
	tweets = list(set(tweets))
	return render_template('index.html' , tweets = tweets , scroll = "work")




if __name__ == "__main__":
    app.run()
