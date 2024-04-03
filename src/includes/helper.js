export default {
    formatTime(timeInSeconds) {
        const mins = Math.floor(timeInSeconds / 60) || 0
        const sec = Math.round(timeInSeconds - mins * 60) || 0
        return `${mins}:${sec < 10 ? '0' : ''}${sec}`
    }
}