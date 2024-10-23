document.addEventListener('DOMContentLoaded', function() {
    const videoDurationDiv = document.getElementById('video-duration');
    const playbackSpeedDiv = document.getElementById('playback-speed');
    const videoDetailButton = document.getElementById('videoDetail');
    const error = document.getElementById('error');

    // Initially hide the video duration and playback speed
    videoDurationDiv.style.display = 'none';
    playbackSpeedDiv.style.display = 'none';
    error.style.display = 'none';

    document.getElementById('videoDetail').addEventListener('click', async () => {
        // Query the currently active tab
        videoId = await getVideoId();
        await console.log(getVideoId());
        
        console.log(videoId);
  
        if(videoId != null) {
        // Send a message to the content script 
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'pauseAndGetTime' }, (response) => {
                if (response) {
                    const currentTime = Math.floor(response.watchedTime);
                    const playbackRate = response.playbackRate;
                    const duration = response.videoDuration;

                    videoEndsAt(currentTime, duration, playbackRate);
                }
            });
        });
        }else{
            // Hide the button after clicking
            videoDetailButton.style.display = 'none';
            error.style.display = 'block';
        }
    });

    function videoEndsAt(currentTime, duration, playbackRate){
        // Reveal the video details
        videoDurationDiv.style.display = 'block';
        playbackSpeedDiv.style.display = 'block';

        // Hide the button after clicking
        videoDetailButton.style.display = 'none';
        
        // Convert duration to hours, minutes, and seconds
        var durationHours = Math.floor(duration / 3600);
        var durationMinutes = Math.floor((duration % 3600) / 60);
        var durationSeconds = Math.floor(duration % 60);

        // Display the details in hours, minutes, and seconds
        document.getElementById('vd').innerText = 
        durationHours + " Hour " + durationMinutes + " Min " + durationSeconds + " Sec";

        document.getElementById('ps').innerText = 
        playbackRate + "x";

        // Calculate remaining time (adjusted for playback rate)
        var remainingTime = (duration - currentTime) / playbackRate; // remaining duration in seconds adjusted for playback rate

        // Get current system time
        var currentTimeSystem = new Date();
    
        // Add the adjusted remaining video time (in seconds) to the current system time
        var videoEndTime = new Date(currentTimeSystem.getTime() + remainingTime * 1000);

        // Format video end time to 12-hour format
        var endHours = videoEndTime.getHours();
        var endMinutes = videoEndTime.getMinutes();
        var endSeconds = videoEndTime.getSeconds();
        var ampm = endHours >= 12 ? 'PM' : 'AM';
    
        // Convert to 12-hour format
        endHours = endHours % 12;
        endHours = endHours ? endHours : 12; // the hour '0' should be '12'
    
        // Ensure two digits for minutes and seconds
        endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes;
        endSeconds = endSeconds < 10 ? '0' + endSeconds : endSeconds;
    
        // Display the time the video will end in 12-hour format with AM/PM
        document.querySelector('.video-ends-at').innerHTML = 
        `<u>Your Video Ends At<u><br>${endHours}:${endMinutes}:${endSeconds} ${ampm}`;
    }


    function getVideoId() {
        return new Promise((resolve, reject) => {
            // Query the currently active tab
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs && tabs.length > 0) {
                    const currentTab = tabs[0];
                    const url = currentTab.url; // Get the URL of the active tab
                    
                    let videoId = convertToEmbedUrl(url); // Convert the URL to video ID
                    
                    console.log("Extracted Video ID:", videoId);
                    
                    resolve(videoId); // Resolve the Promise with videoId
                } else {
                    reject("No active tab found");
                }
            });
        });
    }
        

    function convertToEmbedUrl(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length === 11) {
          return match[2];
        } else {
          return null;
        }
      }
});