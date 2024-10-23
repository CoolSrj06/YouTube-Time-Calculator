const video = document.querySelector('video');

let watchedTime;
let playbackRate;
let videoDuration;
function videoDetail() {
    if (video) {
        watchedTime = Math.floor(video.currentTime);
        playbackRate = video.playbackRate;
        videoDuration = video.duration;    
    }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'pauseAndGetTime') {
        videoDetail();
        sendResponse({ 
            watchedTime,
            playbackRate,
            videoDuration
        });
    }
});