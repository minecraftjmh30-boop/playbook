document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector('.upload-button')


    button.addEventListener("submit", uploadSchedule)


    function uploadSchedule(){

        //month date year of days free
        let scheduleDataFree = document.querySelector('.free');

        //month date year of days busy
        let scheduleDataBusy = document.querySelector('.busy');

        if (!scheduleDataFree || !scheduleDataBusy) {
            console.error('Schedule data elements not found');
        }

        //get userID

        //upload free days under userID

        //upload busy days under userID

}

})