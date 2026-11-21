    // Find the HTML elements
    const dateInput = document.getElementById("scheduleDate");
    const courtSelection = document.getElementById("courtSelection");
    const dateMessage = document.getElementById("dateMessage");
    const courtInput = document.getElementById("court");
    const timeSelection = document.getElementById("timeSelection");
    const bookingTime = document.getElementById("bookingTime");
    const durationSelection = document.getElementById("durationSelection");
    const bookingDuration = document.getElementById("bookingDuration");
    const submitReserve = document.getElementById("submitReserve");
    const bookingSummary = document.getElementById("bookingSummary");
    const summaryStart = document.getElementById("summaryStart");
    const summaryDuration = document.getElementById("summaryDuration");
    const summaryEnd = document.getElementById("summaryEnd");
    const summaryPrice = document.getElementById("summaryPrice");

    // Set today as the earliest selectable date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${year}-${month}-${day}`;

    // Show or hide the court selection
    function updateCourtVisibility() {
        if (dateInput.value !== "") {
        courtSelection.style.display = "block";
        dateMessage.style.display = "none";
        } else {
        courtSelection.style.display = "none";
        dateMessage.style.display = "block";
        courtInput.value = "";
        bookingTime.value = "";
        timeSelection.style.display = "none";
        }
    }

    // Show time choices after selecting a court
    function updateTimeVisibility(){
        if (courtInput.value !== "") {
        timeSelection.style.display = "block";
        } else {
        timeSelection.style.display = "none";
        bookingTime.value = "";
        bookingDuration.value = "";
        durationSelection.style.display = "none";
        }
    }

    // Show duration after selecting a time
    function updateDurationVisibility() {
        if (bookingTime.value !== "") {
        durationSelection.style.display = "block";
        } else {
        durationSelection.style.display = "none";
        bookingDuration.value = "";
        }
    }

    function calculateBookingDetails() {
        if (bookingTime.value !== "" && bookingDuration.value !== "") {
            const startTime = bookingTime.value;
            const duration = Number(bookingDuration.value);
            const timeParts = startTime.split(":");
            let hours = Number(timeParts[0]);
            let minutes = Number(timeParts[1]);

            // Calculate ending time
            hours = hours + duration;

            const endTime = new Date();
            endTime.setHours(hours, minutes);

            // Calculate price
            const hourlyRate = 200;
            const totalPrice = duration * hourlyRate;

            // Display booking details
            summaryStart.textContent = formatTime(startTime);
            summaryDuration.textContent = duration + " hour(s)";
            summaryEnd.textContent = endTime.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
            });
            summaryPrice.textContent = "\u20B1" + totalPrice.toFixed(2);
            bookingSummary.style.display = "block";

        } else {
        bookingSummary.style.display = "none";
        }
    }

        // Convert 24-hour time into AM/PM format
        function formatTime(time) {
        const parts = time.split(":");
        const date = new Date();
        date.setHours(Number(parts[0]), Number(parts[1]))
        return date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
        });
        }
    function submitReservation(){
        if (dateInput.value !== "") {
            console.log("Need to select schedule your reservation first!!!");
            } else {
            console.log("Proceed to checkout and confirm your reservation.");
            }
    }

    // Run when the page opens
    updateCourtVisibility();
    updateTimeVisibility();
    updateDurationVisibility();
    submitReservation();

    // Listen for changes
    dateInput.addEventListener("change", updateCourtVisibility);
    courtInput.addEventListener("change", updateTimeVisibility);
    bookingTime.addEventListener("change", updateDurationVisibility);
    bookingTime.addEventListener("change", calculateBookingDetails);
    bookingDuration.addEventListener("change", calculateBookingDetails);
    submitReserve.addEventListener("click", submitReservation);